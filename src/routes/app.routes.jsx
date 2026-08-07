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
                    <PermissionRoute typeId={MENU.DASHBOARD}>
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
                            <PermissionRoute typeId={MENU.USER}>
                                <ManageUser />
                            </PermissionRoute>
                        ),
                    },
                    {
                        path: "add",
                        element: (
                            <PermissionRoute typeId={MENU.USER}>
                                <UserAdd />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "edit/:id",
                        element: (
                            <PermissionRoute typeId={MENU.USER}>
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
                            <PermissionRoute typeId={MENU.ACTIVITY}>
                                <Activity />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "view/:id",
                        element: (
                            <PermissionRoute typeId={MENU.ACTIVITY}>
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
                            <PermissionRoute typeId={MENU.EVENT}>
                                <Event />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "view/:id",
                        element: (
                            <PermissionRoute typeId={MENU.EVENT}>
                                <EventDetails />
                            </PermissionRoute>
                        )
                    }
                ]
            },
            {
                path: "manage-end-user",
                element: (
                    <PermissionRoute typeId={MENU.END_USER}>
                        <EndUser />
                    </PermissionRoute>
                )
            },
            {
                path: "manage-end-user/view/:id",
                element: (
                    <PermissionRoute typeId={MENU.END_USER}>
                        <EndUserView />
                    </PermissionRoute>
                )
            },
            {
                path: "messages",
                element: (
                    <PermissionRoute typeId={MENU.MESSAGE}>
                        <Messages />
                    </PermissionRoute>
                )
            },
            {
                path: "reported-user",
                element: (
                    <PermissionRoute typeId={MENU.REPORT}>
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
                            <PermissionRoute typeId={MENU.ROLE}>
                                <RoleAndPermission />
                            </PermissionRoute>
                        )

                    },
                    {
                        path: "add",
                        element: (
                            <PermissionRoute typeId={MENU.ROLE}>
                                <RoleAndPermissionAdd />
                            </PermissionRoute>
                        )

                    },
                    {
                        path: "edit/:id",
                        element: (
                            <PermissionRoute typeId={MENU.ROLE}>
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
                            <PermissionRoute typeId={MENU.VENUE}>
                                <VenueList />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "view/:venueId",
                        element: (
                            <PermissionRoute typeId={MENU.VENUE}>
                                <VenueDetails />
                            </PermissionRoute>
                        )
                    }
                ]
            },
            {
                path: "support-tickets",
                element: (
                    <PermissionRoute typeId={MENU.SUPPORT}>
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
                            <PermissionRoute typeId={MENU.GROUP}>
                                <Groups />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "view/:id",
                        element: (
                            <PermissionRoute typeId={MENU.GROUP}>
                                <GroupDetails />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "view/:id/members",
                        element: (
                            <PermissionRoute typeId={MENU.GROUP}>
                                <GroupMember />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "activity/:id",
                        element: (
                            <PermissionRoute typeId={MENU.GROUP}>
                                <GroupActivities />
                            </PermissionRoute>
                        )
                    }
                ]
            },
            {
                path: "manage-badges",
                element: (
                    <PermissionRoute typeId={MENU.BADGE}>
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
                            <PermissionRoute typeId={MENU.PROHIBITED_WORD}>
                                <Prohibited />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "manufacturer",
                        element: (
                            <PermissionRoute typeId={MENU.MANUFACTURER}>
                                <Manufacturer />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "accessories",
                        element: (
                            <PermissionRoute typeId={MENU.ACCESSORY}>
                                <Accessories />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "gun",
                        element: (
                            <PermissionRoute typeId={MENU.GUN_MASTER}>
                                <GunMaster />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "ammunition",
                        element: (
                            <PermissionRoute typeId={MENU.AMMUNITION}>
                                <Ammunition />
                            </PermissionRoute>
                        )
                    },
                    {
                        path: "category",
                        element: (
                            <PermissionRoute typeId={MENU.GUN_CATEGORY_MASTER}>
                                <CategoryMaster />
                            </PermissionRoute>
                        )
                    }
                ]
            },
            {
                path: "leaderboard",
                element: (
                    <PermissionRoute typeId={MENU.LEADERBOARD}>
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