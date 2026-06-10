import { useState } from "react";
import { useFavorites } from "../../store/FavoritesContext";
import { useAuth } from "../../store/AuthContext";
import {
    FAVORITES_LOGIN_MESSAGE,
    promptLoginRequired,
} from "../../utils/swalConfig";

export default function ProductFavoriteButton({ product, className = "" }) {
    const { toggleFavorite, isFavorite } = useFavorites();
    const { token } = useAuth();
    const [animating, setAnimating] = useState(false);

    if (!product?.id) return null;

    const favorited = isFavorite(product.id);
    const currentPrice = Number(product.price ?? product.precio) || 0;

    const buildProductPayload = () => ({
        id: product.id,
        name: product.name || product.nombre,
        category: product.category,
        priceBase: product.priceBase,
        price: currentPrice,
        stock: product.stock,
        unit: product.unit || "und",
        img: product.img,
        descripcion: product.descripcion,
        codigo: product.codigo,
    });

    const handleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!token) {
            void promptLoginRequired(FAVORITES_LOGIN_MESSAGE);
            return;
        }
        setAnimating(true);
        window.setTimeout(() => setAnimating(false), 280);
        void toggleFavorite(product.id, buildProductPayload());
    };

    return (
        <button
            type="button"
            className={`btn-flash-fav${favorited ? " active" : ""}${animating ? " fav-pop" : ""}${className ? ` ${className}` : ""}`}
            onClick={handleFavorite}
            aria-label="Favoritos"
            title={
                favorited ? "Quitar de favoritos" : "Agregar a favoritos"
            }
        >
            <i
                className={`bi ${favorited ? "bi-heart-fill" : "bi-heart"}`}
            />
        </button>
    );
}
