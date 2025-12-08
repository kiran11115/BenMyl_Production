import { apiSlice } from "./ApiSlice";

const SignupApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (Credentials) => ({
        url: "/api/Account/userSignup",
        method: "POST",
        body: { ...Credentials },
      }),
    }),

    otpVerify: builder.mutation({
      query: (verificationData) => ({
        url: "/api/Account/vcodeverifi",
        method: "POST",
        body: verificationData,
      }),
    }),
  }),
});

export const { useRegisterMutation, useOtpVerifyMutation } = SignupApiSlice;
