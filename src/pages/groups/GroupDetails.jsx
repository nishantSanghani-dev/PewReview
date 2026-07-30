import React, { useEffect, useState } from "react";
import { apiRequest } from "../../services/Api";
import { API_ROUTES } from "../../routes/api.routes";
import { Link, useParams } from "react-router-dom";
import BreadCumb from "../../components/common/breadCumb/BreadCumb";

export default function GroupDetails() {
    const { id } = useParams()
    const [grpData, setgrpData] = useState(null)
    const getGroupDetails = async () => {
        const res = await apiRequest("GET", API_ROUTES.groups.getByGroupId(id), null, null, {
            showLoader: true
        })
        setgrpData(res.data)
    }
    useEffect(() => {
        getGroupDetails()
    }, [id])
    return (
        <div className="container-fluid ">

            {/* Breadcrumb */}
            <BreadCumb items={[{ label: "Groups", path: "/admin/groups" }, { label: "Group Details" }]} />

            {/* Group Header */}
            <div className="row justify-content-center">
                <div className="col-12 text-center mb-5">

                    <img
                        src={
                            grpData?.groupImage
                                ?
                                grpData?.groupImageFullPath
                                :
                                "https://pewdevadmin.alliancetek.net/assets/images/profile-img.png"
                        }
                        alt="Group"
                        className="img-fluid rounded-circle mb-3"
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover"
                        }}
                    />

                    <h1
                        className="fw-bold mt-2 mb-1"
                        style={{
                            fontSize: "21px"
                        }}
                    >
                        {grpData?.groupName}
                    </h1>



                    <Link
                        to={`/admin/groups/view/${id}/members`}

                        className="text-primary mb-0 text-decoration-underline"
                        style={{
                            fontSize: "13px"
                        }}
                    >
                        {grpData?.memberCount} Member • Public
                    </Link>

                </div>
            </div>

            {/* About Section */}
            <div className="row justify-content-center">
                <div className="col-12">

                    <h2
                        className="fw-bold mb-4"
                        style={{
                            fontSize: "20px"
                        }}
                    >
                        About this group
                    </h2>

                    <h3
                        className="fw-bold mb-3"
                        style={{
                            fontSize: "20px"
                        }}
                    >
                        Details
                    </h3>

                    <div className="table-responsive">

                        <table className="table align-middle mb-0">

                            <tbody>

                                <tr>
                                    <td

                                        className="text-secondary"
                                        style={{
                                            width: "220px",
                                            minWidth: "180px"
                                        }}
                                    >
                                        Members
                                    </td>

                                    <td className="text-primary text-decoration-underline">

                                        <Link to={`/admin/groups/view/${id}/members`} >
                                            {grpData?.memberCount}
                                        </Link>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="text-secondary">
                                        Reports
                                    </td>

                                    <td>
                                        {grpData?.totalReports}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="text-secondary">
                                        Activities
                                    </td>

                                    <td>
                                        <Link
                                            className="text-primary text-decoration-underline"
                                            to={`/admin/groups/activity/${id}`}>
                                            {grpData?.totalActivity}
                                        </Link>
                                    </td>
                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>
            </div>

        </div>
    );
}