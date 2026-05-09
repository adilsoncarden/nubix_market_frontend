import { useState, useEffect } from "react";
import { categoryService } from "../services/categoryService";
import Swal from "sweetalert2";

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (err) {
            console.error("Error al cargar categorías", err);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            // Actualización optimista: eliminamos de la lista antes de que termine la API
            const originalCategories = [...categories];
            setCategories(categories.filter((c) => c.id !== id));

            try {
                await categoryService.delete(id);
                Swal.fire(
                    "¡Eliminado!",
                    "La categoría ha sido borrada.",
                    "success",
                );
            } catch (err) {
                setCategories(originalCategories); // Revertir si falla
                Swal.fire(
                    "Error",
                    "No se pudo eliminar en el servidor.",
                    "error",
                );
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
