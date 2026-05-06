import { baseApi } from "../../hooks/baseApi";

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyPayments: builder.query({
            query: () => "/payments/my-payments",
            providesTags: ["Ride"],
        }),
        createPaymentIntent: builder.mutation({
            query: (data) => ({
                url: "/payments/create-intent",
                method: "POST",
                body: data,
            }),
        }),
        verifyPayment: builder.query({
            query: (transactionId) => `/payments/verify?transactionId=${transactionId}`,
        }),
    }),
});

export const { 
    useGetMyPaymentsQuery, 
    useCreatePaymentIntentMutation,
    useVerifyPaymentQuery 
} = paymentApi;
