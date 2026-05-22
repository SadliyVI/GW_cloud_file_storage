import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    storage_path = models.CharField(max_length=255, unique=True, blank=True)

    REQUIRED_FIELDS = ["email", "full_name"]

    def save(self, *args, **kwargs):
        if not self.storage_path:
            self.storage_path = f"user_{uuid.uuid4().hex}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
