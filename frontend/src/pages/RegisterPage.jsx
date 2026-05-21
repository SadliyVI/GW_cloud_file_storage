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
                        <input
                            name="password"
                            type="text"
                            value={form.password}
                            onChange={updateField}
                            className={passwordError ? "input-error" : ""}
                            title="Минимум 6 символов, одна заглавная буква, одна цифра и один специальный символ"
                            autoComplete="new-password"
                        />

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