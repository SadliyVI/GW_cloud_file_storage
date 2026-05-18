import uuid
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="StoredFile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("original_name", models.CharField(max_length=255)),
                ("size", models.BigIntegerField()),
                ("uploaded_at", models.DateTimeField(auto_now_add=True)),
                ("last_downloaded_at", models.DateTimeField(blank=True, null=True)),
                ("comment", models.TextField(blank=True)),
                ("storage_path", models.CharField(max_length=500)),
                ("public_token", models.CharField(default=lambda: uuid.uuid4().hex, max_length=64, unique=True)),
                ("owner", models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name="files",
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
            options={
                "ordering": ["-uploaded_at"],
            },
        ),
    ]