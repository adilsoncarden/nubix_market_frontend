import { useState, useEffect } from "react";
import { categoryService } from "../services/categoryService";

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (err) {
            setError("Error al cargar categorías");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
            try {
                await categoryService.delete(id);
                setCategories(categories.filter((c) => c.id !== id));
            } catch (err) {
                alert("No se pudo eliminar la categoría");
            }
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return { categories, loading, error, fetchCategories, handleDelete };
};
