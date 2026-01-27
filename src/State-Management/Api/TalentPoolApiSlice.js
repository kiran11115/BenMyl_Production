import { apiSlice } from "./ApiSlice";

const TalentPoolApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    talentPool: builder.mutation({
      query: (payload) => ({
        url: "/api/ProfileBuilder/getfindtalent",
        method: "POST",
        body: payload,
      }),
    }),

    getEmployeeTalentProfile: builder.query({
  query: (employeeId) => ({
    url: `/api/Employee/GetApprovalEmployeeby_id?employeeid=${employeeId}`,
    method: "GET",
  }),
}),

  }),
});

export const { useTalentPoolMutation,useLazyGetEmployeeTalentProfileQuery } = TalentPoolApiSlice;
