import { useLayoutEffect, useRef } from "react";

/**
 * Envuelve tablas admin y aplica data-label desde thead para vista card en móvil.
 */
export default function AdminResponsiveTable({ children, className = "" }) {
    const wrapRef = useRef(null);

    useLayoutEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;

        const table = wrap.querySelector("table");
        if (!table) return;

        const applyLabels = () => {
            const headers = Array.from(table.querySelectorAll("thead th")).map(
                (th) => th.textContent?.replace(/\s+/g, " ").trim() || "",
            );

            table.querySelectorAll("tbody tr").forEach((tr) => {
                const cells = tr.querySelectorAll("td");
                if (cells.length === 1 && cells[0].hasAttribute("colspan")) {
                    cells[0].removeAttribute("data-label");
                    return;
                }
                cells.forEach((td, i) => {
                    if (headers[i]) {
                        td.setAttribute("data-label", headers[i]);
                    }
                });
            });
        };

        applyLabels();

        const tbody = table.querySelector("tbody");
        if (!tbody) return undefined;

        const observer = new MutationObserver(applyLabels);
        observer.observe(tbody, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, [children]);

    const classes = ["table-responsive", "admin-table-cards", className]
        .filter(Boolean)
        .join(" ");

    return <div ref={wrapRef} className={classes}>{children}</div>;
}
