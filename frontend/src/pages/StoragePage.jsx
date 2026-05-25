import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    deleteFile,
    fetchFiles,
    updateFile,
    uploadFile
} from "../features/files/filesSlice.js";

import { api } from "../api/client.js";
import ConfirmModal from "../components/ConfirmModal.jsx";
import FormAlert from "../components/FormAlert.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
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

function getFileNameFromDisposition(disposition, fallback) {
    if (!disposition) {
        return fallback;
    }

    const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);

    if (utf8Match) {
        return decodeURIComponent(utf8Match[1]);
    }

    const match = disposition.match(/filename="?([^"]+)"?/i);

    if (match) {
        return match[1];
    }

    return fallback;
}

function saveBlob(blob, filename) {
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(blobUrl);
}

function getFileExtension(filename = "") {
    const parts = filename.split(".");

    if (parts.length < 2) {
        return "";
    }

    return parts.pop().toLowerCase();
}

function isImageFile(file) {
    const mimeType = file.mime_type || file.content_type || file.type || "";
    const extension = getFileExtension(file.original_name);

    return (
        mimeType.startsWith("image/") ||
        ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(extension)
    );
}

function isVideoFile(file) {
    const mimeType = file.mime_type || file.content_type || file.type || "";
    const extension = getFileExtension(file.original_name);

    return (
        mimeType.startsWith("video/") ||
        ["mp4", "webm", "ogg", "mov", "mkv", "avi"].includes(extension)
    );
}

function getFileIconData(filename = "") {
    const extension = getFileExtension(filename);

    const groups = {
        pdf: {
            label: "PDF",
            className: "file-type-pdf"
        },
        doc: {
            label: "DOC",
            className: "file-type-doc"
        },
        docx: {
            label: "DOC",
            className: "file-type-doc"
        },
        xls: {
            label: "XLS",
            className: "file-type-xls"
        },
        xlsx: {
            label: "XLS",
            className: "file-type-xls"
        },
        csv: {
            label: "CSV",
            className: "file-type-xls"
        },
        ppt: {
            label: "PPT",
            className: "file-type-ppt"
        },
        pptx: {
            label: "PPT",
            className: "file-type-ppt"
        },
        txt: {
            label: "TXT",
            className: "file-type-txt"
        },
        md: {
            label: "MD",
            className: "file-type-txt"
        },
        zip: {
            label: "ZIP",
            className: "file-type-archive"
        },
        rar: {
            label: "RAR",
            className: "file-type-archive"
        },
        "7z": {
            label: "7Z",
            className: "file-type-archive"
        },
        tar: {
            label: "TAR",
            className: "file-type-archive"
        },
        gz: {
            label: "GZ",
            className: "file-type-archive"
        },
        exe: {
            label: "EXE",
            className: "file-type-app"
        },
        apk: {
            label: "APK",
            className: "file-type-app"
        },
        js: {
            label: "JS",
            className: "file-type-code"
        },
        jsx: {
            label: "JSX",
            className: "file-type-code"
        },
        ts: {
            label: "TS",
            className: "file-type-code"
        },
        tsx: {
            label: "TSX",
            className: "file-type-code"
        },
        py: {
            label: "PY",
            className: "file-type-code"
        },
        html: {
            label: "HTML",
            className: "file-type-code"
        },
        css: {
            label: "CSS",
            className: "file-type-code"
        },
        json: {
            label: "JSON",
            className: "file-type-code"
        },
        xml: {
            label: "XML",
            className: "file-type-code"
        },
        mp3: {
            label: "MP3",
            className: "file-type-audio"
        },
        wav: {
            label: "WAV",
            className: "file-type-audio"
        },
        flac: {
            label: "FLAC",
            className: "file-type-audio"
        }
    };

    return (
        groups[extension] || {
            label: extension ? extension.toUpperCase().slice(0, 4) : "FILE",
            className: "file-type-generic"
        }
    );
}

function getFilePreviewUrl(file) {
    return `/api/storage/files/${file.id}/download/`;
}

function FileVisual({ file }) {
    if (isImageFile(file)) {
        return (
            <div className="file-visual file-visual-preview">
                <img
                    src={getFilePreviewUrl(file)}
                    alt=""
                    loading="lazy"
                />
            </div>
        );
    }

    if (isVideoFile(file)) {
        return (
            <div className="file-visual file-visual-preview">
                <video
                    src={getFilePreviewUrl(file)}
                    preload="metadata"
                    muted
                />
                <span className="file-video-play-mark">▶</span>
            </div>
        );
    }

    const icon = getFileIconData(file.original_name);

    return (
        <div className={`file-visual file-type-icon ${icon.className}`}>
            <span>{icon.label}</span>
        </div>
    );
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

export default function StoragePage() {
    const { userId } = useParams();
    const dispatch = useDispatch();

    const { items, loading, error } = useSelector((state) => state.files);
    const currentUser = useSelector((state) => state.auth.user);

    const [selectedFile, setSelectedFile] = useState(null);
    const [comment, setComment] = useState("");
    const [localError, setLocalError] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);

    const [fileToDelete, setFileToDelete] = useState(null);

    const [dragFile, setDragFile] = useState(null);
    const [, setDragCounter] = useState(0);
    const [isDragActive, setIsDragActive] = useState(false);

    const [uploadProgress, setUploadProgress] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState(null);
    const [downloadingFileName, setDownloadingFileName] = useState("");

    const [sortConfig, setSortConfig] = useState({
        key: "uploaded_at",
        direction: "desc"
    });



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

    // async function handleUpload(event) {
    //     event.preventDefault();
    //     setLocalError("");

    //     if (!selectedFile) {
    //         setLocalError("Выберите файл для загрузки.");
    //         return;
    //     }

    //     setUploadProgress(0);

    //     const result = await dispatch(
    //         uploadFile({
    //             file: selectedFile,
    //             comment,
    //             userId,
    //             onProgress: setUploadProgress
    //         })
    //     );

    //     if (uploadFile.fulfilled.match(result)) {
    //         setUploadProgress(100);

    //         setTimeout(() => {
    //             setUploadProgress(null);
    //         }, 700);

    //         setSelectedFile(null);
    //         setComment("");
    //         event.target.reset();
    //     } else {
    //         setUploadProgress(null);
    //     }
    // }

    async function uploadSelectedFile(fileToUpload, uploadComment = "") {
        setLocalError("");

        if (!fileToUpload) {
            setLocalError("Выберите файл для загрузки.");
            return false;
        }

        setUploadProgress(0);

        const result = await dispatch(
            uploadFile({
                file: fileToUpload,
                comment: uploadComment,
                userId,
                onProgress: setUploadProgress
            })
        );

        if (uploadFile.fulfilled.match(result)) {
            setUploadProgress(100);

            setTimeout(() => {
                setUploadProgress(null);
            }, 700);

            return true;
        }

        setUploadProgress(null);
        return false;
    }

    async function handleUpload(event) {
        event.preventDefault();

        const success = await uploadSelectedFile(selectedFile, comment);

        if (success) {
            setSelectedFile(null);
            setComment("");
            event.target.reset();
        }
    }

    async function handleDownload(file) {
        setOpenMenuId(null);
        setLocalError("");
        setDownloadingFileName(file.original_name);
        setDownloadProgress(0);

        try {
            const xhr = await api.download(
                `/storage/files/${file.id}/download/`,
                setDownloadProgress
            );

            const filename = getFileNameFromDisposition(
                xhr.getResponseHeader("content-disposition"),
                file.original_name
            );

            saveBlob(xhr.response, filename);
            setDownloadProgress(100);

            setTimeout(() => {
                setDownloadProgress(null);
                setDownloadingFileName("");
            }, 700);
        } catch (error) {
            setDownloadProgress(null);
            setDownloadingFileName("");
            setLocalError(getAnyError(error) || "Не удалось скачать файл.");
        }
    }

    function openDeleteFileModal(file) {
        setOpenMenuId(null);
        setFileToDelete(file);
    }

    function closeDeleteFileModal() {
        setFileToDelete(null);
    }

    function confirmDeleteFile() {
        if (fileToDelete) {
            dispatch(deleteFile(fileToDelete.id));
            setFileToDelete(null);
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

    const sortedItems = [...items].sort((a, b) => {
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

    function isNavbarElement(target) {
        return Boolean(target.closest("nav") || target.closest(".navbar"));
    }

    function hasDraggedFiles(event) {
        return Array.from(event.dataTransfer?.types || []).includes("Files");
    }

    function handlePageDragEnter(event) {
        if (isNavbarElement(event.target) || !hasDraggedFiles(event)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        setDragCounter((current) => current + 1);
        setIsDragActive(true);
    }

    function handlePageDragOver(event) {
        if (isNavbarElement(event.target) || !hasDraggedFiles(event)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        event.dataTransfer.dropEffect = "copy";
        setIsDragActive(true);
    }

    function handlePageDragLeave(event) {
        if (isNavbarElement(event.target) || !hasDraggedFiles(event)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        setDragCounter((current) => {
            const next = Math.max(0, current - 1);

            if (next === 0) {
                setIsDragActive(false);
            }

            return next;
        });
    }

    function handlePageDrop(event) {
        if (isNavbarElement(event.target) || !hasDraggedFiles(event)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        setDragCounter(0);
        setIsDragActive(false);
        setLocalError("");

        const droppedFile = event.dataTransfer.files?.[0];

        if (!droppedFile) {
            return;
        }

        setDragFile(droppedFile);
    }

    function cancelDragUpload() {
        setDragFile(null);
    }

    async function confirmDragUpload() {
        if (!dragFile) {
            return;
        }

        const fileToUpload = dragFile;

        setDragFile(null);

        const success = await uploadSelectedFile(fileToUpload, comment);

        if (success) {
            setSelectedFile(null);
            setComment("");

            const fileInput = document.getElementById("storage-file-input");

            if (fileInput) {
                fileInput.value = "";
            }
        }
    }



    return (
        <div
            className={`storage-drop-page ${isDragActive ? "drag-active" : ""}`}
            onDragEnter={handlePageDragEnter}
            onDragOver={handlePageDragOver}
            onDragLeave={handlePageDragLeave}
            onDrop={handlePageDrop}
        >
            <section className="card wide">
                <div className="page-header">
                    <div>
                        <h1>
                            Файловое хранилище
                            {isAnotherUserStorage ? ` пользователя #${userId}` : ""}
                        </h1>

                        <p className="muted">
                            Здесь можно загружать, скачивать, переименовывать, удалять файлы и
                            копировать специальные ссылки для публичного доступа к ним.
                        </p>

                        <p>
                            Для загрузки файла нажмите кнопку &quot;Выберите файл&quot; или перетащите, выбранный для загрузки файл, в любое место на странице.
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

                        <div className="file-input-wrapper">
                            <input
                                id="storage-file-input"
                                className="file-input-hidden"
                                type="file"
                                onChange={(event) => {
                                    setSelectedFile(event.target.files[0] || null);
                                    setLocalError("");
                                }}
                                title="Выберите файл для загрузки в хранилище"
                            />

                            <label
                                className={`file-input-label ${selectedFile ? "has-file" : ""}`}
                                htmlFor="storage-file-input"
                            >
                                <span className="file-input-button">
                                    {selectedFile ? "Файл выбран" : "Выберите файл"}
                                </span>

                                <span className="file-input-name">
                                    {selectedFile ? selectedFile.name : "Файл не выбран"}
                                </span>
                            </label>
                        </div>
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

                    <button type="submit" disabled={uploadProgress !== null}>
                        {uploadProgress !== null ? "Загрузка..." : "Загрузить"}
                    </button>
                </form>

                {uploadProgress !== null && (
                    <ProgressBar
                        value={uploadProgress}
                        label={
                            selectedFile
                                ? `Загрузка файла "${selectedFile.name}"`
                                : "Загрузка файла"
                        }
                    />
                )}

                {downloadProgress !== null && (
                    <ProgressBar
                        value={downloadProgress}
                        label={
                            downloadingFileName
                                ? `Скачивание файла "${downloadingFileName}"`
                                : "Скачивание файла"
                        }
                    />
                )}

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
                                <th className="sortable-th" title="Сортировать по наименованию файла">
                                    <button
                                        type="button"
                                        className="sortable-th-button"
                                        onClick={() => handleSort("original_name")}
                                    >
                                        <span>Наименование файла</span>
                                        {renderSortArrow("original_name")}
                                    </button>
                                </th>

                                <th title="Комментарий пользователя">Комментарий</th>

                                <th className="sortable-th" title="Сортировать по размеру файла">
                                    <button
                                        type="button"
                                        className="sortable-th-button"
                                        onClick={() => handleSort("size")}
                                    >
                                        <span>Размер</span>
                                        {renderSortArrow("size")}
                                    </button>
                                </th>

                                <th className="sortable-th" title="Сортировать по дате загрузки файла">
                                    <button
                                        type="button"
                                        className="sortable-th-button"
                                        onClick={() => handleSort("uploaded_at")}
                                    >
                                        <span>Дата загрузки</span>
                                        {renderSortArrow("uploaded_at")}
                                    </button>
                                </th>

                                <th
                                    className="sortable-th"
                                    title="Сортировать по дате последнего скачивания"
                                >
                                    <button
                                        type="button"
                                        className="sortable-th-button"
                                        onClick={() => handleSort("last_downloaded_at")}
                                    >
                                        <span>Последнее скачивание</span>
                                        {renderSortArrow("last_downloaded_at")}
                                    </button>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedItems.map((file) => (
                                <tr key={file.id}>
                                    <td>
                                        <div className="file-name-cell">
                                            <div className="file-name-main">
                                                <FileVisual file={file} />

                                                <span className="file-name-text">
                                                    {file.original_name}
                                                </span>
                                            </div>

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
                                                        <button
                                                            type="button"
                                                            className="file-action-item"
                                                            onClick={() => handleDownload(file)}
                                                            title="Скачать файл на локальный диск"
                                                        >
                                                            <span className="file-action-icon">⬇</span>
                                                            <span>Скачать</span>
                                                        </button>

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
                                                            onClick={() => openDeleteFileModal(file)}
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

            <ConfirmModal
                open={Boolean(fileToDelete)}
                danger
                title="Подтверждение удаления файла"
                message={
                    fileToDelete
                        ? `Вы действительно хотите удалить файл "${fileToDelete.original_name}"?`
                        : ""
                }
                confirmText="Удалить"
                cancelText="Отмена"
                onConfirm={confirmDeleteFile}
                onCancel={closeDeleteFileModal}
            />

            <ConfirmModal
                open={Boolean(dragFile)}
                title="Подтверждение загрузки файла"
                message={
                    dragFile
                        ? `Загрузить файл "${dragFile.name}" в хранилище?`
                        : ""
                }
                confirmText="Загрузить файл"
                cancelText="Отмена"
                onConfirm={confirmDragUpload}
                onCancel={cancelDragUpload}
            />
        </div>
    );
}