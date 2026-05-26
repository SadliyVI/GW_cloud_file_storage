import { useState } from "react";

export default function PasswordField({
    id,
    name,
    value,
    onChange,
    placeholder = "",
    autoComplete,
    required = false,
    minLength,
    title,
    disabled = false
}) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="password-field">
            <input
                id={id}
                name={name}
                type={isVisible ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required={required}
                minLength={minLength}
                title={title}
                disabled={disabled}
            />

            <button
                type="button"
                className="password-toggle-button"
                onClick={() => setIsVisible((current) => !current)}
                aria-label={isVisible ? "Скрыть пароль" : "Показать пароль"}
                title={isVisible ? "Скрыть пароль" : "Показать пароль"}
                disabled={disabled}
            >
                {isVisible ? "Скрыть" : "Показать"}
            </button>
        </div>
    );
}