from rest_framework import serializers
from .models import EducationalContent

class EducationalContentSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False)  # Change to False since it's not needed for GET
    created_by = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = EducationalContent
        fields = [
            'id', 'title', 'description', 'file', 'content_type',
            'is_featured', 'status', 'rejection_reason', 
            'created_by', 'created_at'
        ]
        read_only_fields = ['created_at', 'status', 'created_by']

    def to_representation(self, instance):
        """Convert file URL to absolute URL"""
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if instance.file and hasattr(instance.file, 'url') and request:
            representation['file'] = request.build_absolute_uri(instance.file.url)
        return representation

    def validate(self, data):
        """Validate file and required fields"""
        if not data.get('title'):
            raise serializers.ValidationError("Title is required")
        if not data.get('description'):
            raise serializers.ValidationError("Description is required")
        if not data.get('file'):
            raise serializers.ValidationError("File is required")
        return data
