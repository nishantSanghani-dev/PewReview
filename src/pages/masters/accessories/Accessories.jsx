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
import AccessoriesAdd from './AccessoriesAdd';
import BreadCumb from '../../../components/common/breadCumb/BreadCumb';
import SerachFilter from '../../../components/common/SerachFilter';
import useGridPagination from '../../../hooks/useGridPagination'
import { usePermission } from '../../../hooks/UsePermission'
import { MENU } from '../../../data/Menu'
import useUserPermission from '../../../utils/UserPermission'
const ActionCell = (props) => {
    const item = props.dataItem;


    return (
        <td {...props.tdProps}>
            <span className="d-flex gap-2 align-items-center">
                {
                    props.accessoriesPermission.canUpdate
                    &&

                    <button
                        onClick={() => {
                            props.setisAccessoriesOpen(true)
                            props.setid(item.accessoryId || item.id)
                        }}

                        className="small-square-btn edit-btn"

                    >
                        <i className="demo-icon icon-edit-1" />
                    </button>
                }
                {
                    props.accessoriesPermission.canDelete
                    &&

                    <button
                        onClick={() => handleDelete(item.accessoryId, "accessories", "accessoroesDelete", props.getAccessories)}
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
const StatusCell = (props) => {
    return (
        <td {...props.tdProps}>
            <div className="form-check form-switch mb-0">
                <input
                    className="form-check-input"
                    type="checkbox"
                    disabled={![props.accessoriesPermission.canUpdate]}
                    checked={props.dataItem.isActive}
                    readOnly
                    onChange={(e) => handleStatusChange(props.dataItem.accessoryId, e.target.checked, "accessories", "accessoriesStatusUpdate", props.getAccessories)}
                />
                <label className="form-check-label"></label>
            </div>
        </td>
    );
};
const TextCell = ({ tdProps, dataItem, field }) => (
    <td {...tdProps}>

        {dataItem[field] ?? "-"}
    </td>
);
export default function Accessories() {
    const [accessoriesData, setaccessoriesData] = useState([])
    const [isAccessoriesOpen, setisAccessoriesOpen] = useState(false)
    const [id, setid] = useState(null)
    const [searchText, setSearchText] = useState("")
    const [customSearch, setcustomSearch] = useState("")
    const [filters, setFilters] = useState([])
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

    // const permission = usePermission()
    // const accessoriesPermission = permission.find((value, index) => value.menuId === MENU.ACCESSORY)

    const { accessoryPermission: accessoriesPermission } = useUserPermission()
    const getAccessories = async () => {
        const res = await apiRequest("POST", API_ROUTES.accessories.getaccessories, { page, pageSize, customSearch, Sorts: sort, Filters: filters }, null, {
            showLoader: true
        })
        setaccessoriesData(res.data.data)

    }

    const accessoriesColumn = [

        ...(accessoriesPermission?.canUpdate || accessoriesPermission?.canDelete
            ? [
                { field: "action", title: "Action", cell: ActionCell, width: "100px" },
            ]
            : []),
        { field: "accessoryName", title: "Name", width: "180px", filter: "text", columnMenu: ColumnMenu },
        { field: "accessoryCategory", title: "Category", filter: "text", columnMenu: ColumnMenu },
        { field: "gunNames", title: "Gun", filter: "text", columnMenu: ColumnMenu },
        { field: "description", title: "Description", width: "180px", filter: "text", columnMenu: ColumnMenu },
        { field: "createdByUserName", title: "CreatedBy", filter: "text", columnMenu: ColumnMenu },
        { field: "createdAt", title: "CreatedAt", cell: DateCell, filter: "text", columnMenu: ColumnMenu },
        { field: "modifiedBy", title: "Modified By", width: "120px", filter: "text", columnMenu: ColumnMenu },
        { field: "isActive", title: "status", cell: StatusCell, width: "80px", filter: "boolean", columnMenu: ColumnMenu }
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
        getAccessories()
    }, [page, pageSize, customSearch, sort, filters])
    return (
        <>

            <div className="container-fluid">
                <div className="mb-3 activity-breadcrumb">
                    <span style={{ color: "#666766" }} className="fw-bold">Masters</span>
                    <span className="mx-2 text-dark">/</span>
                    <span className="fw-bold text-dark">Accessories Master</span>
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
                            accessoriesPermission.canCreate
                            &&

                            <div className="col-12 col-lg">
                                <div className="btn-list d-flex justify-content-lg-end flex-wrap gap-2 gap-md-3 text-end">

                                    <button
                                        onClick={() => {
                                            setid(null);
                                            setisAccessoriesOpen(true);
                                        }}
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
                                    data={accessoriesData}
                                    skip={dataState.skip}
                                    take={dataState.take}

                                    filter={dataState.filter}
                                    filterOperators={{
                                        text: [{ text: 'grid.filterContainsOperator', operator: 'contains' }],
                                        numeric: [{ text: 'grid.filterEqOperator', operator: 'eq' }],
                                        boolean: [{ text: 'grid.filterEqOperator', operator: 'eq' }]
                                    }}
                                    columnMenuIcon={filterIcon}
                                    sortable={{ allowUnsort: true, mode: 'single' }}
                                    sort={kendoSort}
                                    pageable={{
                                        buttonCount: 5,
                                        pageSizes: [10, 20, 50],
                                        previousNext: true,
                                        info: true,
                                        type: "numeric"
                                    }}
                                    onDataStateChange={handleGridDataStateChange}
                                >
                                    {
                                        accessoriesColumn?.map((col, ind) => {
                                            return (
                                                <GridColumn
                                                    key={col.field}
                                                    field={col.field}
                                                    title={col.title}
                                                    width={col.width || "150px"}
                                                    sortable={col.field === 'action' ? false : true}
                                                    pageable={{
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
                                                                        accessoriesPermission={accessoriesPermission}
                                                                        getAccessories={getAccessories}
                                                                        setisAccessoriesOpen={setisAccessoriesOpen}
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
            </div>

            {
                isAccessoriesOpen
                &&
                <AccessoriesAdd
                    id={id}
                    setid={setid}
                    isAccessoriesOpen={isAccessoriesOpen}
                    setisAccessoriesOpen={setisAccessoriesOpen}
                    getAccessories={getAccessories}
                />
            }
        </>
    )
}
