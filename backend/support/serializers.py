from rest_framework import serializers
from .models import Forum, Post, Comment, SupportGroup

class ForumSerializer(serializers.ModelSerializer):
    """Serializer for forums, including posts."""
    posts = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    created_by = serializers.ReadOnlyField(source="created_by.username")  # ✅ Show creator username

    class Meta:
        model = Forum
        fields = ["id", "name", "description", "visibility", "created_at", "created_by", "posts"]  # ✅ Add visibility & created_by

class PostSerializer(serializers.ModelSerializer):
    """Serializer for forum posts, including comments."""
    user = serializers.ReadOnlyField(source="user.username")  # Show username instead of ID
    forum = serializers.PrimaryKeyRelatedField(queryset=Forum.objects.all())  # Ensure posts belong to a forum
    comments = serializers.SerializerMethodField()  # Include comments

    class Meta:
        model = Post
        fields = ["id", "forum", "user", "title", "content", "created_at", "comments"]

    def get_comments(self, obj):
        """Get serialized comments for a post."""
        return CommentSerializer(obj.comments.all(), many=True).data

class CommentSerializer(serializers.ModelSerializer):
    """Serializer for comments on a post."""
    user = serializers.ReadOnlyField(source="user.username")  # Show username instead of ID
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())  # Ensure comments belong to a post

    class Meta:
        model = Comment
        fields = ["id", "user", "post", "content", "created_at"]

class SupportGroupSerializer(serializers.ModelSerializer):
    """Serializer for Support Groups."""

    class Meta:
        model = SupportGroup
        fields = ["id", "name", "description", "created_at"]
