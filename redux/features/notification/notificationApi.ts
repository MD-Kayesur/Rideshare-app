import { baseApi } from '../../hooks/baseApi';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query<any, void>({
      query: () => ({
        url: '/notifications/me',
        method: 'GET',
      }),
      providesTags: ['Notification'],
    }),
    getAllNotifications: builder.query<any, void>({
      query: () => ({
        url: '/notifications',
        method: 'GET',
      }),
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation<any, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation<any, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteAllNotifications: builder.mutation<any, void>({
      query: () => ({
        url: '/notifications',
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useGetAllNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationApi;
