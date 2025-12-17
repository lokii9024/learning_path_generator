import { createSlice } from "@reduxjs/toolkit";
import { is } from "zod/v4/locales";

const initialState = {
    user: null,
    isAuthenticated: false,
    isPro: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signInSuccess : (state,action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.isPro = action.payload.user.isPremium || false;
        },
        logOut : (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isPro = false;
        },
        setPro : (state, action) => {
            state.isPro = action.payload.user.isPremium || false;
        }
    }
})

export const { signInSuccess, logOut, setPro } = authSlice.actions;
export default authSlice.reducer;