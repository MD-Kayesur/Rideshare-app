import { baseApi } from '../../hooks/baseApi';

const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyChats: builder.query({
      query: () => '/chats/my-chats',
      providesTags: ['Chat'],
    }),
    getMessages: builder.query({
      query: (chatId) => `/chats/${chatId}/messages`,
      providesTags: (result, error, chatId) => [{ type: 'Message', id: chatId }],
    }),
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: '/chats/message',
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Message', id: chatId },
        'Chat',
      ],
    }),
    createChat: builder.mutation({
      query: (chatData) => ({
        url: '/chats',
        method: 'POST',
        body: chatData,
      }),
      invalidatesTags: ['Chat'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMyChatsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useCreateChatMutation,
} = chatApi;
