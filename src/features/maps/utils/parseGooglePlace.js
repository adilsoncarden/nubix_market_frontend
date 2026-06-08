const findComponent = (components, ...types) => {
    if (!Array.isArray(components)) return "";
    for (const type of types) {
        const match = components.find((c) => c.types?.includes(type));
        if (match?.long_name) return match.long_name;
    }
    return "";
};

/**
 * Extrae campos de dirección desde un resultado de Google Places (orientado a Perú).
 */
export function parseGooglePlace(place) {
    if (!place) {
        return null;
    }

    const components = place.address_components ?? [];
    const geometry = place.geometry?.location;

    const distrito = findComponent(
        components,
        "sublocality_level_1",
        "sublocality",
        "administrative_area_level_3",
        "administrative_area_level_2",
        "locality",
    );

    const route = findComponent(components, "route");
    const streetNumber = findComponent(components, "street_number");
    const neighborhood = findComponent(
        components,
        "neighborhood",
        "premise",
        "subpremise",
    );

    let referencia = [route, streetNumber].filter(Boolean).join(" ").trim();
    if (!referencia) {
        referencia = neighborhood;
    }

    const lat =
        typeof geometry?.lat === "function"
            ? geometry.lat()
            : geometry?.lat ?? null;
    const lng =
        typeof geometry?.lng === "function"
            ? geometry.lng()
            : geometry?.lng ?? null;

    return {
        direccion:
            place.formatted_address?.trim() ||
            place.name?.trim() ||
            "",
        distrito,
        referencia,
        latitud: lat != null ? Number(lat) : null,
        longitud: lng != null ? Number(lng) : null,
        googlePlaceId: place.place_id ?? "",
    };
}
