import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function HomePage() {
    const user = useSelector((state) => state.auth.user);

    return (
        <section className="card">
            <h1>Облачное файловое хранилище GW Cloud</h1>

            <p>
                Приложение позволяет пользователям хранить файлы на сервере, загружать
                новые документы, скачивать их, переименовывать, удалять и создавать
                обезличенные публичные ссылки для внешнего доступа.
            </p>

            <ul>
                <li>Регистрация и вход пользователей.</li>
                <li>Личное файловое хранилище для каждого пользователя.</li>
                <li>Административное управление пользователями и их файлами.</li>
                <li>Публичные ссылки без раскрытия имени пользователя и имени файла.</li>
            </ul>

            {!user ? (
                <div className="actions">
                    <Link className="button" to="/register">Зарегистрироваться</Link>
                    <Link className="button secondary" to="/login">Войти</Link>
                </div>
            ) : (
                <div className="actions">
                    <Link className="button" to="/storage">Перейти в хранилище</Link>
                    {user.is_staff && <Link className="button secondary" to="/admin">Администрирование</Link>}
                </div>
            )}
        </section>
    );
}