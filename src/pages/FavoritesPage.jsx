import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { favoritesService } from "../features/favorites/services/favoritesService";
import FlashProductCard from "../components/landing/FlashProductCard";
import { useAuth } from "../store/AuthContext";
import { useFavorites } from "../store/FavoritesContext";
import {
    resolveUserId,
    loadUserFavoriteCache,
    persistFavoritesFromServer,
} from "../utils/favoritesStorage";
import "../styles/landing.css";
import "../styles/favorites.css";

export default function FavoritesPage() {
    const { webToken, webUser } = useAuth();
    const userId = resolveUserId(webUser);
    const { favoriteIds } = useFavorites();
    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const items = useMemo(
        () => catalog.filter((p) => favoriteIds.includes(p.id)),
        [catalog, favoriteIds],
    );

    useEffect(() => {
        let cancelled = false;

        const hydrate = async () => {
            setError(null);

            if (!webToken || !userId) {
                setCatalog([]);
                if (!cancelled) setLoading(false);
                return;
            }

            const cached = loadUserFavoriteCache(userId);
            if (cached.length > 0 && !cancelled) {
                setCatalog(cached);
            }

            try {
                const data = await favoritesService.list();
                if (cancelled) return;
                const { mapped } = persistFavoritesFromServer(userId, data);
                setCatalog(mapped);
            } catch {
                if (!cancelled) {
                    setError(
                        "No se pudieron sincronizar tus favoritos. Mostramos los guardados en este dispositivo.",
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        setLoading(true);
        hydrate();

        return () => {
            cancelled = true;
        };
    }, [webToken, userId]);

    if (!webToken) {
        return <Navigate to="/login" replace />;
    }

    if (loading && items.length === 0) {
        return (
            <div className="favorites-page">
                <div className="container py-4">
                    <div className="favorites-loading">
                        <div
                            className="spinner-border text-success"
                            role="status"
                            aria-label="Cargando"
                        />
                        <p className="mt-3 text-muted mb-0">
                            Cargando favoritos...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0 && !loading) {
        return (
            <div className="favorites-page">
                <div className="container py-4">
                    <header className="favorites-header">
                        <h1 className="favorites-title">
                            <i
                                className="bi bi-heart favorites-title-icon"
                                aria-hidden="true"
                            />
                            <span>Mis favoritos</span>
                        </h1>
                    </header>
                    <div className="favorites-empty">
                        <i
                            className="bi bi-heart favorites-empty-icon"
                            aria-hidden="true"
                        />
                        <h4 className="mb-2">Aún no tienes favoritos</h4>
                        <p className="text-muted mb-0">
                            Marca productos con el corazón en la tienda y
                            revísalos aquí cuando quieras.
                        </p>
                        <Link to="/shop" className="favorites-cta">
                            Explorar tienda
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-page">
            <div className="container py-4">
                <header className="favorites-header">
                    <h1 className="favorites-title">
                        <i
                            className="bi bi-heart favorites-title-icon"
                            aria-hidden="true"
                        />
                        <span>Mis favoritos</span>
                    </h1>
                    <span className="favorites-count-pill">
                        {items.length}{" "}
                        {items.length === 1 ? "producto" : "productos"}
                    </span>
                </header>

                {error && (
                    <div
                        className="alert alert-warning py-2 px-3 small mb-4 rounded-3"
                        role="status"
                    >
                        {error}
                    </div>
                )}

                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4 favorites-grid">
                    {items.map((p) => (
                        <div key={p.id} className="col d-flex">
                            <div className="favorites-card-wrap w-100">
                                <FlashProductCard p={p} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
