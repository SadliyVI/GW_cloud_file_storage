import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchFiles,
    uploadFile,
    deleteFile,
    updateFile
} from "../features/files/filesSlice.js";

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

function formatDate(value) {
    if (!value) return "—";
    return new Date(value).toLocaleString("ru-RU");
}

export default function StoragePage() {
    const { userId } = useParams();
    const dispatch = useDispatch();

    const { items, loading, error } = useSelector((state) => state.files);
    const currentUser = useSelector((state) => state.auth.user);

    const [selectedFile, setSelectedFile] = useState(null);
    const [comment, setComment] = useState("");

    useEffect(() => {
        dispatch(fetchFiles(userId));
    }, [dispatch, userId]);

    async function handleUpload(event) {
        event.preventDefault();

        if (!selectedFile) {
            alert("Выберите файл.");
            return;
        }

        const result = await dispatch(uploadFile({ file: selectedFile, comment, userId }));

        if (uploadFile.fulfilled.match(result)) {
            setSelectedFile(null);
            setComment("");
            event.target.reset();
        }
    }

    function handleDelete(fileId) {
        if (window.confirm("Удалить файл?")) {
            dispatch(deleteFile(fileId));
        }
    }

    function handleRename(file) {
        const newName = window.prompt("Введите новое имя файла", file.original_name);
        if (newName && newName.trim()) {
            dispatch(updateFile({ fileId: file.id, original_name: newName.trim(), comment: file.comment }));
        }
    }

    function handleComment(file) {
        const newComment = window.prompt("Введите комментарий", file.comment || "");
        if (newComment !== null) {
            dispatch(updateFile({ fileId: file.id, original_name: file.original_name, comment: newComment }));
        }
    }

    async function copyPublicLink(file) {
        await navigator.clipboard.writeText(file.public_url);
        alert("Публичная ссылка скопирована.");
    }

    return (
        <section className="card wide">
            <h1>
                Файловое хранилище
                {userId && currentUser?.is_staff ? ` пользователя #${userId}` : ""}
            </h1>

            <form className="upload-form" onSubmit={handleUpload}>
                <label>
                    Файл
                    <input
                        type="file"
                        onChange={(event) => setSelectedFile(event.target.files[0])}
                        title="Выберите файл для загрузки в хранилище"
                    />
                </label>

                <label>
                    Комментарий
                    <input
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="Необязательный комментарий"
                    />
                </label>

                <button type="submit">Загрузить</button>
            </form>

            {loading && <p>Загрузка списка файлов...</p>}
            {error && <pre className="error-box">{JSON.stringify(error, null, 2)}</pre>}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Имя файла</th>
                            <th>Комментарий</th>
                            <th>Размер</th>
                            <th>Дата загрузки</th>
                            <th>Последнее скачивание</th>
                            <th>Действия</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((file) => (
                            <tr key={file.id}>
                                <td>{file.original_name}</td>
                                <td>{file.comment || "—"}</td>
                                <td>{formatBytes(file.size)}</td>
                                <td>{formatDate(file.uploaded_at)}</td>
                                <td>{formatDate(file.last_downloaded_at)}</td>
                                <td className="actions-cell">
                                    <a
                                        className="button small"
                                        href={`/api/storage/files/${file.id}/download/`}
                                        title="Скачать файл на локальный диск"
                                    >
                                        Скачать
                                    </a>

                                    <button onClick={() => handleRename(file)}>Переименовать</button>
                                    <button onClick={() => handleComment(file)}>Комментарий</button>
                                    <button onClick={() => copyPublicLink(file)}>Копировать ссылку</button>
                                    <button className="danger" onClick={() => handleDelete(file.id)}>Удалить</button>
                                </td>
                            </tr>
                        ))}

                        {!items.length && !loading && (
                            <tr>
                                <td colSpan="6">Файлы отсутствуют.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}