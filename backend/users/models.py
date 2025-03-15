from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class User(AbstractUser):
    """Custom user model with role-based access control."""
    
    ROLE_CHOICES = (
        ('mom', 'Mom'),
        ('healthcare_provider', 'Healthcare Provider'),
        ('admin', 'Admin'),
    )

    phone_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='mom', null=False)
    age = models.PositiveIntegerField(blank=True, null=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)

    # Set default values for date fields
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)

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
