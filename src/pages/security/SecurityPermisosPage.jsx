import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "bootstrap";
import AdminPagination from "../../components/admin/AdminPagination";
import { PERMISO_MODULOS, MODULO_FILTER_ALL } from "../../features/security/constants/securityModules";
import SearchInput from "../../components/admin/SearchInput";
import AdminToolbarPanel from "../../components/admin/AdminToolbarPanel";
import AdminModal, { AdminModalActions } from "../../components/admin/AdminModal";
import { securityService } from "../../features/security/services/securityService";
import { useAdminPagination } from "../../hooks/useAdminPagination";
import { Toast, confirmDelete } from "../../utils/swalConfig";

const emptyForm = { nombre: "", descripcion: "", modulo: PERMISO_MODULOS[0] };

export default function SecurityPermisosPage() {
    const [permisos, setPermisos] = useState([]);
    const [modulos, setModulos] = useState(PERMISO_MODULOS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterModulo, setFilterModulo] = useState(MODULO_FILTER_ALL);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const modalRef = useRef();
    const bsModal = useRef();

    const load = async () => {
        setLoading(true);
        try {
            const [permisosData, modulosApi] = await Promise.all([
                securityService.getPermisos(),
                securityService.getPermisoModulos(),
            ]);
            setPermisos(permisosData);
            const merged = [
                ...new Set([...PERMISO_MODULOS, ...modulosApi]),
            ].sort((a, b) => a.localeCompare(b, "es"));
            setModulos(merged);
        } catch (err) {
            console.error(err);
            Toast.fire({ icon: "error", title: "Error al cargar permisos" });
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
        return permisos.filter((p) => {
            const matchModulo =
                !filterModulo || p.modulo === filterModulo;
            const matchSearch =
                !q ||
                p.nombre?.toLowerCase().includes(q) ||
                p.descripcion?.toLowerCase().includes(q) ||
                p.modulo?.toLowerCase().includes(q);
            return matchModulo && matchSearch;
        });
    }, [permisos, searchTerm, filterModulo]);

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
    }, [searchTerm, filterModulo, resetPage]);

    const openModal = (permiso = null) => {
        setSelected(permiso);
        setForm(
            permiso
                ? {
                      nombre: permiso.nombre,
                      descripcion: permiso.descripcion,
                      modulo: permiso.modulo || PERMISO_MODULOS[0],
                  }
                : emptyForm,
        );
        bsModal.current?.show();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (selected) {
                await securityService.updatePermiso(selected.id, form);
                Toast.fire({ icon: "success", title: "Permiso actualizado" });
            } else {
                await securityService.createPermiso(form);
                Toast.fire({ icon: "success", title: "Permiso creado" });
            }
            bsModal.current?.hide();
            await load();
        } catch (err) {
            Toast.fire({
                icon: "error",
                title: err.response?.data || "Error al guardar permiso",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (permiso) => {
        const result = await confirmDelete(
            `¿Eliminar el permiso "${permiso.nombre}"?`,
        );
        if (!result.isConfirmed) return;
        try {
            await securityService.deletePermiso(permiso.id);
            Toast.fire({ icon: "success", title: "Permiso eliminado" });
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
                        <span className="admin-accent-slash">/</span> Permisos
                    </h2>
                    <p className="text-muted small mb-0">
                        Acciones atómicas del sistema agrupadas por módulo
                    </p>
                </div>
                <button
                    type="button"
                    className="btn btn-success shadow-sm px-4 py-2 fw-bold admin-btn-primary"
                    onClick={() => openModal()}
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Nuevo permiso
                </button>
            </div>

            <AdminToolbarPanel
                className="admin-permisos-toolbar"
                stats={[
                    {
                        icon: "bi bi-shield-check fs-4",
                        label: "Permisos registrados",
                        value: totalItems,
                    },
                ]}
            >
                <SearchInput
                    placeholder="Buscar por nombre, descripción o módulo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="form-select admin-filter-select admin-toolbar-select"
                    value={filterModulo}
                    onChange={(e) => setFilterModulo(e.target.value)}
                    aria-label="Filtrar por módulo"
                >
                    <option value={MODULO_FILTER_ALL}>
                        Todos los módulos
                    </option>
                    {modulos.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
            </AdminToolbarPanel>

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
                                    MÓDULO
                                </th>
                                <th className="py-3 text-secondary small fw-bold">
                                    NOMBRE (SLUG)
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
                                    <td colSpan={5} className="text-center py-5">
                                        <div
                                            className="spinner-border text-emerald-600"
                                            role="status"
                                        />
                                    </td>
                                </tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((p, index) => (
                                    <tr key={p.id}>
                                        <td className="px-4 py-3">
                                            <span className="text-muted small fw-bold">
                                                {indexOfFirstItem + index + 1}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span className="admin-module-badge">
                                                {p.modulo}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span className="admin-slug-badge">
                                                {p.nombre}
                                            </span>
                                        </td>
                                        <td className="py-3 text-muted small">
                                            {p.descripcion}
                                        </td>
                                        <td className="text-end px-4 py-3">
                                            <button
                                                type="button"
                                                className="btn-action btn-edit me-2"
                                                title="Editar"
                                                onClick={() => openModal(p)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-action btn-delete"
                                                title="Eliminar"
                                                onClick={() => handleDelete(p)}
                                            >
                                                <i className="bi bi-trash3-fill"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center py-5 text-muted"
                                    >
                                        No se encontraron permisos
                                        coincidentes.
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

            <AdminModal
                modalRef={modalRef}
                title={selected ? "Editar Permiso" : "Nuevo Permiso"}
                onClose={() => bsModal.current?.hide()}
                closeDisabled={saving}
            >
                <form onSubmit={handleSave}>
                    <div className="mb-3">
                        <label className="form-label">Módulo</label>
                        <select
                            className="form-select"
                            value={form.modulo}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    modulo: e.target.value,
                                }))
                            }
                            required
                        >
                            {modulos.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nombre (slug único)</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={form.nombre}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    nombre: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>
                    <div className="mb-0">
                        <label className="form-label">Descripción</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            placeholder=""
                            value={form.descripcion}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    descripcion: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>
                    <AdminModalActions
                        onClose={() => bsModal.current?.hide()}
                        inlineSubmit
                        saving={saving}
                        cancelLabel="Cancelar"
                        confirmLabel="Guardar"
                    />
                </form>
            </AdminModal>
        </div>
    );
}
