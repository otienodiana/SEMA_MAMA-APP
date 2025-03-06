from rest_framework import serializers, generics, permissions
from .models import Forum, Post, Comment

class ForumSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')  # Show creator's username
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")  # Format date-time
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = Forum
        fields = ['id', 'name', 'description', 'visibility', 'created_by', 'created_at', 'profile_picture']

class PostSerializer(serializers.ModelSerializer):
    total_likes = serializers.ReadOnlyField()
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'forum', 'user', 'title', 'content', 'username', 'created_at', 'total_likes']
        extra_kwargs = {
            "forum": {"required": False},  # 👈 Make `forum` optional for updates
            "user": {"required": False}    # 👈 Make `user` optional for updates
        }



    def get_username(self, obj):
        """Returns the username of the user who created the post."""
        return obj.user.username if obj.user else None  # 

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'username','content', 'created_at']
        read_only_fields = ['user']  # Prevents user from being set manually

    def get_user(self, obj):
        return {"id": obj.user.id, "username": obj.user.username}

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class CreateForumView(generics.CreateAPIView):
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer
    permission_classes = [permissions.IsAuthenticated]
