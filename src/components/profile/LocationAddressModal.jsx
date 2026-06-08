import { useEffect, useState } from "react";
import { profileService } from "../../features/profile/services/profileService";
import { mapsConfigService } from "../../features/maps/services/mapsConfigService";
import AddressAutocompleteInput from "../../features/maps/components/AddressAutocompleteInput";
import AddressMapPreview from "../../features/maps/components/AddressMapPreview";
import GoogleMapsLoader from "../../features/maps/components/GoogleMapsLoader";
import { mergeWebUserProfile } from "../../utils/authUtils";

const emptyForm = {
    direccion: "",
    distrito: "",
    referencia: "",
    latitud: null,
    longitud: null,
    googlePlaceId: "",
};

export default function LocationAddressModal({ show, onClose, onSaved }) {
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [mapsWarning, setMapsWarning] = useState("");
    const [mapsApiKey, setMapsApiKey] = useState("");
    const [mapsKeyLoading, setMapsKeyLoading] = useState(false);

    useEffect(() => {
        if (!show) return;
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setMapsKeyLoading(true);
            setError("");
            setMapsWarning("");

            try {
                const [profileResult, mapsResult] = await Promise.allSettled([
                    profileService.getPerfil(),
                    mapsConfigService.getGoogleMapsApiKey(),
                ]);

                if (cancelled) return;

                if (profileResult.status === "fulfilled") {
                    const data = profileResult.value;
                    setForm({
                        direccion: data.direccion ?? "",
                        distrito: data.distrito ?? "",
                        referencia: data.referencia ?? "",
                        latitud: data.latitud ?? null,
                        longitud: data.longitud ?? null,
                        googlePlaceId: data.googlePlaceId ?? "",
                    });
                } else {
                    setError("No se pudo cargar tu dirección guardada.");
                }

                if (
                    mapsResult.status === "fulfilled" &&
                    mapsResult.value.apiKey
                ) {
                    setMapsApiKey(mapsResult.value.apiKey);
                } else {
                    setMapsApiKey("");
                    setMapsWarning(
                        "El autocompletado de Google no está configurado. Puedes ingresar la dirección manualmente.",
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                    setMapsKeyLoading(false);
                }
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (name === "direccion") {
            setMapsWarning("");
        }
    };

    const handlePlaceSelected = (parsed) => {
        setForm((prev) => ({
            ...prev,
            direccion: parsed.direccion || prev.direccion,
            distrito: parsed.distrito || prev.distrito,
            referencia: parsed.referencia || prev.referencia,
            latitud: parsed.latitud,
            longitud: parsed.longitud,
            googlePlaceId: parsed.googlePlaceId || "",
        }));
        setMapsWarning("");
        setError("");
    };

    const handleMapsError = (message) => {
        setMapsWarning(message);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.direccion.trim() || !form.distrito.trim()) {
            setError("Dirección y distrito son obligatorios.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const payload = {
                direccion: form.direccion.trim(),
                distrito: form.distrito.trim(),
                referencia: form.referencia.trim(),
            };

            if (form.latitud != null) payload.latitud = form.latitud;
            if (form.longitud != null) payload.longitud = form.longitud;
            if (form.googlePlaceId?.trim()) {
                payload.googlePlaceId = form.googlePlaceId.trim();
            }

            const updated = await profileService.updatePerfil(payload);
            mergeWebUserProfile(updated);
            onSaved?.(updated);
            onClose();
        } catch {
            setError("No se pudo guardar la dirección. Intenta de nuevo.");
        } finally {
            setSaving(false);
        }
    };

    if (!show) return null;

    const showAutocomplete =
        !mapsKeyLoading && mapsApiKey && !loading;

    return (
        <div
            className="modal fade show d-block location-address-modal"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                            <i className="bi bi-geo-alt text-success" />
                            Dirección de envío
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Cerrar"
                        />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <p className="text-muted small mb-3">
                                Guarda tu dirección predeterminada para agilizar
                                tus compras.
                            </p>
                            {error && (
                                <div className="alert alert-danger py-2 small">
                                    {error}
                                </div>
                            )}
                            {mapsWarning && (
                                <div className="alert alert-warning py-2 small">
                                    {mapsWarning}
                                </div>
                            )}
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border spinner-border-sm text-success" />
                                </div>
                            ) : showAutocomplete ? (
                                <GoogleMapsLoader apiKey={mapsApiKey}>
                                    {({ isLoaded, loadError }) => (
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">
                                                    Dirección
                                                </label>
                                                <AddressAutocompleteInput
                                                    isMapsLoaded={isLoaded}
                                                    mapsLoadError={loadError}
                                                    value={form.direccion}
                                                    onChange={handleChange}
                                                    onPlaceSelected={
                                                        handlePlaceSelected
                                                    }
                                                    onMapsError={
                                                        handleMapsError
                                                    }
                                                    disabled={saving}
                                                    required
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small fw-semibold">
                                                    Distrito
                                                </label>
                                                <input
                                                    type="text"
                                                    name="distrito"
                                                    className="form-control"
                                                    value={form.distrito}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small fw-semibold">
                                                    Referencia
                                                </label>
                                                <input
                                                    type="text"
                                                    name="referencia"
                                                    className="form-control"
                                                    value={form.referencia}
                                                    onChange={handleChange}
                                                    placeholder="Opcional"
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small fw-semibold">
                                                    Ubicación en el mapa
                                                </label>
                                                {isLoaded && !loadError ? (
                                                    <AddressMapPreview
                                                        latitud={form.latitud}
                                                        longitud={form.longitud}
                                                    />
                                                ) : (
                                                    <div className="address-map-preview address-map-preview--loading d-flex align-items-center justify-content-center">
                                                        <div className="spinner-border spinner-border-sm text-success" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </GoogleMapsLoader>
                            ) : (
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label small fw-semibold">
                                            Dirección
                                        </label>
                                        <input
                                            type="text"
                                            name="direccion"
                                            className="form-control"
                                            value={form.direccion}
                                            onChange={handleChange}
                                            required
                                            disabled={
                                                saving || mapsKeyLoading
                                            }
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small fw-semibold">
                                            Distrito
                                        </label>
                                        <input
                                            type="text"
                                            name="distrito"
                                            className="form-control"
                                            value={form.distrito}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label small fw-semibold">
                                            Referencia
                                        </label>
                                        <input
                                            type="text"
                                            name="referencia"
                                            className="form-control"
                                            value={form.referencia}
                                            onChange={handleChange}
                                            placeholder="Opcional"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={onClose}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={loading || saving}
                            >
                                {saving ? "Guardando..." : "Guardar dirección"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
