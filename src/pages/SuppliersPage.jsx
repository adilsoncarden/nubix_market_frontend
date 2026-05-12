import React, { useEffect, useState, useRef } from "react";
import { Modal } from "bootstrap"; 
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

    // --- ESTADOS PARA PAGINACIÓN ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const modalRef = useRef();
    const bsModal = useRef();

    useEffect(() => {
        refreshSuppliers();
        if (modalRef.current) {
            bsModal.current = new Modal(modalRef.current);
        }
    }, []);

    // --- LÓGICA DE PAGINACIÓN ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSuppliers = suppliers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(suppliers.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleOpenModal = (supplier = null) => {
        setSelectedSupplier(supplier);
        bsModal.current.show();
    };

    const handleSave = async (data) => {
        const success = await saveSupplier(data);
        if (success) {
            bsModal.current.hide();
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
                        fontWeight: "600",
                        borderRadius: '10px'
                    }}
                >
                    <i className="bi bi-person-plus-fill me-2"></i> Nuevo Proveedor
                </button>
            </div>

            {/* MÉTRICAS (Recuperadas) */}
            <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center px-2">
                            <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <i className="bi bi-people-fill fs-4"></i>
                            </div>
                            <div className="ms-3">
                                <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '11px' }}>Total Proveedores</small>
                                <h3 className="fw-bold mb-0">{suppliers.length}</h3>
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
                                <h3 className="fw-bold mb-0">{suppliers.filter(s => s.email || s.telefono).length}</h3>
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
                            {!loading && currentSuppliers.map((s) => (
                                <tr key={s.id} className="row-hover">
                                    <td className="px-4 text-muted small fw-bold">{s.ruc || `#${s.id}`}</td>
                                    <td><span className="fw-bold text-dark">{s.nombre}</span></td>
                                    <td><span className="text-muted">{s.telefono || '---'}</span></td>
                                    <td>
                                        <span className="badge border text-dark fw-normal bg-light" style={{ borderRadius: '6px' }}>
                                            {s.email || 'Sin correo'}
                                        </span>
                                    </td>
                                    <td className="text-end px-4">
                                        <button className="btn-icon-highlight edit me-3" onClick={() => handleOpenModal(s)}>
                                            <i className="bi bi-pencil-fill"></i>
                                        </button>
                                        <button className="btn-icon-highlight delete" onClick={() => handleDelete(s.id)}>
                                            <i className="bi bi-trash-fill"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACIÓN ESTILO image_09dd60.png */}
                {!loading && totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-white">
                        <div className="text-muted small">
                            Mostrando <span className="fw-bold text-dark">{indexOfFirstItem + 1}</span> a <span className="fw-bold text-dark">{Math.min(indexOfLastItem, suppliers.length)}</span> de <span className="fw-bold text-dark">{suppliers.length}</span> proveedores
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0 align-items-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link border-0 bg-transparent text-success shadow-none p-2" 
                                        onClick={() => paginate(currentPage - 1)}
                                    >
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                </li>
                                
                                {[...Array(totalPages).keys()].map(num => (
                                    <li key={num + 1} className={`page-item ${currentPage === num + 1 ? 'active' : ''}`}>
                                        <button 
                                            className="page-link border-0 mx-1 d-flex align-items-center justify-content-center shadow-none" 
                                            onClick={() => paginate(num + 1)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                backgroundColor: currentPage === num + 1 ? '#198754' : '#f8f9fa',
                                                color: currentPage === num + 1 ? '#fff' : '#1a1d23'
                                            }}
                                        >
                                            {num + 1}
                                        </button>
                                    </li>
                                ))}

                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link border-0 bg-transparent text-success shadow-none p-2" 
                                        onClick={() => paginate(currentPage + 1)}
                                    >
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            {/* MODAL */}
            <div className="modal fade" ref={modalRef} tabIndex="-1" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg modal-proveedor-custom" style={{ borderRadius: '15px' }}>
                        <div className="modal-header border-0 pb-0 pt-4 px-4">
                            <h5 className="modal-title fw-bold">
                                {selectedSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}
                            </h5>
                            <button type="button" className="btn-close shadow-none" onClick={() => bsModal.current.hide()}></button>
                        </div>
                        <div className="modal-body p-4">
                            <SupplierForm
                                supplier={selectedSupplier}
                                onSave={handleSave}
                                onClose={() => bsModal.current.hide()}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .row-hover:hover { background-color: #fcfcfc !important; }
                .modal.fade { backdrop-filter: blur(4px); }
                
                .btn-icon-highlight {
                    background: none;
                    border: none;
                    padding: 8px;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                .btn-icon-highlight.edit { color: #198754; }
                .btn-icon-highlight.edit:hover {
                    transform: scale(1.25);
                    color: #157347;
                    filter: drop-shadow(0 0 8px rgba(25, 135, 84, 0.6));
                }

                .btn-icon-highlight.delete { color: #dc3545; }
                .btn-icon-highlight.delete:hover {
                    transform: scale(1.25);
                    color: #bb2d3b;
                    filter: drop-shadow(0 0 8px rgba(220, 53, 69, 0.6));
                }

                .btn-nuevo-proveedor:hover {
                    background-color: #157347 !important;
                    box-shadow: 0 0 15px rgba(25, 135, 84, 0.5) !important;
                    transform: translateY(-1px);
                }

                .modal-proveedor-custom input:focus, 
                .modal-proveedor-custom select:focus {
                    border-color: #198754 !important;
                    box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25) !important;
                }

                .modal-proveedor-custom button[type="submit"] {
                    background-color: #198754 !important;
                    border: none !important;
                    color: white !important;
                    padding: 10px 24px !important;
                    border-radius: 12px !important;
                    font-weight: 700 !important;
                }
            `}</style>
        </div>
    );
};

export default SuppliersPage;