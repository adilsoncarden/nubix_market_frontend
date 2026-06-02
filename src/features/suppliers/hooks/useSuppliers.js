import { useState } from "react";
import {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} from "../services/supplierService";
import { confirmDelete, Toast } from "../../../utils/swalConfig";

const toPayload = (supplier) => ({
    ruc: supplier.ruc,
    nombre: supplier.nombre,
    telefono: supplier.telefono,
    email: supplier.email,
});

export const useSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);

    const refreshSuppliers = async () => {
        setLoading(true);
        try {
            const data = await getSuppliers();
            setSuppliers(data);
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: "No se pudieron cargar los proveedores",
            });
        } finally {
            setLoading(false);
        }
    };

    const saveSupplier = async (supplier, id) => {
        const payload = toPayload(supplier);
        try {
            if (id) {
                await updateSupplier(id, payload);
                Toast.fire({
                    icon: "success",
                    title: "Proveedor actualizado",
                });
            } else {
                await createSupplier(payload);
                Toast.fire({
                    icon: "success",
                    title: "Proveedor registrado",
                });
            }
            await refreshSuppliers();
            return true;
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                (typeof error.response?.data === "string"
                    ? error.response.data
                    : null) ||
                error.message ||
                "Hubo un problema al procesar la solicitud";
            Toast.fire({ icon: "error", title: msg });
            return false;
        }
    };

    const removeSupplier = async (id) => {
        const result = await confirmDelete(
            "¿Eliminar proveedor?",
            "Esta acción no se puede revertir.",
        );

        if (!result.isConfirmed) {
            return false;
        }

        const original = [...suppliers];
        setSuppliers((prev) => prev.filter((s) => s.id !== id));

        try {
            await deleteSupplier(id);
            Toast.fire({
                icon: "success",
                title: "Proveedor eliminado",
            });
            return true;
        } catch (error) {
            setSuppliers(original);
            Toast.fire({
                icon: "error",
                title: "No se pudo eliminar el proveedor",
            });
            return false;
        }
    };

    return {
        suppliers,
        loading,
        refreshSuppliers,
        saveSupplier,
        removeSupplier,
    };
};
