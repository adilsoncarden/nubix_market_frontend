import React, { useState, useEffect, useRef, useMemo } from "react";
import { employeeService } from "../features/users/services/employeeService";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
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

    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    });

    const fetchEmployees = async () => {
        setLoading(true);
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
            modalRef.current.addEventListener('hidden.bs.modal', () => {
                setFormData({ id: null, username: "", email: "", password: "", rolNombre: "EMPLEADO" });
            });
        }
    }, []);

    // --- FILTRADO INTELIGENTE ---
    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => 
            emp.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.rolNombre?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [employees, searchTerm]);

    // --- LÓGICA DE PAGINACIÓN ---
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

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
                Toast.fire({ icon: "success", title: "Personal actualizado" });
            } else {
                await employeeService.create(formData);
                Toast.fire({ icon: "success", title: "Personal registrado" });
            }
            bsModal.current.hide();
            fetchEmployees();
        } catch (err) {
            Swal.fire("Error", err.response?.data || "Operación fallida", "error");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Dar de baja?",
            text: "Se revocará el acceso de este trabajador al sistema.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await employeeService.delete(id);
                    setEmployees(employees.filter((e) => e.id !== id));
                    Toast.fire({ icon: "success", title: "Acceso eliminado" });
                } catch (err) {
                    Swal.fire("Error", "No se pudo procesar la baja.", "error");
                }
            }
        });
    };

    return (
        <div className="admin-page" style={{ fontSize: '0.9rem' }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="admin-page-title fw-bold mb-0">
                        Nubix Market <span className="admin-accent-slash">/</span> Personal
                    </h2>
                    <p className="text-muted small mb-0">Gestión de roles y accesos internos</p>
                </div>
                <button 
                    className="btn btn-success shadow-sm px-4 fw-bold d-flex align-items-center admin-btn-primary" 
                    onClick={() => openModal()} 
                    style={{ height: '40px' }}
                >
                    <i className="bi bi-person-plus-fill me-2 fs-5"></i> Registrar Trabajador
                </button>
            </div>

            {/* BUSCADOR Y MÉTRICA */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '12px' }}>
                        <div className="d-flex align-items-center">
                            <div className="bg-emerald-100 text-emerald-600 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <i className="bi bi-shield-check fs-5"></i>
                            </div>
                            <div className="ms-3">
                                <small className="text-muted d-block fw-bold" style={{ fontSize: '10px' }}>ACTIVOS</small>
                                <h4 className="fw-bold mb-0">{employees.length}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="card border-0 shadow-sm p-2 d-flex flex-row align-items-center px-3 admin-search-card" style={{ borderRadius: '12px', height: '100%' }}>
                        <i className="bi bi-search text-muted me-3"></i>
                        <input 
                            type="text" 
                            className="form-control border-0 shadow-none bg-transparent" 
                            placeholder="Buscar por nombre, correo o rol..."
                            value={searchTerm}
                            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                        />
                    </div>
                </div>
            </div>

            {/* TABLA COMPACTA */}
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '12px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr style={{ fontSize: '0.75rem' }}>
                                <th className="px-4 py-3 text-secondary fw-bold" style={{ width: '80px' }}>ID</th>
                                <th className="py-3 text-secondary fw-bold">NOMBRE DE USUARIO</th>
                                <th className="py-3 text-secondary fw-bold">CORREO INSTITUCIONAL</th>
                                <th className="py-3 text-secondary fw-bold text-center" style={{ width: '150px' }}>ROL ASIGNADO</th>
                                <th className="text-end px-4 py-3 text-secondary fw-bold" style={{ width: '120px' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '0.85rem' }}>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-5"><div className="spinner-border spinner-border-sm text-emerald-600"></div></td></tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((emp) => (
                                    <tr key={emp.id}>
                                        <td className="px-4 text-muted small">#{emp.id}</td>
                                        <td><span className="fw-bold text-dark">{emp.username}</span></td>
                                        <td className="text-muted">{emp.email}</td>
                                        <td className="text-center">
                                            <span className={`role-badge ${emp.rolNombre === "ADMIN" ? "role-admin" : "role-emp"}`}>
                                                {emp.rolNombre}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            <div className="d-flex justify-content-end gap-1">
                                                <button className="btn-table-action edit" onClick={() => openModal(emp)} title="Editar datos">
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button className="btn-table-action delete" onClick={() => handleDelete(emp.id)} title="Dar de baja">
                                                    <i className="bi bi-trash3-fill"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center py-5 text-muted">No se encontró personal con esos criterios.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACIÓN */}
                {!loading && totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-body admin-pagination-bar">
                        <div className="text-muted small admin-pagination-info">
                            Mostrando <b>{indexOfFirstItem + 1}</b> a <b>{Math.min(indexOfLastItem, filteredEmployees.length)}</b> de {filteredEmployees.length}
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0 gap-1">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link border-0 rounded-2" onClick={() => setCurrentPage(currentPage - 1)}>
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i}>
                                        <button 
                                            className={`page-link border-0 rounded-2 fw-bold ${currentPage === i + 1 ? 'active-page' : 'text-dark bg-light'}`}
                                            onClick={() => setCurrentPage(i + 1)}
                                            style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link border-0 rounded-2" onClick={() => setCurrentPage(currentPage + 1)}>
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            {/* MODAL EDITAR / REGISTRAR */}
            <div className="modal fade" ref={modalRef} tabIndex="-1" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg modal-emp-custom" style={{ borderRadius: '15px' }}>
                        <div className="modal-header border-0 pt-4 px-4 pb-0">
                            <h5 className="modal-title fw-bold text-dark d-flex align-items-center">
                                <i className={`bi ${formData.id ? 'bi-person-gear' : 'bi-person-plus'} text-emerald-600 me-2`}></i>
                                {formData.id ? "Actualizar Personal" : "Nuevo Registro"}
                            </h5>
                            <button type="button" className="btn-close shadow-none" onClick={() => bsModal.current.hide()}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <label className="form-label extra-small fw-bold text-muted text-uppercase">Nombre de Usuario</label>
                                    <input type="text" className="form-control bg-light border-0 py-2 shadow-none" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required style={{ borderRadius: '10px' }} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label extra-small fw-bold text-muted text-uppercase">Correo Institucional</label>
                                    <input type="email" className="form-control bg-light border-0 py-2 shadow-none" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required style={{ borderRadius: '10px' }} />
                                </div>
                                {!formData.id && (
                                    <div className="mb-3">
                                        <label className="form-label extra-small fw-bold text-muted text-uppercase">Contraseña Temporal</label>
                                        <input type="password" placeholder="Mínimo 6 caracteres" className="form-control bg-light border-0 py-2 shadow-none" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required style={{ borderRadius: '10px' }} />
                                    </div>
                                )}
                                <div className="mb-0">
                                    <label className="form-label extra-small fw-bold text-muted text-uppercase">Rol de Acceso</label>
                                    <select className="form-select bg-light border-0 py-2 shadow-none" value={formData.rolNombre} onChange={(e) => setFormData({ ...formData, rolNombre: e.target.value })} style={{ borderRadius: '10px' }}>
                                        <option value="EMPLEADO">EMPLEADO (Ventas/Inventario)</option>
                                        <option value="ADMIN">ADMINISTRADOR (Acceso Total)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0 gap-2">
                                <button type="button" className="btn btn-light px-4 fw-bold text-secondary" style={{ borderRadius: '10px' }} onClick={() => bsModal.current.hide()}>Cancelar</button>
                                <button type="submit" className="btn btn-success px-4 fw-bold shadow-sm admin-btn-primary" style={{ height: '42px' }}>
                                    <i className="bi bi-cloud-arrow-up me-2"></i> {formData.id ? "Guardar Cambios" : "Completar Registro"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default EmployeesPage;