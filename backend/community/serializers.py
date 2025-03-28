from rest_framework import serializers, generics, permissions
from .models import Forum, Post, Comment

class ForumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Forum
        fields = ['id', 'name', 'description', 'category', 'visibility', 'profile_picture', 'created_by', 'members', 'created_at']
        read_only_fields = ['created_by', 'created_at']

    def validate(self, attrs):
        # Validate required fields
        required_fields = ['name', 'description', 'category']
        errors = {}
        
        for field in required_fields:
            if field not in attrs:
                errors[field] = f"{field} is required"
            elif not attrs[field]:
                errors[field] = f"{field} cannot be empty"
                
        if errors:
            raise serializers.ValidationError(errors)

        # Validate string fields
        if 'name' in attrs and len(attrs['name'].strip()) < 3:
            errors['name'] = "Name must be at least 3 characters long"
            
        if 'description' in attrs and len(attrs['description'].strip()) < 10:
            errors['description'] = "Description must be at least 10 characters long"
            
        if errors:
            raise serializers.ValidationError(errors)

        # Normalize category to lowercase
        if 'category' in attrs:
            attrs['category'] = attrs['category'].lower()

        return attrs

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except Exception as e:
            print("Serializer create error:", str(e))
            raise serializers.ValidationError({"detail": str(e)})

class PostSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    created_by = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'forum', 'created_by', 'title', 'content', 'created_at', 'likes', 'author']
        read_only_fields = ['created_at', 'likes', 'author']

    def get_likes(self, obj):
        return [user.id for user in obj.likes.all()]

    def get_author(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'name': obj.user.get_full_name() if obj.user.get_full_name() else obj.user.username
        }

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
