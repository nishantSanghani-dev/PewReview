/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/Api'
import { API_ROUTES } from '../routes/api.routes'
import { useDispatch } from 'react-redux'
import { logOut } from '../slice/user.slice'

export default function Header({ mobileSlideBar, setmobileSlideBar }) {
    const [userData, setuserData] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const getUser = async () => {
        const res = await apiRequest("GET", API_ROUTES.user.getUserProfile, null, null, {
            useToken: true,
            showLoader: true,
        })
        // console.log(res);
        setuserData(res.data)
    }
    useEffect(() => {
        getUser()
    }, [])
    return (
        <>
            <header>
                <div className="container-fluid">
                    <div className="row justify-content-between align-items-center flex-row g-2 g-sm-3 g-xl-4">
                        <div className="col-auto">
                            <div className="logo-section">
                                <button onClick={() => setmobileSlideBar(prev => !prev)} className="sidebar-toggle">
                                    <i className={`demo-icon icon-toggle-1 ${mobileSlideBar ? 'd-block' : 'd-none'}`}></i>
                                    <i className={`demo-icon icon-left-arrow ${!mobileSlideBar ? 'd-block' : 'd-none'}`}></i>
                                </button>
                                <div className="logo">
                                    <Link to="/admin/dashboard">
                                        <img src="/assets/images/logo-white.svg" alt="logo" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col d-flex align-items-center justify-content-end gap-1 gap-sm-3 gap-xl-4">
                            {/* <form class="d-flex searchbar" role="search">
                     <input class="form-control" type="search" placeholder="Search" aria-label="Search">
                     <button class="btn btn-outline-primary" type="submit"><i class="demo-icon icon-search"></i></button>
                     </form> */}
                            <button className="search-toggle d-block d-md-none" type="button">
                                <i className="demo-icon icon-search" />
                                <i className="demo-icon icon-cross" />
                            </button>
                            <form className="d-md-flex searchbar align-items-center" role="search">
                                <input
                                    className="form-control search-input"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                />
                                <button className="btn btn-outline-primary" type="button">
                                    <i className="demo-icon icon-search" />
                                </button>
                            </form>
                            <div className="head-icons">
                                <ul className="d-flex align-items-center gap-1 gap-sm-3 gap-xl-4">
                                    <li className="dropdown no-arrow chat-notification">
                                        <a
                                            href="javascript:void(0);"
                                            className="dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                        >
                                            <i className="demo-icon icon-message-2" />
                                            <span>5</span>
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="profile.html">List One</a></li>
                                            <li><a className="dropdown-item" href="#">List Two</a></li>
                                        </ul>
                                    </li>
                                    <li className="dropdown no-arrow notification">
                                        <a
                                            href="javascript:void(0);"
                                            className="dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                        >
                                            <i className="demo-icon icon-bell" />
                                            <span />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="user-info">
                                <div className="dropdown">
                                    <a
                                        href="javascript:void(0);"
                                        className="dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                    >
                                        <img src={userData?.profileImage ? userData?.profileImageFullPath : "https://pewdevadmin.alliancetek.net/assets/images/profile-img.png"} alt="profile-avtar" />
                                        <span>{userData?.userName}</span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link className="dropdown-item" to={'/admin/profile'}>
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                onClick={() => {
                                                    if (confirm("Want To LogOut ? ")) {
                                                        dispatch(logOut())
                                                        navigate("/")
                                                    }
                                                }}
                                                className="dropdown-item" href="#">
                                                logout
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

        </>

    )
}
