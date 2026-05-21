export default function FormAlert({ message, type = "error" }) {
    if (!message) {
        return null;
    }

    return (
        <div className={`form-alert form-alert-${type}`} role="alert">
            {message}
        </div>
    );
}