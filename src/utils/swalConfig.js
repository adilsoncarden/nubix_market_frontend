import Swal from "sweetalert2";

export const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
});

/** Confirmación modal centrada (comportamiento por defecto de SweetAlert2). */
export const confirmDelete = (title, text = "Esta acción no se puede revertir.") =>
    Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
    });

export const alertLoginRequired = () =>
    Swal.fire({
        icon: "info",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar productos al carrito.",
        confirmButtonText: "Ir a login",
        confirmButtonColor: "#10b981",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#6b7280",
        reverseButtons: true,
    });
