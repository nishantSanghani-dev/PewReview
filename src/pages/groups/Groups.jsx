import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../services/Api'
import { API_ROUTES } from '../../routes/api.routes'
import { Grid, GridColumn } from '@progress/kendo-react-grid'
import { Link } from 'react-router-dom';
import { DateCell } from '../activity/Activity';
import { handleStatusChange } from '../../utils/ChangeStatus';
import { handleDelete } from '../../utils/DeleteRecords';
import SerachFilter from '../../components/common/SerachFilter';
import useGridPagination from '../../hooks/useGridPagination'
import { useSelector } from 'react-redux';
import { MENU } from '../../data/Menu';
import { filterIcon } from '@progress/kendo-svg-icons'
import { ColumnMenu } from '../../components/grid/ColumnMenu'
import { getBackendFilters } from '../../components/grid/GridFilter'
import useUserPermission from '../../utils/UserPermission';
import { Tooltip } from '@progress/kendo-react-tooltip';
const ActionCell = (props) => {

    return (
        <td {...props.tdProps}>
            <div className="d-flex gap-2 align-items-center">

                <Link to={`/admin/groups/view/${props.dataItem.id}`}

                    className="small-square-btn edit-btn"
                >
                    <i className="demo-icon icon-eye-line"></i>
                </Link>
                {
                    props.grpPermission.canDelete
                    &&

                    <button
                        onClick={() => handleDelete(props.dataItem.id, "groups", "groupDelete", props.getGroups)}
                        className="small-square-btn danger-btn"
                    >
                        <i className="demo-icon icon-delete-1"></i>
                    </button>
                }
            </div>
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
const GroupTypeCell = ({ tdProps, dataItem, field }) => (
    <td {...tdProps}>
        {
            dataItem.isPublic
                ?
                "Public"
                :
                "Private"
        }

    </td>
);
const ImageCell = (props) => {
    return (
        <td {...props.tdProps}>
            {props.dataItem.groupImageFullUrl ? (
                <img
                    src={props.dataItem.groupImageFullUrl}
                    alt="Gun"
                    className="gun-img"
                />
            ) : (
                <span></span>
            )}
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
                    checked={props.dataItem.isActive}
                    readOnly
                    disabled={!props.grpPermission.canUpdate}
                    onChange={(e) =>
                        handleStatusChange(
                            props.dataItem.id,
                            e.target.checked,
                            "groups",
                            "groupUpdateStatus",

                            props.getGroups // callback

                        )
                    }
                />
                <label className="form-check-label"></label>
            </div>
        </td>
    );
};
const UserNameCell = ({ tdProps, dataItem, field, endUserPermission }) => {
    // const checkEndUperPermission = permissions.find((value, index) => value.menuId === MENU.END_USER)
    return (
        <td {...tdProps}>
            {
                endUserPermission?.canRead
                    ?
                    <Link className='text-primary' to={`/admin/manage-end-user/view/${dataItem.createdBy}`}>
                        {dataItem.userName}
                    </Link>
                    :
                    <span>
                        {dataItem.userName}
                    </span>
            }

        </td>
    )
}

const MemberCell = ({ tdProps, dataItem, field, endUserPermission }) => {

    // const endUserPermission = permissions.find((value, index) => value.menuId === MENU.END_USER)
    return (
        <td {...tdProps}>
            {
                endUserPermission?.canRead
                    ?
                    <Link className='text-primary text-decoration-underline' to={`/admin/groups/view/${dataItem?.id}/members`} >
                        {dataItem?.totalMember}
                    </Link>
                    :
                    <spam  >
                        {dataItem?.totalMember}
                    </spam>
            }

        </td>
    )
}

const AvtivityCell = ({ tdProps, dataItem, field, activityPermission }) => {
    // const activityPermission = permissions.find((value, index) => value.menuId === MENU.ACTIVITY)
    return (
        <td {...tdProps}>
            {
                activityPermission?.canRead
                    ?
                    <Link
                        className="text-primary text-decoration-underline"
                        to={`/admin/groups/activity/${dataItem?.id}`}>
                        {dataItem?.totalActivity}
                    </Link>
                    :
                    <p>
                        {dataItem?.totalActivity}
                    </p>
            }

        </td>
    )
}
export default function Groups() {

    const [groupData, setgroupData] = useState([])
    const [searchText, setSearchText] = useState("")
    const [customSearch, setcustomSearch] = useState("")
    const [filter, setFilter] = useState(null)
    const [totalRecords, settotalRecords] = useState(null)
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

    const { permissions } = useSelector((store) => store.user)
    console.log(permissions);
    // const grpPermission = permissions.find((value, index) => value.menuId === MENU.GROUP)
    // console.log(grpPermission);
    const { groupPermission: grpPermission, endUserPermission,activityPermission } = useUserPermission()
    const getGroups = async () => {
        const res = await apiRequest("POST", API_ROUTES.groups.getGroups, { page, pageSize, customSearch, Sorts: sort, Filters: filters }, null, {
            showLoader: true
        })
        setgroupData(res.data.data)
        settotalRecords(res.data.totalRecord)
    }
    const groupColumns = [
        { field: "action", title: "Action", cell: ActionCell, width: "130px", filterable: false },
        { field: "groupName", title: "Group Name", filter: "text", columnMenu: ColumnMenu },
        { field: "groupImageFullUrl", title: "Group Image", cell: ImageCell, width: "130px", filterable: false },
        { field: "about", title: "About Group", filter: "text", columnMenu: ColumnMenu },
        { field: "isPublic", title: "Group Types", cell: GroupTypeCell, filter: "boolean" },
        { field: "totalMember", title: "Members", cell: MemberCell, filter: "numeric", columnMenu: ColumnMenu },
        { field: "totalActivity", title: "Activities", cell: AvtivityCell, filter: "numeric", columnMenu: ColumnMenu },
        { field: "totalReport", title: "Reported", filter: "numeric", columnMenu: ColumnMenu },
        { field: "userName", title: "Created By", cell: UserNameCell, filter: "text", columnMenu: ColumnMenu },
        { field: "createdOn", title: "createdOn", cell: DateCell, filterable: false },
        { field: "isActive", title: "Status", cell: StatusCell, filter: "boolean" },
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
        getGroups()
    }, [page, pageSize, customSearch, sort, filters])

    return (
        <div className="container-fluid">
            <div className="page-heading">
                <div className="row align-items-center gap-2">
                    <div className="col">
                        <h2 className="page-title">Groups</h2>
                    </div>


                </div>
                <div className='mt-4' style={{ width: "230px" }}>
                    <SerachFilter
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onSubmit={(value) => {
                            resetPage()
                            setcustomSearch(value)
                        }}
                    />
                </div>
            </div>
            <div className="accordion-body mt-3 mt-xxl-4">
                <div className="row">
                    <div className="col-12">
                        <div className="">
                            {
                                grpPermission?.canRead
                                &&

                                <Grid
                                    className="table-wrapper  text-center"
                                    data={groupData}
                                    total={totalRecords}
                                    skip={dataState.skip}
                                    take={dataState.take}
                                    sortable={{ allowUnsort: true, mode: 'single' }}
                                    sort={kendoSort}

                                    filter={dataState.filter}
                                    filterOperators={{
                                        text: [{ text: 'grid.filterContainsOperator', operator: 'contains' }],
                                        numeric: [{ text: 'grid.filterEqOperator', operator: 'eq' }],
                                        boolean: [{ text: 'grid.filterEqOperator', operator: 'eq' }]
                                    }}
                                    columnMenuIcon={filterIcon}
                                    pageable={{
                                            responsive: false,
                                        buttonCount: 5,
                                        pageSizes: [10, 20, 50],
                                        info: true,
                                        previousNext: true,
                                        type: "numeric"
                                    }}
                                    onDataStateChange={handleGridDataStateChange}

                                >
                                    {groupColumns.map((col) => (
                                        <GridColumn
                                            key={col.field}
                                            total={totalRecords}
                                            field={col.field}
                                            title={col.title}
                                            width={col.width || "150px"}
                                            sortable={col.field === 'action' || col.field == 'groupImageFullUrl' ? false : true}
                                            filterable={col.filter !== false}
                                            filter={col.filter}
                                            columnMenu={col.columnMenu ? ColumnMenu : undefined}
                                            cells={
                                                col.cell
                                                    ? {
                                                        data: (props) => (
                                                            <col.cell
                                                                {...props}
                                                                grpPermission={grpPermission}
                                                                getGroups={getGroups}
                                                                endUserPermission={endUserPermission}
                                                                activityPermission={activityPermission}
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
                                    ))}
                                </Grid>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
