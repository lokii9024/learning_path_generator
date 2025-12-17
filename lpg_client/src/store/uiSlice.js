import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading : false,
    error: null,
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setLoading : (state, action) => {
            state.loading = action.payload.loading;
        },
        setError : (state, action) => {
            state.error = action.payload.error;
        },
        clearError : (state) => {
            state.error = null;
        },
    }
})

export const {
    setLoading,
    setError,
    clearError,
} = uiSlice.actions;
export default uiSlice.reducer;