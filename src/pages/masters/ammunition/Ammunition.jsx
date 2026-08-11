import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../../services/Api'
import { API_ROUTES } from '../../../routes/api.routes'
import { Grid, GridColumn } from '@progress/kendo-react-grid'
import { filterIcon } from '@progress/kendo-svg-icons'
import { ColumnMenu } from '../../../components/grid/ColumnMenu'
import { getBackendFilters } from '../../../components/grid/GridFilter'
import { DateCell } from '../../activity/Activity';
import { handleStatusChange } from '../../../utils/ChangeStatus';
import { handleDelete } from '../../../utils/DeleteRecords';
import AmmunitionAdd from './AmmunitionAdd';
import BreadCumb from '../../../components/common/breadCumb/BreadCumb';
import SerachFilter from '../../../components/common/SerachFilter';
import useGridPagination from '../../../hooks/useGridPagination'
import { usePermission } from '../../../hooks/UsePermission'
import { MENU } from '../../../data/Menu'
import useUserPermission from '../../../utils/UserPermission'
import { Tooltip } from '@progress/kendo-react-tooltip';
const ActionCell = (props) => {
    const item = props.dataItem;


    return (
        <td {...props.tdProps}>
            <span className="d-flex gap-2 align-items-center">
                {
                    props.ammunitionPermission.canUpdate
                    &&

                    <button
                        onClick={() => {
                            props.setisAmmunitionOpen(true)
                            props.setid(item.id)
                        }}

                        className="small-square-btn edit-btn"

                    >
                        <i className="demo-icon icon-edit-1" />
                    </button>
                }
                {
                    props.ammunitionPermission.canDelete
                    &&

                    <button
                        onClick={() => handleDelete(item.id, "ammunition", "ammunitionDelete", props.getAmmunition)}
                        type="button"
                        className="small-square-btn danger-btn"
                    >
                        <i className="demo-icon icon-delete-1" />
                    </button>
                }


            </span>
        </td>
    );
};
const TextCell = ({ tdProps, dataItem, field }) => {
    const value = dataItem[field];

    return (
        <td {...tdProps}>
            <Tooltip anchorElement="target" position="top">
                <span
                    title={value}
                    style={{
                        display: "inline-block",
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {value ?? '-'}
                </span>
            </Tooltip>
        </td>
    );
};
const StatusCell = (props) => {
    return (
        <td {...props.tdProps}>
            <div className="form-check form-switch mb-0">
                <input
                    disabled={!props.ammunitionPermission.canUpdate}
                    className="form-check-input"
                    type="checkbox"
                    checked={props.dataItem.isActive}
                    readOnly
                    onChange={(e) => handleStatusChange(props.dataItem.id, e.target.checked, "ammunition", "ammunitionStatusUpdate", props.getAmmunition)}
                />
                <label className="form-check-label"></label>
            </div>
        </td>
    );
};
export default function Ammunition() {
    const [ammunitionData, setammunitionData] = useState([])
    const [isAmmunitionOpen, setisAmmunitionOpen] = useState(false)
    const [id, setid] = useState(null)
    const [searchText, setSearchText] = useState("")
    const [customSearch, setcustomSearch] = useState("")
    const [filters, setFilters] = useState([])
    // const permission = usePermission()
    // const ammunitionPermission = permission.find((value, index) => value.menuId === MENU.AMMUNITION)
    const { ammunitionPermission } = useUserPermission()
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
    const getAmmunition = async () => {
        const res = await apiRequest("POST", API_ROUTES.ammunition.getammunition, { page, pageSize, customSearch, Sorts: sort, Filters: filters }, null, {
            showLoader: true
        })
        setammunitionData(res.data.data)
    }

    const ammunitionColumns = [
        ...(ammunitionPermission?.canUpdate || ammunitionPermission?.canDelete
            ? [
                { field: "action", title: "Action", cell: ActionCell, width: "100px" },
            ]
            : []),


        // { field: "action", title: "Action", cell: ActionCell, width: "100px" },
        { field: "name", title: "Ammunition Name", filter: "text", columnMenu: ColumnMenu },
        { field: "categories", title: "Category Name", width: "180px", filter: "text", columnMenu: ColumnMenu },
        { field: "manufacturer", title: "Manufacturer Name", filter: "text", columnMenu: ColumnMenu },
        { field: "description", title: "Description", filter: "text", columnMenu: ColumnMenu },
        { field: "createdByUserName", title: "Created By", filter: "text", columnMenu: ColumnMenu },
        { field: "updatedOn", title: "Creadted On", cell: DateCell, filter: "text", columnMenu: ColumnMenu },
        { field: "updatedByUserName", title: "Modified By", filter: "text", columnMenu: ColumnMenu },
        { field: "isActive", title: "Status", cell: StatusCell, filter: "boolean", columnMenu: ColumnMenu }
    ]
    const handleGridDataStateChange = (event) => {
        onDataStateChange(event)
        setKendoSort(event.dataState?.sort || [])
        const nextFilter = event.dataState?.filter
        if (nextFilter) {
            setFilters(getBackendFilters(nextFilter))
        } else {
            setFilters([])
        }
    }

    useEffect(() => {
        getAmmunition()
    }, [page, pageSize, customSearch, sort, filters])
    return (
        <div className="container-fluid">
            <div className="mb-3 activity-breadcrumb">
                <span style={{ color: "#666766" }} className="fw-bold">Masters</span>
                <span className="mx-2 text-dark">/</span>
                <span className="fw-bold text-dark">Ammunition Master</span>
            </div>
            <div className="tabbar-section">
                <div className="row align-items-center gap-3">
                    <div className="col-12 col-lg-auto">
                        <SerachFilter
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onSubmit={(value) => setcustomSearch(value)}
                        />
                    </div>
                    {
                        ammunitionPermission.canCreate
                        &&

                        <div className="col-12 col-lg">
                            <div className="btn-list d-flex justify-content-lg-end flex-wrap gap-2 gap-md-3 text-end">

                                <button
                                    onClick={() => setisAmmunitionOpen(true)}
                                    className="btn main-btn border-btn blue-btn"
                                    style={{
                                        background: "linear-gradient(90deg, rgb(193, 39, 45) 0%, rgb(0 0 0 / 92%) 100%)",
                                        color: "white"
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    }
                </div>
                <div className="row">
                    <div className="col-12 mt-3 mt-xxl-4">
                        <div className="table-responsive">
                            <Grid
                                className="table-wrapper"
                                data={ammunitionData}
                                skip={dataState.skip}
                                take={dataState.take}
                                sortable={{ allowUnsort: true, mode: 'single' }}
                                sort={kendoSort}
                                columnMenuIcon={filterIcon}
                                pageable={{
                                            responsive: false,
                                    buttonCount: 5,
                                    pageSizes: [10, 20, 50],
                                    previousNext: true,
                                    info: true,
                                    type: "numeric"
                                }}
                                onDataStateChange={handleGridDataStateChange}
                            >
                                {
                                    ammunitionColumns?.map((col, ind) => {
                                        return (
                                            <GridColumn
                                                key={col.field}
                                                field={col.field}
                                                title={col.title}
                                                width={col.width}
                                                sortable={col.field === 'action' ? false : true}
                                                pageable={{
                                            responsive: false,
                                                    buttonCount: 4,
                                                    pageSizes: [20, 50, 200],
                                                    previousNext: true,
                                                    info: true,
                                                    type: "numeric"
                                                }}
                                                cells={
                                                    col.cell
                                                        ? {
                                                            data: (props) => (
                                                                <col.cell
                                                                    {...props}
                                                                    ammunitionPermission={ammunitionPermission}
                                                                    getAmmunition={getAmmunition}
                                                                    setisAmmunitionOpen={setisAmmunitionOpen}
                                                                    setid={setid}
                                                                />
                                                            )
                                                        }
                                                        : {
                                                            data: (props) => (
                                                                <TextCell {...props} field={col.field} />
                                                            )
                                                        }
                                                }
                                            />
                                        )
                                    })
                                }

                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
            {
                isAmmunitionOpen
                &&
                <AmmunitionAdd
                    id={id}
                    setid={setid}
                    getAmmunition={getAmmunition}
                    isAmmunitionOpen={isAmmunitionOpen}
                    setisAmmunitionOpen={setisAmmunitionOpen}
                />
            }
        </div>
    )
}
