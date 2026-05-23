import React from "react";

const ImageSelectorModal = ({
    images,
    onSelect,
    onClose,
    show,
}) => {

    if (!show) return null;

    return (
        <div
            className="modal d-block"
            tabIndex="-1"
            style={{
                backgroundColor: "rgba(0,0,0,0.5)",
            }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow">

                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">
                            Seleccionar Imagen
                        </h5>

                        <button
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>

                    <div className="modal-body">

                        <div className="row g-3">

                            {images.map((img) => (

                                <div
                                    key={img.id}
                                    className="col-md-3"
                                >
                                    <div
                                        className="card h-100 shadow-sm"
                                        style={{
                                            cursor: "pointer",
                                        }}
                                        onClick={() => onSelect(img)}
                                    >

                                        <img
                                            src={`http://localhost:8080/uploads/${img.archivo}`}
                                            alt=""
                                            className="card-img-top"
                                            style={{
                                                height: "150px",
                                                objectFit: "cover",
                                            }}
                                        />

                                        <div className="card-body p-2 text-center">
                                            <small>
                                                ID: {img.id}
                                            </small>
                                        </div>

                                    </div>
                                </div>

                            ))}

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default ImageSelectorModal;