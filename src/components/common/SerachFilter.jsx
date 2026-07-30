import React from 'react'

export default function SerachFilter({ value = "", onChange, onSubmit, placeholder = "Search" }) {
    const handleSubmit = (e) => {
        e.preventDefault()
        if (typeof onSubmit === 'function') {
            onSubmit(value)
        }
    }

    return (
        <div className="col-12 col-lg-auto">
            <form className="d-md-flex searchbar align-items-center" role="search" onSubmit={handleSubmit}>
                <input
                    className="form-control search-input"
                    type="search"
                    placeholder={placeholder}
                    aria-label="Search"
                    value={value}
                    onChange={onChange}
                />
                <button
                    className="btn btn-outline-primary search-toggle"
                    type="submit"
                >
                    <i className="demo-icon icon-search" />
                </button>
            </form>
        </div>
    )
}
