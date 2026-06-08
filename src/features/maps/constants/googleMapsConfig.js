export const GOOGLE_MAPS_LOADER_ID = "nubix-google-maps-script";

export const GOOGLE_MAPS_LIBRARIES = ["places"];

/** Centro por defecto (Lima) cuando aún no hay coordenadas seleccionadas */
export const LIMA_DEFAULT_CENTER = { lat: -12.0464, lng: -77.0428 };

export const ADDRESS_MAP_CONTAINER_STYLE = {
    width: "100%",
    height: "300px",
};

export const ADDRESS_MAP_OPTIONS = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    gestureHandling: "cooperative",
};
