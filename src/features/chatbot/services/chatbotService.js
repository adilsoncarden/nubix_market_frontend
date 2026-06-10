import {
    ROLES,
    ROUTES,
    WEB_PAYMENT_METHODS,
    WEB_DELIVERY_TYPES,
    PURCHASE_STEPS,
    INTENT_KEYWORDS,
    WEB_WELCOME_MESSAGE,
    WHATSAPP_URL,
    WEB_CHIPS,
    getDefaultWebChips,
    getPageContextChips,
    getFallbackChips,
} from "../knowledge/chatbotKnowledge";

export const INTENTS = {
    HELP: "help",
    SEARCH: "search",
    PURCHASE: "purchase",
    CART: "cart",
    AUTH: "auth",
    ORDER: "order",
    PAYMENT: "payment",
    DELIVERY: "delivery",
    ERROR: "error",
    FAVORITES: "favorites",
    WHATSAPP: "whatsapp",
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

    const map = {
        help: INTENTS.HELP,
        search: INTENTS.SEARCH,
        purchase: INTENTS.PURCHASE,
        cart: INTENTS.CART,
        auth: INTENTS.AUTH,
        order: INTENTS.ORDER,
        payment: INTENTS.PAYMENT,
        delivery: INTENTS.DELIVERY,
        error: INTENTS.ERROR,
        favorites: INTENTS.FAVORITES,
        whatsapp: INTENTS.WHATSAPP,
    };
    return map[scores[0].intent] || INTENTS.UNKNOWN;
};

const SEARCH_PREFIXES =
    /^(?:buscar|busco|quiero|necesito|dame|ver|mostrar|encontrar|producto[s]?\s+(?:de\s+)?)(.+)$/;

export const extractSearchQuery = (message) => {
    const raw = (message || "").trim();
    if (!raw) return null;

    const m = normalize(raw);
    const prefixMatch = m.match(SEARCH_PREFIXES);
    if (prefixMatch?.[1]?.trim().length >= 2) {
        return raw
            .slice(raw.toLowerCase().indexOf(prefixMatch[1]))
            .trim();
    }

    if (
        m === "buscar producto" ||
        m === "buscar productos" ||
        m === "quiero buscar"
    ) {
        return null;
    }

    const intent = detectIntent(message);
    if (intent === INTENTS.SEARCH && m.length >= 3) {
        return raw;
    }

    return null;
};

export const resolveUserRole = ({ webToken, webUser }) => {
    if (webToken && webUser) return ROLES.CLIENT;
    return ROLES.GUEST;
};

const formatSoles = (amount) =>
    `S/ ${Number(amount || 0).toFixed(2)}`;

const suggestionsFor = (context, intent) => {
    const role = resolveUserRole(context);
    if (intent === INTENTS.UNKNOWN) {
        return getFallbackChips(role);
    }
    return getPageContextChips(context.pathname || "/", role);
};

const searchPromptResponse = () => ({
    text:
        "¿Qué producto buscas? 🔍\n\n" +
        "Escríbelo así:\n" +
        '• "quiero arroz"\n' +
        '• "buscar bebidas"\n' +
        '• "lacteos"',
    intent: INTENTS.SEARCH,
    suggestions: [
        { label: "Bebidas", type: "message", message: "buscar bebidas" },
        { label: "Abarrotes", type: "message", message: "buscar abarrotes" },
        WEB_CHIPS.shop,
    ],
});

const searchResponse = (message) => {
    const query = extractSearchQuery(message);
    if (!query) return searchPromptResponse();

    return {
        text: `Perfecto, busco "${query}" en la tienda. Te redirijo ahora 🛒`,
        intent: INTENTS.SEARCH,
        navigate: `${ROUTES.shop}?search=${encodeURIComponent(query)}`,
        suggestions: [WEB_CHIPS.cart, WEB_CHIPS.howToBuy, WEB_CHIPS.payment],
    };
};

const cartResponse = (context) => {
    const role = resolveUserRole(context);
    const { cartItems = [], totalUnits = 0, totalPrice = 0 } = context;

    if (role === ROLES.GUEST) {
        return {
            text:
                "Para ver tu carrito necesitas iniciar sesión. 🔐\n\n" +
                "Mientras tanto puedes explorar la tienda y agregar productos; " +
                "al iniciar sesión se sincronizará tu carrito.",
            intent: INTENTS.CART,
            navigate: ROUTES.login,
            suggestions: [WEB_CHIPS.login, WEB_CHIPS.shop, WEB_CHIPS.howToBuy],
        };
    }

    if (!cartItems.length) {
        return {
            text:
                "Tu carrito está vacío por ahora. 🛒\n\n" +
                "Explora la tienda, agrega productos y vuelve cuando quieras pagar.",
            intent: INTENTS.CART,
            navigate: ROUTES.shop,
            suggestions: [WEB_CHIPS.search, WEB_CHIPS.howToBuy],
        };
    }

    const lines = cartItems.slice(0, 4).map(
        (item) => `• ${item.name} × ${item.qty}`,
    );
    if (cartItems.length > 4) {
        lines.push(`• … y ${cartItems.length - 4} producto(s) más`);
    }

    return {
        text: [
            `Tienes ${totalUnits} unidad${totalUnits === 1 ? "" : "es"} en tu carrito:`,
            ...lines,
            "",
            `Total estimado: ${formatSoles(totalPrice)}`,
            "",
            "¿Quieres finalizar tu compra?",
        ].join("\n"),
        intent: INTENTS.CART,
        suggestions: [WEB_CHIPS.cart, WEB_CHIPS.payment, WEB_CHIPS.delivery],
    };
};

const paymentResponse = () => ({
    text: [
        "Estos son los métodos de pago disponibles: 💳",
        "",
        ...WEB_PAYMENT_METHODS.map(
            (p) => `• ${p.name}: ${p.summary}`,
        ),
        "",
        "Los eliges al finalizar compra en tu carrito.",
    ].join("\n"),
    intent: INTENTS.PAYMENT,
    suggestions: [WEB_CHIPS.cart, WEB_CHIPS.howToBuy, WEB_CHIPS.delivery],
});

const deliveryResponse = () => ({
    text: [
        "Tipos de entrega en Nubix Market: 🚚",
        "",
        ...WEB_DELIVERY_TYPES.map(
            (d) => `• ${d.name}: ${d.summary}`,
        ),
        "",
        "En el checkout eliges Fast Lane o Delivery según prefieras.",
    ].join("\n"),
    intent: INTENTS.DELIVERY,
    suggestions: [WEB_CHIPS.cart, WEB_CHIPS.payment, WEB_CHIPS.howToBuy],
});

const purchaseResponse = (role) => {
    const steps = PURCHASE_STEPS.map((s, i) => `${i + 1}) ${s}`).join("\n");
    const text = [
        "Comprar en Nubix Market es muy fácil: 🛍️",
        "",
        steps,
        "",
        role === ROLES.GUEST
            ? "Recuerda: necesitas una cuenta para pagar."
            : "Ya tienes sesión activa, puedes ir directo al carrito.",
    ].join("\n");

    return {
        text,
        intent: INTENTS.PURCHASE,
        suggestions:
            role === ROLES.GUEST
                ? [WEB_CHIPS.login, WEB_CHIPS.shop, WEB_CHIPS.payment]
                : [WEB_CHIPS.cart, WEB_CHIPS.shop, WEB_CHIPS.payment],
    };
};

const orderResponse = (role) => {
    if (role === ROLES.GUEST) {
        return {
            text:
                "Para ver el estado de tus pedidos inicia sesión. 📦\n\n" +
                "En Mis pedidos verás pedidos activos e historial con su estado actual.",
            intent: INTENTS.ORDER,
            navigate: ROUTES.login,
            suggestions: [WEB_CHIPS.login, WEB_CHIPS.whatsapp, WEB_CHIPS.howToBuy],
        };
    }

    return {
        text:
            "Puedes revisar tus pedidos en Mis pedidos. 📦\n\n" +
            "Ahí verás:\n" +
            "• Pedidos activos (en proceso, listos, en camino)\n" +
            "• Historial de pedidos entregados\n\n" +
            "Si necesitas ayuda extra, escríbenos por WhatsApp.",
        intent: INTENTS.ORDER,
        navigate: ROUTES.misPedidos,
        suggestions: [WEB_CHIPS.whatsapp, WEB_CHIPS.shop, WEB_CHIPS.payment],
    };
};

const authResponse = (message) => {
    const m = normalize(message);

    if (m.includes("registr")) {
        return {
            text:
                "Crear cuenta es rápido: 📝\n\n" +
                "1) Ve a Registrarse\n" +
                "2) Completa tus datos\n" +
                "3) Inicia sesión y ya puedes comprar",
            intent: INTENTS.AUTH,
            navigate: ROUTES.register,
            suggestions: [WEB_CHIPS.login, WEB_CHIPS.howToBuy],
        };
    }

    if (
        m.includes("olvide") ||
        m.includes("olvid") ||
        m.includes("recuper") ||
        m.includes("contrase")
    ) {
        return {
            text:
                "Recuperar contraseña: 🔑\n\n" +
                "1) Ve a Olvidé mi contraseña\n" +
                "2) Ingresa tu correo\n" +
                "3) Sigue los pasos con el código recibido",
            intent: INTENTS.AUTH,
            navigate: ROUTES.forgotPassword,
            suggestions: [WEB_CHIPS.login],
        };
    }

    return {
        text:
            "Para comprar y ver tu carrito necesitas iniciar sesión. 🔐\n\n" +
            "Si no tienes cuenta, regístrate en un minuto.",
        intent: INTENTS.AUTH,
        navigate: ROUTES.login,
        suggestions: [
            WEB_CHIPS.login,
            { label: "Registrarme", type: "navigate", path: ROUTES.register, confirmText: "Te llevo al registro 📝" },
            WEB_CHIPS.howToBuy,
        ],
    };
};

const errorResponse = (message) => {
    const m = normalize(message);
    const lines = ["Te ayudo con eso. Prueba estas soluciones: 🛠️", ""];

    if (
        m.includes("pagar") ||
        m.includes("pago") ||
        m.includes("checkout")
    ) {
        lines.push(
            "No puedo pagar:",
            "• Verifica que iniciaste sesión",
            "• Revisa que tu carrito tenga productos",
            "• Confirma stock disponible",
            "• Completa todos los datos del checkout",
        );
    } else if (m.includes("stock") || m.includes("agotado")) {
        lines.push(
            "Sin stock:",
            "• El producto puede haberse agotado",
            "• Reduce la cantidad en tu carrito",
            "• Busca un producto similar en la tienda",
        );
    } else {
        lines.push(
            "Problemas comunes:",
            "• No puedo pagar → inicia sesión y revisa stock",
            "• Carrito vacío → agrega productos desde la tienda",
            "• Sin stock → elige otra cantidad o producto",
            "• Error al confirmar → revisa datos de entrega y pago",
        );
    }

    lines.push("", "Si sigue el problema, contáctanos por WhatsApp.");

    return {
        text: lines.join("\n"),
        intent: INTENTS.ERROR,
        suggestions: [WEB_CHIPS.whatsapp, WEB_CHIPS.cart, WEB_CHIPS.payment],
    };
};

const favoritesResponse = (role) => {
    if (role === ROLES.GUEST) {
        return {
            text:
                "Los favoritos requieren iniciar sesión. ❤️\n\n" +
                "Marca productos con el corazón en la tienda y revísalos después.",
            intent: INTENTS.FAVORITES,
            navigate: ROUTES.login,
            suggestions: [WEB_CHIPS.login, WEB_CHIPS.shop],
        };
    }

    return {
        text:
            "Guarda tus productos favoritos con el corazón en la tienda. ❤️\n\n" +
            "Luego los encuentras todos en Favoritos.",
        intent: INTENTS.FAVORITES,
        navigate: ROUTES.favorites,
        suggestions: [WEB_CHIPS.shop, WEB_CHIPS.cart],
    };
};

const whatsappResponse = () => ({
    text: "Te conecto con nuestro equipo por WhatsApp. 💬\n\nEstamos para ayudarte con tu compra.",
    intent: INTENTS.WHATSAPP,
    externalUrl: WHATSAPP_URL,
    suggestions: [WEB_CHIPS.howToBuy, WEB_CHIPS.payment, WEB_CHIPS.orders],
});

const helpResponse = (role) => ({
    text:
        "Puedo ayudarte con: 🙌\n\n" +
        "🛒 Buscar y comprar productos\n" +
        "📦 Ver tu carrito y pedidos\n" +
        "💳 Métodos de pago\n" +
        "🚚 Tipos de entrega\n" +
        "🛠️ Problemas al comprar\n\n" +
        "Elige una opción o escríbeme lo que necesitas.",
    intent: INTENTS.HELP,
    suggestions: getDefaultWebChips(role),
});

const unknownResponse = (role) => ({
    text:
        "No entendí tu consulta, pero puedo ayudarte con estas opciones: 🤔\n\n" +
        "Prueba los botones de abajo o escribe algo como:\n" +
        '• "quiero arroz"\n' +
        '• "métodos de pago"\n' +
        '• "ver mi carrito"',
    intent: INTENTS.UNKNOWN,
    suggestions: getFallbackChips(role),
});

/**
 * @param {string} message
 * @param {object} context
 * @returns {{ text: string, intent: string, suggestions: object[], navigate?: string, externalUrl?: string }}
 */
export const getChatResponse = (message, context = {}) => {
    const role = resolveUserRole(context);
    const m = normalize(message);

    if (!message?.trim()) {
        return {
            text: "Escribe tu consulta y te ayudo enseguida 😊",
            intent: INTENTS.HELP,
            suggestions: getPageContextChips(context.pathname || "/", role),
        };
    }

    const isGreeting = /^(hola|hey|hi|buenas|buenos)\b/.test(m);
    const intent = detectIntent(message);

    if (m === "buscar producto" || m === "buscar productos") {
        return searchPromptResponse();
    }

    const searchQuery = extractSearchQuery(message);
    if (searchQuery && (intent === INTENTS.SEARCH || intent === INTENTS.UNKNOWN)) {
        return searchResponse(message);
    }

    let result;

    switch (intent) {
        case INTENTS.SEARCH:
            result = searchResponse(message);
            break;
        case INTENTS.CART:
            result = cartResponse(context);
            break;
        case INTENTS.PAYMENT:
            result = paymentResponse();
            break;
        case INTENTS.DELIVERY:
            result = deliveryResponse();
            break;
        case INTENTS.PURCHASE:
            result = purchaseResponse(role);
            break;
        case INTENTS.ORDER:
            result = orderResponse(role);
            break;
        case INTENTS.AUTH:
            result = authResponse(message);
            break;
        case INTENTS.ERROR:
            result = errorResponse(message);
            break;
        case INTENTS.FAVORITES:
            result = favoritesResponse(role);
            break;
        case INTENTS.WHATSAPP:
            result = whatsappResponse();
            break;
        case INTENTS.HELP:
            result = isGreeting
                ? {
                      text: WEB_WELCOME_MESSAGE,
                      intent: INTENTS.HELP,
                      suggestions: getDefaultWebChips(role),
                  }
                : helpResponse(role);
            break;
        default:
            result = unknownResponse(role);
    }

    if (!result.suggestions?.length) {
        result.suggestions = suggestionsFor(context, result.intent);
    }

    return result;
};

export const getWelcomeMessage = (context = {}) => {
    const role = resolveUserRole(context);
    return {
        text: WEB_WELCOME_MESSAGE,
        intent: INTENTS.HELP,
        suggestions: getPageContextChips(context.pathname || "/", role),
    };
};

export { WEB_WELCOME_MESSAGE, getDefaultWebChips, getPageContextChips };
