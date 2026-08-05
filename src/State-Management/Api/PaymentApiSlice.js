import { apiSlice } from "./ApiSlice";

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: (body) => ({
        url: "/api/Payment/create",
        method: "POST",
        body,
      }),
    }),

    confirmPayment: builder.mutation({
      query: (body) => ({
        url: "/api/Payment/UpdatePaymentStatus",
        method: "POST",
        body,
      }),
    }),

    getPaymentHistory: builder.query({
      query: (userId) => ({
        url: `/api/Payment/GetPaymentHistory/${userId}`,
        method: "GET",
      }),
    }),

    getBillingSummary: builder.query({
      query: (userId) => ({
        url: `/api/Payment/GetBillingSummary/${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useConfirmPaymentMutation,
  useGetPaymentHistoryQuery,
  useGetBillingSummaryQuery,
} = paymentApi;