import axios from "axios";
import {
    clearWebAuthData,
    clearAdminAuthData,
    getTokenForRequest,
    getWebUser,
    isPanelEligibleRole,
} from "../utils/authUtils";
import {
    FORBIDDEN_TOAST_MESSAGE,
    getApiErrorMessage,
    isForbiddenError,
} from "../utils/apiErrorUtils";
import { Toast } from "../utils/swalConfig";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL?.replace(/\/?$/, "") ||
        "https://nubix-market-backend.onrender.com/api",
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

const showForbiddenToast = (error) => {
    const backendMessage = getApiErrorMessage(error, "");
    Toast.fire({
        icon: "warning",
        title: FORBIDDEN_TOAST_MESSAGE,
        text: backendMessage && backendMessage !== FORBIDDEN_TOAST_MESSAGE
            ? backendMessage
            : undefined,
        timer: 4500,
    });
};

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

        if (status === 403 && !error.config?.silent403) {
            showForbiddenToast(error);
        }

        if (status === 401 && !url?.includes("/auth/")) {
            const path = window.location.pathname;
            const isAdminRoute =
                path.startsWith("/admin") && path !== "/admin-login";

            if (isAdminRoute) {
                clearAdminAuthData();
                const webUser = getWebUser();
                if (isPanelEligibleRole(webUser?.rol)) {
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

export { isForbiddenError, getApiErrorMessage, FORBIDDEN_TOAST_MESSAGE };
export default api;
