from django.contrib import admin
from .models import Setting

@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    list_display = ('user', 'language', 'dark_mode', 'notifications', 'privacy', 'timezone')
    search_fields = ('user__username', 'language', 'privacy')
    list_filter = ('language', 'dark_mode', 'privacy', 'timezone')

