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
        const user = (getState() as any).auth.user;
        
        // 1. Optimistic Update (Immediate)
        const tempId = Date.now().toString();
        const optimisticMessage = {
          _id: tempId,
          content,
          sender: user,
          createdAt: new Date().toISOString(),
        };

        const patchResult = dispatch(
          chatApi.util.updateQueryData('getMessages' as any, chatId, (draft: any) => {
            const list = draft?.data || (Array.isArray(draft) ? draft : null);
            if (list) {
              list.push(optimisticMessage);
            }
          })
        );

        try {
          // 2. Wait for server response
          const { data: response } = await queryFulfilled;
          const realMessage = response.data || response;

          // 3. Update cache with real server data (Replace optimistic)
          dispatch(
            chatApi.util.updateQueryData('getMessages' as any, chatId, (draft: any) => {
              const list = draft?.data || (Array.isArray(draft) ? draft : null);
              if (list) {
                // Find and replace the optimistic message or just push the real one
                const index = list.findIndex((m: any) => m._id === tempId);
                if (index !== -1) {
                  list[index] = realMessage;
                } else {
                  // If not found (maybe socket already added it), ensure it's there
                  const exists = list.some((m: any) => (m._id || m.id) === (realMessage._id || realMessage.id));
                  if (!exists) list.push(realMessage);
                }
              }
            })
          );
        } catch {
          // 4. Rollback on failure
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { chatId }) => [
        'Chat', // Still invalidate chat list to show last message
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
