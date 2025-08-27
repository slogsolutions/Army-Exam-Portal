from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import FileExtensionValidator
from django.conf import settings
import os


def candidate_photo_path(instance, filename):
    """Generate file path for candidate photos."""
    ext = filename.split('.')[-1]
    filename = f"candidate_{instance.army_no}_{instance.id}.{ext}"
    return os.path.join('candidates', 'photos', filename)


def candidate_document_path(instance, filename):
    """Generate file path for candidate documents."""
    ext = filename.split('.')[-1]
    filename = f"candidate_{instance.candidate.army_no}_{instance.document_type}_{instance.id}.{ext}"
    return os.path.join('candidates', 'documents', filename)


class Candidate(models.Model):
    """
    Model representing examination candidates.
    """
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    MARITAL_STATUS_CHOICES = [
        ('single', 'Single'),
        ('married', 'Married'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed'),
    ]
    
    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    ]
    
    # Basic Information
    army_no = models.CharField(
        max_length=20,
        unique=True,
        help_text=_('Army Service Number')
    )
    
    rank = models.CharField(
        max_length=50,
        help_text=_('Military Rank')
    )
    
    first_name = models.CharField(
        max_length=100,
        help_text=_('First Name')
    )
    
    last_name = models.CharField(
        max_length=100,
        help_text=_('Last Name')
    )
    
    middle_name = models.CharField(
        max_length=100,
        blank=True,
        help_text=_('Middle Name (Optional)')
    )
    
    date_of_birth = models.DateField(
        help_text=_('Date of Birth')
    )
    
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        help_text=_('Gender')
    )
    
    marital_status = models.CharField(
        max_length=20,
        choices=MARITAL_STATUS_CHOICES,
        default='single',
        help_text=_('Marital Status')
    )
    
    blood_group = models.CharField(
        max_length=3,
        choices=BLOOD_GROUP_CHOICES,
        blank=True,
        help_text=_('Blood Group')
    )
    
    # Contact Information
    phone_number = models.CharField(
        max_length=15,
        help_text=_('Phone Number')
    )
    
    email = models.EmailField(
        blank=True,
        help_text=_('Email Address (Optional)')
    )
    
    address = models.TextField(
        help_text=_('Residential Address')
    )
    
    city = models.CharField(
        max_length=100,
        help_text=_('City')
    )
    
    state = models.CharField(
        max_length=100,
        help_text=_('State')
    )
    
    pincode = models.CharField(
        max_length=10,
        help_text=_('PIN Code')
    )
    
    # Family Information
    father_name = models.CharField(
        max_length=200,
        help_text=_('Father\'s Name')
    )
    
    mother_name = models.CharField(
        max_length=200,
        blank=True,
        help_text=_('Mother\'s Name (Optional)')
    )
    
    spouse_name = models.CharField(
        max_length=200,
        blank=True,
        help_text=_('Spouse Name (Optional)')
    )
    
    # Service Information
    enrollment_date = models.DateField(
        help_text=_('Date of Enrollment in Army')
    )
    
    trade = models.CharField(
        max_length=100,
        help_text=_('Military Trade/Specialization')
    )
    
    unit = models.CharField(
        max_length=100,
        help_text=_('Military Unit')
    )
    
    brigade = models.CharField(
        max_length=100,
        blank=True,
        help_text=_('Brigade')
    )
    
    division = models.CharField(
        max_length=100,
        blank=True,
        help_text=_('Division')
    )
    
    corps = models.CharField(
        max_length=100,
        blank=True,
        help_text=_('Corps')
    )
    
    command = models.CharField(
        max_length=100,
        blank=True,
        help_text=_('Command')
    )
    
    # Training Information
    training_center = models.CharField(
        max_length=200,
        blank=True,
        help_text=_('Training Center')
    )
    
    qualification = models.CharField(
        max_length=200,
        blank=True,
        help_text=_('Educational Qualification')
    )
    
    level = models.CharField(
        max_length=50,
        blank=True,
        help_text=_('Skill Level')
    )
    
    nsqf_level = models.CharField(
        max_length=20,
        blank=True,
        help_text=_('NSQF Level')
    )
    
    # Examination Information
    exam_category = models.CharField(
        max_length=100,
        blank=True,
        help_text=_('Examination Category')
    )
    
    is_eligible = models.BooleanField(
        default=True,
        help_text=_('Whether candidate is eligible for examination')
    )
    
    eligibility_reason = models.TextField(
        blank=True,
        help_text=_('Reason for eligibility/ineligibility')
    )
    
    # System Information
    center = models.ForeignKey(
        'authentication.Center',
        on_delete=models.CASCADE,
        related_name='candidates',
        help_text=_('Examination center')
    )
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_candidates',
        help_text=_('User who created this candidate record')
    )
    
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_candidates',
        help_text=_('User who last updated this candidate record')
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Candidate')
        verbose_name_plural = _('Candidates')
        db_table = 'candidates'
        ordering = ['army_no']
        indexes = [
            models.Index(fields=['army_no']),
            models.Index(fields=['center']),
            models.Index(fields=['trade']),
            models.Index(fields=['unit']),
        ]
    
    def __str__(self):
        return f"{self.rank} {self.first_name} {self.last_name} ({self.army_no})"
    
    def get_full_name(self):
        """Return the full name of the candidate."""
        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"
        return f"{self.first_name} {self.last_name}"
    
    def get_age(self):
        """Calculate and return the age of the candidate."""
        from datetime import date
        today = date.today()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )
    
    def get_service_years(self):
        """Calculate and return the years of service."""
        from datetime import date
        today = date.today()
        return today.year - self.enrollment_date.year - (
            (today.month, today.day) < (self.enrollment_date.month, self.enrollment_date.day)
        )


class CandidatePhoto(models.Model):
    """
    Model for storing candidate photographs.
    """
    candidate = models.OneToOneField(
        Candidate,
        on_delete=models.CASCADE,
        related_name='photo'
    )
    
    photo = models.ImageField(
        upload_to=candidate_photo_path,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])],
        help_text=_('Candidate photograph')
    )
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='uploaded_photos'
    )
    
    class Meta:
        verbose_name = _('Candidate Photo')
        verbose_name_plural = _('Candidate Photos')
        db_table = 'candidate_photos'
    
    def __str__(self):
        return f"Photo of {self.candidate.get_full_name()}"
    
    def delete(self, *args, **kwargs):
        """Delete the photo file when the model instance is deleted."""
        if self.photo:
            if os.path.isfile(self.photo.path):
                os.remove(self.photo.path)
        super().delete(*args, **kwargs)


class CandidateDocument(models.Model):
    """
    Model for storing candidate documents.
    """
    DOCUMENT_TYPE_CHOICES = [
        ('aadhar', 'Aadhar Card'),
        ('pan', 'PAN Card'),
        ('driving_license', 'Driving License'),
        ('passport', 'Passport'),
        ('birth_certificate', 'Birth Certificate'),
        ('education_certificate', 'Education Certificate'),
        ('service_certificate', 'Service Certificate'),
        ('medical_certificate', 'Medical Certificate'),
        ('other', 'Other'),
    ]
    
    candidate = models.ForeignKey(
        Candidate,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    
    document_type = models.CharField(
        max_length=50,
        choices=DOCUMENT_TYPE_CHOICES,
        help_text=_('Type of document')
    )
    
    document = models.FileField(
        upload_to=candidate_document_path,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'])],
        help_text=_('Document file')
    )
    
    document_number = models.CharField(
        max_length=100,
        blank=True,
        help_text=_('Document number (if applicable)')
    )
    
    description = models.TextField(
        blank=True,
        help_text=_('Additional description of the document')
    )
    
    is_verified = models.BooleanField(
        default=False,
        help_text=_('Whether the document has been verified')
    )
    
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_documents'
    )
    
    verified_at = models.DateTimeField(null=True, blank=True)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='uploaded_documents'
    )
    
    class Meta:
        verbose_name = _('Candidate Document')
        verbose_name_plural = _('Candidate Documents')
        db_table = 'candidate_documents'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.get_document_type_display()} - {self.candidate.get_full_name()}"
    
    def delete(self, *args, **kwargs):
        """Delete the document file when the model instance is deleted."""
        if self.document:
            if os.path.isfile(self.document.path):
                os.remove(self.document.path)
        super().delete(*args, **kwargs)


class CandidateBulkUpload(models.Model):
    """
    Model for tracking bulk upload operations.
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    file = models.FileField(
        upload_to='candidates/bulk_uploads/',
        validators=[FileExtensionValidator(allowed_extensions=['xlsx', 'xls', 'csv'])],
        help_text=_('Bulk upload file')
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    total_records = models.PositiveIntegerField(default=0)
    successful_records = models.PositiveIntegerField(default=0)
    failed_records = models.PositiveIntegerField(default=0)
    
    error_log = models.TextField(blank=True)
    
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bulk_uploads'
    )
    
    center = models.ForeignKey(
        'authentication.Center',
        on_delete=models.CASCADE,
        related_name='bulk_uploads'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = _('Candidate Bulk Upload')
        verbose_name_plural = _('Candidate Bulk Uploads')
        db_table = 'candidate_bulk_uploads'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Bulk Upload {self.id} - {self.status}"
