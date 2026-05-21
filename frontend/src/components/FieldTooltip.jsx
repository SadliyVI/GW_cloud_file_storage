export default function FieldTooltip({ message }) {
    if (!message) {
        return null;
    }

    return (
        <div className="field-tooltip" role="alert">
            {message}
        </div>
    );
}