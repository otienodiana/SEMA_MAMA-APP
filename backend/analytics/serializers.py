from rest_framework import serializers
from .models import UserActivity, ContentPerformance, SMSUsage, ForumActivity, Report

class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = ['id', 'user', 'action', 'timestamp']

class ContentPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentPerformance
        fields = ['id', 'content', 'views', 'likes', 'shares', 'timestamp']

class SMSUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMSUsage
        fields = ['id', 'user', 'messages_sent', 'last_sent']

class ForumActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumActivity
        fields = ['id', 'user', 'posts_created', 'comments_made', 'timestamp']

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'user', 'report_type', 'description', 'created_at']
