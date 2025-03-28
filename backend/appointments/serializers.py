from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)  # Changed to get user's email
    provider_name = serializers.CharField(source='provider.username', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "title",
            "description",
            "date",
            "rescheduled_at",
            "status",
            "rejection_reason",
            "created_at",
            "user",
            "user_email",  # Changed to use email instead of username
            "provider",
            "provider_name",
            "consultation_type",
            "meeting_link",
            "notes_for_provider",
            "preferred_language",
            "technical_requirements"
        ]
        read_only_fields = ["id", "created_at", "provider_name", "user_email"]

    def validate(self, data):
        if "rescheduled_at" in data and data["status"] != "scheduled":
            raise serializers.ValidationError("Rescheduling is only allowed for 'scheduled' status.")
        return data
