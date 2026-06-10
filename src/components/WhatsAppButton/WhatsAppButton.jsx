import "./WhatsAppButton.css";

const WHATSAPP_NUMBER = "51933190414";
const WHATSAPP_MESSAGE = "Hola quiero consultar sobre un producto";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export default function WhatsAppButton() {
    return (
        <a
            href={WHATSAPP_URL}
            className="nubix-whatsapp-btn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            title="Escríbenos por WhatsApp"
        >
            <i className="bi bi-whatsapp" aria-hidden="true" />
        </a>
    );
}
