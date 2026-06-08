import { useCallback, useEffect, useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import {
    ADDRESS_MAP_CONTAINER_STYLE,
    ADDRESS_MAP_OPTIONS,
    LIMA_DEFAULT_CENTER,
} from "../constants/googleMapsConfig";

export default function AddressMapPreview({ latitud, longitud }) {
    const mapRef = useRef(null);

    const hasCoords =
        latitud != null &&
        longitud != null &&
        Number.isFinite(Number(latitud)) &&
        Number.isFinite(Number(longitud));

    const markerPosition = hasCoords
        ? { lat: Number(latitud), lng: Number(longitud) }
        : null;

    const center = markerPosition ?? LIMA_DEFAULT_CENTER;
    const zoom = hasCoords ? 16 : 11;

    const handleMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    useEffect(() => {
        if (!mapRef.current || !markerPosition) return;
        mapRef.current.panTo(markerPosition);
        mapRef.current.setZoom(16);
    }, [markerPosition?.lat, markerPosition?.lng]);

    return (
        <div className="address-map-preview">
            <GoogleMap
                mapContainerStyle={ADDRESS_MAP_CONTAINER_STYLE}
                center={center}
                zoom={zoom}
                options={ADDRESS_MAP_OPTIONS}
                onLoad={handleMapLoad}
            >
                {markerPosition && <Marker position={markerPosition} />}
            </GoogleMap>
            {!hasCoords && (
                <p className="address-map-hint text-muted small mb-0 mt-2">
                    Selecciona una dirección del autocompletado para ver el
                    marcador en el mapa.
                </p>
            )}
        </div>
    );
}
