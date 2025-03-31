from django.db import models
from django.conf import settings

class Forum(models.Model):
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]
    
    CATEGORY_CHOICES = [
        ('general', 'General'),
        ('pregnancy', 'Pregnancy'), 
        ('postpartum', 'Postpartum'),
        ('parenting', 'Parenting'),
        ('mental_health', 'Mental Health'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='public')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='community_created_forums'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    profile_picture = models.ImageField(upload_to='forum_pictures/', null=True, blank=True)
    category = models.CharField(
        max_length=20, 
        choices=CATEGORY_CHOICES,
        default='general'
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='community_joined_forums',
        blank=True
    )

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'community_forum'
        verbose_name_plural = 'Forums'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_at']),
        ]

class Post(models.Model):
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE, related_name="posts")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
    comments_count = models.IntegerField(default=0)

    def update_comments_count(self):
        self.comments_count = self.comments.count()
        self.save()

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
