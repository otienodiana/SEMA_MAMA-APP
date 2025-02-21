from django.db import models
from django.conf import settings

class Setting(models.Model):
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('sw', 'Swahili'),
        ('fr', 'French'),
    ]

    NOTIFICATION_CHOICES = [
        ('all', 'All Notifications'),
        ('email', 'Email Only'),
        ('sms', 'SMS Only'),
        ('none', 'No Notifications'),
    ]

    PRIVACY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
        ('friends', 'Friends Only'),
    ]

    TIMEZONE_CHOICES = [
        ('UTC', 'UTC'),
        ('EAT', 'East Africa Time'),
        ('CET', 'Central European Time'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="settings")
    
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='en')
    dark_mode = models.BooleanField(default=False)

    notifications = models.CharField(max_length=10, choices=NOTIFICATION_CHOICES, default='all')
    privacy = models.CharField(max_length=10, choices=PRIVACY_CHOICES, default='public')
    timezone = models.CharField(max_length=10, choices=TIMEZONE_CHOICES, default='UTC')

    content_preferences = models.JSONField(default=list, blank=True)  # Example: ["Education", "Health"]

    def __str__(self):
        return f"{self.user.username} - {self.language}"
