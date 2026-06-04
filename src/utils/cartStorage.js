const CART_KEY = "nubix_cart";

export function loadCartFromLocalStorage() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function hasWebSessionToken() {
    return Boolean(localStorage.getItem("userToken"));
}
