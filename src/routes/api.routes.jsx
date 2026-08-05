export const API_ROUTES = {
    login: {
        login: "Login/Login"
    },
    dashboard: "dashboard/GetTopDashboardData",
    user: {
        getUserProfile: "User/GetUserProfile",
        userAdd: "User/add",
        userView: "User/GetUsers",
        userStatusUpdate: (id) => `User/UpdateStatus/${id}`,
        userDelete: `User`,
        userSingleView: (id) => `User/${id}`,
        userEdit: `User/update`,
        userExport: "User/GetExportUsersToken"
    },
    endUser: {
        endUserView: "EndUser/GetUsers",
        endUserSingleView: (id) => `EndUser/${id}`,
        endUserDropDown: "EndUser/GetEndUserDropdown",
        endUserDelete: (id) => `EndUser/Delete/${id}`
    },
    role: {
        roleList: "Role/List",
        getRolesForDropdown: "Role/GetRolesForDropdown",
        roleView: "Role/Get",
        roleAdd: "Role/Add",
        roleEdit: (id) => `Role/Update/${id}`,
        roleDelete: (id) => `Role/Delete/${id}`,
        roleStatusEdit: (id) => `Role/UpdateStatus/${id}`

    },
    common: {
        gender: "Common/GetGenders",
        getCommincateWith: "common/GetCommincateWith",
        communicationWithDropdown: "Common/CommunicationWithDropdown",
        getCountry: "Common/country-codes",
        getVenueType: "Common/GetVenueTypes",
        getSupportStatus: "Common/GetSupportStatus",
        getDashboardFilter: "Common/GetDashboardFilters",
        getBadgeApplicableFor: "Common/GetBadgeApplicableFor",
        getGunApplicationFor: "Common/GetGunCategoryApplicableForType"
    },
    gun: {
        gunListByUser: "GUN/GunListByUser",
        getGunDropDown: "Gun/GetGunDropdownAll",
        gunStatusUpdate: (id) => `Gun/UpdateStatus/${id}`,
        getGun: "Gun/List",
        gunDelete: (id) => `Gun/Delete/${id}`
    },
    venue: {
        VenueAdd: "Venue/Add",
        venueEdit: (id) => `Venue/Update/${id}`,
        getVenueListByUser: "Venue/GetVenueListByUser",
        getVenueGunDetails: `Venue/GetVenueGunDetails`,
        getVenueById: (venueId) => `Venue/${venueId}`,
        getActivities: "Venue/GetActivities",
        getVenueList: "Venue/GetList",
        venueDelete: (id) => `Venue/${id}`,
        venueStatusUpdate: (id) => `Venue/UpdateStatus/${id}`
    },
    events: {
        getEventList: "Event/GetEventList",
        getAllEvent: "Event/List",
        getEventById: `Event/Get`,
        eventDelete: (id) => `Event/Delete/${id}`
    },
    activities: {
        getActivities: "Activities/GetActivities",
        getActivityById: (id) => `Venue/GetVenueActivity/${id}`,
        activitiesPostStatus: (id) => `Activities/UpdatePostStatus/${id}`
    },
    supportTicket: {
        SupportTicketViewList: "SupportTicket/List",
        supportTicketViewById: (id) => `SupportTicket/${id}`,
        supportTicketUpdate: "SupportTicket/Update",
        supportTicketDelete: (id) => `SupportTicket/Delete/${id}`,
        supportTicketsUpdateAsync: "SupportTicket/StatusUpadteAsync"
    },
    reportDashboard: {
        getReportList: "Report/GetReportList"
    },
    groups: {
        getGroups: "Group/GetGroups",
        getByGroupId: (id) => `Group/GetGroupDetail/${id}`,
        getGroupMemberList: "Group/GetGroupMembersList",
        groupUpdateStatus: (id) => `Group/UpdateStatus/${id}`,
        groupDelete: (id) => `Group/Delete/${id}`
    },
    badges: {
        getBadges: "ManageBadges/List",
        badgesAdd: "ManageBadges/Add",
        badgeById: (id) => `ManageBadges/Get/${id}`,
        badgeUpdate: "ManageBadges/Update",
        badgeDelete: (id) => `ManageBadges/Delete/${id}`
    },
    prohibited: {
        getProhibited: "ProhibitedWord/List",
        prohibitedStatusChange: (id) => `ProhibitedWord/UpdateStatus/${id}`,
        prohibitedDelete: (id) => `ProhibitedWord/Delete/${id}`,
        prohibitedAdd: "ProhibitedWord/Add",
        prohibitedSingleView: "ProhibitedWord/Get",
        prohibitedUpdate: "ProhibitedWord/Update"
    },
    manufacturer: {
        getManufacturer: "Manufacturer/List",
        manufacturerAdd: "Manufacturer/Add",
        manufacturerStatusUpdate: (id) => `Manufacturer/UpdateStatus/${id}`,
        manufacturerDelete: (id) => `Manufacturer/Delete/${id}`,
        manufacturerGetById: (id) => `Manufacturer/Get/${id}`,
        manufacturerUpdate: (id) => `Manufacturer/Update/${id}`,
        manufacturerDropdown: "Manufacturer/GetManufacturerDropdown"
    },
    accessories: {
        getaccessories: "Accessory/List",
        accessoriesStatusUpdate: (id) => `Accessory/UpdateStatus/${id}`,
        accessoroesDelete: (id) => `Accessory/Delete/${id}`,
        accessoriesAdd: "Accessory/Add",
        accessoriesGetById: "Accessory/Get",
        accessoriesEdit: (id) => `Accessory/Edit/${id}`
    },
    ammunition: {
        getammunition: "Ammunition/List",
        ammunitionStatusUpdate: (id) => `Ammunition/UpdateStatus/${id}`,
        ammunitionDelete: (id) => `Ammunition/Delete/${id}`,
        ammunitionAdd: "Ammunition/Add",
        ammunitionGetById: `Ammunition/Get`,
        ammunitionUpdate: `Ammunition/Update`
    },
    category: {
        getCategoryMaster: "GunCategoryMaster/List",
        categoryMasterUpdate: (id) => `GunCategoryMaster/UpdateStatus/${id}`,
        categoryMasterDelete: (id) => `GunCategoryMaster/Delete/${id}`,
        categoryDropdown: "GunCategoryMaster/CategoryDropdown",
        categoryAdd: "GunCategoryMaster/Add"
    },
    report: {
        getReport: "Report/GetUserReportList"
    }
}

