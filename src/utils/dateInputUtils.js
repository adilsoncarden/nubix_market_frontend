/**
 * Utilidades de fecha — formato estricto dd/mm/aaaa (Perú).
 * El estado interno de filtros/API sigue en ISO yyyy-mm-dd.
 */

export const DATE_DISPLAY_PLACEHOLDER = "dd/mm/aaaa";
const DISPLAY_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

/** Rechaza cadenas con separador distinto o formato americano explícito. */
const US_DATE_PATTERN = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

export function formatDateInputMask(raw) {
    const digits = String(raw ?? "").replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) {
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function isoToDisplay(iso) {
    if (!iso) return "";
    const [year, month, day] = String(iso).split("T")[0].split("-");
    if (!year || !month || !day) return "";
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}

/** Convierte yyyy-mm-dd → Date (hora local, sin desfase UTC). */
export function isoToDate(iso) {
    if (!iso) return null;
    const [year, month, day] = String(iso).split("T")[0].split("-").map(Number);
    if (!year || !month || !day) return null;
    const date = new Date(year, month - 1, day);
    if (!isValidCalendarDate(day, month, year)) return null;
    return date;
}

/** Convierte Date → yyyy-mm-dd para API/backend. */
export function dateToIso(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isValidCalendarDate(day, month, year) {
    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

/**
 * Detecta entrada con aspecto mm/dd/aaaa (mes > 12 en la primera posición
 * no aplica; si la segunda parte > 12 y la primera <= 12, suele ser US).
 */
export function looksLikeUsDateFormat(value) {
    const match = US_DATE_PATTERN.exec(String(value ?? "").trim());
    if (!match) return false;

    const first = Number(match[1]);
    const second = Number(match[2]);
    return first >= 1 && first <= 12 && second > 12;
}

/**
 * Convierte dd/mm/aaaa → yyyy-mm-dd.
 * Retorna '' si vacío, null si inválido o formato US detectado.
 */
export function displayToIso(display) {
    const value = String(display ?? "").trim();
    if (!value) return "";

    if (looksLikeUsDateFormat(value)) {
        return null;
    }

    const match = DISPLAY_PATTERN.exec(value);
    if (!match) return null;

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    if (month < 1 || month > 12 || day < 1 || day > 31) {
        return null;
    }

    if (!isValidCalendarDate(day, month, year)) {
        return null;
    }

    return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function isValidDisplayDate(display) {
    return displayToIso(display) !== null && String(display ?? "").trim() !== "";
}

export function todayIso() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function addDaysIso(iso, days) {
    const base = iso || todayIso();
    const [y, m, d] = base.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
