from django.db import models
from django.utils import timezone
from apps.authentication.models import User, Center

class Exam(models.Model):
    EXAM_TYPES = [
        ('written', 'Written'),
        ('practical', 'Practical'),
        ('oral', 'Oral'),
        ('physical', 'Physical'),
        ('medical', 'Medical'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    exam_type = models.CharField(max_length=20, choices=EXAM_TYPES, default='written')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Timing
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(help_text="Duration in minutes")
    
    # Location and Center
    center = models.ForeignKey(Center, on_delete=models.CASCADE, related_name='exams')
    location = models.CharField(max_length=200, blank=True)
    
    # Configuration
    max_attempts = models.PositiveIntegerField(default=1)
    passing_score = models.PositiveIntegerField(default=60)
    total_marks = models.PositiveIntegerField(default=100)
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_exams')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_date']
        verbose_name = 'Exam'
        verbose_name_plural = 'Exams'
    
    def __str__(self):
        return f"{self.title} - {self.center.name}"
    
    @property
    def is_active(self):
        now = timezone.now()
        return self.start_date <= now <= self.end_date and self.status == 'ongoing'
    
    @property
    def is_upcoming(self):
        now = timezone.now()
        return now < self.start_date and self.status == 'scheduled'
    
    @property
    def is_completed(self):
        now = timezone.now()
        return now > self.end_date or self.status == 'completed'
