import React, { useState, useEffect } from "react";
import { employeeService } from "../features/users/services/employeeService";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);

    // Estado para el formulario (Crear/Editar)
    const [formData, setFormData] = useState({
        id: null,
        username: "",
        email: "",
        password: "", // Solo obligatorio al crear
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
        const modalElement = document.getElementById("employeeModal");
        if (modalElement) setModal(new Modal(modalElement));
    }, []);

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
        modal.show();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await employeeService.update(formData.id, formData);
                Swal.fire(
                    "Actualizado",
                    "Empleado actualizado con éxito",
                    "success",
                );
            } else {
                await employeeService.create(formData);
                Swal.fire("Creado", "Nuevo empleado registrado", "success");
            }
            modal.hide();
            fetchEmployees();
        } catch (err) {
            Swal.fire(
                "Error",
                err.response?.data || "Error en la operación",
                "error",
            );
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará el acceso del trabajador.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
        });

        if (result.isConfirmed) {
            try {
                await employeeService.delete(id);
                setEmployees(employees.filter((e) => e.id !== id));
                Swal.fire(
                    "Eliminado",
                    "El usuario ha sido removido.",
                    "success",
                );
            } catch (err) {
                Swal.fire(
                    "Error",
                    "No se pudo completar la eliminación.",
                    "error",
                );
            }
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark">Gestión de Empleados</h2>
                    <p className="text-muted small">
                        Administra el personal con acceso al panel
                        administrativo.
                    </p>
                </div>
                <button
                    className="btn btn-primary shadow-sm"
                    onClick={() => openModal()}
                >
                    <i className="bi bi-person-plus-fill me-2"></i> Nuevo
                    Empleado
                </button>
            </div>

            <div className="card shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="px-4">ID</th>
                                <th>Nombre / Usuario</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th className="text-end px-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-5 text-muted"
                                    >
                                        Cargando personal...
                                    </td>
                                </tr>
                            ) : (
                                employees.map((emp) => (
                                    <tr key={emp.id}>
                                        <td className="px-4 text-muted">
                                            #{emp.id}
                                        </td>
                                        <td>
                                            <span className="fw-bold text-dark">
                                                {emp.username}
                                            </span>
                                        </td>
                                        <td>{emp.email}</td>
                                        <td>
                                            <span
                                                className={`badge ${emp.rolNombre === "ADMIN" ? "bg-danger" : "bg-info"} text-white`}
                                            >
                                                {emp.rolNombre}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => openModal(emp)}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() =>
                                                    handleDelete(emp.id)
                                                }
                                            >
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

            {/* Modal Único para Crear/Editar */}
            <div
                className="modal fade"
                id="employeeModal"
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content border-0 shadow">
                        <div
                            className={`modal-header ${formData.id ? "bg-primary" : "bg-success"} text-white`}
                        >
                            <h5 className="modal-title">
                                {formData.id
                                    ? "Editar Trabajador"
                                    : "Registrar Nuevo Trabajador"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                            ></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Nombre de Usuario
                                    </label>
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
                                    <label className="form-label fw-semibold">
                                        Correo Institucional
                                    </label>
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
                                        <label className="form-label fw-semibold">
                                            Contraseña Temporal
                                        </label>
                                        <input
                                            type="password"
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
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Rol Asignado
                                    </label>
                                    <select
                                        className="form-select"
                                        value={formData.rolNombre}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                rolNombre: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="EMPLEADO">
                                            EMPLEADO
                                        </option>
                                        <option value="ADMIN">
                                            ADMINISTRADOR
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-light border"
                                    data-bs-dismiss="modal"
                                >
                                    Cerrar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-dark px-4"
                                >
                                    {formData.id ? "Actualizar" : "Guardar"}
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
