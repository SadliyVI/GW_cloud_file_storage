import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { loginUser, clearAuthError } from "../features/auth/authSlice.js";
import FieldTooltip from "../components/FieldTooltip.jsx";
import FormAlert from "../components/FormAlert.jsx";

function getServerFieldError(authError, fieldName) {
    const value =
        authError?.errors?.[fieldName] ||
        authError?.[fieldName];

    if (!value) {
        return "";
    }

    if (Array.isArray(value)) {
        return value.join(" ");
    }

    if (typeof value === "string") {
        return value;
    }

    return "Ошибка заполнения поля.";
}

function getServerCommonError(authError) {
    if (!authError) {
        return "";
    }

    if (authError.detail) {
        return authError.detail;
    }

    if (authError.errors?.non_field_errors) {
        const value = authError.errors.non_field_errors;
        return Array.isArray(value) ? value.join(" ") : String(value);
    }

    if (authError.non_field_errors) {
        const value = authError.non_field_errors;
        return Array.isArray(value) ? value.join(" ") : String(value);
    }

    return "";
}

export default function LoginPage({ mode = "user" }) {
    const isAdminLogin = mode === "admin";

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authError = useSelector((state) => state.auth.error);
    const loading = useSelector((state) => state.auth.loading);

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const [clientErrors, setClientErrors] = useState({});

    function updateField(event) {
        const { name, value } = event.target;

        setForm({
            ...form,
            [name]: value
        });

        setClientErrors({
            ...clientErrors,
            [name]: ""
        });

        dispatch(clearAuthError());
    }

    function validate() {
        const errors = {};

        if (!form.username.trim()) {
            errors.username = "Введите логин.";
        }

        if (!form.password.trim()) {
            errors.password = "Введите пароль.";
        }

        setClientErrors(errors);

        return Object.keys(errors).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const result = await dispatch(loginUser(form));

        if (loginUser.fulfilled.match(result)) {
            const loggedUser = result.payload;

            if (isAdminLogin) {
                if (!loggedUser.is_staff) {
                    setClientErrors({
                        username:
                            "У этой учётной записи нет прав администратора. Используйте вход пользователя."
                    });

                    return;
                }

                navigate("/admin");
                return;
            }

            navigate("/storage");
        }
    }

    const usernameError =
        clientErrors.username || getServerFieldError(authError, "username");

    const passwordError =
        clientErrors.password || getServerFieldError(authError, "password");

    const commonError = getServerCommonError(authError);

    return (
        <section className="card form-card">
            <h1>{isAdminLogin ? "Вход администратора" : "Вход пользователя"}</h1>

            <p className="muted">
                {isAdminLogin
                    ? "Введите логин и пароль пользователя, имеющего признак администратора."
                    : "Введите логин и пароль для доступа к вашему файловому хранилищу."}
            </p>

            <form onSubmit={handleSubmit} noValidate>
                <label>
                    Логин

                    <div className="field-with-tooltip">
                        <input
                            name="username"
                            value={form.username}
                            onChange={updateField}
                            className={usernameError ? "input-error" : ""}
                            title="Введите логин пользователя"
                            autoComplete="username"
                        />

                        <FieldTooltip message={usernameError} />
                    </div>
                </label>

                <label>
                    Пароль

                    <div className="field-with-tooltip">
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={updateField}
                            className={passwordError ? "input-error" : ""}
                            title="Введите пароль"
                            autoComplete="current-password"
                        />

                        <FieldTooltip message={passwordError} />
                    </div>
                </label>

                {commonError && <FormAlert type="error" message={commonError} />}

                <button type="submit" disabled={loading}>
                    {loading
                        ? "Проверка..."
                        : isAdminLogin
                            ? "Войти как администратор"
                            : "Войти"}
                </button>
            </form>

            <div className="form-footer">
                {isAdminLogin ? (
                    <Link to="/login">Войти как обычный пользователь</Link>
                ) : (
                    <Link to="/login/admin">Войти как администратор</Link>
                )}

                <Link to="/register">Регистрация</Link>
            </div>
        </section>
    );
}