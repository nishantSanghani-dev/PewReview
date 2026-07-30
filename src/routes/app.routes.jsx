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

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <AuthLayouts />,
        children: [
            {
                index: true,
                element: <Login />,
            },
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
                element: <Dashboard />,
            },
            {
                path: "user",
                children: [
                    {
                        path: "manage-user",
                        element: <ManageUser />,
                    },
                    {
                        path: "add",
                        element: <UserAdd />
                    },
                    {
                        path: "edit/:id",
                        element: <UserAdd />
                    }
                ]
            },

            {
                path: "activity",
                children: [
                    {
                        path: "view",
                        element: <Activity />
                    },
                    {
                        path: "view/:id",
                        element: <ActivityDetails />
                    }
                ]
            },
            {
                path: "events",
                children: [
                    {
                        path: "view",
                        element: <Event />
                    },
                    {
                        path: "view/:id",
                        element: <EventDetails />
                    }
                ]
            },
            {
                path: "manage-end-user",
                element: <EndUser />
            },
            {
                path: "manage-end-user/view/:id",
                element: <EndUserView />
            },
            {
                path: "messages",
                element: <Messages />
            },
            {
                path: "reported-user",
                element: <ReportedUser />
            },
            {
                path: "role-and-permission",
                children: [
                    {
                        path: "view",
                        element: <RoleAndPermission />
                    },
                    {
                        path: "add",
                        element: <RoleAndPermissionAdd />
                    },
                    {
                        path: "edit/:id",
                        element: <RoleAndPermissionAdd />
                    }
                ]
            },
            {
                path: "venues",
                children: [
                    {
                        path: "list",
                        element: <VenueList />
                    },
                    {
                        path: "view/:venueId",
                        element: <VenueDetails />
                    }
                ]
            },
            {
                path: "support-tickets",
                element: <SupportTicket />
            },
            {
                path: "groups",
                children: [
                    {
                        index: true,
                        element: <Groups />
                    },
                    {
                        path: "view/:id",
                        element: <GroupDetails />
                    },
                    {
                        path: "view/:id/members",
                        element: <GroupMember />
                    },
                    {
                        path: "activity/:id",
                        element: <GroupActivities />
                    }
                ]
            },
            {
                path: "manage-badges",
                element: <Badges />
            },
            {
                path: "masters",
                children: [
                    {
                        path: "prohibited-words",
                        element: <Prohibited />
                    },
                    {
                        path: "manufacturer",
                        element: <Manufacturer />
                    },
                    {
                        path: "accessories",
                        element: <Accessories />
                    },
                    {
                        path: "gun",
                        element: <GunMaster />
                    },
                    {
                        path: "ammunition",
                        element: <Ammunition />
                    },
                    {
                        path: "category",
                        element: <CategoryMaster />
                    }
                ]
            },
            {
                path: "leaderboard",
                element: <LeaderBoard />
            },
            {
                path: "profile",
                element:<Profile/>
            }
        ],
    },
]);