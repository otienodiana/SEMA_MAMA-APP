from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Forum(models.Model):
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]

    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='public')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, default=1)  # Set default user ID
    created_at = models.DateTimeField(auto_now_add=True)
    profile_picture = models.ImageField(upload_to='forum_pictures/', null=True, blank=True)  # Profile picture for the forum
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="forums", blank=True)  

    def __str__(self):
        return self.name

class Post(models.Model):
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE, related_name="posts")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)  # Track likes

    def total_likes(self):
        return self.likes.count()

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_comments', blank=True)  # Track likes

    def total_likes(self):
        return self.likes.count()
