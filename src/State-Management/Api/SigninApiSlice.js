import { apiSlice } from "./ApiSlice";

const SigninApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (Credentials) => ({
        url: "/api/Account/NewLoginform",
        method: "POST",
        body: { ...Credentials },
      }),
    }),

    masterLogin: builder.mutation({
      query: (data) => ({
        url: "/api/Account/MasterLogin",
        method: "POST",
        body: data,
      }),
    }),

  }),
});


export const {useSigninMutation,useMasterLoginMutation} = SigninApiSlice;