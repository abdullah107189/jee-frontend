import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './services/baseApi';
import authReducer from './features/auth/authSlice';
import cartReducer from './features/cart/cartSlice';

// Ensure feature endpoints are injected onto baseApi
import './features/auth/authApi';
import './features/seller/sellerApi';
import './features/admin/adminApi';
import './features/warranty/warrantyApi';
import './features/product/productApi';
import './features/customer/customerApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
