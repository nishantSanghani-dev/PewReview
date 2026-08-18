import React, { useEffect, useState } from "react";
import "../mediaPlayer/mediaPlayer.css"
const MediaViewer = ({
    images = [],
    initialIndex = 0,
    open,
    onClose,
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (open) {
            setCurrentIndex(initialIndex);
        }
    }, [open, initialIndex]);

    // Keyboard navigation
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }

            if (event.key === "ArrowLeft") {
                goPrevious();
            }

            if (event.key === "ArrowRight") {
                goNext();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        // Prevent background scrolling
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [open, currentIndex]);

    if (!open || !images.length) {
        return null;
    }

    const goPrevious = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const goNext = () => {
        setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const currentImage = images[currentIndex];

    // Support both:
    // "https://..."
    // and
    // { url: "...", thumbnail: "...", name: "..." }
    const getImageUrl = (image) => {
        if (typeof image === "string") {
            return image;
        }

        return image.url;
    };

    const getThumbnailUrl = (image) => {
        if (typeof image === "string") {
            return image;
        }

        return image.thumbnail || image.url;
    };

    return (
        <div
            className="custom-media-overlay"
            onMouseDown={(e) => {
                // Close only when clicking outside the media container
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="custom-media-modal">

                {/* Header */}
                <div className="custom-media-header">
                    <h5 className="mb-0">Media</h5>

                    <button
                        type="button"
                        className="custom-media-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <span>&times;</span>
                    </button>
                </div>

                {/* Main Image Area */}
                <div className="custom-media-body">

                    {/* Previous */}
                    {images.length > 1 && (
                        <button
                            type="button"
                            className="media-navigation media-navigation-left"
                            onClick={goPrevious}
                            aria-label="Previous image"
                        >
                            <span>&lsaquo;</span>
                        </button>
                    )}

                    <div className="main-media-wrapper">
                        <img
                            src={getImageUrl(currentImage)}
                            alt={
                                typeof currentImage === "string"
                                    ? `Media ${currentIndex + 1}`
                                    : currentImage.name || `Media ${currentIndex + 1}`
                            }
                            className="main-media-image"
                        />
                    </div>

                    {/* Next */}
                    {images.length > 1 && (
                        <button
                            type="button"
                            className="media-navigation media-navigation-right"
                            onClick={goNext}
                            aria-label="Next image"
                        >
                            <span>&rsaquo;</span>
                        </button>
                    )}
                </div>

                {/* Thumbnail Area */}
                <div className="custom-media-thumbnails-wrapper">

                    <div className="custom-media-thumbnails">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`media-thumbnail ${currentIndex === index ? "active" : ""
                                    }`}
                                onClick={() => setCurrentIndex(index)}
                            >
                                <img
                                    src={getThumbnailUrl(image)}
                                    alt={`Thumbnail ${index + 1}`}
                                />
                            </button>
                        ))}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default MediaViewer;