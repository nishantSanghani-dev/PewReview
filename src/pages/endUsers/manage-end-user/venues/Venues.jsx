import { TextFilterCell } from '@progress/kendo-react-data-tools';
import { Grid, GridColumn } from '@progress/kendo-react-grid'
import React, { useEffect, useState } from 'react'
import { DateCell } from '../UploadGun';
import { Link } from 'react-router-dom';
import GunDetails from '../../../../components/common/gunDetails/GunDetails';
import { apiRequest } from '../../../../services/Api';
import { API_ROUTES } from '../../../../routes/api.routes';
import { useSelector } from 'react-redux';


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
const DetailCell = ({ tdProps, dataItem, field }) => {
    return (
        <td  {...tdProps}>
            <div className="text-ellipsis">
                {dataItem.description || "-"}
            </div>
        </td>
    )
}
const WebsiteCell = ({ tdProps, dataItem, field }) => (
    <td {...tdProps}>
        <a target='_blank' href={dataItem.website} className='text-primary'>{dataItem.website}</a>
    </td>
)


export default function Venues({ data }) {
    const [showGunDetails, setShowGunDetails] = useState(false);
    const [gunDetailsData, setgunDetailsData] = useState([])
    
    
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
                        <Link
                            onClick={() => {
                                setShowGunDetails(true)
                                getVenueGunDetails(dataItem.venueId)
                            }}
                            className="text-primary"
                            style={{ cursor: "pointer" }}
                        >
                            {dataItem.totalGun || "-"}
                        </Link>
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
    const venueColumns = [
        { field: "action", title: "Action", cell: ActionCell, width: "130px" },
        { field: "venueName", title: "Venue Name" },
        { field: "description", title: "Description", cell: DetailCell },
        { field: "website", title: "Website", cell: WebsiteCell },
        { field: "phone", title: "Phone" },
        { field: "address", title: "Address", cell: AddressCell },
        { field: "totalGun", title: "No. of Gun", cell: GunCell },
        { field: "venueTypeName", title: "Type" },
        { field: "approvalStatusName", title: "Approval Status" },
        { field: "avgRate", title: "Avg Venue Ratings" },
        { field: "noOfChackin", title: "No. of Check-Ins" },
        { field: "noOfEvent", title: "No. of Event Created" },
        { field: "createdOn", title: "Created On", cell: DateCell },
        { field: "approvalStatusName", title: "Approval Status" },
    ];
    return (
        <div
            id="collapseTwo"
            className="accordion-collapse collapse show d-lg-block"
            aria-labelledby="headingTwo"
            data-bs-parent="#myTabContent"
        >
            <div className="accordion-body mt-3 mt-xxl-4">
                <div className="row">
                    <div className="col-12">
                        <div className="table-responsive">
                            <Grid
                                className="table-wrapper  text-center"
                                data={data}
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
    )
}