import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice.js";

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    async function handleLogout() {
        await dispatch(logoutUser());
        navigate("/");
    }

    return (
        <header className="navbar">
            <div className="navbar__brand">GW Cloud</div>

            <nav className="navbar__links">
                <NavLink to="/">Главная</NavLink>

                {user && <NavLink to="/storage">Моё хранилище</NavLink>}

                {user?.is_staff && <NavLink to="/admin">Администрирование</NavLink>}

                {!user && <NavLink to="/login">Вход</NavLink>}
                {!user && <NavLink to="/register">Регистрация</NavLink>}

                {user && (
                    <>
                        <span className="navbar__user" title="Текущий пользователь">
                            {user.username}
                        </span>
                        <button onClick={handleLogout}>Выход</button>
                    </>
                )}
            </nav>
        </header>
    );
}