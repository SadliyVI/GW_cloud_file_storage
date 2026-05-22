export default function ProgressBar({ value = 0, label = "Выполнение..." }) {
    const safeValue = Math.max(0, Math.min(100, Math.round(value)));

    return (
        <div className="progress-box">
            <div className="progress-header">
                <span>{label}</span>
                <strong>{safeValue}%</strong>
            </div>

            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${safeValue}%` }}
                />
            </div>
        </div>
    );
}