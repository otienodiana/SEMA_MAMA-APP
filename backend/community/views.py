from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Forum, Post, Comment
from .serializers import ForumSerializer, PostSerializer, CommentSerializer
from rest_framework.decorators import action
from rest_framework.generics import RetrieveAPIView
from rest_framework.generics import ListCreateAPIView
from .models import Post
from .serializers import PostSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Forum
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.exceptions import PermissionDenied
from .models import Forum, Post, Comment
from django.contrib.auth.models import User
from rest_framework.views import APIView 
from rest_framework.generics import DestroyAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_role(request):
    user = request.user
    role = user.profile.role if hasattr(user, "profile") else "mom"

    # Correct way to get joined forum IDs
    joined_forums = user.forums.values_list("id", flat=True)  

    return Response({"role": role, "joinedForums": list(joined_forums)})



class ForumViewSet(viewsets.ModelViewSet):
    queryset = Forum.objects.all().order_by('-created_at')
    serializer_class = ForumSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Anyone can view, only logged-in users can create
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

        
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['POST'])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user

        if post.likes.filter(id=user.id).exists():
            post.likes.remove(user)  # Unlike
            return Response({'message': 'Post unliked'})
        else:
            post.likes.add(user)  # Like
            return Response({'message': 'Post liked'})

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        if request.user.is_authenticated:
            for post in response.data:
                if post["username"] == request.user.username:
                    post["username"] = "You"  # Replace with "You" if it's the current user
        return Response(response.data)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['POST'])
    def like(self, request, pk=None):
        comment = self.get_object()
        user = request.user

        if comment.likes.filter(id=user.id).exists():
            comment.likes.remove(user)  # Unlike
            return Response({'message': 'Comment unliked'})
        else:
            comment.likes.add(user)  # Like
            return Response({'message': 'Comment liked'})


    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        if request.user.is_authenticated:
            for comment in response.data:
                if comment["username"] == request.user.username:
                    comment["username"] = "You"  # Replace with "You" if it's the current user
        return Response(response.data)

class ForumListCreateView(generics.ListCreateAPIView):
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]  # Allow file uploads

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ForumDetailView(RetrieveAPIView):
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer

class PostListCreateView(ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .models import Post
from .serializers import PostSerializer

class PostDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


from rest_framework.generics import ListCreateAPIView
from .models import Comment
from .serializers import CommentSerializer

class CommentListCreateView(ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id).select_related('user') 

from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .models import Comment
from .serializers import CommentSerializer

class CommentDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_forum(request, forum_id):
    try:
        forum = get_object_or_404(Forum, id=forum_id)
        user = request.user

        if forum.members.filter(id=user.id).exists():
            return Response({
                'detail': 'Already a member of this forum'
            }, status=status.HTTP_400_BAD_REQUEST)

        forum.members.add(user)
        return Response({
            'detail': 'Successfully joined the forum',
            'forum_id': forum_id
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'detail': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

class ForumListView(ListAPIView):
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_forum(request):
    print("🔍 Request Headers:", request.headers)  # Debug headers
    print("📝 Request Data:", request.data)  # Debug request payload

    if not request.data:
        return Response({"error": "Request body is empty"}, status=status.HTTP_400_BAD_REQUEST)

    if "name" not in request.data:
        return Response({"error": "Name field is required"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = ForumSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    print(" Validation Errors:", serializer.errors)  # Log errors
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





@csrf_exempt
def create_post(request, forum_id):
    """Create a new post in a forum"""
    if request.method == "POST":
        data = json.loads(request.body)
        forum = get_object_or_404(Forum, id=forum_id)
        
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Authentication required"}, status=401)

        post = Post.objects.create(
            forum=forum,
            user=request.user,  # Auto-assign the logged-in user
            title=data.get("title", ""),  # Use .get() to avoid key errors
            content=data.get("content", "")
        )

        return JsonResponse({
            "id": post.id, 
            "title": post.title, 
            "content": post.content, 
            "likes": post.total_likes()
        }, status=201)



def list_posts(request, forum_id):
    """List all posts in a forum"""
    posts = Post.objects.filter(forum_id=forum_id).values("id", "title", "content", "likes")
    return JsonResponse(list(posts), safe=False)


@csrf_exempt
def like_post(request, post_id):
    """Like or unlike a post"""
    post = get_object_or_404(Post, id=post_id)
    user = request.user  # Get authenticated user

    if user in post.likes.all():
        post.likes.remove(user)  # Unlike
    else:
        post.likes.add(user)  # Like
    
    return JsonResponse({"likes": post.total_likes()})


@csrf_exempt
def create_comment(request, post_id):
    """Create a comment on a post"""
    if request.method == "POST":
        data = json.loads(request.body)
        post = get_object_or_404(Post, id=post_id)
        user = request.user  # Ensure authenticated user

        comment = Comment.objects.create(
            post=post,
            user=user,
            content=data["content"]
        )
        return JsonResponse({"id": comment.id, "content": comment.content, "likes": 0}, status=201)


def list_comments(request, post_id):
    """List all comments under a post"""
    comments = Comment.objects.filter(post_id=post_id).values("id", "content", "likes")
    return JsonResponse(list(comments), safe=False)


@csrf_exempt
def like_comment(request, comment_id):
    """Like or unlike a comment"""
    comment = get_object_or_404(Comment, id=comment_id)
    user = request.user  # Get authenticated user

    if user in comment.likes.all():
        comment.likes.remove(user)  # Unlike
    else:
        comment.likes.add(user)  # Like

    return JsonResponse({"likes": comment.total_likes()})



class ForumListView(generics.ListCreateAPIView):
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer

class ForumPostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        forum_id = self.kwargs.get('forum_id')
        return Post.objects.filter(forum_id=forum_id)

    def perform_create(self, serializer):
        forum_id = self.kwargs.get('forum_id')
        forum = get_object_or_404(Forum, id=forum_id)
        
        # Check if user is a member of the forum
        if not forum.members.filter(id=self.request.user.id).exists():
            raise PermissionDenied("You must be a member of this forum to create posts.")
            
        serializer.save(
            forum_id=forum_id,
            user=self.request.user
        )

class PostLikeView(APIView):
    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        user = request.user  # Ensure authentication is implemented

        if user in post.likes.all():
            post.likes.remove(user)
            liked = False
        else:
            post.likes.add(user)
            liked = True

        return Response({'liked': liked, 'likes_count': post.likes.count()}, status=status.HTTP_200_OK)


class PostDeleteView(DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]


class PostCommentsView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        post_id = self.kwargs['pk']
        return Comment.objects.filter(post_id=post_id)
    
    def perform_create(self, serializer):
        post_id = self.kwargs['pk']
        serializer.save(post_id=post_id) 


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_serializer_context(self):
        return {"request": self.request}


class PostDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # ✅ Allow read-only access to unauthenticated users

    def perform_update(self, serializer):
        if self.request.user != self.get_object().user:
            raise PermissionDenied(" You can only edit your own posts.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.user:
            raise PermissionDenied(" You can only delete your own posts.")
        instance.delete()



class PostReactionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        reaction_type = request.data.get('reaction_type')

        if reaction_type == 'helpful':
            if request.user in post.likes.all():
                post.likes.remove(request.user)
                is_helpful = False
            else:
                post.likes.add(request.user)
                is_helpful = True
            
            return Response({
                'is_helpful': is_helpful,
                'likes_count': post.likes.count()
            })
        
        return Response({
            'error': 'Invalid reaction type'
        }, status=400)


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners of an object to edit or delete it."""

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to anyone
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner of the post
        return obj.user == request.user




class CommentCreateView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]  # Ensure only authenticated users can comment

    def perform_create(self, serializer):
        if not self.request.user or not self.request.user.is_authenticated:
            raise PermissionDenied("You must be logged in to comment.")
        
        # Explicitly assign the authenticated user
        serializer.save(user=self.request.user)



class PostListView(generics.ListAPIView):
    queryset = Post.objects.select_related("user").all()  # Ensure user data is fetched
    serializer_class = PostSerializer


class PostDetailView(RetrieveUpdateDestroyAPIView):  # ✅ Supports GET, PUT, DELETE
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    http_method_names = ['get', 'patch', 'delete']


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def is_member_of_forum(request, forum_id):
    """Check if the logged-in user is a member of the given forum."""
    forum = get_object_or_404(Forum, id=forum_id)
    is_member = forum.members.filter(id=request.user.id).exists()
    return Response({"is_member": is_member})


class ForumCreateView(generics.CreateAPIView):
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)  # Ensure `created_by` is set