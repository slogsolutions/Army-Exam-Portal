from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.authentication.models import Center
from apps.exams.models import Exam
from apps.questions.models import Question
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = "Seed demo centers, admin user, exams, and questions"

    def handle(self, *args, **options):
        User = get_user_model()

        # Upsert canonical list of centers (avoid FK issues by not hard-deleting)
        centers_data = [
            {"code": "CTR001", "name": "Delhi Center", "state": "Delhi", "address": "HQ Complex", "city": "New Delhi"},
            {"code": "CTR002", "name": "Mumbai Center", "state": "Maharashtra", "address": "South Block", "city": "Mumbai"},
            {"code": "CTR003", "name": "Bengaluru Center", "state": "Karnataka", "address": "Tech Park", "city": "Bengaluru"},
            {"code": "CTR004", "name": "Chennai Center", "state": "Tamil Nadu", "address": "Industrial Estate", "city": "Chennai"},
            {"code": "CTR005", "name": "Kolkata Center", "state": "West Bengal", "address": "Salt Lake", "city": "Kolkata"},
            {"code": "CTR006", "name": "Hyderabad Center", "state": "Telangana", "address": "Hitec City", "city": "Hyderabad"},
            {"code": "CTR007", "name": "Jaipur Center", "state": "Rajasthan", "address": "MI Road", "city": "Jaipur"},
            {"code": "CTR008", "name": "Lucknow Center", "state": "Uttar Pradesh", "address": "Hazratganj", "city": "Lucknow"},
            {"code": "CTR009", "name": "Bhopal Center", "state": "Madhya Pradesh", "address": "Arera Colony", "city": "Bhopal"},
            {"code": "CTR010", "name": "Patna Center", "state": "Bihar", "address": "Patliputra", "city": "Patna"},
            {"code": "CTR011", "name": "Guwahati Center", "state": "Assam", "address": "Dispur", "city": "Dispur"},
            {"code": "CTR012", "name": "Chandigarh Center", "state": "Chandigarh", "address": "Sector 17", "city": "Chandigarh"},
        ]
        for c in centers_data:
            Center.objects.update_or_create(
                code=c["code"],
                defaults={
                    "name": c["name"],
                    "address": c["address"],
                    "city": c["city"],
                    "state": c["state"],
                    "contact_person": "Admin",
                    "contact_email": "admin@example.com",
                    "contact_phone": "9999999999",
                    "capacity": 200,
                    "is_active": True,
                }
            )
        center = Center.objects.get(code="CTR001")

        # Users
        admin, created = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@example.com",
                "user_type": "admin",
                "center": center,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        # Always (re)set admin password to ensure known credentials
        admin.set_password("admin123")
        admin.is_active = True
        admin.is_staff = True
        admin.is_superuser = True
        admin.save()
        if created:
            self.stdout.write(self.style.SUCCESS("Created default admin (admin/admin123)"))
        else:
            self.stdout.write(self.style.SUCCESS("Updated admin password to admin123"))

        evaluator, _ = User.objects.get_or_create(
            username="evaluator",
            defaults={
                "email": "evaluator@example.com",
                "user_type": "evaluator",
                "center": center,
                "is_staff": True,
            },
        )
        evaluator.set_password("evaluator123")
        evaluator.is_active = True
        evaluator.save()

        candidate, _ = User.objects.get_or_create(
            username="candidate",
            defaults={
                "email": "candidate@example.com",
                "user_type": "candidate",
                "center": center,
            },
        )
        candidate.set_password("candidate123")
        candidate.is_active = True
        candidate.save()

        exam, _ = Exam.objects.get_or_create(
            title="General Knowledge Test",
            defaults={
                "description": "Demo GK exam",
                "exam_type": "written",
                "status": "ongoing",
                "start_date": timezone.now() - timedelta(minutes=10),
                "end_date": timezone.now() + timedelta(hours=1),
                "duration_minutes": 60,
                "center": center,
                "location": "Hall A",
                "max_attempts": 1,
                "passing_score": 60,
                "total_marks": 100,
                "created_by": admin,
            },
        )

        if not Question.objects.filter(center=center).exists():
            Question.objects.bulk_create([
                Question(center=center, created_by=admin, question_text="Capital of India?", option_a="Mumbai", option_b="Delhi", option_c="Kolkata", option_d="Chennai", correct_answer="B", marks=1),
                Question(center=center, created_by=admin, question_text="2 + 2 = ?", option_a="3", option_b="4", option_c="5", option_d="6", correct_answer="B", marks=1),
                Question(center=center, created_by=admin, question_text="Color of the sky?", option_a="Blue", option_b="Green", option_c="Red", option_d="Yellow", correct_answer="A", marks=1),
            ])
            self.stdout.write(self.style.SUCCESS("Seeded sample questions"))

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully."))


