from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings


class User(AbstractUser):
    """
    Custom User model for the examination system.
    Extends Django's AbstractUser with additional fields.
    """
    USER_TYPE_CHOICES = [
        ('admin', 'Administrator'),
        ('evaluator', 'Evaluator'),
        ('candidate', 'Candidate'),
        ('center_admin', 'Center Administrator'),
    ]
    
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='candidate',
        help_text=_('Type of user in the system')
    )
    
    center = models.ForeignKey(
        'Center',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users',
        help_text=_('Center this user belongs to')
    )
    
    phone_number = models.CharField(
        max_length=15,
        blank=True,
        help_text=_('User phone number')
    )
    
    is_center_admin = models.BooleanField(
        default=False,
        help_text=_('Whether this user is a center administrator')
    )
    
    last_login_ip = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text=_('IP address of last login')
    )
    
    login_attempts = models.PositiveIntegerField(
        default=0,
        help_text=_('Number of failed login attempts')
    )
    
    is_locked = models.BooleanField(
        default=False,
        help_text=_('Whether account is locked due to failed attempts')
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
    
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"
    
    def get_full_name(self):
        """Return the first_name plus the last_name, with a space in between."""
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name if full_name else self.username


class Center(models.Model):
    """
    Model representing examination centers.
    """
    # Indian States and Union Territories with their capitals
    STATE_CAPITALS = {
        'Andhra Pradesh': 'Amaravati',
        'Arunachal Pradesh': 'Itanagar',
        'Assam': 'Dispur',
        'Bihar': 'Patna',
        'Chhattisgarh': 'Raipur',
        'Goa': 'Panaji',
        'Gujarat': 'Gandhinagar',
        'Haryana': 'Chandigarh',
        'Himachal Pradesh': 'Shimla',
        'Jharkhand': 'Ranchi',
        'Karnataka': 'Bengaluru',
        'Kerala': 'Thiruvananthapuram',
        'Madhya Pradesh': 'Bhopal',
        'Maharashtra': 'Mumbai',
        'Manipur': 'Imphal',
        'Meghalaya': 'Shillong',
        'Mizoram': 'Aizawl',
        'Nagaland': 'Kohima',
        'Odisha': 'Bhubaneswar',
        'Punjab': 'Chandigarh',
        'Rajasthan': 'Jaipur',
        'Sikkim': 'Gangtok',
        'Tamil Nadu': 'Chennai',
        'Telangana': 'Hyderabad',
        'Tripura': 'Agartala',
        'Uttar Pradesh': 'Lucknow',
        'Uttarakhand': 'Dehradun',
        'West Bengal': 'Kolkata',
        'Andaman and Nicobar Islands': 'Port Blair',
        'Chandigarh': 'Chandigarh',
        'Dadra and Nagar Haveli and Daman and Diu': 'Daman',
        'Delhi': 'New Delhi',
        'Jammu and Kashmir': 'Srinagar/Jammu',
        'Ladakh': 'Leh',
        'Lakshadweep': 'Kavaratti',
        'Puducherry': 'Puducherry',
    }
    name = models.CharField(
        max_length=200,
        unique=True,
        help_text=_('Name of the examination center')
    )
    
    code = models.CharField(
        max_length=10,
        unique=True,
        help_text=_('Unique code for the center')
    )
    
    address = models.TextField(
        help_text=_('Full address of the center')
    )
    
    city = models.CharField(
        max_length=100,
        help_text=_('City where the center is located (auto-filled as state capital)'),
    )
    
    state = models.CharField(
        max_length=100,
        choices=[(s, s) for s in STATE_CAPITALS.keys()],
        help_text=_('State or Union Territory'),
    )
    
    # Removed country; India is implied
    
    contact_person = models.CharField(
        max_length=200,
        help_text=_('Name of the contact person')
    )
    
    contact_email = models.EmailField(
        help_text=_('Contact email address')
    )
    
    contact_phone = models.CharField(
        max_length=15,
        help_text=_('Contact phone number')
    )
    
    capacity = models.PositiveIntegerField(
        default=100,
        help_text=_('Maximum number of candidates the center can accommodate')
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text=_('Whether the center is active')
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Center')
        verbose_name_plural = _('Centers')
        db_table = 'centers'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.code})"

    def save(self, *args, **kwargs):
        # Auto-fill city with the state capital if not provided or mismatched
        capital = self.STATE_CAPITALS.get(self.state)
        if capital and (not self.city or self.city.strip() == ''):
            self.city = capital
        super().save(*args, **kwargs)


class UserSession(models.Model):
    """
    Model to track user sessions for security and audit purposes.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sessions'
    )
    
    session_key = models.CharField(
        max_length=40,
        unique=True,
        help_text=_('Django session key')
    )
    
    ip_address = models.GenericIPAddressField(
        help_text=_('IP address of the session')
    )
    
    user_agent = models.TextField(
        blank=True,
        help_text=_('User agent string')
    )
    
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = _('User Session')
        verbose_name_plural = _('User Sessions')
        db_table = 'user_sessions'
        ordering = ['-login_time']
    
    def __str__(self):
        return f"{self.user.username} - {self.ip_address} ({self.login_time})"


class LoginAttempt(models.Model):
    """
    Model to track login attempts for security monitoring.
    """
    username = models.CharField(max_length=150)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    success = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = _('Login Attempt')
        verbose_name_plural = _('Login Attempts')
        db_table = 'login_attempts'
        ordering = ['-timestamp']
    
    def __str__(self):
        status = "Success" if self.success else "Failed"
        return f"{self.username} - {self.ip_address} - {status} ({self.timestamp})"
