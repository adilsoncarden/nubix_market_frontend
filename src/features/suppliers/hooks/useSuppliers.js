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

        const original =  [...suppliers];

        // ELIMINACIÓN OPTIMISTA:   
        setSuppliers((prev) => prev.filter((s) => s.id !== id));

        try {
            await deleteSupplier(id);

            Swal.fire({
                icon: "success",
                title: "Proveedor eliminado",
                timer: 1500,
                showConfirmButton: false,
            });

            } catch (error) {

                // RESTAURAR SI FALLA
                setSuppliers(original);

                Swal.fire(
                    "Error",
                    "No se puedo eliminar el Proveedor.",
                    "error",
                );
            }
        }
    

    return {
        suppliers,
        loading,
        refreshSuppliers,
        saveSupplier,
        removeSupplier,
    };
};
