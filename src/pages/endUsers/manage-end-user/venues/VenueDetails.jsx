import React, { useEffect, useState } from 'react'
import "../venues/venueDetails.css"
import { useParams } from 'react-router-dom'
import { apiRequest } from '../../../../services/Api'
import { API_ROUTES } from '../../../../routes/api.routes'
import VenuesActivityTab from './VenuesActivityTab'
import VenueEventsTab from './VenueEventsTab'
import Events from '../Events'
export default function VenueDetails() {
    const [isUpcomingEvent, setisUpcomingEvent] = useState(true)
    const { venueId } = useParams()
    const [venueDetailsData, setvenueDetailsData] = useState(null)
    const [activeTab, setActiveTab] = useState("activities")
    const [activityTabData, setactivityTabData] = useState([])
    const getVenueDetails = async () => {
        const res = await apiRequest("GET", API_ROUTES.venue.getVenueById(venueId), null, null, {
            showLoader: true
        })
        setvenueDetailsData(res.data)
    }
    const getVenueActivity = async () => {
        const res = await apiRequest("POST", API_ROUTES.venue.getActivities, { pageNumber: 1, pageSize: 10, venueId })
        setactivityTabData(res.data.data)

    }
    const getEvents = async () => {
        const res = await apiRequest("POST", API_ROUTES.events.getEventList, { pageNumber: 1, pageSize: 10, venueId, isUpcomingEvent, statusId: null, search: "" }, null, {
            showLoader: true
        })
        setactivityTabData(res.data.data)
    }
    useEffect(() => {
        if (venueId) {
            getVenueDetails()
            if (activeTab == "activities") {
                getVenueActivity()
            }
            else {
                getEvents()
            }
        }
    }, [venueId, activeTab, isUpcomingEvent])

    return (
        <div className="container-fluid venue-page">
            {/* Breadcrumb */}
            <div className="venue-breadcrumb">
                <span>Venues</span> / <b>Venue Details</b>
            </div>

            {/* Main Card */}
            <div className="venue-card">

                <h5 className="check-title">
                    Check-In Posts/Activities: {venueDetailsData?.totalPost}
                </h5>


                {/* Venue Header */}
                <div className="venue-header d-flex align-items-center">

                    <img
                        src={venueDetailsData?.imageFullPath}
                        className="venue-logo"
                        alt=""
                    />

                    <div className="ms-4">
                        <h4>
                            {venueDetailsData?.venueName}
                        </h4>

                        <p>
                            {venueDetailsData?.description}
                        </p>
                    </div>

                </div>



                <div className="row mt-4">


                    {/* Left Section */}
                    <div className="col-lg-5">

                        <div className="inner-card guns-card">

                            <div className="card-heading">
                                <h6>
                                    My Guns
                                </h6>

                                <span>
                                    View All
                                </span>
                            </div>

                            {
                                venueDetailsData?.guns?.slice(0, 3).map((value, index) => {
                                    return (
                                        <div className="gun-item">

                                            <img
                                                src={value.imageFullPath}
                                                alt=""
                                            />

                                            <div>
                                                <h6>
                                                    {value.gunName}
                                                </h6>
                                                <p>{value?.manufacturers?.join(" , ")}</p>


                                                <small
                                                    className=""

                                                >
                                                    {value?.details}
                                                </small>
                                            </div>

                                        </div>

                                    )
                                })
                            }




                        </div>

                    </div>



                    {/* Right Section */}
                    <div className="col-lg-5">


                        {/* Details */}
                        <div className="inner-card details-card">

                            <h6>
                                Details
                            </h6>


                            <div className="detail-row">
                                <i className='demo-icon icon-website'></i>
                                <a href={venueDetailsData?.website} target='_blank' className='fw-bold text-black'>
                                    {venueDetailsData?.website}
                                </a>
                            </div>


                            <div className="detail-row">
                                <i className="demo-icon icon-phone"></i>
                                <p>
                                    {venueDetailsData?.phone}
                                </p>
                            </div>


                            <div className="detail-row">
                                <i className='demo-icon icon-location-1'></i>
                                <p>
                                    {venueDetailsData?.address}
                                </p>
                            </div>


                        </div>



                        {/* Photos */}
                        <div className="inner-card photos-card">

                            <div className="card-heading">
                                <h6>
                                    Photos/Videos
                                </h6>

                                <span>
                                    View All
                                </span>
                            </div>


                            <div className="photos">

                                <img src="https://via.placeholder.com/60" />
                                <img src="https://via.placeholder.com/60" />
                                <img src="https://via.placeholder.com/60" />
                                <img src="https://via.placeholder.com/60" />
                                <img src="https://via.placeholder.com/60" />

                            </div>


                        </div>


                    </div>


                </div>

            </div>


            <div className="tabbar-section mt-4 mt-xxl-5">
                <div className="row">
                    <div className="col-12">

                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    onClick={() => setActiveTab("activities")}
                                    className={`nav-link ${activeTab === "activities" ? "active" : ""}`}
                                    id="nav-one-tab"
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === "activities"}
                                >
                                    Activities
                                </button>
                            </li>

                            <li className="nav-item" role="presentation">
                                <button
                                    onClick={() => setActiveTab("events")}
                                    className={`nav-link ${activeTab === "events" ? "active" : ""}`}
                                    id="nav-two-tab"
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === "events"}
                                >
                                    Events
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="tab-content accordion" id="myTabContent">
                {activeTab === "activities" && (
                    <VenuesActivityTab activityTabData={activityTabData} />
                )}

                {activeTab === "events" && (
                    <Events isUpcomingEvent={isUpcomingEvent} setisUpcomingEvent={setisUpcomingEvent} data={activityTabData} />
                )}
            </div>

        </div>
    )
}
