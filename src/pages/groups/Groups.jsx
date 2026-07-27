import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../services/Api'
import { API_ROUTES } from '../../routes/api.routes'
import { Grid, GridColumn } from '@progress/kendo-react-grid'
import { Link } from 'react-router-dom';
import { DateCell } from '../activity/Activity';
import { handleStatusChange } from '../../utils/ChangeStatus';
const ActionCell = (props) => {
    console.log(props.dataItem.venueId);

    const deleteEvent = async () => {
        if (confirm("Are You Want To Delete Venue ? ")) {

            const res = await apiRequest("DELETE", API_ROUTES.venue.venueDelete(props.dataItem.venueId), null, null, {
                showLoader: true,
                showToaster: true
            })
            if (res.status) {
                getVenueList()
            }
        }

    }

    return (
        <td {...props.tdProps}>
            <div className="d-flex gap-2 align-items-center">

                <Link to={`/admin/groups/view/${props.dataItem.id}`}

                    className="small-square-btn edit-btn"
                >
                    <i className="demo-icon icon-eye-line"></i>
                </Link>

                <button

                    onClick={() => deleteEvent()}
                    className="small-square-btn danger-btn"
                >
                    <i className="demo-icon icon-delete-1"></i>
                </button>
            </div>
        </td>
    );
};
const TextCell = ({ tdProps, dataItem, field }) => (
    <td {...tdProps}>

        {dataItem[field] ?? "-"}
    </td>
);
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
const UserNameCell = ({ tdProps, dataItem, field }) => {
    return (
        <td {...tdProps}>
            <Link className='text-primary' to={`/admin/manage-end-user/view/${dataItem.createdBy}`}>
                {dataItem.userName}
            </Link>
        </td>
    )
}

const MemberCell = ({ tdProps, dataItem, field }) => {
    return (
        <td {...tdProps}>
            <Link className='text-primary text-decoration-underline' to={`/admin/groups/view/${dataItem?.id}/members`} >
                {dataItem?.totalMember}
            </Link>
        </td>
    )
}

const AvtivityCell = ({ tdProps, dataItem, field }) => {
    return (
        <td {...tdProps}>
            <Link
                className="text-primary text-decoration-underline"
                to={`/admin/groups/activity/${dataItem?.id}`}>
                {dataItem?.totalActivity}
            </Link>
        </td>
    )
}
export default function Groups() {

    const [groupData, setgroupData] = useState([])
    const getGroups = async () => {
        const res = await apiRequest("POST", API_ROUTES.groups.getGroups, { page: 1, pageSize: 10 }, null, {
            showLoader: true
        })
        setgroupData(res.data.data)
    }
    const groupColumns = [
        { field: "action", title: "Action", cell: ActionCell, width: "130px" },
        { field: "groupName", title: "Group Name" },
        { field: "groupImageFullUrl", title: "Group Image", cell: ImageCell, width: "130px" },
        { field: "about", title: "About Group" },
        { field: "isPublic", title: "Group Types", cell: GroupTypeCell },
        { field: "totalMember", title: "Members", cell: MemberCell },
        { field: "totalActivity", title: "Activities", cell: AvtivityCell },
        { field: "totalReport", title: "Reported" },
        { field: "userName", title: "Created By", cell: UserNameCell },
        { field: "createdOn", title: "createdOn", cell: DateCell }, ,
        { field: "isActive", title: "Status", cell: StatusCell },
    ]

    useEffect(() => {
        getGroups()
    }, [])

    return (
        <div className="container-fluid">
            <div className="page-heading">
                <div className="row align-items-center gap-2">
                    <div className="col">
                        <h2 className="page-title">Groups</h2>
                    </div>


                </div>
                <div className='mt-4' style={{ width: "230px" }}>
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
            </div>
            <div className="accordion-body mt-3 mt-xxl-4">
                <div className="row">
                    <div className="col-12">
                        <div className="table-responsive">
                            <Grid
                                className="table-wrapper  text-center"
                                data={groupData}

                                pageable={{
                                    buttonCount: 5,
                                    pageSizes: [10, 20, 50],
                                    info: true,
                                    previousNext: true,
                                    type: "numeric"
                                }}

                            >
                                {groupColumns.map((col) => (
                                    <GridColumn
                                        key={col.field}
                                        field={col.field}
                                        title={col.title}
                                        width={col.width || "150px"}
                                        cells={
                                            col.cell
                                                ? {
                                                    data: (props) => (
                                                        <col.cell
                                                            {...props}

                                                            getGroups={getGroups}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
