from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'phone_number', 'role', 'profile_photo', 'age')
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'required': True},
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.profile_photo:
            data['profile_photo'] = self.context['request'].build_absolute_uri(instance.profile_photo.url)
        return data

    def validate_role(self, value):
        """Ensure role is one of the allowed choices."""
        valid_roles = ["mom", "healthcare_provider", "admin"]
        if value not in valid_roles:
            raise serializers.ValidationError("Invalid role selected.")
        return value

    def validate_password(self, value):
        """Validate password strength."""
        if not value:
            raise serializers.ValidationError("Password is required.")
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
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