import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function HomePage() {
    const user = useSelector((state) => state.auth.user);

    return (
        <section className="home">
            <div className="card home-hero">
                <h1>Cloud File Storage</h1>

                <p>
                    Облачное файловое хранилище для загрузки, хранения, скачивания,переименования файлов и организации публичного доступа к ним по специальным ссылкам.
                </p>

                <p>
                    Выберите нужный вариант входа в систему.
                </p>
            </div>

            {!user && (
                <div className="home-actions-grid">
                    <article className="home-action-card">
                        <h2>Вход пользователя</h2>
                        <p>
                            Используйте этот раздел, если у вас уже есть учётная запись
                            обычного пользователя.
                        </p>

                        <Link className="button" to="/login">
                            Войти как пользователь
                        </Link>
                    </article>

                    <article className="home-action-card">
                        <h2>Регистрация</h2>
                        <p>
                            Создайте новую учётную запись пользователя для работы с личным
                            файловым хранилищем.
                        </p>

                        <Link className="button secondary" to="/register">
                            Зарегистрироваться
                        </Link>
                    </article>

                    <article className="home-action-card admin-card">
                        <h2>Вход администратора</h2>
                        <p>
                            Раздел предназначен для пользователей с признаком администратора.
                            После входа откроется панель управления пользователями.
                        </p>

                        <Link className="button admin-button" to="/login/admin">
                            Войти как администратор
                        </Link>
                    </article>
                </div>
            )}

            {user && (
                <div className="card">
                    <h2>Вы уже вошли в систему</h2>

                    <p>
                        Текущий пользователь: <strong>{user.username}</strong>
                    </p>

                    <div className="actions">
                        <Link className="button" to="/storage">
                            Перейти в моё хранилище
                        </Link>

                        {user.is_staff && (
                            <Link className="button admin-button" to="/admin">
                                Перейти в панель администратора
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}