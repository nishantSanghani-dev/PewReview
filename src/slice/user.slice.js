import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        token: localStorage.getItem("TOKEN") ?? null,
        permissions: JSON.parse(localStorage.getItem("PERMISSIONS")) ?? [],
        permissionMap: JSON.parse(localStorage.getItem("PERMISSION_MAP")) ?? {}
    },
    reducers: {
        logIn: (state, action) => {
            console.log(action.payload);

            state.token = action.payload.token
            state.permissions = action.payload.permission
            state.permissionMap = action.payload.permission.reduce((acc, item) => {
                acc[item.menuId] = item;
                return acc;
            }, {});
            localStorage.setItem("TOKEN", state.token)
            localStorage.setItem("PERMISSIONS", JSON.stringify(state.permissions))
            localStorage.setItem("PERMISSION_MAP", JSON.stringify(state.permissionMap));
        },
        logOut: (state, action) => {
            state.token = null
            localStorage.removeItem("TOKEN")
            localStorage.removeItem("PERMISSIONS")
            localStorage.removeItem("PERMISSION_MAP");
        }
    }

})
export const { logIn, logOut } = userSlice.actions
export default userSlice.reducer