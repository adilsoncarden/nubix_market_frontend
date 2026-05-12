import React, { useEffect, useState } from "react";
import { useSuppliers } from "../features/suppliers/hooks/useSuppliers";
import SupplierForm from "../features/suppliers/components/SupplierForm";
import Swal from "sweetalert2";

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

    // --- LÓGICA DE PAGINACIÓN ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        refreshSuppliers();
    }, []);

    // MÉTRICAS DINÁMICAS
    const totalProveedores = suppliers.length;
    const conContacto = suppliers.filter(s => s.email || s.telefono).length;

    // --- CÁLCULOS DE SEGMENTACIÓN ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = suppliers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(totalProveedores / itemsPerPage);

    // Ajuste de página si se eliminan elementos
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [suppliers, totalPages, currentPage]);

    const handleOpenModal = (supplier = null) => {
        setSelectedSupplier(supplier);
        setShowModal(true);
    };

    const handleSave = async (data) => {
        const success = await saveSupplier(data);
        if (success) {
            setShowModal(false);
            Swal.fire({ 
                icon: "success", 
                title: selectedSupplier ? "Actualizado correctamente" : "Registrado con éxito", 
                timer: 1500, 
                showConfirmButton: false 
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "El proveedor será eliminado permanentemente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            await removeSupplier(id);
            Swal.fire('Eliminado', 'El proveedor ha sido borrado.', 'success');
        }
    };

    return (
        <div className="container-fluid animate__animated animate__fadeIn p-4">
            
            {/* CABECERA */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ letterSpacing: '-0.02em', color: '#1a1d23' }}>
                        Gestión de Proveedores
                    </h2>
                    <p className="text-muted small mb-0">
                        Administra tus contactos comerciales de <span className="fw-semibold text-primary">Nubix Market</span>
                    </p>
                </div>
                <button
                    className="btn btn-success shadow-sm px-4 d-flex align-items-center btn-nuevo-proveedor"
                    onClick={() => handleOpenModal()}
                    style={{ 
                        height: '40px', 
                        backgroundColor: "#198754", 
                        border: "none",
                        transition: "all 0.3s ease",
                        fontWeight: "600",
                        borderRadius: '10px'
                    }}
                >
                    <i className="bi bi-person-plus-fill me-2"></i> Nuevo Proveedor
                </button>
            </div>

            {/* MÉTRICAS */}
            <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center px-2">
                            <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <i className="bi bi-people-fill fs-4"></i>
                            </div>
                            <div className="ms-3">
                                <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '11px' }}>Total Proveedores</small>
                                <h3 className="fw-bold mb-0">{totalProveedores}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center px-2">
                            <div className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <i className="bi bi-patch-check-fill fs-4"></i>
                            </div>
                            <div className="ms-3">
                                <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '11px' }}>Con Datos de Contacto</small>
                                <h3 className="fw-bold mb-0">{conContacto}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLA */}
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '12px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 text-nowrap">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 text-secondary small fw-bold">RUC / ID</th>
                                <th className="py-3 text-secondary small fw-bold">RAZÓN SOCIAL</th>
                                <th className="py-3 text-secondary small fw-bold">TELÉFONO</th>
                                <th className="py-3 text-secondary small fw-bold">CORREO ELECTRÓNICO</th>
                                <th className="text-end px-4 py-3 text-secondary small fw-bold">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-4">Cargando...</td></tr>
                            ) : totalProveedores === 0 ? (
                                <tr><td colSpan="5" className="text-center py-5 text-muted">No hay proveedores registrados.</td></tr>
                            ) : (
                                currentItems.map((s) => (
                                    <tr key={s.id}>
                                        <td className="px-4 text-muted small fw-bold">{s.ruc || `#${s.id}`}</td>
                                        <td><span className="fw-bold text-dark">{s.nombre}</span></td>
                                        <td><span className="text-muted">{s.telefono || '---'}</span></td>
                                        <td>
                                            <span className="badge border text-dark fw-normal bg-light">
                                                {s.email || 'Sin correo'}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            <button 
                                                className="btn btn-sm btn-outline-primary me-2 border-0 shadow-none" 
                                                onClick={() => handleOpenModal(s)}
                                            >
                                                <i className="bi bi-pencil-square fs-6"></i>
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-danger border-0 shadow-none" 
                                                onClick={() => handleDelete(s.id)}
                                            >
                                                <i className="bi bi-trash3 fs-6"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACIÓN FOOTER */}
                {!loading && totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-white">
                        <div className="text-muted small">
                            Mostrando <span className="fw-semibold text-dark">{indexOfFirstItem + 1}</span> a <span className="fw-semibold text-dark">{Math.min(indexOfLastItem, totalProveedores)}</span> de <span className="fw-semibold text-dark">{totalProveedores}</span> proveedores
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link border-0 shadow-none bg-transparent" onClick={() => setCurrentPage(currentPage - 1)}>
                                        <i className="bi bi-chevron-left text-dark"></i>
                                    </button>
                                </li>
                                
                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <button 
                                            className="page-link border-0 shadow-none mx-1 rounded-3" 
                                            style={currentPage === index + 1 ? 
                                                { backgroundColor: '#198754', color: 'white' } : 
                                                { backgroundColor: '#f8f9fa', color: '#1a1d23' }}
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}

                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link border-0 shadow-none bg-transparent" onClick={() => setCurrentPage(currentPage + 1)}>
                                        <i className="bi bi-chevron-right text-dark"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal show d-block animate__animated animate__fadeIn" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                            <div className="modal-header border-0 pb-0 px-4 pt-4">
                                <h5 className="modal-title fw-bold">
                                    {selectedSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
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

            <style>{`
                .btn-nuevo-proveedor:hover {
                    background-color: #157347 !important;
                    box-shadow: 0 0 15px rgba(25, 135, 84, 0.5) !important;
                    transform: translateY(-1px);
                }
                .btn-nuevo-proveedor:active {
                    transform: translateY(0);
                }
                .table-hover tbody tr:hover {
                    background-color: rgba(0,0,0,.01);
                }
                .pagination .page-link:hover:not(.active) {
                    background-color: #e9ecef !important;
                }
            `}</style>
        </div>
    );
};

export default SuppliersPage;