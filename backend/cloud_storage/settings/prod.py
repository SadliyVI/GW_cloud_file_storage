from .base import *

DEBUG = False

ALLOWED_HOSTS = [
    "geonavfilestorage.online",
    "www.geonavfilestorage.online",
    "194.67.121.192",
    "127.0.0.1",
    "localhost",
]

CORS_ALLOWED_ORIGINS = [
    "https://geonavfilestorage.online",
    "https://www.geonavfilestorage.online",
]

CSRF_TRUSTED_ORIGINS = [
    "https://geonavfilestorage.online",
    "https://www.geonavfilestorage.online",
]

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"