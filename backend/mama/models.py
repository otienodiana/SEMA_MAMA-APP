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

class PostpartumDepressionQuestion(models.Model):
    question_text = models.CharField(max_length=500)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']
        app_label = 'mama'  # Add this line

    def __str__(self):
        return self.question_text

class AssessmentResponse(models.Model):
    RESPONSE_CHOICES = [
        (0, 'Never'),
        (1, 'Sometimes'),
        (2, 'Often'),
        (3, 'Always')
    ]

    RISK_LEVELS = [
        ('low', 'Low Risk'),
        ('moderate', 'Moderate Risk'),
        ('high', 'High Risk')
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    question = models.ForeignKey(PostpartumDepressionQuestion, on_delete=models.CASCADE)
    response = models.IntegerField(choices=RESPONSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'mama'  # Add this line

class AssessmentResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_score = models.IntegerField()
    risk_level = models.CharField(max_length=20, choices=AssessmentResponse.RISK_LEVELS)
    completed_at = models.DateTimeField(auto_now_add=True)
    responses = models.ManyToManyField(AssessmentResponse)
    notes = models.TextField(blank=True)

    def calculate_risk_level(self):
        if self.total_score < 10:
            return 'low'
        elif self.total_score < 20:
            return 'moderate'
        return 'high'

    def save(self, *args, **kwargs):
        if not self.risk_level:
            self.risk_level = self.calculate_risk_level()
        super().save(*args, **kwargs)

    class Meta:
        app_label = 'mama'  # Add this line
