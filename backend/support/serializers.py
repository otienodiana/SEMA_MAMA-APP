from rest_framework import serializers
from .models import Post, Comment

class CommentSerializer(serializers.ModelSerializer):
    """Serializer for comments on a post."""
    user = serializers.ReadOnlyField(source="user.username")  # Show username instead of ID
    post = serializers.PrimaryKeyRelatedField(read_only=True)  # Reference to the post

    class Meta:
        model = Comment
        fields = ["id", "user", "post", "content", "created_at"]


class PostSerializer(serializers.ModelSerializer):
    """Serializer for forum posts."""
    user = serializers.ReadOnlyField(source="user.username")  # Show username instead of ID
    comments = CommentSerializer(many=True, read_only=True)  # Include comments in post details

    class Meta:
        model = Post
        fields = ["id", "user", "title", "content", "created_at", "comments"]
