from rest_framework import serializers
from .models import Appointment
from django.contrib.auth import get_user_model

User = get_user_model()

class AppointmentSerializer(serializers.ModelSerializer):
    provider_name = serializers.SerializerMethodField()
    provider_details = serializers.SerializerMethodField()
    
    def get_provider_name(self, obj):
        if obj.provider:
            return f"{obj.provider.first_name} {obj.provider.last_name}"
        return "No provider assigned"

    def get_provider_details(self, obj):
        if obj.provider:
            return {
                'id': obj.provider.id,
                'first_name': obj.provider.first_name,
                'last_name': obj.provider.last_name,
                'email': obj.provider.email
            }
        return None

    class Meta:
        model = Appointment
        fields = [
            'id', 'title', 'description', 'date', 'status',
            'provider', 'provider_name', 'provider_details',
            'consultation_type', 'meeting_link',
            'notes_for_provider', 'preferred_language',
            'technical_requirements', 'created_at', 'user',
            'user_email'  # Add this field
        ]
        read_only_fields = ['id', 'created_at', 'status']
        extra_kwargs = {'user': {'required': False}}  # Make user field optional

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        return super().create(validated_data)
