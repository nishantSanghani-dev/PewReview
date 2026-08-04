import { Grid, GridColumn } from '@progress/kendo-react-grid'
import { process } from '@progress/kendo-data-query'
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom';
import { handleDelete } from '../../../utils/DeleteRecords';
import { useSelector } from 'react-redux';
import { MENU } from '../../../data/Menu';
export const ActionCell = (props) => {
    console.log(props.dataItem.eventId);

    return (
        <td {...props.tdProps}>
            <div className="d-flex gap-2 align-items-center">
                <Link
                    to={`/admin/events/view/${props.dataItem.eventId}`}
                    className="small-square-btn edit-btn"
                >
                    <i className="demo-icon icon-eye-line"></i>
                </Link>
                {
                    props.eventPermission.canDelete
                    &&

                    <button
                        onClick={() => handleDelete(props.dataItem.eventId, "events", "eventDelete")}
                        className="small-square-btn danger-btn"
                    >
                        <i className="demo-icon icon-delete-1"></i>
                    </button>
                }
            </div>
        </td>
    );
};

export const HostNameCell = (props) => {
    const item = props.dataItem;
    return (
        <td {...props.tdProps}>
            {item.hostName || item.venueName || item.name || "-"}
        </td>
    );
};

export const EventNameCell = (props) => {
    const item = props.dataItem;
    return (
        <td {...props.tdProps}>
            {item.eventName || item.title || item.event || "-"}
        </td>
    );
};

export const DateTimeCell = (props) => {
    const item = props.dataItem;
    return (
        <td {...props.tdProps}>
            <p className="mb-0">

                {new Date(item.dateTime || item.eventDate || item.date || item.createdOn).toLocaleDateString("en-US") || "-"}
            </p>
        </td>
    );
};

export const AddressCell = (props) => {
    const item = props.dataItem;
    return (
        <td {...props.tdProps}>
            <p className="mb-0">
                {item.address || item.location || item.fullAddress || "-"}
            </p>
        </td>
    );
};
export default function Events({ data, isUpcomingEvent, setisUpcomingEvent }) {
    const [gridSort, setGridSort] = useState([])
    const sortedData = useMemo(() => process(data, { sort: gridSort }).data, [data, gridSort])
    const { permissions } = useSelector((store) => store.permissions)
    console.log(permissions);

    const eventPermission = permissions.find((value, index) => value.menuId === MENU.EVENT)
    console.log(eventPermission);
    return (
        <>
            <div className="event-tabs">
                <button
                    className={`event-tab-btn ${isUpcomingEvent === true ? "active" : ""}`}
                    onClick={() => setisUpcomingEvent(true)}
                >
                    Upcoming Events
                </button>

                <button
                    className={`event-tab-btn ${isUpcomingEvent === false ? "active" : ""}`}
                    onClick={() => setisUpcomingEvent(false)}
                >
                    Passed Events
                </button>

                <button
                    className={`event-tab-btn ${isUpcomingEvent === null ? "active" : ""}`}
                    onClick={() => setisUpcomingEvent(null)}
                >
                    Event Requests
                </button>
            </div>

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

                                {
                                    eventPermission.canRead
                                    &&

                                    <Grid
                                        className="table-wrapper fw-bold text-center"
                                        style={{
                                            zIndex: "999"
                                        }}
                                        data={sortedData}
                                        sortable={{ allowUnsort: true, mode: 'single' }}
                                        sort={gridSort}
                                        pageable={{
                                            buttonCount: 5,
                                            pageSizes: [10, 20, 50],
                                            info: true,
                                            previousNext: true,
                                            type: "numeric"
                                        }}
                                        onDataStateChange={(event) => setGridSort(event.dataState?.sort || [])}
                                    >
                                        <GridColumn
                                            title="Action"
                                            width="120px"
                                            cells={{ data: ActionCell }}
                                        />

                                        <GridColumn
                                            title="Host Name"
                                            width="200px"
                                            cells={{ data: HostNameCell }}
                                        />

                                        <GridColumn
                                            title="Event Name"
                                            width="200px"
                                            cells={{ data: EventNameCell }}
                                        />

                                        <GridColumn
                                            title="Date & Time"
                                            width="200px"
                                            cells={{ data: DateTimeCell }}
                                        />

                                        <GridColumn
                                            title="Address"
                                            width="250px"
                                            cells={{ data: AddressCell }}
                                        />
                                        <GridColumn
                                            field='userName'
                                            title="Created By"
                                            width="150px"

                                        />
                                        <GridColumn
                                            field='approvalStatusName'
                                            title="status"
                                            width="150px"

                                        />
                                    </Grid>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
