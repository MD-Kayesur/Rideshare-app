import { baseApi } from "../../hooks/baseApi";

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDriver: builder.mutation({
      query: (data) => ({
        url: "/drivers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User" as any],
    }),
    getMyDriverProfile: builder.query({
      query: () => "/drivers/me",
      providesTags: ["User" as any],
    }),
    updateDriverProfile: builder.mutation({
      query: (data) => ({
        url: "/drivers/me",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User" as any],
    }),
  }),
});

export const {
  useCreateDriverMutation,
  useGetMyDriverProfileQuery,
  useUpdateDriverProfileMutation,
} = driverApi;
