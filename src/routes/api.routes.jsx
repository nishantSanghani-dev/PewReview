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
        userEdit: `User/update`
    },
    endUser: {
        endUserView: "EndUser/GetUsers",
        endUserSingleView: (id) => `EndUser/${id}`,
        endUserDropDown: "EndUser/GetEndUserDropdown"
    },
    role: {
        roleList: "Role/List",
        roleView: "Role/Get",
        roleAdd: "Role/Add",
        roleDelete: (id) => `Role/Delete/${id}`,
        roleStatusEdit: (id) => `Role/UpdateStatus/${id}`

    },
    common: {
        gender: "Common/GetGenders",
        getCommincateWith: "common/GetCommincateWith",
        getCountry: "Common/country-codes",
        getVenueType: "Common/GetVenueTypes",
        getSupportStatus: "Common/GetSupportStatus",
        getDashboardFilter: "Common/GetDashboardFilters",
        getBadgeApplicableFor: "Common/GetBadgeApplicableFor"
    },
    gun: {
        gunListByUser: "GUN/GunListByUser",
        getGunDropDown: "Gun/GetGunDropdownAll",
        gunStatusUpdate: (id) => `Gun/UpdateStatus/${id}`
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
        getEventById: `Event/Get`
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
        supportTicketDelete: (id) => `SupportTicket/Delete/${id}`
    },
    report: {
        getReportList: "Report/GetReportList"
    },
    groups: {
        getGroups: "Group/GetGroups",
        getByGroupId: (id) => `Group/GetGroupDetail/${id}`,
        getGroupMemberList: "Group/GetGroupMembersList",
        groupUpdateStatus: (id) => `Group/UpdateStatus/${id}`
    },
    badges: {
        getBadges: "ManageBadges/List",
        badgesAdd: "ManageBadges/Add",
        badgeById: (id) => `ManageBadges/Get/${id}`,
        badgeUpdate: "ManageBadges/Update"
    }
}