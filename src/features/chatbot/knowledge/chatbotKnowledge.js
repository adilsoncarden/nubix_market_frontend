/**
 * Base de conocimiento del asistente Nubix Market.
 * Derivada de chatbot-context.md y alineada con el código actual del proyecto.
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
    adminLogin: "/admin-login",
    adminDashboard: "/admin/dashboard",
    adminProducts: "/admin/productos",
    adminCategories: "/admin/categorias",
    adminSales: "/admin/ventas",
    adminSuppliers: "/admin/proveedores",
    adminClients: "/admin/usuarios/clientes",
    adminEmployees: "/admin/usuarios/empleados",
};

export const ENUMS = {
    metodoPago: ["EFECTIVO", "YAPE", "TRANSFERENCIA", "TARJETA", "CREDITO"],
    tipoEntrega: ["PRESENCIAL", "FAST_LANE", "DELIVERY"],
    estadoPedido: [
        "PENDIENTE",
        "EN_PROCESO",
        "LISTO_PARA_RECOJO",
        "EN_CAMINO",
        "ENTREGADO",
    ],
    estadoPago: ["PENDIENTE", "PAGADO", "APROBADO", "RECHAZADO"],
};

export const LIMITATIONS = [
    "El carrito vive en tu navegador (localStorage); no se sincroniza con el servidor.",
    "No hay historial de pedidos para clientes en la web (solo el admin ve todas las ventas).",
    "Los pagos no pasan por pasarelas externas (Stripe/PayPal); se registran en el sistema.",
    "El endpoint /api/carrito del backend no está implementado; el catálogo web filtra en frontend.",
];

export const QUICK_REPLIES = {
    [ROLES.GUEST]: [
        "¿Cómo compro?",
        "Registrarme",
        "Olvidé mi contraseña",
        "Métodos de pago",
    ],
    [ROLES.CLIENT]: [
        "¿Cómo compro?",
        "Carrito y checkout",
        "Tipos de entrega",
        "Problema al pagar",
    ],
    [ROLES.ADMIN]: [
        "Crear producto",
        "Gestionar ventas",
        "Estados de pedido",
        "Exportar Excel",
    ],
};

export const INTENT_KEYWORDS = {
    help: [
        "ayuda",
        "help",
        "hola",
        "buenas",
        "inicio",
        "que puedes",
        "qué puedes",
        "menu",
        "menú",
    ],
    purchase: [
        "compr",
        "carrito",
        "checkout",
        "tienda",
        "shop",
        "catalogo",
        "catálogo",
        "producto",
        "agregar",
        "boleta",
        "factura",
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
        "admin-login",
    ],
    order: [
        "pedido",
        "orden",
        "entrega",
        "envio",
        "envío",
        "estado",
        "seguir",
        "pago",
        "yape",
        "credito",
        "crédito",
    ],
    admin: [
        "admin",
        "panel",
        "productos",
        "categor",
        "proveedor",
        "venta",
        "empleado",
        "cliente",
        "crud",
        "crear",
        "editar",
        "eliminar",
        "export",
        "excel",
        "inventario",
        "stock",
    ],
    error: [
        "error",
        "falla",
        "falló",
        "no funciona",
        "problema",
        "bug",
        "no puedo",
        "no carga",
        "401",
        "403",
    ],
    favorites: ["favorit", "wishlist", "guardad"],
    system: [
        "sistema",
        "flujo",
        "como funciona",
        "cómo funciona",
        "arquitectura",
        "backend",
        "frontend",
        "limitacion",
        "limitación",
    ],
};
