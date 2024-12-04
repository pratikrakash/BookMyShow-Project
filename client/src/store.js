import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./slice/UserSlice";
import LoaderReducer from "./slice/LoaderSlice";
export const store=configureStore({
    reducer:{
        User:UserReducer,
        Loader:LoaderReducer
    }
})