import { configureStore } from "@reduxjs/toolkit";
import ownerReducer from "./ownerSlice.js";
import userReducer from "./userSlice.js"
export const store = configureStore({
  reducer: {
    owner: ownerReducer,
    user:userReducer,
  },
});