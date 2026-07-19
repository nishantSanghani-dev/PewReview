import React from 'react'
import "./loader.css"
export default function Loader() {
    return (
        <div className="loader-overlay">
            <div className="text-center">
                <div
                    className="spinner-border text-primary"
                    style={{ width: "4rem", height: "4rem" }}
                    role="status"
                >
                    <span className="visually-hidden">Loading...</span>
                </div>

                <p className="mt-3 fw-semibold text-dark">
                    Please wait...
                </p>
            </div>
        </div>
    )
}
