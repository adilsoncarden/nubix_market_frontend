import { useEffect, useState } from "react";
import DateInput from "../../../components/ui/DateInput";
import CustomSelect from "../../../components/ui/CustomSelect";
import { addDaysIso, todayIso } from "../../../utils/dateInputUtils";
import { TIPO_ENTREGA_LABELS } from "../utils/saleFilters";

function buildInitialForm(filters) {
    const hasta = filters.hasta || todayIso();
    const desde = filters.desde || addDaysIso(hasta, -30);
    return {
        desde,
        hasta,
        tipoEntrega: filters.tipoEntrega || "",
        clienteId: filters.clienteId || "",
        estadoPedido: "",
        estadoPago: "",
    };
}

export default function ExportSalesModal({
    show,
    onClose,
    onExport,
    clients = [],
    filters = {},
}) {
    const [form, setForm] = useState(() => buildInitialForm(filters));
    const [error, setError] = useState("");

    useEffect(() => {
        if (show) {
            setForm(buildInitialForm(filters));
            setError("");
        }
    }, [show, filters]);

    if (!show) return null;

    const update = (field) => (value) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        const { desde, hasta } = form;
        if (!desde || !hasta) {
            setError("Indique el rango de fechas");
            return;
        }
        if (hasta < desde) {
            setError("La fecha hasta debe ser posterior o igual a desde");
            return;
        }

        onExport({
            desde,
            hasta,
            tipoEntrega: form.tipoEntrega || undefined,
            clienteId: form.clienteId || undefined,
            estadoPedido: form.estadoPedido || undefined,
            estadoPago: form.estadoPago || undefined,
        });
    };

    return (
        <>
            <div className="modal-backdrop fade show" />
            <div
                className="modal fade show d-block"
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="exportSalesModalLabel"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id="exportSalesModalLabel"
                            >
                                Exportar ventas
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Cerrar"
                                onClick={onClose}
                            />
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {error && (
                                    <div className="alert alert-danger py-2 small mb-3">
                                        {error}
                                    </div>
                                )}
                                <label className="form-label small">Desde</label>
                                <DateInput
                                    className="form-control mb-2"
                                    value={form.desde}
                                    onChange={update("desde")}
                                    maxDate={form.hasta}
                                    aria-label="Fecha desde"
                                    required
                                />
                                <label className="form-label small">Hasta</label>
                                <DateInput
                                    className="form-control mb-2"
                                    value={form.hasta}
                                    onChange={update("hasta")}
                                    minDate={form.desde}
                                    aria-label="Fecha hasta"
                                    required
                                />
                                <label className="form-label small">
                                    Tipo de entrega
                                </label>
                                <CustomSelect
                                    className="mb-2"
                                    value={form.tipoEntrega}
                                    onChange={(e) =>
                                        update("tipoEntrega")(e.target.value)
                                    }
                                    placeholder="Todos"
                                    options={[
                                        { value: "", label: "Todos" },
                                        ...Object.entries(TIPO_ENTREGA_LABELS).map(
                                            ([value, label]) => ({
                                                value,
                                                label,
                                            }),
                                        ),
                                    ]}
                                />
                                <label className="form-label small">Cliente</label>
                                <CustomSelect
                                    className="mb-2"
                                    value={form.clienteId}
                                    onChange={(e) =>
                                        update("clienteId")(e.target.value)
                                    }
                                    placeholder="Todos"
                                    options={[
                                        { value: "", label: "Todos" },
                                        ...clients.map((c) => ({
                                            value: String(c.id),
                                            label:
                                                c.username ||
                                                c.email ||
                                                `Cliente #${c.id}`,
                                        })),
                                    ]}
                                />
                                <label className="form-label small">
                                    Estado pedido
                                </label>
                                <CustomSelect
                                    className="mb-2"
                                    value={form.estadoPedido}
                                    onChange={(e) =>
                                        update("estadoPedido")(e.target.value)
                                    }
                                    placeholder="Todos"
                                    options={[
                                        { value: "", label: "Todos" },
                                        { value: "PENDIENTE", label: "Pendiente" },
                                        { value: "EN_PROCESO", label: "En proceso" },
                                        {
                                            value: "LISTO_PARA_RECOJO",
                                            label: "Listo para recojo",
                                        },
                                        { value: "EN_CAMINO", label: "En camino" },
                                        { value: "ENTREGADO", label: "Entregado" },
                                    ]}
                                />
                                <label className="form-label small">
                                    Estado pago
                                </label>
                                <CustomSelect
                                    value={form.estadoPago}
                                    onChange={(e) =>
                                        update("estadoPago")(e.target.value)
                                    }
                                    placeholder="Todos"
                                    options={[
                                        { value: "", label: "Todos" },
                                        { value: "PAGADO", label: "Pagado" },
                                        { value: "APROBADO", label: "Aprobado" },
                                        { value: "PENDIENTE", label: "Pendiente" },
                                        { value: "RECHAZADO", label: "Rechazado" },
                                    ]}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-success">
                                    Descargar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
