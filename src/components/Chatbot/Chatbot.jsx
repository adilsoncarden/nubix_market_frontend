import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import { useCart } from "../../store/CartContext";
import {
    getChatResponse,
    getWelcomeMessage,
    resolveUserRole,
} from "../../features/chatbot/services/chatbotService";
import {
    CHIP_TYPES,
    ROUTES,
    ROLES,
    getPageContextChips,
} from "../../features/chatbot/knowledge/chatbotKnowledge";
import "./Chatbot.css";

const ROLE_LABELS = {
    [ROLES.GUEST]: "Visitante",
    [ROLES.CLIENT]: "Cliente",
};

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const chipKey = (chip) =>
    typeof chip === "string" ? chip : chip.label || chip.message || makeId();

const Chatbot = () => {
    const navigate = useNavigate();
    const { webToken, webUser } = useAuth();
    const { items, totalUnits, totalPrice } = useCart();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const listRef = useRef(null);

    const context = useMemo(
        () => ({
            webToken,
            webUser,
            pathname: location.pathname,
            cartItems: items,
            totalUnits,
            totalPrice,
        }),
        [webToken, webUser, location.pathname, items, totalUnits, totalPrice],
    );

    const role = useMemo(() => resolveUserRole(context), [context]);
    const roleLabel = ROLE_LABELS[role] || "Visitante";

    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            if (listRef.current) {
                listRef.current.scrollTop = listRef.current.scrollHeight;
            }
        });
    }, []);

    const appendBotMessage = useCallback(
        (text) => {
            setMessages((prev) => [
                ...prev,
                { id: makeId(), role: "bot", text },
            ]);
            scrollToBottom();
        },
        [scrollToBottom],
    );

    const applyResponseSideEffects = useCallback(
        (response) => {
            if (response.navigate) {
                navigate(response.navigate);
            }
            if (response.externalUrl) {
                window.open(response.externalUrl, "_blank", "noopener,noreferrer");
            }
        },
        [navigate],
    );

    useEffect(() => {
        if (open && messages.length === 0) {
            const welcome = getWelcomeMessage(context);
            setMessages([
                {
                    id: makeId(),
                    role: "bot",
                    text: welcome.text,
                },
            ]);
            setSuggestions(welcome.suggestions || []);
        }
    }, [open, messages.length, context]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, open, scrollToBottom]);

    useEffect(() => {
        if (open) {
            setSuggestions(getPageContextChips(location.pathname, role));
        }
    }, [location.pathname, open, role]);

    const dispatchBotReply = useCallback(
        (reply) => {
            setTimeout(() => {
                appendBotMessage(reply.text);
                setSuggestions(reply.suggestions || []);
                applyResponseSideEffects(reply);
            }, 280);
        },
        [appendBotMessage, applyResponseSideEffects],
    );

    const sendMessage = useCallback(
        (text) => {
            const trimmed = (text || "").trim();
            if (!trimmed) return;

            setMessages((prev) => [
                ...prev,
                { id: makeId(), role: "user", text: trimmed },
            ]);
            setInput("");

            const reply = getChatResponse(trimmed, context);
            dispatchBotReply(reply);
        },
        [context, dispatchBotReply],
    );

    const handleChipAction = useCallback(
        (chip) => {
            if (typeof chip === "string") {
                sendMessage(chip);
                return;
            }

            const type = chip.type || CHIP_TYPES.MESSAGE;

            if (type === CHIP_TYPES.MESSAGE) {
                sendMessage(chip.message || chip.label);
                return;
            }

            if (type === CHIP_TYPES.NAVIGATE) {
                setMessages((prev) => [
                    ...prev,
                    { id: makeId(), role: "user", text: chip.label },
                ]);

                if (chip.requireAuth && !webToken) {
                    dispatchBotReply({
                        text:
                            "Para eso necesitas iniciar sesión. Te llevo al login 🔐",
                        suggestions: [
                            {
                                label: "Iniciar sesión",
                                type: CHIP_TYPES.NAVIGATE,
                                path: ROUTES.login,
                            },
                        ],
                        navigate: ROUTES.login,
                    });
                    return;
                }

                dispatchBotReply({
                    text: chip.confirmText || `Abriendo ${chip.label}…`,
                    suggestions: getChatResponse("", context).suggestions,
                    navigate: chip.path,
                });
                return;
            }

            if (type === CHIP_TYPES.EXTERNAL) {
                setMessages((prev) => [
                    ...prev,
                    { id: makeId(), role: "user", text: chip.label },
                ]);
                dispatchBotReply({
                    text: chip.confirmText || "Abriendo WhatsApp…",
                    suggestions: getChatResponse("ayuda", context).suggestions,
                    externalUrl: chip.url,
                });
            }
        },
        [sendMessage, webToken, dispatchBotReply, context],
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <>
            <button
                type="button"
                className={`nubix-chatbot-toggle ${open ? "is-open" : ""}`}
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Cerrar asistente" : "Abrir asistente Nubix"}
                aria-expanded={open}
            >
                <i
                    className={`bi ${open ? "bi-x-lg" : "bi-chat-dots-fill"}`}
                ></i>
            </button>

            {open && (
                <div
                    className="nubix-chatbot-panel"
                    role="dialog"
                    aria-label="Asistente Nubix Market"
                >
                    <div className="nubix-chatbot-header">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <strong className="d-block">
                                    Asistente Nubix
                                </strong>
                                <small>Modo: {roleLabel}</small>
                            </div>
                            <button
                                type="button"
                                className="btn btn-sm btn-link text-white p-0"
                                onClick={() => setOpen(false)}
                                aria-label="Cerrar"
                            >
                                <i className="bi bi-chevron-down fs-5"></i>
                            </button>
                        </div>
                    </div>

                    <div
                        className="nubix-chatbot-messages"
                        ref={listRef}
                        aria-live="polite"
                    >
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`nubix-chatbot-bubble ${msg.role}`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {suggestions.length > 0 && (
                        <div className="nubix-chatbot-suggestions">
                            {suggestions.map((chip) => (
                                <button
                                    key={chipKey(chip)}
                                    type="button"
                                    className="nubix-chatbot-chip"
                                    onClick={() => handleChipAction(chip)}
                                >
                                    {typeof chip === "string" ? chip : chip.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <form
                        className="nubix-chatbot-input-row"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Ej: quiero arroz, métodos de pago…"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            autoComplete="off"
                            maxLength={500}
                        />
                        <button
                            type="submit"
                            className="nubix-chatbot-send"
                            disabled={!input.trim()}
                            aria-label="Enviar"
                        >
                            <i className="bi bi-send-fill"></i>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;
