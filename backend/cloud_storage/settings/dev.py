from .base import *

DEBUG = True

ALLOWED_HOSTS = [
    '194.67.121.192',
    '127.0.0.1',
    'localhost',
    'geonavfilestorage.online',
    'www.geonavfilestorage.online',
]

CORS_ALLOWED_ORIGINS = [
    'https://geonavfilestorage.online',
    'https://www.geonavfilestorage.online',
    'http://194.67.121.192',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

CSRF_TRUSTED_ORIGINS = [
    'https://geonavfilestorage.online',
    'https://www.geonavfilestorage.online',
    'http://194.67.121.192',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
