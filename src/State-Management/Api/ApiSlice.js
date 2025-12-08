import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://webapidev.benmyl.com",
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [
    "Projects",
    "Project", // individual project
    "Bench",
    "BenchItem", // individual bench record
    "UserProfile",
    "UserRoles",
    "BulkResumes",
  ],
  endpoints: (builder) => ({}),
});
