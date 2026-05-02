import { useEffect } from 'react';
import { socketService } from '../utils/socket';
import { chatApi } from '../redux/features/chat/chatApi';
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
        chatApi.util.updateQueryData('getMessages' as any, chatId as any, (draft: any) => {
          const processData = (data: any[]) => {
            const exists = data.some((m: any) => (m._id || m.id) === (message._id || message.id));
            if (!exists) {
              data.push(message);
            }
          };

          if (draft && draft.data && Array.isArray(draft.data)) {
            processData(draft.data);
          } else if (Array.isArray(draft)) {
            processData(draft);
          }
        })
      );
      
      // Also invalidate chats to update last message in the list
      dispatch(chatApi.util.invalidateTags(['Chat']) as any);
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
