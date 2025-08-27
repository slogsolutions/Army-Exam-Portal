from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.authentication.models import User, Center
from apps.candidates.models import Candidate
from apps.exams.models import Exam

class Result(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('evaluated', 'Evaluated'),
        ('failed', 'Failed'),
    ]
    
    # Relationships
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='results')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='results')
    center = models.ForeignKey(Center, on_delete=models.CASCADE, related_name='results')
    
    # Scoring
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    marks_obtained = models.PositiveIntegerField(null=True, blank=True)
    total_marks = models.PositiveIntegerField()
    percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Status and timing
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    evaluated_at = models.DateTimeField(null=True, blank=True)
    
    # Attempt tracking
    attempt_number = models.PositiveIntegerField(default=1)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['candidate', 'exam', 'attempt_number']
        verbose_name = 'Result'
        verbose_name_plural = 'Results'
    
    def __str__(self):
        return f"{self.candidate.full_name} - {self.exam.title} (Attempt {self.attempt_number})"
    
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
        if self.marks_obtained and self.total_marks:
            self.percentage = (self.marks_obtained / self.total_marks) * 100
            self.save()
        return self.percentage
