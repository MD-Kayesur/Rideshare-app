import { baseApi } from "../../hooks/baseApi";

const driverApi = baseApi.injectEndpoints({
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
    getNearbyDrivers: builder.query({
      query: ({ lat, lng, vehicleType }) => ({
        url: "/drivers/nearby",
        method: "GET",
        params: { lat, lng, vehicleType },
      }),
      providesTags: ["User" as any],
    }),
    getPendingDrivers: builder.query({
      query: () => ({
        url: "/drivers/pending",
        method: "GET",
      }),
      providesTags: ["User" as any],
    }),
    verifyDriver: builder.mutation({
      query: (driverId) => ({
        url: `/drivers/verify/${driverId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["User" as any],
    }),
    // Consolidated Upload API
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
    }),
    // Consolidated Complaint API
    createComplaint: builder.mutation({
      query: (data) => ({
        url: "/complaints",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Complaint" as any],
    }),
    getAllComplaints: builder.query({
      query: () => ({
        url: "/complaints",
        method: "GET",
      }),
      providesTags: ["Complaint" as any],
    }),
    resolveComplaint: builder.mutation({
      query: (complaintId) => ({
        url: `/complaints/resolve/${complaintId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Complaint" as any],
    }),
  }),
});

export const {
  useCreateDriverMutation,
  useGetMyDriverProfileQuery,
  useUpdateDriverProfileMutation,
  useGetNearbyDriversQuery,
  useGetPendingDriversQuery,
  useVerifyDriverMutation,
  useUploadImageMutation,
  useCreateComplaintMutation,
  useGetAllComplaintsQuery,
  useResolveComplaintMutation,
} = driverApi;
