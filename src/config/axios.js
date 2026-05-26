import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL?.replace(/\/?$/, "") ||
        "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
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
        return Promise.reject(error);
    },
);

export default api;
