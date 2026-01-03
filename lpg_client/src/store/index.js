import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import pathReducer from "./pathSlice";
import uiReducer from "./uiSlice";
import { persistStore,
         persistReducer,
        FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from "redux-persist";
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
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], }, }),
})

export const persistor = persistStore(store);