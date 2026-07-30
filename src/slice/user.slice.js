import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        token: localStorage.getItem("TOKEN") ?? null
    },
    reducers: {
        logIn: (state, action) => {
            // console.log(action.payload);
            state.token = action.payload
            localStorage.setItem("TOKEN", state.token)
        },
        logOut: (state, action) => {
            state.token = null
            localStorage.removeItem("TOKEN")
        }
    }

})
export const { logIn ,logOut} = userSlice.actions
export default userSlice.reducer