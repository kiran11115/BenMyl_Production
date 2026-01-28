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

getGroupedJobTitles: builder.query({
  query: (userId) => ({
    url: `/api/uatcompany/getalljobs?userId=${userId}`,
    method: "GET",
  }),
  providesTags: ["JobFilter"],
}),

getJobById: builder.query({
  query: ({ jobId, userId }) => ({
    url: `/api/uatcompany/getalljobs?jobId=${jobId}&userId=${userId}`,
    method: "GET",
  }),
}),

  }),
});

export const { useTalentPoolMutation,useLazyGetEmployeeTalentProfileQuery,useGetGroupedJobTitlesQuery,useLazyGetJobByIdQuery } = TalentPoolApiSlice;
