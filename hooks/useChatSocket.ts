import { useEffect } from 'react';
import { socketService } from '../utils/socket';
import { baseApi } from '../redux/hooks/baseApi';
import { useAppDispatch } from '../redux/hooks';

export const useChatSocket = (chatId?: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = socketService.connect();

    if (chatId) {
      socket.emit('join_chat', chatId);
    }

    socket.on('new_message', (message) => {
      // Manually update the cache for getMessages query
      dispatch(
        baseApi.util.updateQueryData('getMessages' as any, chatId as any, (draft: any) => {
          // Ensure draft.data exists and the message isn't already there
          if (draft?.data) {
            const exists = draft.data.some((m: any) => (m._id || m.id) === (message._id || message.id));
            if (!exists) {
              draft.data.push(message);
            }
          }
        })
      );
      
      // Also invalidate chats to update last message in the list
      dispatch(baseApi.util.invalidateTags(['Chat']));
    });

    return () => {
      if (chatId) {
        // socket.emit('leave_chat', chatId); // If backend supports it
      }
      socket.off('new_message');
    };
  }, [chatId, dispatch]);

  return socketService;
};
