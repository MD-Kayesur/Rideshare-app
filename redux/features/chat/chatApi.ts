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
        const tempId = `temp-${Date.now()}`;
        
        const optimisticMessage = {
          _id: tempId,
          content,
          sender: user,
          createdAt: new Date().toISOString(),
        };

        // 1. Add optimistic message
        const patchResult = dispatch(
          chatApi.util.updateQueryData('getMessages' as any, chatId, (draft: any) => {
            const list = draft?.data || (Array.isArray(draft) ? draft : null);
            if (list) {
              list.push(optimisticMessage);
            }
          })
        );

        try {
          const { data: response } = await queryFulfilled;
          const realMessage = response.data || response;

          // 2. Replace optimistic with real data
          dispatch(
            chatApi.util.updateQueryData('getMessages' as any, chatId, (draft: any) => {
              const list = draft?.data || (Array.isArray(draft) ? draft : null);
              if (list) {
                // Remove the optimistic one
                const index = list.findIndex((m: any) => m._id === tempId);
                if (index !== -1) {
                  list.splice(index, 1);
                }
                // Add the real one if it's not already there (e.g. from socket)
                const realId = (realMessage._id || realMessage.id || '').toString();
                const exists = list.some((m: any) => 
                  (m._id || m.id || '').toString() === realId
                );
                
                if (!exists) {
                  list.push(realMessage);
                }
              }
            })
          );
        } catch {
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
