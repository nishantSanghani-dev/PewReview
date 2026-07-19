import React from 'react'

export default function SerachFilter() {
    return (
        <div className="col-12 col-lg-auto">
            <form className="d-md-flex searchbar align-items-center" role="search">
                <input
                    className="form-control search-input"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                />
                <button
                    className="btn btn-outline-primary search-toggle"
                    type="button"
                >
                    <i className="demo-icon icon-search" />
                </button>
            </form>
        </div>
    )
}
