from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, Center, UserSession, LoginAttempt


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model."""
    list_display = [
        'username', 'email', 'first_name', 'last_name', 'user_type',
        'center', 'is_active', 'is_center_admin', 'is_locked', 'date_joined'
    ]
    list_filter = [
        'user_type', 'center', 'is_active', 'is_center_admin',
        'is_locked', 'date_joined', 'last_login'
    ]
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone_number']
    ordering = ['username']
    list_per_page = 25
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {
            'fields': ('first_name', 'last_name', 'email', 'phone_number')
        }),
        (_('System info'), {
            'fields': ('user_type', 'center', 'is_center_admin')
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_locked', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'user_type', 'center'),
        }),
    )
    
    readonly_fields = ['date_joined', 'last_login']
    
    def get_queryset(self, request):
        """Filter users based on admin permissions."""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        elif request.user.is_center_admin and request.user.center:
            return qs.filter(center=request.user.center)
        return qs.none()


@admin.register(Center)
class CenterAdmin(admin.ModelAdmin):
    """Admin interface for Center model."""
    list_display = [
        'name', 'code', 'city', 'state', 'contact_person',
        'contact_email', 'capacity', 'is_active', 'created_at'
    ]
    list_filter = ['is_active', 'state', 'created_at']
    search_fields = ['name', 'code', 'city', 'contact_person', 'contact_email']
    ordering = ['name']
    list_per_page = 25
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('name', 'code', 'is_active')
        }),
        (_('Location'), {
            'fields': ('address', 'city', 'state')
        }),
        (_('Contact Information'), {
            'fields': ('contact_person', 'contact_email', 'contact_phone')
        }),
        (_('Capacity'), {
            'fields': ('capacity',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        """Filter centers based on admin permissions."""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        elif request.user.is_center_admin and request.user.center:
            return qs.filter(id=request.user.center.id)
        return qs.none()


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """Admin interface for UserSession model."""
    list_display = [
        'user', 'ip_address', 'login_time', 'logout_time', 'is_active'
    ]
    list_filter = ['is_active', 'login_time', 'logout_time']
    search_fields = ['user__username', 'user__email', 'ip_address']
    ordering = ['-login_time']
    list_per_page = 25
    
    fieldsets = (
        (_('Session Information'), {
            'fields': ('user', 'session_key', 'is_active')
        }),
        (_('Connection Details'), {
            'fields': ('ip_address', 'user_agent')
        }),
        (_('Timing'), {
            'fields': ('login_time', 'logout_time')
        }),
    )
    
    readonly_fields = ['user', 'session_key', 'ip_address', 'user_agent', 'login_time']
    
    def has_add_permission(self, request):
        """Disable adding sessions manually."""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Allow changing only logout_time and is_active."""
        return True
    
    def has_delete_permission(self, request, obj=None):
        """Allow deleting sessions."""
        return True


@admin.register(LoginAttempt)
class LoginAttemptAdmin(admin.ModelAdmin):
    """Admin interface for LoginAttempt model."""
    list_display = [
        'username', 'ip_address', 'success', 'timestamp', 'user_agent_preview'
    ]
    list_filter = ['success', 'timestamp']
    search_fields = ['username', 'ip_address']
    ordering = ['-timestamp']
    list_per_page = 50
    
    fieldsets = (
        (_('Attempt Information'), {
            'fields': ('username', 'ip_address', 'success')
        }),
        (_('Details'), {
            'fields': ('user_agent', 'timestamp')
        }),
    )
    
    readonly_fields = ['username', 'ip_address', 'user_agent', 'success', 'timestamp']
    
    def has_add_permission(self, request):
        """Disable adding login attempts manually."""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Disable changing login attempts."""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Allow deleting login attempts."""
        return True
    
    def user_agent_preview(self, obj):
        """Show truncated user agent string."""
        if obj.user_agent:
            return obj.user_agent[:50] + '...' if len(obj.user_agent) > 50 else obj.user_agent
        return '-'
    user_agent_preview.short_description = 'User Agent'


# Customize admin site
admin.site.site_header = "Offline Examination Management System"
admin.site.site_title = "Exam System Admin"
admin.site.index_title = "Welcome to Exam System Administration"
