import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
    WALLET_PAYMENT_CONFIG,
    buildWalletQrPayload,
} from "../../config/walletPaymentConfig";
import yapeLogo from "../../assets/wallet/yape-logo.svg";
import plinLogo from "../../assets/wallet/plin-logo.svg";

const DEFAULT_LOGOS = {
    YAPE: yapeLogo,
    PLIN: plinLogo,
};

const QR_SIZE = 200;
const LOGO_SIZE = 40;

/**
 * QR de pago para Yape / Plin.
 * @param {object} props
 * @param {"YAPE"|"PLIN"} props.walletKey
 * @param {number} props.amount - Monto total a pagar (PEN)
 * @param {string} [props.orderRef] - Referencia opcional de pedido
 * @param {string} [props.qrPayload] - Override del contenido del QR (p. ej. desde backend)
 * @param {string} [props.qrImageUrl] - Imagen estática en lugar de QR generado
 */
export default function WalletQrCode({
    walletKey,
    amount,
    orderRef,
    qrPayload,
    qrImageUrl,
}) {
    const config = WALLET_PAYMENT_CONFIG[walletKey];

    const payload = useMemo(() => {
        if (qrPayload?.trim()) return qrPayload.trim();
        return buildWalletQrPayload(walletKey, { amount, orderRef });
    }, [walletKey, amount, orderRef, qrPayload]);

    const staticImage = qrImageUrl?.trim() || config?.qrImageUrl?.trim();

    const logoSrc =
        config?.qrLogoUrl?.trim() || DEFAULT_LOGOS[walletKey] || "";

    if (!config) return null;

    if (staticImage) {
        return (
            <div
                className="checkout-payment-qr checkout-payment-qr--centered rounded-3"
                role="img"
                aria-label={`Código QR de pago ${config.label}`}
            >
                <img
                    src={staticImage}
                    alt={`Código QR ${config.label}`}
                    className="checkout-payment-qr-image rounded-3"
                    width={QR_SIZE}
                    height={QR_SIZE}
                />
                <span className="checkout-payment-qr-label">{config.label}</span>
            </div>
        );
    }

    const imageSettings = logoSrc
        ? {
              src: logoSrc,
              height: LOGO_SIZE,
              width: LOGO_SIZE,
              excavate: true,
          }
        : undefined;

    return (
        <div
            className="checkout-payment-qr checkout-payment-qr--centered rounded-3"
            role="img"
            aria-label={`Código QR de pago ${config.label}`}
        >
            <div className="checkout-payment-qr-canvas rounded-3">
                <QRCodeSVG
                    value={payload}
                    size={QR_SIZE}
                    level="M"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#1e293b"
                    imageSettings={imageSettings}
                />
            </div>
            <span className="checkout-payment-qr-label">{config.label}</span>
            <span className="checkout-payment-qr-scan-hint">{config.scanHint}</span>
        </div>
    );
}
