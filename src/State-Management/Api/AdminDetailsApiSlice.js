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

    requestTokens: builder.mutation({
      query: (payload) => ({
        url: "/api/uatcompany/RequestTokens",
        method: "POST",
        body: payload,
      }),
    }),

    getTokenRequestList: builder.query({
      query: (companyId) => ({
        url: `/api/uatcompany/GetTokenRequestList/${companyId}`,
        method: "GET",
      }),
    }),

    getCompanyUserTokenList: builder.query({
      query: (companyId) => ({
        url: `/api/uatcompany/GetCompanyUserTokenList?companyId=${companyId}`,
        method: "GET",
      }),
    }),

    approveTokenRequest: builder.mutation({
      query: (payload) => ({
        url: "/api/uatcompany/ApproveTokenRequest",
        method: "POST",
        body: payload,
      }),
    }),

    rejectTokenRequest: builder.mutation({
      query: (payload) => ({
        url: "/api/uatcompany/RejectTokenRequest",
        method: "POST",
        body: payload,
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
  useRequestTokensMutation,
  useGetTokenRequestListQuery,
  useApproveTokenRequestMutation,
  useRejectTokenRequestMutation,
  useGetCompanyUserTokenListQuery,
} = AdminDetailsApiSlice;
