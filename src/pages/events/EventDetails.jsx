import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiRequest } from '../../services/Api'
import { API_ROUTES } from '../../routes/api.routes'

export default function EventDetails() {
    const { id } = useParams()
    const [eventSingleData, seteventSingleData] = useState(null)
    const gteEventById = async () => {
        const res = await apiRequest("GET", API_ROUTES.events.getEventById, null, {
            id
        }, {
            showLoader: true
        })
        seteventSingleData(res.data)
    }

    useEffect(() => {
        gteEventById()
    }, [id])
    return (
        <div className="container-fluid py-3">

            {/* Breadcrumb */}
            <h3 className="page-title mb-4">
                <span className="text-danger fw-bold">Events</span>
                <span className="text-dark fw-bold"> / Event Details</span>
            </h3>

            {/* Top Section */}
            <div className="row g-4">

                {/* Left Image */}
                <div className="col-lg-5">
                    <div className="event-image-card">
                        <img
                            src={eventSingleData?.eventImagePath}
                            alt="event"
                            className="img-fluid event-image"
                        />
                    </div>

                    <p className="event-ended mt-2">
                        This Event has ended
                    </p>
                </div>

                {/* Right Content */}
                <div className="col-lg-7">

                    <span className="badge bg-primary-subtle text-primary border px-3 py-2">
                        {eventSingleData?.venueTypeName}
                    </span>

                    <h2 className="event-title mt-3">
                        {eventSingleData?.eventName}
                    </h2>

                    {/* Date */}
                    <div className="info-row mt-4">
                        <i className="demo-icon icon-calender-heart"></i>
                        <span>{new Date(eventSingleData?.createdOn).toLocaleDateString("en-GB", {
                            weekday: "long",
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}</span>
                        <span className="mx-2">•</span>
                        <span>
                            {new Date(eventSingleData?.startTime).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            })}
                            {" - "}
                            {new Date(eventSingleData?.endTime).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </span>
                    </div>

                    {/* Address */}
                    <div className="info-row mt-4 align-items-start">
                        <i className="demo-icon icon-location-3"></i>

                        <div>
                            <h6 className="mb-1 fw-bold">
                                {eventSingleData?.venueName}
                            </h6>

                            <p className="mb-0 text-muted">
                                {eventSingleData?.address}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}

                    <div className="row mt-5 stats-row">

                        <div className="col-4 stat-box">
                            <h3>{eventSingleData?.goingCount}</h3>
                            <p>Going</p>
                        </div>

                        <div className="col-4 stat-box">
                            <h3>{eventSingleData?.interetedCount}</h3>
                            <p>Interested</p>
                        </div>

                        <div className="col-4 stat-box border-0">
                            <h3>{eventSingleData?.notInterestedCount}</h3>
                            <p>Not Interested</p>
                        </div>

                    </div>

                </div>

            </div>

            {/* Details */}

            <div className="mt-5">

                <h3 className="section-title">
                    Details
                </h3>

                <div className="detail-card">

                    {eventSingleData?.details}

                </div>

            </div>

            {/* Hosts */}

            <div className="mt-5">

                <h3 className="section-title">
                    Hosts
                </h3>

                <div className="host-card">

                    <div className="row align-items-center">

                        <div className="col-auto">

                            <img
                                src={eventSingleData?.eventVenuePath}
                                className="host-image"
                                alt=""
                            />

                        </div>

                        <div className="col">

                            <h4 className="host-title">
                                {eventSingleData?.venueName}
                            </h4>

                            <p className="mb-1 text-muted">
                                {eventSingleData?.address}
                            </p>

                            <p className="mb-1">
                                <strong>Venue Type:</strong> {eventSingleData?.venueTypeName}
                            </p>

                            <p className="mb-0">
                                <strong>Phone:</strong> {eventSingleData?.phone}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}
