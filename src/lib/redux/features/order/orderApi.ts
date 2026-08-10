// lib/redux/features/order/orderApi.ts - নতুন ফাইল বানাও

import { baseApi } from '@/lib/redux/services/baseApi';
import { CreateOrderRequest, OrderResponse, VerifyRequest, VerifyResponse } from '@/lib/types/order.types';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create order
    createOrder: builder.mutation<OrderResponse, CreateOrderRequest>({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart', 'Order'],
    }),

    // Verify bKash payment
    verifyBKash: builder.mutation<VerifyResponse, VerifyRequest>({
      query: (data) => ({
        url: '/payments/bkash/verify',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useVerifyBKashMutation,
} = orderApi;