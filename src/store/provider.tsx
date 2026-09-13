"use client";

import { Provider } from 'react-redux';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './hooks';
import { hydrateCart } from './slices/cartSlice';

function CartPersistence() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('cart_items');
      if (saved) dispatch(hydrateCart(JSON.parse(saved)));
    } catch {
      window.localStorage.removeItem('cart_items');
    } finally {
      hydrated.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  return null;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}><CartPersistence />{children}</Provider>;
}