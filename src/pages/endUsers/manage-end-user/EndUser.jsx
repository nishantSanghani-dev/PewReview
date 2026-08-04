import React, { useEffect, useState } from 'react'
import { Grid, GridColumn } from "@progress/kendo-react-grid"
import { apiRequest } from '../../../services/Api'
import { API_ROUTES } from '../../../routes/api.routes'
import { Link } from 'react-router-dom'
import { handleDelete } from '../../../utils/DeleteRecords'
import SerachFilter from '../../../components/common/SerachFilter'
import useGridPagination from '../../../hooks/useGridPagination'
import { usePermission } from '../../../hooks/UsePermission'
import { MENU } from '../../../data/Menu'

export default function EndUser() {
    const [manageUserData, setmanageUserData] = useState([])
    const [total, setTotal] = useState(0);
    const {
        dataState,
        onDataStateChange,
        page,
        pageSize,
        resetPage,
        sort,
        kendoSort,
        setKendoSort,
    } = useGridPagination(10)
    const [searchText, setSearchText] = useState("");
    const [customSearch, setcustomSearch] = useState("");
    const permission = usePermission()
    const endUserPermission = permission.find((value, index) => value.menuId === MENU.END_USER)
    console.log(endUserPermission);


    const getManageEndUser = async () => {
        try {

            const payload = {
                page,
                pageSize,
                customSearch,
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
            setTotal(res.data.totalRecord);

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
                    {
                        props.endUserPermission.canRead
                        &&

                        <Link
                            to={`/admin/manage-end-user/view/${item.id}`}
                            className="small-square-btn edit-btn"
                        >
                            <i className="demo-icon icon-eye-line" />
                        </Link>
                    }

                    {
                        props.endUserPermission.canDelete
                        &&

                        <button
                            onClick={() => handleDelete(item.id, "endUser", "endUserDelete", getManageEndUser)}
                            type="button"
                            className="small-square-btn danger-btn"
                        >
                            <i className="demo-icon icon-delete-1" />
                        </button>
                    }

                    {
                        props.endUserPermission.canUpdate
                        &&

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
                    }


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
    const handleGridDataStateChange = (event) => {
        onDataStateChange(event)
        setKendoSort(event.dataState?.sort || [])
    }

    // fetch on mount and whenever paging, sort, or search changes
    useEffect(() => {
        getManageEndUser()
    }, [page, pageSize, customSearch, sort])
    return (
        <div className="container-fluid">
            <div className="col mb-3">
                <h2 className="page-title">Manage End Users</h2>
            </div>
            <div className="tabbar-section">
                <div className="row align-items-center gap-3">
                    <div className="col-12 col-lg-auto">
                        <SerachFilter
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onSubmit={(value) => {
                                resetPage()
                                setcustomSearch(value)
                            }}
                        />
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

                                onDataStateChange={handleGridDataStateChange}
                            >
                                {
                                    endUserPermission.canDelete
                                    &&

                                    <GridColumn
                                        title=""
                                        sortable={false}
                                        filterable={false}
                                        width="70px"
                                        cells={{ data: CheckboxCell }}
                                    />
                                }

                                <GridColumn
                                    title="Action"
                                    sortable={false}
                                    filterable={false}
                                    width="180px"
                                    cells={{
                                        data: (props) => (
                                            <ActionCell
                                                {...props}
                                                endUserPermission={endUserPermission}
                                            />
                                        ),
                                    }}

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
