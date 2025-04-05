from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User  # Import your custom User model

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "phone_number", "role", "age", "profile_photo")
    search_fields = ("username", "email", "phone_number")
    list_filter = ("role",)

    fieldsets = UserAdmin.fieldsets + (
        ("Additional Info", {"fields": ("phone_number", "role", "age", "profile_photo")}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Additional Info", {"fields": ("phone_number", "role", "age", "profile_photo")}),
    )

