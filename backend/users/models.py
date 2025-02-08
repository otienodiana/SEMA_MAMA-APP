from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Custom user model"""
    phone_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    is_healthcare_provider = models.BooleanField(default=False)

    def __str__(self):
        return self.username
