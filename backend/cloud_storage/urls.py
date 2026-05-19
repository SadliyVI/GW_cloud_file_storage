from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie


def healthcheck(request):
    return JsonResponse({"status": "ok"})


@ensure_csrf_cookie
def csrf_view(request):
    return JsonResponse({"detail": "CSRF cookie set"})


urlpatterns = [
    path("django-admin/", admin.site.urls),

    path("api/health/", healthcheck),
    path("api/csrf/", csrf_view),

    path("api/auth/", include("accounts.urls")),
    path("api/storage/", include("storage_app.urls")),

    re_path(r"^(?!api/|django-admin/).*", TemplateView.as_view(template_name="index.html")),
]