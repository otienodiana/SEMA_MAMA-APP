from django.db import models
from django.conf import settings

class Content(models.Model):
    CONTENT_TYPES = [
        ('document', 'Document'),
        ('image', 'Image'),
        ('video', 'Video')
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    file = models.FileField(upload_to='uploads/content/')
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='uploaded_content'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
