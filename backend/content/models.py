from django.db import models
from users.models import User
from django.conf import settings

class Content(models.Model):
    CONTENT_TYPES = (
        ('article', 'Article'),
        ('video', 'Video'),
        ('image', 'Image'),
        ('document', 'Document'),
        ('other', 'Other'),
        ('infographic', 'Infographic'),
    )

    title = models.CharField(max_length=200)
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    description = models.TextField()
    file_url = models.URLField(max_length=500, blank=True, null=True)
    uploaded_file = models.FileField(upload_to='content/', blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='created_content'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
