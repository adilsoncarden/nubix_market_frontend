import { getProductImageUrl } from "../services/productService";

const PLACEHOLDER_IMAGE =
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";

/**
 * Normaliza ProductoResponse (admin/catalogo) al shape usado por la tienda.
 */
export function mapProductoToShopItem(producto) {
    return {
        id: producto.id,
        name: producto.nombre ?? "",
        category: producto.categoriaNombre ?? "",
        price: Number(producto.precioVenta) || 0,
        descripcion: producto.descripcion ?? "",
        unit: "und",
        stock: producto.stock ?? 0,
        codigo: producto.codigo ?? "",
        tag: producto.stock != null && producto.stock < 10 ? "Pocas unidades" : null,
        tagColor:
            producto.stock != null && producto.stock < 10 ? "tag-red" : null,
        img: getProductImageUrl(producto.imagen) || PLACEHOLDER_IMAGE,
    };
}

export function mapProductosToShopItems(productos) {
    const list = Array.isArray(productos) ? productos : [];
    return list.map(mapProductoToShopItem);
}
