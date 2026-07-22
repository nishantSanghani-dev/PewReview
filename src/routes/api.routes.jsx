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
        getVenueType: "Common/GetVenueTypes"
    },
    gun: {
        gunListByUser: "GUN/GunListByUser",
        getGunDropDown: "Gun/GetGunDropdownAll"
    },
    venue: {
        VenueAdd: "Venue/Add",
        venueEdit: (id) => `Venue/Update/${id}`,
        getVenueListByUser: "Venue/GetVenueListByUser",
        getVenueGunDetails: `Venue/GetVenueGunDetails`,
        getVenueById: (venueId) => `Venue/${venueId}`,
        getActivities: "Venue/GetActivities",
        getVenueList: "Venue/GetList",
        venueDelete: (id) => `Venue/${id}`
    },
    events: {
        getEventList: "Event/GetEventList",
        getAllEvent: "Event/List",
        getEventById: `Event/Get`
    },
    activities: {
        getActivities: "Activities/GetActivities",
        getActivityById: (id) => `Venue/GetVenueActivity/${id}`
    }
}