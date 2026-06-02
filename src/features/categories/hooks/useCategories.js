import { useState, useEffect } from "react";
import { categoryService } from "../services/categoryService";
import { confirmDelete, Toast } from "../../../utils/swalConfig";

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAll();
            console.log("[Admin] Categorías cargadas:", data.length);
            setCategories(data);
        } catch (err) {
            console.error(
                "[Admin] Error al cargar categorías:",
                err.response?.status,
                err.response?.data ?? err.message,
            );
            setCategories([]);
        }
    };

    const handleDelete = async (id) => {
        const result = await confirmDelete(
            "¿Eliminar categoría?",
            "Esta acción no se puede revertir.",
        );

        if (result.isConfirmed) {
            const originalCategories = [...categories];
            setCategories(categories.filter((c) => c.id !== id));

            try {
                await categoryService.delete(id);
                Toast.fire({
                    icon: "success",
                    title: "Categoría eliminada",
                });
            } catch (err) {
                setCategories(originalCategories);
                Toast.fire({
                    icon: "error",
                    title: "No se pudo eliminar en el servidor",
                });
            }
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchCategories().finally(() => setLoading(false));
    }, []);

    return {
        categories,
        loading,
        setCategories,
        fetchCategories,
        handleDelete,
    };
};
