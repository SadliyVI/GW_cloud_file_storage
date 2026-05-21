import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import StoragePage from "./pages/StoragePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import { fetchCurrentUser } from "./features/auth/authSlice.js";
import { api } from "./api/client.js";

import PublicDownloadPage from "./pages/PublicDownloadPage.jsx";

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        async function initializeApp() {
            try {
                await api.csrf();
            } finally {
                dispatch(fetchCurrentUser());
            }
        }

        initializeApp();
    }, [dispatch]);

    return (
        <>
            <Navbar />

            <main className="container">
                <Routes>
                    <Route path="/" element={<HomePage />} />

                    <Route path="/login" element={<LoginPage mode="user" />} />
                    <Route path="/login/admin" element={<LoginPage mode="admin" />} />

                    <Route path="/register" element={<RegisterPage />} />

                    <Route
                        path="/storage"
                        element={
                            <ProtectedRoute>
                                <StoragePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/storage/:userId"
                        element={
                            <ProtectedRoute>
                                <StoragePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminPage />
                            </AdminRoute>
                        }
                    />

                    <Route path="/public/:token" element={<PublicDownloadPage />} />

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
        </>
    );
}