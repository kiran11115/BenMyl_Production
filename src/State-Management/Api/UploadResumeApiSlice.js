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
      
    }),

    approvedEmployee: builder.mutation({
  query: (formData) => ({
    url: "/api/uatcompany/approvedEmployee",
    method: "POST",
    body: formData,
  }),
}),

  }),
});

export const { useUploadProfilesMutation,useGetQueueManagementMutation,useGetEmployeeResumeQuery,useApprovedEmployeeMutation } = UploadResumeApiSlice;
