/**
 * Autenticación separada: sesión web (cliente) vs sesión admin (panel).
 */

export const STORAGE_KEYS = {
    userToken: "userToken",
    webUser: "webUser",
    adminToken: "adminToken",
    adminUser: "adminUser",
    redirectAfterLogin: "redirectAfterLogin",
};

const LEGACY_TOKEN = "token";
const LEGACY_USER = "user";

export const ADMIN_ROLES = ["ADMIN", "EMPLEADO", "REPARTIDOR"];

/** Roles legacy con acceso amplio al panel (compatibilidad). */
export const isAdminRole = (rol) =>
    rol && ADMIN_ROLES.includes(String(rol).toUpperCase());

/** Personal interno: cualquier rol distinto de CLIENTE (incluye CAJERO y roles RBAC). */
export const isPanelEligibleRole = (rol) =>
    !!rol && String(rol).trim().toUpperCase() !== "CLIENTE";

const parseUser = (raw) => {
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const migrateLegacyAuth = () => {
    const legacyToken = localStorage.getItem(LEGACY_TOKEN);
    if (!legacyToken) return;

    if (
        localStorage.getItem(STORAGE_KEYS.userToken) ||
        localStorage.getItem(STORAGE_KEYS.adminToken)
    ) {
        localStorage.removeItem(LEGACY_TOKEN);
        localStorage.removeItem(LEGACY_USER);
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        return;
    }

    const legacyUser = parseUser(localStorage.getItem(LEGACY_USER));

    if (legacyUser && isAdminRole(legacyUser.rol)) {
        saveAdminAuthData(legacyToken, legacyUser);
    } else {
        saveWebAuthData(legacyToken, legacyUser);
    }

    localStorage.removeItem(LEGACY_TOKEN);
    localStorage.removeItem(LEGACY_USER);
    localStorage.removeItem("username");
    localStorage.removeItem("role");
};

export const getWebToken = () => localStorage.getItem(STORAGE_KEYS.userToken);

export const getAdminToken = () => localStorage.getItem(STORAGE_KEYS.adminToken);

export const getWebUser = () =>
    parseUser(localStorage.getItem(STORAGE_KEYS.webUser));

export const getAdminUser = () =>
    parseUser(localStorage.getItem(STORAGE_KEYS.adminUser));

export const isWebAuthenticated = () => !!getWebToken();

export const isAdminAuthenticated = () => !!getAdminToken();

/** Panel admin: token admin dedicado o sesión web con rol interno (no CLIENTE). */
export const canAccessAdminPanel = () => {
    if (getAdminToken()) return true;
    const webUser = getWebUser();
    return isWebAuthenticated() && isPanelEligibleRole(webUser?.rol);
};

export const getAdminPermisos = () => {
    const adminUser = getAdminUser();
    return Array.isArray(adminUser?.permisos) ? adminUser.permisos : [];
};

export const hasPermission = (perm, permisos = getAdminPermisos()) =>
    !!perm && Array.isArray(permisos) && permisos.includes(perm);

export const hasAnyPermission = (perms, permisos = getAdminPermisos()) =>
    Array.isArray(perms) && perms.some((p) => hasPermission(p, permisos));

export const getAdminSessionUser = () => {
    const adminUser = getAdminUser();
    if (adminUser) return adminUser;
    const webUser = getWebUser();
    if (isWebAuthenticated() && isPanelEligibleRole(webUser?.rol)) return webUser;
    return null;
};

export const saveWebAuthData = (token, userData) => {
    localStorage.setItem(STORAGE_KEYS.userToken, token);
    if (userData) {
        localStorage.setItem(STORAGE_KEYS.webUser, JSON.stringify(userData));
    }
};

/** Fusiona datos de perfil (dirección, teléfono) en la sesión web guardada. */
export const mergeWebUserProfile = (profile) => {
    if (!profile) return;
    const current = getWebUser() || {};
    const merged = {
        ...current,
        id: profile.id ?? current.id,
        username: profile.username ?? current.username,
        email: profile.email ?? current.email,
        rol: profile.rolNombre ?? current.rol,
        telefono: profile.telefono ?? "",
        direccion: profile.direccion ?? "",
        departamento: profile.departamento ?? "",
        provincia: profile.provincia ?? "",
        distrito: profile.distrito ?? "",
        referencia: profile.referencia ?? "",
    };
    localStorage.setItem(STORAGE_KEYS.webUser, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent("nubix:web-user-updated", { detail: merged }));
    return merged;
};

export const saveAdminAuthData = (token, userData) => {
    localStorage.setItem(STORAGE_KEYS.adminToken, token);
    if (userData) {
        localStorage.setItem(STORAGE_KEYS.adminUser, JSON.stringify(userData));
    }
};

export const clearWebAuthData = () => {
    localStorage.removeItem(STORAGE_KEYS.userToken);
    localStorage.removeItem(STORAGE_KEYS.webUser);
    localStorage.removeItem(STORAGE_KEYS.redirectAfterLogin);
};

export const clearAdminAuthData = () => {
    localStorage.removeItem(STORAGE_KEYS.adminToken);
    localStorage.removeItem(STORAGE_KEYS.adminUser);
};

export const clearAllAuthData = () => {
    clearWebAuthData();
    clearAdminAuthData();
    localStorage.removeItem(LEGACY_TOKEN);
    localStorage.removeItem(LEGACY_USER);
    localStorage.removeItem("username");
    localStorage.removeItem("role");
};

/** @deprecated usar isWebAuthenticated */
export const isAuthenticated = () => isWebAuthenticated();

/** @deprecated usar getWebToken */
export const getToken = () => getWebToken();

/** @deprecated usar clearAllAuthData o clearWeb/clearAdmin */
export const clearAuthData = clearAllAuthData;

/** @deprecated usar saveWebAuthData */
export const saveAuthData = saveWebAuthData;

export const getRedirectUrl = () => {
    const saved = localStorage.getItem(STORAGE_KEYS.redirectAfterLogin);
    return saved ? decodeURIComponent(saved) : "/";
};

export const setRedirectUrl = (url) => {
    if (url && url !== "/login") {
        localStorage.setItem(
            STORAGE_KEYS.redirectAfterLogin,
            encodeURIComponent(url),
        );
    }
};

export const clearRedirectUrl = () => {
    localStorage.removeItem(STORAGE_KEYS.redirectAfterLogin);
};

const isAdminApiPath = (pathname) =>
    pathname.startsWith("/admin") && pathname !== "/admin-login";

/**
 * Token JWT para la petición actual (ruta web vs admin).
 */
export const getTokenForRequest = (pathname = window.location.pathname) => {
    if (isAdminApiPath(pathname)) {
        const adminToken = getAdminToken();
        if (adminToken) return adminToken;
        const webUser = getWebUser();
        if (isWebAuthenticated() && isPanelEligibleRole(webUser?.rol)) {
            return getWebToken();
        }
        return null;
    }
    return getWebToken();
};
