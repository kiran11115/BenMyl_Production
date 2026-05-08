import { apiSlice } from "./ApiSlice";

export const ScheduleInterviewApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        scheduleInterview: builder.mutation({
            query: (formData) => ({
                url: "/api/uatcompany/Interview scheduled",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Scheduled"],
        }),

        schedulesDetails: builder.query({
            query: (recruiterId) => ({
                url: `api/uatcompany/InterviewSchedule/${recruiterId}`,
                method: "GET",
            }),
            providesTags: ["Scheduled"],
        }),

    }),
});

export const { useScheduleInterviewMutation,useSchedulesDetailsQuery } = ScheduleInterviewApiSlice;
