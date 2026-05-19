import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../features/auth/authSlice.js";

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authError = useSelector((state) => state.auth.error);

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    function updateField(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const result = await dispatch(loginUser(form));

        if (loginUser.fulfilled.match(result)) {
            if (result.payload.is_staff) {
                navigate("/admin");
            } else {
                navigate("/storage");
            }
        }
    }

    return (
        <section className="card form-card">
            <h1>Вход</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    Логин
                    <input
                        name="username"
                        value={form.username}
                        onChange={updateField}
                        required
                    />
                </label>

                <label>
                    Пароль
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={updateField}
                        required
                    />
                </label>

                {authError && (
                    <pre className="error-box">{JSON.stringify(authError, null, 2)}</pre>
                )}

                <button type="submit">Войти</button>
            </form>
        </section>
    );
}