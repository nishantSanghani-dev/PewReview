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
        endUserSingleView: (id) => `EndUser/${id}`
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
        getCountry: "Common/country-codes"
    },
    gun: {
        gunListByUser: "GUN/GunListByUser"
    },
    venue: {
        getVenueListByUser: "Venue/GetVenueListByUser",
        getVenueGunDetails: `Venue/GetVenueGunDetails`,
        getVenueById: (venueId) => `Venue/${venueId}`,
        getActivities: "Venue/GetActivities",
        getVenueList: "Venue/GetList"
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