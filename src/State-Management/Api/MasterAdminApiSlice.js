import { apiSlice } from "./ApiSlice";

const MasterAdminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendTemplateMail: builder.mutation({
  query: (body) => ({
    url: "/api/Account/SendTemplateMail",
    method: "POST",
    body,
  }),
}),

  }),
});


export const {useSendTemplateMailMutation} = MasterAdminApiSlice;