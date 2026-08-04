import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../../../services/Api'
import { API_ROUTES } from '../../../../routes/api.routes'
import { Grid, GridColumn } from '@progress/kendo-react-grid'
import GunDetails from '../../../../components/common/gunDetails/GunDetails'
import { DateTimeCell } from '../Events'
import VenueAdd from './VenueAdd'
import { handleStatusChange } from '../../../../utils/ChangeStatus'
import SerachFilter from '../../../../components/common/SerachFilter'
import useGridPagination from '../../../../hooks/useGridPagination'
import { Tooltip } from '@progress/kendo-react-tooltip'
import { useSelector } from 'react-redux'
import { usePermission } from '../../../../hooks/UsePermission'
import { MENU } from '../../../../data/Menu'

const DetailCell = ({ tdProps, dataItem, field }) => {
    return (
        <td  {...tdProps}>
            <Tooltip anchorElement="target" position="top">
                <span
                    title={dataItem.description}
                    style={{
                        display: "inline-block",
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {dataItem.description || "-"}
                </span>
            </Tooltip>
            {/* <div className="text-ellipsis">
                {dataItem.description || "-"}
            </div> */}
        </td>
    )
}
const WebsiteCell = ({ tdProps, dataItem }) => {
    const website = dataItem.website?.startsWith("http")
        ? dataItem.website
        : `https://${dataItem.website}`;

    return (
        <td {...tdProps}>
            <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
            >
                {dataItem.website}
            </a>
        </td>
    );
};
const AddressCell = (props) => {
    const item = props.dataItem;
    return (

        <td {...props.tdProps}>
            <Tooltip anchorElement="target" position="top">
                <span
                    title={item.address || item.location || item.fullAddress}
                    style={{
                        display: "inline-block",
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {item.address || item.location || item.fullAddress || "-"}
                </span>
            </Tooltip>
            {/* <div className="text-ellipsis">
                <p className="mb-0">
                    {item.address || item.location || item.fullAddress || "-"}
                </p>
            </div> */}
        </td>
    );
};
const TextCell = ({ tdProps, dataItem, field }) => (
    <td {...tdProps}>

        {dataItem[field] ?? "-"}
    </td>
);
const StatusCell = (props) => {
    const item = props.dataItem;

    return (
        <td {...props.tdProps}>
            <div className="form-check form-switch">
                <input
                    onChange={(e) =>
                        handleStatusChange(
                            props.dataItem.venueId,
                            e.target.checked,
                            "venue",
                            "venueStatusUpdate",
                            props.getVenueList
                        )
                    }
                    className="form-check-input"
                    type="checkbox"
                    disabled={!props.venuePermission.canUpdate}
                    checked={item.isActive}
                    readOnly
                />
            </div>
        </td>
    );
};

export const UserNameCell = ({ tdProps, dataItem, field }) => {
    return (
        <td {...tdProps}>
            {
                
            }
            <Link className='text-primary' to={`/admin/user/edit/${dataItem.userId}`}>
                {dataItem.venueOwnerUserName || dataItem.userName}
            </Link>
        </td>
    )
}
export default function VenueList() {
    const [venueListData, setvenueListData] = useState([])
    const [gunDetailsData, setgunDetailsData] = useState([])
    const [showGunDetails, setShowGunDetails] = useState(false);
    const [venueAddBtn, setvenueAddBtn] = useState(false)
    const [editVenueId, setEditVenueId] = useState(null)
    const [searchText, setSearchText] = useState("")
    const [customSearch, setcustomSearch] = useState("")
    const [totalRecords, settotalRecords] = useState(null)
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

    const permission = usePermission()
    const venuePermission = permission.find((value, index) => value.menuId === MENU.VENUE)
    console.log(venuePermission);
    

    const getVenueList = async () => {
        const res = await apiRequest("POST", API_ROUTES.venue.getVenueList, { page, pageSize, customSearch, Sorts: sort }, null, {
            showLoader: true
        })
        setvenueListData(res.data.data)
        settotalRecords(res.data.totalRecord)
    }
    const getVenueGunDetails = async (venueId) => {
        const res = await apiRequest("GET", API_ROUTES.venue.getVenueGunDetails, null, {
            venueId
        }, {
            showLoader: true
        })
        setgunDetailsData(res.data)

    }

    const GunCell = ({ tdProps, dataItem, setShowGunDetails }) => {
        console.log(dataItem.venueId);

        useEffect(() => {
            console.log(showGunDetails);

        }, [setShowGunDetails])
        return (
            <>
                <td {...tdProps}>
                    <div>
                        {
                            dataItem.totalGun > 0
                                ?

                                <Link
                                    onClick={() => {
                                        setShowGunDetails(true)
                                        getVenueGunDetails(dataItem.venueId)
                                    }}
                                    className="text-primary"
                                    style={{ cursor: "pointer" }}
                                >
                                    {dataItem.totalGun}
                                </Link>
                                :
                                0
                        }
                    </div>
                </td>

                {
                    showGunDetails && (
                        <GunDetails
                            gunDetailsData={gunDetailsData}
                            setShowGunDetails={setShowGunDetails}
                        />
                    )
                }

            </>
        );
    };
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
                    {
                        props.venuePermission.canRead
                        &&

                        <Link to={`/admin/venues/view/${props.dataItem.venueId}`}

                            className="small-square-btn edit-btn"
                        >
                            <i className="demo-icon icon-eye-line"></i>
                        </Link>
                    }
                    {
                        props.venuePermission.canUpdate
                        &&

                        <a
                            href="javascript:void(0)"
                            className="small-square-btn edit-btn"
                            onClick={() => {
                                setEditVenueId(props.dataItem.venueId);
                                setvenueAddBtn(true);
                            }}
                        >
                            <i className="demo-icon icon-edit-1" />
                        </a>
                    }
                    {
                        props.venuePermission.canDelete
                        &&

                        <button

                            onClick={() => deleteEvent()}
                            className="small-square-btn danger-btn"
                        >
                            <i className="demo-icon icon-delete-1"></i>
                        </button>
                    }
                </div>
            </td>
        );
    };
    const ApprovalStatusCell = ({ tdProps, dataItem }) => {
        return (
            <td {...tdProps}>
                <div className="approval-status-wrapper">
                    <select className="approval-status-select">
                        <option value={dataItem.approvalStatusName}>Approved</option>
                        <option value={dataItem.approvalStatusName}>Rejected</option>
                        <option value={dataItem.approvalStatusName}>Pending</option>
                    </select>
                </div>
            </td>
        );
    };

    const venueColumns = [
        { field: "action", title: "Action", cell: ActionCell, width: "130px" },
        { field: "venueOwnerUserName", title: "Owner Name", cell: UserNameCell },
        { field: "venueName", title: "Venue Name", width: "200px" },
        { field: "description", title: "Description", cell: DetailCell },
        { field: "website", title: "Website", cell: WebsiteCell },
        { field: "phone", title: "Phone" },
        { field: "address", title: "Address", cell: AddressCell },
        { field: "totalGun", title: "No. of Guns", cell: GunCell },
        { field: "avgRate", title: "Avg. Venue Rating" },
        { field: "noOfChackin", title: "No. of Check-Ins" },
        { field: "noOfEvent", title: "No. of Event Created", width: "170px" },
        { field: "userName", title: "Created By" },
        { field: "createdOn", title: "Created On", cell: DateTimeCell },
        { field: "approvalStatusName", title: "Approval Status", cell: ApprovalStatusCell },
        { field: "isActive", title: "Status", cell: StatusCell }
    ];
    const handleGridDataStateChange = (event) => {
        onDataStateChange(event)
        setKendoSort(event.dataState?.sort || [])
    }

    useEffect(() => {
        getVenueList()
    }, [page, pageSize, customSearch, sort])

    return (
        <div className='container-fluid'>

            <div className="col mb-3">
                <h2 className="page-title">Venues</h2>
            </div>
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
                {
                    venuePermission.canCreate
                    &&

                    <div className="col-12 col-lg">
                        <div className="btn-list d-flex justify-content-lg-end flex-wrap gap-2 gap-md-3 text-end">

                            <button
                                onClick={() => setvenueAddBtn(true)}
                                href="javascript:void(0);"
                                className="btn main-btn border-btn sky-btn"
                            >
                                Add Venue
                            </button>

                        </div>
                    </div>
                }   
            </div>
            <div

                id="nav-four-tab-pane"
                role="tabpanel"
                aria-labelledby="nav-four-tab"
                tabIndex={0}
            >
                <h2 className="accordion-header d-lg-none" id="headingFour">
                    <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFour"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                    >
                        Activities
                    </button>
                </h2>
                <div
                    id="collapseFour"
                    className="accordion-collapse collapse d-lg-block"
                    aria-labelledby="headingFour"
                    data-bs-parent="#myTabContent"
                >
                    <div className="accordion-body mt-3 mt-xxl-4">
                        <div className="row">
                            <div className="col-12">
                                <div className="table-responsive">
                                    <Grid
                                        className="table-wrapper  text-center"
                                        data={venueListData}
                                        skip={dataState.skip}
                                        take={dataState.take}
                                        sortable={{ allowUnsort: true, mode: 'single' }}
                                        sort={kendoSort}
                                        total={totalRecords}
                                        pageable={{
                                            buttonCount: 5,
                                            pageSizes: [10, 20, 50],
                                            info: true,
                                            previousNext: true,
                                            type: "numeric"
                                        }}
                                        onDataStateChange={handleGridDataStateChange}

                                    >
                                        {venueColumns.map((col) => (
                                            <GridColumn
                                                key={col.field}
                                                field={col.field}
                                                title={col.title}
                                                sortable={col.field === 'action' ? false : true}
                                                width={col.width || "150px"}
                                                cells={
                                                    col.cell
                                                        ? {
                                                            data: (props) => (
                                                                <col.cell
                                                                    {...props}
                                                                    venuePermission={venuePermission}
                                                                    getVenueList={getVenueList}
                                                                    setShowGunDetails={setShowGunDetails}
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
            </div>
            {
                venueAddBtn
                &&

                <VenueAdd
                    setvenueAddBtn={setvenueAddBtn}
                    editVenueId={editVenueId}
                    setEditVenueId={setEditVenueId}
                />
            }
        </div>

    )
}
