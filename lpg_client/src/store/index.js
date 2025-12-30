import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import pathReducer from "./pathSlice";
import uiReducer from "./uiSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const authPersistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authReducer
);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        path: pathReducer,
        ui: uiReducer,
    }
})

export const persistor = persistStore(store);