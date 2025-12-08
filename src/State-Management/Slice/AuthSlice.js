import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
  name: "auth",
  initialState: {
    authToken: localStorage.getItem("token") || null,
    userEmail: null,
  },

  reducers: {
    setCredentials: (state, action) => {
      const { token, emailID } = action.payload;

      state.authToken = token || null;
      state.userEmail = emailID || null;

      if (token) {
        localStorage.setItem("token", token);
      }
    },

    logOut: (state) => {
      state.authToken = null;
      state.userEmail = null;

      localStorage.removeItem("token");
    },
  },
});

// Export actions
export const { setCredentials, logOut } = authSlice.actions;

// Selectors
export const selectAuthToken = (state) => state.auth.authToken;
export const selectUserEmail = (state) => state.auth.userEmail;

export default authSlice.reducer;
