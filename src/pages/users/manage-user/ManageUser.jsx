import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../../services/Api'
import { API_ROUTES } from '../../../routes/api.routes'
import SerachFilter from '../../../components/common/SerachFilter'
import useGridPagination from '../../../hooks/useGridPagination'
import { usePermission } from '../../../hooks/UsePermission'
import { MENU } from '../../../data/Menu'
import useUserPermission from '../../../utils/UserPermission'

export default function ManageUser() {
    const [manageUserData, setmanageUserData] = useState([])
    const [ids, setids] = useState([])
    const [searchText, setSearchText] = useState("")
    const [customSearch, setcustomSearch] = useState("")
    const { page, pageSize, resetPage } = useGridPagination(10)
    // const permission = usePermission()
    // console.log(permission);
    // const manageUserPermission = permission.find((value, index) => value.menuId === MENU.USER)
    // console.log(manageUserPermission);

    const { userPermission: manageUserPermission } = useUserPermission()
    console.log(manageUserPermission);
    
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
        <>
            {
                manageUserPermission?.canRead
                &&
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
                                        manageUserPermission.canDelete
                                        &&
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

                                    <button
                                        onClick={exportData}
                                        className="btn main-btn border-btn sky-btn"
                                    >
                                        Export
                                    </button>
                                    {
                                        manageUserPermission.canCreate
                                        &&

                                        <Link
                                            to={'/admin/user/add'}
                                            className="btn main-btn border-btn blue-btn"
                                        >
                                            Add Users
                                        </Link>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 mt-3 mt-xxl-4">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className="table-dark">
                                            <tr>
                                                {manageUserPermission?.canDelete && <th></th>}

                                                {(manageUserPermission?.canUpdate ||
                                                    manageUserPermission?.canDelete) && (
                                                        <th>Action</th>
                                                    )}

                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Role</th>
                                                <th>Phone</th>
                                                <th>Email</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {manageUserData?.length > 0 ? (
                                                manageUserData.map((value) => (
                                                    <tr key={value.id}>
                                                        {manageUserPermission?.canDelete && (
                                                            <td>
                                                                <label className="custom-checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="child-checkbox"
                                                                        value={value.id}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </td>
                                                        )}

                                                        {(manageUserPermission?.canUpdate ||
                                                            manageUserPermission?.canDelete) && (
                                                                <td>
                                                                    <span className="d-flex gap-2 align-items-center">
                                                                        {manageUserPermission?.canUpdate && (
                                                                            <Link
                                                                                to={`/admin/user/edit/${value.id}`}
                                                                                className="small-square-btn edit-btn"
                                                                            >
                                                                                <i className="demo-icon icon-edit-1" />
                                                                            </Link>
                                                                        )}

                                                                        {manageUserPermission?.canDelete && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleDelete(value.id)}
                                                                                className="small-square-btn danger-btn"
                                                                            >
                                                                                <i className="demo-icon icon-delete-1" />
                                                                            </button>
                                                                        )}
                                                                    </span>
                                                                </td>
                                                            )}

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
                                                                    disabled={!manageUserPermission?.canUpdate}
                                                                    checked={value.isActive}
                                                                    onChange={(e) =>
                                                                        handleStatusChange(value.id, e.target.checked)
                                                                    }
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={manageUserPermission?.canDelete ? 8 : 7}
                                                        className="text-center"
                                                    >
                                                        No users found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>

    )
}
