import Swal from "sweetalert2";
import { setRedirectUrl } from "./authUtils";

const FAVORITES_PATH = "/favorites";

export const CART_LOGIN_MESSAGE =
    "Debes iniciar sesión para agregar productos al carrito.";

export const FAVORITES_LOGIN_MESSAGE =
    "Debes iniciar sesión para agregar productos a favoritos.";

const bindToastHover = (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
};

const bindFavoritesShowLink = (toast) => {
    bindToastHover(toast);
    const link = toast.querySelector("[data-nubix-fav-link]");
    link?.addEventListener("click", (e) => {
        e.preventDefault();
        Swal.close();
        window.location.assign(FAVORITES_PATH);
    });
};

export const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 800,
    timerProgressBar: false,
    customClass: {
        popup: "nubix-toast",
    },
    showClass: {
        popup: "nubix-toast-show",
    },
    hideClass: {
        popup: "nubix-toast-hide",
    },
    didOpen: bindToastHover,
});

/** Primera unidad de un producto que no estaba en el carrito. */
export const cartToastFirstAdded = () =>
    Toast.fire({
        icon: "success",
        title: "Producto agregado al carrito.",
    });

/** Eliminación total desde 1 unidad (botón − / quitar del carrito). */
export const cartToastRemovedComplete = () =>
    Toast.fire({
        icon: "success",
        title: "Has eliminado este producto de tu carrito.",
    });

/** Producto marcado como favorito. */
export const favToastAdded = () =>
    Toast.fire({
        icon: "success",
        html: `
            <div class="nubix-toast-body">
                <span>Agregado a tus favoritos</span>
                <a href="${FAVORITES_PATH}" class="nubix-toast-link" data-nubix-fav-link>Mostrar</a>
            </div>
        `,
        didOpen: bindFavoritesShowLink,
    });

/** Producto quitado de favoritos. */
export const favToastRemoved = () =>
    Toast.fire({
        icon: "success",
        title: "Eliminado de tus favoritos.",
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

export const alertLoginRequired = (text = CART_LOGIN_MESSAGE) =>
    Swal.fire({
        icon: "info",
        title: "Inicia sesión",
        text,
        confirmButtonText: "Ir a login",
        confirmButtonColor: "#10b981",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#6b7280",
        reverseButtons: true,
    });

/** Modal centrado de login requerido; redirige solo si el usuario confirma. */
export const promptLoginRequired = async (text = CART_LOGIN_MESSAGE) => {
    setRedirectUrl(window.location.pathname + window.location.search);
    const result = await alertLoginRequired(text);
    if (result.isConfirmed) {
        window.location.href = "/login";
    }
    return result.isConfirmed;
};
