import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    deleteUser,
    fetchUsers,
    updateUserAdminFlag
} from "../features/users/usersSlice.js";

import FormAlert from "../components/FormAlert.jsx";
import { getAnyError } from "../utils/errors.js";

function formatBytes(bytes) {
    if (!bytes) {
        return "0 Б";
    }

    const units = ["Б", "КБ", "МБ", "ГБ", "ТБ"];
    let size = Number(bytes);
    let index = 0;

    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index += 1;
    }

    return `${size.toFixed(1)} ${units[index]}`;
}

export default function AdminPage() {
    const dispatch = useDispatch();

    const { items, loading, error } = useSelector((state) => state.users);
    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    function handleDelete(userId, username) {
        const confirmed = window.confirm(
            `Удалить пользователя "${username}" и все его файлы?`
        );

        if (confirmed) {
            dispatch(deleteUser(userId));
        }
    }

    function toggleAdmin(user) {
        dispatch(
            updateUserAdminFlag({
                userId: user.id,
                is_staff: !user.is_staff
            })
        );
    }

    return (
        <section className="card wide">
            <div className="page-header">
                <div>
                    <h1>Административный интерфейс</h1>

                    <p className="muted">
                        Раздел доступен только пользователям с признаком администратора.
                        Здесь можно управлять пользователями и их файловыми хранилищами.
                    </p>
                </div>

                <Link className="button secondary" to="/storage">
                    Моё хранилище
                </Link>
            </div>

            {loading && <p>Загрузка списка пользователей...</p>}

            {error && (
                <FormAlert
                    type="error"
                    message={getAnyError(error) || "Не удалось загрузить пользователей."}
                />
            )}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th title="Внутренний идентификатор пользователя">ID</th>
                            <th title="Логин пользователя">Логин</th>
                            <th title="Полное имя, указанное при регистрации">
                                Полное имя
                            </th>
                            <th title="Email, указанный при регистрации">Email</th>
                            <th title="Признак администратора">Администратор</th>
                            <th title="Количество файлов в хранилище пользователя">
                                Файлов
                            </th>
                            <th title="Общий размер файлов пользователя">
                                Размер хранилища
                            </th>
                            <th title="Путь к папке хранилища пользователя">
                                Папка хранилища
                            </th>
                            <th title="Переход к управлению файлами пользователя">
                                Файлы
                            </th>
                            <th title="Действия администратора">Действия</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>

                                <td>
                                    <strong>{user.username}</strong>
                                </td>

                                <td>{user.full_name}</td>

                                <td>{user.email}</td>

                                <td>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={user.is_staff}
                                            onChange={() => toggleAdmin(user)}
                                            disabled={user.id === currentUser.id}
                                            title={
                                                user.id === currentUser.id
                                                    ? "Нельзя снять права администратора с текущего пользователя"
                                                    : "Изменить признак администратора"
                                            }
                                        />

                                        <span>{user.is_staff ? "Да" : "Нет"}</span>
                                    </label>
                                </td>

                                <td>{user.files_count ?? 0}</td>

                                <td>{formatBytes(user.files_size)}</td>

                                <td>
                                    <code>{user.storage_path}</code>
                                </td>

                                <td>
                                    <Link
                                        className="button small"
                                        to={`/storage/${user.id}`}
                                        title="Открыть интерфейс управления файлами этого пользователя"
                                    >
                                        Открыть
                                    </Link>
                                </td>

                                <td>
                                    <button
                                        className="danger"
                                        onClick={() => handleDelete(user.id, user.username)}
                                        disabled={user.id === currentUser.id}
                                        title={
                                            user.id === currentUser.id
                                                ? "Нельзя удалить текущего пользователя"
                                                : "Удалить пользователя и его файлы"
                                        }
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {!items.length && !loading && (
                            <tr>
                                <td colSpan="10">Пользователи не найдены.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}