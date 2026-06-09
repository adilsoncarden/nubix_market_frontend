import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/datepicker.css";
import {
    DATE_DISPLAY_PLACEHOLDER,
    dateToIso,
    displayToIso,
    formatDateInputMask,
    isoToDate,
    isoToDisplay,
    looksLikeUsDateFormat,
} from "../../utils/dateInputUtils";

registerLocale("es", es);

export default function DateInput({
    value = "",
    onChange,
    className = "form-control form-control-sm",
    id,
    name,
    disabled = false,
    required = false,
    minDate,
    maxDate,
    "aria-label": ariaLabel,
}) {
    const [invalid, setInvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [pendingDisplay, setPendingDisplay] = useState(null);

    useEffect(() => {
        setInvalid(false);
        setErrorMessage("");
        setPendingDisplay(null);
    }, [value]);

    const selectedDate = pendingDisplay ? null : isoToDate(value);

    const validateDisplay = (display) => {
        if (!display) {
            setInvalid(false);
            setErrorMessage("");
            setPendingDisplay(null);
            onChange?.("");
            return true;
        }

        if (looksLikeUsDateFormat(display)) {
            setInvalid(true);
            setErrorMessage("Use día/mes/año (dd/mm/aaaa), no mm/dd/aaaa");
            return false;
        }

        const iso = displayToIso(display);
        if (iso === null) {
            setInvalid(true);
            setErrorMessage("Fecha inválida. Formato: dd/mm/aaaa");
            return false;
        }

        setInvalid(false);
        setErrorMessage("");
        setPendingDisplay(null);
        onChange?.(iso);
        return true;
    };

    const handleCalendarChange = (date) => {
        if (!date) {
            setInvalid(false);
            setErrorMessage("");
            setPendingDisplay(null);
            onChange?.("");
            return;
        }

        setInvalid(false);
        setErrorMessage("");
        setPendingDisplay(null);
        onChange?.(dateToIso(date));
    };

    const flushPending = () => {
        if (pendingDisplay !== null) {
            validateDisplay(pendingDisplay);
        }
    };

    const inputClassName = `${className}${invalid ? " is-invalid" : ""}`;

    return (
        <div className="nubix-date-input">
            <DatePicker
                id={id}
                name={name}
                selected={selectedDate}
                value={
                    pendingDisplay ??
                    (value ? isoToDisplay(value) : "")
                }
                onChange={handleCalendarChange}
                onChangeRaw={(e) => {
                    const masked = formatDateInputMask(e.target.value);
                    e.target.value = masked;
                    setPendingDisplay(masked);
                    if (!masked) {
                        setInvalid(false);
                        setErrorMessage("");
                        onChange?.("");
                    }
                }}
                onCalendarClose={flushPending}
                onBlur={flushPending}
                disabled={disabled}
                required={required}
                locale="es"
                dateFormat="dd/MM/yyyy"
                placeholderText={DATE_DISPLAY_PLACEHOLDER}
                calendarStartDay={1}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                isClearable={!required}
                minDate={minDate ? isoToDate(minDate) : undefined}
                maxDate={maxDate ? isoToDate(maxDate) : undefined}
                popperClassName="nubix-datepicker-popper"
                calendarClassName="nubix-datepicker-calendar"
                popperPlacement="bottom-start"
                ariaLabel={ariaLabel}
                className={inputClassName}
                autoComplete="off"
            />
            {invalid && errorMessage && (
                <div className="invalid-feedback d-block">{errorMessage}</div>
            )}
        </div>
    );
}
