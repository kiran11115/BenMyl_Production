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

    getFindJobs: builder.mutation({
      query: (payload) => ({
        url: "/api/ProfileBuilder/getuatfindjobs",
        method: "POST",
        body: payload,
      }),
    }),

  generateJobDescriptionAI: builder.mutation({
  query: (body) => ({
    url: "/api/uatcompany/GenerateJobDescriptionAI",
    method: "POST",
    body,
  }),
}),

  getEmployeesByTitle: builder.query({
  query: (title) => ({
    url: 'api/uatcompany/GetEmployeesByTitle',
    params: { title },
    method: "GET",
  }),
}),

getSkillsByTitle: builder.query({
  query: (title) => ({
    url: "api/uatcompany/GetSkillsByTitle",
    params: { title },
    method: "GET",
  }),
}),


  }),
});

export const { usePostJobMutation, useSaveJobDraftMutation,useGetFindJobsMutation,useGenerateJobDescriptionAIMutation, useGetEmployeesByTitleQuery,  useGetSkillsByTitleQuery,
 } = ProjectApiSlice;
