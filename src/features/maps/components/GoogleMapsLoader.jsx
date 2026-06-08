import { useJsApiLoader } from "@react-google-maps/api";
import {
    GOOGLE_MAPS_LIBRARIES,
    GOOGLE_MAPS_LOADER_ID,
} from "../constants/googleMapsConfig";

/**
 * Carga la API de Google Maps una sola vez y comparte el estado con hijos
 * (Autocomplete, GoogleMap, etc.) mediante render prop.
 */
export default function GoogleMapsLoader({ apiKey, children }) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: GOOGLE_MAPS_LOADER_ID,
        googleMapsApiKey: apiKey,
        libraries: GOOGLE_MAPS_LIBRARIES,
    });

    return children({ isLoaded, loadError });
}
