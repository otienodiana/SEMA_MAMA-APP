from rest_framework import serializers
from .models import Content

class ContentSerializer(serializers.ModelSerializer):
    created_by_username = serializers.SerializerMethodField()

    class Meta:
        model = Content
        fields = ['id', 'title', 'content_type', 'description', 'file_url', 
                 'uploaded_file', 'created_by', 'created_by_username', 
                 'created_at', 'updated_at']
        read_only_fields = ['created_by']

    def get_created_by_username(self, obj):
        return obj.created_by.username
