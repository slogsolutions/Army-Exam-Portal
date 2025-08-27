from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from django.utils import timezone

from .models import User, Center, UserSession, LoginAttempt
from .serializers import (
    UserSerializer, UserCreateSerializer, CenterSerializer,
    CustomTokenObtainPairSerializer, LoginSerializer,
    PasswordChangeSerializer, PasswordResetSerializer,
    PasswordResetConfirmSerializer, UserProfileSerializer,
    UserSessionSerializer
)
from .permissions import IsAdminUser, IsCenterAdmin, IsOwnerOrAdmin

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom token obtain view with additional user information."""
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]


class CustomTokenRefreshView(TokenRefreshView):
    """Custom token refresh view."""
    permission_classes = [permissions.AllowAny]


class LogoutView(APIView):
    """View for user logout."""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        summary="User Logout",
        description="Logout user and blacklist refresh token",
        responses={200: {"description": "Successfully logged out"}}
    )
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response(
                {"detail": "Successfully logged out"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"detail": "Error during logout"},
                status=status.HTTP_400_BAD_REQUEST
            )


class UserRegistrationView(generics.CreateAPIView):
    """View for user registration."""
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
        summary="User Registration",
        description="Register a new user in the system",
        examples=[
            OpenApiExample(
                'Candidate Registration',
                value={
                    'username': 'candidate123',
                    'email': 'candidate@example.com',
                    'password': 'securepassword123',
                    'password_confirm': 'securepassword123',
                    'first_name': 'John',
                    'last_name': 'Doe',
                    'user_type': 'candidate',
                    'phone_number': '+919876543210'
                }
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class UserListView(generics.ListAPIView):
    """View for listing users (admin only)."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user_type', 'center', 'is_active', 'is_center_admin']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['username', 'email', 'date_joined', 'last_login']
    ordering = ['username']
    
    @extend_schema(
        summary="List Users",
        description="List all users in the system (admin only)",
        parameters=[
            OpenApiParameter(name='user_type', description='Filter by user type', required=False),
            OpenApiParameter(name='center', description='Filter by center ID', required=False),
            OpenApiParameter(name='is_active', description='Filter by active status', required=False),
            OpenApiParameter(name='search', description='Search in username, email, first_name, last_name', required=False),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for user detail, update, and deletion."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsOwnerOrAdmin]
    
    @extend_schema(
        summary="User Detail",
        description="Get, update, or delete user information"
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(
        summary="Update User",
        description="Update user information"
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    @extend_schema(
        summary="Delete User",
        description="Delete user from the system"
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """View for user profile management."""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    @extend_schema(
        summary="User Profile",
        description="Get or update current user profile"
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(
        summary="Update Profile",
        description="Update current user profile"
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)


class PasswordChangeView(APIView):
    """View for password change."""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        summary="Change Password",
        description="Change user password",
        examples=[
            OpenApiExample(
                'Password Change',
                value={
                    'old_password': 'currentpassword',
                    'new_password': 'newsecurepassword123',
                    'new_password_confirm': 'newsecurepassword123'
                }
            )
        ]
    )
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response(
                {"detail": "Password changed successfully"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    """View for password reset request."""
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
        summary="Password Reset Request",
        description="Request password reset for user account"
    )
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            # In a real application, send email with reset link
            # For now, just return success message
            return Response(
                {"detail": "Password reset instructions sent to your email"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    """View for password reset confirmation."""
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
        summary="Password Reset Confirmation",
        description="Confirm password reset with token"
    )
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            # In a real application, validate token and reset password
            # For now, just return success message
            return Response(
                {"detail": "Password reset successfully"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CenterListView(generics.ListCreateAPIView):
    """View for listing and creating centers."""
    queryset = Center.objects.all()
    serializer_class = CenterSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active', 'state', 'country']
    search_fields = ['name', 'code', 'city']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['name']
    
    @extend_schema(
        summary="List Centers",
        description="List all examination centers"
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(
        summary="Create Center",
        description="Create a new examination center"
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class CenterDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for center detail, update, and deletion."""
    queryset = Center.objects.all()
    serializer_class = CenterSerializer
    permission_classes = [IsAdminUser]
    
    @extend_schema(
        summary="Center Detail",
        description="Get, update, or delete center information"
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(
        summary="Update Center",
        description="Update center information"
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    @extend_schema(
        summary="Delete Center",
        description="Delete center from the system"
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class UserSessionListView(generics.ListAPIView):
    """View for listing user sessions (admin only)."""
    queryset = UserSession.objects.all()
    serializer_class = UserSessionSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'is_active', 'ip_address']
    ordering_fields = ['login_time', 'logout_time']
    ordering = ['-login_time']
    
    @extend_schema(
        summary="List User Sessions",
        description="List all user sessions for monitoring"
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class LoginAttemptListView(generics.ListAPIView):
    """View for listing login attempts (admin only)."""
    queryset = LoginAttempt.objects.all()
    serializer_class = None  # No serializer needed for this view
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['username', 'ip_address', 'success']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
    
    @extend_schema(
        summary="List Login Attempts",
        description="List all login attempts for security monitoring"
    )
    def get(self, request, *args, **kwargs):
        # Return basic information about login attempts
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            data = [{
                'id': attempt.id,
                'username': attempt.username,
                'ip_address': attempt.ip_address,
                'success': attempt.success,
                'timestamp': attempt.timestamp,
                'user_agent': attempt.user_agent[:100] + '...' if len(attempt.user_agent) > 100 else attempt.user_agent
            } for attempt in page]
            return self.get_paginated_response(data)
        
        data = [{
            'id': attempt.id,
            'username': attempt.username,
            'ip_address': attempt.ip_address,
            'success': attempt.success,
            'timestamp': attempt.timestamp,
            'user_agent': attempt.user_agent[:100] + '...' if len(attempt.user_agent) > 100 else attempt.user_agent
        } for attempt in queryset]
        return Response(data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@extend_schema(
    summary="System Status",
    description="Get system status and statistics"
)
def system_status(request):
    """Get system status and statistics."""
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    total_centers = Center.objects.count()
    active_centers = Center.objects.filter(is_active=True).count()
    
    # Get recent login attempts
    recent_failed_attempts = LoginAttempt.objects.filter(
        success=False
    ).order_by('-timestamp')[:10]
    
    # Get active sessions
    active_sessions = UserSession.objects.filter(is_active=True).count()
    
    data = {
        'total_users': total_users,
        'active_users': active_users,
        'total_centers': total_centers,
        'active_centers': active_centers,
        'active_sessions': active_sessions,
        'recent_failed_attempts': len(recent_failed_attempts),
        'system_status': 'healthy' if active_centers > 0 else 'warning'
    }
    
    return Response(data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@extend_schema(
    summary="Force Logout",
    description="Force logout user from all sessions"
)
def force_logout(request):
    """Force logout user from all sessions."""
    user_id = request.data.get('user_id')
    
    if not user_id:
        return Response(
            {"detail": "user_id is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(id=user_id)
        # Invalidate all active sessions for the user
        UserSession.objects.filter(user=user, is_active=True).update(
            is_active=False,
            logout_time=timezone.now()
        )
        return Response(
            {"detail": f"User {user.username} logged out from all sessions"},
            status=status.HTTP_200_OK
        )
    except User.DoesNotExist:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )
