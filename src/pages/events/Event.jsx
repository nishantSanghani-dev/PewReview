import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../services/Api'
import { API_ROUTES } from '../../routes/api.routes'
import { Grid, GridColumn } from '@progress/kendo-react-grid'
import { ActionCell, AddressCell, DateTimeCell, EventNameCell, HostNameCell } from '../endUsers/manage-end-user/Events'
import SerachFilter from '../../components/common/SerachFilter'
import useGridPagination from '../../hooks/useGridPagination'
import { usePermission } from '../../hooks/UsePermission'
import { MENU } from '../../data/Menu'

export default function Event() {
    const [eventTabs, seteventTabs] = useState("upcomingEvents")
    const [params, setParams] = useState({ isUpcomingEvents: true, isAdminRequest: null })
    const [eventsData, seteventsData] = useState([])
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
    const permission = usePermission()
    const eventPermission = permission.find((value, index) => value.menuId === MENU.EVENT)
    console.log(eventPermission);




    const getEevent = async () => {
        const res = await apiRequest("POST", API_ROUTES.events.getAllEvent, { page, pageSize, customSearch, Sorts: sort, Filters: filters }, params, {
            showLoader: true
        })
        seteventsData(res.data.data)
    }
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
        console.log(eventTabs);
        getEevent()
    }, [eventTabs, params, page, pageSize, customSearch, sort])
    return (
        <div className="container-fluid">
            <div className="col mb-3">
                <h2 className="page-title">Events</h2>
            </div>
            <div className="tabbar-section mb-3">
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
                </div>
            </div>
            <div className="tabbar-section">
                <div className="row">
                    <div className="col-12">
                        {/* Tab Nav (desktop only) */}
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    onClick={() => {
                                        seteventTabs("upcomingEvents")
                                        setParams({ isUpcomingEvents: true, isAdminRequest: null })
                                    }}
                                    className={`nav-link   ${eventTabs === "upcomingEvents" ? 'active' : ""}`}
                                    id="nav-one-tab"

                                    type="button"
                                    role="tab"
                                    aria-controls="nav-one-tab-pane"
                                    aria-selected="true"
                                >
                                    Upcoming Events
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    onClick={() => {
                                        seteventTabs("passedEvents")
                                        setParams({ isUpcomingEvents: false, isAdminRequest: null })
                                    }}
                                    className={`nav-link  ${eventTabs === "passedEvents" ? 'active' : ""}`}
                                    id="nav-two-tab"

                                    type="button"
                                    role="tab"
                                    aria-controls="nav-two-tab-pane"
                                    aria-selected="false"
                                >
                                    Passed Events
                                </button>
                            </li>
                            <li className={`nav-item `} role="presentation">
                                <button
                                    onClick={() => {
                                        seteventTabs("adminEvents")
                                        setParams({ isUpcomingEvents: null, isAdminRequest: true })
                                    }}
                                    className={`nav-link  ${eventTabs === "adminEvents" ? 'active' : ""}`}
                                    id="nav-three-tab"

                                    type="button"
                                    role="tab"
                                    aria-controls="nav-three-tab-pane"
                                    aria-selected="true"
                                >
                                    Admin-added venues' Events requests
                                </button>
                            </li>
                        </ul>
                        {/* Shared Content: Tab + Accordion */}
                        <div className="tab-content accordion" id="myTabContent">

                            <div
                                className="tab-pane fade show active accordion-item"
                                id="nav-one-tab-pane"
                                role="tabpanel"
                                aria-labelledby="nav-one-tab"
                                tabIndex={0}
                            >
                                <h2 className="accordion-header d-lg-none" id="headingOne">
                                    <button
                                        className="accordion-button"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne"
                                        aria-expanded="true"
                                        aria-controls="collapseOne"
                                    >
                                        Upcoming Events
                                    </button>
                                </h2>
                                <div
                                    id="collapseOne"
                                    className="accordion-collapse collapse show d-lg-block"
                                    aria-labelledby="headingOne"
                                    data-bs-parent="#myTabContent"
                                >
                                    <div className="accordion-body mt-3 mt-xxl-4">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="table-responsive">
                                                    <Grid
                                                        className="table-wrapper fw-bold text-center"
                                                        data={eventsData}
                                                        skip={dataState.skip}
                                                        take={dataState.take}
                                                        sortable={{ allowUnsort: true, mode: 'single' }}
                                                        sort={kendoSort}
                                                        pageable={{
                                                            buttonCount: 5,
                                                            pageSizes: [10, 20, 50],
                                                            info: true,
                                                            previousNext: true,
                                                            type: "numeric"
                                                        }}
                                                        onDataStateChange={handleGridDataStateChange}
                                                    >
                                                        <GridColumn
                                                            title="Action"
                                                            width="120px"
                                                            cells={{
                                                                data: (props) => (
                                                                    <ActionCell
                                                                        {...props}
                                                                        eventPermission={eventPermission}
                                                                    />
                                                                ),
                                                            }}
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
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div
                                className="tab-pane fade accordion-item"
                                id="nav-two-tab-pane"
                                role="tabpanel"
                                aria-labelledby="nav-two-tab"
                                tabIndex={0}
                            >
                                <h2 className="accordion-header d-lg-none" id="headingTwo">
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseTwo"
                                        aria-expanded="false"
                                        aria-controls="collapseTwo"
                                    >
                                        Passed Events
                                    </button>
                                </h2>
                                <div
                                    id="collapseTwo"
                                    className="accordion-collapse collapse d-lg-block"
                                    aria-labelledby="headingTwo"
                                    data-bs-parent="#myTabContent"
                                >
                                    <div className="accordion-body mt-3 mt-xxl-4">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead className="table-dark">
                                                            <tr>
                                                                <th>Action</th>
                                                                <th>Host Name/Venue Name</th>
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
                                                                <td>Suite Park</td>
                                                                <td>Meet Ups</td>
                                                                <td>
                                                                    <p className="mb-0">
                                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                                    </p>
                                                                    <p className="mb-0">This Event has ended</p>
                                                                </td>
                                                                <td>
                                                                    <p className="mb-0">
                                                                        Gun Club Association Member Meeting, Buriel club
                                                                        co. Ashville, NC
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
                                                                <td>Vanguard Shooting Park</td>
                                                                <td>GO Up meeting</td>
                                                                <td>
                                                                    <p className="mb-0">
                                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                                    </p>
                                                                    <p className="mb-0">This Event has ended</p>
                                                                </td>
                                                                <td>
                                                                    <p className="mb-0">
                                                                        Gun Club Association Member Meeting, Buriel club
                                                                        co. Ashville, NC
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
                                                                <td>Clay Target Center</td>
                                                                <td>Gun Meet Ups</td>
                                                                <td>
                                                                    <p className="mb-0">
                                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                                    </p>
                                                                    <p className="mb-0">This Event has ended</p>
                                                                </td>
                                                                <td>
                                                                    <p className="mb-0">
                                                                        Gun Club Association Member Meeting, Buriel club
                                                                        co. Ashville, NC
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
                                                                <td>Pistol Range</td>
                                                                <td>GO Up meeting</td>
                                                                <td>
                                                                    <p className="mb-0">
                                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                                    </p>
                                                                    <p className="mb-0">This Event has ended</p>
                                                                </td>
                                                                <td>
                                                                    <p className="mb-0">
                                                                        Gun Club Association Member Meeting, Buriel club
                                                                        co. Ashville, NC
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
                                                                <td>Falcon Ridge Shooting Park</td>
                                                                <td>Gun Meet Ups</td>
                                                                <td>
                                                                    <p className="mb-0">
                                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                                    </p>
                                                                    <p className="mb-0">This Event has ended</p>
                                                                </td>
                                                                <td>
                                                                    <p className="mb-0">
                                                                        Gun Club Association Member Meeting, Buriel club
                                                                        co. Ashville, NC
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
                                                                <td>Clay Target Center</td>
                                                                <td>GO Up meeting</td>
                                                                <td>
                                                                    <p className="mb-0">
                                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                                    </p>
                                                                    <p className="mb-0">This Event has ended</p>
                                                                </td>
                                                                <td>
                                                                    <p className="mb-0">
                                                                        Gun Club Association Member Meeting, Buriel club
                                                                        co. Ashville, NC
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
                                                                <td>Falcon Ridge Shooting Park</td>
                                                                <td>Gun Meet Ups</td>
                                                                <td>
                                                                    <p className="mb-0">
                                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                                    </p>
                                                                    <p className="mb-0">This Event has ended</p>
                                                                </td>
                                                                <td>
                                                                    <p className="mb-0">
                                                                        Gun Club Association Member Meeting, Buriel club
                                                                        co. Ashville, NC
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}
