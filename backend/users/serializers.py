from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    password = serializers.CharField(write_only=True)  # Ensure password is required but write-only

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'is_healthcare_provider', 'password']

    def create(self, validated_data):
        """Override to ensure password is hashed before saving"""
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)  # Hash the password
            user.save()
        return user
