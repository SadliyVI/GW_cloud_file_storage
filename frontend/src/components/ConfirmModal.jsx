export default function ConfirmModal({
    open,
    title = "Подтверждение действия",
    message = "Вы уверены?",
    confirmText = "Подтвердить",
    cancelText = "Отмена",
    danger = false,
    onConfirm,
    onCancel
}) {
    if (!open) {
        return null;
    }

    return (
        <div className="modal-backdrop" onMouseDown={onCancel}>
            <div
                className="confirm-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="confirm-modal-header">
                    <div
                        className={
                            danger
                                ? "confirm-modal-icon confirm-modal-icon-danger"
                                : "confirm-modal-icon"
                        }
                    >
                        {danger ? "!" : "?"}
                    </div>

                    <div>
                        <h2 id="confirm-modal-title">{title}</h2>
                        <p>{message}</p>
                    </div>
                </div>

                <div className="confirm-modal-actions">
                    <button type="button" className="secondary" onClick={onCancel}>
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className={danger ? "danger" : ""}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}