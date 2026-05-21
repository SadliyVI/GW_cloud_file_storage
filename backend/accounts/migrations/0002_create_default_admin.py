import os

from django.contrib.auth.hashers import make_password
from django.db import migrations


def create_default_admin(apps, schema_editor):
    User = apps.get_model("accounts", "User")

    username = os.getenv("DEFAULT_ADMIN_USERNAME", "admin")
    full_name = os.getenv("DEFAULT_ADMIN_FULL_NAME", "System Administrator")
    email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@example.com")
    password = os.getenv("DEFAULT_ADMIN_PASSWORD", "Admin123!")

    if not User.objects.filter(username=username).exists():
        User.objects.create(
            username=username,
            full_name=full_name,
            email=email,
            password=make_password(password),
            is_staff=True,
            is_superuser=True,
            is_active=True,
        )


def delete_default_admin(apps, schema_editor):
    User = apps.get_model("accounts", "User")
    username = os.getenv("DEFAULT_ADMIN_USERNAME", "admin")
    User.objects.filter(username=username).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_default_admin, delete_default_admin),
    ]
    