import { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { parseGooglePlace } from "../utils/parseGooglePlace";

export default function AddressAutocompleteInput({
    isMapsLoaded = false,
    mapsLoadError = null,
    value,
    onChange,
    onPlaceSelected,
    disabled = false,
    name = "direccion",
    required = false,
    onMapsError,
}) {
    const autocompleteRef = useRef(null);

    const handlePlaceChanged = () => {
        const autocomplete = autocompleteRef.current;
        if (!autocomplete) return;

        const place = autocomplete.getPlace();
        if (!place?.geometry?.location) {
            onMapsError?.(
                "Selecciona una dirección de la lista de sugerencias.",
            );
            return;
        }

        const parsed = parseGooglePlace(place);
        if (!parsed?.direccion) {
            onMapsError?.("No se pudo interpretar la dirección seleccionada.");
            return;
        }

        onPlaceSelected(parsed);
    };

    if (mapsLoadError) {
        return (
            <>
                <input
                    type="text"
                    name={name}
                    className="form-control"
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                />
                <div className="form-text text-warning small">
                    El autocompletado no está disponible. Puedes escribir la
                    dirección manualmente.
                </div>
            </>
        );
    }

    if (!isMapsLoaded) {
        return (
            <input
                type="text"
                className="form-control"
                value={value}
                disabled
                placeholder="Cargando buscador de direcciones..."
            />
        );
    }

    return (
        <div className="address-autocomplete-wrapper">
            <Autocomplete
                onLoad={(instance) => {
                    autocompleteRef.current = instance;
                }}
                onPlaceChanged={handlePlaceChanged}
                options={{
                    componentRestrictions: { country: "pe" },
                    fields: [
                        "address_components",
                        "formatted_address",
                        "geometry",
                        "place_id",
                        "name",
                    ],
                }}
            >
                <input
                    type="text"
                    name={name}
                    className="form-control"
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    autoComplete="off"
                />
            </Autocomplete>
        </div>
    );
}
