import logging
import mimetypes
import os
from urllib.parse import quote

from django.contrib.auth import get_user_model
from django.http import FileResponse
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import StoredFile
from .serializers import StoredFileSerializer
from .utils import delete_file_safely, make_unique_file_path

logger = logging.getLogger(__name__)
User = get_user_model()


def get_target_user(request):
    user_id = request.query_params.get("user_id")
    if user_id and request.user.is_staff:
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    return request.user


def can_access(request, file_obj):
    return request.user.is_staff or file_obj.owner_id == request.user.id


def get_file_response_content_type(file_obj):
    content_type, _ = mimetypes.guess_type(file_obj.original_name)

    if not content_type:
        content_type = "application/octet-stream"

    return content_type


def file_not_found_response():
    return Response(
        {"detail": "Файл не найден!"},
        status=status.HTTP_404_NOT_FOUND,
    )


def file_missing_on_server_response():
    return Response(
        {"detail": "Файл отсутствует на сервере!"},
        status=status.HTTP_404_NOT_FOUND,
    )


def access_denied_response():
    return Response(
        {"detail": "Доступ запрещён!"},
        status=status.HTTP_403_FORBIDDEN,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def files_list_view(request):
    target_user = get_target_user(request)

    if not target_user:
        return Response(
            {"detail": "Пользователь не найден!"},
            status=status.HTTP_404_NOT_FOUND,
        )

    if target_user.id != request.user.id and not request.user.is_staff:
        return access_denied_response()

    files = StoredFile.objects.filter(owner=target_user)
    serializer = StoredFileSerializer(files, many=True, context={"request": request})

    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_file_view(request):
    target_user = get_target_user(request)

    if not target_user:
        return Response(
            {"detail": "Пользователь не найден!"},
            status=status.HTTP_404_NOT_FOUND,
        )

    if target_user.id != request.user.id and not request.user.is_staff:
        return access_denied_response()

    uploaded_file = request.FILES.get("file")
    comment = request.data.get("comment", "")

    if not uploaded_file:
        return Response(
            {"detail": "Файл не передан!"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    path = make_unique_file_path(target_user, uploaded_file.name)

    with open(path, "wb+") as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)

    file_obj = StoredFile.objects.create(
        owner=target_user,
        original_name=uploaded_file.name,
        size=uploaded_file.size,
        comment=comment,
        storage_path=str(path),
    )

    logger.info(
        "Uploaded file id=%s name=%s owner=%s by=%s",
        file_obj.id,
        uploaded_file.name,
        target_user.username,
        request.user.username,
    )

    serializer = StoredFileSerializer(file_obj, context={"request": request})

    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_file_view(request, file_id):
    try:
        file_obj = StoredFile.objects.get(id=file_id)
    except StoredFile.DoesNotExist:
        return file_not_found_response()

    if not can_access(request, file_obj):
        return access_denied_response()

    delete_file_safely(file_obj.storage_path)
    file_obj.delete()

    logger.info("Deleted file id=%s by=%s", file_id, request.user.username)

    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_file_view(request, file_id):
    try:
        file_obj = StoredFile.objects.get(id=file_id)
    except StoredFile.DoesNotExist:
        return file_not_found_response()

    if not can_access(request, file_obj):
        return access_denied_response()

    original_name = request.data.get("original_name")
    comment = request.data.get("comment")

    if original_name is not None:
        original_name = original_name.strip()

        if not original_name:
            return Response(
                {"detail": "Имя файла не может быть пустым!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        file_obj.original_name = original_name

    if comment is not None:
        file_obj.comment = comment

    file_obj.save()

    logger.info("Updated file id=%s by=%s", file_obj.id, request.user.username)

    serializer = StoredFileSerializer(file_obj, context={"request": request})

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def download_file_view(request, file_id):
    try:
        file_obj = StoredFile.objects.get(id=file_id)
    except StoredFile.DoesNotExist:
        return file_not_found_response()

    if not can_access(request, file_obj):
        return access_denied_response()

    if not os.path.exists(file_obj.storage_path):
        return file_missing_on_server_response()

    file_obj.last_downloaded_at = timezone.now()
    file_obj.save(update_fields=["last_downloaded_at"])

    logger.info(
        "Downloaded private file id=%s by=%s",
        file_obj.id,
        request.user.username,
    )

    return FileResponse(
        open(file_obj.storage_path, "rb"),
        as_attachment=True,
        filename=file_obj.original_name,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def preview_file_view(request, file_id):
    try:
        file_obj = StoredFile.objects.get(id=file_id)
    except StoredFile.DoesNotExist:
        return file_not_found_response()

    if not can_access(request, file_obj):
        return access_denied_response()

    if not os.path.exists(file_obj.storage_path):
        return file_missing_on_server_response()

    content_type = get_file_response_content_type(file_obj)
    quoted_filename = quote(file_obj.original_name)

    logger.info(
        "Previewed private file id=%s by=%s",
        file_obj.id,
        request.user.username,
    )

    response = FileResponse(
        open(file_obj.storage_path, "rb"),
        as_attachment=False,
        content_type=content_type,
    )

    response["Content-Disposition"] = (
        f"inline; filename*=UTF-8''{quoted_filename}"
    )

    response["X-Content-Type-Options"] = "nosniff"

    return response


@api_view(["GET"])
@permission_classes([AllowAny])
def public_file_info_view(request, token):
    try:
        file_obj = StoredFile.objects.get(public_token=token)
    except StoredFile.DoesNotExist:
        return file_not_found_response()

    if not os.path.exists(file_obj.storage_path):
        return file_missing_on_server_response()

    return Response(
        {
            "id": file_obj.id,
            "original_name": file_obj.original_name,
            "size": file_obj.size,
            "token": file_obj.public_token,
        }
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def public_download_view(request, token):
    try:
        file_obj = StoredFile.objects.get(public_token=token)
    except StoredFile.DoesNotExist:
        return file_not_found_response()

    if not os.path.exists(file_obj.storage_path):
        return file_missing_on_server_response()

    file_obj.last_downloaded_at = timezone.now()
    file_obj.save(update_fields=["last_downloaded_at"])

    logger.info("Downloaded public file id=%s token=%s", file_obj.id, token)

    return FileResponse(
        open(file_obj.storage_path, "rb"),
        as_attachment=True,
        filename=file_obj.original_name,
    )