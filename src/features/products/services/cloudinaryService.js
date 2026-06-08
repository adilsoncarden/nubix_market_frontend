const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const PRODUCT_IMAGES_FOLDER = "home/nubix-market/productos";

export async function uploadImageToCloudinary(file) {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error(
            "Configura VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET en tu archivo .env",
        );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", PRODUCT_IMAGES_FOLDER);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
    );

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(
            errorBody?.error?.message || "Error al subir la imagen a Cloudinary",
        );
    }

    const data = await response.json();
    return data.secure_url;
}
