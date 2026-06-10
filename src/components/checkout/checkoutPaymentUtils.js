export function sanitizeCardNumber(value) {
    return value.replace(/\D/g, "").slice(0, 19);
}

export function formatCardNumberDisplay(value) {
    const digits = sanitizeCardNumber(value);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function sanitizeExpiry(value) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function sanitizeCvv(value) {
    return value.replace(/\D/g, "").slice(0, 4);
}

export function validateCardForm({ cardNumber, cardHolder, expiry, cvv }) {
    const number = sanitizeCardNumber(cardNumber);
    const holder = cardHolder.trim();
    const exp = expiry.trim();
    const code = sanitizeCvv(cvv);

    if (!number || number.length < 13 || number.length > 19) {
        return "Ingresa un número de tarjeta válido (13 a 19 dígitos).";
    }
    if (!holder || holder.length < 3) {
        return "Ingresa el nombre del titular.";
    }
    if (!/^\d{2}\/\d{2}$/.test(exp)) {
        return "La fecha de expiración debe tener formato MM/AA.";
    }
    const [mm] = exp.split("/").map(Number);
    if (mm < 1 || mm > 12) {
        return "El mes de expiración no es válido.";
    }
    if (!code || code.length < 3) {
        return "Ingresa un CVV válido (3 o 4 dígitos).";
    }
    return null;
}

export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
