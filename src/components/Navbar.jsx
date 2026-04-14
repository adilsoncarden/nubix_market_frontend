import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState(
        () => localStorage.getItem("username") || "",
    );

    useEffect(() => {
        const handleStorage = () => {
            setUsername(localStorage.getItem("username") || "");
        };

        window.addEventListener("storage", handleStorage);
        window.addEventListener("localStorageChanged", handleStorage);
        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("localStorageChanged", handleStorage);
        };
    }, []);

    useEffect(() => {
        setUsername(localStorage.getItem("username") || "");
    }, [location]);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUsername("");
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success sticky-top shadow-sm py-3">
            <div className="container">
                <a
                    className="navbar-brand d-flex align-items-center fw-bold fs-4"
                    href="/"
                >
                    <span
                        className="bg-white text-success rounded-circle d-flex align-items-center justify-content-center me-2 shadow-sm"
                        style={{
                            width: "40px",
                            height: "40px",
                            overflow: "hidden",
                        }}
                    >
                        <img
                            src={logoImage}
                            alt="Nubix Logo"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </span>
                    Nubix Market
                </a>

                <div className="d-none d-md-flex flex-grow-1 mx-5">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control rounded-pill ps-4 py-2"
                            placeholder="Buscar productos..."
                        />
                    </div>
                </div>

                <div className="d-flex align-items-center gap-4">
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
                    {username ? (
                        <>
                            <span className="text-white d-none d-md-block fw-medium">
                                {username}
                            </span>
                            <a
                                className="text-white text-decoration-none d-flex align-items-center fw-medium"
                                href="#"
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right fs-4 me-1"></i>
                                <span className="d-none d-md-inline">
                                    Cerrar sesión
                                </span>
                            </a>
                        </>
                    ) : (
                        <a
                            className="text-white text-decoration-none d-flex align-items-center fw-medium"
                            href="/login"
                        >
                            <i className="bi bi-person fs-4 me-1"></i>
                            <span className="d-none d-md-inline">Login</span>
                        </a>
                    )}
                    <a className="text-white position-relative" href="/cart">
                        <i className="bi bi-cart3 fs-3"></i>
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
