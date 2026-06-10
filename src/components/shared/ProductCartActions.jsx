import ProductQtyControl from "./ProductQtyControl";
import { useCartProductQty } from "../../features/cart/hooks/useCartProductQty";

/**
 * Botón "Agregar al carrito" o control de cantidad según estado en CartContext.
 */
export default function ProductCartActions({
    product,
    addButtonClassName = "btn-flash-add-cart",
    addButtonLabel = "Agregar al carrito",
    pillClassName = "flash-qty-pill",
    btnClassName = "flash-qty-btn",
    valueClassName = "flash-qty-value",
}) {
    const payload = {
        id: product.id,
        name: product.name || product.nombre,
        category: product.category,
        priceBase: product.priceBase,
        price: Number(product.price ?? product.precio) || 0,
        stock: product.stock,
        unit: product.unit || "und",
        img: product.img,
    };

    const { cartQty, inCart, stock, handleAdd, handleDecrease, handleIncrease } =
        useCartProductQty(product.id, payload);

    if (inCart) {
        return (
            <ProductQtyControl
                qty={cartQty}
                stock={stock}
                onDecrease={handleDecrease}
                onIncrease={handleIncrease}
                pillClassName={pillClassName}
                btnClassName={btnClassName}
                valueClassName={valueClassName}
            />
        );
    }

    return (
        <button
            type="button"
            className={addButtonClassName}
            onClick={(e) => handleAdd(e)}
            disabled={product.stock <= 0}
            title={addButtonLabel}
        >
            {addButtonLabel}
        </button>
    );
}
