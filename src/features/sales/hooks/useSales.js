import { useState, useEffect } from "react";
import { saleService } from "../services/saleService";
import Swal from "sweetalert2";

export const useSales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSales = async () => {
        try {
            const data = await saleService.getAll();
            setSales(data);
        } catch (err) {
            console.error("Error al cargar ventas", err);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        const original = [...sales];

        try {
            const updatedSale = await saleService.updateStatus(id, newStatus);
            setSales((prev) =>
                prev.map((sale) =>
                    sale.id === id
                        ? { ...sale, estadoPedido: newStatus }
                        : sale,
                ),
            );

            Swal.fire({
                icon: "success",
                title: "Actualizado",
                text: "Estado de la venta actualizado",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            setSales(original);
            Swal.fire(
                "Error",
                "No se pudo actualizar el estado de la venta.",
                "error",
            );
        }
    };

    const handleRegisterCredit = async (id) => {
        try {
            await saleService.registerCredit(id);
            setSales((prev) =>
                prev.map((sale) =>
                    sale.id === id ? { ...sale, estadoPago: "PAGADO" } : sale,
                ),
            );

            Swal.fire({
                icon: "success",
                title: "Crédito Registrado",
                text: "El crédito ha sido registrado como pagado",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            Swal.fire(
                "Error",
                err.response?.data || "No se pudo registrar el crédito.",
                "error",
            );
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchSales().finally(() => setLoading(false));
    }, []);

    return {
        sales,
        loading,
        setSales,
        fetchSales,
        handleStatusUpdate,
        handleRegisterCredit,
    };
};
