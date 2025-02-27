from django.urls import path
from .views import (
    ForumListCreateView, ForumDetailView,
    PostListCreateView, PostDetailView,
    CommentListCreateView, CommentDetailView,
    SupportGroupListCreateView, JoinSupportGroupView
)

urlpatterns = [
    # Forum Endpoints
    path('forums/', ForumListCreateView.as_view(), name='forum-list-create'),
    path('forums/<int:pk>/', ForumDetailView.as_view(), name='forum-detail'),  # NEW: Retrieve, update, delete forum

    # Post Endpoints
    path('forums/<int:forum_id>/posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),  # NEW: Retrieve, update, delete post

    # Comment Endpoints
    path('posts/<int:post_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),  # NEW: Retrieve, update, delete comment

    # Support Group Endpoints
    path('support-groups/', SupportGroupListCreateView.as_view(), name='support-group-list-create'),
    path('support-groups/<int:pk>/join/', JoinSupportGroupView.as_view(), name='join-support-group'),
]
