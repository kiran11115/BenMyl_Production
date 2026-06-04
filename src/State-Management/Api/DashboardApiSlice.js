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

  }),
});

export const { useGetRecruiterGraphQuery,useGetDashboardStatsQuery,useGetAutonomousActivityLogQuery } = DashboardApiSlice;