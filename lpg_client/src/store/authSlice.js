import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isLoggedIn: false,
    isPro: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signInSuccess : (state,action) => {
            state.user = action.payload.user;
            state.isLoggedIn = true;
            state.isPro = action.payload.user?.isPremium || false;
        },
        logOut : (state) => {
            state.user = null;
            state.isLoggedIn = false;
            state.isPro = false;
        },
        setPro : (state) => {
            state.isPro = true;
        },
        setUser : (state, action) => {
            state.user = action.payload.user;
        }
    }
})

export const { signInSuccess, logOut, setPro,setUser } = authSlice.actions;
export default authSlice.reducer;