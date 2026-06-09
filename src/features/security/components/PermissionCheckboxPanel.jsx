import { useMemo } from "react";
import { PERMISO_MODULOS } from "../constants/securityModules";

export default function PermissionCheckboxPanel({
    permisos = [],
    selectedIds = [],
    onToggle,
    disabled = false,
}) {
    const grouped = useMemo(() => {
        const order = [...PERMISO_MODULOS];
        const map = new Map();
        for (const p of permisos) {
            const key = p.modulo || "Otros";
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key).push(p);
        }
        const result = [];
        for (const title of order) {
            if (map.has(title)) {
                result.push({
                    title,
                    items: map.get(title).sort((a, b) =>
                        a.nombre.localeCompare(b.nombre),
                    ),
                });
                map.delete(title);
            }
        }
        for (const [title, items] of map.entries()) {
            result.push({
                title,
                items: items.sort((a, b) =>
                    a.nombre.localeCompare(b.nombre),
                ),
            });
        }
        return result;
    }, [permisos]);

    if (!permisos.length) {
        return (
            <p className="text-muted small mb-0">
                No hay permisos registrados. Cree permisos en el submódulo
                Permisos.
            </p>
        );
    }

    return (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 permission-modules-grid">
            {grouped.map((group) => (
                <div key={group.title} className="col">
                    <div className="card h-100 permission-module-card">
                        <div className="card-header permission-module-card-header">
                            <div className="d-flex align-items-center justify-content-between gap-2">
                                <h6 className="permission-module-title mb-0">
                                    {group.title}
                                </h6>
                                <span className="permission-module-count badge rounded-pill bg-emerald-100 text-emerald-600">
                                    {group.items.length}
                                </span>
                            </div>
                        </div>
                        <div className="card-body permission-module-card-body d-flex flex-column">
                            {group.items.map((permiso) => (
                                <label
                                    key={permiso.id}
                                    className="form-check d-flex align-items-start permission-check-item mb-0"
                                >
                                    <input
                                        className="form-check-input mt-1 flex-shrink-0"
                                        type="checkbox"
                                        disabled={disabled}
                                        checked={selectedIds.includes(
                                            permiso.id,
                                        )}
                                        onChange={() => onToggle(permiso.id)}
                                    />
                                    <span className="min-w-0">
                                        <span className="admin-slug-badge d-inline-block mb-1 text-break">
                                            {permiso.nombre}
                                        </span>
                                        <span className="text-muted small d-block lh-sm">
                                            {permiso.descripcion}
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
