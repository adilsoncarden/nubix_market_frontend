import {
    getProductImageUrl,
    PRODUCT_PLACEHOLDER_IMAGE,
} from "../services/productService";
import { priceWithIgv } from "../../../utils/pricing";

/**
 * Normaliza ProductoResponse (admin/catalogo) al shape usado por la tienda.
 * price = unitario con IGV (visualización); priceBase = valor en BD (cálculo backend).
 */
export function mapProductoToShopItem(producto) {
    const priceBase = Number(producto.precioVenta) || 0;
    return {
        id: producto.id,
        name: producto.nombre ?? "",
        category: producto.categoriaNombre ?? "",
        priceBase,
        price: priceWithIgv(priceBase),
        descripcion: producto.descripcion ?? "",
        unit: "und",
        stock: producto.stock ?? 0,
        codigo: producto.codigo ?? "",
        tag:
            producto.stock != null && producto.stock < 10
                ? "Pocas unidades"
                : null,
        tagColor:
            producto.stock != null && producto.stock < 10 ? "tag-red" : null,
        img: getProductImageUrl(producto.imagen) || PRODUCT_PLACEHOLDER_IMAGE,
    };
}

export function mapProductosToShopItems(productos) {
    const list = Array.isArray(productos) ? productos : [];
    return list.map(mapProductoToShopItem);
}
