import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import api from "../config/axios";
import { favoritesService } from "../features/favorites/services/favoritesService";

const FavoritesContext = createContext(null);
const LOCAL_KEY = "nubix_favorites_pending";

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

export function FavoritesProvider({ children }) {
    const { token } = useAuth();
    const [favoriteIds, dispatch] = useReducer(reducer, [], () => {
        try {
            return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
        } catch {
            return [];
        }
    });

    // Cargar favoritos del servidor
    const loadServerFavorites = useCallback(async () => {
        try {
            const productos = await favoritesService.list();
            const ids = productos.map((p) => p.id);
            dispatch({ type: "SET_ALL", ids });
            localStorage.removeItem(LOCAL_KEY);
        } catch (err) {
            console.error("Error cargando favoritos del servidor", err);
        }
    }, []);

    // Sincronizar favoritos cuando el usuario se autentica
    useEffect(() => {
        if (!token) return;

        const syncFavorites = async () => {
            try {
                // Si hay favoritos pendientes en localStorage, sincronizarlos
                const pending = (() => {
                    try {
                        return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
                    } catch {
                        return [];
                    }
                })();

                if (Array.isArray(pending) && pending.length > 0) {
                    for (const productoId of pending) {
                        await favoritesService.toggle(productoId);
                    }
                    localStorage.removeItem(LOCAL_KEY);
                }

                // Luego cargar los favoritos del servidor
                await loadServerFavorites();
            } catch (err) {
                console.error("Error sincronizando favoritos", err);
            }
        };

        syncFavorites();
    }, [token, loadServerFavorites]);

    // Guardar favoritos locales en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(favoriteIds));
    }, [favoriteIds]);

    const toggleFavorite = useCallback(
        async (productoId) => {
            if (!token) {
                // No autenticado: solo actualizar local
                const isFavorite = favoriteIds.includes(productoId);
                if (isFavorite) {
                    dispatch({ type: "REMOVE", productoId });
                } else {
                    dispatch({ type: "ADD", productoId });
                }
                return;
            }

            // Autenticado: actualizar en servidor
            try {
                const isFavorite = await favoritesService.toggle(productoId);
                if (isFavorite) {
                    dispatch({ type: "ADD", productoId });
                } else {
                    dispatch({ type: "REMOVE", productoId });
                }
            } catch (err) {
                console.error("Error al toggle favorito", err);
            }
        },
        [token, favoriteIds],
    );

    const isFavorite = useCallback(
        (productoId) => favoriteIds.includes(productoId),
        [favoriteIds],
    );

    return (
        <FavoritesContext.Provider
            value={{
                favoriteIds,
                toggleFavorite,
                isFavorite,
                count: favoriteIds.length,
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
