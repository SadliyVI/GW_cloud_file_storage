function generatePassword() {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const special = "!@#$%^&*_-+=?";
    const all = upper + lower + digits + special;

    const chars = [
        upper[Math.floor(Math.random() * upper.length)],
        digits[Math.floor(Math.random() * digits.length)],
        special[Math.floor(Math.random() * special.length)]
    ];

    for (let i = chars.length; i < 10; i += 1) {
        chars.push(all[Math.floor(Math.random() * all.length)]);
    }

    return chars.sort(() => Math.random() - 0.5).join("");
}

export default function PasswordGenerator({ onGenerate }) {
    function handleGenerate() {
        onGenerate(generatePassword());
    }

    return (
        <button
            type="button"
            className="secondary"
            title="Сгенерировать пароль, соответствующий требованиям безопасности"
            onClick={handleGenerate}
        >
            Сгенерировать пароль
        </button>
    );
}