import { configureStore } from "@reduxjs/toolkit";
import ownerReducer from "./ownerSlice.js";

export const store = configureStore({
  reducer: {
    owner: ownerReducer,
  },
});