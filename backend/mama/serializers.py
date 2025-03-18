from rest_framework import serializers
from .models import Setting, PostpartumDepressionQuestion, AssessmentResult

class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = ['language', 'dark_mode', 'notifications', 'privacy', 'timezone', 'content_preferences']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostpartumDepressionQuestion
        fields = ['id', 'question_text', 'order']

class AssessmentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentResult
        fields = ['total_score', 'risk_level', 'notes', 'completed_at']
