import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../../services/Api'
import { API_ROUTES } from '../../../routes/api.routes'
import SerachFilter from '../../../components/common/SerachFilter'
import useGridPagination from '../../../hooks/useGridPagination'

export default function ManageUser() {
    const [manageUserData, setmanageUserData] = useState([])
    const [ids, setids] = useState([])
    const [searchText, setSearchText] = useState("")
    const [customSearch, setcustomSearch] = useState("")
    const { page, pageSize, resetPage } = useGridPagination(10)
    const getManageUser = async () => {
        const res = await apiRequest("POST", API_ROUTES.user.userView, { page, pageSize, customSearch }, null, {
            showLoader: true
        })
        console.log(res.data);
        setmanageUserData(res.data.data)
    }
    const handleChange = (event) => {
        if (event.target.checked) {

            setids([...ids, event.target.value])
        }
        else {
            setids(ids.filter((value, index) => value != event.target.value))
        }
    }

    const handleStatusChange = async (id, checked) => {
        if (confirm("Are You Want To Change Status ? ")) {

            const res = await apiRequest("PUT", API_ROUTES.user.userStatusUpdate(id), null, {
                isActive: checked
            }, {
                showLoader: true,
                showToaster: true
            })
            if (res.status) {
                getManageUser()
            }
            console.log(res);
        }

    }

    const handleDelete = async () => {
        if (ids.length == 0) {
            alert("Please Select Records")
            return
        }
        if (confirm("Are You Want To Delete User ?")) {

            const res = await apiRequest("DELETE", API_ROUTES.user.userDelete, { userIds: ids }, null, {
                showLoader: true,
                showToaster: true
            })
            if (res.status) {
                getManageUser()
                setids([])
            }
        }

    }

    const exportData = async () => {
        const res = await apiRequest("POST", API_ROUTES.user.userExport, { page, pageSize }, null, {
            showLoader: true
        })
    }
    useEffect(() => {
        getManageUser()
    }, [page, pageSize, customSearch])

    const handleSearchSubmit = (searchValue) => {
        setcustomSearch(searchValue)
    }

    return (
        <div className="container-fluid">
            <div className="tabbar-section">
                <div className="row align-items-center gap-3">
                    <div className="col-12 col-lg-auto">
                        <SerachFilter
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onSubmit={handleSearchSubmit}
                        />
                    </div>
                    <div className="col-12 col-lg">
                        <div className="btn-list d-flex justify-content-lg-end flex-wrap gap-2 gap-md-3 text-end">
                            {
                                ids.length >= 1
                                &&

                                <Link
                                    href="javascript:void(0);"
                                    className="btn main-btn border-btn danger-btn"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Link>
                            }
                            <a
                                href="javascript:void(0);"
                                className="btn main-btn border-btn blue-btn"
                            >
                                Import
                            </a>
                            <button
                                onClick={exportData}
                                className="btn main-btn border-btn sky-btn"
                            >
                                Export
                            </button>
                            <Link
                                to={'/admin/user/add'}
                                className="btn main-btn border-btn blue-btn"
                            >
                                Add Users
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mt-3 mt-xxl-4">
                        <div className="table-responsive">
                            <table className="table">
                                <thead className="table-dark">
                                    <tr>
                                        <th>

                                        </th>
                                        <th>Action</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Role</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        manageUserData.map((value, index) => {
                                            return (
                                                <tr key={value.id}>
                                                    <td>
                                                        <label className="custom-checkbox">
                                                            <input onChange={handleChange} value={value.id} type="checkbox" className="child-checkbox" />
                                                            <span className="checkmark" />
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <span className="d-flex gap-2 align-items-center">
                                                            <Link
                                                                to={`/admin/user/edit/${value.id}`}
                                                                className="small-square-btn edit-btn"

                                                            >
                                                                <i className="demo-icon icon-edit-1" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(value.id)}
                                                                className="small-square-btn danger-btn"
                                                                href="javascript:void(0);"
                                                            >
                                                                <i className="demo-icon icon-delete-1" />
                                                            </button>
                                                        </span>
                                                    </td>
                                                    <td>{value.firstName}</td>
                                                    <td>{value.lastName}</td>
                                                    <td>{value.roleName}</td>
                                                    <td>{value.contactNumber}</td>
                                                    <td>{value.email}</td>
                                                    <td>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={value.isActive}

                                                                onChange={(e) => handleStatusChange(value.id, e.target.checked)}
                                                            />
                                                            <label
                                                                className="form-check-label"

                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
