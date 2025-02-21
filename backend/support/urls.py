from django.urls import path
from .views import ForumListCreateView, PostListCreateView, CommentListCreateView, SupportGroupListCreateView, JoinSupportGroupView

urlpatterns = [
    path('forums/', ForumListCreateView.as_view(), name='forum-list-create'),
    path('forums/<int:forum_id>/posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:post_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('support-groups/', SupportGroupListCreateView.as_view(), name='support-group-list-create'),
    path('support-groups/<int:pk>/join/', JoinSupportGroupView.as_view(), name='join-support-group'),
]
