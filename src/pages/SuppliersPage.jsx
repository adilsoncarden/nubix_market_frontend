import React, { useEffect, useState } from "react";
import { useSuppliers } from "../features/suppliers/hooks/useSuppliers";
import SupplierForm from "../features/suppliers/components/SupplierForm";

const SuppliersPage = () => {
    const {
        suppliers,
        loading,
        refreshSuppliers,
        saveSupplier,
        removeSupplier,
    } = useSuppliers();
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        refreshSuppliers();
    }, []);

    const handleOpenModal = (supplier = null) => {
        setSelectedSupplier(supplier);
        setShowModal(true);
    };

    const handleSave = async (data) => {
        const success = await saveSupplier(data);
        if (success) setShowModal(false);
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold m-0">Gestión de Proveedores</h2>
                <button
                    className="btn btn-success rounded-pill px-4"
                    onClick={() => handleOpenModal()}
                >
                    <i className="bi bi-plus-lg me-2"></i> Nuevo Proveedor
                </button>
            </div>

            <div
                className="card shadow-sm border-0"
                style={{ borderRadius: "15px" }}
            >
                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">RUC</th>
                                <th>Razón Social</th>
                                <th>Teléfono</th>
                                <th>Email</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((s) => (
                                <tr key={s.id}>
                                    <td className="ps-4 fw-bold">{s.ruc}</td>
                                    <td>{s.nombre}</td>
                                    <td>{s.telefono}</td>
                                    <td>{s.email}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-link text-primary"
                                            onClick={() => handleOpenModal(s)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-link text-danger"
                                            onClick={() => removeSupplier(s.id)}
                                        >
                                            <i className="bi bi-trash3-fill"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Manual (Bootstrap 5) */}
            {showModal && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title fw-bold">
                                    {selectedSupplier
                                        ? "Editar Proveedor"
                                        : "Nuevo Proveedor"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body p-4">
                                <SupplierForm
                                    supplier={selectedSupplier}
                                    onSave={handleSave}
                                    onClose={() => setShowModal(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuppliersPage;
