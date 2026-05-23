import React, { useState, useRef } from "react";

const ImagenUploader = ({ onImageSelected }) => {
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file) => {
        if (!file.type.match("image.*")) {
            alert("Por favor, sube solo archivos de imagen.");
            return;
        }
        setPreviewUrl(URL.createObjectURL(file));
        onImageSelected(file);
    };

    const removeImage = () => {
        setPreviewUrl(null);
        onImageSelected(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="mb-3">
            <label className="form-label fw-bold">Adjunta una imagen</label>
            {!previewUrl ? (
                <div 
                    className={`p-4 text-center border rounded ${dragActive ? 'bg-light' : ''}`}
                    onDragEnter={handleDrag} onDragLeave={handleDrag}
                    onDragOver={handleDrag} onDrop={handleDrop}
                    style={{ border: '2px dashed #ccc', cursor: 'pointer' }}
                    onClick={() => inputRef.current.click()}
                >
                    <p>Arrastra o haz clic para subir imagen</p>
                    <input ref={inputRef} type="file" className="d-none" accept="image/*" onChange={handleChange} />
                </div>
            ) : (
                <div className="text-center p-2 border rounded position-relative">
                    <img src={previewUrl} alt="Preview" className="img-fluid" style={{ maxHeight: '150px' }} />
                    <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0" onClick={removeImage}>X</button>
                </div>
            )}
        </div>
    );
};

export default ImagenUploader;