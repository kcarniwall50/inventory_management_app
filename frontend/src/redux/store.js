import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/auth/AuthSlice'
import filterSlice from "./features/filterSlice";
import productReducer from './features/ProductSlice'
export const store= configureStore({
  reducer:{
         auth:authReducer,
         product:productReducer,
         filter: filterSlice
  }
})