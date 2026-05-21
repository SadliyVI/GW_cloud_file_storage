import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import FormAlert from "../components/FormAlert.jsx";
import { api } from "../api/client.js";
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

export default function PublicDownloadPage() {
    const { token } = useParams();

    const [fileInfo, setFileInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    function handleDownload() {
        window.location.href = `/api/storage/public/${token}/download/`;
    }

    return (
        <section className="download-confirm-wrapper">
            <div className="download-confirm-card">
                <h1>Подтвердите скачивание файла!</h1>

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

                        <div className="download-confirm-actions">
                            <button type="button" onClick={handleDownload}>
                                Скачать
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