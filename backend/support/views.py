from rest_framework import generics, permissions
from .models import Forum, Post, Comment, SupportGroup
from .serializers import ForumSerializer, PostSerializer, CommentSerializer, SupportGroupSerializer
from rest_framework.response import Response
from rest_framework import status

# ----------------------- Forum Views -----------------------
class ForumListCreateView(generics.ListCreateAPIView):
    """List all forums or create a new one."""
    queryset = Forum.objects.all().order_by("-created_at")
    serializer_class = ForumSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        print(f"🔍 DEBUG: Request User - {self.request.user}")  # ✅ Print user
        if not self.request.user.is_authenticated:
            return Response({"error": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer.save(created_by=self.request.user)  # ✅ Set creator automatically


class ForumDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a specific forum."""
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer
    permission_classes = [permissions.IsAuthenticated]

# ----------------------- Post Views -----------------------
class PostListCreateView(generics.ListCreateAPIView):
    """List all posts in a forum or create a new post."""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter posts by forum ID."""
        forum_id = self.kwargs.get("forum_id")
        return Post.objects.filter(forum_id=forum_id).order_by("-created_at")

    def perform_create(self, serializer):
        """Associate the post with the logged-in user and forum."""
        forum_id = self.kwargs.get("forum_id")
        serializer.save(user=self.request.user, forum_id=forum_id)

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a specific post."""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

# ----------------------- Comment Views -----------------------
class CommentListCreateView(generics.ListCreateAPIView):
    """List all comments for a post or add a comment."""
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter comments by post ID."""
        post_id = self.kwargs.get("post_id")
        return Comment.objects.filter(post_id=post_id).order_by("created_at")

    def perform_create(self, serializer):
        """Associate the comment with the logged-in user and post."""
        post_id = self.kwargs.get("post_id")
        serializer.save(user=self.request.user, post_id=post_id)

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a specific comment."""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

# ----------------------- Support Group Views -----------------------
class SupportGroupListCreateView(generics.ListCreateAPIView):
    """List all support groups or create a new one."""
    queryset = SupportGroup.objects.all().order_by("-created_at")
    serializer_class = SupportGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class JoinSupportGroupView(generics.UpdateAPIView):
    """Allow users to join a support group."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """Add the current user to the support group."""
        try:
            support_group = SupportGroup.objects.get(pk=pk)
            support_group.members.add(request.user)
            return Response({"message": "Successfully joined the group"}, status=status.HTTP_200_OK)
        except SupportGroup.DoesNotExist:
            return Response({"error": "Support group not found"}, status=status.HTTP_404_NOT_FOUND)
