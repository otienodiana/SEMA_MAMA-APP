from django.contrib import admin
from .models import Forum, Post, Comment

@admin.register(Forum)
class ForumAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'visibility', 'created_by', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('visibility', 'category')
    list_editable = ('category',)  # Allow quick category editing
    
    def save_model(self, request, obj, form, change):
        if not obj.category:  # Ensure category is never empty
            obj.category = 'General'
        super().save_model(request, obj, form, change)

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'forum', 'user', 'created_at', 'topic', 'comments_count')
    search_fields = ('title', 'content')
    list_filter = ('topic', 'created_at')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('post', 'user', 'created_at')
    search_fields = ('content',)
    list_filter = ('created_at',)
