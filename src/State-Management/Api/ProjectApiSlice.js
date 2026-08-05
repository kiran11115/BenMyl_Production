import { apiSlice } from "./ApiSlice";

export const ProjectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* =======================
       POST JOB (FINAL SUBMIT - US VERSION)
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
       SAVE JOB POSTING (INDIA VERSION - JSON)
    ======================= */
    saveJobPosting: builder.mutation({
      query: (payload) => ({
        url: "/api/uatcompany/SaveJobPosting",
        method: "POST",
        body: payload,
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

    getFindJobsInd: builder.mutation({
      query: (payload) => ({
        url: "/api/ProfileBuilder/getuatfindjobs_ind",
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

    placeBid: builder.mutation({
      query: (payload) => ({
        url: "api/uatcompany/JobPostBidModel",
        method: "POST",
        body: payload,
      }),
    }),

    getJobBids: builder.query({
      query: (jobId) => ({
        url: `api/uatcompany/employee-emails/${jobId}`,
        method: "GET",
      }),
    }),

  }),
});

export const {
  usePostJobMutation,
  useSaveJobPostingMutation,
  useSaveJobDraftMutation,
  useGetFindJobsMutation,
  useGetFindJobsIndMutation,
  useGenerateJobDescriptionAIMutation,
  useGetEmployeesByTitleQuery,
  useGetSkillsByTitleQuery,
  usePlaceBidMutation,
  useGetJobBidsQuery
} = ProjectApiSlice;

