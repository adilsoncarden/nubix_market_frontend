import { mapProductosToShopItems } from "../features/products/utils/mapProducto";

const LEGACY_IDS_KEY = "favorites";
const LEGACY_CACHE_KEY = "nubix_favorites_cache";
const LEGACY_PENDING_KEY = "nubix_favorites_pending";

/** @returns {number|string|null} */
export function resolveUserId(user) {
    if (!user) return null;
    const id = user.id ?? user.usuarioId ?? user.userId;
    if (id === undefined || id === null || id === "") return null;
    return id;
}

export function getUserFavoritesKey(userId) {
    return `favorites_user_${userId}`;
}

export function getUserCacheKey(userId) {
    return `favorites_cache_user_${userId}`;
}

function safeParse(raw, fallback) {
    try {
        const parsed = JSON.parse(raw);
        return parsed ?? fallback;
    } catch {
        return fallback;
    }
}

function normalizeIds(ids) {
    return Array.isArray(ids)
        ? ids.filter((id) => Number.isFinite(Number(id)))
        : [];
}

/** Migra claves globales legadas al bucket del usuario (una sola vez). */
export function migrateLegacyGlobalFavorites(userId) {
    if (!userId) return;
    const userKey = getUserFavoritesKey(userId);
    if (localStorage.getItem(userKey)) return;

    let legacyIds = safeParse(localStorage.getItem(LEGACY_IDS_KEY), []);
    if (!legacyIds.length) {
        legacyIds = safeParse(localStorage.getItem(LEGACY_PENDING_KEY), []);
    }
    const legacyProducts = safeParse(
        localStorage.getItem(LEGACY_CACHE_KEY),
        [],
    );

    if (!legacyIds.length && !legacyProducts.length) return;

    saveUserFavoriteIds(userId, normalizeIds(legacyIds));
    if (Array.isArray(legacyProducts) && legacyProducts.length) {
        saveUserFavoriteCache(userId, legacyProducts);
    }

    localStorage.removeItem(LEGACY_IDS_KEY);
    localStorage.removeItem(LEGACY_CACHE_KEY);
    localStorage.removeItem(LEGACY_PENDING_KEY);
}

export function loadUserFavoriteIds(userId) {
    if (!userId) return [];
    migrateLegacyGlobalFavorites(userId);
    const raw = localStorage.getItem(getUserFavoritesKey(userId));
    return normalizeIds(safeParse(raw, []));
}

export function saveUserFavoriteIds(userId, ids) {
    if (!userId) return;
    localStorage.setItem(
        getUserFavoritesKey(userId),
        JSON.stringify(normalizeIds(ids)),
    );
}

export function loadUserFavoriteCache(userId) {
    if (!userId) return [];
    migrateLegacyGlobalFavorites(userId);
    const list = safeParse(localStorage.getItem(getUserCacheKey(userId)), []);
    return Array.isArray(list) ? list : [];
}

export function saveUserFavoriteCache(userId, products) {
    if (!userId) return;
    localStorage.setItem(
        getUserCacheKey(userId),
        JSON.stringify(Array.isArray(products) ? products : []),
    );
}

/** Normaliza un producto de tienda para guardarlo en caché. */
export function normalizeFavoriteSnapshot(product) {
    if (!product?.id) return null;
    const price = Number(product.price ?? product.precio) || 0;
    return {
        id: product.id,
        name: product.name ?? product.nombre ?? "",
        category: product.category ?? "",
        priceBase: product.priceBase ?? price,
        price,
        stock: product.stock ?? 0,
        unit: product.unit || "und",
        img: product.img ?? "",
        descripcion: product.descripcion ?? "",
        codigo: product.codigo ?? "",
        tag: product.tag ?? null,
        tagColor: product.tagColor ?? null,
    };
}

export function upsertFavoriteInCache(userId, product) {
    if (!userId) return [];
    const snapshot = normalizeFavoriteSnapshot(product);
    if (!snapshot) return loadUserFavoriteCache(userId);
    const cache = loadUserFavoriteCache(userId);
    const idx = cache.findIndex((p) => p.id === snapshot.id);
    if (idx >= 0) cache[idx] = snapshot;
    else cache.push(snapshot);
    saveUserFavoriteCache(userId, cache);
    return cache;
}

export function removeFavoriteFromCache(userId, productoId) {
    if (!userId) return [];
    const cache = loadUserFavoriteCache(userId).filter(
        (p) => p.id !== productoId,
    );
    saveUserFavoriteCache(userId, cache);
    return cache;
}

export function persistFavoritesFromServer(userId, productos) {
    if (!userId) return { ids: [], mapped: [] };
    const mapped = mapProductosToShopItems(productos);
    const ids = mapped.map((p) => p.id);
    saveUserFavoriteIds(userId, ids);
    saveUserFavoriteCache(userId, mapped);
    return { ids, mapped };
}
