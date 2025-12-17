import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import pathReducer from "./pathSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        path: pathReducer,
        ui: uiReducer,
    }
})