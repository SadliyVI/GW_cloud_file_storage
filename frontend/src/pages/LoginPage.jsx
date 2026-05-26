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

    const [showPassword, setShowPassword] = useState(false);
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
                        <div className="password-input-wrap">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={updateField}
                                className={passwordError ? "input-error" : ""}
                                title="Введите пароль"
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                className="password-visibility-button"
                                onClick={() => setShowPassword((current) => !current)}
                                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                                title={showPassword ? "Скрыть пароль" : "Показать пароль"}
                            >
                                {showPassword ? (
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="18"
                                        height="18"
                                        aria-hidden="true"
                                        focusable="false"
                                    >
                                        <path
                                            d="M3 3L21 21"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M10.73 5.08A10.9 10.9 0 0 1 12 5c5.25 0 9 5 9 7a8.82 8.82 0 0 1-2.13 3.19M6.61 6.61C4.42 8.09 3 10.39 3 12c0 2 3.75 7 9 7a9.4 9.4 0 0 0 4.39-1.13"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M9.88 9.88A3 3 0 0 0 14.12 14.12M14.5 9.5A3 3 0 0 0 9.5 14.5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="18"
                                        height="18"
                                        aria-hidden="true"
                                        focusable="false"
                                    >
                                        <path
                                            d="M3 12C3 10 6.75 5 12 5s9 5 9 7-3.75 7-9 7-9-5-9-7Z"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="3"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>

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