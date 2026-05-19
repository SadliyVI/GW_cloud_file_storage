const API_BASE = "/api";

function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split(";") : [];

    for (const cookie of cookies) {
        const trimmed = cookie.trim();

        if (trimmed.startsWith(`${name}=`)) {
            return decodeURIComponent(trimmed.substring(name.length + 1));
        }
    }

    return null;
}

function isUnsafeMethod(method) {
    return ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
}

async function request(path, options = {}) {
    const method = options.method || "GET";

    const headers = {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {})
    };

    if (isUnsafeMethod(method)) {
        const csrfToken = getCookie("csrftoken");

        if (csrfToken) {
            headers["X-CSRFToken"] = csrfToken;
        }
    }

    const config = {
        credentials: "include",
        headers,
        ...options
    };

    const response = await fetch(`${API_BASE}${path}`, config);

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
        let errorPayload = {
            detail: `Ошибка запроса. HTTP ${response.status}`
        };

        if (contentType.includes("application/json")) {
            errorPayload = await response.json();
        }

        throw errorPayload;
    }

    if (contentType.includes("application/json")) {
        return response.json();
    }

    return response;
}

export const api = {
    csrf: () => request("/csrf/"),

    get: (path) => request(path),

    post: (path, body) =>
        request(path, {
            method: "POST",
            body: body instanceof FormData ? body : JSON.stringify(body)
        }),

    patch: (path, body) =>
        request(path, {
            method: "PATCH",
            body: JSON.stringify(body)
        }),

    delete: (path) =>
        request(path, {
            method: "DELETE"
        })
};