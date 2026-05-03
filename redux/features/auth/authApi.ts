import { baseApi } from '../../hooks/baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/login',
        method: 'POST',
        body: userInfo,
      }),
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/register',
        method: 'POST',
        body: userInfo,
      }),
    }),
    
    getMe: builder.query({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
    resendOTP: builder.mutation({
      query: (data) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    toggleOnline: builder.mutation({
      query: (data) => ({
        url: '/users/toggle-online',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateLocation: builder.mutation({
      query: (data) => ({
        url: '/users/update-location',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    banUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}/ban`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useGetAllUsersQuery,
  useToggleOnlineMutation,
  useUpdateLocationMutation,
  useBanUserMutation,
} = authApi;
