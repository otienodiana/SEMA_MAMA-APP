from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Custom user model with role-based access control"""
    ROLE_CHOICES = (
        ('mom', 'mom'),
        ('healthcare_provider', 'Healthcare Provider'),
        ('admin', 'Admin'),
    )
    
    phone_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='mom')  

    age = models.PositiveIntegerField(blank=True, null=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"
