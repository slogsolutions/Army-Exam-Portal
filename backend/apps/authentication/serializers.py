from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from .models import User, Center, UserSession


class CenterSerializer(serializers.ModelSerializer):
    """Serializer for Center model."""
    
    class Meta:
        model = Center
        fields = [
            'id', 'name', 'code', 'address', 'city', 'state',
            'contact_person', 'contact_email', 'contact_phone', 'capacity',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    center = CenterSerializer(read_only=True)
    center_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'user_type',
            'center', 'center_id', 'phone_number', 'is_center_admin',
            'is_active', 'date_joined', 'last_login', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'date_joined', 'last_login', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }
    
    def create(self, validated_data):
        center_id = validated_data.pop('center_id', None)
        password = validated_data.pop('password', None)
        
        user = User.objects.create(**validated_data)
        
        if center_id:
            try:
                center = Center.objects.get(id=center_id)
                user.center = center
            except Center.DoesNotExist:
                pass
        
        if password:
            user.set_password(password)
        
        user.save()
        return user
    
    def update(self, instance, validated_data):
        center_id = validated_data.pop('center_id', None)
        
        if center_id:
            try:
                center = Center.objects.get(id=center_id)
                instance.center = center
            except Center.DoesNotExist:
                pass
        
        return super().update(instance, validated_data)


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new users."""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm', 'first_name',
            'last_name', 'user_type', 'center_id', 'phone_number'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer with additional user information."""
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user information to token response
        user = self.user
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'user_type': user.user_type,
            'center': CenterSerializer(user.center).data if user.center else None,
            'is_center_admin': user.is_center_admin,
            'is_active': user.is_active,
            'is_staff': getattr(user, 'is_staff', False),
            'is_superuser': getattr(user, 'is_superuser', False),
        }
        
        # Track login attempt
        self._track_login_attempt(attrs['username'], True)
        
        return data
    
    def _track_login_attempt(self, username, success):
        """Track login attempt for security monitoring."""
        request = self.context.get('request')
        if request:
            from .models import LoginAttempt
            LoginAttempt.objects.create(
                username=username,
                ip_address=self._get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                success=success
            )
    
    def _get_client_ip(self, request):
        """Get client IP address from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            
            if not user:
                # Track failed login attempt
                self._track_login_attempt(username, False)
                raise serializers.ValidationError(
                    _('Unable to log in with provided credentials.')
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    _('User account is disabled.')
                )
            
            if user.is_locked:
                raise serializers.ValidationError(
                    _('User account is locked due to multiple failed login attempts.')
                )
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError(
                _('Must include "username" and "password".')
            )
    
    def _track_login_attempt(self, username, success):
        """Track login attempt for security monitoring."""
        request = self.context.get('request')
        if request:
            from .models import LoginAttempt
            LoginAttempt.objects.create(
                username=username,
                ip_address=self._get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                success=success
            )
    
    def _get_client_ip(self, request):
        """Get client IP address from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change."""
    old_password = serializers.CharField(max_length=128, write_only=True)
    new_password = serializers.CharField(max_length=128, write_only=True)
    new_password_confirm = serializers.CharField(max_length=128, write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value


class PasswordResetSerializer(serializers.Serializer):
    """Serializer for password reset request."""
    email = serializers.EmailField()
    
    def validate_email(self, value):
        if not User.objects.filter(email=value, is_active=True).exists():
            raise serializers.ValidationError("No active user found with this email")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for password reset confirmation."""
    token = serializers.CharField()
    new_password = serializers.CharField(max_length=128, write_only=True)
    new_password_confirm = serializers.CharField(max_length=128, write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs


class UserSessionSerializer(serializers.ModelSerializer):
    """Serializer for UserSession model."""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserSession
        fields = [
            'id', 'user', 'session_key', 'ip_address', 'user_agent',
            'login_time', 'logout_time', 'is_active'
        ]
        read_only_fields = ['id', 'user', 'session_key', 'ip_address', 'user_agent', 'login_time']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile updates."""
    center = CenterSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'user_type',
            'center', 'phone_number', 'is_center_admin', 'is_active',
            'date_joined', 'last_login'
        ]
        read_only_fields = [
            'id', 'username', 'user_type', 'is_center_admin', 'is_active',
            'date_joined', 'last_login'
        ]
