from django.contrib import admin
from .models import UserActivity, ContentPerformance, SMSUsage, ForumActivity, Report

@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'timestamp')
    search_fields = ('user__username', 'action')
    list_filter = ('timestamp',)

@admin.register(ContentPerformance)
class ContentPerformanceAdmin(admin.ModelAdmin):
    list_display = ('content', 'views', 'likes', 'shares', 'timestamp')
    search_fields = ('content__title',)
    list_filter = ('timestamp',)

@admin.register(SMSUsage)
class SMSUsageAdmin(admin.ModelAdmin):
    list_display = ('user', 'messages_sent', 'last_sent')
    search_fields = ('user__username',)
    list_filter = ('last_sent',)

@admin.register(ForumActivity)
class ForumActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'posts_created', 'comments_made', 'timestamp')
    search_fields = ('user__username',)
    list_filter = ('timestamp',)

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('user', 'report_type', 'created_at')
    search_fields = ('user__username', 'report_type')
    list_filter = ('created_at',)
