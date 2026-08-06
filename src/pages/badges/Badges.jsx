import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../services/Api'
import { API_ROUTES } from '../../routes/api.routes'
import { Grid, GridColumn } from '@progress/kendo-react-grid'
import { filterIcon } from '@progress/kendo-svg-icons'
import { ColumnMenu } from '../../components/grid/ColumnMenu'
import { getBackendFilters } from '../../components/grid/GridFilter'
import BdagesAdd from './BdagesAdd'
import { handleDelete } from '../../utils/DeleteRecords'
import useGridPagination from '../../hooks/useGridPagination'
import { usePermission } from '../../hooks/UsePermission'
import { MENU } from '../../data/Menu'
const ActionCell = (props) => {


    return (
        <td {...props.tdProps}>
            <div className="d-flex gap-2 align-items-center">
                {
                    props.badgePermission.canUpdate
                    &&

                    <button
                        onClick={() => {
                            props.setid(props.dataItem.id)
                            props.setisBadgeOpen(true)
                        }}
                        href="javascript:void(0)"
                        className="small-square-btn edit-btn"

                    >
                        <i className="demo-icon icon-edit-1" />
                    </button>
                }
                {
                    props.badgePermission.canDelete
                    &&

                    <button
                        onClick={() => handleDelete(props.dataItem.id, "badges", "badgeDelete", props.getBadges)}

                        className="small-square-btn danger-btn"
                    >
                        <i className="demo-icon icon-delete-1"></i>
                    </button>
                }

            </div>
        </td>
    );
};
const TextCell = ({ tdProps, dataItem, field }) => (
    <td {...tdProps}>

        {dataItem[field] ?? "-"}
    </td>
);
const ImageCell = (props) => {
    return (
        <td {...props.tdProps}>
            {props.dataItem.imageFullPath ? (
                <img
                    src={props.dataItem.imageFullPath}
                    alt="Badge"
                    className="gun-img"
                />
            ) : null}
        </td>
    );
};
export default function Badges() {
    const [isBadgeOpen, setisBadgeOpen] = useState(false)
    const [badgesData, setbadgesData] = useState([])
    const [id, setid] = useState(null)
    const [filters, setFilters] = useState([])
    const { dataState, onDataStateChange, page, pageSize } = useGridPagination(10)
    const permission = usePermission()
    const badgePermission = permission.find((value, index) => value.menuId === MENU.BADGE)
    console.log(badgePermission);
    const getBadges = async () => {
        const res = await apiRequest("POST", API_ROUTES.badges.getBadges, { page, pageSize, Filters: filters }, null, {
            showLoader: true
        })

        setbadgesData(res.data.data)

    }

    const badgesColumns = [
        ...(badgePermission?.canUpdate || badgePermission?.canDelete
            ? [
                { field: "action", title: "Action", cell: ActionCell, width: "70px" },
            ]
            : []),
        { field: "imageName", title: "Images", cell: ImageCell, width: "80px" },
        { field: "name", title: "Name", width: "180px", filter: "text", columnMenu: ColumnMenu },
        { field: "applicableName", title: "Badge Applicable For", filter: "text", columnMenu: ColumnMenu },
        { field: "noOfCheckIns", title: "No. of Check-ins", filter: "numeric", columnMenu: ColumnMenu }
    ]

    useEffect(() => {
        getBadges()
    }, [page, pageSize, filters])

    const handleGridDataStateChange = (event) => {
        onDataStateChange(event)
        const nextFilter = event.dataState?.filter
        if (nextFilter) {
            setFilters(getBackendFilters(nextFilter))
        } else {
            setFilters([])
        }
    }

    useEffect(() => {
        console.log(id);

    }, [id])


    return (
        <div className="container-fluid">
            <div className="col mb-3">
                <h2 className="page-title">Manage Badges</h2>
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
                    {
                        badgePermission.canCreate
                        &&

                        <div className="col-12 col-lg">
                            <div className="btn-list d-flex justify-content-lg-end flex-wrap gap-2 gap-md-3 text-end">

                                <button
                                    onClick={() => setisBadgeOpen(true)}
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
            </div>

            <div className="accordion-body mt-3 mt-xxl-4">
                <div className="row">
                    <div className="col-12">
                        <div className="table-responsive">
                            {
                                badgePermission.canRead
                                &&

                                <Grid
                                    className="table-wrapper  text-center"
                                    data={badgesData}
                                    skip={dataState.skip}
                                    take={dataState.take}

                                    filter={dataState.filter}
                                    filterOperators={{
                                        text: [{ text: 'grid.filterContainsOperator', operator: 'contains' }],
                                        numeric: [{ text: 'grid.filterEqOperator', operator: 'eq' }],
                                        boolean: [{ text: 'grid.filterEqOperator', operator: 'eq' }]
                                    }}
                                    columnMenuIcon={filterIcon}
                                    pageable={{
                                        buttonCount: 5,
                                        pageSizes: [10, 20, 50],
                                        info: true,
                                        previousNext: true,
                                        type: "numeric"
                                    }}
                                    onDataStateChange={handleGridDataStateChange}
                                >
                                    {badgesColumns.map((col) => (
                                        <GridColumn
                                            key={col.field}
                                            field={col.field}
                                            title={col.title}
                                            width={col.width || "150px"}
                                            filter={col.filter}
                                            columnMenu={col.columnMenu}
                                            cells={
                                                col.cell
                                                    ? {
                                                        data: (props) => (
                                                            <col.cell
                                                                setisBadgeOpen={setisBadgeOpen}
                                                                {...props}
                                                                setid={setid}
                                                                id={id}
                                                                getBadges={getBadges}
                                                                badgePermission={badgePermission}
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
            {
                isBadgeOpen
                &&
                <BdagesAdd id={id} getBadges={getBadges} setisBadgeOpen={setisBadgeOpen} />
            }
        </div>
    )
}
