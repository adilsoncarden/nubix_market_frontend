import React, { useState, useEffect, useRef } from "react";
import { employeeService } from "../features/users/services/employeeService";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Referencias para el Modal de Bootstrap
    const modalRef = useRef();
    const bsModal = useRef();

    // Estado para el formulario (Crear/Editar)
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

    // MÉTRICAS DINÁMICAS
    const totalPersonal = employees.length;
    const totalAdmins = employees.filter(e => e.rolNombre === "ADMIN").length;

    const openModal = (employee = null) => {
        if (employee) {
            setFormData({ ...employee, password: "" }); // Edición
        } else {
            setFormData({
                id: null,
                username: "",
                email: "",
                password: "",
                rolNombre: "EMPLEADO",
            }); // Creación
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
            
            {/* CABECERA CON BOTÓN VERDE ILUMINADO */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ letterSpacing: '-0.02em', color: '#1a1d23' }}>
                        Gestión de Empleados
                    </h2>
                    <p className="text-muted small mb-0">
                        Administra el personal con acceso administrativo a <span className="fw-semibold text-primary">Nubix Market</span>
                    </p>
                </div>
                <button
                    className="btn btn-success shadow-sm px-4 d-flex align-items-center btn-glow-green"
                    onClick={() => openModal()}
                    style={{ height: '40px', backgroundColor: "#198754", border: "none", transition: "all 0.3s ease", fontWeight: "600" }}
                >
                    <i className="bi bi-person-plus-fill me-2"></i> Nuevo Empleado
                </button>
            </div>

            {/* MÉTRICAS DINÁMICAS */}
            <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center px-2">
                            <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <i className="bi bi-people-fill fs-4"></i>
                            </div>
                            <div className="ms-3">
                                <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '11px' }}>Total Personal</small>
                                <h3 className="fw-bold mb-0">{totalPersonal}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center px-2">
                            <div className="bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <i className="bi bi-shield-lock-fill fs-4"></i>
                            </div>
                            <div className="ms-3">
                                <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '11px' }}>Administradores</small>
                                <h3 className="fw-bold mb-0">{totalAdmins}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLA ESTILIZADA */}
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '12px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 text-nowrap">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 text-secondary small fw-bold">ID</th>
                                <th className="py-3 text-secondary small fw-bold">NOMBRE / USUARIO</th>
                                <th className="py-3 text-secondary small fw-bold">CORREO INSTITUCIONAL</th>
                                <th className="py-3 text-secondary small fw-bold">ROL</th>
                                <th className="text-end px-4 py-3 text-secondary small fw-bold" style={{ width: '120px' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-5 text-muted">Cargando personal...</td></tr>
                            ) : (
                                employees.map((emp) => (
                                    <tr key={emp.id} className="row-hover">
                                        <td className="px-4 text-muted small">#{emp.id}</td>
                                        <td><span className="fw-bold text-dark">{emp.username}</span></td>
                                        <td className="text-dark">{emp.email}</td>
                                        <td>
                                            <span className={`role-badge ${emp.rolNombre === "ADMIN" ? "role-admin" : "role-emp"}`}>
                                                {emp.rolNombre}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            <button className="btn-action-mini btn-edit-blue" onClick={() => openModal(emp)}>
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn-action-mini btn-delete-red ms-2" onClick={() => handleDelete(emp.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL ESTILIZADO */}
            <div className="modal fade" ref={modalRef} id="employeeModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                        <div className="modal-header border-0 pt-4 px-4 pb-0">
                            <h5 className="modal-title fw-bold">
                                {formData.id ? "Editar Trabajador" : "Registrar Trabajador"}
                            </h5>
                            <button type="button" className="btn-close" onClick={() => bsModal.current.hide()}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Nombre de Usuario</label>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Correo Institucional</label>
                                    <input
                                        type="email"
                                        className="form-control bg-light border-0"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                {!formData.id && (
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted text-uppercase">Contraseña Temporal</label>
                                        <input
                                            type="password"
                                            className="form-control bg-light border-0"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Rol Asignado</label>
                                    <select
                                        className="form-select bg-light border-0"
                                        value={formData.rolNombre}
                                        onChange={(e) => setFormData({ ...formData, rolNombre: e.target.value })}
                                    >
                                        <option value="EMPLEADO">EMPLEADO</option>
                                        <option value="ADMIN">ADMINISTRADOR</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0">
                                <button type="button" className="btn btn-light px-4" onClick={() => bsModal.current.hide()}>Cancelar</button>
                                <button type="submit" className={`btn px-4 fw-semibold ${formData.id ? "btn-primary" : "btn-success"}`}>
                                    {formData.id ? "Guardar Cambios" : "Registrar Ahora"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* ESTILOS PERSONALIZADOS */}
            <style>{`
                .btn-glow-green:hover {
                    background-color: #157347 !important;
                    box-shadow: 0 0 15px rgba(25, 135, 84, 0.5) !important;
                    transform: translateY(-1px);
                }
                
                .row-hover:hover { background-color: #f8f9fa !important; }

                /* Estilo de Roles */
                .role-badge {
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    padding: 4px 10px;
                    border-radius: 6px;
                }
                .role-admin { background-color: #ffe5e5; color: #d63031; }
                .role-emp { background-color: #e1f5fe; color: #0288d1; }

                /* Botones de acción minimalistas */
                .btn-action-mini {
                    background: transparent;
                    border: none;
                    font-size: 1rem;
                    transition: all 0.2s;
                    padding: 4px 8px;
                    border-radius: 6px;
                }
                .btn-edit-blue { color: #0d6efd; }
                .btn-edit-blue:hover { background-color: #e7f1ff; transform: scale(1.1); }
                
                .btn-delete-red { color: #dc3545; }
                .btn-delete-red:hover { background-color: #fff0f0; transform: scale(1.1); }

                .modal.show { backdrop-filter: blur(4px); background-color: rgba(0,0,0,0.4); }
            `}</style>
        </div>
    );
};

export default EmployeesPage;