import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./Api/ApiSlice";
import authSliceReducer from "./Slice/AuthSlice";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
