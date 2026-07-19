/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../../../services/Api'
import { API_ROUTES } from '../../../../routes/api.routes'
import RoleRow from '../../components/RoleRow'
import { Grid, GridColumn } from '@progress/kendo-react-grid'
const RoleActionCell = (props) => {
    const item = props.dataItem;

    return (
        <td {...props.tdProps}>
            <div className="d-flex gap-2 align-items-center">

                <Link
                    to={`/admin/role-and-permission/edit/${item.id}`}
                    className="small-square-btn edit-btn"
                >
                    <i className="demo-icon icon-edit-1" />
                </Link>

                <button
                    type="button"
                    className="small-square-btn danger-btn border-0"
                    onClick={() => props.onDelete(item.id)}
                >
                    <i className="demo-icon icon-delete-1" />
                </button>

            </div>
        </td>
    );
};
const RoleStatusCell = (props) => {
    const item = props.dataItem;

    return (
        <td {...props.tdProps}>
            <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={item.isActive}
                    onChange={(e) =>
                        props.onToggle(item.id, e.target.checked)
                    }
                />
                <label className="form-check-label"></label>
            </div>
        </td>
    );
};
export default function RoleAndPermission() {
    const [roleData, setroleData] = useState([])
    const [customSearch, setcustomSearch] = useState("")
    const [total, setTotal] = useState(0)
    const [dataState, setDataState] = useState({ skip: 0, take: 10 })
    const [kendoSort, setKendoSort] = useState([])
    const [sort, setsort] = useState([])
    const getRole = async () => {
        const page = Math.floor(dataState.skip / dataState.take) + 1
        const payload = {
            page,
            pageSize: dataState.take,
            customSearch,
            Sorts: sort,
        }
        const res = await apiRequest("POST", API_ROUTES.role.roleList, payload, null, {
            showLoader: true,
        })
        setroleData(res.data.data)
        setTotal(res.data.data.totalRecord || 0)
    }
    const handleRoleDelete = async (id) => {
        if (confirm("Are You Want To Delete Role ?")) {

            const res = await apiRequest("DELETE", API_ROUTES.role.roleDelete(id), null, null, {
                showLoader: true,
                showToaster: true
            })
            if (res.status) {
                getRole()
            }
        }

    }
    const handleToggle = async (id, checked) => {
        console.log(id, checked);
        const checkedValue = Boolean(checked)
        const payload = {
            isActive: checkedValue,
        };
        console.log(typeof checked);

        if (confirm("Are You Want To Update Status ?")) {
            const res = await apiRequest("PUT", API_ROUTES.role.roleStatusEdit(id), payload, null, {
                showToaster: true,
                showLoader: true
            })
            console.log(res);

            if (res.status) {
                getRole()
            }
        }
    }
    // fetch on mount and when paging, sorting or search changes
    useEffect(() => {
        getRole()
    }, [customSearch, dataState.skip, dataState.take, sort])

    return (
        <div className="container-fluid">
            <div className="col mb-3">
                <h2 className="page-title">Role & Permission</h2>
            </div>
            <div className="tabbar-section">
                <div className="row align-items-center gap-3">
                    <div className="col-12 col-lg-auto">
                        <form className="d-md-flex searchbar align-items-center" role="search">
                            <input
                                className="form-control search-input"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                onChange={(e) => setcustomSearch(e.target.value)}
                            />
                            <button
                                className="btn btn-outline-primary search-toggle"
                                type="button"
                            >
                                <i className="demo-icon icon-search" />
                            </button>
                        </form>
                    </div>
                    <div className="col-12 col-lg">
                        <div className="btn-list d-flex justify-content-lg-end flex-wrap gap-2 gap-md-3 text-end">

                            <Link
                                to="/admin/role-and-permission/add"
                                className="btn main-btn border-btn blue-btn"
                                style={{
                                    background: "linear-gradient(90deg, rgb(193, 39, 45) 0%, rgb(0 0 0 / 92%) 100%)",
                                    color: "white"
                                }}
                            >
                                Add
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mt-3 mt-xxl-4">
                        <div className="table-responsive">
                            <Grid
                                className="table-wrapper"
                                data={roleData}
                                total={total}

                                skip={dataState.skip}
                                take={dataState.take}

                                sortable={{ allowUnsort: true, mode: 'single' }}

                                sort={kendoSort}

                                pageable={{
                                    buttonCount: 5,
                                    pageSizes: [10, 20, 50],
                                    previousNext: true,
                                    info: true,
                                    type: "numeric"
                                }}
                                {...dataState}
                                onDataStateChange={(e) => {
                                    setDataState(e.dataState)
                                    const nextSort = e.dataState.sort || []
                                    setKendoSort(nextSort)
                                    if (nextSort.length > 0) {
                                        setsort([
                                            { field: nextSort[0].field, direction: nextSort[0].dir === 'asc' ? 0 : 1 }
                                        ])
                                    } else {
                                        setsort([])
                                    }
                                }}
                            >

                                <GridColumn
                                    title="Action"
                                    width="120px"
                                    cells={{
                                        data: (props) => (
                                            <RoleActionCell
                                                {...props}
                                                onDelete={handleRoleDelete}
                                            />
                                        )
                                    }}
                                />

                                <GridColumn
                                    field="role"
                                    title="Role Name"
                                    width={"320px"}
                                />

                                <GridColumn
                                    field="description"
                                    title="Description"
                                    width="500px"
                                />

                                <GridColumn
                                    field="noOfUser"
                                    title="No. of Users"
                                    width="190px"
                                />

                                <GridColumn
                                    field='isActive'
                                    title="Status"
                                    width="107px"
                                    cells={{
                                        data: (props) => (
                                            <RoleStatusCell
                                                {...props}
                                                onToggle={handleToggle}
                                            />
                                        )
                                    }}
                                />

                            </Grid>
                            {/* <table className="table">
                                <thead className="table-dark">
                                    <tr>

                                        <th style={{ width: "100px" }}>Action</th>
                                        <th>Role Name</th>
                                        <th style={{ width: "500px" }}>Description</th>
                                        <th>No. of Users</th>
                                        <th>Status</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        roleData.map((value, index) => <RoleRow key={value.id}
                                            value={value}
                                            onDelete={handleRoleDelete}
                                            onToggle={handleToggle}
                                        />)
                                    }


                                </tbody>
                            </table> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
