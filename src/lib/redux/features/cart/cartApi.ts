import { baseApi } from '../../services/baseApi';

// Server-side Cart API (syncs with Redux cartSlice for local state)
export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /cart — fetch all cart items for logged-in user
    getCartItems: builder.query<any[], void>({
      queryFn: () => {
        try {
          const saved = localStorage.getItem('cart_items');
          const items = saved ? JSON.parse(saved) : [];
          return { data: items };
        } catch {
          return { data: [] };
        }
      },
      providesTags: ['Cart'],
    }),

    // POST /cart — add item to server cart
    addCartItem: builder.mutation<any, any>({
      queryFn: (item) => {
        try {
          const saved = localStorage.getItem('cart_items');
          const items: any[] = saved ? JSON.parse(saved) : [];
          const existingIdx = items.findIndex((i) => i.id === item.id);
          if (existingIdx > -1) {
            items[existingIdx].quantity += item.quantity || 1;
          } else {
            items.push({ ...item, quantity: item.quantity || 1 });
          }
          localStorage.setItem('cart_items', JSON.stringify(items));
          return { data: { success: true, cart: items } };
        } catch {
          return { error: { status: 500, data: 'Failed to add item' } };
        }
      },
      invalidatesTags: ['Cart'],
    }),

    // PATCH /cart/:id — update quantity
    updateCartItemQty: builder.mutation<any, { id: string; quantity: number }>({
      queryFn: ({ id, quantity }) => {
        try {
          const saved = localStorage.getItem('cart_items');
          const items: any[] = saved ? JSON.parse(saved) : [];
          const item = items.find((i) => i.id === id);
          if (item) {
            item.quantity = Math.max(1, quantity);
          }
          localStorage.setItem('cart_items', JSON.stringify(items));
          return { data: { success: true, cart: items } };
        } catch {
          return { error: { status: 500, data: 'Failed to update item' } };
        }
      },
      invalidatesTags: ['Cart'],
    }),

    // DELETE /cart/:id — remove item
    removeCartItem: builder.mutation<any, string>({
      queryFn: (id) => {
        try {
          const saved = localStorage.getItem('cart_items');
          const items: any[] = saved ? JSON.parse(saved) : [];
          const filtered = items.filter((i) => i.id !== id);
          localStorage.setItem('cart_items', JSON.stringify(filtered));
          return { data: { success: true, cart: filtered } };
        } catch {
          return { error: { status: 500, data: 'Failed to remove item' } };
        }
      },
      invalidatesTags: ['Cart'],
    }),

    // DELETE /cart — clear entire cart
    clearCartItems: builder.mutation<any, void>({
      queryFn: () => {
        localStorage.removeItem('cart_items');
        return { data: { success: true, message: 'Cart cleared' } };
      },
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartItemsQuery,
  useAddCartItemMutation,
  useUpdateCartItemQtyMutation,
  useRemoveCartItemMutation,
  useClearCartItemsMutation,
} = cartApi;
