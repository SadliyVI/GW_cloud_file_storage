import os
import uuid
from pathlib import Path

from django.conf import settings


def user_storage_dir(user) -> Path:
    base = Path(settings.FILE_STORAGE_ROOT)
    return base / user.storage_path


def make_unique_file_path(user, original_name: str) -> Path:
    ext = Path(original_name).suffix
    filename = f"{uuid.uuid4().hex}{ext}"
    directory = user_storage_dir(user)
    directory.mkdir(parents=True, exist_ok=True)
    return directory / filename


def delete_file_safely(path: str):
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except OSError:
        pass
