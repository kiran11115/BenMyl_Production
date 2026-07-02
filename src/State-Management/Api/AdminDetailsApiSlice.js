import { apiSlice } from "./ApiSlice";

const AdminDetailsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    admindetails: builder.mutation({
      query: (formData) => ({
        url: "/api/Company/savecompanyreg",
        method: "POST",
        body: formData,
      }),
    }),

    getAdminDetails: builder.query({
      query: (emailID) => ({
        url: `/api/Company/Getcompanyreg?Emailid=${emailID}`,
        method: "GET",
      }),
    }),

    getTeamMembers: builder.query({
      query: (emailID) => ({
        url: `/api/Account/uatinviteuser?Emailid=${emailID}`,
        method: "GET",
      }),
    }),

    shareTokens: builder.mutation({
      query: (payload) => ({
        url: "/api/uatcompany/ShareTokens",
        method: "POST",
        body: payload,
      }),
    }),

    getTokenDashboard: builder.query({
      query: () => ({
        url: "/api/uatcompany/GetTokenDashboard",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAdmindetailsMutation,
  useGetAdminDetailsQuery,
  useGetTeamMembersQuery,
  useShareTokensMutation,
  useGetTokenDashboardQuery,
} = AdminDetailsApiSlice;
