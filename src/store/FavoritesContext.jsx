import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { favoritesService } from "../features/favorites/services/favoritesService";
import { favToastAdded, favToastRemoved } from "../utils/swalConfig";
import { getWebUser } from "../utils/authUtils";
import {
    resolveUserId,
    loadUserFavoriteIds,
    saveUserFavoriteIds,
    loadUserFavoriteCache,
    upsertFavoriteInCache,
    removeFavoriteFromCache,
    persistFavoritesFromServer,
} from "../utils/favoritesStorage";

const FavoritesContext = createContext(null);

function reducer(state, { type, productoId, ids }) {
    switch (type) {
        case "ADD":
            return state.includes(productoId) ? state : [...state, productoId];
        case "REMOVE":
            return state.filter((id) => id !== productoId);
        case "SET_ALL":
            return Array.isArray(ids) ? ids : [];
        case "CLEAR":
            return [];
        default:
            return state;
    }
}

function readInitialFavoriteIds() {
    const userId = resolveUserId(getWebUser());
    if (!userId || !localStorage.getItem("userToken")) return [];
    return loadUserFavoriteIds(userId);
}

export function FavoritesProvider({ children }) {
    const { webToken, webUser } = useAuth();
    const userId = resolveUserId(webUser);
    const [favoriteIds, dispatch] = useReducer(reducer, [], readInitialFavoriteIds);

    const loadServerFavorites = useCallback(async (activeUserId) => {
        if (!activeUserId) return;
        try {
            const productos = await favoritesService.list();
            const { ids } = persistFavoritesFromServer(activeUserId, productos);
            dispatch({ type: "SET_ALL", ids });
        } catch (err) {
            console.error("Error cargando favoritos del servidor", err);
        }
    }, []);

    useEffect(() => {
        if (!webToken || !userId) {
            dispatch({ type: "CLEAR" });
            return;
        }

        const localIds = loadUserFavoriteIds(userId);
        dispatch({ type: "SET_ALL", ids: localIds });

        const syncFavorites = async () => {
            try {
                let serverIds = [];
                try {
                    const productos = await favoritesService.list();
                    serverIds = productos.map((p) => p.id);
                } catch {
                    serverIds = [];
                }

                const missingOnServer = localIds.filter(
                    (id) => !serverIds.includes(id),
                );
                for (const productoId of missingOnServer) {
                    try {
                        await favoritesService.toggle(productoId);
                    } catch (err) {
                        console.error(
                            "Error sincronizando favorito pendiente",
                            productoId,
                            err,
                        );
                    }
                }

                await loadServerFavorites(userId);
            } catch (err) {
                console.error("Error sincronizando favoritos", err);
            }
        };

        syncFavorites();
    }, [webToken, userId, loadServerFavorites]);

    useEffect(() => {
        if (!userId) return;
        saveUserFavoriteIds(userId, favoriteIds);
    }, [favoriteIds, userId]);

    const toggleFavorite = useCallback(
        async (productoId, productSnapshot = null) => {
            if (!webToken || !userId) return false;

            const wasFavorite = favoriteIds.includes(productoId);
            const willBeFavorite = !wasFavorite;

            if (willBeFavorite) {
                dispatch({ type: "ADD", productoId });
                if (productSnapshot) {
                    upsertFavoriteInCache(userId, productSnapshot);
                }
                favToastAdded();
            } else {
                dispatch({ type: "REMOVE", productoId });
                removeFavoriteFromCache(userId, productoId);
                favToastRemoved();
            }

            try {
                const isFavorite = await favoritesService.toggle(productoId);
                if (isFavorite !== willBeFavorite) {
                    if (isFavorite) {
                        dispatch({ type: "ADD", productoId });
                        if (productSnapshot) {
                            upsertFavoriteInCache(userId, productSnapshot);
                        }
                    } else {
                        dispatch({ type: "REMOVE", productoId });
                        removeFavoriteFromCache(userId, productoId);
                    }
                }
                return true;
            } catch (err) {
                console.error("Error al toggle favorito", err);
                if (wasFavorite) {
                    dispatch({ type: "ADD", productoId });
                    if (productSnapshot) {
                        upsertFavoriteInCache(userId, productSnapshot);
                    }
                } else {
                    dispatch({ type: "REMOVE", productoId });
                    removeFavoriteFromCache(userId, productoId);
                }
                return false;
            }
        },
        [webToken, userId, favoriteIds],
    );

    const isFavorite = useCallback(
        (productoId) => favoriteIds.includes(productoId),
        [favoriteIds],
    );

    const getCachedProducts = useCallback(() => {
        if (!userId) return [];
        return loadUserFavoriteCache(userId);
    }, [userId]);

    return (
        <FavoritesContext.Provider
            value={{
                favoriteIds,
                toggleFavorite,
                isFavorite,
                count: favoriteIds.length,
                userId,
                getCachedProducts,
                reloadFavorites: () => loadServerFavorites(userId),
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => {
    const ctx = useContext(FavoritesContext);
    if (!ctx) {
        throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
    }
    return ctx;
};
