from rest_framework import generics, permissions
from .models import Forum, SupportGroup, Post, Comment
from .serializers import ForumSerializer, SupportGroupSerializer, PostSerializer, CommentSerializer

# List all forums and create a new one
class ForumListCreateView(generics.ListCreateAPIView):
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer
    permission_classes = [permissions.IsAuthenticated]

# List all posts in a forum and create a new post
class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        forum_id = self.kwargs["forum_id"]
        return Post.objects.filter(forum_id=forum_id)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

# List all comments for a post and create a new comment
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        post_id = self.kwargs["post_id"]
        return Comment.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

# List all support groups and create a new one
class SupportGroupListCreateView(generics.ListCreateAPIView):
    queryset = SupportGroup.objects.all()
    serializer_class = SupportGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

# Add a user to a support group
class JoinSupportGroupView(generics.UpdateAPIView):
    queryset = SupportGroup.objects.all()
    serializer_class = SupportGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        group = self.get_object()
        group.members.add(self.request.user)
