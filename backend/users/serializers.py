from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.files.storage import default_storage
import os

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    profile_photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name', 
                 'profile_photo', 'date_joined', 'password', 'phone_number', 'age', 'profile_photo_url']
        read_only_fields = ['date_joined']
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
            'role': {'required': True},
        }

    def validate(self, attrs):
        # Ensure required fields are present
        required_fields = ['username', 'email', 'password', 'role']
        for field in required_fields:
            if field not in attrs:
                raise serializers.ValidationError({field: f"{field} is required"})
        return attrs

    def create(self, validated_data):
        try:
            # Log the incoming data
            print("Creating user with data:", validated_data)
            
            # Extract non-model fields
            profile_photo = validated_data.pop('profile_photo', None)
            password = validated_data.pop('password')

            # Create user instance but don't save yet
            user = User(**validated_data)
            user.set_password(password)
            user.save()

            # Handle profile photo if provided
            if profile_photo:
                try:
                    # Save profile photo after user is created
                    file_name = f"profile_photos/{user.id}_{profile_photo.name}"
                    file_path = default_storage.save(file_name, profile_photo)
                    user.profile_photo = file_path
                    user.save(update_fields=['profile_photo'])
                except Exception as e:
                    print(f"Error saving profile photo: {str(e)}")

            return user
        except Exception as e:
            print("Error creating user:", str(e))  # Add logging
            raise serializers.ValidationError(str(e))

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Include profile photo URL if it exists
        if instance.profile_photo:
            data['profile_photo'] = self.context['request'].build_absolute_uri(instance.profile_photo.url)
        return data

    def get_profile_photo_url(self, obj):
        if obj.profile_photo:
            return self.context['request'].build_absolute_uri(obj.profile_photo.url)
        return None

class UserRegistrationSerializer(serializers.ModelSerializer):
    profile_photo = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'phone_number', 
                 'age', 'profile_photo']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'role': {'required': True}
        }

    def create(self, validated_data):
        try:
            # Extract profile photo and password
            profile_photo = validated_data.pop('profile_photo', None)
            password = validated_data.pop('password')
            
            # Create user
            user = User(**validated_data)
            user.set_password(password)
            user.save()

            # Handle profile photo if provided
            if profile_photo:
                try:
                    file_name = f"profile_photos/{user.id}_{profile_photo.name}"
                    file_path = default_storage.save(file_name, profile_photo)
                    user.profile_photo = file_path
                    user.save(update_fields=['profile_photo'])
                except Exception as e:
                    print(f"Error saving profile photo: {str(e)}")

            return user
            
        except Exception as e:
            print(f"Error in create(): {str(e)}")
            raise