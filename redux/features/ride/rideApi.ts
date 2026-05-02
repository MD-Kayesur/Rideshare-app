import { baseApi } from '../../hooks/baseApi';

export const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRide: builder.mutation({
      query: (data) => ({
        url: '/rides',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Ride'],
    }),
    getAllRides: builder.query({
      query: (params) => ({
        url: '/rides',
        method: 'GET',
        params,
      }),
      providesTags: ['Ride'],
    }),
    getSingleRide: builder.query({
      query: (id) => ({
        url: `/rides/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Ride', id }],
    }),
    updateRide: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/rides/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Ride', { type: 'Ride', id }],
    }),
    acceptRide: builder.mutation({
      query: (id) => ({
        url: `/rides/${id}/accept`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => ['Ride', { type: 'Ride', id }],
    }),
  }),
});

export const {
  useCreateRideMutation,
  useGetAllRidesQuery,
  useGetSingleRideQuery,
  useUpdateRideMutation,
  useAcceptRideMutation,
} = rideApi;
