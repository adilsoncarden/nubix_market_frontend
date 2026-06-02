import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const STORAGE_BY_SCOPE = {
    web: "nubix-web-theme",
    admin: "nubix-admin-theme",
};

/**
 * Tema por ámbito: no modifica document.documentElement.
 * Web y admin guardan preferencias en localStorage separados.
 */
const readInitialTheme = (scope) => {
    const storageKey = STORAGE_BY_SCOPE[scope] || STORAGE_BY_SCOPE.web;
    let saved = localStorage.getItem(storageKey);
    if (scope === "admin" && !saved) {
        const legacy = localStorage.getItem("nubix-theme");
        if (legacy) {
            localStorage.setItem(storageKey, legacy);
            saved = legacy;
        }
    }
    return saved || "light";
};

export const ThemeProvider = ({ children, scope = "web" }) => {
    const storageKey = STORAGE_BY_SCOPE[scope] || STORAGE_BY_SCOPE.web;
    const [theme, setTheme] = useState(() => readInitialTheme(scope));

    useEffect(() => {
        localStorage.setItem(storageKey, theme);
    }, [theme, storageKey]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, scope }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme debe usarse dentro de ThemeProvider");
    }
    return context;
};
