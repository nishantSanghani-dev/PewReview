import React, { useEffect } from 'react'


export default function Dashboard() {

    return (
        <div className="container-fluid">
            <div className="page-heading">
                <div className="row align-items-center gap-3 mb-3 mb-xxl-4">
                    <div className="col-12 col-md">
                        <h2 className="page-title">Welcome to Dashboard, John!</h2>
                    </div>
                    <div className="col-12 col-md-auto">
                        <select className="form-select w-100">
                            <option>Last 24 Hours</option>
                            <option>Last 36 Hours</option>
                            <option>Last 48 Hours</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="cards-section">
                <div className="row g-3 g-xxl-4">
                    <div className="col-sm-6 col-xl-3">
                        <div className="border-column card-icon position-relative">
                            <div className="row align-items-center mb-1">
                                <div className="col position-relative z-1">
                                    <h2 className="heading-large theme-color">380</h2>
                                </div>
                                <div className="col-auto">
                                    <div className="carf-info-icon">
                                        <img src="/assets/images/icons/users.svg" alt="users" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <h3 className="fw-medium">Total No of users</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="border-column card-icon position-relative">
                            <div className="row align-items-center mb-1">
                                <div className="col position-relative z-1">
                                    <h2 className="heading-large theme-color">389</h2>
                                </div>
                                <div className="col-auto">
                                    <div className="carf-info-icon">
                                        <img src="/assets/images/icons/location.svg" alt="location" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <h3 className="fw-medium">Total No. of Venues</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="border-column card-icon position-relative">
                            <div className="row align-items-center mb-1">
                                <div className="col position-relative z-1">
                                    <h2 className="heading-large theme-color">410</h2>
                                </div>
                                <div className="col-auto">
                                    <div className="carf-info-icon">
                                        <img src="/assets/images/icons/gun.svg" alt="gun" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <h3 className="fw-medium">Total No. of Guns</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="border-column card-icon position-relative">
                            <div className="row align-items-center mb-1">
                                <div className="col position-relative z-1">
                                    <h2 className="heading-large theme-color">2,712</h2>
                                </div>
                                <div className="col-auto">
                                    <div className="carf-info-icon">
                                        <img src="/assets/images/icons/bullets.svg" alt="bullets" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <h3 className="fw-medium">Total No of ammunitions</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-section">
                <div className="row">
                    <div className="col-xl-6 mt-3 mt-xxl-4">
                        <div className="row">
                            <div className="col">
                                <h3 className="fw-bold theme-color">Most Liked Posts</h3>
                            </div>
                            <div className="col-auto">
                                <a className="basic-links" href="javascript:void(0);">
                                    View All
                                </a>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className="table-dark">
                                            <tr>
                                                <th className="no-wrap-text">Action</th>
                                                <th className="no-wrap-text">User Name/Group Name</th>
                                                <th className="no-wrap-text">Uploaded Date</th>
                                                <th>Likes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="basic-links me-1"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="toggle1"
                                                                defaultChecked=""
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="toggle1"
                                                            />
                                                        </div>
                                                    </span>
                                                </td>
                                                <td>Andrew Abbott</td>
                                                <td>07/24/205</td>
                                                <td>1287</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="basic-links me-1"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="toggle1"
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="toggle1"
                                                            />
                                                        </div>
                                                    </span>
                                                </td>
                                                <td>CJ Abrams</td>
                                                <td>07/24/205</td>
                                                <td>890</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="basic-links me-1"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="toggle1"
                                                                defaultChecked=""
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="toggle1"
                                                            />
                                                        </div>
                                                    </span>
                                                </td>
                                                <td>Lionel Messi</td>
                                                <td>07/24/205</td>
                                                <td>11890</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 mt-3 mt-xxl-4">
                        <div className="row">
                            <div className="col">
                                <h3 className="fw-bold theme-color">Most Reported Users</h3>
                            </div>
                            <div className="col-auto">
                                <a className="basic-links" href="javascript:void(0);">
                                    View All
                                </a>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className="table-dark">
                                            <tr>
                                                <th className="no-wrap-text">Action</th>
                                                <th className="no-wrap-text">Name</th>
                                                <th className="no-wrap-text">Total Reports</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <select className="form-select">
                                                        <option>Active</option>
                                                        <option>inactive</option>
                                                    </select>
                                                </td>
                                                <td>Andrew Abbott</td>
                                                <td>
                                                    <a
                                                        className="basic-links"
                                                        href="javascript:void(0);"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#total-reports"
                                                    >
                                                        05
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <select className="form-select">
                                                        <option>Active</option>
                                                        <option>inactive</option>
                                                    </select>
                                                </td>
                                                <td>Kem Lo</td>
                                                <td>
                                                    <a
                                                        className="basic-links"
                                                        href="javascript:void(0);"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#total-reports"
                                                    >
                                                        05
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <select className="form-select">
                                                        <option>Active</option>
                                                        <option>inactive</option>
                                                    </select>
                                                </td>
                                                <td>Lionel Messi</td>
                                                <td>
                                                    <a
                                                        className="basic-links"
                                                        href="javascript:void(0);"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#total-reports"
                                                    >
                                                        05
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 mt-3 mt-xxl-4">
                        <div className="row">
                            <div className="col">
                                <h3 className="fw-bold theme-color">
                                    Recently Prohibited Words Used by Users
                                </h3>
                            </div>
                            <div className="col-auto">
                                <a className="basic-links" href="javascript:void(0);">
                                    View All
                                </a>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className="table-dark">
                                            <tr>
                                                <th className="no-wrap-text">User Name</th>
                                                <th className="no-wrap-text">
                                                    No. of Prohibited Words Used
                                                </th>
                                                <th className="no-wrap-text">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Andrew Abbott</td>
                                                <td>
                                                    <a className="basic-links" href="javascript:void(0);">
                                                        05
                                                    </a>{" "}
                                                </td>
                                                <td>
                                                    <select className="form-select">
                                                        <option>Active</option>
                                                        <option>inactive</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Kem Lo</td>
                                                <td>
                                                    <a className="basic-links" href="javascript:void(0);">
                                                        05
                                                    </a>{" "}
                                                </td>
                                                <td>
                                                    <select className="form-select">
                                                        <option>Active</option>
                                                        <option>inactive</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Lionel Messi</td>
                                                <td>
                                                    <a className="basic-links" href="javascript:void(0);">
                                                        05
                                                    </a>{" "}
                                                </td>
                                                <td>
                                                    <select className="form-select">
                                                        <option>Active</option>
                                                        <option>inactive</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 mt-3 mt-xxl-4">
                        <div className="row">
                            <div className="col">
                                <h3 className="fw-bold theme-color">Most Liked Posts</h3>
                            </div>
                            <div className="col-auto">
                                <a className="basic-links" href="javascript:void(0);">
                                    View All
                                </a>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className="table-dark">
                                            <tr>
                                                <th className="no-wrap-text">Action</th>
                                                <th className="no-wrap-text">Posted By</th>
                                                <th className="no-wrap-text">Total Reports</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="basic-links me-1"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="toggle1"
                                                                defaultChecked=""
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="toggle1"
                                                            />
                                                        </div>
                                                    </span>
                                                </td>
                                                <td>Andrew Abbott</td>
                                                <td>
                                                    <a href="#" className="basic-links">
                                                        1287
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="basic-links me-1"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="toggle1"
                                                                defaultChecked=""
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="toggle1"
                                                            />
                                                        </div>
                                                    </span>
                                                </td>
                                                <td>CJ Abrams</td>
                                                <td>
                                                    <a href="#" className="basic-links">
                                                        890
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="basic-links me-1"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="toggle1"
                                                                defaultChecked=""
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="toggle1"
                                                            />
                                                        </div>
                                                    </span>
                                                </td>
                                                <td>Lionel Messi</td>
                                                <td>
                                                    <a href="#" className="basic-links">
                                                        11890
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
