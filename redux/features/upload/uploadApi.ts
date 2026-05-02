import { baseApi } from "../../hooks/baseApi";

 
export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
        // FormData needs special handling in some fetch implementations, 
        // but RTK Query handles it automatically if you pass FormData object
      }),
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
