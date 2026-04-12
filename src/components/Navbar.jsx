import React from "react";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success sticky-top shadow-sm py-3">
            {" "}
            <div className="container">
                <a
                    className="navbar-brand d-flex align-items-center fw-bold fs-4"
                    href="/"
                >
                    <span
                        className="bg-white text-success rounded-circle d-flex align-items-center justify-content-center me-2 shadow-sm"
                        style={{ width: "40px", height: "40px" }}
                    >
                        Y
                    </span>
                    Nubix Market
                </a>

                <div className="d-none d-md-flex flex-grow-1 mx-5">
                    {" "}
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control rounded-pill ps-4 py-2"
                            placeholder="Buscar productos..."
                        />
                    </div>
                </div>

                <div className="d-flex align-items-center gap-4">
                    {" "}
                    <a
                        className="text-white text-decoration-none d-none d-md-block fw-medium"
                        href="/"
                    >
                        Inicio
                    </a>
                    <a
                        className="text-white text-decoration-none d-none d-md-block fw-medium"
                        href="/shop"
                    >
                        Tienda
                    </a>
                    <a
                        className="text-white text-decoration-none d-flex align-items-center fw-medium"
                        href="/login"
                    >
                        <i className="bi bi-person fs-4 me-1"></i>
                        <span className="d-none d-md-inline">Login</span>
                    </a>
                    <a className="text-white position-relative" href="/cart">
                        <i className="bi bi-cart3 fs-3"></i>
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
