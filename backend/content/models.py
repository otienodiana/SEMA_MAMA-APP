from django.db import models
from django.conf import settings  # ✅ Import settings to access AUTH_USER_MODEL

class Content(models.Model):
    TITLE_MAX_LENGTH = 255

    CONTENT_TYPES = [
        ('video', 'Video'),
        ('document', 'Document'),
        ('image', 'Image'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=TITLE_MAX_LENGTH)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='uploads/content/')
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPES, default='other')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # ✅ Use AUTH_USER_MODEL
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
