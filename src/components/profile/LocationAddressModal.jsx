import { useEffect, useState } from "react";
import { profileService } from "../../features/profile/services/profileService";
import { mergeWebUserProfile } from "../../utils/authUtils";

const emptyForm = {
    direccion: "",
    distrito: "",
    referencia: "",
};

export default function LocationAddressModal({ show, onClose, onSaved }) {
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!show) return;
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await profileService.getPerfil();
                if (!cancelled) {
                    setForm({
                        direccion: data.direccion ?? "",
                        distrito: data.distrito ?? "",
                        referencia: data.referencia ?? "",
                    });
                }
            } catch {
                if (!cancelled) {
                    setError("No se pudo cargar tu dirección guardada.");
                }
            } finally {
                if (!cancelled) setLoading(false);
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
            const updated = await profileService.updatePerfil({
                direccion: form.direccion.trim(),
                distrito: form.distrito.trim(),
                referencia: form.referencia.trim(),
            });
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

    return (
        <div
            className="modal fade show d-block"
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
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border spinner-border-sm text-success" />
                                </div>
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
