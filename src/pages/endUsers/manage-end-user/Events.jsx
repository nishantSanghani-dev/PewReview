import { Grid, GridColumn } from '@progress/kendo-react-grid'
import React, { useState } from 'react'
const ActionCell = (props) => {
    return (
        <td {...props.tdProps}>
            <div className="d-flex gap-2 align-items-center">
                <a
                    href="javascript:void(0)"
                    className="small-square-btn edit-btn"
                >
                    <i className="demo-icon icon-eye-line"></i>
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

const HostNameCell = (props) => {
    const item = props.dataItem;
    return (
        <td {...props.tdProps}>
            {item.hostName || item.venueName || item.name || "-"}
        </td>
    );
};

const EventNameCell = (props) => {
    const item = props.dataItem;
    return (
        <td {...props.tdProps}>
            {item.eventName || item.title || item.event || "-"}
        </td>
    );
};

const DateTimeCell = (props) => {
    const item = props.dataItem;
    return (
        <td {...props.tdProps}>
            <p className="mb-0">
                {item.dateTime || item.eventDate || item.date || "-"}
            </p>
        </td>
    );
};

const AddressCell = (props) => {
    const item = props.dataItem;
    return (
        <td {...props.tdProps}>
            <p className="mb-0">
                {item.address || item.location || item.fullAddress || "-"}
            </p>
        </td>
    );
};
export default function Events({ data }) {
    const [activeTab, setActiveTab] = useState("upcoming");

    return (
        <>
            <div className="event-tabs">
                <button
                    className={`event-tab-btn ${activeTab === "upcoming" ? "active" : ""
                        }`}
                    onClick={() => setActiveTab("upcoming")}
                >
                    Upcoming Events
                </button>

                <button
                    className={`event-tab-btn ${activeTab === "passed" ? "active" : ""
                        }`}
                    onClick={() => setActiveTab("passed")}
                >
                    Passed Events
                </button>

                <button
                    className={`event-tab-btn ${activeTab === "requests" ? "active" : ""
                        }`}
                    onClick={() => setActiveTab("requests")}
                >
                    Events Requests
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
                                <Grid
                                    className="table-wrapper fw-bold text-center"
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
                                        width="300px"
                                        cells={{ data: AddressCell }}
                                    />
                                </Grid>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
