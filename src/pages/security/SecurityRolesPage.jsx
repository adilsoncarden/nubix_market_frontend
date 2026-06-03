import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "bootstrap";
import AdminPagination from "../../components/admin/AdminPagination";
import PermissionCheckboxPanel from "../../features/security/components/PermissionCheckboxPanel";
import { securityService } from "../../features/security/services/securityService";
import { useAdminPagination } from "../../hooks/useAdminPagination";
import { Toast, confirmDelete } from "../../utils/swalConfig";

const emptyRolForm = { nombre: "", descripcion: "" };
const ROLES_BASE = ["ADMIN", "CLIENTE"];

const isSupremeAdminRole = (rol) => {
    const nombre = String(rol?.nombre ?? "").trim().toUpperCase();
    return nombre === "ADMIN" || nombre === "ADMINISTRADOR" || rol?.id === 1;
};

export default function SecurityRolesPage() {
    const [roles, setRoles] = useState([]);
    const [permisos, setPermisos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRol, setSelectedRol] = useState(null);
    const [rolForm, setRolForm] = useState(emptyRolForm);
    const [selectedPermisoIds, setSelectedPermisoIds] = useState([]);

    const modalRef = useRef();
    const bsModal = useRef();

    const load = async () => {
        setLoading(true);
        try {
            const [rolesData, permisosData] = await Promise.all([
                securityService.getRoles(),
                securityService.getPermisos(),
            ]);
            setRoles(rolesData);
            setPermisos(permisosData);
        } catch (err) {
            console.error(err);
            Toast.fire({ icon: "error", title: "Error al cargar roles" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        if (modalRef.current) {
            bsModal.current = new Modal(modalRef.current);
        }
    }, []);

    const filtered = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return roles;
        return roles.filter(
            (r) =>
                r.nombre?.toLowerCase().includes(q) ||
                r.descripcion?.toLowerCase().includes(q),
        );
    }, [roles, searchTerm]);

    const {
        currentPage,
        totalPages,
        totalItems,
        indexOfFirstItem,
        indexOfLastItem,
        currentItems,
        paginate,
        resetPage,
    } = useAdminPagination(filtered, 10);

    useEffect(() => {
        resetPage();
    }, [searchTerm, resetPage]);

    const openModal = async (rol = null) => {
        setSelectedRol(rol);
        setRolForm(
            rol
                ? { nombre: rol.nombre, descripcion: rol.descripcion || "" }
                : emptyRolForm,
        );
        if (rol) {
            try {
                const ids = await securityService.getRolPermisoIds(rol.id);
                setSelectedPermisoIds(ids);
            } catch {
                setSelectedPermisoIds([]);
            }
        } else {
            setSelectedPermisoIds([]);
        }
        bsModal.current?.show();
    };

    const togglePermiso = (id) => {
        setSelectedPermisoIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let rolId;
            if (selectedRol) {
                const updated = await securityService.updateRol(
                    selectedRol.id,
                    rolForm,
                );
                rolId = updated.id;
                Toast.fire({ icon: "success", title: "Rol actualizado" });
            } else {
                const created = await securityService.createRol(rolForm);
                rolId = created.id;
                Toast.fire({ icon: "success", title: "Rol creado" });
            }
            await securityService.syncRolPermisos(rolId, selectedPermisoIds);
            bsModal.current?.hide();
            await load();
        } catch (err) {
            Toast.fire({
                icon: "error",
                title: err.response?.data || "Error al guardar rol",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (rol) => {
        if (isSupremeAdminRole(rol)) {
            Toast.fire({
                icon: "warning",
                title: "El rol de Administrador Supremo no puede ser eliminado",
            });
            return;
        }
        if (ROLES_BASE.includes(rol.nombre)) {
            Toast.fire({
                icon: "warning",
                title: "Los roles base ADMIN y CLIENTE no se pueden eliminar",
            });
            return;
        }
        const result = await confirmDelete(`¿Eliminar el rol "${rol.nombre}"?`);
        if (!result.isConfirmed) return;
        try {
            await securityService.deleteRol(rol.id);
            Toast.fire({ icon: "success", title: "Rol eliminado" });
            await load();
        } catch (err) {
            Toast.fire({
                icon: "error",
                title: err.response?.data || "No se pudo eliminar",
            });
        }
    };

    return (
        <div className="admin-page animate__animated animate__fadeIn">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="admin-page-title fw-bold mb-1">
                        Seguridad{" "}
                        <span className="admin-accent-slash">/</span> Roles
                    </h2>
                    <p className="text-muted small mb-0">
                        Perfiles de acceso y asignación dinámica de permisos
                    </p>
                </div>
                <button
                    type="button"
                    className="btn btn-success shadow-sm px-4 py-2 fw-bold admin-btn-primary"
                    onClick={() => openModal()}
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Nuevo rol
                </button>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div
                        className="card border-0 shadow-sm p-3"
                        style={{ borderRadius: "15px" }}
                    >
                        <div className="d-flex align-items-center">
                            <div
                                className="flex-shrink-0 bg-emerald-100 text-emerald-600 rounded-3 d-flex align-items-center justify-content-center"
                                style={{ width: "48px", height: "48px" }}
                            >
                                <i className="bi bi-person-badge fs-4"></i>
                            </div>
                            <div className="ms-3">
                                <h6 className="text-muted mb-0 small fw-bold text-uppercase">
                                    Roles
                                </h6>
                                <h3 className="fw-bold mb-0">{totalItems}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div
                        className="card border-0 shadow-sm p-2 d-flex flex-row align-items-center px-3 admin-search-card"
                        style={{ borderRadius: "15px", minHeight: "72px" }}
                    >
                        <i className="bi bi-search text-emerald-600 me-3 fs-5"></i>
                        <input
                            type="search"
                            className="form-control border-0 shadow-none bg-transparent"
                            placeholder="Buscar por nombre o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div
                className="card shadow-sm border-0 overflow-hidden"
                style={{ borderRadius: "15px" }}
            >
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 admin-premium-table">
                        <thead className="bg-light">
                            <tr>
                                <th
                                    className="px-4 py-3 text-secondary small fw-bold"
                                    style={{ width: "56px" }}
                                >
                                    #
                                </th>
                                <th className="py-3 text-secondary small fw-bold">
                                    ROL
                                </th>
                                <th className="py-3 text-secondary small fw-bold">
                                    DESCRIPCIÓN
                                </th>
                                <th className="text-end px-4 py-3 text-secondary small fw-bold">
                                    ACCIONES
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-5">
                                        <div
                                            className="spinner-border text-emerald-600"
                                            role="status"
                                        />
                                    </td>
                                </tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((r, index) => (
                                    <tr key={r.id}>
                                        <td className="px-4 py-3">
                                            <span className="text-muted small fw-bold">
                                                {indexOfFirstItem + index + 1}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span className="admin-role-badge">
                                                {r.nombre}
                                            </span>
                                        </td>
                                        <td className="py-3 text-muted small">
                                            {r.descripcion || "—"}
                                        </td>
                                        <td className="text-end px-4 py-3">
                                            <button
                                                type="button"
                                                className="btn-action btn-edit me-2"
                                                title="Editar y permisos"
                                                onClick={() => openModal(r)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            {!isSupremeAdminRole(r) && (
                                                <button
                                                    type="button"
                                                    className="btn-action btn-delete"
                                                    title="Eliminar"
                                                    disabled={
                                                        String(
                                                            r.nombre,
                                                        ).toUpperCase() ===
                                                        "CLIENTE"
                                                    }
                                                    onClick={() =>
                                                        handleDelete(r)
                                                    }
                                                >
                                                    <i className="bi bi-trash3-fill"></i>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-center py-5 text-muted"
                                    >
                                        No se encontraron roles coincidentes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <AdminPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={paginate}
                    totalItems={totalItems}
                    indexOfFirstItem={indexOfFirstItem}
                    indexOfLastItem={indexOfLastItem}
                />
            </div>

            <div
                className="modal fade"
                ref={modalRef}
                tabIndex={-1}
                data-bs-backdrop="static"
            >
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div
                        className="modal-content border-0 shadow-lg d-flex flex-column role-permisos-modal"
                        style={{ maxHeight: "min(90vh, 720px)" }}
                    >
                        <form
                            onSubmit={handleSave}
                            className="d-flex flex-column flex-grow-1 min-h-0"
                        >
                            <div className="modal-header border-0 flex-shrink-0 bg-body">
                                <h5 className="modal-title fw-bold">
                                    {selectedRol
                                        ? `Editar rol: ${selectedRol.nombre}`
                                        : "Nuevo rol"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                />
                            </div>
                            <div className="modal-body flex-grow-1 min-h-0 overflow-hidden d-flex flex-column pt-0">
                                <div className="row g-3 mb-3 flex-shrink-0">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">
                                            Nombre del rol *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder=""
                                            value={rolForm.nombre}
                                            onChange={(e) =>
                                                setRolForm((f) => ({
                                                    ...f,
                                                    nombre: e.target.value,
                                                }))
                                            }
                                            disabled={
                                                selectedRol &&
                                                ROLES_BASE.includes(
                                                    selectedRol.nombre,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small">
                                            Descripción
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder=""
                                            value={rolForm.descripcion}
                                            onChange={(e) =>
                                                setRolForm((f) => ({
                                                    ...f,
                                                    descripcion:
                                                        e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>

                                <hr className="flex-shrink-0 my-2" />

                                <div className="d-flex align-items-center justify-content-between flex-shrink-0 mb-2">
                                    <h6 className="fw-bold mb-0">
                                        <i className="bi bi-shield-check me-2 text-emerald-600"></i>
                                        Permisos asignados
                                    </h6>
                                    <span className="text-muted small">
                                        {selectedPermisoIds.length} seleccionados
                                    </span>
                                </div>
                                <div className="permission-panel-scroll flex-grow-1 overflow-y-auto pe-1">
                                    <PermissionCheckboxPanel
                                        permisos={permisos}
                                        selectedIds={selectedPermisoIds}
                                        onToggle={togglePermiso}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer border-0 flex-shrink-0 bg-body border-top">
                                <button
                                    type="button"
                                    className="btn btn-light"
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-success fw-bold admin-btn-primary"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-save me-2"></i>
                                            Guardar cambios
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
