import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authToken: localStorage.getItem("token") || null,
  userEmail: localStorage.getItem("email") || null,
  userRole: localStorage.getItem("role") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (state, action) => {
      const { token, emailID, role } = action.payload;

      state.authToken = token || null;
      state.userEmail = emailID || null;
      state.userRole = role || null;

      if (token) localStorage.setItem("token", token);
      if (emailID) localStorage.setItem("email", emailID);
      if (role) localStorage.setItem("role", role);
    },

    logOut: (state) => {
      state.authToken = null;
      state.userEmail = null;
      state.userRole = null;

      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export const selectAuthToken = (state) => state.auth.authToken;
export const selectUserEmail = (state) => state.auth.userEmail;
export const selectUserRole = (state) => state.auth.userRole;
export default authSlice.reducer;
