/**
 * Toolbar unificado del panel admin (mismo layout que Seguridad / Permisos).
 *
 * stats: [{ icon, label, value, iconClassName?, valueClassName? }]
 */
export function AdminToolbarStat({
    icon,
    label,
    value,
    iconClassName = "bg-emerald-100 text-emerald-600",
    valueClassName = "",
}) {
    return (
        <div className="admin-toolbar-stat-item">
            <div className={`admin-toolbar-stats-icon ${iconClassName}`}>
                <i className={icon} aria-hidden="true" />
            </div>
            <div>
                <p className="admin-toolbar-stats-label mb-0">{label}</p>
                <p
                    className={`admin-toolbar-stats-value mb-0 ${valueClassName}`.trim()}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function AdminToolbarPanel({
    stats = [],
    children,
    className = "",
}) {
    const hasStats = stats.length > 0;

    return (
        <div className={`admin-toolbar-panel mb-4 ${className}`.trim()}>
            {hasStats && (
                <>
                    <div
                        className={`admin-toolbar-stats${stats.length > 1 ? " admin-toolbar-stats--multi" : ""}`}
                    >
                        {stats.map((stat) => (
                            <AdminToolbarStat
                                key={stat.label}
                                icon={stat.icon}
                                label={stat.label}
                                value={stat.value}
                                iconClassName={stat.iconClassName}
                                valueClassName={stat.valueClassName}
                            />
                        ))}
                    </div>
                    <div className="admin-toolbar-divider" aria-hidden="true" />
                </>
            )}
            <div className="admin-toolbar-search">{children}</div>
        </div>
    );
}
