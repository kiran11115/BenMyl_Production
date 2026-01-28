import { apiSlice } from "./ApiSlice";

export const ProjectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* =======================
       POST JOB (FINAL SUBMIT)
    ======================= */
    postJob: builder.mutation({
      query: (formData) => ({
        url: "/api/uatcompany/postjob",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["JobFilter"],
    }),

    /* =======================
       SAVE JOB AS DRAFT
    ======================= */
    saveJobDraft: builder.mutation({
      query: (formData) => ({
        url: "/api/uatcompany/save-draft",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { usePostJobMutation, useSaveJobDraftMutation } = ProjectApiSlice;
