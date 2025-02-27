from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    password = serializers.CharField(write_only=True, required=False)  # Ensure password is write-only
    profile_photo = serializers.ImageField(required=False)  # Allow optional profile photo uploads

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'is_healthcare_provider', 'age', 'profile_photo', 'password']

    def create(self, validated_data):
        """Override to hash password before saving"""
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)  # Hash the password
            user.save()
        return user

    def update(self, instance, validated_data):
        """Allow users to update their profile"""
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)  # Hash new password if provided

        instance.save()
        return instance
    
