import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchUsers, deleteUser, updateUserAdminFlag } from "../features/users/usersSlice.js";

function formatBytes(bytes) {
    if (!bytes) return "0 Б";
    const units = ["Б", "КБ", "МБ", "ГБ"];
    let size = bytes;
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

    function handleDelete(userId) {
        if (window.confirm("Удалить пользователя и все его файлы?")) {
            dispatch(deleteUser(userId));
        }
    }

    function toggleAdmin(user) {
        dispatch(updateUserAdminFlag({ userId: user.id, is_staff: !user.is_staff }));
    }

    return (
        <section className="card wide">
            <h1>Администрирование</h1>

            <p>
                В этом разделе администратор управляет пользователями и может перейти в
                файловое хранилище любого пользователя.
            </p>

            {loading && <p>Загрузка...</p>}
            {error && <pre className="error-box">{JSON.stringify(error, null, 2)}</pre>}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Логин</th>
                            <th>Полное имя</th>
                            <th>Email</th>
                            <th>Админ</th>
                            <th>Файлов</th>
                            <th>Размер</th>
                            <th>Хранилище</th>
                            <th>Действия</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.full_name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={user.is_staff}
                                        onChange={() => toggleAdmin(user)}
                                        disabled={user.id === currentUser.id}
                                        title="Изменение признака администратора"
                                    />
                                </td>
                                <td>{user.files_count}</td>
                                <td>{formatBytes(user.files_size)}</td>
                                <td>
                                    <Link to={`/storage/${user.id}`}>Открыть</Link>
                                </td>
                                <td>
                                    <button
                                        className="danger"
                                        onClick={() => handleDelete(user.id)}
                                        disabled={user.id === currentUser.id}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}