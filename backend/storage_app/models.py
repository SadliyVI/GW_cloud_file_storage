import uuid
from django.conf import settings
from django.db import models


def generate_public_token():
    return uuid.uuid4().hex


class StoredFile(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="files",
    )
    original_name = models.CharField(max_length=255)
    size = models.BigIntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    last_downloaded_at = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True)
    storage_path = models.CharField(max_length=500)
    public_token = models.CharField(max_length=64, unique=True, default=generate_public_token)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.original_name} ({self.owner})"