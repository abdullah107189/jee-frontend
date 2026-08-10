import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: [
    'Product',
    'ProductItem',
    'Sale',
    'Order',
    'Warranty',
    'WarrantyClaim',
    'Seller',
    'SellerProfile',
    'User',
    'AuditLog',
    'Analytics',
    'Cart',
  ],
  endpoints: () => ({}),
});
