import { baseApi } from "../../hooks/baseApi";

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyPayments: builder.query({
            query: () => "/payments/my-payments",
            providesTags: ["Ride"], // Using Ride tag for now as payments are linked to rides
        }),
    }),
});

export const { useGetMyPaymentsQuery } = paymentApi;
