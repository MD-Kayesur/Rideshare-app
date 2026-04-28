import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getItem } from './storage';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api/v1', // Update this with your actual backend URL
  prepareHeaders: async (headers) => {
    const token = await getItem('accessToken');
    if (token) {
      headers.set('authorization', `${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQuery,
  tagTypes: ['User', 'Ride', 'Chat', 'Message'],
  endpoints: () => ({}),
});
