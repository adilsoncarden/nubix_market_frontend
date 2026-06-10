/**
 * Base de conocimiento del asistente Nubix Market (web pública).
 */

export const ROLES = {
    GUEST: "guest",
    CLIENT: "client",
    ADMIN: "admin",
};

export const ROUTES = {
    home: "/",
    shop: "/shop",
    cart: "/cart",
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    resetPasswordManual: "/reset-password/manual",
    favorites: "/favorites",
    misPedidos: "/mis-pedidos",
    adminLogin: "/admin-login",
    adminDashboard: "/admin/dashboard",
    adminProducts: "/admin/productos",
    adminCategories: "/admin/categorias",
    adminSales: "/admin/ventas",
    adminSuppliers: "/admin/proveedores",
    adminClients: "/admin/usuarios/clientes",
    adminEmployees: "/admin/usuarios/empleados",
};

export const WHATSAPP_URL =
    "https://wa.me/51933190414?text=" +
    encodeURIComponent("Hola, quiero consultar sobre un producto");

export const CHIP_TYPES = {
    MESSAGE: "message",
    NAVIGATE: "navigate",
    EXTERNAL: "external",
};

export const WEB_PAYMENT_METHODS = [
    {
        name: "Yape",
        summary:
            "Paga desde la app Yape. En el checkout ingresas el código de operación para validar tu pago.",
    },
    {
        name: "Plin",
        summary:
            "Paga con Plin igual que Yape. Al finalizar, valida el pago con tu código de operación.",
    },
    {
        name: "Tarjeta",
        summary:
            "Pago con tarjeta simulado en la web. Completa los datos y confirma en el paso de validación.",
    },
];

export const WEB_DELIVERY_TYPES = [
    {
        name: "Fast Lane",
        key: "FAST_LANE",
        summary:
            "Recojo en tienda. Al confirmar recibes un código para retirar tu pedido más rápido.",
    },
    {
        name: "Delivery",
        key: "DELIVERY",
        summary:
            "Envío a domicilio en Lima. Indica distrito, dirección y referencia en el checkout.",
    },
    {
        name: "Presencial",
        key: "PRESENCIAL",
        summary:
            "Compra y recoge en el local. Ideal si prefieres atención directa en tienda.",
    },
];

export const PURCHASE_STEPS = [
    "Busca productos en la tienda",
    "Agrégalos al carrito",
    "Inicia sesión y ve a Carrito → Finalizar compra",
    "Elige método de pago y tipo de entrega",
    "Confirma tu pedido y guarda tu comprobante",
];

export const INTENT_KEYWORDS = {
    help: [
        "ayuda",
        "help",
        "hola",
        "buenas",
        "hey",
        "inicio",
        "que puedes",
        "qué puedes",
        "menu",
        "menú",
        "asistente",
    ],
    search: [
        "buscar",
        "busco",
        "quiero",
        "necesito",
        "dame",
        "mostrar",
        "encontrar",
        "arroz",
        "bebida",
        "lacteo",
        "snack",
        "abarrote",
    ],
    purchase: [
        "compr",
        "checkout",
        "tienda",
        "shop",
        "catalogo",
        "catálogo",
        "agregar",
        "boleta",
        "factura",
        "como compro",
        "cómo compro",
        "guia",
        "guía",
        "pasos",
    ],
    cart: [
        "carrito",
        "tengo en",
        "que llevo",
        "qué llevo",
        "mi carrito",
        "cantidad",
    ],
    auth: [
        "login",
        "iniciar",
        "sesion",
        "sesión",
        "registr",
        "cuenta",
        "contraseña",
        "password",
        "olvide",
        "olvidé",
        "recuper",
        "codigo",
        "código",
    ],
    order: [
        "pedido",
        "orden",
        "estado",
        "seguir",
        "mis pedidos",
        "historial",
        "donde esta",
        "dónde está",
    ],
    payment: [
        "pago",
        "pagar",
        "yape",
        "plin",
        "tarjeta",
        "metodo",
        "método",
        "transferencia",
    ],
    delivery: [
        "entrega",
        "envio",
        "envío",
        "delivery",
        "fast lane",
        "fastlane",
        "recojo",
        "domicilio",
        "presencial",
    ],
    error: [
        "error",
        "falla",
        "falló",
        "no funciona",
        "problema",
        "no puedo",
        "no carga",
        "no me deja",
        "sin stock",
        "agotado",
        "stock",
    ],
    favorites: ["favorit", "wishlist", "guardad"],
    whatsapp: ["whatsapp", "whats", "contacto", "soporte", "humano", "asesor"],
};

/** Chips reutilizables para la web pública */
export const WEB_CHIPS = {
    search: {
        label: "Buscar producto",
        type: CHIP_TYPES.MESSAGE,
        message: "buscar producto",
    },
    cart: {
        label: "Ver mi carrito",
        type: CHIP_TYPES.NAVIGATE,
        path: ROUTES.cart,
        requireAuth: true,
        confirmText: "Te llevo a tu carrito 🛒",
    },
    howToBuy: {
        label: "¿Cómo comprar?",
        type: CHIP_TYPES.MESSAGE,
        message: "¿Cómo comprar?",
    },
    payment: {
        label: "Métodos de pago",
        type: CHIP_TYPES.MESSAGE,
        message: "métodos de pago",
    },
    delivery: {
        label: "Tipos de entrega",
        type: CHIP_TYPES.MESSAGE,
        message: "tipos de entrega",
    },
    orders: {
        label: "Estado de pedido",
        type: CHIP_TYPES.NAVIGATE,
        path: ROUTES.misPedidos,
        requireAuth: true,
        confirmText: "Abro tus pedidos para que veas el estado 📦",
    },
    whatsapp: {
        label: "Hablar por WhatsApp",
        type: CHIP_TYPES.EXTERNAL,
        url: WHATSAPP_URL,
        confirmText: "Abriendo WhatsApp para que nos escribas 💬",
    },
    login: {
        label: "Iniciar sesión",
        type: CHIP_TYPES.NAVIGATE,
        path: ROUTES.login,
        confirmText: "Te llevo al inicio de sesión 🔐",
    },
    shop: {
        label: "Ir a la tienda",
        type: CHIP_TYPES.NAVIGATE,
        path: ROUTES.shop,
        confirmText: "Te llevo a la tienda 🛍️",
    },
    problems: {
        label: "Tengo un problema",
        type: CHIP_TYPES.MESSAGE,
        message: "no puedo comprar",
    },
};

export const WEB_WELCOME_MESSAGE =
    "¡Hola! 👋 Soy tu asistente virtual de Nubix Market.\n\n" +
    "Puedo ayudarte con:\n" +
    "🛒 Buscar productos\n" +
    "📦 Estado de pedidos\n" +
    "💳 Métodos de pago\n" +
    "🚚 Entregas\n\n" +
    "¿En qué te ayudo?";

export function getDefaultWebChips(role) {
    const base = [
        WEB_CHIPS.search,
        WEB_CHIPS.cart,
        WEB_CHIPS.howToBuy,
        WEB_CHIPS.payment,
        WEB_CHIPS.orders,
        WEB_CHIPS.whatsapp,
    ];
    if (role === ROLES.GUEST) {
        return [WEB_CHIPS.search, WEB_CHIPS.howToBuy, WEB_CHIPS.payment, WEB_CHIPS.login, WEB_CHIPS.whatsapp];
    }
    return base;
}

/** Sugerencias dinámicas según la página actual */
export function getPageContextChips(pathname, role) {
    if (pathname === ROUTES.cart) {
        return [
            { label: "¿Necesitas ayuda con el pago?", type: CHIP_TYPES.MESSAGE, message: "métodos de pago" },
            WEB_CHIPS.delivery,
            WEB_CHIPS.problems,
            WEB_CHIPS.whatsapp,
        ];
    }
    if (pathname.startsWith("/producto/")) {
        return [
            { label: "¿Cómo agregar al carrito?", type: CHIP_TYPES.MESSAGE, message: "¿Cómo comprar?" },
            WEB_CHIPS.cart,
            WEB_CHIPS.payment,
            WEB_CHIPS.search,
        ];
    }
    if (pathname === ROUTES.shop) {
        return [
            WEB_CHIPS.howToBuy,
            WEB_CHIPS.cart,
            WEB_CHIPS.payment,
            WEB_CHIPS.delivery,
        ];
    }
    if (pathname === ROUTES.misPedidos) {
        return [
            { label: "¿Cómo sigo mi pedido?", type: CHIP_TYPES.MESSAGE, message: "estado de pedido" },
            WEB_CHIPS.whatsapp,
            WEB_CHIPS.shop,
        ];
    }
    if (pathname === ROUTES.favorites) {
        return [
            WEB_CHIPS.cart,
            WEB_CHIPS.shop,
            WEB_CHIPS.howToBuy,
        ];
    }
    return getDefaultWebChips(role);
}

export function getFallbackChips(role) {
    return [
        WEB_CHIPS.search,
        WEB_CHIPS.howToBuy,
        WEB_CHIPS.payment,
        WEB_CHIPS.cart,
        WEB_CHIPS.whatsapp,
        ...(role === ROLES.GUEST ? [WEB_CHIPS.login] : [WEB_CHIPS.orders]),
    ];
}
