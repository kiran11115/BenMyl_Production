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

  }),
});

export const { useUploadProfilesMutation,useGetQueueManagementMutation } = UploadResumeApiSlice;
