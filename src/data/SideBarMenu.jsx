export const sidebarMenus = [
    {
        menuId: 22,
        menuName: "Dashboard",
        title: "Dashboard",
        path: "/admin/dashboard",
        icon: "icon-dashboard",
        isSubMenu: false
    },
    {
        menuId: 21,
        menuName: "Activity",
        title: "Activity",
        path: "/admin/activity/view",
        icon: "icon-activity",
        isSubMenu: false
    },
    {
        menuId: 10,
        menuName: "Group",
        title: "Groups",
        path: "/admin/groups",
        icon: "icon-users",
        isSubMenu: false
    },
    {
        menuId: 11,
        menuName: "Event",
        title: "Events",
        path: "/admin/events/view",
        icon: "icon-roles",
        isSubMenu: false
    },
    {
        menuId: 17,
        menuName: "Venue",
        title: "Venues",
        path: "/admin/venues/list",
        icon: "icon-location-2",
        activePath: "/venues",
        isSubMenu: false
    },
    {
        menuId: 8,
        menuName: "Role",
        title: "Roles & Permission",
        path: "/admin/role-and-permission/view",
        icon: "icon-roles-permission",
        isSubMenu: false
    },
    {
        menuId: 5,
        menuName: "User",
        title: "Manage Users",
        path: "/admin/user/manage-user",
        icon: "icon-manage-user",
        isSubMenu: false
    },
    {
        menuId: 6,
        menuName: "EndUser",
        title: "Manage End Users",
        path: "/admin/manage-end-user",
        icon: "icon-manage-end-users",
        isSubMenu: false
    },
    {
        menuId: 16,
        menuName: "SupportTicket",
        title: "Support Ticket",
        path: "/admin/support-tickets",
        icon: "icon-support-ticket",
        isSubMenu: false
    },
    {
        menuId: 23,
        menuName: "Messaging",
        title: "Messaging",
        path: "/admin/messages",
        icon: "icon-messaging-1",
        isSubMenu: false
    },
    {
        menuId: 15,
        menuName: "Report",
        title: "Reported Users",
        path: "/admin/reported-user",
        icon: "icon-reported-uses",
        isSubMenu: false
    },
    {
        menuId: 24,
        menuName: "Leaderboard",
        title: "Leaderboard",
        path: "/admin/leaderboard",
        icon: "icon-leaderboard",
        isSubMenu: false
    },
    {
        menuId: 7,
        menuName: "Badge",
        title: "Badges",
        path: "/admin/manage-badges",
        icon: "icon-manage-badges",
        isSubMenu: false
    },
    {
        menuId: null,
        menuName: "Masters",
        title: "Masters",
        icon: "icon-masters",
        isSubMenu: true,
        children: [
            {
                menuId: 13,
                menuName: "ProhibitedWord",
                title: "Prohibited Words",
                path: "/admin/masters/prohibited-words",
            },
            {
                menuId: 19,
                menuName: "GunMaster",
                title: "Gun Master",
                path: "/admin/masters/gun",
            },
            {
                menuId: 2,
                menuName: "Ammunition",
                title: "Ammunition Master",
                path: "/admin/masters/ammunition",
            },
            {
                menuId: 20,
                menuName: "Accessory",
                title: "Accessories Master",
                path: "/admin/masters/accessories",
            },
            {
                menuId: 3,
                menuName: "GunCategoryMaster",
                title: "Category Master",
                path: "/admin/masters/category",
            },
            {
                menuId: 12,
                menuName: "Manufacturer",
                title: "Manufacturer Master",
                path: "/admin/masters/manufacturer",
            },
        ],
    },
];