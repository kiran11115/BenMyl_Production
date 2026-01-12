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
  }),
});


export const {useSigninMutation} = SigninApiSlice;