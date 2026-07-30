/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react'
import BreadCumb from '../../../components/common/breadCumb/BreadCumb'
import UserForm from '../components/UserForm'
import { apiRequest } from '../../../services/Api'
import { API_ROUTES } from '../../../routes/api.routes'
import { useParams } from 'react-router-dom'

export default function UserAdd() {
    const [userRoleData, setuserRoleData] = useState([])
    const [genderData, setgenderData] = useState([])
    const [communicationData, setcommunicationData] = useState([])
    const [countryData, setcountryData] = useState([])
    const [userSingleData, setuserSingleData] = useState(null)
    const { id } = useParams()
    const getUserRole = async () => {
        const res = await apiRequest("POST", API_ROUTES.role.roleList, { page: 1, pageSize: 10 }, null, {
            showLoader: true,
            useToken: true
        })

        setuserRoleData(res.data.data)

    }
    const getGender = async () => {
        const res = await apiRequest("GET", API_ROUTES.common.gender, null, null, {
            showLoader: true,
            useToken: true
        })

        setgenderData(res.data)
    }
    const getCommunication = async () => {
        const res = await apiRequest("GET", API_ROUTES.common.getCommincateWith, null, null, {
            showLoader: true
        })
        // console.log(res.data);
        setcommunicationData(res.data)
    }
    const getCountry = async () => {
        const res = await apiRequest("GET", API_ROUTES.common.getCountry, null, null, {
            showLoader: true
        })
        setcountryData(res.data)
    }
    const getSingleUser = async () => {
        const res = await apiRequest("GET", API_ROUTES.user.userSingleView(id), null, null, {
            showLoader: true,

        })
        console.log(res.data);
        setuserSingleData(res.data)

    }
    useEffect(() => {
        getUserRole()
        getGender()
        getCommunication()
        getCountry()
    }, [])
    useEffect(() => {
        if (id) {
            getSingleUser()
        }
    }, [id])
    return (
        <div className="container-fluid">
            <div className="tabbar-section">
                <div className="row">
                    <div className="col-12">
                            <BreadCumb items={[{ label: "Manage User", path: "/admin/user/manage-user" }, { label: id ? "Edit User" : "Add User" }]} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <UserForm
                            id={id}
                            userSingleData={userSingleData}
                            genderData={genderData}
                            userRoleData={userRoleData}
                            communicationData={communicationData}
                            countryData={countryData}
                        />
                    </div>
                </div>
            </div>
        </div>

    )
}
