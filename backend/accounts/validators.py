import re

from django.core.exceptions import ValidationError

USERNAME_RE = re.compile(r"^[A-Za-z][A-Za-z0-9]{3,19}$")
PASSWORD_RE = re.compile(r"^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$")


def validate_username_rule(username: str):
    if not USERNAME_RE.match(username or ""):
        raise ValidationError(
            "Логин должен начинаться с латинской буквы, содержать только латинские буквы и цифры, длина от 4 до 20 символов."
        )


def validate_password_rule(password: str):
    if not PASSWORD_RE.match(password or ""):
        raise ValidationError(
            "Пароль должен быть не короче 6 символов и содержать минимум одну заглавную букву, одну цифру и один специальный символ."
        )
