"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import type { ReactNode } from "react";

import { persistor, store } from "./store";
import { useAppDispatch } from "./hooks";
import { setHydrated } from "./slices/cartSlice";

/**
 * Marks the cart slice as hydrated once redux-persist finishes bootstrapping.
 *
 * NOTE: we intentionally do NOT wrap the app in `<PersistGate loading={null}>`.
 * On the server `bootstrapped` is always `false`, so PersistGate would render
 * `loading` (null) → the entire page would ship WITHOUT server-rendered HTML
 * (blank SSR, bad SEO). Instead:
 *   - Server + first client paint render the initial (empty) state — identical
 *     HTML → zero hydration mismatch.
 *   - Redux-persist rehydrates in the background; the slice also sets
 *     `hydrated = true` on REHYDRATE, and this signal is a fallback that
 *     targets the same timing as PersistGate's `onBeforeLift`.
 *   - Cart UI (badge / /cart) additionally uses `isMounted` + `hydrated`
 *     guards so it never flashes wrong data.
 */
function CartHydrationSignal() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (persistor.getState().bootstrapped) {
      dispatch(setHydrated(true));
      return;
    }

    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        dispatch(setHydrated(true));
        unsubscribe();
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return null;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <CartHydrationSignal />
      {children}
    </Provider>
  );
}