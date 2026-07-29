import React, { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

export default function SideBar({ mobileSlideBar, setmobileSlideBar }) {
    const [masterSubMenu, setmasterSubMenu] = useState(false)
    const location = useLocation();
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
                            <NavLink to="/admin/activity/view">
                                <i className="demo-icon icon-activity" />
                                <span>Activity</span>
                            </NavLink>
                        </li>
                        <li onClick={() => setmobileSlideBar(false)}>
                            <NavLink to="/admin/groups">
                                <i className="demo-icon icon-users" />
                                <span>Groups</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/admin/events/view'}>
                                <i className="demo-icon icon-roles" />
                                <span>Events</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={location.pathname.includes("/venues") ? "active" : ""} to={'/admin/venues/list'}>
                                <i className="demo-icon icon-location-2" />
                                <span>Venues</span>
                            </NavLink>
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
                            <NavLink to={'/admin/support-tickets'}>
                                <i className="demo-icon icon-support-ticket" />
                                <span>Support Ticket</span>
                            </NavLink>
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
                            <NavLink to={'/admin/leaderboard'}>
                                <i className="demo-icon icon-leaderboard" />
                                <span>Leaderboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/admin/manage-badges'}>
                                <i className="demo-icon icon-manage-badges" />
                                <span>Badges</span>
                            </NavLink>
                        </li>
                        <li className={`has-submenu ng-star-inserted ${masterSubMenu && 'open'}`}>
                            <Link
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setmasterSubMenu(!masterSubMenu);
                                }}
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
                                    <NavLink to={'/admin/masters/prohibited-words'}>Prohibited Words</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/admin/masters/gun'}>Gun Master</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/admin/masters/ammunition'}>Ammunition Master</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/admin/masters/accessories'}>Accessories Master</NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/admin/masters/category'}>Category Master</NavLink>
                                </li>
                                <li>
                                    <NavLink to={"/admin/masters/manufacturer"}>Manufacturer Master</NavLink>
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
