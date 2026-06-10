/**
 * Buscador estándar del panel administrativo (mismo diseño que Seguridad / Permisos).
 */
export default function SearchInput({
    value,
    onChange,
    placeholder = "Buscar...",
    id,
    name,
    autoComplete = "off",
    className = "",
    wrapperClassName = "admin-search-field flex-grow-1 mb-0",
    "aria-label": ariaLabel,
    ...rest
}) {
    return (
        <label className={wrapperClassName}>
            <i className="bi bi-search" aria-hidden="true" />
            <input
                type="search"
                className={`admin-search-input ${className}`.trim()}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                id={id}
                name={name}
                autoComplete={autoComplete}
                aria-label={ariaLabel ?? placeholder}
                {...rest}
            />
        </label>
    );
}

/**
 * Contenedor para input de búsqueda + filtros opcionales al lado.
 */
export function AdminSearchBar({ children, className = "" }) {
    return (
        <div className={`admin-toolbar-search ${className}`.trim()}>
            {children}
        </div>
    );
}
