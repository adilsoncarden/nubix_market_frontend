import axios from "axios";
import {
    clearWebAuthData,
    clearAdminAuthData,
    getTokenForRequest,
    getWebUser,
    isAdminRole,
} from "../utils/authUtils";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL?.replace(/\/?$/, "") ||
        "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = getTokenForRequest(window.location.pathname);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url;
        const status = error.response?.status;
        const message = error.response?.data ?? error.message;
        console.error(
            `[API] ${error.config?.method?.toUpperCase() ?? "?"} ${url} → ${status ?? "network"}:`,
            message,
        );
        if (status === 401 && !url?.includes("/auth/")) {
            const path = window.location.pathname;
            const isAdminRoute =
                path.startsWith("/admin") && path !== "/admin-login";

            if (isAdminRoute) {
                clearAdminAuthData();
                const webUser = getWebUser();
                if (isAdminRole(webUser?.rol)) {
                    clearWebAuthData();
                }
                if (!path.includes("/admin-login")) {
                    window.location.href = "/admin-login";
                }
            } else {
                clearWebAuthData();
                if (!path.includes("/login")) {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    },
);

export default api;
