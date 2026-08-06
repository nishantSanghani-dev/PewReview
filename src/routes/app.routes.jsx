import { createBrowserRouter, Navigate } from "react-router-dom";


import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";

import ManageUser from "../pages/users/manage-user/ManageUser";
import Activity from "../pages/activity/Activity";

import Event from "../pages/events/Event";
import EndUser from "../pages/endUsers/manage-end-user/EndUser";
import Messages from "../pages/messages/Messages";
import ReportedUser from "../pages/reportedUser/ReportedUser";
import Login from "../pages/auth/login/pages/Login";
import UserAdd from "../pages/users/addUser/UserAdd";
import RoleAndPermission from "../pages/roleAndPermisson/pages/roleAndPermissionView/RoleAndPermission";
import RoleAndPermissionAdd from "../pages/roleAndPermisson/pages/roleAndPermissionAdd/RoleAndPermissionAdd";
import EndUserView from "../pages/endUsers/manage-end-user/EndUserView";
import VenueDetails from "../pages/endUsers/manage-end-user/venues/VenueDetails";
import VenueList from "../pages/endUsers/manage-end-user/venues/VenueList";
import ActivityDetails from "../pages/activity/ActivityDetails";
import EventDetails from "../pages/events/EventDetails";
import SupportTicket from "../pages/supportTicket/SupportTicket";
import Groups from "../pages/groups/Groups";
import GroupDetails from "../pages/groups/GroupDetails";
import GroupMember from "../pages/groups/GroupMember";
import GroupActivities from "../pages/groups/GroupActivities";
import Badges from "../pages/badges/Badges";
import Prohibited from "../pages/masters/prohabitedWords/Prohibited";
import Manufacturer from "../pages/masters/manufacturer/Manufacturer";
import Accessories from "../pages/masters/accessories/Accessories";
import GunMaster from "../pages/masters/gunMaster/GunMaster";
import Ammunition from "../pages/masters/ammunition/Ammunition";
import CategoryMaster from "../pages/masters/category/CategoryMaster";
import LeaderBoard from "../pages/leaderboards/LeaderBoard";
import AuthLayouts from "../layouts/authLayouts";
import Profile from "../pages/profile/Profile";
import ForgotPassword from "../pages/auth/forgot-password/ForgotPassword";
import PermissionRoute from "./PermissionRoute";
import { MENU } from "../data/Menu";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <AuthLayouts />,
        children: [
            {
                index: true,
                element: <Login />,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            }
        ]

    },
    {
        path: "/admin",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/admin/dashboard" />,
            },
            {
                path: "dashboard",
                element: (
                    <PermissionRoute menuId={MENU.DASHBOARD}>
                        <Dashboard />
                    </PermissionRoute>
                ),
            },
            {
                path: "user",
                children: [
                    {
                        path: "manage-user",
                        element: (
                            <PermissionRoute menuId={MENU.USER}>
                                <ManageUser />
                            </PermissionRoute>
                        ),
                    },
                    {
                        path: "add",
                        element: (
                            <PermissionRoute menuId={MENU.USER}>
                                <UserAdd />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "edit/:id",
                        element: (
                            <PermissionRoute menuId={MENU.USER}>
                                <UserAdd />
                            </PermissionRoute>
                        )
                    }
                ]
            },

            {
                path: "activity",
                children: [
                    {
                        path: "view",
                        element: (
                            <PermissionRoute menuId={MENU.ACTIVITY}>
                                <Activity />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "view/:id",
                        element: (
                            <PermissionRoute menuId={MENU.ACTIVITY}>
                                <ActivityDetails />
                            </PermissionRoute>
                        )
                    }
                ]
            },
            {
                path: "events",
                children: [
                    {
                        path: "view",
                        element: (
                            <PermissionRoute menuId={MENU.EVENT}>
                                <Event />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "view/:id",
                        element: (
                            <PermissionRoute menuId={MENU.EVENT}>
                                <EventDetails />
                            </PermissionRoute>
                        )
                    }
                ]
            },
            {
                path: "manage-end-user",
                element: (
                    <PermissionRoute menuId={MENU.END_USER}>
                        <EndUser />
                    </PermissionRoute>
                )
            },
            {
                path: "manage-end-user/view/:id",
                element: (
                    <PermissionRoute menuId={MENU.END_USER}>
                        <EndUserView />
                    </PermissionRoute>
                )
            },
            {
                path: "messages",
                element: (
                    <PermissionRoute menuId={MENU.MESSAGE}>
                        <Messages />
                    </PermissionRoute>
                )
            },
            {
                path: "reported-user",
                element: (
                    <PermissionRoute menuId={MENU.REPORT}>
                        <ReportedUser />
                    </PermissionRoute>
                )
            },
            {
                path: "role-and-permission",
                children: [
                    {
                        path: "view",
                        element: (
                            <PermissionRoute menuId={MENU.ROLE}>
                                <RoleAndPermission />
                            </PermissionRoute>
                        )

                    },
                    {
                        path: "add",
                        element: (
                            <PermissionRoute menuId={MENU.ROLE}>
                                <RoleAndPermissionAdd />
                            </PermissionRoute>
                        )

                    },
                    {
                        path: "edit/:id",
                        element: (
                            <PermissionRoute menuId={MENU.ROLE}>
                                <RoleAndPermissionAdd />
                            </PermissionRoute>
                        )

                    }
                ]
            },
            {
                path: "venues",
                children: [
                    {
                        path: "list",
                        element: (
                            <PermissionRoute menuId={MENU.VENUE}>
                                <VenueList />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "view/:venueId",
                        element: (
                            <PermissionRoute menuId={MENU.VENUE}>
                                <VenueDetails />
                            </PermissionRoute>
                        )
                    }
                ]
            },
            {
                path: "support-tickets",
                element: (
                    <PermissionRoute menuId={MENU.SUPPORT}>
                        <SupportTicket />
                    </PermissionRoute>
                )
            },
            {
                path: "groups",
                children: [
                    {
                        index: true,
                        element: (
                            <PermissionRoute menuId={MENU.GROUP}>
                                <Groups />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "view/:id",
                        element: (
                            <PermissionRoute menuId={MENU.GROUP}>
                                <GroupDetails />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "view/:id/members",
                        element: (
                            <PermissionRoute menuId={MENU.GROUP}>
                                <GroupMember />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "activity/:id",
                        element: (
                            <PermissionRoute menuId={MENU.GROUP}>
                                <GroupActivities />
                            </PermissionRoute>
                        )
                    }
                ]
            },
            {
                path: "manage-badges",
                element: (
                    <PermissionRoute menuId={MENU.BADGE}>
                        <Badges />
                    </PermissionRoute>
                )
            },
            {
                path: "masters",
                children: [
                    {
                        path: "prohibited-words",
                        element: (
                            <PermissionRoute menuId={MENU.PROHIBITED_WORD}>
                                <Prohibited />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "manufacturer",
                        element: (
                            <PermissionRoute menuId={MENU.MANUFACTURER}>
                                <Manufacturer />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "accessories",
                        element: (
                            <PermissionRoute menuId={MENU.ACCESSORY}>
                                <Accessories />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "gun",
                        element: (
                            <PermissionRoute menuId={MENU.GUN_MASTER}>
                                <GunMaster />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "ammunition",
                        element: (
                            <PermissionRoute menuId={MENU.AMMUNITION}>
                                <Ammunition />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "category",
                        element: (
                            <PermissionRoute menuId={MENU.GUN_CATEGORY_MASTER}>
                                <CategoryMaster />
                            </PermissionRoute>
                        )
                    }
                ]
            },
            {
                path: "leaderboard",
                element: (
                    <PermissionRoute menuId={MENU.LEADERBOARD}>
                        <LeaderBoard />
                    </PermissionRoute>
                )
            },
            {
                path: "profile",
                element: <Profile />
            }
        ],
    },
]);