import React, { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

export default function SideBar({ mobileSlideBar, setmobileSlideBar }) {
    const [masterSubMenu, setmasterSubMenu] = useState(false)
    return (
        <div id="wrapper" className={`content-wrapper ${mobileSlideBar ? 'toggled' : ''}`}>
            {/* sidebar start */}
            <aside id="sidebar">
                <div className="sidebar-menu-section">
                    <ul>
                        <li onClick={() => setmobileSlideBar(false)} >
                            <NavLink
                                to="/admin/dashboard">
                                <i className="demo-icon icon-dashboard" />
                                <span>Dashboard</span>
                            </NavLink>
                        </li>
                        <li onClick={() => setmobileSlideBar(false)}>
                            <NavLink to="/admin/activity">
                                <i className="demo-icon icon-activity" />
                                <span>Activity</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/admin/events'}>
                                <i className="demo-icon icon-roles" />
                                <span>Events</span>
                            </NavLink>
                        </li>
                        <li>
                            <a href="javascript:void(0);">
                                <i className="demo-icon icon-location-2" />
                                <span>Venues</span>
                            </a>
                        </li>
                        <li>
                            <NavLink to={'/admin/role-and-permission/view'}>
                                <i className="demo-icon icon-roles-permission" />
                                <span>Roles &amp; Permission</span>
                            </NavLink>
                        </li>
                        <li onClick={() => setmobileSlideBar(false)}>
                            <NavLink to="/admin/user/manage-user">
                                <i className="demo-icon icon-manage-user" />
                                <span>Manage Users</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/admin/manage-end-user'}>
                                <i className="demo-icon icon-manage-end-users" />
                                <span>Manage End Users</span>
                            </NavLink>
                        </li>
                        <li>
                            <a href="javascript:void(0);">
                                <i className="demo-icon icon-support-ticket" />
                                <span>Support Ticket</span>
                            </a>
                        </li>
                        <li>
                            <NavLink to={'/admin/messages'}>
                                <i className="demo-icon icon-messaging-1" />
                                <span>Messaging</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/admin/reported-user'}>
                                <i className="demo-icon icon-reported-uses" />
                                <span>Reported Users</span>
                            </NavLink>
                        </li>
                        <li>
                            <a href="javascript:void(0);">
                                <i className="demo-icon icon-leaderboard" />
                                <span>Leaderboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);">
                                <i className="demo-icon icon-manage-badges" />
                                <span>Manage Badges</span>
                            </a>
                        </li>
                        <li className={`has-submenu ng-star-inserted ${masterSubMenu && 'open'}`}>
                            <Link onClick={() => setmasterSubMenu(!masterSubMenu)}
                                href="javascript:void(0);"
                                id="masters"
                                className="submenu-toggle d-flex w-100 justify-content-between"
                            >
                                <span>
                                    <i className="demo-icon icon-masters" />
                                    <span>Masters</span>
                                </span>

                                <i className="demo-icon icon-down-arrow" />
                            </Link>
                            <ul className={`submenu ${masterSubMenu ? 'd-block' : 'd-none'}`}>
                                <li>
                                    <a href="javascript:void(0);">Category Master</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);">Sub-Category Master</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);">Prohibited Words Master</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);">Holiday Master</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </aside>
            {/* sidebar end */}
            {/* right content start */}
            <div className="content-inside">
                <Outlet />
            </div>
            {/* right content end */}
        </div>
    )
}
