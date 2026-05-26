import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { clearAuthError, registerUser } from "../features/auth/authSlice.js";
import PasswordGenerator from "../components/PasswordGenerator.jsx";
import FieldTooltip from "../components/FieldTooltip.jsx";
import FormAlert from "../components/FormAlert.jsx";
import { getCommonError, getFieldError } from "../utils/errors.js";

const usernameRe = /^[A-Za-z][A-Za-z0-9]{3,19}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRe = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;

export default function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authError = useSelector((state) => state.auth.error);
    const loading = useSelector((state) => state.auth.loading);

    const [form, setForm] = useState({
        username: "",
        full_name: "",
        email: "",
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

        if (!usernameRe.test(form.username)) {
            errors.username =
                "Логин: латинские буквы и цифры, первый символ — буква, длина 4–20.";
        }

        if (!form.full_name.trim()) {
            errors.full_name = "Введите полное имя.";
        }

        if (!emailRe.test(form.email)) {
            errors.email = "Введите корректный адрес электронной почты.";
        }

        if (!passwordRe.test(form.password)) {
            errors.password =
                "Пароль: минимум 6 символов, одна заглавная буква, одна цифра и один спецсимвол.";
        }

        setClientErrors(errors);
        return Object.keys(errors).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const result = await dispatch(registerUser(form));

        if (registerUser.fulfilled.match(result)) {
            navigate("/login");
        }
    }

    function handleGeneratedPassword(password) {
        setForm({
            ...form,
            password
        });

        setClientErrors({
            ...clientErrors,
            password: ""
        });

        dispatch(clearAuthError());
    }

    const usernameError =
        clientErrors.username || getFieldError(authError, "username");

    const fullNameError =
        clientErrors.full_name || getFieldError(authError, "full_name");

    const emailError =
        clientErrors.email || getFieldError(authError, "email");

    const passwordError =
        clientErrors.password || getFieldError(authError, "password");

    const commonError = getCommonError(authError);

    return (
        <section className="card form-card">
            <h1>Регистрация пользователя</h1>

            <p className="muted">
                Заполните минимальный набор данных для создания учётной записи.
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
                            title="Только латинские буквы и цифры, первый символ — буква, длина 4–20"
                            autoComplete="username"
                        />

                        <FieldTooltip message={usernameError} />
                    </div>
                </label>

                <label>
                    Полное имя

                    <div className="field-with-tooltip">
                        <input
                            name="full_name"
                            value={form.full_name}
                            onChange={updateField}
                            className={fullNameError ? "input-error" : ""}
                            title="Введите ваше полное имя"
                            autoComplete="name"
                        />

                        <FieldTooltip message={fullNameError} />
                    </div>
                </label>

                <label>
                    Email

                    <div className="field-with-tooltip">
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={updateField}
                            className={emailError ? "input-error" : ""}
                            title="Введите корректный адрес электронной почты"
                            autoComplete="email"
                        />

                        <FieldTooltip message={emailError} />
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
                                title="Минимум 6 символов, одна заглавная буква, одна цифра и один специальный символ"
                                autoComplete="new-password"
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

                <PasswordGenerator onGenerate={handleGeneratedPassword} />

                {commonError && <FormAlert type="error" message={commonError} />}

                <button type="submit" disabled={loading}>
                    {loading ? "Создание..." : "Создать аккаунт"}
                </button>
            </form>

            <div className="form-footer">
                <Link to="/login">Уже есть аккаунт? Войти</Link>
                <Link to="/login/admin">Вход администратора</Link>
            </div>
        </section>
    );
}