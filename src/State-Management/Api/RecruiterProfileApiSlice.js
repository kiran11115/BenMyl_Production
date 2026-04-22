import { apiSlice } from "./ApiSlice";

export const RecruiterProfileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getRecruiterProfile: builder.query({
    //   query: (userId) => ({
    //     url: `api/uatcompany/getrecutierProfile?id=${userId}`, // ✅ EXACT Swagger path
    //     method: "GET",
    //   }),
    //   providesTags: ["RecruiterProfile"],
    // }),

    getRecruiterProfile: builder.query({
      query: (id) => ({
        url: "/api/uatcompany/getrecutierProfile",
        method: "GET",
        params: { id },
      }),
      providesTags:["RecruiterProfile"]
    }),

    updateRecruiterProfile: builder.mutation({
      query: (formData) => ({
        url: "/api/uatcompany/UpdaterecutierProfile",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["RecruiterProfile"],
    }),
  }),
});

export const {
  useGetRecruiterProfileQuery,
  useUpdateRecruiterProfileMutation,
} = RecruiterProfileApiSlice;
