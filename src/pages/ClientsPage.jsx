import React, { useState, useEffect } from "react";
import { clientService } from "../features/users/services/clientService";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";

const ClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para Edición
    const [selectedClient, setSelectedClient] = useState({
        username: "",
        email: "",
    });
    const [editModal, setEditModal] = useState(null);

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
        // Inicializar el modal de Bootstrap
        const modalElement = document.getElementById("editClientModal");
        if (modalElement) {
            setEditModal(new Modal(modalElement));
        }
    }, []);

    const handleEditClick = (client) => {
        setSelectedClient(client);
        editModal.show();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await clientService.update(selectedClient.id, {
                username: selectedClient.username,
                email: selectedClient.email,
            });

            Swal.fire(
                "¡Actualizado!",
                "Los datos del cliente se han guardado.",
                "success",
            );
            editModal.hide();
            fetchClients(); // Recargar lista
        } catch (err) {
            Swal.fire("Error", "No se pudo actualizar el cliente.", "error");
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold">Gestión de Clientes</h2>
                    <p className="text-muted small">
                        Visualiza y edita la información de tus clientes
                        registrados.
                    </p>
                </div>
                <span className="badge bg-primary rounded-pill px-3 py-2">
                    Total: {clients.length}
                </span>
            </div>

            <div className="card shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="px-4">ID</th>
                                <th>Usuario</th>
                                <th>Correo Electrónico</th>
                                <th>Rol</th>
                                <th className="text-end px-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-5"
                                    >
                                        Cargando...
                                    </td>
                                </tr>
                            ) : (
                                clients.map((client) => (
                                    <tr key={client.id}>
                                        <td className="px-4 text-muted">
                                            #{client.id}
                                        </td>
                                        <td>
                                            <span className="fw-bold">
                                                {client.username}
                                            </span>
                                        </td>
                                        <td>{client.email}</td>
                                        <td>
                                            <span className="badge border text-dark">
                                                {client.rolNombre}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            {/* ICONO DE EDITAR AÑADIDO */}
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() =>
                                                    handleEditClick(client)
                                                }
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
            </div>

            {/* MODAL DE EDICIÓN */}
            <div
                className="modal fade"
                id="editClientModal"
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title">Editar Cliente</h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                            ></button>
                        </div>
                        <form onSubmit={handleUpdate}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Nombre de Usuario
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
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
                                <div className="mb-3">
                                    <label className="form-label">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
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
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-light"
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary px-4"
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
