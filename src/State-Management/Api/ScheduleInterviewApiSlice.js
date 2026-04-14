import { apiSlice } from "./ApiSlice";

export const ScheduleInterviewApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        scheduleInterview: builder.mutation({
            query: (formData) => ({
                url: "/api/uatcompany/Interview scheduled",
                method: "POST",
                body: formData,
            }),
        }),
    }),
});

export const { useScheduleInterviewMutation } = ScheduleInterviewApiSlice;
