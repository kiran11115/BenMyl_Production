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
  }),
});

export const { useAdmindetailsMutation, useGetAdminDetailsQuery,useGetTeamMembersQuery  } =
  AdminDetailsApiSlice;
