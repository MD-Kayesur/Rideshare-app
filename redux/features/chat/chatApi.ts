import { baseApi } from '../../hooks/baseApi';

export const chatApi = baseApi.injectEndpoints({
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
      async onQueryStarted({ chatId, content }, { dispatch, queryFulfilled, getState }) {
        // Optimistic update
        const user = (getState() as any).auth.user;
        const patchResult = dispatch(
          chatApi.util.updateQueryData('getMessages' as any, chatId, (draft: any) => {
            if (draft?.data) {
              draft.data.push({
                _id: Date.now().toString(),
                content,
                sender: user,
                createdAt: new Date().toISOString(),
              });
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
