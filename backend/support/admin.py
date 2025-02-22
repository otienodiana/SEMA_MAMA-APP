from django.contrib import admin
from .models import Forum, Post, Comment

admin.site.register(Forum)
admin.site.register(Post)
admin.site.register(Comment)
