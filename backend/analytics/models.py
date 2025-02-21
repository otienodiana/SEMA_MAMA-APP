from django.db import models
from django.conf import settings
from django.utils.timezone import now

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
