/**
 * Utilidades centrales de autenticación
 * Evita duplicación de lógica y sincroniza el estado de auth
 */

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean}
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

/**
 * Obtiene el token guardado
 * @returns {string|null}
 */
export const getToken = () => {
    return localStorage.getItem("token");
};

/**
 * Obtiene el URL a redireccionar después del login
 * @returns {string} URL destino o "/" por defecto
 */
export const getRedirectUrl = () => {
    const saved = localStorage.getItem("redirectAfterLogin");
    return saved ? decodeURIComponent(saved) : "/";
};

/**
 * Guarda el URL destino ANTES de redirigir a login
 * @param {string} url - URL a redireccionar después del login
 */
export const setRedirectUrl = (url) => {
    if (url && url !== "/login") {
        localStorage.setItem("redirectAfterLogin", encodeURIComponent(url));
    }
};

/**
 * Limpia el URL de redirección después de usarlo
 */
export const clearRedirectUrl = () => {
    localStorage.removeItem("redirectAfterLogin");
};

/**
 * Limpia TODOS los datos de autenticación
 */
export const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("redirectAfterLogin");
};

/**
 * Guarda los datos del usuario autenticado
 * @param {string} token - Token JWT
 * @param {object} userData - Datos del usuario {username, role, ...}
 */
export const saveAuthData = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.username) {
        localStorage.setItem("username", userData.username);
    }
    if (userData.rol) {
        localStorage.setItem("role", userData.rol);
    }
};
