import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute({ children }) {
    const { user, initialized } = useSelector((state) => state.auth);

    if (!initialized) {
        return <p>Проверка прав доступа...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!user.is_staff) {
        return <Navigate to="/storage" replace />;
    }

    return children;
}