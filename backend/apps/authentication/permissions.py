from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    """
    
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.user_type == 'admin'
        )


class IsCenterAdmin(permissions.BasePermission):
    """
    Custom permission to only allow center administrators.
    """
    
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.user_type == 'admin' or request.user.is_center_admin)
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admin users.
    """
    
    def has_object_permission(self, request, view, obj):
        # Admin users can access everything
        if request.user.user_type == 'admin':
            return True
        
        # Center admins can access users in their center
        if request.user.is_center_admin and hasattr(obj, 'center'):
            return obj.center == request.user.center
        
        # Users can access their own objects
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'id'):
            return obj.id == request.user.id
        
        return False


class IsEvaluatorOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow evaluators or admin users.
    """
    
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.user_type in ['admin', 'evaluator']
        )


class IsCandidateOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow candidates or admin users.
    """
    
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.user_type in ['admin', 'candidate']
        )


class IsCenterUser(permissions.BasePermission):
    """
    Custom permission to only allow users from the same center.
    """
    
    def has_object_permission(self, request, view, obj):
        # Admin users can access everything
        if request.user.user_type == 'admin':
            return True
        
        # Check if object has center attribute
        if hasattr(obj, 'center'):
            return obj.center == request.user.center
        
        # Check if object is related to user's center
        if hasattr(obj, 'user') and hasattr(obj.user, 'center'):
            return obj.user.center == request.user.center
        
        return False


class IsReadOnlyOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow read-only access for non-admin users.
    """
    
    def has_permission(self, request, view):
        # Allow read operations for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        
        # Only admin users can perform write operations
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.user_type == 'admin'
        )


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow owners to edit their objects, others to read.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for the owner or admin
        if request.user.user_type == 'admin':
            return True
        
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'id'):
            return obj.id == request.user.id
        
        return False


class IsCenterAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow center admins to edit, others to read.
    """
    
    def has_permission(self, request, view):
        # Allow read operations for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        
        # Only center admins and admin users can perform write operations
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.user_type == 'admin' or request.user.is_center_admin)
        )


class IsActiveUser(permissions.BasePermission):
    """
    Custom permission to only allow active users.
    """
    
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.is_active and
            not request.user.is_locked
        )


class IsNotLocked(permissions.BasePermission):
    """
    Custom permission to only allow non-locked users.
    """
    
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            not request.user.is_locked
        )
