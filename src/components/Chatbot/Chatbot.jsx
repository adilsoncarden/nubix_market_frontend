import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import {
    getChatResponse,
    getWelcomeMessage,
    resolveUserRole,
} from "../../features/chatbot/services/chatbotService";
import { ROLES } from "../../features/chatbot/knowledge/chatbotKnowledge";
import "./Chatbot.css";

const ROLE_LABELS = {
    [ROLES.GUEST]: "Visitante",
    [ROLES.CLIENT]: "Cliente",
    [ROLES.ADMIN]: "Administrador",
};

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const Chatbot = () => {
    const { token, user } = useAuth();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const listRef = useRef(null);

    const context = useMemo(
        () => ({
            token,
            user,
            pathname: location.pathname,
        }),
        [token, user, location.pathname],
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

    const sendMessage = useCallback(
        (text) => {
            const trimmed = (text || "").trim();
            if (!trimmed) return;

            setMessages((prev) => [
                ...prev,
                { id: makeId(), role: "user", text: trimmed },
            ]);
            setInput("");

            const { text: reply, suggestions: chips } = getChatResponse(
                trimmed,
                context,
            );

            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { id: makeId(), role: "bot", text: reply },
                ]);
                setSuggestions(chips || []);
                scrollToBottom();
            }, 280);
        },
        [context, scrollToBottom],
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleChip = (chip) => {
        sendMessage(chip);
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
                                    key={chip}
                                    type="button"
                                    className="nubix-chatbot-chip"
                                    onClick={() => handleChip(chip)}
                                >
                                    {chip}
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
                            placeholder="Escribe tu pregunta..."
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
