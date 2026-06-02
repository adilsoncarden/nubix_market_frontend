import React, { useState, useRef, useEffect } from "react";
import imageCompression from "browser-image-compression";
import {
    productService,
    getProductImageUrl,
} from "../services/productService";

const ProductImageField = ({
    productId,
    imagen,
    onImageUpdated,
    onPendingFile,
    disabled = false,
}) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    const currentImageUrl = getProductImageUrl(imagen);
    const displayUrl = previewUrl || currentImageUrl;

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const processFile = async (file) => {
        if (!file?.type?.match("image.*")) {
            alert("Por favor, sube solo archivos de imagen.");
            return;
        }

        let processedFile = file;
        try {
            processedFile = await imageCompression(file, {
                maxSizeMB: 0.1, // ~100KB objetivo
                maxWidthOrHeight: 1280,
                useWebWorker: true,
                initialQuality: 0.8,
            });
        } catch (error) {
            console.error("Error al comprimir imagen:", error);
            alert("No se pudo procesar la imagen seleccionada.");
            return;
        }

        if (processedFile.size > 150 * 1024) {
            alert("La imagen comprimida supera el tamaño permitido (~150KB).");
            return;
        }

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(processedFile));

        if (productId) {
            setUploading(true);
            try {
                const updated = await productService.uploadProductImage(
                    productId,
                    processedFile,
                );
                setPreviewUrl(null);
                onImageUpdated?.(updated);
            } catch (error) {
                console.error(error);
                alert("Error al subir la imagen");
                setPreviewUrl(null);
            } finally {
                setUploading(false);
                if (inputRef.current) inputRef.current.value = "";
            }
        } else {
            onPendingFile?.(processedFile);
        }
    };

    const handleDelete = async () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            onPendingFile?.(null);
            if (inputRef.current) inputRef.current.value = "";
            return;
        }

        if (productId && imagen) {
            setUploading(true);
            try {
                const updated =
                    await productService.deleteProductImage(productId);
                onImageUpdated?.(updated);
            } catch (error) {
                console.error(error);
                alert("Error al eliminar la imagen");
            } finally {
                setUploading(false);
            }
        } else {
            onPendingFile?.(null);
        }
    };

    return (
        <div className="mb-3">
            <label className="form-label fw-bold">Imagen del producto</label>
            {displayUrl ? (
                <div className="text-center p-2 border rounded position-relative">
                    <img
                        src={displayUrl}
                        alt="Imagen del producto"
                        loading="lazy"
                        className="img-fluid rounded"
                        style={{ maxHeight: "180px", objectFit: "contain" }}
                    />
                    {!disabled && (
                        <div className="d-flex justify-content-center gap-2 mt-3">
                            <button
                                type="button"
                                className="btn btn-outline-success btn-sm"
                                onClick={() => inputRef.current?.click()}
                                disabled={uploading}
                            >
                                <i className="bi bi-arrow-repeat me-1"></i>
                                Cambiar
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={handleDelete}
                                disabled={uploading}
                            >
                                <i className="bi bi-trash3 me-1"></i>
                                Eliminar
                            </button>
                        </div>
                    )}
                    {uploading && (
                        <div className="mt-2">
                            <span className="spinner-border spinner-border-sm text-success me-2"></span>
                            <small className="text-muted">Procesando imagen...</small>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    className="p-4 text-center border rounded"
                    style={{
                        border: "2px dashed #d1d5db",
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.6 : 1,
                    }}
                    onClick={() => !disabled && inputRef.current?.click()}
                >
                    <i className="bi bi-image text-muted fs-2 d-block mb-2"></i>
                    <p className="mb-0 text-muted small">
                        {productId
                            ? "Haz clic para subir la imagen del producto"
                            : "Selecciona una imagen (se subirá al guardar el producto)"}
                    </p>
                </div>
            )}
            <input
                ref={inputRef}
                type="file"
                className="d-none"
                accept="image/*"
                disabled={disabled || uploading}
                onChange={(e) => {
                    if (e.target.files?.[0]) processFile(e.target.files[0]);
                }}
            />
        </div>
    );
};

export default ProductImageField;
