import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    deleteFile,
    fetchFiles,
    updateFile,
    uploadFile
} from "../features/files/filesSlice.js";

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

function formatDate(value) {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString("ru-RU");
}

export default function StoragePage() {
    const { userId } = useParams();
    const dispatch = useDispatch();

    const { items, loading, error } = useSelector((state) => state.files);
    const currentUser = useSelector((state) => state.auth.user);

    const [selectedFile, setSelectedFile] = useState(null);
    const [comment, setComment] = useState("");
    const [localError, setLocalError] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);

    useEffect(() => {
        dispatch(fetchFiles(userId));
    }, [dispatch, userId]);

    useEffect(() => {
        function closeMenu(event) {
            if (!event.target.closest(".file-actions-menu-wrap")) {
                setOpenMenuId(null);
            }
        }

        document.addEventListener("click", closeMenu);

        return () => {
            document.removeEventListener("click", closeMenu);
        };
    }, []);

    async function handleUpload(event) {
        event.preventDefault();
        setLocalError("");

        if (!selectedFile) {
            setLocalError("Выберите файл для загрузки.");
            return;
        }

        const result = await dispatch(
            uploadFile({
                file: selectedFile,
                comment,
                userId
            })
        );

        if (uploadFile.fulfilled.match(result)) {
            setSelectedFile(null);
            setComment("");
            event.target.reset();
        }
    }

    function handleDelete(fileId) {
        setOpenMenuId(null);

        const confirmed = window.confirm("Удалить файл из хранилища?");

        if (confirmed) {
            dispatch(deleteFile(fileId));
        }
    }

    function handleRename(file) {
        setOpenMenuId(null);

        const newName = window.prompt(
            "Введите новое имя файла",
            file.original_name
        );

        if (newName && newName.trim()) {
            dispatch(
                updateFile({
                    fileId: file.id,
                    original_name: newName.trim(),
                    comment: file.comment
                })
            );
        }
    }

    function handleComment(file) {
        setOpenMenuId(null);

        const newComment = window.prompt(
            "Введите комментарий к файлу",
            file.comment || ""
        );

        if (newComment !== null) {
            dispatch(
                updateFile({
                    fileId: file.id,
                    original_name: file.original_name,
                    comment: newComment
                })
            );
        }
    }

    async function copyPublicLink(file) {
        setOpenMenuId(null);

        try {
            await navigator.clipboard.writeText(file.public_url);
            alert("Публичная ссылка скопирована в буфер обмена.");
        } catch {
            setLocalError("Не удалось скопировать ссылку. Скопируйте её вручную.");
        }
    }

    function toggleMenu(event, fileId) {
        event.stopPropagation();
        setOpenMenuId((currentId) => (currentId === fileId ? null : fileId));
    }

    const isAnotherUserStorage = userId && currentUser?.is_staff;

    return (
        <section className="card wide">
            <div className="page-header">
                <div>
                    <h1>
                        Файловое хранилище
                        {isAnotherUserStorage ? ` пользователя #${userId}` : ""}
                    </h1>

                    <p className="muted">
                        Здесь можно загружать, скачивать, переименовывать, удалять файлы и
                        копировать специальные публичные ссылки.
                    </p>
                </div>

                {currentUser?.is_staff && (
                    <Link className="button secondary" to="/admin">
                        Назад к пользователям
                    </Link>
                )}
            </div>

            <form className="upload-form" onSubmit={handleUpload}>
                <label>
                    Файл

                    <input
                        type="file"
                        onChange={(event) => {
                            setSelectedFile(event.target.files[0]);
                            setLocalError("");
                        }}
                        title="Выберите файл для загрузки в хранилище"
                    />
                </label>

                <label>
                    Комментарий

                    <input
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="Необязательный комментарий"
                        title="Комментарий будет отображаться в списке файлов"
                    />
                </label>

                <button type="submit">Загрузить</button>
            </form>

            {localError && <FormAlert type="error" message={localError} />}

            {loading && <p className="muted">Загрузка списка файлов...</p>}

            {error && (
                <FormAlert
                    type="error"
                    message={getAnyError(error) || "Не удалось загрузить список файлов."}
                />
            )}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th title="Оригинальное имя файла">Наименование файла</th>
                            <th title="Комментарий пользователя">Комментарий</th>
                            <th title="Размер файла">Размер</th>
                            <th title="Дата загрузки файла">Дата загрузки</th>
                            <th title="Дата последнего скачивания">
                                Последнее скачивание
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((file) => (
                            <tr key={file.id}>
                                <td>
                                    <div className="file-name-cell">
                                        <span className="file-name-text">{file.original_name}</span>

                                        <div className="file-actions-menu-wrap">
                                            <button
                                                type="button"
                                                className="icon-menu-button"
                                                onClick={(event) => toggleMenu(event, file.id)}
                                                title="Открыть меню действий"
                                                aria-label="Открыть меню действий"
                                            >
                                                ⋮
                                            </button>

                                            {openMenuId === file.id && (
                                                <div className="file-actions-dropdown">
                                                    <a
                                                        className="file-action-item"
                                                        href={`/api/storage/files/${file.id}/download/`}
                                                        title="Скачать файл на локальный диск"
                                                    >
                                                        <span className="file-action-icon">⬇</span>
                                                        <span>Скачать</span>
                                                    </a>

                                                    <button
                                                        type="button"
                                                        className="file-action-item"
                                                        onClick={() => handleRename(file)}
                                                        title="Изменить отображаемое имя файла"
                                                    >
                                                        <span className="file-action-icon">✎</span>
                                                        <span>Переименовать</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="file-action-item"
                                                        onClick={() => handleComment(file)}
                                                        title="Изменить комментарий к файлу"
                                                    >
                                                        <span className="file-action-icon">💬</span>
                                                        <span>Комментарий</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="file-action-item"
                                                        onClick={() => copyPublicLink(file)}
                                                        title="Скопировать специальную обезличенную ссылку"
                                                    >
                                                        <span className="file-action-icon">🔗</span>
                                                        <span>Копировать ссылку</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="file-action-item danger"
                                                        onClick={() => handleDelete(file.id)}
                                                        title="Удалить файл из хранилища"
                                                    >
                                                        <span className="file-action-icon">🗑</span>
                                                        <span>Удалить</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                <td>{file.comment || "—"}</td>

                                <td>{formatBytes(file.size)}</td>

                                <td>{formatDate(file.uploaded_at)}</td>

                                <td>{formatDate(file.last_downloaded_at)}</td>
                            </tr>
                        ))}

                        {!items.length && !loading && (
                            <tr>
                                <td colSpan="5">Файлы отсутствуют.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}