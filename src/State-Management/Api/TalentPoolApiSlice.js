import { apiSlice } from "./ApiSlice";

const TalentPoolApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    talentPool: builder.mutation({
      query: (payload) => ({
        url: "/api/ProfileBuilder/getfindtalent",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useTalentPoolMutation } = TalentPoolApiSlice;
