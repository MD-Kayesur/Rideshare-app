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
          draft.push(message);
        })
      );
      
      // Also invalidate chats to update last message
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
