import { useEffect, useMemo, useState } from "react";
import { favoritesService } from "../features/favorites/services/favoritesService";
import { mapProductosToShopItems } from "../features/products/utils/mapProducto";
import { useCart } from "../store/CartContext";
import { useFavorites } from "../store/FavoritesContext";

export default function FavoritesPage() {
    const { addToCart } = useCart();
    const { toggleFavorite } = useFavorites();
    const [raw, setRaw] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const items = useMemo(() => mapProductosToShopItems(raw), [raw]);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await favoritesService.list();
            setRaw(data);
        } catch (e) {
            setError("No se pudieron cargar tus favoritos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleRemove = async (id) => {
        try {
            await toggleFavorite(id);
            setRaw((prev) => prev.filter((p) => p.id !== id));
        } catch {
            // noop; se muestra error general al recargar
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-success" role="status"></div>
                <p className="mt-3 text-muted">Cargando favoritos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5 text-center">
                <i className="bi bi-exclamation-triangle fs-1 text-muted"></i>
                <p className="mt-2">{error}</p>
                <button className="btn btn-outline-success" onClick={load}>
                    Reintentar
                </button>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container py-5 text-center">
                <i className="bi bi-heart fs-1 text-muted"></i>
                <h4 className="mt-3">Aún no tienes favoritos</h4>
                <p className="text-muted">
                    Agrega productos a favoritos para verlos aquí.
                </p>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="mb-0">
                    <i className="bi bi-heart-fill me-2 text-danger"></i>Mis
                    favoritos
                </h3>
                <button className="btn btn-outline-secondary btn-sm" onClick={load}>
                    Actualizar
                </button>
            </div>

            <div className="row g-3">
                {items.map((p) => (
                    <div key={p.id} className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm border-0">
                            <img
                                src={p.img}
                                alt={p.name}
                                className="card-img-top product-img-contain"
                                loading="lazy"
                            />
                            <div className="card-body">
                                <div className="text-muted small">{p.category}</div>
                                <div className="fw-bold">{p.name}</div>
                                <div className="mt-2 d-flex align-items-center justify-content-between">
                                    <div className="fw-bold text-success">
                                        S/ {p.price.toFixed(2)}
                                    </div>
                                    <div className="small text-muted">
                                        Stock: {p.stock}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer bg-white border-0 d-flex gap-2">
                                <button
                                    className="btn btn-success w-100"
                                    onClick={() => addToCart(p)}
                                    disabled={p.stock <= 0}
                                >
                                    <i className="bi bi-cart-plus me-2"></i>
                                    Agregar
                                </button>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => handleRemove(p.id)}
                                    title="Quitar de favoritos"
                                >
                                    <i className="bi bi-heartbreak"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

