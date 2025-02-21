from django.contrib import admin
from .models import Forum, SupportGroup, Post, Comment

admin.site.register(Forum)
admin.site.register(SupportGroup)
admin.site.register(Post)
admin.site.register(Comment)
