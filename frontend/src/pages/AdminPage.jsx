import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    deleteUser,
    fetchUsers,
    updateUserAdminFlag
} from "../features/users/usersSlice.js";

import ConfirmModal from "../components/ConfirmModal.jsx";
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

    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    function openDeleteUserModal(user) {
        setUserToDelete(user);
    }

    function closeDeleteUserModal() {
        setUserToDelete(null);
    }

    function confirmDeleteUser() {
        if (userToDelete) {
            dispatch(deleteUser(userToDelete.id));
            setUserToDelete(null);
        }
    }

    function handleAdminChange(user) {
        dispatch(
            updateUserAdminFlag({
                userId: user.id,
                is_staff: !user.is_staff
            })
        );
    }

    return (
        <>
            <section className="card wide">
                <div className="page-header">
                    <div>
                        <h1>Административная панель</h1>
                        <p className="muted">
                            Управление пользователями и доступ к их файловым хранилищам.
                        </p>
                    </div>
                </div>

                {loading && <p className="muted">Загрузка пользователей...</p>}

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
                                <th>ID</th>
                                <th>Логин</th>
                                <th>ФИО</th>
                                <th>Email</th>
                                <th>Администратор</th>
                                <th>Файлов</th>
                                <th>Объём</th>
                                <th>Действия</th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.map((user) => {
                                const isCurrentUser = currentUser?.id === user.id;

                                return (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.full_name}</td>
                                        <td>{user.email}</td>

                                        <td>
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={user.is_staff}
                                                    disabled={isCurrentUser}
                                                    onChange={() => handleAdminChange(user)}
                                                />

                                                <span>{user.is_staff ? "Да" : "Нет"}</span>
                                            </label>
                                        </td>

                                        <td>{user.files_count}</td>

                                        <td>{formatBytes(user.files_total_size)}</td>

                                        <td>
                                            <div className="actions-cell">
                                                <Link
                                                    className="button small secondary"
                                                    to={`/storage/${user.id}`}
                                                >
                                                    Открыть хранилище
                                                </Link>

                                                <button
                                                    type="button"
                                                    className="danger small"
                                                    disabled={isCurrentUser}
                                                    onClick={() => openDeleteUserModal(user)}
                                                    title={
                                                        isCurrentUser
                                                            ? "Нельзя удалить текущего пользователя"
                                                            : "Удалить пользователя"
                                                    }
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {!items.length && !loading && (
                                <tr>
                                    <td colSpan="8">Пользователи отсутствуют.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <ConfirmModal
                open={Boolean(userToDelete)}
                danger
                title="Подтверждение удаления пользователя"
                message={
                    userToDelete
                        ? `Вы действительно хотите удалить пользователя "${userToDelete.username}"? Все его файлы также будут удалены.`
                        : ""
                }
                confirmText="Удалить"
                cancelText="Отмена"
                onConfirm={confirmDeleteUser}
                onCancel={closeDeleteUserModal}
            />
        </>
    );
}