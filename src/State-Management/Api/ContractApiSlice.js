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
    }),
});

export const {
    useSaveContractMutation,
    useGetAllContractsQuery,
    useGetContractByIdQuery,
    useGetContractsByBenchsalesQuery,
    useLazyGetNotificationsByJobIdQuery,
    useGetContractNotificationsQuery
} = ContractApiSlice;
