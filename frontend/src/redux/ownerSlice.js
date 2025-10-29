import { createSlice } from "@reduxjs/toolkit";

const storedOwner = localStorage.getItem("ownerData")
  ? JSON.parse(localStorage.getItem("ownerData"))
  : null;

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    ownerData: storedOwner,
  },
  reducers: {
    setOwnerData: (state, action) => {
      state.ownerData = action.payload;
      localStorage.setItem("ownerData", JSON.stringify(action.payload));
    },
    clearOwnerData: (state) => {
      state.ownerData = null;
      localStorage.removeItem("ownerData");
    },
  },
});

export const { setOwnerData, clearOwnerData } = ownerSlice.actions;
export default ownerSlice.reducer;
