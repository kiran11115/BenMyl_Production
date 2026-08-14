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

    getRequiterDashboard: builder.query({
      query: ({ companyId, userId }) => ({
        url: "api/uatcompany/GetrequiterDashboard",
        method: "GET",
        params: { companyId, userId },
      }),
    }),

    getHiringDashboard: builder.query({
      query: (userId) => ({
        url: "api/uatcompany/GethiringDashboard",
        method: "GET",
        params: { userId },
      }),
    }),

    getCardsAnalytics: builder.query({
      query: (params) => {
        const companyId = typeof params === "object" ? params?.companyId : params;
        return {
          url: "api/uatcompany/cards",
          method: "GET",
          params: companyId ? { companyId } : {},
        };
      },
    }),

  }),
});

export const { useGetRecruiterGraphQuery,useGetDashboardStatsQuery,useGetAutonomousActivityLogQuery,useGetMonthlyAnalyticsQuery,useGetPostedMonthlyAnalyticsQuery,useGetRequiterDashboardQuery,useGetHiringDashboardQuery,useGetCardsAnalyticsQuery } = DashboardApiSlice;