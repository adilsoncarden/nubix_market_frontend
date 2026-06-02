import {
    ROLES,
    ROUTES,
    ENUMS,
    LIMITATIONS,
    QUICK_REPLIES,
    INTENT_KEYWORDS,
} from "../knowledge/chatbotKnowledge";

export const INTENTS = {
    HELP: "help",
    PURCHASE: "purchase",
    AUTH: "auth",
    ORDER: "order",
    ADMIN: "admin",
    ERROR: "error",
    FAVORITES: "favorites",
    SYSTEM: "system",
    UNKNOWN: "unknown",
};

const normalize = (text) =>
    (text || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .trim();

const scoreIntent = (message, keywords) => {
    const m = normalize(message);
    let score = 0;
    for (const kw of keywords) {
        const k = normalize(kw);
        if (m.includes(k)) score += k.length > 4 ? 2 : 1;
    }
    return score;
};

export const detectIntent = (message) => {
    const scores = Object.entries(INTENT_KEYWORDS).map(
        ([intent, keywords]) => ({
            intent,
            score: scoreIntent(message, keywords),
        }),
    );
    scores.sort((a, b) => b.score - a.score);
    if (scores[0].score === 0) return INTENTS.UNKNOWN;
    const top = scores[0].intent;
    const map = {
        help: INTENTS.HELP,
        purchase: INTENTS.PURCHASE,
        auth: INTENTS.AUTH,
        order: INTENTS.ORDER,
        admin: INTENTS.ADMIN,
        error: INTENTS.ERROR,
        favorites: INTENTS.FAVORITES,
        system: INTENTS.SYSTEM,
    };
    return map[top] || INTENTS.UNKNOWN;
};

export const resolveUserRole = ({ token, user, pathname }) => {
    const isAdminRoute =
        pathname?.startsWith("/admin") && pathname !== ROUTES.adminLogin;
    if (isAdminRoute || user?.rol === "ADMIN" || user?.rol === "EMPLEADO") {
        return ROLES.ADMIN;
    }
    if (token && user) return ROLES.CLIENT;
    return ROLES.GUEST;
};

const link = (path, label) => `${label}: ${path}`;

const welcomeByRole = (role) => {
    if (role === ROLES.ADMIN) {
        return (
            "Hola, soy el asistente del panel Nubix Market. " +
            "Puedo guiarte en productos, categorías, proveedores, ventas y usuarios. " +
            "¿Qué necesitas?"
        );
    }
    if (role === ROLES.CLIENT) {
        return (
            "Hola, soy tu asistente en Nubix Market. " +
            "Te ayudo con compras, carrito, cuenta y entregas. ¿En qué te apoyo?"
        );
    }
    return (
        "Hola, soy el asistente de Nubix Market. " +
        "Puedo explicarte cómo comprar, crear cuenta o recuperar contraseña. ¿Qué necesitas?"
    );
};

const helpResponse = (role) => {
    if (role === ROLES.ADMIN) {
        return [
            "Comandos útiles (escribe palabras clave):",
            "• productos / categorías / proveedores / ventas — guías CRUD",
            "• estados — pedidos y pagos",
            "• export / excel — reportes",
            "• error — problemas comunes",
            "",
            link(ROUTES.adminDashboard, "Panel"),
            link(ROUTES.adminProducts, "Productos"),
            link(ROUTES.adminSales, "Ventas"),
        ].join("\n");
    }
    return [
        "Puedo ayudarte con:",
        "• Comprar en la tienda y finalizar pedido",
        "• Login, registro y contraseña",
        "• Carrito, pagos y tipos de entrega",
        "• Errores frecuentes",
        "",
        link(ROUTES.shop, "Tienda"),
        link(ROUTES.cart, "Carrito (requiere sesión)"),
        link(ROUTES.login, "Iniciar sesión"),
    ].join("\n");
};

const purchaseResponse = (role) => {
    if (role === ROLES.ADMIN) {
        return [
            "Flujo de compra (cliente):",
            "1) Tienda (/shop) → agregar al carrito",
            "2) Iniciar sesión si hace falta",
            "3) Carrito (/cart) → Finalizar compra",
            "4) Elegir boleta/factura, pago y entrega → confirmar",
            "",
            "Como admin también puedes registrar ventas en Ventas → Nueva venta.",
            link(ROUTES.adminSales, "Módulo ventas"),
        ].join("\n");
    }
    return [
        "Para comprar:",
        "1) Entra a la tienda y agrega productos al carrito",
        "2) Inicia sesión (obligatorio para pagar)",
        "3) Ve a Carrito → Finalizar compra",
        "4) Completa datos, método de pago y tipo de entrega",
        "",
        `Pagos: ${ENUMS.metodoPago.join(", ")}.`,
        `Entrega: PRESENCIAL, FAST_LANE (código recojo), DELIVERY (dirección).`,
        "",
        link(ROUTES.shop, "Ir a tienda"),
        link(ROUTES.cart, "Ver carrito"),
    ].join("\n");
};

const authResponse = (role, message) => {
    const m = normalize(message);
    const adminAuth =
        m.includes("admin") || m.includes("empleado") || m.includes("panel");

    if (adminAuth || role === ROLES.ADMIN) {
        return [
            "Acceso administrador:",
            "• Usa /admin-login (no es el mismo login de clientes)",
            "• Endpoint: POST /api/auth/admin-login",
            "• Roles ADMIN o EMPLEADO acceden al panel",
            "",
            "Si la sesión expira, vuelve a iniciar sesión.",
            link(ROUTES.adminLogin, "Login admin"),
        ].join("\n");
    }

    if (m.includes("registr")) {
        return [
            "Registro de cliente:",
            "1) Ve a Registrarse",
            "2) Usuario, email y contraseña",
            "3) POST /api/auth/register",
            "4) Luego inicia sesión en Login",
            link(ROUTES.register, "Registro"),
        ].join("\n");
    }

    if (
        m.includes("olvide") ||
        m.includes("olvid") ||
        m.includes("recuper") ||
        m.includes("contrase")
    ) {
        return [
            "Recuperar contraseña:",
            "1) Olvidé mi contraseña → ingresa tu email",
            "2) Recibes un código por correo",
            "3) Verifica el código y define nueva contraseña",
            "",
            "Rutas: /forgot-password y /reset-password/manual",
            link(ROUTES.forgotPassword, "Recuperar contraseña"),
        ].join("\n");
    }

    return [
        "Cuenta de cliente:",
        "• Login: email y contraseña → JWT guardado en el navegador",
        "• Registro: solo usuarios tipo CLIENTE",
        "• Carrito y favoritos requieren estar logueado",
        "",
        link(ROUTES.login, "Login"),
        link(ROUTES.register, "Registro"),
    ].join("\n");
};

const orderResponse = (role) => {
    if (role === ROLES.CLIENT || role === ROLES.GUEST) {
        return [
            "Pedidos y seguimiento:",
            "• Al confirmar compra recibes número de venta y PDF; en FAST_LANE también código de recojo",
            "• Hoy no hay pantalla de historial de pedidos para clientes en la web",
            "• Para consultar estado, contacta al comercio o al administrador",
            "",
            "Estados internos del pedido:",
            ENUMS.estadoPedido.join(" → "),
            "",
            "Estados de pago: " + ENUMS.estadoPago.join(", "),
        ].join("\n");
    }
    return [
        "Gestión de pedidos (admin):",
        "• Ventas lista todos los pedidos",
        "• Cambia estado con el selector en cada fila",
        "• Crédito pendiente/rechazado: botón para registrar pago",
        "",
        "Estados pedido: " + ENUMS.estadoPedido.join(", "),
        "Estados pago: " + ENUMS.estadoPago.join(", "),
        "",
        link(ROUTES.adminSales, "Ir a ventas"),
    ].join("\n");
};

const adminResponse = (message) => {
    const m = normalize(message);

    if (m.includes("product")) {
        return [
            "Productos (admin):",
            "• Listar, buscar y filtrar por categoría",
            "• Nuevo producto: código, nombre, precios, stock, categoría",
            "• Editar / eliminar desde la tabla",
            "• Imagen: subir y asignar al producto",
            "• Excel: exportar con filtros opcionales",
            link(ROUTES.adminProducts, "Abrir productos"),
        ].join("\n");
    }

    if (m.includes("categor")) {
        return [
            "Categorías:",
            "• Crear: nombre y descripción",
            "• Editar: POST /admin/categorias/{id}/update",
            "• Eliminar: confirmación antes de borrar",
            "• Exportar Excel desde el botón del módulo",
            link(ROUTES.adminCategories, "Abrir categorías"),
        ].join("\n");
    }

    if (m.includes("proveedor")) {
        return [
            "Proveedores:",
            "• CRUD completo (RUC, razón social, teléfono, email)",
            "• Al editar, guarda con el ID correcto para no duplicar RUC",
            "• Exportar Excel disponible",
            link(ROUTES.adminSuppliers, "Abrir proveedores"),
        ].join("\n");
    }

    if (m.includes("venta") || m.includes("pedido")) {
        return [
            "Ventas:",
            "• Ver listado con filtros (entrega, cliente, fechas)",
            "• Nueva venta manual desde el modal",
            "• Actualizar estado del pedido",
            "• Registrar crédito pagado si aplica",
            "• Exportar Excel con filtros de fechas y más",
            link(ROUTES.adminSales, "Abrir ventas"),
        ].join("\n");
    }

    if (m.includes("cliente") && !m.includes("empleado")) {
        return [
            "Clientes (usuarios):",
            "• Listar y buscar usuarios registrados",
            "• Editar datos desde el modal",
            "• No creas clientes aquí: se registran en la web",
            link(ROUTES.adminClients, "Abrir clientes"),
        ].join("\n");
    }

    if (
        m.includes("empleado") ||
        m.includes("personal") ||
        m.includes("trabajador")
    ) {
        return [
            "Empleados / admins:",
            "• Registrar trabajador con rol EMPLEADO o ADMIN",
            "• Editar o eliminar desde la tabla",
            link(ROUTES.adminEmployees, "Abrir empleados"),
        ].join("\n");
    }

    if (m.includes("export") || m.includes("excel")) {
        return [
            "Exportar reportes:",
            "• Productos, categorías, proveedores y ventas tienen botón Excel",
            "• Ventas: elige rango de fechas y filtros en el modal",
            "• Productos: categoría, stock bajo, rango de precios",
        ].join("\n");
    }

    if (
        m.includes("crear") ||
        m.includes("editar") ||
        m.includes("eliminar") ||
        m.includes("crud")
    ) {
        return [
            "CRUD en el panel:",
            "• Crear: botón Nuevo / + en cada módulo",
            "• Editar: icono lápiz en la fila",
            "• Eliminar: icono papelera + confirmación",
            "• Los cambios llaman a la API /api/admin/...",
        ].join("\n");
    }

    return [
        "Panel administrador:",
        "• Dashboard: métricas y gráficos",
        "• Módulos: categorías, productos, proveedores, ventas, usuarios",
        "• Tema claro/oscuro en la barra superior",
        "",
        link(ROUTES.adminDashboard, "Dashboard"),
        "Escribe: productos, ventas, categorías o proveedores para más detalle.",
    ].join("\n");
};

const errorResponse = (role) => {
    const common = [
        "Problemas frecuentes:",
        "• 401 / sesión expirada → vuelve a iniciar sesión",
        "• No puedo pagar → debes estar logueado y tener stock",
        "• Carrito vacío → agrega productos desde /shop",
        "• Admin sin acceso → usa /admin-login con rol ADMIN",
    ];
    if (role === ROLES.ADMIN) {
        return common
            .concat([
                "• Error al guardar proveedor duplicado → revisa RUC único",
                "• Excel no descarga → verifica rango de fechas en ventas",
            ])
            .join("\n");
    }
    return common
        .concat([
            "• Checkout falló → revisa stock y datos del formulario",
            "• Delivery → debes indicar dirección de entrega",
        ])
        .join("\n");
};

const favoritesResponse = (role) => {
    if (role === ROLES.GUEST) {
        return [
            "Favoritos requieren iniciar sesión.",
            "Marca productos con el corazón en la tienda y revísalos en Favoritos.",
            link(ROUTES.login, "Iniciar sesión"),
        ].join("\n");
    }
    return [
        "Favoritos:",
        "• Guarda productos desde la tienda (icono corazón)",
        "• Requiere sesión activa",
        link(ROUTES.favorites, "Ver favoritos"),
    ].join("\n");
};

const systemResponse = (message) => {
    const m = normalize(message);
    if (m.includes("limit")) {
        return [
            "Limitaciones actuales:",
            ...LIMITATIONS.map((l) => `• ${l}`),
        ].join("\n");
    }
    return [
        "Nubix Market: tienda web (React) + API Spring Boot (JWT).",
        "• Clientes: catálogo, carrito local, checkout autenticado",
        "• Admin: inventario, ventas, proveedores y usuarios",
        "• API base: http://localhost:8080/api",
        "",
        "Escribe «limitaciones» para ver qué aún no está implementado.",
    ].join("\n");
};

const unknownResponse = (role) => {
    if (role === ROLES.ADMIN) {
        return [
            "No tengo una respuesta exacta para eso.",
            "Prueba: productos, ventas, categorías, exportar, error o ayuda.",
            "También revisa el módulo correspondiente en el menú lateral.",
        ].join("\n");
    }
    return [
        "No estoy seguro de entender tu consulta.",
        "Prueba: comprar, carrito, login, contraseña, entrega o error.",
        "Si es sobre un pedido ya realizado, contacta al administrador de la tienda.",
    ].join("\n");
};

/**
 * @param {string} message - Mensaje del usuario
 * @param {{ token?: string, user?: object, pathname?: string }} context
 * @returns {{ text: string, intent: string, suggestions: string[] }}
 */
export const getChatResponse = (message, context = {}) => {
    const role = resolveUserRole(context);
    const intent = detectIntent(message);
    const m = normalize(message);

    if (!message?.trim()) {
        return {
            text: "Escribe tu pregunta y te respondo enseguida.",
            intent: INTENTS.HELP,
            suggestions: QUICK_REPLIES[role],
        };
    }

    const isGreeting = /^(hola|hey|hi|buenas|buenos)\b/.test(m);

    let text;
    switch (intent) {
        case INTENTS.PURCHASE:
            text = purchaseResponse(role);
            break;
        case INTENTS.AUTH:
            text = authResponse(role, message);
            break;
        case INTENTS.ORDER:
            text = orderResponse(role);
            break;
        case INTENTS.ADMIN:
            text =
                role === ROLES.ADMIN
                    ? adminResponse(message)
                    : [
                          "Esa función es del panel administrador.",
                          "Accede con cuenta ADMIN en /admin-login.",
                          link(ROUTES.adminLogin, "Login admin"),
                      ].join("\n");
            break;
        case INTENTS.ERROR:
            text = errorResponse(role);
            break;
        case INTENTS.FAVORITES:
            text = favoritesResponse(role);
            break;
        case INTENTS.SYSTEM:
            text = systemResponse(message);
            break;
        case INTENTS.HELP:
            text = isGreeting ? welcomeByRole(role) : helpResponse(role);
            break;
        default:
            if (
                role === ROLES.ADMIN &&
                scoreIntent(message, INTENT_KEYWORDS.admin) > 0
            ) {
                text = adminResponse(message);
            } else {
                text = unknownResponse(role);
            }
    }

    return {
        text,
        intent,
        suggestions: QUICK_REPLIES[role],
    };
};

export const getWelcomeMessage = (context = {}) => {
    const role = resolveUserRole(context);
    return {
        text: welcomeByRole(role),
        intent: INTENTS.HELP,
        suggestions: QUICK_REPLIES[role],
    };
};

export { welcomeByRole, QUICK_REPLIES };
