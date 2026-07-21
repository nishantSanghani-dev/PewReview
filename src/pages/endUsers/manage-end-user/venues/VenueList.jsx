import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../../../services/Api'
import { API_ROUTES } from '../../../../routes/api.routes'
import { Grid, GridColumn } from '@progress/kendo-react-grid'
import GunDetails from '../../../../components/common/gunDetails/GunDetails'
import { DateTimeCell } from '../Events'
const ActionCell = (props) => {
    console.log(props.dataItem.venueId);

    return (
        <td {...props.tdProps}>
            <div className="d-flex gap-2 align-items-center">

                <Link to={`/admin/venues/view/${props.dataItem.venueId}`}

                    className="small-square-btn edit-btn"
                >
                    <i className="demo-icon icon-eye-line"></i>
                </Link>
                <a
                    href="javascript:void(0)"
                    className="small-square-btn edit-btn"
                >
                    <i className="demo-icon icon-edit-1" />
                </a>
                <a
                    href="javascript:void(0)"
                    className="small-square-btn danger-btn"
                >
                    <i className="demo-icon icon-delete-1"></i>
                </a>
            </div>
        </td>
    );
};
const DetailCell = ({ tdProps, dataItem, field }) => {
    return (
        <td  {...tdProps}>
            <div className="text-ellipsis">
                {dataItem.description || "-"}
            </div>
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
            <div className="text-ellipsis">
                <p className="mb-0">
                    {item.address || item.location || item.fullAddress || "-"}
                </p>
            </div>
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
                    className="form-check-input"
                    type="checkbox"
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
            <Link className='text-primary' to={`/admin/manage-end-user/view/${dataItem.userId}`}>
                {dataItem.venueOwnerUserName || dataItem.userName}
            </Link>
        </td>
    )
}
export default function VenueList() {
    const [venueListData, setvenueListData] = useState([])
    const [gunDetailsData, setgunDetailsData] = useState([])
    const [showGunDetails, setShowGunDetails] = useState(false);
    const getVenueList = async () => {
        const res = await apiRequest("POST", API_ROUTES.venue.getVenueList, { page: 1, pageSize: 10 }, null, {
            showLoader: true
        })
        setvenueListData(res.data.data)
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
    useEffect(() => {
        getVenueList()
    }, [])

    return (
        <div className='container-fluid'>

            <div className="col mb-3">
                <h2 className="page-title">Venues</h2>
            </div>
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
                            Add Venue
                        </a>

                    </div>
                </div>
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
                                    {/*                                     
                                    <table className="table">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Action</th>
                                                <th>Host Name</th>
                                                <th>Event Name</th>
                                                <th>Date &amp; Time</th>
                                                <th>Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="small-square-btn edit-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <a
                                                            className="small-square-btn danger-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-delete-1" />
                                                        </a>
                                                    </span>
                                                </td>
                                                <td>Andrew Abbott</td>
                                                <td>Meet Ups</td>
                                                <td>
                                                    <p className="mb-0">
                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="mb-0">
                                                        Gun Club Association Member Meeting, Buriel
                                                        club co. Ashville, NC
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="small-square-btn edit-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <a
                                                            className="small-square-btn danger-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-delete-1" />
                                                        </a>
                                                    </span>
                                                </td>
                                                <td>Tom Curran</td>
                                                <td>GO Up meeting</td>
                                                <td>
                                                    <p className="mb-0">
                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="mb-0">
                                                        Gun Club Association Member Meeting, Buriel
                                                        club co. Ashville, NC
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="small-square-btn edit-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <a
                                                            className="small-square-btn danger-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-delete-1" />
                                                        </a>
                                                    </span>
                                                </td>
                                                <td>Christopher Nolan</td>
                                                <td>Gun Meet Ups</td>
                                                <td>
                                                    <p className="mb-0">
                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="mb-0">
                                                        Gun Club Association Member Meeting, Buriel
                                                        club co. Ashville, NC
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="small-square-btn edit-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <a
                                                            className="small-square-btn danger-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-delete-1" />
                                                        </a>
                                                    </span>
                                                </td>
                                                <td>Tom Curran</td>
                                                <td>GO Up meeting</td>
                                                <td>
                                                    <p className="mb-0">
                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="mb-0">
                                                        Gun Club Association Member Meeting, Buriel
                                                        club co. Ashville, NC
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="small-square-btn edit-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <a
                                                            className="small-square-btn danger-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-delete-1" />
                                                        </a>
                                                    </span>
                                                </td>
                                                <td>Christopher Nolan</td>
                                                <td>Gun Meet Ups</td>
                                                <td>
                                                    <p className="mb-0">
                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="mb-0">
                                                        Gun Club Association Member Meeting, Buriel
                                                        club co. Ashville, NC
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="small-square-btn edit-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <a
                                                            className="small-square-btn danger-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-delete-1" />
                                                        </a>
                                                    </span>
                                                </td>
                                                <td>Tom Curran</td>
                                                <td>GO Up meeting</td>
                                                <td>
                                                    <p className="mb-0">
                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="mb-0">
                                                        Gun Club Association Member Meeting, Buriel
                                                        club co. Ashville, NC
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="small-square-btn edit-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <a
                                                            className="small-square-btn danger-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-delete-1" />
                                                        </a>
                                                    </span>
                                                </td>
                                                <td>Christopher Nolan</td>
                                                <td>Gun Meet Ups</td>
                                                <td>
                                                    <p className="mb-0">
                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="mb-0">
                                                        Gun Club Association Member Meeting, Buriel
                                                        club co. Ashville, NC
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table> */}

                                    <Grid
                                        className="table-wrapper  text-center"
                                        data={venueListData}
                                        sortable
                                        pageable={{
                                            buttonCount: 5,
                                            pageSizes: [10, 20, 50],
                                            info: true,
                                            previousNext: true,
                                            type: "numeric"
                                        }}

                                    >
                                        {venueColumns.map((col) => (
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
        </div>
    )
}
