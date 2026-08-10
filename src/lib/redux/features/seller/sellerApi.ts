import { baseApi } from '../../services/baseApi';

export const sellerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    validateProductItem: builder.query<any, string>({
      queryFn: (uniqueId) => {
        const cleanId = uniqueId.trim().toUpperCase();
        if (cleanId === 'INVALID' || cleanId === 'NOTFOUND' || cleanId === 'EXPIRED') {
          return { error: { status: 404, data: 'Product item not found or unavailable' } };
        }
        return {
          data: {
            id: 'item_101',
            uniqueId: cleanId,
            status: 'AVAILABLE',
            product: {
              id: 'prod_501',
              name: cleanId.startsWith('AC') ? 'Vision AC 1.5 Ton Inverter' : cleanId.startsWith('BULB') ? 'LED Bulb 15W Heavy' : 'Vision 56" Ceiling Fan',
              price: cleanId.startsWith('AC') ? 45000 : cleanId.startsWith('BULB') ? 350 : 15000,
              warrantyMonths: cleanId.startsWith('AC') ? 24 : cleanId.startsWith('BULB') ? 12 : 24
            }
          }
        };
      },
      providesTags: ['ProductItem']
    }),

    recordOfflineSale: builder.mutation<any, any>({
      queryFn: (data) => {
        console.log("Recording sale:", data);
        const saleDate = data.saleDate || new Date().toISOString().split('T')[0];
        const startDate = new Date(saleDate);
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + (data.warrantyMonths || 2));

        return {
          data: {
            success: true,
            message: 'Sale recorded and warranty activated!',
            saleId: `SALE-${Math.floor(100 + Math.random() * 900)}`,
            uniqueId: data.uniqueId || 'FAN-001928',
            productName: data.productName || 'Vision 56" Ceiling Fan',
            customerName: data.customerName || 'Md. Rahman',
            customerPhone: data.customerPhone || '01712345678',
            salePrice: data.salePrice || 15000,
            saleDate: saleDate,
            warranty: {
              startDate: saleDate,
              endDate: endDate.toISOString().split('T')[0],
              status: 'Active',
              daysRemaining: 729
            }
          }
        };
      },
      invalidatesTags: ['Sale', 'Warranty', 'ProductItem', 'SellerProfile']
    }),

    getSellerDashboardStats: builder.query<any, void>({
      queryFn: () => {
        return {
          data: {
            todaysSales: 12500,
            totalSalesAmount: 245000,
            totalOrders: 156,
            activeWarranties: 89,
            pendingClaims: 3,
            salesByCategory: [
              { category: 'Bulb', count: 45 },
              { category: 'Fan', count: 89 },
              { category: 'AC', count: 12 },
              { category: 'Iron', count: 10 }
            ]
          }
        };
      },
      providesTags: ['Sale', 'Warranty']
    }),

    getRecentSales: builder.query<any, void>({
      queryFn: () => {
        return {
          data: [
            { id: 'SALE-001', uniqueId: 'FAN-001928', productName: 'Vision 56" Ceiling Fan', customerName: 'Md. Rahman', customerPhone: '01712345678', amount: 15000, date: '2026-08-10 14:30', paymentMethod: 'Cash', warrantyStatus: 'Active' },
            { id: 'SALE-002', uniqueId: 'AC-003456', productName: 'Vision AC 1.5 Ton Inverter', customerName: 'Kabir Ahmed', customerPhone: '01899887766', amount: 45000, date: '2026-08-10 11:15', paymentMethod: 'Mobile Banking', warrantyStatus: 'Active' },
            { id: 'SALE-003', uniqueId: 'BULB-99120', productName: 'LED Bulb 15W', customerName: 'Nazrul Islam', customerPhone: '01911223344', amount: 350, date: '2026-08-09 18:20', paymentMethod: 'Cash', warrantyStatus: 'Active' },
            { id: 'SALE-004', uniqueId: 'IRON-20211', productName: 'Dry Iron 1000W Heavy', customerName: 'Farid Hossain', customerPhone: '01511223344', amount: 1500, date: '2026-08-08 16:40', paymentMethod: 'Card', warrantyStatus: 'Claimed' },
            { id: 'SALE-005', uniqueId: 'BLENDER-331', productName: 'Super Blender 750W', customerName: 'Sumaiya Begum', customerPhone: '01399887766', amount: 3800, date: '2026-08-07 10:10', paymentMethod: 'Cash', warrantyStatus: 'Active' },
          ]
        };
      },
      providesTags: ['Sale']
    }),

    getTransactions: builder.query<any, { role?: string }>({
      queryFn: () => {
        return {
          data: [
            { id: 'SALE-001', uniqueId: 'FAN-001928', product: 'Vision 56" Ceiling Fan', image: 'https://images.unsplash.com/photo-1570114681640-1090333fa965?auto=format&fit=crop&w=300&q=80', date: '2026-08-10 14:30', price: 15000, customerName: 'Md. Rahman', customerPhone: '01712345678', status: 'Warranty Active', paymentMethod: 'CASH' },
            { id: 'SALE-002', uniqueId: 'AC-003456', product: 'Vision AC 1.5 Ton Inverter', image: 'https://images.unsplash.com/photo-1621016834575-b60b7d7f7fa2?auto=format&fit=crop&w=300&q=80', date: '2026-08-10 11:15', price: 45000, customerName: 'Kabir Ahmed', customerPhone: '01899887766', status: 'Warranty Active', paymentMethod: 'MOBILE_BANKING' },
            { id: 'SALE-003', uniqueId: 'BULB-99120', product: 'LED Bulb 15W', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=300&q=80', date: '2026-08-09 18:20', price: 350, customerName: 'Nazrul Islam', customerPhone: '01911223344', status: 'Warranty Active', paymentMethod: 'CASH' },
            { id: 'SALE-004', uniqueId: 'IRON-20211', product: 'Dry Iron 1000W Heavy', image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=300&q=80', date: '2026-08-08 16:40', price: 1500, customerName: 'Farid Hossain', customerPhone: '01511223344', status: 'Claimed', paymentMethod: 'CARD' },
          ]
        };
      },
      providesTags: ['Sale']
    }),

    getTransactionDetails: builder.query<any, string>({
      queryFn: (id) => {
        return {
          data: {
            id: id || 'SALE-001',
            uniqueId: 'FAN-001928',
            product: 'Vision 56" Ceiling Fan',
            image: 'https://images.unsplash.com/photo-1570114681640-1090333fa965?auto=format&fit=crop&w=800&q=80',
            date: '10 Aug 2026, 2:30 PM',
            price: 15000,
            customerName: 'Md. Rahman',
            customerPhone: '+8801712345678',
            customerEmail: 'rahman@email.com',
            status: 'Warranty Active',
            paymentMethod: 'Cash',
            sellerInfo: 'ABC Electronics (Dhaka Outlet)',
            warrantyDetails: {
              startDate: '10 Aug 2026',
              endDate: '09 Aug 2028',
              months: 24,
              daysRemaining: 729,
              status: 'Active'
            }
          }
        };
      },
      providesTags: ['Sale']
    }),

    getSellerWarranties: builder.query<any, void>({
      queryFn: () => {
        return {
          data: [
            { id: 'WAR-001', uniqueId: 'FAN-001928', productName: 'Vision 56" Ceiling Fan', customerName: 'Md. Rahman', customerPhone: '01712345678', status: 'Active', startDate: '2026-08-10', endDate: '2028-08-09', daysRemaining: 729, saleDate: '2026-08-10', saleAmount: 15000, paymentMethod: 'Cash', claimHistory: [] },
            { id: 'WAR-002', uniqueId: 'AC-003456', productName: 'Vision AC 1.5 Ton Inverter', customerName: 'Kabir Ahmed', customerPhone: '01899887766', status: 'Active', startDate: '2026-08-10', endDate: '2028-08-09', daysRemaining: 729, saleDate: '2026-08-10', saleAmount: 45000, paymentMethod: 'Mobile Banking', claimHistory: [{ claimId: 'CLM-101', date: '15 Jan 2027', status: 'Completed', type: 'Repair', notes: 'Gas refilled & filter cleaned' }] },
            { id: 'WAR-003', uniqueId: 'BULB-99120', productName: 'LED Bulb 15W', customerName: 'Nazrul Islam', customerPhone: '01911223344', status: 'Active', startDate: '2026-08-09', endDate: '2027-08-08', daysRemaining: 363, saleDate: '2026-08-09', saleAmount: 350, paymentMethod: 'Cash', claimHistory: [] },
            { id: 'WAR-004', uniqueId: 'IRON-20211', productName: 'Dry Iron 1000W Heavy', customerName: 'Farid Hossain', customerPhone: '01511223344', status: 'Claimed', startDate: '2025-08-10', endDate: '2026-08-10', daysRemaining: 0, saleDate: '2025-08-10', saleAmount: 1500, paymentMethod: 'Card', claimHistory: [{ claimId: 'CLM-088', date: '20 Jul 2026', status: 'Completed', type: 'Replacement', notes: 'Replaced element' }] },
            { id: 'WAR-005', uniqueId: 'FAN-000122', productName: 'High Speed Table Fan', customerName: 'Sultana Begum', customerPhone: '01655443322', status: 'Expired', startDate: '2024-01-01', endDate: '2025-01-01', daysRemaining: 0, saleDate: '2024-01-01', saleAmount: 2800, paymentMethod: 'Cash', claimHistory: [] },
          ]
        };
      },
      providesTags: ['Warranty']
    }),

    getSellerWarrantyDetails: builder.query<any, string>({
      queryFn: (id) => {
        return {
          data: {
            id: id || 'WAR-001',
            uniqueId: 'FAN-001928',
            productName: 'Vision 56" Ceiling Fan',
            customerName: 'Md. Rahman',
            customerPhone: '+8801712345678',
            customerEmail: 'rahman@email.com',
            status: 'Active',
            startDate: '10 Aug 2026',
            endDate: '09 Aug 2028',
            daysRemaining: 729,
            saleInformation: {
              date: '10 Aug 2026',
              amount: 15000,
              payment: 'Cash'
            },
            claimHistory: [
              { claimId: 'CLM-101', date: '15 Jan 2027', status: 'Completed', type: 'Repair', notes: 'Speed regulator replaced under warranty' }
            ]
          }
        };
      },
      providesTags: ['Warranty']
    }),

    getSellerProfile: builder.query<any, void>({
      queryFn: () => {
        return {
          data: {
            companyName: 'ABC Electronics',
            ownerName: 'Md. Karim',
            email: 'karim@abc.com',
            phone: '+8801712345678',
            address: 'Shop #42, Stadium Market, Dhaka, Bangladesh',
            businessLicense: 'TRAD/DHAKA/2026/1029',
            status: 'Approved',
            joinedDate: '01 Jan 2026',
            stats: {
              totalSales: 156,
              totalRevenue: 245000,
              activeWarranties: 89
            }
          }
        };
      },
      providesTags: ['SellerProfile']
    }),

    updateSellerProfile: builder.mutation<any, any>({
      queryFn: (data) => {
        return { data: { success: true, message: 'Profile updated successfully', profile: data } };
      },
      invalidatesTags: ['SellerProfile']
    }),

    changeSellerPassword: builder.mutation<any, any>({
      queryFn: () => {
        return { data: { success: true, message: 'Password changed successfully' } };
      }
    }),
  }),
});

export const {
  useLazyValidateProductItemQuery,
  useRecordOfflineSaleMutation,
  useGetSellerDashboardStatsQuery,
  useGetRecentSalesQuery,
  useGetTransactionsQuery,
  useGetTransactionDetailsQuery,
  useGetSellerWarrantiesQuery,
  useGetSellerWarrantyDetailsQuery,
  useGetSellerProfileQuery,
  useUpdateSellerProfileMutation,
  useChangeSellerPasswordMutation
} = sellerApi;
