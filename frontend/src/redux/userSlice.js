import { createSlice } from "@reduxjs/toolkit";


let storedUser = null;
try {
  const data = localStorage.getItem("userData");
  if (data && data !== "undefined" && data !== "null") {
    storedUser = JSON.parse(data);
  }
} catch (error) {
  console.error("Error parsing userData from localStorage:", error);
  localStorage.removeItem("userData");
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: storedUser,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    clearUserData: (state) => {
      state.userData = null;
      localStorage.removeItem("userData");
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
