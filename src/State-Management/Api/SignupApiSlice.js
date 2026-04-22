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

    resendOtp: builder.mutation({
      query: (emailID) => ({
        url: "/api/Account/resend-otp",
        method: "POST",
        body: `"${emailID}"`, // RAW STRING body
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    inviteUser: builder.mutation({
  query: (formData) => ({
    url: "/api/Account/uatinviteUsers",
    method: "POST",
    body: formData, // ✅ FormData
  }),
}),
  }),
});

export const {
  useRegisterMutation,
  useOtpVerifyMutation,
  useResendOtpMutation,
  useInviteUserMutation
} = SignupApiSlice;
