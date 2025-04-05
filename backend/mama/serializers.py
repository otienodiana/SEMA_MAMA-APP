from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Setting, PostpartumDepressionQuestion, AssessmentResult, DailyLog, ChatMessage, Forum

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

class DailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = ['id', 'emotional_state', 'anxiety_level', 'sleep_quality', 
                 'social_support', 'physical_symptoms', 'baby_bonding', 
                 'self_care', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']

class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role']
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Just use the actual values without defaults
        data.update({
            'first_name': instance.first_name,
            'last_name': instance.last_name,
            'email': instance.email,
            'role': instance.role
        })
        return data

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'content', 'sender_id', 'sender_name', 'timestamp', 'is_read']
        read_only_fields = ['id', 'sender_id', 'timestamp', 'is_read']

    def get_sender_name(self, obj):
        try:
            return f"{obj.sender.first_name} {obj.sender.last_name}".strip() or obj.sender.username
        except:
            return "Unknown"

    def get_recipient_name(self, obj):
        try:
            return str(obj.recipient.username)
        except:
            return "Unknown"

    def validate_recipient_id(self, value):
        User = get_user_model()
        try:
            User.objects.get(id=value)
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("Recipient not found")

    def validate(self, data):
        # Ensure content is not empty
        if not data.get('content', '').strip():
            raise serializers.ValidationError({"content": "Message content cannot be empty"})
            
        if not data.get('recipient_id'):
            raise serializers.ValidationError("Recipient ID is required")
            
        return data

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except Exception as e:
            raise serializers.ValidationError(f"Error creating message: {str(e)}")

class ForumSerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()
    created_by = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = Forum
        fields = [
            'id', 'name', 'description', 'created_at', 'updated_at',
            'created_by', 'members', 'visibility', 'category',
            'profile_picture', 'members_count', 'is_member'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']

    def get_members_count(self, obj):
        return obj.members.count()

    def get_created_by(self, obj):
        return {
            'id': obj.created_by.id,
            'username': obj.created_by.username
        } if obj.created_by else None

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user in obj.members.all()
        return False
