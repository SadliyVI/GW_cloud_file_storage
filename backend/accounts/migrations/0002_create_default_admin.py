import os
from django.db import migrations


def create_default_admin(apps, schema_editor):
    User = apps.get_model("accounts", "User")

    username = os.getenv("DEFAULT_ADMIN_USERNAME", "admin")
    email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@example.com")
    full_name = os.getenv("DEFAULT_ADMIN_FULL_NAME", "System Administrator")
    password = os.getenv("DEFAULT_ADMIN_PASSWORD", "Admin123!")

    if not User.objects.filter(username=username).exists():
        user = User(
            username=username,
            email=email,
            full_name=full_name,
            is_staff=True,
            is_superuser=True,
            is_active=True,
        )
        user.set_password(password)
        user.save()


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