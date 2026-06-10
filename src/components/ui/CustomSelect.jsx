import {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
    Children,
    isValidElement,
} from "react";
import { createPortal } from "react-dom";
import "../../styles/custom-select.css";
import "./CustomSelect.css";

function normalizeOptions(optionsProp, children) {
    if (optionsProp?.length) {
        return optionsProp.map((opt) => ({
            value: String(opt.value ?? ""),
            label:
                opt.label != null
                    ? String(opt.label)
                    : String(opt.value ?? ""),
            disabled: Boolean(opt.disabled),
        }));
    }

    const parsed = [];
    Children.forEach(children, (child) => {
        if (isValidElement(child) && child.type === "option") {
            const label = child.props.children;
            parsed.push({
                value: String(child.props.value ?? ""),
                label:
                    typeof label === "string" || typeof label === "number"
                        ? String(label)
                        : String(child.props.value ?? ""),
                disabled: Boolean(child.props.disabled),
            });
        }
    });
    return parsed;
}

export default function CustomSelect({
    id,
    name,
    value,
    onChange,
    options: optionsProp,
    children,
    disabled = false,
    required = false,
    className = "",
    size = "default",
    placeholder = "Seleccionar...",
    "aria-label": ariaLabel,
    style,
}) {
    const [open, setOpen] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [menuStyle, setMenuStyle] = useState({});
    const [flipUp, setFlipUp] = useState(false);
    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const menuRef = useRef(null);
    const listId = useRef(
        `nubix-select-list-${Math.random().toString(36).slice(2, 9)}`,
    ).current;

    const options = useMemo(
        () => normalizeOptions(optionsProp, children),
        [optionsProp, children],
    );

    const stringValue = value == null ? "" : String(value);
    const selectedOption = options.find((opt) => opt.value === stringValue);
    const displayLabel = selectedOption?.label ?? placeholder;
    const isPlaceholder = !selectedOption && stringValue === "";

    const updateMenuPosition = useCallback(() => {
        const trigger = triggerRef.current;
        if (!trigger) return;

        const rect = trigger.getBoundingClientRect();
        const menuHeight = Math.min(280, window.innerHeight * 0.5);
        const spaceBelow = window.innerHeight - rect.bottom;
        const shouldFlip = spaceBelow < menuHeight + 12 && rect.top > menuHeight;
        setFlipUp(shouldFlip);

        setMenuStyle({
            top: shouldFlip ? rect.top - 6 : rect.bottom + 4,
            left: rect.left,
            width: rect.width,
            transform: shouldFlip ? "translateY(-100%)" : undefined,
        });
    }, []);

    const closeMenu = useCallback(() => {
        setOpen(false);
        setHighlightIndex(-1);
    }, []);

    const emitChange = useCallback(
        (nextValue) => {
            onChange?.({
                target: {
                    name: name ?? "",
                    value: nextValue,
                    id: id ?? "",
                },
            });
        },
        [onChange, name, id],
    );

    const selectOption = useCallback(
        (opt) => {
            if (!opt || opt.disabled) return;
            emitChange(opt.value);
            closeMenu();
            triggerRef.current?.focus();
        },
        [emitChange, closeMenu],
    );

    const toggleOpen = useCallback(() => {
        if (disabled) return;
        setOpen((prev) => !prev);
    }, [disabled]);

    useEffect(() => {
        if (!open) return undefined;

        updateMenuPosition();

        const handleResize = () => updateMenuPosition();
        const handleScroll = () => updateMenuPosition();

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll, true);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [open, updateMenuPosition]);

    useEffect(() => {
        if (!open) return undefined;

        const handlePointerDown = (event) => {
            const target = event.target;
            if (
                rootRef.current?.contains(target) ||
                menuRef.current?.contains(target)
            ) {
                return;
            }
            closeMenu();
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeMenu();
                triggerRef.current?.focus();
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, closeMenu]);

    useEffect(() => {
        if (!open) return;
        const selectedIndex = options.findIndex(
            (opt) => opt.value === stringValue && !opt.disabled,
        );
        setHighlightIndex(
            selectedIndex >= 0
                ? selectedIndex
                : options.findIndex((opt) => !opt.disabled),
        );
    }, [open, options, stringValue]);

    const handleTriggerKeyDown = (event) => {
        if (disabled) return;

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleOpen();
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!open) {
                setOpen(true);
                return;
            }
            setHighlightIndex((prev) => {
                let next = prev;
                do {
                    next = next < options.length - 1 ? next + 1 : 0;
                } while (options[next]?.disabled && next !== prev);
                return next;
            });
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) {
                setOpen(true);
                return;
            }
            setHighlightIndex((prev) => {
                let next = prev;
                do {
                    next = next > 0 ? next - 1 : options.length - 1;
                } while (options[next]?.disabled && next !== prev);
                return next;
            });
        }
    };

    useEffect(() => {
        if (!open || highlightIndex < 0) return;
        const optionEl = menuRef.current?.querySelector(
            `[data-index="${highlightIndex}"]`,
        );
        optionEl?.scrollIntoView({ block: "nearest" });
    }, [open, highlightIndex]);

    const handleMenuKeyDown = (event) => {
        if (event.key === "Enter" && highlightIndex >= 0) {
            event.preventDefault();
            selectOption(options[highlightIndex]);
        }
    };

    const rootClassName = [
        "nubix-custom-select",
        "custom-select-nubix",
        size === "sm" ? "nubix-custom-select--sm" : "",
        open ? "is-open" : "",
        disabled ? "is-disabled" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={rootClassName} ref={rootRef} style={style}>
            <button
                ref={triggerRef}
                type="button"
                id={id}
                className="nubix-custom-select-trigger"
                onClick={toggleOpen}
                onKeyDown={handleTriggerKeyDown}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                aria-label={ariaLabel}
                aria-required={required || undefined}
            >
                <span
                    className={`nubix-custom-select-label${isPlaceholder ? " is-placeholder" : ""}`}
                >
                    {displayLabel}
                </span>
                <span className="nubix-custom-select-chevron" aria-hidden="true" />
            </button>

            {name ? (
                <input
                    type="text"
                    className="nubix-custom-select-sr"
                    name={name}
                    value={stringValue}
                    readOnly
                    required={required}
                    tabIndex={-1}
                    aria-hidden="true"
                    onChange={() => {}}
                />
            ) : null}

            {open &&
                createPortal(
                    <div
                        ref={menuRef}
                        id={listId}
                        role="listbox"
                        className={`nubix-custom-select-menu${flipUp ? " is-flipped" : ""}`}
                        style={menuStyle}
                        onKeyDown={handleMenuKeyDown}
                    >
                        {options.map((opt, index) => (
                            <button
                                key={`${opt.value}-${index}`}
                                type="button"
                                role="option"
                                data-index={index}
                                className={`nubix-custom-select-option${opt.value === stringValue ? " is-selected" : ""}${highlightIndex === index ? " is-highlighted" : ""}`}
                                aria-selected={opt.value === stringValue}
                                disabled={opt.disabled}
                                onMouseEnter={() => setHighlightIndex(index)}
                                onClick={() => selectOption(opt)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>,
                    document.body,
                )}
        </div>
    );
}
