import { createSlice } from "@reduxjs/toolkit";

// ✅ Safely read and parse localStorage
let storedOwner = null;
try {
  const data = localStorage.getItem("ownerData");
  if (data && data !== "undefined" && data !== "null") {
    storedOwner = JSON.parse(data);
  }
} catch (error) {
  console.error("Error parsing ownerData from localStorage:", error);
  localStorage.removeItem("ownerData"); // clear corrupted value
}

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
