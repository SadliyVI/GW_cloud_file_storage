import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { api } from "../api/client.js";
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

export default function PublicDownloadPage() {
    const { token } = useParams();

    const [fileInfo, setFileInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [downloadProgress, setDownloadProgress] = useState(null);

    useEffect(() => {
        async function loadFileInfo() {
            try {
                setLoading(true);
                setError("");

                const data = await api.get(`/storage/public/${token}/`);
                setFileInfo(data);
            } catch (err) {
                setError(getAnyError(err) || "Не удалось получить информацию о файле.");
            } finally {
                setLoading(false);
            }
        }

        loadFileInfo();
    }, [token]);

    async function handleDownload() {
        setError("");
        setDownloadProgress(0);

        try {
            const xhr = await api.download(
                `/storage/public/${token}/download/`,
                setDownloadProgress
            );

            const filename = getFileNameFromDisposition(
                xhr.getResponseHeader("content-disposition"),
                fileInfo?.original_name || "download"
            );

            saveBlob(xhr.response, filename);
            setDownloadProgress(100);

            setTimeout(() => {
                window.close();

                if (!window.closed) {
                    window.location.href = "/";
                }
            }, 900);
        } catch (err) {
            setDownloadProgress(null);
            setError(getAnyError(err) || "Не удалось скачать файл.");
        }
    }

    return (
        <section className="download-confirm-wrapper">
            <div className="download-confirm-card">
                <h1>Потдтвердите скачивание файла!</h1>

                {loading && <p>Получение информации о файле...</p>}

                {error && <FormAlert type="error" message={error} />}

                {!loading && fileInfo && (
                    <>
                        <div className="download-file-info">
                            <p>
                                <span>Наименование файла:</span>
                                <strong>{fileInfo.original_name}</strong>
                            </p>

                            <p>
                                <span>Размер файла:</span>
                                <strong>{formatBytes(fileInfo.size)}</strong>
                            </p>
                        </div>

                        {downloadProgress !== null && (
                            <ProgressBar
                                value={downloadProgress}
                                label={`Скачивание файла "${fileInfo.original_name}"`}
                            />
                        )}

                        <div className="download-confirm-actions">
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={downloadProgress !== null}
                            >
                                {downloadProgress !== null ? "Скачивание..." : "Скачать"}
                            </button>

                            <Link className="button secondary" to="/">
                                Отмена
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}