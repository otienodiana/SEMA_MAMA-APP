from rest_framework import serializers, generics, permissions
from .models import Forum, Post, Comment

class ForumSerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(source="created_by.username", read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S",read_only=True)  # Format date-time
    profile_picture = serializers.ImageField(required=False)
    members = serializers.SerializerMethodField()

    class Meta:
        model = Forum
        read_only_fields = ['created_at', 'created_by', 'members']
        fields = ['id', 'name', 'description', 'visibility', 'created_by', 'created_at', 'profile_picture', 'category', 'members']

    def validate_category(self, value):
        """Ensure category matches one of the valid options"""
        valid_categories = [choice[0] for choice in Forum.CATEGORY_CHOICES]
        if value not in valid_categories:
            raise serializers.ValidationError(f"Category must be one of: {', '.join(valid_categories)}")
        return value

    def validate(self, data):
        if not data.get('category'):
            data['category'] = 'General'
        elif data['category'] not in dict(Forum.CATEGORY_CHOICES):
            raise serializers.ValidationError({
                'category': f"Invalid category. Must be one of: {', '.join(dict(Forum.CATEGORY_CHOICES).keys())}"
            })
        return data

    def get_members(self, obj):
        return [
            {
                'id': member.id,
                'username': member.username,
                'profile_picture': member.profile.profile_picture.url if hasattr(member, 'profile') and member.profile.profile_picture else None
            }
            for member in obj.members.all()
        ]

class PostSerializer(serializers.ModelSerializer):
    total_likes = serializers.ReadOnlyField()
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'forum', 'user', 'title', 'content', 'username', 'created_at', 'total_likes']
        read_only_fields = ['created_at']
        extra_kwargs = {
            "forum": {"required": False},  
            "user": {"required": False}    
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
