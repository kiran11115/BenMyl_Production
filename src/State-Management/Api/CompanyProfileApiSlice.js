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

    getCompanyProfileEdit: builder.query({
      query: (emailId) => ({
        url: `/api/uatcompany/companyprofile?Emailid=${emailId}`,
        method: "GET",
      }),
      providesTags: ["CompanyProfile"],
    }),

    getUserNotifications: builder.query({
      query: (userId) => ({
        url: `/api/Account/user/${userId}`,
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),

    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `/api/Account/mark-read/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetCompanyProfileQuery,
  useUpdateCompanyProfileMutation,
  useGetCompanyProfileEditQuery,
  useGetUserNotificationsQuery,
  useMarkNotificationAsReadMutation,
} = CompanyProfileApiSlice;
