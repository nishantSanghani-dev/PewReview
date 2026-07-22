import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiRequest } from '../../services/Api'
import { API_ROUTES } from '../../routes/api.routes'

export default function ActivityDetails() {
    const { id } = useParams()
    const [activityData, setactivityData] = useState(null)

    const getActivitiesById = async () => {
        const res = await apiRequest("GET", API_ROUTES.activities.getActivityById(id), null, null, {
            showLoader: true
        })
        setactivityData(res.data)
    }

    useEffect(() => {
        getActivitiesById()
    }, [id])

    return (
        <div className="container-fluid py-3 activity-page">

            {/* Breadcrumb */}
            <div className="mb-3 activity-breadcrumb">
                <span className="text-danger fw-bold">Activity</span>
                <span className="mx-2 text-dark">/</span>
                <span className="fw-bold text-dark">Activity Details</span>
            </div>

            <div className="row g-4">

                {/* Left Side - Images */}
                <div className="col-12 col-lg-5">
                    <div className="card activity-image-card h-100">
                        <div className="card-body">

                            <div className="activity-image-wrapper mb-3">
                                {
                                    activityData?.attachments?.map((value, index) => {
                                        return (

                                            <img
                                                src={value.fullURL}
                                                alt="event-image"
                                                className="img-fluid rounded activity-image"
                                            />
                                        )
                                    })
                                }
                            </div>



                        </div>
                    </div>
                </div>

                {/* Right Side - Details */}
                <div className="col-12 col-lg-7">
                    <div className="card activity-details-card h-100">
                        <div className="card-body p-4">

                            <div className="row mb-4">
                                <div className="col-12 col-md-4">
                                    <h6 className="detail-label">Username:</h6>
                                </div>
                                {
                                    activityData?.userName
                                    &&

                                    <div className="col-12 col-md-8">
                                        <p className="detail-value">{activityData?.userName}</p>
                                    </div>
                                }
                            </div>
                            {
                                activityData?.createdOn
                                &&

                                <div className="row mb-4">
                                    <div className="col-12 col-md-4">
                                        <h6 className="detail-label">Created On:</h6>
                                    </div>
                                    <div className="col-12 col-md-8">
                                        <p className="detail-value"> {new Date(activityData?.createdOn).toLocaleDateString("en-Us")}</p>
                                    </div>
                                </div>
                            }
                            {


                                <div className="row mb-4">
                                    <div className="col-12 col-md-4">
                                        <h6 className="detail-label">Ratings:</h6>
                                    </div>
                                    <div className="col-12 col-md-8">
                                        <p className="detail-value">{Math.ceil(activityData?.rate)}</p>
                                    </div>
                                </div>
                            }
                            {
                                activityData?.post
                                &&

                                <div className="row mb-4">
                                    <div className="col-12 col-md-4">
                                        <h6 className="detail-label">Post Description:</h6>
                                    </div>
                                    <div className="col-12 col-md-8">
                                        <p className="detail-value">{activityData?.post}</p>
                                    </div>
                                </div>
                            }
                            {
                                activityData?.venueName
                                &&

                                <div className="row mb-4">
                                    <div className="col-12 col-md-4">
                                        <h6 className="detail-label">Venue Name:</h6>
                                    </div>
                                    <div className="col-12 col-md-8">
                                        <p className="detail-value">{activityData?.venueName}</p>
                                    </div>
                                </div>
                            }
                            {
                                activityData?.venueLocation
                                &&

                                <div className="row mb-4">
                                    <div className="col-12 col-md-4">
                                        <h6 className="detail-label">Venue Address:</h6>
                                    </div>
                                    <div className="col-12 col-md-8">
                                        <p className="detail-value">
                                            {activityData?.venueLocation}
                                        </p>
                                    </div>
                                </div>
                            }
                            {
                                activityData?.venueOwner
                                &&

                                <div className="row mb-4">
                                    <div className="col-12 col-md-4">
                                        <h6 className="detail-label">Venue Owner Name:</h6>
                                    </div>
                                    <div className="col-12 col-md-8">
                                        <p className="detail-value">{activityData?.venueOwner}</p>
                                    </div>
                                </div>
                            }

                            {/* 
                            <div className="row">
                                <div className="col-12 col-md-4">
                                    <h6 className="detail-label">Gun:</h6>
                                </div>
                                <div className="col-12 col-md-8">
                                    <div className="detail-value">
                                        <p className="mb-2"><strong>Gun Name:</strong> AK 47</p>
                                        <p className="mb-2"><strong>Ammunition:</strong> 0.9</p>
                                        <p className="mb-2"><strong>Accessories:</strong> cartridges - scope</p>
                                        <p className="mb-0"><strong>Manufacturers:</strong> China</p>
                                    </div>
                                </div>
                            </div> */}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
