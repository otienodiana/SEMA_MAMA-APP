from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'date', 'status', 'created_at')
    list_filter = ('status', 'date')
    search_fields = ('title', 'user__username')
