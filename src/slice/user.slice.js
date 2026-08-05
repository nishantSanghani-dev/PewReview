import { createSlice } from "@reduxjs/toolkit";
import { Storage } from "../utils/storage";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        token: localStorage.getItem("TOKEN") ?? null,
        permissions: Storage.get("PERMISSIONS") ?? [],
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
            Storage.set("PERMISSIONS", state.permissions);
            localStorage.setItem("PERMISSION_MAP", JSON.stringify(state.permissionMap));
        },
        logOut: (state, action) => {
            state.token = null
            localStorage.removeItem("TOKEN")
            Storage.remove("PERMISSIONS")
            localStorage.removeItem("PERMISSION_MAP");
        }
    }

})
export const { logIn, logOut } = userSlice.actions
export default userSlice.reducer