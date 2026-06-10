import { Link } from "react-router-dom";
import { isTodayDealProduct } from "../../utils/todayDealProducts";
import ProductCartActions from "../shared/ProductCartActions";
import ProductFavoriteButton from "../shared/ProductFavoriteButton";
import { handleProductImageError } from "../../features/products/services/productService";

const PAYMENT_LOGOS = (
    <span className="flash-card-payments" aria-hidden="true">
        <span className="pay-pill">YAPE</span>
        <span className="pay-pill">PLIN</span>
    </span>
);

export default function FlashProductCard({ p }) {
    const showTodayDeal = isTodayDealProduct(p.id);

    const currentPrice = Number(p.price ?? p.precio) || 0;
    const priceOld = (currentPrice * 1.22).toFixed(2);
    const priceNormal = currentPrice.toFixed(2);
    const priceCard = (currentPrice * 0.94).toFixed(2);
    const vendor = p.category || "Nubix Market";

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
                <ProductFavoriteButton product={p} />
            </div>
        </div>
    );
}
