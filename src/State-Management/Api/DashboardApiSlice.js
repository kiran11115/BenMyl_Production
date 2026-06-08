import { apiSlice } from "./ApiSlice";

const DashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecruiterGraph: builder.query({
  query: () => ({
    url: "api/uatcompany/GetRecruiterGraphapi",
    method: "GET",
  }),
}),

getDashboardStats: builder.query({
  query: () => ({
    url: "api/uatcompany/dashboard",
    method: "GET",
  }),
}),

getAutonomousActivityLog: builder.query({
  query: () => ({
    url: "api/uatcompany/GetAutonomousActivityLog",
    method: "GET",
  }),
}),

getMonthlyAnalytics: builder.query({
  query: () => ({
    url: "api/uatcompany/monthly-analytics",
    method: "GET",
  }),
}),

getPostedMonthlyAnalytics: builder.query({
      query: () => ({
        url: "api/uatcompany/monthly-analytics_hiringmanager",
        method: "GET",
      }),
    }),

  }),
});

export const { useGetRecruiterGraphQuery,useGetDashboardStatsQuery,useGetAutonomousActivityLogQuery,useGetMonthlyAnalyticsQuery,useGetPostedMonthlyAnalyticsQuery } = DashboardApiSlice;