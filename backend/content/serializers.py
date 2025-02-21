from rest_framework import serializers
from .models import Content

class ContentSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')

    class Meta:
        model = Content
        fields = ['id', 'title', 'description', 'file', 'content_type', 'uploaded_by', 'uploaded_at']
        read_only_fields = ['uploaded_by', 'uploaded_at']
