import { baseApi } from '../../hooks/baseApi';

const vehicleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addVehicle: builder.mutation({
      query: (data) => ({
        url: '/vehicles/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Vehicle'],
    }),
    getMyVehicles: builder.query({
      query: () => ({
        url: '/vehicles/my-vehicles',
        method: 'GET',
      }),
      providesTags: ['Vehicle'],
    }),
    deleteVehicle: builder.mutation({
      query: (id) => ({
        url: `/vehicles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vehicle'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddVehicleMutation,
  useGetMyVehiclesQuery,
  useDeleteVehicleMutation,
} = vehicleApi;
