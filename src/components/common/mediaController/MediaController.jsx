import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../mediaController/mediaController.css";

export default function MediaController({
    show,
    image,
    title = "Media",
    onClose,
    onPrevious,
    onNext,
    hasPrevious = true,
    hasNext = true,
    totalThumbnailImages
}) {
    const [showImage, setshowImage] = useState(image)
    useEffect(() => {

        setshowImage(image)
        if (!show) {
            return;
        }
        return () => {
       
            document.body.classList.remove("media-modal-open");
        };
    }, [show, onClose, image]);

    const isVideo = (url) => {
        return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url);
    };

    const isMultiple = totalThumbnailImages && totalThumbnailImages.length > 1;
    const currentIndex = totalThumbnailImages?.findIndex(img => img === showImage) ?? -1;

    const handlePrev = () => {
        if (!totalThumbnailImages || totalThumbnailImages.length <= 1) return;
        if (currentIndex > 0) {
            setshowImage(totalThumbnailImages[currentIndex - 1]);
        } else if (currentIndex === 0) {
            setshowImage(totalThumbnailImages[totalThumbnailImages.length - 1]);
        }
    };

    const handleNext = () => {
        if (!totalThumbnailImages || totalThumbnailImages.length <= 1) return;
        if (currentIndex < totalThumbnailImages.length - 1) {
            setshowImage(totalThumbnailImages[currentIndex + 1]);
        } else if (currentIndex === totalThumbnailImages.length - 1) {
            setshowImage(totalThumbnailImages[0]);
        }
    };

    if (!show) {
        return null;
    }

    const modalContent = (
        <>
            <div
                className="modal fade show media-preview-modal"
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                aria-labelledby="media-preview-title"
            >
                <div className="modal-dialog media-preview-dialog">
                    <div className="modal-content media-preview-content">

                        {/* HEADER */}
                        <div className="modal-header media-preview-header">
                            <h5
                                id="media-preview-title"
                                className="modal-title"
                            >
                                {"Media"}
                            </h5>

                            <button
                                type="button"
                                className="btn-close media-preview-close"
                                aria-label="Close"
                                onClick={onClose}
                            />
                        </div>

                        {/* BODY */}
                        <div className="modal-body media-preview-body">

                            {/* MAIN IMAGE + NAVIGATION */}
                            <div className="media-preview-wrapper">

                                {/* PREVIOUS */}
                                {isMultiple && (
                                    <button
                                        type="button"
                                        className="media-preview-nav media-preview-prev"
                                        aria-label="Previous image"
                                        onClick={handlePrev}
                                    >
                                        ‹
                                    </button>
                                )}

                                {/* IMAGE / VIDEO */}
                                {showImage ? (
                                    isVideo(showImage) ? (
                                        <video
                                            src={showImage}
                                            controls
                                            className="media-preview-image"
                                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                                        />
                                    ) : (
                                        <img
                                            src={showImage}
                                            alt="Preview"
                                            className="media-preview-image"
                                        />
                                    )
                                ) : (
                                    <div className="media-preview-empty">
                                        No media available
                                    </div>
                                )}

                                {/* NEXT */}
                                {isMultiple && (
                                    <button
                                        type="button"
                                        className="media-preview-nav media-preview-next"
                                        aria-label="Next image"
                                        onClick={handleNext}
                                    >
                                        ›
                                    </button>
                                )}

                            </div>

                            {/* THUMBNAIL */}
                            {isMultiple && (
                                <div className="media-preview-thumbnail-wrapper">
                                    {totalThumbnailImages.map((value, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setshowImage(value)}
                                            type="button"
                                            className={`media-preview-thumbnail ${value === showImage ? 'active' : ''}`}
                                            aria-label="Selected image"
                                        >
                                            {isVideo(value) ? (
                                                <video
                                                    src={value}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <img
                                                    src={value}
                                                    alt={`Thumbnail ${index + 1}`}
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {/* BACKDROP */}
            <div
                className="modal-backdrop fade show media-preview-backdrop"
                onClick={onClose}
            />
        </>
    );

    return createPortal(modalContent, document.body);
}