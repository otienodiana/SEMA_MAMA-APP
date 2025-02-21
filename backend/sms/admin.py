from django.contrib import admin
from .models import SMSMessage

@admin.register(SMSMessage)
class SMSMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'message', 'status', 'timestamp')
    list_filter = ('status', 'timestamp')
    search_fields = ('sender__username', 'recipient', 'message')
