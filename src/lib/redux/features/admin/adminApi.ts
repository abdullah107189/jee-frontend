// lib/redux/features/admin/adminApi.ts - Complete Fixed Version

import { baseApi } from "../../services/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ============ PRODUCT ITEMS ============
    bulkAddProductItems: builder.mutation<any, any>({
      queryFn: (data) => {
        console.log("Bulk adding:", data);
        return {
          data: {
            success: true,
            message: `${data.items.length} items added successfully.`,
          },
        };
      },
      invalidatesTags: ["ProductItem", "Product"],
    }),

    // ============ SELLERS ============
    getSellers: builder.query<any, void>({
      queryFn: () => {
        return {
          data: [
            {
              id: "sel_1",
              companyName: "Vision Official Store",
              ownerName: "Rafiqul Islam",
              email: "vision.store@example.com",
              phone: "01711002233",
              status: "Approved",
              joinedDate: "2025-11-12",
              salesCount: 342,
              warrantyCount: 290,
              licenseNo: "TRAD/DHAKA/2025/8821",
            },
            {
              id: "sel_2",
              companyName: "Electro Tech Dhaka",
              ownerName: "Tanvir Hossain",
              email: "tanvir@electrotech.bd",
              phone: "01822334455",
              status: "Approved",
              joinedDate: "2026-01-05",
              salesCount: 189,
              warrantyCount: 175,
              licenseNo: "TRAD/DHAKA/2026/1029",
            },
            {
              id: "sel_3",
              companyName: "Chittagong Electronics Hub",
              ownerName: "Kamrul Hasan",
              email: "ctg.hub@gmail.com",
              phone: "01933445566",
              status: "Pending",
              joinedDate: "2026-08-01",
              salesCount: 0,
              warrantyCount: 0,
              licenseNo: "TRAD/CTG/2026/4412",
            },
            {
              id: "sel_4",
              companyName: "Sylhet Digital Appliances",
              ownerName: "Farhana Ahmed",
              email: "sylhet.digital@outlet.bd",
              phone: "01644556677",
              status: "Suspended",
              joinedDate: "2025-09-20",
              salesCount: 95,
              warrantyCount: 88,
              licenseNo: "TRAD/SYL/2025/0091",
            },
            {
              id: "sel_5",
              companyName: "Bogra Smart Gadgets",
              ownerName: "Mahbub Alam",
              email: "bogra.smart@gmail.com",
              phone: "01555667788",
              status: "Disabled",
              joinedDate: "2025-06-15",
              salesCount: 42,
              warrantyCount: 40,
              licenseNo: "TRAD/BOG/2025/3310",
            },
          ],
        };
      },
      providesTags: ["Seller"],
    }),

    getPendingSellers: builder.query<any, void>({
      queryFn: () => {
        return {
          data: [
            {
              id: "sel_3",
              companyName: "Chittagong Electronics Hub",
              ownerName: "Kamrul Hasan",
              email: "ctg.hub@gmail.com",
              phone: "01933445566",
              status: "Pending",
              joinedDate: "2026-08-01",
              licenseNo: "TRAD/CTG/2026/4412",
              licenseDocUrl:
                "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=600&q=80",
              nidNumber: "19922691238910",
            },
            {
              id: "sel_6",
              companyName: "Rajshahi Power Mart",
              ownerName: "Sabbir Hossain",
              email: "rajshahi.power@mart.bd",
              phone: "01799887766",
              status: "Pending",
              joinedDate: "2026-08-08",
              licenseNo: "TRAD/RAJ/2026/9931",
              licenseDocUrl:
                "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
              nidNumber: "19882690019283",
            },
          ],
        };
      },
      providesTags: ["Seller"],
    }),

    updateSellerStatus: builder.mutation<
      any,
      { id: string; status: string; reason?: string }
    >({
      queryFn: ({ id, status }) => {
        return {
          data: {
            success: true,
            message: `Seller status updated to ${status}`,
            id,
          },
        };
      },
      invalidatesTags: ["Seller"],
    }),

    // ============ ORDERS ============
    getOrders: builder.query<any, void>({
      queryFn: () => {
        return {
          data: [
            {
              id: "ORD-9021",
              customerName: "Ariful Islam",
              customerEmail: "arif@example.com",
              customerPhone: "01711223344",
              totalAmount: 4850,
              status: "Processing",
              paymentStatus: "Paid",
              paymentMethod: "bKash",
              bkashTrxId: "BK9X827101",
              date: "2026-08-10",
              itemsCount: 2,
            },
            {
              id: "ORD-9022",
              customerName: "Nusrat Jahan",
              customerEmail: "nusrat@example.com",
              customerPhone: "01822334455",
              totalAmount: 12500,
              status: "Pending",
              paymentStatus: "Pending",
              paymentMethod: "Cash on Delivery",
              bkashTrxId: "N/A",
              date: "2026-08-09",
              itemsCount: 1,
            },
            {
              id: "ORD-9023",
              customerName: "Mahmud Hasan",
              customerEmail: "mahmud@example.com",
              customerPhone: "01933445566",
              totalAmount: 3500,
              status: "Delivered",
              paymentStatus: "Paid",
              paymentMethod: "bKash",
              bkashTrxId: "BK7M993012",
              date: "2026-08-07",
              itemsCount: 1,
            },
            {
              id: "ORD-9024",
              customerName: "Sabrina Chowdhury",
              customerEmail: "sabrina@example.com",
              customerPhone: "01644556677",
              totalAmount: 8900,
              status: "Shipped",
              paymentStatus: "Paid",
              paymentMethod: "Card",
              bkashTrxId: "N/A",
              date: "2026-08-06",
              itemsCount: 3,
            },
            {
              id: "ORD-9025",
              customerName: "Zahid Rahman",
              customerEmail: "zahid@example.com",
              customerPhone: "01555667788",
              totalAmount: 2200,
              status: "Cancelled",
              paymentStatus: "Failed",
              paymentMethod: "bKash",
              bkashTrxId: "BK11002233",
              date: "2026-08-05",
              itemsCount: 1,
            },
          ],
        };
      },
      providesTags: ["Order"],
    }),

    // ✅ ADDED: Order Details Query
    getOrderDetails: builder.query<any, { id: string }>({
      queryFn: ({ id }) => {
        return {
          data: {
            id: id,
            orderNumber: `ORD-${id.slice(-4)}`,
            customerName: "Ariful Islam",
            customerEmail: "arif@example.com",
            customerPhone: "01711223344",
            shippingAddress: {
              fullName: "Ariful Islam",
              phone: "01711223344",
              address: "House 42, Road 11, Block D, Banani",
              city: "Dhaka",
              zipCode: "1213",
            },
            notes: "Please call before delivery.",
            total: 4850,
            subtotal: 4500,
            tax: 250,
            shipping: 100,
            discount: 0,
            status: "Processing",
            paymentStatus: "Paid",
            paymentMethod: "bKash",
            bkashTrxId: "BK9X827101",
            createdAt: "2026-08-10T10:30:00Z",
            items: [
              {
                id: "item_1",
                name: 'Vision 56" Ceiling Fan',
                productId: "prod_1",
                productItemId: "FAN-001928",
                price: 3500,
                quantity: 1,
                total: 3500,
                warrantyMonths: 24,
                serialNumber: "SN-99021",
                image: "/images/fan.jpg",
              },
              {
                id: "item_2",
                name: "LED Bulb 15W (Pack of 4)",
                productId: "prod_2",
                productItemId: "BULB-15W-001",
                price: 1000,
                quantity: 1,
                total: 1000,
                warrantyMonths: 12,
                serialNumber: "SN-77312",
                image: "/images/bulb.jpg",
              },
            ],
            timeline: [
              { status: "Order Placed", date: "2026-08-10T10:30:00Z" },
              { status: "Order Confirmed", date: "2026-08-10T12:15:00Z" },
              { status: "Processing", date: "2026-08-11T09:00:00Z" },
            ],
          },
        };
      },
      providesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),

    updateOrderStatus: builder.mutation<any, { id: string; status: string }>({
      queryFn: ({ id, status }) => {
        return {
          data: {
            success: true,
            message: `Order #${id} status changed to ${status}`,
          },
        };
      },
      invalidatesTags: ["Order"],
    }),

    verifyOrderPayment: builder.mutation<
      any,
      { id: string; verified: boolean }
    >({
      queryFn: ({ id, verified }) => {
        return {
          data: {
            success: true,
            message: `Payment for Order #${id} ${verified ? "Verified" : "Flagged Unverified"}`,
          },
        };
      },
      invalidatesTags: ["Order"],
    }),

    // ============ WARRANTIES ============
    getWarranties: builder.query<any, void>({
      queryFn: () => {
        return {
          data: [
            {
              id: "WAR-101",
              uniqueId: "FAN-001928",
              productName: 'Vision 56" Ceiling Fan',
              customerName: "John Doe",
              customerPhone: "01711223344",
              sellerName: "Vision Official Store",
              saleType: "Offline",
              status: "Active",
              startDate: "2026-01-15",
              endDate: "2027-01-15",
              claimsCount: 0,
            },
            {
              id: "WAR-102",
              uniqueId: "AC-100293",
              productName: "Vision AC 1.5 Ton",
              customerName: "Alice Smith",
              customerPhone: "01899887766",
              sellerName: "Electro Tech Dhaka",
              saleType: "Online",
              status: "Active",
              startDate: "2026-03-10",
              endDate: "2028-03-10",
              claimsCount: 1,
            },
            {
              id: "WAR-103",
              uniqueId: "BULB-99212",
              productName: "LED Bulb 15W",
              customerName: "Karim Ahmed",
              customerPhone: "01900112233",
              sellerName: "Direct Online",
              saleType: "Online",
              status: "Expired",
              startDate: "2024-05-01",
              endDate: "2025-05-01",
              claimsCount: 0,
            },
            {
              id: "WAR-104",
              uniqueId: "IRON-20211",
              productName: "Dry Iron 1000W",
              customerName: "Farid Hossain",
              customerPhone: "01511223344",
              sellerName: "Bogra Smart Gadgets",
              saleType: "Offline",
              status: "Claimed",
              startDate: "2025-08-10",
              endDate: "2026-08-10",
              claimsCount: 2,
            },
            {
              id: "WAR-105",
              uniqueId: "BLENDER-331",
              productName: "Super Blender 750W",
              customerName: "Sumaiya Begum",
              customerPhone: "01399887766",
              sellerName: "Sylhet Digital",
              saleType: "Offline",
              status: "Void",
              startDate: "2025-10-01",
              endDate: "2026-10-01",
              claimsCount: 1,
            },
          ],
        };
      },
      providesTags: ["Warranty"],
    }),

    updateWarrantyStatus: builder.mutation<any, { id: string; status: string }>(
      {
        queryFn: ({ id, status }) => {
          return {
            data: {
              success: true,
              message: `Warranty status updated to ${status}`,
            },
          };
        },
        invalidatesTags: ["Warranty"],
      },
    ),

    getWarrantyClaims: builder.query<any, void>({
      queryFn: () => {
        return {
          data: [
            {
              id: "CLM-501",
              warrantyId: "WAR-102",
              uniqueId: "AC-100293",
              productName: "Vision AC 1.5 Ton",
              customerName: "Alice Smith",
              customerPhone: "01899887766",
              issueDescription:
                "Cooling insufficient after 4 months of usage. Compressor making noise.",
              dateSubmitted: "2026-08-02",
              status: "In Progress",
              resolutionNotes: "Technician assigned for on-site inspection.",
            },
            {
              id: "CLM-502",
              warrantyId: "WAR-104",
              uniqueId: "IRON-20211",
              productName: "Dry Iron 1000W",
              customerName: "Farid Hossain",
              customerPhone: "01511223344",
              issueDescription: "Heating element burnt out.",
              dateSubmitted: "2026-07-20",
              status: "Completed",
              resolutionNotes: "Replaced heating element under warranty terms.",
            },
            {
              id: "CLM-503",
              warrantyId: "WAR-105",
              uniqueId: "BLENDER-331",
              productName: "Super Blender 750W",
              customerName: "Sumaiya Begum",
              customerPhone: "01399887766",
              issueDescription: "Motor damaged due to liquid entry.",
              dateSubmitted: "2026-07-15",
              status: "Rejected",
              resolutionNotes:
                "Physical & liquid damage not covered under warranty policy.",
            },
            {
              id: "CLM-504",
              warrantyId: "WAR-101",
              uniqueId: "FAN-001928",
              productName: 'Vision 56" Ceiling Fan',
              customerName: "John Doe",
              customerPhone: "01711223344",
              issueDescription: "Speed regulator coil defect.",
              dateSubmitted: "2026-08-09",
              status: "Submitted",
              resolutionNotes: "",
            },
          ],
        };
      },
      providesTags: ["WarrantyClaim"],
    }),

    updateWarrantyClaimStatus: builder.mutation<
      any,
      { id: string; status: string; resolutionNotes?: string }
    >({
      queryFn: ({ id, status, resolutionNotes }) => {
        return {
          data: {
            success: true,
            message: `Claim #${id} status updated to ${status}`,
          },
        };
      },
      invalidatesTags: ["WarrantyClaim", "Warranty"],
    }),

    // ============ AUDIT LOGS ============
    getAuditLogs: builder.query<any, void>({
      queryFn: () => {
        return {
          data: [
            {
              id: "LOG-991",
              timestamp: "2026-08-10 08:30:12",
              user: "Admin System",
              userEmail: "admin@techstore.bd",
              action: "SELLER_APPROVED",
              entity: "Seller (sel_3)",
              details: "Approved seller Chittagong Electronics Hub",
              ipAddress: "103.204.244.12",
            },
            {
              id: "LOG-990",
              timestamp: "2026-08-10 07:15:45",
              user: "Tanvir Hossain",
              userEmail: "tanvir@electrotech.bd",
              action: "OFFLINE_SALE",
              entity: "ProductItem (FAN-001928)",
              details: "Recorded offline sale & activated 12M warranty",
              ipAddress: "103.112.54.89",
            },
            {
              id: "LOG-989",
              timestamp: "2026-08-09 19:40:02",
              user: "Ariful Islam",
              userEmail: "arif@example.com",
              action: "ONLINE_ORDER",
              entity: "Order (#ORD-9021)",
              details: "Placed online order via bKash payment",
              ipAddress: "119.30.38.100",
            },
            {
              id: "LOG-988",
              timestamp: "2026-08-09 14:22:18",
              user: "Admin System",
              userEmail: "admin@techstore.bd",
              action: "PRODUCT_CREATED",
              entity: "Product (prod_99)",
              details: 'Created product: Vision Smart LED TV 43"',
              ipAddress: "103.204.244.12",
            },
            {
              id: "LOG-987",
              timestamp: "2026-08-09 11:05:00",
              user: "Admin System",
              userEmail: "admin@techstore.bd",
              action: "BULK_ITEM_ADD",
              entity: "ProductItems (50 units)",
              details: "Bulk imported 50 ProductItems for SKU FAN-001",
              ipAddress: "103.204.244.12",
            },
            {
              id: "LOG-986",
              timestamp: "2026-08-08 16:50:33",
              user: "Alice Smith",
              userEmail: "alice@example.com",
              action: "WARRANTY_CLAIM",
              entity: "Claim (#CLM-501)",
              details: "Submitted warranty claim for AC-100293",
              ipAddress: "203.82.199.45",
            },
            {
              id: "LOG-985",
              timestamp: "2026-08-08 09:00:10",
              user: "Rafiqul Islam",
              userEmail: "vision.store@example.com",
              action: "USER_LOGIN",
              entity: "Auth",
              details: "Successful seller login session",
              ipAddress: "103.112.54.90",
            },
          ],
        };
      },
      providesTags: ["AuditLog"],
    }),

    // ============ USERS ============
    getUsers: builder.query<any, void>({
      queryFn: () => {
        return {
          data: [
            {
              id: "usr_1",
              name: "Super Admin",
              email: "admin@techstore.bd",
              role: "admin",
              status: "Active",
              joinedDate: "2025-01-01",
              phone: "01700000000",
              avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            },
            {
              id: "usr_2",
              name: "Rafiqul Islam",
              email: "vision.store@example.com",
              role: "seller",
              status: "Active",
              joinedDate: "2025-11-12",
              phone: "01711002233",
              avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
            },
            {
              id: "usr_3",
              name: "Ariful Islam",
              email: "arif@example.com",
              role: "customer",
              status: "Active",
              joinedDate: "2026-02-14",
              phone: "01711223344",
              avatar:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
            },
            {
              id: "usr_4",
              name: "Tanvir Hossain",
              email: "tanvir@electrotech.bd",
              role: "seller",
              status: "Active",
              joinedDate: "2026-01-05",
              phone: "01822334455",
              avatar:
                "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
            },
            {
              id: "usr_5",
              name: "Farhana Ahmed",
              email: "sylhet.digital@outlet.bd",
              role: "seller",
              status: "Disabled",
              joinedDate: "2025-09-20",
              phone: "01644556677",
              avatar:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
            },
          ],
        };
      },
      providesTags: ["User"],
    }),

    updateUserRole: builder.mutation<any, { id: string; role: string }>({
      queryFn: ({ id, role }) => {
        return {
          data: { success: true, message: `User role updated to ${role}` },
        };
      },
      invalidatesTags: ["User"],
    }),

    updateUserStatus: builder.mutation<any, { id: string; status: string }>({
      queryFn: ({ id, status }) => {
        return {
          data: { success: true, message: `User status changed to ${status}` },
        };
      },
      invalidatesTags: ["User"],
    }),

    // ============ ANALYTICS ============
    getAnalytics: builder.query<any, { period: string }>({
      queryFn: () => {
        return {
          data: {
            salesTrend: [
              { month: "Jan", online: 4200, offline: 3100 },
              { month: "Feb", online: 5100, offline: 3800 },
              { month: "Mar", online: 6800, offline: 4900 },
              { month: "Apr", online: 7200, offline: 5400 },
              { month: "May", online: 8900, offline: 6200 },
              { month: "Jun", online: 9500, offline: 7100 },
              { month: "Jul", online: 11200, offline: 8400 },
              { month: "Aug", online: 12800, offline: 9600 },
            ],
            categorySales: [
              { category: "Ceiling Fans", sales: 480 },
              { category: "Air Conditioners", sales: 320 },
              { category: "LED Bulbs", sales: 1250 },
              { category: "Home Appliances", sales: 640 },
              { category: "Smart TV & Audio", sales: 290 },
            ],
            topSellers: [
              { name: "Vision Official Store", sales: 342, revenue: 1197000 },
              { name: "Electro Tech Dhaka", sales: 189, revenue: 661500 },
              { name: "Sylhet Digital Appliances", sales: 95, revenue: 332500 },
              { name: "Bogra Smart Gadgets", sales: 42, revenue: 147000 },
            ],
            bestSellingProducts: [
              {
                id: "P1",
                name: 'Vision 56" Ceiling Fan',
                category: "Ceiling Fans",
                sold: 480,
                revenue: 1680000,
              },
              {
                id: "P2",
                name: "LED Bulb 15W Pack",
                category: "LED Bulbs",
                sold: 1250,
                revenue: 312500,
              },
              {
                id: "P3",
                name: "Vision AC 1.5 Ton Inverter",
                category: "Air Conditioners",
                sold: 320,
                revenue: 14400000,
              },
              {
                id: "P4",
                name: "Dry Iron 1000W Heavy",
                category: "Home Appliances",
                sold: 290,
                revenue: 435000,
              },
            ],
            lowStockProducts: [
              {
                id: "P10",
                name: "Smart Inverter Microwave 25L",
                category: "Appliances",
                stock: 2,
                status: "CRITICAL",
              },
              {
                id: "P12",
                name: "Rechargeable Portable Fan",
                category: "Fans",
                stock: 4,
                status: "LOW",
              },
              {
                id: "P15",
                name: 'High Speed Table Fan 16"',
                category: "Fans",
                stock: 3,
                status: "LOW",
              },
            ],
            expiringWarranties: [
              {
                id: "WAR-104",
                uniqueId: "IRON-20211",
                product: "Dry Iron 1000W",
                customer: "Farid Hossain",
                expiryDate: "2026-08-15",
                daysRemaining: 5,
              },
              {
                id: "WAR-108",
                uniqueId: "FAN-002100",
                product: 'Vision Fan 48"',
                customer: "Rashid Khan",
                expiryDate: "2026-08-22",
                daysRemaining: 12,
              },
              {
                id: "WAR-112",
                uniqueId: "BULB-99001",
                product: "LED Bulb 20W",
                customer: "Khadija Bibi",
                expiryDate: "2026-08-30",
                daysRemaining: 20,
              },
            ],
          },
        };
      },
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useBulkAddProductItemsMutation,
  useGetSellersQuery,
  useGetPendingSellersQuery,
  useUpdateSellerStatusMutation,
  useGetOrdersQuery,
  useGetOrderDetailsQuery, // ✅ Now exported
  useUpdateOrderStatusMutation,
  useVerifyOrderPaymentMutation,
  useGetWarrantiesQuery,
  useUpdateWarrantyStatusMutation,
  useGetWarrantyClaimsQuery,
  useUpdateWarrantyClaimStatusMutation,
  useGetAuditLogsQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
  useGetAnalyticsQuery,
} = adminApi;
