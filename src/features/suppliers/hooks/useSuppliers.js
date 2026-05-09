import { useState } from "react";
import {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} from "../services/supplierService";
import Swal from "sweetalert2";

export const useSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);

    const refreshSuppliers = async () => {
        setLoading(true);
        try {
            const data = await getSuppliers();
            setSuppliers(data);
        } catch (error) {
            Swal.fire(
                "Error",
                "No se pudieron cargar los proveedores",
                "error",
            );
        } finally {
            setLoading(false);
        }
    };

    const saveSupplier = async (supplier) => {
        try {
            if (supplier.id) {
                await updateSupplier(supplier.id, supplier);
                Swal.fire({
                    icon: "success",
                    title: "¡Actualizado!",
                    text: "El proveedor ha sido actualizado correctamente.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } else {
                await createSupplier(supplier);
                Swal.fire({
                    icon: "success",
                    title: "¡Creado!",
                    text: "El proveedor ha sido registrado con éxito.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
            await refreshSuppliers();
            return true;
        } catch (error) {
            Swal.fire(
                "Error",
                "Hubo un problema al procesar la solicitud",
                "error",
            );
            return false;
        }
    };

    const removeSupplier = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1a733c", // Tu verde Nubix
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await deleteSupplier(id);
                setSuppliers((prev) => prev.filter((s) => s.id !== id));
                Swal.fire(
                    "¡Eliminado!",
                    "El proveedor ha sido borrado.",
                    "success",
                );
            } catch (error) {
                Swal.fire(
                    "Error",
                    "No se pudo eliminar el proveedor.",
                    "error",
                );
            }
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
