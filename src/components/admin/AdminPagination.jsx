export default function AdminPagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems = 0,
    indexOfFirstItem = 0,
    indexOfLastItem = 0,
}) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-body admin-pagination-bar">
            <div className="text-muted small admin-pagination-info">
                {totalItems > 0 ? (
                    <>
                        Mostrando <span className="fw-bold">{indexOfFirstItem + 1}</span> a{" "}
                        <span className="fw-bold">
                            {Math.min(indexOfLastItem, totalItems)}
                        </span>{" "}
                        de {totalItems} · Página{" "}
                    </>
                ) : (
                    <>Página </>
                )}
                <span className="fw-bold">{currentPage}</span> de{" "}
                <span className="fw-bold">{totalPages}</span>
            </div>
            <nav>
                <ul className="pagination pagination-sm mb-0 gap-1">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                            type="button"
                            className="page-link border-0 rounded-2"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>
                    </li>
                    {[...Array(totalPages).keys()].map((num) => (
                        <li key={num + 1}>
                            <button
                                type="button"
                                className={`page-link border-0 rounded-2 fw-bold ${currentPage === num + 1 ? "active-pagination" : "text-dark bg-light"}`}
                                onClick={() => onPageChange(num + 1)}
                                style={{ width: "32px", height: "32px" }}
                            >
                                {num + 1}
                            </button>
                        </li>
                    ))}
                    <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                    >
                        <button
                            type="button"
                            className="page-link border-0 rounded-2"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
