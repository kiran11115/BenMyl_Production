import { apiSlice } from "./ApiSlice";

const UploadResumeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadProfiles: builder.mutation({
      query: (formData) => ({
        url: "/api/ProfileBuilder/uatuploadProfiles",
        method: "POST",
        body: formData,
      }),
    }),

    getQueueManagement: builder.mutation({
      query: (payload) => ({
        url: "/api/ProfileBuilder/getQueManagement",
        method: "POST",
        body: payload,
      }),
    }),

    getEmployeeResume: builder.query({
      query: (employeeID) => ({
        url: `/api/Employee/Get_employeeprofile_id?employeeID=${employeeID}`,
        method: "GET",
      }),
      providesTags: ["ResumeUpdate"],
    }),

    approvedEmployee: builder.mutation({
  query: (formData) => ({
    url: "/api/uatcompany/approvedEmployee",
    method: "POST",
    body: formData,
  }),
}),

draftProfileEmployee: builder.mutation({
  query: (formData) => ({
    url: "/api/uatcompany/draftprofilizer_update",
    method: "POST",
    body: formData,
  }),
  invalidatesTags: ["ResumeUpdate"],
}),

getMyBench: builder.mutation({
      query: (body) => ({
        url: "api/ProfileBuilder/getMyBench",
        method: "POST",
        body,
      }),
    }),

  }),
});

export const { useUploadProfilesMutation,useGetQueueManagementMutation,useGetEmployeeResumeQuery,useApprovedEmployeeMutation,useGetMyBenchMutation,useDraftProfileEmployeeMutation  } = UploadResumeApiSlice;
