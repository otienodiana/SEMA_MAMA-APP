from django.db import models
from django.conf import settings

VISIBILITY_CHOICES = [
    ("public", "Public"),
    ("private", "Private"),
]


class Forum(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="forums")
    created_at = models.DateTimeField(auto_now_add=True)
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default="public")  # ✅ Public or Private

    def __str__(self):
        return self.name

class Post(models.Model):
    """Forum posts created by users."""
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE, related_name="posts")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # ✅ Track edits

    def __str__(self):
        return f"{self.title} by {self.user.username}"


class Comment(models.Model):
    """Comments on forum posts."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # ✅ Track comment edits

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"

class SupportGroup(models.Model):
    """Support groups for postpartum support."""
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
