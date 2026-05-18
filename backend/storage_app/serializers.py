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
        request = self.context.get("request")
        url = f"/api/storage/public/{obj.public_token}/download/"
        if request:
            return request.build_absolute_uri(url)
        return url