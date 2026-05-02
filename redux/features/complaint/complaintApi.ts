import { baseApi } from "../../hooks/baseApi";

const complaintApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createComplaint: builder.mutation({
      query: (data) => ({
        url: "/complaints",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User" as any],
    }),
    getAllComplaints: builder.query({
      query: () => ({
        url: "/complaints",
        method: "GET",
      }),
      providesTags: ["User" as any],
    }),
    resolveComplaint: builder.mutation({
      query: (complaintId) => ({
        url: `/complaints/resolve/${complaintId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["User" as any],
    }),
  }),
});

export const {
  useCreateComplaintMutation,
  useGetAllComplaintsQuery,
  useResolveComplaintMutation,
} = complaintApi;
