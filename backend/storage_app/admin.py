from django.contrib import admin

from .models import StoredFile


@admin.register(StoredFile)
class StoredFileAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "owner",
        "original_name",
        "size",
        "uploaded_at",
        "last_downloaded_at",
        "public_token",
    )
    search_fields = ("original_name", "owner__username", "public_token")
    list_filter = ("uploaded_at",)
