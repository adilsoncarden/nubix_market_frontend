import { useCallback, useEffect, useState } from "react";
import { useProductCatalog } from "../../../store/ProductCatalogContext";
import { productService } from "../services/productService";
import { mapProductosToShopItems } from "../utils/mapProducto";

export function useShopProducts() {
    const { version } = useProductCatalog();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [productos, categorias] = await Promise.all([
                productService.getCatalog({ bustCache: true }),
                productService.getCatalogCategories({ bustCache: true }),
            ]);

            const mapped = mapProductosToShopItems(productos);
            setProducts(mapped);
            console.log(
                "[Shop] Catálogo cargado:",
                mapped.length,
                "productos,",
                categorias?.length ?? 0,
                "categorías API",
            );

            const fromApi = (categorias ?? []).map((c) => c.nombre).filter(Boolean);
            const fromProducts = [
                ...new Set(mapped.map((p) => p.category).filter(Boolean)),
            ];
            const merged = [...new Set([...fromApi, ...fromProducts])].sort(
                (a, b) => a.localeCompare(b, "es"),
            );
            setCategories(merged);
        } catch (err) {
            console.error(
                "[Shop] Error al cargar catálogo:",
                err.response?.status,
                err.response?.data ?? err.message,
            );
            setError(err);
            setProducts([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts, version]);

    useEffect(() => {
        const onFocus = () => fetchProducts();
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, [fetchProducts]);

    return {
        products,
        categories,
        loading,
        error,
        refetch: fetchProducts,
    };
}
