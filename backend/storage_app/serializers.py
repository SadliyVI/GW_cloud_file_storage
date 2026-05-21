import os
from rest_framework import serializers
from .models import StoredFile


class StoredFileSerializer(serializers.ModelSerializer):
    public_url = serializers.SerializerMethodField()

    class Meta:
        model = StoredFile
        fields = [
            "id",
            "owner",
            "original_name",
            "size",
            "uploaded_at",
            "last_downloaded_at",
            "comment",
            "public_token",
            "public_url",
        ]
        read_only_fields = [
            "id",
            "owner",
            "size",
            "uploaded_at",
            "last_downloaded_at",
            "public_token",
            "public_url",
        ]

    def get_public_url(self, obj):
        frontend_url = os.getenv("FRONTEND_URL", "http://127.0.0.1:5173")
        return f"{frontend_url}/public/{obj.public_token}"