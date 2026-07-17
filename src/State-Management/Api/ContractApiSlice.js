import { apiSlice } from "./ApiSlice";

export const ContractApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        saveContract: builder.mutation({
            query: (formData) => ({
                url: "/api/uatcompany/save-contract",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Contracts"],
        }),
        getAllContracts: builder.query({
            query: () => ({
                url: "/api/uatcompany/get-all-contracts",
                method: "GET",
            }),
            providesTags: ["Contracts"],
        }),
        getContractsByBenchsales: builder.query({
            query: (userId) => ({
                url: `/api/uatcompany/get-contracts-by-benchsales/${userId}`,
                method: "GET",
            }),
            providesTags: ["Contracts"],
        }),
        getContractById: builder.query({
            query: (contractID) => ({
                url: `/api/uatcompany/get-contract-by-id/${contractID}`,
                method: "GET",
            }),
            providesTags: (result, error, contractID) => [{ type: "Contracts", id: contractID }],
        }),
        getNotificationsByJobId: builder.query({
            query: (jobId) =>
                `api/Account/GetNotificationsByJobId?jobId=${jobId}`,
        }),
        getContractNotifications: builder.query({
  query: (userId) => ({
    url: `/api/Account/GetContractNotifications?userId=${userId}`,
    method: "GET",
  }),
}),
requestExtension: builder.mutation({
  query: (data) => ({
    url: "/api/uatcompany/RequestExtension",
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Contracts"],
}),
getExtensionRequests: builder.query({
  query: (userId) => ({
    url: `/api/uatcompany/GetExtensionRequests?userId=${userId}`,
    method: "GET",
  }),
  providesTags: ["Contracts"],
}),
approveExtension: builder.mutation({
  query: (data) => ({
    url: "/api/uatcompany/ApproveExtension",
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Contracts"],
}),
    }),
});

export const {
    useSaveContractMutation,
    useGetAllContractsQuery,
    useGetContractByIdQuery,
    useGetContractsByBenchsalesQuery,
    useLazyGetNotificationsByJobIdQuery,
    useGetContractNotificationsQuery,
    useRequestExtensionMutation,
    useGetExtensionRequestsQuery,
    useApproveExtensionMutation,
} = ContractApiSlice;
