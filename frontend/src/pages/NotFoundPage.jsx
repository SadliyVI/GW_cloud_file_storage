import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <section className="card">
            <h1>404</h1>
            <p>Страница не найдена.</p>
            <Link className="button" to="/">На главную</Link>
        </section>
    );
}