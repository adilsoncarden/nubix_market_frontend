export const sanitizeDocumento = (value, maxLength = 11) =>
    String(value ?? "")
        .replace(/\D/g, "")
        .slice(0, maxLength);

export const isValidDocumentoLength = (value) => {
    const len = sanitizeDocumento(value).length;
    return len === 8 || len === 11;
};

export const getDocumentoTipo = (value) => {
    const len = sanitizeDocumento(value).length;
    if (len === 8) return "DNI";
    if (len === 11) return "RUC";
    return null;
};

export const getDocumentoError = (value) => {
    const digits = sanitizeDocumento(value);
    if (!digits) return null;
    if (digits.length !== 8 && digits.length !== 11) {
        return "Ingresa 8 dígitos (DNI) u 11 dígitos (RUC).";
    }
    return null;
};
