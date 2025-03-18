from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ForumListView
from .views import ForumPostListCreateView, ForumListView, PostLikeView, PostDeleteView, PostCommentsView, is_member_of_forum
from .views import PostReactionView

from .views import (
    ForumViewSet, PostViewSet, CommentViewSet, 
    ForumListCreateView, ForumDetailView, 
    PostListCreateView, PostDetailView, 
    CommentListCreateView, CommentDetailView,
    join_forum,  # ✅ Added
    get_user_role  # ✅ Added
)

router = DefaultRouter()
router.register(r'forums', ForumViewSet)  # This already handles listing & creating forums
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
      path('forums/', ForumListView.as_view(), name='forum-list'),  # Automatically includes /forums/, /posts/, and /comments/
    path('forums/<int:pk>/', ForumDetailView.as_view(), name='forum-detail'),
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('forums/<int:forum_id>/posts/', ForumPostListCreateView.as_view(), name='forum-posts'),
    path('posts/<int:post_id>/like/', PostLikeView.as_view(), name='post-like'),
    path('posts/<int:post_id>/', PostDeleteView.as_view(), name='post-delete'),
    path('posts/<int:pk>/delete/', PostDeleteView.as_view(), name='post-delete'),
    path('comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
    path('posts/<int:pk>/comments/', PostCommentsView.as_view(), name='post-comments'),
    path('forums/<int:forum_id>/join/', join_forum, name='join-forum'),
    path('users/user-role/', get_user_role, name='user-role'),
    path("forums/<int:forum_id>/is-member/", is_member_of_forum, name="is-member-of-forum"),
    path('posts/<int:post_id>/react/', PostReactionView.as_view(), name='post-react'),
]