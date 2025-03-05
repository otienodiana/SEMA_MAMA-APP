from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    is_healthcare_provider = serializers.SerializerMethodField()

    # ✅ Explicitly define the ImageField to ensure file uploads work
    profile_photo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "phone_number",
            "role",
            "age",
            "profile_photo",
            "is_healthcare_provider",
        ]
        extra_kwargs = {
            "password": {"write_only": True},  # Hide password in API response
            "role": {"required": True},  # ✅ Make role mandatory
        }

    def validate_role(self, value):
        """Ensure role is one of the allowed choices."""
        valid_roles = ["mom", "healthcare_provider", "admin"]
        if value not in valid_roles:
            raise serializers.ValidationError("Invalid role selected.")
        return value

    def get_is_healthcare_provider(self, obj):
        """Determine if the user is a healthcare provider."""
        return obj.role == "healthcare_provider"

    def create(self, validated_data):
        """Hash password before saving user."""
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)  # ✅ Hash password
        user.save()
        return user

    def update(self, instance, validated_data):
        """Ensure password hashing and update profile_photo properly."""
        if "password" in validated_data:
            instance.set_password(validated_data.pop("password"))

        if "profile_photo" in validated_data:
            instance.profile_photo = validated_data["profile_photo"]

        return super().update(instance, validated_data)
