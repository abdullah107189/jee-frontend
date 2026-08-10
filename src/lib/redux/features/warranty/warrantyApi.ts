import { baseApi } from '../../services/baseApi';

export const warrantyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkWarranty: builder.query<any, string>({
      queryFn: (uniqueId) => {
        if (uniqueId === 'EXPIRED') {
          return { data: { status: 'EXPIRED', productName: 'Old Fan', startDate: '2020-01-01', endDate: '2021-01-01', daysRemaining: 0 } };
        }
        return {
          data: {
            uniqueId,
            status: 'ACTIVE',
            productName: 'Vision 56" Ceiling Fan',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            daysRemaining: 365,
            sellerInfo: 'Offline Store #1'
          }
        };
      },
      providesTags: ['Warranty']
    }),
  }),
});

export const {
  useLazyCheckWarrantyQuery
} = warrantyApi;
