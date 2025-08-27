from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'authentication'

urlpatterns = [
    # JWT Authentication
    path('login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', views.CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    
    # User Management
    path('register/', views.UserRegistrationView.as_view(), name='user_register'),
    path('users/', views.UserListView.as_view(), name='user_list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user_detail'),
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    
    # Password Management
    path('password/change/', views.PasswordChangeView.as_view(), name='password_change'),
    path('password/reset/', views.PasswordResetView.as_view(), name='password_reset'),
    path('password/reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
    # Center Management
    path('centers/', views.CenterListView.as_view(), name='center_list'),
    path('centers/<int:pk>/', views.CenterDetailView.as_view(), name='center_detail'),
    
    # Security & Monitoring
    path('sessions/', views.UserSessionListView.as_view(), name='session_list'),
    path('login-attempts/', views.LoginAttemptListView.as_view(), name='login_attempt_list'),
    path('system-status/', views.system_status, name='system_status'),
    path('force-logout/', views.force_logout, name='force_logout'),
]
