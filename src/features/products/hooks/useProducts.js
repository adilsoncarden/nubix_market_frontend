import { useState, useEffect } from "react";
import { productService } from "../services/productService";
import Swal from "sweetalert2";

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        try {
            const data = await productService.getAll();
            setProducts(data);
        } catch (err) {
            console.error("Error al cargar productos", err);
        }
    };

    const handleDelete = async (id) => {
      
            const original = [...products];

            // ELIMINACIÓN OPTIMISTA:
            setProducts(products.filter((p) => p.id !== id)); // Optimista

            try {
                await productService.delete(id);

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
    }, []);

    return { products, loading, setProducts, fetchProducts, handleDelete };
};