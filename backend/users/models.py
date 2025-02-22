from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Custom user model"""
    phone_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    is_healthcare_provider = models.BooleanField(default=False)
    age = models.PositiveIntegerField(blank=True, null=True)  # New age field
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)  # New profile photo field

    def __str__(self):
        return self.username
