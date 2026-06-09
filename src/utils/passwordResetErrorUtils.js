export const PASSWORD_RESET_ERROR_CODES = {
    CODE_EXPIRED: "CODE_EXPIRED",
    INVALID_CODE: "INVALID_CODE",
};

export function parsePasswordResetError(err, fallbackMessage) {
    const data = err?.response?.data;
    const code = data?.code;
    const message = data?.message || fallbackMessage;

    return {
        code,
        message,
        isExpired: code === PASSWORD_RESET_ERROR_CODES.CODE_EXPIRED,
        isInvalid: code === PASSWORD_RESET_ERROR_CODES.INVALID_CODE,
    };
}
