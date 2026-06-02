import { useState, useEffect, useCallback } from "react";
import { productService } from "../services/productService";
import { useProductCatalog } from "../../../store/ProductCatalogContext";
import Swal from "sweetalert2";

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { invalidate: invalidateCatalog } = useProductCatalog();

    const fetchProducts = useCallback(async () => {
        try {
            const data = await productService.getAll({ bustCache: true });
            console.log("[Admin] Productos cargados:", data.length);
            setProducts(data);
        } catch (err) {
            console.error(
                "[Admin] Error al cargar productos:",
                err.response?.status,
                err.response?.data ?? err.message,
            );
            setProducts([]);
        }
    }, []);

    const handleDelete = async (id) => {
      
            const original = [...products];

            // ELIMINACIÓN OPTIMISTA:
            setProducts(products.filter((p) => p.id !== id)); // Optimista

            try {
                await productService.delete(id);
                invalidateCatalog();

                Swal.fire({
                    icon: "success",
                    title: "Eliminado",
                    timer: 1000,
                    showConfirmButton: false,
                });
            } catch (err) {
                setProducts(original);

                Swal.fire(
                    "Error", 
                    "No se pudo eliminar el producto.",
                    "error",
                );
            }
    };

    useEffect(() => {
        setLoading(true);
        fetchProducts().finally(() => setLoading(false));
    }, [fetchProducts]);

    return {
        products,
        loading,
        setProducts,
        fetchProducts,
        handleDelete,
        invalidateCatalog,
    };
};