import { useEffect, useState } from "react";
import { profileService } from "../features/profile/services/profileService";
import { identityService } from "../features/identity/services/identityService";
import { sanitizeDocumento } from "../features/identity/utils/documentUtils";
import { mergeWebUserProfile } from "../utils/authUtils";
import "../styles/profile-page.css";

const emptyProfile = {
    username: "",
    email: "",
    telefono: "",
    dniRuc: "",
    nombreRazonSocial: "",
    direccion: "",
    departamento: "",
    provincia: "",
    distrito: "",
    referencia: "",
};

export default function ProfilePage() {
    const [form, setForm] = useState(emptyProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [dniTouched, setDniTouched] = useState(false);
    const [dniLookupLoading, setDniLookupLoading] = useState(false);
    const [dniLookupError, setDniLookupError] = useState("");

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const data = await profileService.getPerfil();
                if (!cancelled) {
                    setForm({
                        username: data.username ?? "",
                        email: data.email ?? "",
                        telefono: data.telefono ?? "",
                        dniRuc: data.dniRuc ?? "",
                        nombreRazonSocial: data.nombreRazonSocial ?? "",
                        direccion: data.direccion ?? "",
                        departamento: data.departamento ?? "",
                        provincia: data.provincia ?? "",
                        distrito: data.distrito ?? "",
                        referencia: data.referencia ?? "",
                    });
                }
            } catch {
                if (!cancelled) {
                    setError("No se pudo cargar tu perfil.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "telefono") {
            setForm((prev) => ({
                ...prev,
                telefono: value.replace(/\D/g, "").slice(0, 9),
            }));
            return;
        }
        if (name === "dniRuc") {
            setDniLookupError("");
            setForm((prev) => ({
                ...prev,
                dniRuc: sanitizeDocumento(value, 8),
            }));
            return;
        }
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDniBlur = async () => {
        setDniTouched(true);
        const dni = sanitizeDocumento(form.dniRuc, 8);
        if (dni.length !== 8) {
            if (dni.length > 0) {
                setDniLookupError("El DNI debe tener 8 dígitos.");
            }
            return;
        }
        setDniLookupLoading(true);
        setDniLookupError("");
        try {
            const data = await identityService.consultar(dni);
            setForm((prev) => ({
                ...prev,
                nombreRazonSocial:
                    data.nombreRazonSocial || prev.nombreRazonSocial,
            }));
        } catch (err) {
            setDniLookupError(
                err.response?.data?.message ||
                    "No se pudo validar el DNI. Verifica el número.",
            );
        } finally {
            setDniLookupLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setMessage("");
        try {
            const updated = await profileService.updatePerfil({
                telefono: form.telefono,
                dniRuc: form.dniRuc,
                nombreRazonSocial: form.nombreRazonSocial,
                direccion: form.direccion,
                departamento: form.departamento,
                provincia: form.provincia,
                distrito: form.distrito,
                referencia: form.referencia,
            });
            mergeWebUserProfile(updated);
            setMessage("Perfil actualizado correctamente.");
        } catch {
            setError("No se pudo guardar los cambios.");
        } finally {
            setSaving(false);
        }
    };

    const dniError =
        dniTouched && form.dniRuc && form.dniRuc.length !== 8
            ? "El DNI debe tener 8 dígitos."
            : null;

    return (
        <div className="profile-page py-4 py-md-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8 col-xl-7">
                        <header className="text-center text-md-start mb-4">
                            <h1 className="profile-page-title h3 fw-bold mb-2">
                                <i className="bi bi-person-circle me-2 text-success" />
                                Mi Perfil
                            </h1>
                            <p className="text-muted mb-0">
                                Actualiza tus datos de contacto y envío.
                            </p>
                        </header>

                        <div className="card profile-card border-0 shadow-sm">
                            <div className="card-body p-4 p-md-5">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-success" />
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        {message && (
                                            <div className="alert alert-success py-2">
                                                {message}
                                            </div>
                                        )}
                                        {error && (
                                            <div className="alert alert-danger py-2">
                                                {error}
                                            </div>
                                        )}

                                        <div className="row g-3">
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small fw-semibold">
                                                    Usuario
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={form.username}
                                                    readOnly
                                                    disabled
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small fw-semibold">
                                                    Correo
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={form.email}
                                                    readOnly
                                                    disabled
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small fw-semibold">
                                                    DNI
                                                </label>
                                                <input
                                                    type="text"
                                                    name="dniRuc"
                                                    inputMode="numeric"
                                                    maxLength={8}
                                                    className={`form-control${dniError || dniLookupError ? " is-invalid" : ""}`}
                                                    value={form.dniRuc}
                                                    onChange={handleChange}
                                                    onBlur={handleDniBlur}
                                                />
                                                {dniLookupLoading && (
                                                    <div className="form-text small">
                                                        Validando DNI...
                                                    </div>
                                                )}
                                                {(dniError || dniLookupError) && (
                                                    <div className="invalid-feedback d-block">
                                                        {dniError || dniLookupError}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small fw-semibold">
                                                    Nombre y Apellidos
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nombreRazonSocial"
                                                    className="form-control"
                                                    value={form.nombreRazonSocial}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small fw-semibold">
                                                    Teléfono
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="telefono"
                                                    inputMode="numeric"
                                                    maxLength={9}
                                                    className="form-control"
                                                    value={form.telefono}
                                                    onChange={handleChange}
                                                />
                                            </div>
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
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-center justify-content-md-end mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-success px-4"
                                                disabled={saving}
                                            >
                                                {saving
                                                    ? "Guardando..."
                                                    : "Guardar cambios"}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
