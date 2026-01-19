import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
 
const baseQuery = fetchBaseQuery({
  baseUrl: "https://webapidev.benmyl.com",
 
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
 
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
 
    headers.set("Content-Type", "application/json");
 
    return headers;
  },
});
 
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Talent",
    "Projects",
    "Jobs",
    "UserProfile",
    "TalentProfile",
    "CompanyProfile"
  ],
  endpoints: () => ({}),
});
