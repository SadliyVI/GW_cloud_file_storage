from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import User
from .validators import validate_password_rule, validate_username_rule


class UserPublicSerializer(serializers.ModelSerializer):
    files_count = serializers.IntegerField(read_only=True)
    files_total_size = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "full_name",
            "email",
            "is_staff",
            "is_superuser",
            "storage_path",
            "files_count",
            "files_total_size",
        ]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["username", "full_name", "email", "password"]

    def validate_username(self, value):
        try:
            validate_username_rule(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages) from exc

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Пользователь с таким логином уже существует."
            )

        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Пользователь с таким email уже существует."
            )

        return value

    def validate_password(self, value):
        try:
            validate_password_rule(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages) from exc
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.is_staff = False
        user.is_superuser = False
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        user_exists = User.objects.filter(username=username).exists()
        if not user_exists:
            raise serializers.ValidationError(
                {"username": "Пользователь с таким логином не найден!"}
            )

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError({"password": "Неверный пароль!"})

        attrs["user"] = user
        return attrs
