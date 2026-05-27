const API_BASE_URL = "/api";

function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split(";") : [];

    for (const cookie of cookies) {
        const trimmed = cookie.trim();

        if (trimmed.startsWith(`${name}=`)) {
            return decodeURIComponent(trimmed.slice(name.length + 1));
        }
    }

    return null;
}

async function parseResponse(response) {
    const contentType = response.headers.get("content-type") || "";

    if (response.status === 204) {
        return null;
    }

    if (contentType.includes("application/json")) {
        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data;
    }

    const text = await response.text();

    if (!response.ok) {
        throw { detail: text || "Ошибка запроса." };
    }

    return text;
}

async function request(method, url, data = null, options = {}) {
    const headers = {
        ...(options.headers || {})
    };

    const config = {
        method,
        headers,
        credentials: "include"
    };

    if (data instanceof FormData) {
        config.body = data;
    } else if (data !== null) {
        headers["Content-Type"] = "application/json";
        config.body = JSON.stringify(data);
    }

    if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
        const csrfToken = getCookie("csrftoken");

        if (csrfToken) {
            headers["X-CSRFToken"] = csrfToken;
        }
    }

    const response = await fetch(`${API_BASE_URL}${url}`, config);
    return parseResponse(response);
}

function xhrRequest(method, url, data = null, options = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, `${API_BASE_URL}${url}`, true);
        xhr.withCredentials = true;
        xhr.responseType = options.responseType || "json";

        const csrfToken = getCookie("csrftoken");

        if (!["GET", "HEAD", "OPTIONS"].includes(method) && csrfToken) {
            xhr.setRequestHeader("X-CSRFToken", csrfToken);
        }

        if (!(data instanceof FormData) && data !== null) {
            xhr.setRequestHeader("Content-Type", "application/json");
        }

        if (options.headers) {
            Object.entries(options.headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });
        }

        if (xhr.upload && typeof options.onUploadProgress === "function") {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    options.onUploadProgress(
                        Math.round((event.loaded / event.total) * 100)
                    );
                }
            };
        }

        if (typeof options.onDownloadProgress === "function") {
            xhr.onprogress = (event) => {
                if (event.lengthComputable) {
                    options.onDownloadProgress(
                        Math.round((event.loaded / event.total) * 100)
                    );
                }
            };
        }

        xhr.onload = () => {
            const contentType = xhr.getResponseHeader("content-type") || "";

            if (xhr.status >= 200 && xhr.status < 300) {
                if (options.responseType === "blob") {
                    resolve(xhr);
                    return;
                }

                resolve(xhr.response);
                return;
            }

            if (contentType.includes("application/json")) {
                reject(xhr.response || { detail: "Ошибка запроса." });
            } else {
                reject({ detail: xhr.responseText || "Ошибка запроса." });
            }
        };

        xhr.onerror = () => {
            reject({ detail: "Ошибка сети." });
        };

        const body =
            data instanceof FormData || data === null ? data : JSON.stringify(data);

        xhr.send(body);
    });
}

export const api = {
    get: (url) => request("GET", url),
    post: (url, data) => request("POST", url, data),
    patch: (url, data) => request("PATCH", url, data),
    delete: (url) => request("DELETE", url),

    upload: (url, formData, onUploadProgress) =>
        xhrRequest("POST", url, formData, {
            onUploadProgress
        }),

    download: (url, onDownloadProgress) =>
        xhrRequest("GET", url, null, {
            responseType: "blob",
            onDownloadProgress
        }),

    preview: (url) =>
        xhrRequest("GET", url, null, {
            responseType: "blob"
        })
};