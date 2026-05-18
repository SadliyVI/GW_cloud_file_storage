import logging

from django.contrib.auth import login, logout
from django.db.models import Count, Sum
from django.db.models.functions import Coalesce
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from storage_app.models import StoredFile

from .models import User
from .serializers import RegisterSerializer, LoginSerializer, UserPublicSerializer

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        logger.info("Registered user username=%s id=%s", user.username, user.id)
        return Response(UserPublicSerializer(user).data, status=status.HTTP_201_CREATED)

    logger.warning("Registration failed errors=%s", serializer.errors)
    return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        login(request, user)
        logger.info("Login success username=%s", user.username)
        return Response(UserPublicSerializer(user).data)

    logger.warning("Login failed errors=%s", serializer.errors)
    return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logger.info("Logout username=%s", request.user.username)
    logout(request)
    return Response({"detail": "Выход выполнен."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    return Response(UserPublicSerializer(request.user).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def users_list_view(request):
    if not request.user.is_staff:
        logger.warning("Forbidden users list requested by username=%s", request.user.username)
        return Response({"detail": "Доступ запрещён."}, status=status.HTTP_403_FORBIDDEN)

    users = User.objects.annotate(
        files_count=Count("files"),
        files_size=Coalesce(Sum("files__size"), 0),
    ).order_by("id")

    return Response(UserPublicSerializer(users, many=True).data)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def user_admin_flag_view(request, user_id):
    if not request.user.is_staff:
        return Response({"detail": "Доступ запрещён."}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"detail": "Пользователь не найден."}, status=status.HTTP_404_NOT_FOUND)

    is_staff = bool(request.data.get("is_staff"))
    user.is_staff = is_staff
    user.is_superuser = is_staff
    user.save(update_fields=["is_staff", "is_superuser"])

    logger.info("Changed admin flag user=%s is_staff=%s by=%s", user.username, is_staff, request.user.username)
    return Response(UserPublicSerializer(user).data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def user_delete_view(request, user_id):
    if not request.user.is_staff:
        return Response({"detail": "Доступ запрещён."}, status=status.HTTP_403_FORBIDDEN)

    if request.user.id == user_id:
        return Response({"detail": "Нельзя удалить текущего пользователя."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"detail": "Пользователь не найден."}, status=status.HTTP_404_NOT_FOUND)

    username = user.username
    user.delete()
    logger.info("Deleted user username=%s by=%s", username, request.user.username)

    return Response(status=status.HTTP_204_NO_CONTENT)