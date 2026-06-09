import { useEffect, useState } from "react";
import {
    DATE_DISPLAY_PLACEHOLDER,
    displayToIso,
    formatDateInputMask,
    isoToDisplay,
    looksLikeUsDateFormat,
} from "../../utils/dateInputUtils";

export default function DateInput({
    value = "",
    onChange,
    className = "",
    id,
    name,
    disabled = false,
    required = false,
    "aria-label": ariaLabel,
}) {
    const [display, setDisplay] = useState(() => isoToDisplay(value));
    const [invalid, setInvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setDisplay(isoToDisplay(value));
        setInvalid(false);
        setErrorMessage("");
    }, [value]);

    const commitValue = (nextDisplay) => {
        if (!nextDisplay) {
            setInvalid(false);
            setErrorMessage("");
            onChange?.("");
            return;
        }

        if (looksLikeUsDateFormat(nextDisplay)) {
            setInvalid(true);
            setErrorMessage("Use día/mes/año (dd/mm/aaaa), no mm/dd/aaaa");
            return;
        }

        const iso = displayToIso(nextDisplay);
        if (iso === null) {
            setInvalid(true);
            setErrorMessage("Fecha inválida. Formato: dd/mm/aaaa");
            return;
        }

        setInvalid(false);
        setErrorMessage("");
        onChange?.(iso);
    };

    return (
        <div>
            <input
                type="text"
                id={id}
                name={name}
                className={`${className}${invalid ? " is-invalid" : ""}`}
                inputMode="numeric"
                autoComplete="off"
                placeholder={DATE_DISPLAY_PLACEHOLDER}
                title="Formato: dd/mm/aaaa (día/mes/año)"
                maxLength={10}
                value={display}
                disabled={disabled}
                required={required}
                aria-label={ariaLabel}
                aria-invalid={invalid}
                onChange={(e) => {
                    const masked = formatDateInputMask(e.target.value);
                    setDisplay(masked);
                    if (!masked) {
                        setInvalid(false);
                        setErrorMessage("");
                        onChange?.("");
                        return;
                    }
                    if (masked.length === 10) {
                        commitValue(masked);
                    } else {
                        setInvalid(false);
                        setErrorMessage("");
                    }
                }}
                onBlur={() => commitValue(display)}
            />
            {invalid && errorMessage && (
                <div className="invalid-feedback d-block">{errorMessage}</div>
            )}
        </div>
    );
}
