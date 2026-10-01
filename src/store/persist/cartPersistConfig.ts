import type { PersistConfig } from "redux-persist";

import type { CartState, PersistedCart } from "@/lib/types/cart.types";
import { createSafeStorage } from "./storage";

/**
 * Persist config for the `cart` slice ONLY.
 *
 * - `hydrated` is intentionally NOT persisted — it is derived at runtime from
 *   the rehydration lifecycle (REHYDRATE → hydrated) so SSR never renders it.
 * - version + migrate are kept for future shape changes.
 */
export const cartPersistConfig: PersistConfig<CartState> = {
  key: "jee:cart",
  version: 1,
  storage: createSafeStorage(),
  whitelist: ["items", "lastUpdatedAt"],
  migrate: async (state) => {
    if (!state) return state;

    // Legacy upgrade: previous builds stored the raw items array under a
    // separate "cart_items" key (manual localStorage, pre-redux-persist).
    // Port it into the persisted shape once, then remove the old key.
    try {
      if (typeof window !== "undefined") {
        const legacy = window.localStorage.getItem("cart_items");
        if (legacy) {
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed)) {
            window.localStorage.removeItem("cart_items");
            const legacyCart: PersistedCart = {
              items: parsed,
              lastUpdatedAt: null,
            };
            return { ...state, items: legacyCart.items } as typeof state;
          }
        }
      }
    } catch {
      // Corrupted legacy payload — fall through to the persisted state.
    }

    return state;
  },
};
