from django.contrib import admin
from .models import Setting, PostpartumDepressionQuestion, AssessmentResponse, AssessmentResult

@admin.register(PostpartumDepressionQuestion)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'order', 'is_active')
    list_filter = ('is_active',)
    ordering = ('order',)

@admin.register(AssessmentResponse)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ('user', 'question', 'response', 'created_at')
    list_filter = ('created_at',)

@admin.register(AssessmentResult)
class ResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_score', 'risk_level', 'completed_at')
    list_filter = ('risk_level', 'completed_at')

@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    list_display = ('user', 'language', 'notifications')
    list_filter = ('language', 'notifications')

from .models import Info

admin.site.register(Info)