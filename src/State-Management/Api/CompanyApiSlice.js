import { apiSlice } from "./ApiSlice";

const CompanyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    companyDetails: builder.mutation({
      query: (companyData) => ({
        url: "/api/Company/saveNewemployee",
        method: "POST",
        body: companyData,
      }),
    }),
  }),
});

export const { useCompanyDetailsMutation } = CompanyApiSlice;
