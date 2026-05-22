from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Дополнительные поля", {"fields": ("full_name", "storage_path")}),
    )

    list_display = ("id", "username", "email", "full_name", "is_staff", "storage_path")
    search_fields = ("username", "email", "full_name")
