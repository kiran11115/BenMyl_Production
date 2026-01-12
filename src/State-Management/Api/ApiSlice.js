import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://webapidev.benmyl.com",
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [
    "Talent",
    "Projects",
    "Jobs",
    "UserProfile",
    "TalentProfile"
  ],
  endpoints: (builder) => ({}),
});
