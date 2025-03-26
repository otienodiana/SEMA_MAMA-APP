from functools import wraps
from rest_framework.exceptions import PermissionDenied
from rest_framework import permissions

def require_permission(permission):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.has_permission(permission):
                raise PermissionDenied(f"You don't have {permission} permission")
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator

class HasRolePermission(permissions.BasePermission):
    def __init__(self, required_permission):
        self.required_permission = required_permission

    def has_permission(self, request, view):
        return request.user.has_permission(self.required_permission)
