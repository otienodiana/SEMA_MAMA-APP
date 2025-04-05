from django.contrib import admin
from .models import Forum, Post, Comment

@admin.register(Forum)
class ForumAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'visibility', 'created_by', 'created_at']
    list_filter = ['category', 'visibility']
    search_fields = ['name', 'description']

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'forum', 'user', 'created_at', 'likes_count']
    list_filter = ['forum', 'created_at']
    search_fields = ['title', 'content']

    def likes_count(self, obj):
        return obj.likes.count()
    likes_count.short_description = 'Likes'

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['post', 'user', 'created_at', 'likes_count']
    list_filter = ['post', 'created_at']
    search_fields = ['content']

    def likes_count(self, obj):
        return obj.likes.count()
    likes_count.short_description = 'Likes'
