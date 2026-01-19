import { apiSlice } from "./ApiSlice";

export const CompanyProfileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET Company Profile (Auto-Fill)
    getCompanyProfile: builder.query({
      query: (email) => ({
        url: `/api/uatcompany/companyprofile?email=${email}`,
        method: "GET",
      }),
      providesTags: ["CompanyProfile"],
    }),

    // UPDATE Company Profile (Multipart/FormData)
    updateCompanyProfile: builder.mutation({
      query: (formData) => ({
        url: `/api/uatcompany/updatecompanyprofile`,
        method: "POST",
        body: formData, // FormData here
      }),
      invalidatesTags: ["CompanyProfile"],
    }),
  }),
});

export const { useGetCompanyProfileQuery, useUpdateCompanyProfileMutation } =
  CompanyProfileApiSlice;
