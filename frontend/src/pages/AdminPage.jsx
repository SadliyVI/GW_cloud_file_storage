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

function getComparableValue(value) {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    if (typeof value === "number") {
        return value;
    }

    return String(value).toLowerCase();
}

export default function AdminPage() {
    const dispatch = useDispatch();

    const { items, loading, error } = useSelector((state) => state.users);
    const currentUser = useSelector((state) => state.auth.user);

    const [userToDelete, setUserToDelete] = useState(null);


    const [sortConfig, setSortConfig] = useState({
        key: "id",
        direction: "asc"
    });


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


    function handleSort(key) {
        setSortConfig((current) => {
            if (current.key === key) {
                return {
                    key,
                    direction: current.direction === "asc" ? "desc" : "asc"
                };
            }

            return {
                key,
                direction: "asc"
            };
        });
    }

    function renderSortArrow(key) {
        if (sortConfig.key !== key) {
            return <span className="sort-arrow inactive">↕</span>;
        }

        return (
            <span className="sort-arrow">
                {sortConfig.direction === "asc" ? "▲" : "▼"}
            </span>
        );
    }

    const sortedUsers = [...items].sort((a, b) => {
        const aValue = getComparableValue(a[sortConfig.key]);
        const bValue = getComparableValue(b[sortConfig.key]);

        if (aValue < bValue) {
            return sortConfig.direction === "asc" ? -1 : 1;
        }

        if (aValue > bValue) {
            return sortConfig.direction === "asc" ? 1 : -1;
        }

        return 0;
    });

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
                                <th className="sortable-th" title="Сортировать по ID">
                                    <button
                                        type="button"
                                        className="sortable-th-button"
                                        onClick={() => handleSort("id")}
                                    >
                                        <span>ID</span>
                                        {renderSortArrow("id")}
                                    </button>
                                </th>

                                <th className="sortable-th" title="Сортировать по логину">
                                    <button
                                        type="button"
                                        className="sortable-th-button"
                                        onClick={() => handleSort("username")}
                                    >
                                        <span>Логин</span>
                                        {renderSortArrow("username")}
                                    </button>
                                </th>

                                <th className="sortable-th" title="Сортировать по ФИО">
                                    <button
                                        type="button"
                                        className="sortable-th-button"
                                        onClick={() => handleSort("full_name")}
                                    >
                                        <span>ФИО</span>
                                        {renderSortArrow("full_name")}
                                    </button>
                                </th>

                                <th>Email</th>

                                <th>Администратор</th>

                                <th className="sortable-th" title="Сортировать по количеству файлов">
                                    <button
                                        type="button"
                                        className="sortable-th-button"
                                        onClick={() => handleSort("files_count")}
                                    >
                                        <span>Файлов</span>
                                        {renderSortArrow("files_count")}
                                    </button>
                                </th>

                                <th className="sortable-th" title="Сортировать по объёму файлов">
                                    <button
                                        type="button"
                                        className="sortable-th-button"
                                        onClick={() => handleSort("files_total_size")}
                                    >
                                        <span>Объём</span>
                                        {renderSortArrow("files_total_size")}
                                    </button>
                                </th>

                                <th>Действия</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedUsers.map((user) => {
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