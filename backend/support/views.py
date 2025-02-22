from rest_framework import generics, permissions
from .models import Forum, Post, Comment
from .serializers import PostSerializer, CommentSerializer
from rest_framework.response import Response
from rest_framework import status

class PostListCreateView(generics.ListCreateAPIView):
    """List all posts in a forum or create a new post."""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        forum_id = self.kwargs.get("forum_id")
        return Post.objects.filter(forum_id=forum_id).order_by("-created_at")

    def perform_create(self, serializer):
        forum_id = self.kwargs.get("forum_id")
        serializer.save(user=self.request.user, forum_id=forum_id)


class CommentListCreateView(generics.ListCreateAPIView):
    """List all comments for a post or add a comment."""
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        post_id = self.kwargs.get("post_id")
        return Comment.objects.filter(post_id=post_id).order_by("created_at")

    def perform_create(self, serializer):
        post_id = self.kwargs.get("post_id")
        serializer.save(user=self.request.user, post_id=post_id)


class ForumListCreateView(generics.ListCreateAPIView):
    """List all forums or create a new one."""
    queryset = Forum.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]


class SupportGroupListCreateView(generics.ListCreateAPIView):
    """List all support groups or create a new one."""
    queryset = SupportGroup.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]


class JoinSupportGroupView(generics.UpdateAPIView):
    """Allow users to join a support group."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            support_group = SupportGroup.objects.get(pk=pk)
            support_group.members.add(request.user)
            return Response({"message": "Successfully joined the group"}, status=status.HTTP_200_OK)
        except SupportGroup.DoesNotExist:
            return Response({"error": "Support group not found"}, status=status.HTTP_404_NOT_FOUND)
