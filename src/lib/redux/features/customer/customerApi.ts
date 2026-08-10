import { baseApi } from '../../services/baseApi';

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    getCustomerOrders: builder.query<any[], any>({
      queryFn: () => {
        return {
          data: [
            {
              id: 'ORD-001',
              date: '15 Aug 2026',
              status: 'Delivered',
              totalAmount: 15000,
              itemsCount: 1,
              paymentMethod: 'bKash (Verified)',
              items: [
                { id: 'i1', name: 'Vision 56" Ceiling Fan', price: 15000, quantity: 1, uniqueId: 'FAN-001928', warrantyDaysLeft: 729 }
              ]
            },
            {
              id: 'ORD-002',
              date: '10 Aug 2026',
              status: 'Shipped',
              totalAmount: 35000,
              itemsCount: 1,
              paymentMethod: 'bKash (Verified)',
              items: [
                { id: 'i2', name: 'Vision AC 1.5 Ton Inverter', price: 35000, quantity: 1, uniqueId: 'AC-003456', warrantyDaysLeft: 1080 }
              ]
            },
            {
              id: 'ORD-003',
              date: '05 Aug 2026',
              status: 'Pending',
              totalAmount: 8000,
              itemsCount: 2,
              paymentMethod: 'bKash (Pending Verification)',
              items: [
                { id: 'i3', name: 'Vision Commercial Blender', price: 3800, quantity: 1, uniqueId: 'BLENDER-331', warrantyDaysLeft: 720 },
                { id: 'i4', name: 'Vision LED Bulb 15W Pack', price: 4200, quantity: 1, uniqueId: 'BULB-99120', warrantyDaysLeft: 360 }
              ]
            }
          ]
        };
      },
      providesTags: ['Order']
    }),

    getCustomerOrderDetails: builder.query<any, string>({
      queryFn: (orderId) => {
        return {
          data: {
            id: orderId || 'ORD-001',
            date: '15 Aug 2026',
            status: 'Delivered',
            timeline: [
              { title: 'Placed', date: '15 Aug 2026, 10:30 AM', completed: true },
              { title: 'Confirmed', date: '16 Aug 2026, 11:15 AM', completed: true },
              { title: 'Shipped', date: '17 Aug 2026, 02:45 PM', completed: true },
              { title: 'Delivered', date: '18 Aug 2026, 04:20 PM', completed: true }
            ],
            paymentMethod: 'bKash (Verified)',
            bkashTrxId: 'BKASH12345678',
            advancePaid: 70,
            subtotal: 15000,
            deliveryFee: 100,
            totalAmount: 15100,
            dueAtDelivery: 15030,
            shippingAddress: {
              name: 'Md. Rahman',
              phone: '01712345678',
              address: 'House #12, Road #5, Block B, Banani',
              city: 'Dhaka'
            },
            items: [
              {
                id: 'i1',
                name: 'Vision 56" High Speed Ceiling Fan',
                uniqueId: 'FAN-001928',
                price: 15000,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1570114681640-1090333fa965?auto=format&fit=crop&w=300&q=80',
                warrantyStatus: 'Active (729 days left)',
                warrantyMonths: 24
              }
            ]
          }
        };
      },
      providesTags: ['Order']
    }),

    createOrder: builder.mutation<any, any>({
      queryFn: (orderData) => {
        console.log('Creating order:', orderData);
        const orderId = `ORD-${Math.floor(100 + Math.random() * 900)}`;
        return {
          data: {
            success: true,
            orderId,
            message: 'Order placed successfully! We will verify your bKash payment shortly.',
            totalAmount: orderData.totalAmount || 15000
          }
        };
      },
      invalidatesTags: ['Order', 'Cart']
    }),

    cancelOrder: builder.mutation<any, string>({
      queryFn: (orderId) => {
        return { data: { success: true, message: `Order #${orderId} has been cancelled.` } };
      },
      invalidatesTags: ['Order']
    }),

    getCustomerWarranties: builder.query<any[], any>({
      queryFn: (filters) => {
        const warranties = [
          {
            id: 'WAR-001',
            uniqueId: 'FAN-001928',
            productName: 'Vision 56" High Speed Ceiling Fan',
            status: 'Active',
            startDate: '10 Aug 2026',
            endDate: '09 Aug 2028',
            daysRemaining: 729,
            totalDays: 730,
            seller: 'ABC Electronics (Dhaka)',
            image: 'https://images.unsplash.com/photo-1570114681640-1090333fa965?auto=format&fit=crop&w=300&q=80'
          },
          {
            id: 'WAR-002',
            uniqueId: 'AC-003456',
            productName: 'Vision AC 1.5 Ton Dual Inverter',
            status: 'Expiring Soon',
            startDate: '15 Sep 2023',
            endDate: '15 Sep 2026',
            daysRemaining: 30,
            totalDays: 1095,
            seller: 'TechStore Online',
            image: 'https://images.unsplash.com/photo-1621016834575-b60b7d7f7fa2?auto=format&fit=crop&w=300&q=80'
          },
          {
            id: 'WAR-003',
            uniqueId: 'BULB-99120',
            productName: 'Vision Ultra Bright LED Bulb 15W',
            status: 'Active',
            startDate: '01 Jan 2026',
            endDate: '01 Jan 2027',
            daysRemaining: 144,
            totalDays: 365,
            seller: 'Dhaka Digital Mart',
            image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=300&q=80'
          }
        ];

        let result = [...warranties];
        if (filters?.status && filters.status !== 'ALL') {
          result = result.filter(w => w.status.toLowerCase().includes(filters.status.toLowerCase()));
        }
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(w => w.productName.toLowerCase().includes(q) || w.uniqueId.toLowerCase().includes(q));
        }

        return { data: result };
      },
      providesTags: ['Warranty']
    }),

    getCustomerWarrantyDetails: builder.query<any, string>({
      queryFn: (id) => {
        return {
          data: {
            id: id || 'WAR-001',
            uniqueId: 'FAN-001928',
            productName: 'Vision 56" High Speed Ceiling Fan',
            status: 'Active',
            startDate: '10 Aug 2026',
            endDate: '09 Aug 2028',
            daysRemaining: 729,
            totalDays: 730,
            progressPercent: 99,
            seller: 'ABC Electronics (Dhaka Outlet)',
            saleDate: '10 Aug 2026',
            orderId: '#ORD-001',
            image: 'https://images.unsplash.com/photo-1570114681640-1090333fa965?auto=format&fit=crop&w=600&q=80',
            claimHistory: [
              {
                id: 'CLM-101',
                date: '15 Jan 2027',
                type: 'Repair',
                status: 'Completed',
                notes: 'Speed regulator replaced under warranty policy.'
              }
            ]
          }
        };
      },
      providesTags: ['Warranty', 'WarrantyClaim']
    }),

    claimWarranty: builder.mutation<any, any>({
      queryFn: (claimData) => {
        return {
          data: {
            success: true,
            claimId: `CLM-${Math.floor(100 + Math.random() * 900)}`,
            message: 'Warranty claim submitted successfully! Our support representative will contact you within 24 hours.'
          }
        };
      },
      invalidatesTags: ['Warranty', 'WarrantyClaim']
    }),

    getCustomerProfile: builder.query<any, void>({
      queryFn: () => {
        return {
          data: {
            fullName: 'Md. Rahman',
            email: 'rahman@email.com',
            phone: '01712345678',
            address: 'House #12, Road #5, Block B, Dhaka',
            joinedDate: '10 Jan 2026',
            stats: {
              totalOrders: 12,
              activeWarranties: 5,
              totalSpent: 150000
            }
          }
        };
      },
      providesTags: ['User']
    }),

    getCustomerStats: builder.query<any, void>({
      queryFn: () => {
        return {
          data: {
            totalOrders: 12,
            activeWarranties: 5,
            pendingClaims: 2,
            totalSpent: 150000,
          }
        };
      },
      providesTags: ['User']
    }),

    updateCustomerProfile: builder.mutation<any, any>({
      queryFn: (data) => {
        return {
          data: {
            success: true,
            message: 'Profile updated successfully!',
            profile: data
          }
        };
      },
      invalidatesTags: ['User']
    }),

    changeCustomerPassword: builder.mutation<any, any>({
      queryFn: () => {
        return {
          data: {
            success: true,
            message: 'Password updated successfully!'
          }
        };
      }
    }),

    verifyBKash: builder.mutation<any, { bkashNumber: string; trxId: string }>({
      queryFn: ({ bkashNumber, trxId }) => {
        if (!trxId || trxId.length < 5) {
          return { error: { status: 400, data: 'Invalid bKash Transaction ID' } };
        }
        return {
          data: {
            success: true,
            message: 'bKash advance payment of 70 BDT verified successfully!',
            trxId,
            bkashNumber,
            advanceAmount: 70
          }
        };
      }
    })
  }),
});

export const {
  useGetCustomerOrdersQuery,
  useGetCustomerOrderDetailsQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useGetCustomerWarrantiesQuery,
  useGetCustomerWarrantyDetailsQuery,
  useClaimWarrantyMutation,
  useGetCustomerProfileQuery,
  useGetCustomerStatsQuery,
  useUpdateCustomerProfileMutation,
  useChangeCustomerPasswordMutation,
  useVerifyBKashMutation
} = customerApi;
