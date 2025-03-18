from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source="provider.username", read_only=True)  # ✅ Show provider's name
    user_name = serializers.CharField(source="user.username", read_only=True)  # ✅ Show mom's name

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
            "user",  # Mom's ID
            "user_name",  # Mom's name
            "provider",  # Provider's ID
            "provider_name",  # Provider's name
            "consultation_type",
            "meeting_link",
            "notes_for_provider",
            "preferred_language",
            "technical_requirements",
        ]
        read_only_fields = ["id", "created_at", "user", "provider_name", "user_name", "meeting_link"]

    def validate(self, data):
        """Ensure rescheduled_at is only set when rescheduling"""
        if "rescheduled_at" in data and data["status"] != "scheduled":
            raise serializers.ValidationError("Rescheduling is only allowed for 'scheduled' status.")
        return data
