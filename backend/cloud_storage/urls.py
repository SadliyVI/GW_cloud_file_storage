from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.http import JsonResponse


def healthcheck(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("django-admin/", admin.site.urls),
    path("api/health/", healthcheck),
    path("api/auth/", include("accounts.urls")),
    path("api/storage/", include("storage_app.urls")),
    re_path(r"^(?!api/|django-admin/).*", TemplateView.as_view(template_name="index.html")),
]