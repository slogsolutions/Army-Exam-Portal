from django.db import models
from django.utils import timezone
from apps.authentication.models import User, Center

class Question(models.Model):
    QUESTION_TYPES = [
        ('multiple_choice', 'Multiple Choice'),
        ('true_false', 'True/False'),
        ('short_answer', 'Short Answer'),
        ('essay', 'Essay'),
        ('practical', 'Practical'),
    ]
    
    DIFFICULTY_LEVELS = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='multiple_choice')
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_LEVELS, default='medium')
    
    # Scoring
    marks = models.PositiveIntegerField(default=1)
    
    # Options for multiple choice questions
    option_a = models.CharField(max_length=500, blank=True)
    option_b = models.CharField(max_length=500, blank=True)
    option_c = models.CharField(max_length=500, blank=True)
    option_d = models.CharField(max_length=500, blank=True)
    
    # Correct answer
    correct_answer = models.CharField(max_length=500, blank=True)
    
    # Explanation
    explanation = models.TextField(blank=True)
    
    # Metadata
    center = models.ForeignKey(Center, on_delete=models.CASCADE, related_name='questions')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_questions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Question'
        verbose_name_plural = 'Questions'
    
    def __str__(self):
        return f"{self.question_text[:50]}... - {self.question_type}"
    
    def get_options(self):
        """Return list of options for multiple choice questions"""
        options = []
        if self.option_a:
            options.append(('A', self.option_a))
        if self.option_b:
            options.append(('B', self.option_b))
        if self.option_c:
            options.append(('C', self.option_c))
        if self.option_d:
            options.append(('D', self.option_d))
        return options
