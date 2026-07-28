import React, { useEffect, useState } from 'react'
import { Grid, GridColumn } from "@progress/kendo-react-grid"
import { apiRequest } from '../../../services/Api'
import { API_ROUTES } from '../../../routes/api.routes'
import { Link } from 'react-router-dom'
import { handleDelete } from '../../../utils/DeleteRecords'

export default function EndUser() {
    const [manageUserData, setmanageUserData] = useState([])
    const [total, setTotal] = useState(0);
    const [dataState, setDataState] = useState({
        skip: 0,
        take: 10,
    });
    const [kendoSort, setKendoSort] = useState([]);
    const [sort, setsort] = useState([]);

    const getManageEndUser = async () => {
        try {
            const page = Math.floor(dataState.skip / dataState.take) + 1;

            const payload = {
                page,
                pageSize: dataState.take,
                Sorts: sort
            };

            const res = await apiRequest(
                "POST",
                API_ROUTES.endUser.endUserView,
                payload,
                null,
                {
                    showLoader: true
                }
            );

            setmanageUserData(res.data.data);
            setTotal(res.data.data.totalRecord);

        } catch (err) {
            console.log(err);
        }
    };
    const CheckboxCell = (props) => {
        return (
            <td {...props.tdProps} className="text-center">
                <label className="custom-checkbox mb-0">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                </label>
            </td>
        );
    };
    const ActionCell = (props) => {
        const item = props.dataItem;


        return (
            <td {...props.tdProps}>
                <span className="d-flex gap-2 align-items-center">

                    <Link
                        to={`/admin/manage-end-user/view/${item.id}`}
                        className="small-square-btn edit-btn"
                    >
                        <i className="demo-icon icon-eye-line" />
                    </Link>

                    <button
                        onClick={() => handleDelete(item.id, "endUser", "endUserDelete", getManageEndUser)}
                        type="button"
                        className="small-square-btn danger-btn"
                    >
                        <i className="demo-icon icon-delete-1" />
                    </button>

                    <label className="verify-switch">
                        <input
                            type="checkbox"
                            defaultChecked={item.isVerify}
                        />

                        <span className="verify-slider">
                            <span className="verify-text">
                                {item.isVerify ? "Enabled" : "Verified"}
                            </span>
                        </span>
                    </label>

                </span>
            </td>
        );
    };
    const StatusCell = (props) => {
        const item = props.dataItem;

        return (
            <td {...props.tdProps}>
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={item.isActive}
                        readOnly
                    />
                </div>
            </td>
        );
    };
    const ContactCell = (props) => {
        return (
            <td {...props.tdProps}>
                {props.dataItem.contactNumber || "-"}
            </td>
        );
    };
    // fetch on mount and whenever paging or sort (API payload) changes
    useEffect(() => {
        getManageEndUser()
    }, [dataState.skip, dataState.take, sort])
    return (
        <div className="container-fluid">
            <div className="col mb-3">
                <h2 className="page-title">Manage End Users</h2>
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

                            <a
                                href="javascript:void(0);"
                                className="btn main-btn border-btn sky-btn"
                            >
                                Export
                            </a>

                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mt-3 mt-xxl-4">
                        <div className="table-responsive">
                            <Grid
                                className="table-wrapper"
                                tableProps={{ className: "table" }}

                                data={manageUserData}
                                total={total}

                                skip={dataState.skip}
                                take={dataState.take}

                                sortable={{
                                    allowUnsort: true,
                                    mode: "single"
                                }}

                                sort={kendoSort}

                                pageable={{
                                    buttonCount: 4,
                                    pageSizes: [10, 20, 50],
                                    previousNext: true,
                                    info: true,
                                    type: "numeric"
                                }}

                                onDataStateChange={(e) => {

                                    setDataState({
                                        skip: e.dataState.skip,
                                        take: e.dataState.take
                                    });

                                    const nextSort = e.dataState.sort || [];

                                    setKendoSort(nextSort);

                                    if (nextSort.length > 0) {

                                        setsort([
                                            {
                                                field: nextSort[0].field,
                                                direction: nextSort[0].dir === "asc" ? 0 : 1
                                            }
                                        ]);

                                    } else {

                                        setsort([]);

                                    }

                                }}
                            >

                                <GridColumn
                                    title=""
                                    sortable={false}
                                    filterable={false}
                                    width="70px"
                                    cells={{ data: CheckboxCell }}
                                />

                                <GridColumn
                                    title="Action"
                                    sortable={false}
                                    filterable={false}
                                    width="180px"
                                    cells={{ data: ActionCell }}
                                />

                                <GridColumn
                                    field="firstName"
                                    title="First Name"
                                />

                                <GridColumn
                                    field="lastName"
                                    title="Last Name"
                                />

                                <GridColumn
                                    field="userName"
                                    title="Username"
                                />

                                <GridColumn
                                    field="contactNumber"
                                    title="Phone"
                                    cells={{ data: ContactCell }}
                                />

                                <GridColumn
                                    field="email"
                                    title="Email"
                                />

                                <GridColumn
                                    field="isActive"
                                    title="Status"
                                    width="120px"
                                    sortable={true}
                                    cells={{ data: StatusCell }}
                                />

                            </Grid>

                        </div>
                    </div>
                </div>
            </div>
        </div>



    )
}
