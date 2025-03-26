from rest_framework import serializers
from .models import Content

class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = [
            'id', 'title', 'content_type', 'description', 'file_url', 
            'uploaded_file', 'created_by', 'is_featured', 'created_at', 
            'updated_at', 'status', 'is_approved', 'approval_date', 
            'approved_by', 'rejection_reason'
        ]
        read_only_fields = ['created_by', 'approved_by', 'approval_date']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Include creator username
        if instance.created_by:
            data['created_by'] = {
                'id': instance.created_by.id,
                'username': instance.created_by.username
            }
        # Include approver username if approved
        if instance.approved_by:
            data['approved_by'] = {
                'id': instance.approved_by.id,
                'username': instance.approved_by.username
            }
        return data
