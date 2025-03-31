from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import Group, Permission

class CustomUser(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        related_name='mama_user_set',
        help_text='The groups this user belongs to.',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        related_name='mama_user_set',
        help_text='Specific permissions for this user.',
    )
    role = models.CharField(max_length=20, choices=[
        ('mom', 'Mom'),
        ('healthcare_provider', 'Healthcare Provider'),
        ('admin', 'Admin')
    ])
    specialization = models.CharField(max_length=100, blank=True, null=True)

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
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        db_table = 'mama_postpartumdepressionquestion'
        app_label = 'mama'

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

class Info(models.Model):
    CONTENT_TYPES = [
        ('article', 'Article'),
        ('video', 'Video'),
        ('picture', 'Picture'),
        ('youtube', 'YouTube Link'),
    ]

    title = models.CharField(max_length=255)
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPES)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='info_files/', blank=True, null=True)  # For images, videos, PDFs
    youtube_link = models.URLField(blank=True, null=True)  # For YouTube links
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class DailyLog(models.Model):
    MOOD_CHOICES = [
        ('very_happy', 'Very Happy and Content'),
        ('mostly_good', 'Mostly Good'),
        ('up_and_down', 'Up and Down'),
        ('somewhat_low', 'Somewhat Low'),
        ('very_low', 'Very Low or Depressed'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    emotional_state = models.CharField(max_length=50, choices=MOOD_CHOICES)
    anxiety_level = models.CharField(max_length=50)
    sleep_quality = models.CharField(max_length=50)
    social_support = models.CharField(max_length=50)
    physical_symptoms = models.CharField(max_length=50)
    baby_bonding = models.CharField(max_length=50)
    self_care = models.CharField(max_length=50)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'mama_dailylog'
        ordering = ['-created_at']
        app_label = 'mama'
        managed = True  # Add this line

    def __str__(self):
        return f"Log for {self.user.username} on {self.created_at}"

class ChatMessage(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name='sent_messages',
        on_delete=models.CASCADE
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='received_messages',
        on_delete=models.CASCADE,
        null=False,  # Change to non-nullable
        blank=False  # Change to required
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp']
        indexes = [
            models.Index(fields=['sender', 'recipient']),
            models.Index(fields=['timestamp']),
        ]

    def __str__(self):
        return f'From {self.sender.username} to {self.recipient.username if self.recipient else "Unknown"} at {self.timestamp}'

class Forum(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='mama_created_forums'  # Changed from 'created_forums'
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='mama_joined_forums',  # Changed from 'joined_forums'
        blank=True
    )
    visibility = models.CharField(
        max_length=10,
        choices=[('public', 'Public'), ('private', 'Private')],
        default='public'
    )
    category = models.CharField(
        max_length=50,
        choices=[
            ('general', 'General'),
            ('pregnancy', 'Pregnancy'),
            ('postpartum', 'Postpartum'),
            ('parenting', 'Parenting'),
            ('mental_health', 'Mental Health')
        ],
        default='general'
    )
    profile_picture = models.ImageField(
        upload_to='forum_pictures/',
        null=True,
        blank=True
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name
