import { Link } from "react-router-dom";
import { useFavorites } from "../../store/FavoritesContext";
import { useAuth } from "../../store/AuthContext";
import { FAVORITES_LOGIN_MESSAGE, promptLoginRequired } from "../../utils/swalConfig";
import { isTodayDealProduct } from "../../utils/todayDealProducts";
import ProductCartActions from "../shared/ProductCartActions";
import { handleProductImageError } from "../../features/products/services/productService";

const PAYMENT_LOGOS = (
    <span className="flash-card-payments" aria-hidden="true">
        <span className="pay-pill">YAPE</span>
        <span className="pay-pill">PLIN</span>
    </span>
);

export default function FlashProductCard({ p }) {
    const { toggleFavorite, isFavorite } = useFavorites();
    const { token } = useAuth();
    const showTodayDeal = isTodayDealProduct(p.id);

    const currentPrice = Number(p.price ?? p.precio) || 0;
    const priceOld = (currentPrice * 1.22).toFixed(2);
    const priceNormal = currentPrice.toFixed(2);
    const priceCard = (currentPrice * 0.94).toFixed(2);
    const vendor = p.category || "Nubix Market";
    const favorited = isFavorite(p.id);

    const buildProductPayload = () => ({
        id: p.id,
        name: p.name || p.nombre,
        category: p.category,
        priceBase: p.priceBase,
        price: currentPrice,
        stock: p.stock,
        unit: p.unit || "und",
        img: p.img,
    });

    const handleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!token) {
            await promptLoginRequired(FAVORITES_LOGIN_MESSAGE);
            return;
        }
        await toggleFavorite(p.id, buildProductPayload());
    };

    return (
        <div className="flash-product-card">
            {showTodayDeal && (
                <span className="flash-badge-today">🔔 ¡SOLO POR HOY!</span>
            )}

            <Link to={`/producto/${p.id}`} className="flash-card-link">
                <div className="flash-card-image">
                    <img
                        src={p.img}
                        alt={p.name || p.nombre}
                        loading="lazy"
                        onError={handleProductImageError}
                    />
                </div>
                <h6 className="flash-card-name">{p.name || p.nombre}</h6>
                <span className="flash-tag-interest">Te puede interesar</span>
                <span className="flash-card-vendor">{vendor}</span>

                <div className="flash-price-stack">
                    <span className="flash-price-old">S/ {priceOld}</span>
                    <span className="flash-price-normal">S/ {priceNormal}</span>
                    <div className="flash-price-card-row">
                        <span className="flash-price-card">S/ {priceCard}</span>
                        {PAYMENT_LOGOS}
                    </div>
                </div>
            </Link>

            <div className="flash-card-actions">
                <ProductCartActions product={p} />
                <button
                    type="button"
                    className={`btn-flash-fav${favorited ? " active" : ""}`}
                    onClick={handleFavorite}
                    aria-label="Favoritos"
                    title={
                        favorited
                            ? "Quitar de favoritos"
                            : "Agregar a favoritos"
                    }
                >
                    <i
                        className={`bi ${favorited ? "bi-heart-fill" : "bi-heart"}`}
                    />
                </button>
            </div>
        </div>
    );
}
