import { apiSlice } from "./ApiSlice";

const ChatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    chatListDetails: builder.query({
      query: () => ({
        url: "/api/Chat/chat-users",
        method: "GET",
      }),
    }),

    chatMessages: builder.query({
      query: (conversationId ) => ({
        url: `api/Chat/messages/${conversationId }`,
        method: "GET",
      }),
    }),

    chatUsersList: builder.query({
      query: (userId) => ({
        url: `api/Chat/chat-list/${userId}`,
        method: "GET",
      }),
    }),

    startConversation: builder.mutation({
      query: ({ user1, user2 }) => ({
        url: `/api/Chat/start-conversation?user1=${user1}&user2=${user2}`,
        method: "POST",
      }),
    }),

    sendMessage: builder.mutation({
      query: (body) => ({
        url: "/api/Chat/send-message",
        method: "POST",
        body,
      }),
    }),

    getFAQs: builder.query({
  query: () => ({
    url: "/api/uatcompany/FAQS_Answers",
    method: "GET",
  }),
}),

  }),
});

export const {
  useChatListDetailsQuery,
  useChatMessagesQuery,
  useChatUsersListQuery,
  useStartConversationMutation,
  useSendMessageMutation,
  useGetFAQsQuery
} = ChatApiSlice;