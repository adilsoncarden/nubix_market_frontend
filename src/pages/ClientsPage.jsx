import React, { useState, useEffect, useRef, useMemo } from "react";
import { clientService } from "../features/users/services/clientService";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";

const ClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [selectedClient, setSelectedClient] = useState({
        username: "",
        email: "",
    });

    const modalRef = useRef();
    const bsModal = useRef();

    // --- NOTIFICACIONES (TOAST) ---
    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    });

    const fetchClients = async () => {
        setLoading(true);
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
            modalRef.current.addEventListener("hidden.bs.modal", () => {
                setSelectedClient({ username: "", email: "" });
            });
        }
    }, []);

    // --- FILTRADO Y PAGINACIÓN ---
    const filteredClients = useMemo(() => {
        return clients.filter(
            (c) =>
                c.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.email?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [clients, searchTerm]);

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredClients.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );

    const handleEditClick = (client) => {
        setSelectedClient({ ...client });
        bsModal.current.show();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await clientService.update(selectedClient.id, {
                username: selectedClient.username,
                email: selectedClient.email,
            });
            Toast.fire({ icon: "success", title: "Cliente actualizado" });
            bsModal.current.hide();
            fetchClients();
        } catch (err) {
            Toast.fire({ icon: "error", title: "Error al actualizar" });
        }
    };

    return (
        <div className="admin-page" style={{ fontSize: "0.9rem" }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="admin-page-title fw-bold mb-1">
                        Nubix Market <span className="admin-accent-slash">/</span>{" "}
                        Clientes
                    </h2>
                    <p className="text-muted small mb-0">
                        Gestión de usuarios y accesos a la plataforma
                    </p>
                </div>
                <div
                    className="card border-0 shadow-sm px-3 py-2"
                    style={{ borderRadius: "10px" }}
                >
                    <div className="d-flex align-items-center">
                        <div
                            className="bg-emerald-100 text-emerald-600 rounded-circle me-2 d-flex align-items-center justify-content-center"
                            style={{ width: "10px", height: "10px" }}
                        ></div>
                        <span
                            className="text-secondary fw-bold text-uppercase"
                            style={{ fontSize: "10px" }}
                        >
                            Registrados:
                        </span>
                        <span className="ms-2 fw-bold text-dark">
                            {clients.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* BUSCADOR */}
            <div
                className="card border-0 shadow-sm mb-4"
                style={{ borderRadius: "12px" }}
            >
                <div className="card-body py-2 px-3 d-flex align-items-center">
                    <i className="bi bi-search text-muted me-3"></i>
                    <input
                        type="text"
                        className="form-control border-0 shadow-none bg-transparent"
                        placeholder="Buscar por nombre de usuario o correo..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        style={{ fontSize: "0.85rem" }}
                    />
                </div>
            </div>

            {/* TABLA COMPACTA */}
            <div
                className="card shadow-sm border-0 overflow-hidden"
                style={{ borderRadius: "12px" }}
            >
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr style={{ fontSize: "0.75rem" }}>
                                <th
                                    className="px-4 py-3 text-secondary fw-bold"
                                    style={{ width: "80px" }}
                                >
                                    ID
                                </th>
                                <th className="py-3 text-secondary fw-bold">
                                    USUARIO
                                </th>
                                <th className="py-3 text-secondary fw-bold">
                                    CORREO ELECTRÓNICO
                                </th>
                                <th
                                    className="py-3 text-secondary fw-bold text-center"
                                    style={{ width: "150px" }}
                                >
                                    ROL
                                </th>
                                <th
                                    className="text-end px-4 py-3 text-secondary fw-bold"
                                    style={{ width: "100px" }}
                                >
                                    ACCIONES
                                </th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: "0.85rem" }}>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-5"
                                    >
                                        <div className="spinner-border spinner-border-sm text-emerald-600"></div>
                                    </td>
                                </tr>
                            ) : currentItems.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-5 text-muted"
                                    >
                                        No se encontraron clientes.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((client) => (
                                    <tr key={client.id}>
                                        <td className="px-4 text-muted small">
                                            #{client.id}
                                        </td>
                                        <td>
                                            <span className="fw-bold text-dark">
                                                {client.username}
                                            </span>
                                        </td>
                                        <td className="text-muted">
                                            {client.email}
                                        </td>
                                        <td className="text-center">
                                            <span className="badge-role">
                                                {client.rolNombre || "Cliente"}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            <button
                                                className="btn-table-action edit"
                                                onClick={() =>
                                                    handleEditClick(client)
                                                }
                                                title="Editar cliente"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACIÓN */}
                {!loading && totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-body admin-pagination-bar">
                        <div className="text-muted small admin-pagination-info">
                            Mostrando <b>{indexOfFirstItem + 1}</b> a{" "}
                            <b>
                                {Math.min(
                                    indexOfLastItem,
                                    filteredClients.length,
                                )}
                            </b>{" "}
                            de {filteredClients.length}
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0 gap-1">
                                <li
                                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                                >
                                    <button
                                        className="page-link border-0 rounded-2"
                                        onClick={() =>
                                            setCurrentPage(currentPage - 1)
                                        }
                                    >
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li
                                        key={i}
                                        className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                                    >
                                        <button
                                            className={`page-link border-0 rounded-2 fw-bold ${currentPage === i + 1 ? "active-page" : "text-dark bg-light"}`}
                                            onClick={() =>
                                                setCurrentPage(i + 1)
                                            }
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li
                                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                                >
                                    <button
                                        className="page-link border-0 rounded-2"
                                        onClick={() =>
                                            setCurrentPage(currentPage + 1)
                                        }
                                    >
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            {/* MODAL EDITAR */}
            <div
                className="modal fade"
                ref={modalRef}
                tabIndex="-1"
                data-bs-backdrop="static"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div
                        className="modal-content border-0 shadow-lg modal-client-custom"
                        style={{ borderRadius: "15px" }}
                    >
                        <div className="modal-header border-0 pt-4 px-4 pb-0">
                            <h5 className="modal-title fw-bold text-dark">
                                Editar Información del Cliente
                            </h5>
                            <button
                                type="button"
                                className="btn-close shadow-none"
                                onClick={() => bsModal.current.hide()}
                            ></button>
                        </div>
                        <form onSubmit={handleUpdate}>
                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <label className="form-label extra-small fw-bold text-muted text-uppercase">
                                        Nombre de Usuario
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0">
                                            <i className="bi bi-person text-emerald-600"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0 py-2"
                                            value={selectedClient.username}
                                            onChange={(e) =>
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    username: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-0">
                                    <label className="form-label extra-small fw-bold text-muted text-uppercase">
                                        Correo Electrónico
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0">
                                            <i className="bi bi-envelope text-emerald-600"></i>
                                        </span>
                                        <input
                                            type="email"
                                            className="form-control bg-light border-0 py-2"
                                            value={selectedClient.email}
                                            onChange={(e) =>
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    email: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0 gap-2">
                                <button
                                    type="button"
                                    className="btn btn-light px-4 fw-bold text-secondary border"
                                    style={{ borderRadius: "10px" }}
                                    onClick={() => bsModal.current.hide()}
                                >
                                    Cerrar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-success px-4 fw-bold shadow-sm admin-btn-primary"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ClientsPage;
