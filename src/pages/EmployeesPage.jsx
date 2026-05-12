import React, { useState, useEffect, useRef } from "react";
import { employeeService } from "../features/users/services/employeeService";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- LÓGICA DE PAGINACIÓN ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const modalRef = useRef();
    const bsModal = useRef();

    const [formData, setFormData] = useState({
        id: null,
        username: "",
        email: "",
        password: "",
        rolNombre: "EMPLEADO",
    });

    const fetchEmployees = async () => {
        try {
            const data = await employeeService.getAll();
            setEmployees(data);
        } catch (err) {
            console.error("Error al cargar empleados", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
        if (modalRef.current) {
            bsModal.current = new Modal(modalRef.current);
        }
    }, []);

    // --- CÁLCULOS DE PAGINACIÓN ---
    const totalPersonal = employees.length;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(totalPersonal / itemsPerPage);

    const openModal = (employee = null) => {
        if (employee) {
            setFormData({ ...employee, password: "" });
        } else {
            setFormData({ id: null, username: "", email: "", password: "", rolNombre: "EMPLEADO" });
        }
        bsModal.current.show();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await employeeService.update(formData.id, formData);
                Swal.fire({ icon: "success", title: "Actualizado", timer: 1500, showConfirmButton: false });
            } else {
                await employeeService.create(formData);
                Swal.fire({ icon: "success", title: "Registrado", timer: 1500, showConfirmButton: false });
            }
            bsModal.current.hide();
            fetchEmployees();
        } catch (err) {
            Swal.fire("Error", err.response?.data || "Error en la operación", "error");
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará el acceso del trabajador.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#198754",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                await employeeService.delete(id);
                setEmployees(employees.filter((e) => e.id !== id));
                Swal.fire("Eliminado", "El usuario ha sido removido.", "success");
            } catch (err) {
                Swal.fire("Error", "No se pudo completar la eliminación.", "error");
            }
        }
    };

    return (
        <div className="container-fluid animate__animated animate__fadeIn p-4">
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ letterSpacing: '-0.02em', color: '#1a1d23' }}>Gestión de Empleados</h2>
                    <p className="text-muted small mb-0">Administra el personal de <span className="fw-semibold text-success">Nubix Market</span></p>
                </div>
                <button className="btn btn-success shadow-sm px-4 fw-bold" onClick={() => openModal()} style={{ borderRadius: '10px', backgroundColor: "#198754", border: "none" }}>
                    <i className="bi bi-person-plus-fill me-2"></i> Nuevo Empleado
                </button>
            </div>

            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '12px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 text-nowrap">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 text-secondary small fw-bold">ID</th>
                                <th className="py-3 text-secondary small fw-bold">NOMBRE / USUARIO</th>
                                <th className="py-3 text-secondary small fw-bold">CORREO INSTITUCIONAL</th>
                                <th className="py-3 text-secondary small fw-bold">ROL</th>
                                <th className="text-end px-4 py-3 text-secondary small fw-bold">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-5 text-muted">Cargando empleados...</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-5 text-muted">No hay empleados registrados.</td></tr>
                            ) : (
                                currentItems.map((emp) => (
                                    <tr key={emp.id} className="row-hover">
                                        <td className="px-4 text-muted small">#{emp.id}</td>
                                        <td><span className="fw-bold text-dark">{emp.username}</span></td>
                                        <td>{emp.email}</td>
                                        <td>
                                            <span className={`role-badge ${emp.rolNombre === "ADMIN" ? "role-admin" : "role-emp"}`}>
                                                {emp.rolNombre}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            <button className="btn-icon-highlight edit me-3" onClick={() => openModal(emp)}>
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn-icon-highlight delete" onClick={() => handleDelete(emp.id)}>
                                                <i className="bi bi-trash3"></i>
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
                            Mostrando <span className="fw-semibold text-dark">{indexOfFirstItem + 1}</span> a <span className="fw-semibold text-dark">{Math.min(indexOfLastItem, totalPersonal)}</span> de <span className="fw-semibold text-dark">{totalPersonal}</span> empleados
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link border-0 shadow-none bg-transparent" onClick={() => setCurrentPage(currentPage - 1)}>
                                        <i className="bi bi-chevron-left text-success"></i>
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
                                        <i className="bi bi-chevron-right text-success"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            {/* MODAL */}
            <div className="modal fade" ref={modalRef} tabIndex="-1" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                        <div className="modal-header border-0 pt-4 px-4 pb-0">
                            <h5 className="modal-title fw-bold">{formData.id ? "Editar Trabajador" : "Registrar Trabajador"}</h5>
                            <button type="button" className="btn-close shadow-none" onClick={() => bsModal.current.hide()}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">Nombre de Usuario</label>
                                    <input type="text" className="form-control shadow-none border custom-input" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required style={{ borderRadius: '8px' }} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">Correo Institucional</label>
                                    <input type="email" className="form-control shadow-none border custom-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required style={{ borderRadius: '8px' }} />
                                </div>
                                {!formData.id && (
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small text-muted">Contraseña Temporal</label>
                                        <input type="password" className="form-control shadow-none border custom-input" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required style={{ borderRadius: '8px' }} />
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">Rol Asignado</label>
                                    <select className="form-select shadow-none border custom-input" value={formData.rolNombre} onChange={(e) => setFormData({ ...formData, rolNombre: e.target.value })} style={{ borderRadius: '8px' }}>
                                        <option value="EMPLEADO">EMPLEADO</option>
                                        <option value="ADMIN">ADMINISTRADOR</option>
                                    </select>
                                </div>
                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <button type="button" className="btn border-0 px-4 fw-bold" onClick={() => bsModal.current.hide()} style={{ backgroundColor: '#f8f9fa', color: '#6c757d', borderRadius: '10px', height: '45px' }}>Cancelar</button>
                                    <button type="submit" className="btn btn-success px-4 d-flex align-items-center fw-bold shadow-sm" style={{ backgroundColor: '#198754', border: 'none', borderRadius: '10px', height: '45px' }}><i className="bi bi-check2-circle me-2 fs-5"></i> Guardar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .role-badge { font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; }
                .role-admin { background-color: #ffe5e5; color: #d63031; }
                .role-emp { background-color: #e8f5e9; color: #198754; }
                .row-hover:hover { background-color: #fcfcfc !important; }
                
                .custom-input:focus {
                    border-color: #198754 !important;
                    box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.1) !important;
                }

                .btn-icon-highlight {
                    background: none;
                    border: none;
                    padding: 6px;
                    font-size: 1.25rem;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.25s ease;
                }

                .btn-icon-highlight.edit { color: #198754; }
                .btn-icon-highlight.edit:hover {
                    transform: scale(1.25);
                    color: #157347;
                    filter: drop-shadow(0 0 5px rgba(25, 135, 84, 0.4));
                }

                .btn-icon-highlight.delete { color: #ff6b6b; }
                .btn-icon-highlight.delete:hover {
                    transform: scale(1.25);
                    color: #e63946;
                    filter: drop-shadow(0 0 5px rgba(255, 107, 107, 0.4));
                }

                .pagination .page-link:hover:not(.active) {
                    background-color: #e8f5e9 !important;
                    color: #198754 !important;
                }

                .bi-pencil, .bi-trash3 {
                    -webkit-text-stroke: 0.7px;
                }
            `}</style>
        </div>
    );
};

export default EmployeesPage;