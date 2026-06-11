import React, { useState, useEffect, useRef, useMemo } from "react";
import { employeeService } from "../features/users/services/employeeService";
import { securityService } from "../features/security/services/securityService";
import Swal from "sweetalert2";
import { Modal, Tooltip } from "bootstrap";
import SearchInput from "../components/admin/SearchInput";
import AdminToolbarPanel from "../components/admin/AdminToolbarPanel";
import AdminModal, { AdminModalActions } from "../components/admin/AdminModal";
import CustomSelect from "../components/ui/CustomSelect";
import AdminResponsiveTable from "../components/admin/AdminResponsiveTable";

const isSupremeAdminRoleName = (nombre) => {
    const n = String(nombre ?? "").trim().toUpperCase();
    return n === "ADMIN" || n === "ADMINISTRADOR";
};

const isRoleAssignableToEmployee = (rol) => {
    const nombre = String(rol?.nombre ?? "").trim().toUpperCase();
    return nombre && !isSupremeAdminRoleName(nombre) && nombre !== "CLIENTE";
};

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const modalRef = useRef();
    const bsModal = useRef();
    const [showPassword, setShowPassword] = useState(false);
    const passwordTooltipRef = useRef(null);

    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        username: "",
        email: "",
        password: "",
        rolId: "",
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

    const assignableRoles = useMemo(
        () => roles.filter(isRoleAssignableToEmployee),
        [roles],
    );

    const defaultRolId = useMemo(() => {
        const empleado = assignableRoles.find(
            (r) => String(r.nombre).toUpperCase() === "EMPLEADO",
        );
        return empleado?.id ?? assignableRoles[0]?.id ?? "";
    }, [assignableRoles]);

    const fetchRoles = async () => {
        try {
            const data = await securityService.getRoles();
            setRoles(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al cargar roles", err);
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchRoles();
        if (modalRef.current) {
            bsModal.current = new Modal(modalRef.current);
            modalRef.current.addEventListener('hidden.bs.modal', () => {
                setFormData({
                    id: null,
                    username: "",
                    email: "",
                    password: "",
                    rolId: defaultRolId,
                });
            });
        }
    }, []);

    useEffect(() => {
        if (!formData.id && defaultRolId && !formData.rolId) {
            setFormData((prev) => ({ ...prev, rolId: defaultRolId }));
        }
    }, [defaultRolId, formData.id, formData.rolId]);

    useEffect(() => {
        const el = document.getElementById("toggleEmployeePassword");
        if (!el || formData.id) {
            passwordTooltipRef.current?.dispose();
            passwordTooltipRef.current = null;
            return;
        }
        passwordTooltipRef.current?.dispose();
        passwordTooltipRef.current = new Tooltip(el);
        return () => {
            passwordTooltipRef.current?.dispose();
            passwordTooltipRef.current = null;
        };
    }, [formData.id, showPassword]);

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
        setShowPassword(false);
        if (employee) {
            const matched = roles.find(
                (r) =>
                    String(r.nombre).toUpperCase() ===
                    String(employee.rolNombre).toUpperCase(),
            );
            setFormData({
                id: employee.id,
                username: employee.username,
                email: employee.email,
                password: "",
                rolId: matched?.id ?? defaultRolId,
            });
        } else {
            setFormData({
                id: null,
                username: "",
                email: "",
                password: "",
                rolId: defaultRolId,
            });
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

            <AdminToolbarPanel
                stats={[
                    {
                        icon: "bi bi-shield-check fs-4",
                        label: "Activos",
                        value: employees.length,
                    },
                ]}
            >
                <SearchInput
                    placeholder="Buscar por nombre, correo o rol..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </AdminToolbarPanel>

            {/* TABLA COMPACTA */}
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '12px' }}>
                <AdminResponsiveTable>
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
                </AdminResponsiveTable>

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

            <AdminModal
                modalRef={modalRef}
                title={formData.id ? "Actualizar Personal" : "Nuevo Registro"}
                onClose={() => bsModal.current.hide()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre de Usuario</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    username: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Correo Institucional</label>
                        <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    {!formData.id && (
                        <div className="mb-3">
                            <label className="form-label">Contraseña Temporal</label>
                            <div className="input-group">
                                <input
                                    id="temporalPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder=""
                                    className="form-control"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    required
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    id="toggleEmployeePassword"
                                    data-bs-toggle="tooltip"
                                    title={
                                        showPassword
                                            ? "Ocultar contraseña"
                                            : "Mostrar contraseña"
                                    }
                                    onClick={() => setShowPassword((v) => !v)}
                                >
                                    <i
                                        className={`bi bi-eye${showPassword ? "-slash" : ""}`}
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="mb-0">
                        <label className="form-label">Rol de Acceso</label>
                        {assignableRoles.length > 0 ? (
                            <CustomSelect
                                value={formData.rolId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        rolId: Number(e.target.value),
                                    })
                                }
                                required
                                options={assignableRoles.map((rol) => ({
                                    value: String(rol.id),
                                    label: `${rol.nombre}${rol.descripcion ? ` — ${rol.descripcion}` : ""}`,
                                }))}
                            />
                        ) : (
                            <p className="text-muted small mb-0">
                                No hay roles asignables disponibles.
                            </p>
                        )}
                    </div>
                    <AdminModalActions
                        onClose={() => bsModal.current.hide()}
                        inlineSubmit
                        cancelLabel="Cancelar"
                        confirmLabel={
                            formData.id
                                ? "Guardar Cambios"
                                : "Completar Registro"
                        }
                        confirmIcon="bi-cloud-arrow-up"
                    />
                </form>
            </AdminModal>

        </div>
    );
};

export default EmployeesPage;