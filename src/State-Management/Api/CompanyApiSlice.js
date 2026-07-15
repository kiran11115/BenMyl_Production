import { apiSlice } from "./ApiSlice";

const CompanyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    companyDetails: builder.mutation({
      query: (companyData) => ({
        url: "/api/Company/saveNewemployee",
        method: "POST",
        body: companyData,
      }),
    }),
    getCompanyList: builder.query({
      query: () => ({
        url: "/api/Account/getcompanylist",
        method: "GET",
      }),
    }),
    getCompanyUsers: builder.query({
      query: (companyId) => ({
        url: `/api/Account/GetCompanyUsers/${companyId}`,
        method: "GET",
      }),
    }),
    getCompanyJobList: builder.query({
      query: (userId) => ({
        url: `/api/Account/GetCompanyJobList/${userId}`,
        method: "GET",
      }),
    }),
    getInterviewSchedules: builder.query({
      query: (userId) => ({
        url: `/api/Account/GetInterviewSchedules?userId=${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { 
  useCompanyDetailsMutation, 
  useGetCompanyListQuery,
  useGetCompanyUsersQuery,
  useLazyGetCompanyUsersQuery,
  useGetCompanyJobListQuery,
  useLazyGetCompanyJobListQuery,
  useGetInterviewSchedulesQuery,
  useLazyGetInterviewSchedulesQuery
} = CompanyApiSlice;


