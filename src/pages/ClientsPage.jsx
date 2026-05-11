import React, { useState, useEffect, useRef } from "react";
import { clientService } from "../features/users/services/clientService";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";

const ClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- LÓGICA DE PAGINACIÓN ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [selectedClient, setSelectedClient] = useState({
        username: "",
        email: "",
    });
    
    const modalRef = useRef();
    const bsModal = useRef();

    const fetchClients = async () => {
        try {
            const data = await clientService.getAll();
            setClients(data);
        } catch (err) {
            console.error("Error al obtener clientes", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
        if (modalRef.current) {
            bsModal.current = new Modal(modalRef.current);
        }
    }, []);

    // --- CÁLCULOS DE SEGMENTACIÓN ---
    const totalClientes = clients.length;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = clients.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(totalClientes / itemsPerPage);

    const handleEditClick = (client) => {
        setSelectedClient(client);
        bsModal.current.show();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await clientService.update(selectedClient.id, {
                username: selectedClient.username,
                email: selectedClient.email,
            });

            Swal.fire({
                icon: "success",
                title: "¡Actualizado!",
                timer: 1500,
                showConfirmButton: false
            });
            
            bsModal.current.hide();
            fetchClients();
        } catch (err) {
            Swal.fire("Error", "No se pudo actualizar.", "error");
        }
    };

    return (
        <div className="container-fluid animate__animated animate__fadeIn p-4">
            
            {/* CABECERA */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ letterSpacing: '-0.02em', color: '#1a1d23' }}>
                        Gestión de Clientes
                    </h2>
                    <p className="text-muted small mb-0">
                        Visualiza y edita los usuarios registrados en <span className="fw-semibold text-primary">Nubix Market</span>
                    </p>
                </div>
                <div className="d-flex align-items-center bg-white shadow-sm px-3 py-2" style={{ borderRadius: '10px', border: '1px solid #eee' }}>
                    <div className="bg-success rounded-circle me-2" style={{ width: '8px', height: '8px' }}></div>
                    <span className="text-secondary small fw-bold text-uppercase me-2" style={{ fontSize: '11px' }}>Total Clientes:</span>
                    <span className="fw-bold text-dark">{totalClientes} un.</span>
                </div>
            </div>

            {/* TABLA */}
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '12px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 text-nowrap">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 text-secondary small fw-bold">ID</th>
                                <th className="py-3 text-secondary small fw-bold">USUARIO</th>
                                <th className="py-3 text-secondary small fw-bold">CORREO ELECTRÓNICO</th>
                                <th className="py-3 text-secondary small fw-bold">ROL</th>
                                <th className="text-end px-4 py-3 text-secondary small fw-bold" style={{ width: '80px' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-5 text-muted">Cargando...</td></tr>
                            ) : totalClientes === 0 ? (
                                <tr><td colSpan="5" className="text-center py-5 text-muted">No hay clientes registrados.</td></tr>
                            ) : (
                                currentItems.map((client) => (
                                    <tr key={client.id} className="row-hover">
                                        <td className="px-4 text-muted small">#{client.id}</td>
                                        <td><span className="fw-bold text-dark">{client.username}</span></td>
                                        <td className="text-dark">{client.email}</td>
                                        <td>
                                            <span className="role-text">
                                                {client.rolNombre || "Cliente"}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            <button className="btn-action-mini" onClick={() => handleEditClick(client)}>
                                                <i className="bi bi-pencil-square"></i>
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
                            Mostrando <span className="fw-semibold text-dark">{indexOfFirstItem + 1}</span> a <span className="fw-semibold text-dark">{Math.min(indexOfLastItem, totalClientes)}</span> de <span className="fw-semibold text-dark">{totalClientes}</span> clientes
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
                                                { backgroundColor: '#0d6efd', color: 'white' } : 
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
            <div className="modal fade" ref={modalRef} tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                        <div className="modal-header border-0 pt-4 px-4 pb-0">
                            <h5 className="modal-title fw-bold">Editar Cliente</h5>
                            <button type="button" className="btn-close" onClick={() => bsModal.current.hide()}></button>
                        </div>
                        <form onSubmit={handleUpdate}>
                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Nombre de Usuario</label>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0 py-2"
                                        value={selectedClient.username}
                                        onChange={(e) => setSelectedClient({...selectedClient, username: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control bg-light border-0 py-2"
                                        value={selectedClient.email}
                                        onChange={(e) => setSelectedClient({...selectedClient, email: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0">
                                <button type="button" className="btn btn-light px-4 fw-semibold text-muted" onClick={() => bsModal.current.hide()}>Cancelar</button>
                                <button type="submit" className="btn btn-primary px-4 fw-bold shadow-sm" style={{ borderRadius: '8px' }}>Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .row-hover:hover { background-color: #f8f9fa !important; }

                .role-text {
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #5a6a85;
                    background-color: #f0f2f5;
                    padding: 3px 8px;
                    border-radius: 4px;
                }

                .btn-action-mini {
                    background: #e1f5fe;
                    color: #03a9f4;
                    border: none;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                    padding: 4px 8px;
                    border-radius: 6px;
                }

                .btn-action-mini:hover {
                    background-color: #b3e5fc;
                    color: #0288d1;
                    transform: scale(1.05);
                }

                .pagination .page-link:hover:not(.active) {
                    background-color: #e9ecef !important;
                }
            `}</style>
        </div>
    );
};

export default ClientsPage;