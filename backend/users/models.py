from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)
    permissions = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    """Custom user model with role-based access control."""
    
    ROLE_CHOICES = (
        ('admin', 'Administrator'),
        ('healthcare_provider', 'Healthcare Provider'),
        ('moderator', 'Moderator'),
        ('mom', 'Mom'),
    )

    phone_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='mom', null=False)
    age = models.PositiveIntegerField(blank=True, null=True)
    profile_photo = models.ImageField(
        upload_to='profile_photos/',
        null=True,
        blank=True,
        help_text="User's profile picture"
    )

    # Set default values for date fields
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)

    # Define permissions per role
    ROLE_PERMISSIONS = {
        'admin': [
            'manage_users',
            'manage_content',
            'manage_forums',
            'approve_content',
            'delete_content',
            'ban_users',
            'assign_roles',
        ],
        'healthcare_provider': [
            'create_content',
            'edit_own_content',
            'delete_own_content',
            'manage_appointments',
            'approve_content',
        ],
        'moderator': [
            'approve_content',
            'edit_content',
            'manage_forums',
            'moderate_comments',
        ],
        'mom': [
            'view_content',
            'create_comments',
            'join_forums',
            'book_appointments',
        ],
    }

    def has_permission(self, permission):
        return permission in self.ROLE_PERMISSIONS.get(self.role, [])

    def get_permissions(self):
        return self.ROLE_PERMISSIONS.get(self.role, [])

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.phone_number and not self.phone_number.isnumeric():
            raise ValidationError('Phone number must be numeric.')
        super().clean()

    def update_profile(self, phone_number=None, age=None, profile_photo=None):
        if phone_number:
            self.phone_number = phone_number
        if age:
            self.age = age
        if profile_photo:
            self.profile_photo = profile_photo
        self.save()
