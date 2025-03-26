from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Forum(models.Model):
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]
    
    CATEGORY_CHOICES = [
        ('Pregnancy', 'Pregnancy'),  # Note: Using exact case matching with frontend
        ('Postpartum', 'Postpartum'),
        ('Parenting', 'Parenting'),
        ('Mental Health', 'Mental Health'),
        ('General', 'General'),
    ]

    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='public')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_forums')
    created_at = models.DateTimeField(auto_now_add=True)
    profile_picture = models.ImageField(upload_to='forum_pictures/', null=True, blank=True)
    category = models.CharField(
        max_length=20, 
        choices=CATEGORY_CHOICES,
        default='General'
    )
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='forums', blank=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'community_forum'
        verbose_name_plural = 'Forums'

class Post(models.Model):
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE, related_name="posts")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
    topic = models.CharField(max_length=50, default='General')
    comments_count = models.IntegerField(default=0)

    def total_likes(self):
        return self.likes.count()

    class Meta:
        db_table = 'community_post'
        verbose_name_plural = 'Posts'

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_comments', blank=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')

    def total_likes(self):
        return self.likes.count()

    class Meta:
        db_table = 'community_comment'
        verbose_name_plural = 'Comments'
