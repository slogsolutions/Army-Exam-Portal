from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.authentication.models import User, Center
from apps.candidates.models import Candidate
from apps.exams.models import Exam
from apps.exam_results.models import Result

class Evaluation(models.Model):
    EVALUATION_TYPES = [
        ('written', 'Written'),
        ('practical', 'Practical'),
        ('oral', 'Oral'),
        ('physical', 'Physical'),
        ('medical', 'Medical'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('reviewed', 'Reviewed'),
    ]
    
    # Relationships
    result = models.ForeignKey(Result, on_delete=models.CASCADE, related_name='evaluations')
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='evaluations')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='evaluations')
    evaluator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='evaluations_conducted')
    center = models.ForeignKey(Center, on_delete=models.CASCADE, related_name='evaluations')
    
    # Evaluation details
    evaluation_type = models.CharField(max_length=20, choices=EVALUATION_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Scoring
    marks_awarded = models.PositiveIntegerField(null=True, blank=True)
    max_marks = models.PositiveIntegerField()
    percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Comments and feedback
    evaluator_comments = models.TextField(blank=True)
    candidate_feedback = models.TextField(blank=True)
    
    # Timing
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Evaluation'
        verbose_name_plural = 'Evaluations'
    
    def __str__(self):
        return f"{self.candidate.full_name} - {self.exam.title} - {self.evaluation_type}"
    
    @property
    def is_passed(self):
        if self.percentage is not None:
            return self.percentage >= self.exam.passing_score
        return False
    
    @property
    def duration_minutes(self):
        if self.started_at and self.completed_at:
            duration = self.completed_at - self.started_at
            return duration.total_seconds() / 60
        return None
    
    def calculate_percentage(self):
        if self.marks_awarded and self.max_marks:
            self.percentage = (self.marks_awarded / self.max_marks) * 100
            self.save()
        return self.percentage
