from django.db import models
from django.conf import settings
from django.utils.timezone import now
from django.contrib.auth import get_user_model

User = get_user_model()

class UserActivity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="activities")
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(default=now)

    def __str__(self):
        return f"{self.user.username} - {self.action} at {self.timestamp}"

class ContentPerformance(models.Model):
    content = models.ForeignKey('content.Content', on_delete=models.CASCADE, related_name="performance")
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    shares = models.PositiveIntegerField(default=0)
    timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.content.title} - {self.views} Views"

class SMSUsage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sms_usage")
    messages_sent = models.PositiveIntegerField(default=0)
    last_sent = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.messages_sent} Messages Sent"

class ForumActivity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="forum_activity")
    posts_created = models.PositiveIntegerField(default=0)
    comments_made = models.PositiveIntegerField(default=0)
    timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.posts_created} Posts"

class Report(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reports")
    report_type = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report by {self.user.username} - {self.report_type}"

class UserStatistics(models.Model):
    date = models.DateField(auto_now_add=True)
    total_users = models.IntegerField(default=0)
    active_users = models.IntegerField(default=0)
    inactive_users = models.IntegerField(default=0)
    new_registrations = models.IntegerField(default=0)

class EngagementMetrics(models.Model):
    date = models.DateField(auto_now_add=True)
    total_posts = models.IntegerField(default=0)
    total_comments = models.IntegerField(default=0)
    total_likes = models.IntegerField(default=0)
    total_shares = models.IntegerField(default=0)
    appointments_booked = models.IntegerField(default=0)

class SystemPerformance(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    server_uptime = models.DurationField()
    api_requests = models.IntegerField(default=0)
    storage_usage = models.BigIntegerField(default=0)
    response_time = models.FloatField(default=0.0)

class RealtimeActivity(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    online_users = models.IntegerField(default=0)
    active_sessions = models.IntegerField(default=0)
    recent_activities = models.JSONField(default=list)

class AlertsPanel(models.Model):
    title = models.CharField(max_length=200)
    message = models.TextField()
    severity = models.CharField(
        max_length=20,
        choices=[
            ('info', 'Information'),
            ('warning', 'Warning'),
            ('error', 'Error'),
        ],
        default='info'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.severity}: {self.title}"
