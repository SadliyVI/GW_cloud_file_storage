import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
    const { user, initialized } = useSelector((state) => state.auth);

    if (!initialized) {
        return <p>Проверка авторизации...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}