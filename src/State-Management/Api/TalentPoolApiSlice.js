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
  providesTags: ["EditQuick"],
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

 sendInviteNotification: builder.mutation({
      query: (payload) => ({
        url: "/api/Account/uatnotificationsend",
        method: "POST",
        body: payload,
      }),
    }),

    getRecommendJobsList: builder.mutation({
  query: (payload) => ({
    url: "/api/uatcompany/getrecommendjosblist",
    method: "POST",
    body: payload,
  }),
}),

getAllRoleNames: builder.query({
  query: (userId) => ({
    url: `/api/uatcompany/getallRoleNames?userId=${userId}`,
    method: "GET",
  }),
}),

// TalentPoolApiSlice.js

addEmployeeProfessionalDetails: builder.mutation({
  query: (body) => ({
    url: "/api/uatcompany/EmployeeProfessionalDetailsModel",
    method: "POST",
    body,
  }),
  invalidatesTags: ["EditQuick"],
}),

getEmployeeProfessionalDetails: builder.query({
  query: (employeeId) => ({
    url: `/api/uatcompany/GetProfessionalDetails?employeeId=${employeeId}`,
    method: "GET",
  }),
  providesTags: ["EditQuick"],
}),


  }),
});

export const { useTalentPoolMutation,useLazyGetEmployeeTalentProfileQuery,useGetGroupedJobTitlesQuery,useLazyGetJobByIdQuery,useSendInviteNotificationMutation,useGetRecommendJobsListMutation,useGetAllRoleNamesQuery,useAddEmployeeProfessionalDetailsMutation,useGetEmployeeProfessionalDetailsQuery } = TalentPoolApiSlice;
