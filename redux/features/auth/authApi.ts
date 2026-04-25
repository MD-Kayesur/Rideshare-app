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
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useVerifyOTPMutation,
  useResendOTPMutation,
} = authApi;
