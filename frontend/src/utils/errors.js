export function normalizeErrorValue(value) {
    if (!value) {
        return "";
    }

    if (Array.isArray(value)) {
        return value.join(" ");
    }

    if (typeof value === "string") {
        return value;
    }

    if (typeof value === "object") {
        return Object.values(value)
            .flat()
            .map((item) => normalizeErrorValue(item))
            .filter(Boolean)
            .join(" ");
    }

    return String(value);
}

export function getFieldError(error, fieldName) {
    return normalizeErrorValue(error?.errors?.[fieldName] || error?.[fieldName]);
}

export function getCommonError(error) {
    if (!error) {
        return "";
    }

    if (error.detail) {
        return normalizeErrorValue(error.detail);
    }

    if (error.errors?.non_field_errors) {
        return normalizeErrorValue(error.errors.non_field_errors);
    }

    if (error.non_field_errors) {
        return normalizeErrorValue(error.non_field_errors);
    }

    if (error.message) {
        return normalizeErrorValue(error.message);
    }

    return "";
}

export function getAnyError(error) {
    return getCommonError(error) || normalizeErrorValue(error);
}