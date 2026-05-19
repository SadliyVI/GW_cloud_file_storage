import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../features/auth/authSlice.js";
import PasswordGenerator from "../components/PasswordGenerator.jsx";

const usernameRe = /^[A-Za-z][A-Za-z0-9]{3,19}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRe = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;

export default function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authError = useSelector((state) => state.auth.error);

    const [form, setForm] = useState({
        username: "",
        full_name: "",
        email: "",
        password: ""
    });

    const [clientErrors, setClientErrors] = useState({});

    function updateField(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
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

        if (!validate()) return;

        const result = await dispatch(registerUser(form));

        if (registerUser.fulfilled.match(result)) {
            navigate("/login");
        }
    }

    return (
        <section className="card form-card">
            <h1>Регистрация</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    Логин
                    <input
                        name="username"
                        value={form.username}
                        onChange={updateField}
                        title="Только латинские буквы и цифры, первый символ — буква, длина 4–20"
                        required
                    />
                </label>
                {clientErrors.username && <p className="error">{clientErrors.username}</p>}

                <label>
                    Полное имя
                    <input
                        name="full_name"
                        value={form.full_name}
                        onChange={updateField}
                        required
                    />
                </label>
                {clientErrors.full_name && <p className="error">{clientErrors.full_name}</p>}

                <label>
                    Email
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={updateField}
                        required
                    />
                </label>
                {clientErrors.email && <p className="error">{clientErrors.email}</p>}

                <label>
                    Пароль
                    <input
                        name="password"
                        type="text"
                        value={form.password}
                        onChange={updateField}
                        title="Минимум 6 символов, одна заглавная буква, одна цифра и один специальный символ"
                        required
                    />
                </label>
                <PasswordGenerator onGenerate={(password) => setForm({ ...form, password })} />
                {clientErrors.password && <p className="error">{clientErrors.password}</p>}

                {authError && (
                    <pre className="error-box">{JSON.stringify(authError, null, 2)}</pre>
                )}

                <button type="submit">Создать аккаунт</button>
            </form>
        </section>
    );
}