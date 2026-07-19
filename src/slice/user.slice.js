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
        }
    }

})
export const { logIn } = userSlice.actions
export default userSlice.reducer