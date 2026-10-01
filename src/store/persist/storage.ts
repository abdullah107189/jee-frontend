import type { WebStorage } from "redux-persist";

const noopStorage: WebStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};

/**
 * SSR-safe storage wrapper.
 *
 * - Returns a no-op storage on the server (no `window` access).
 * - On the client, wraps `localStorage` in try/catch so private-mode /
 *   quota errors never crash the app.
 */
export function createSafeStorage(): WebStorage {
  if (typeof window === "undefined") {
    return noopStorage;
  }

  return {
    getItem: (key) => {
      try {
        return Promise.resolve(window.localStorage.getItem(key));
      } catch {
        return Promise.resolve(null);
      }
    },

    setItem: (key, value) => {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Storage unavailable (Safari private mode, quota, disabled cookies) — ignore.
      }
      return Promise.resolve();
    },

    removeItem: (key) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore.
      }
      return Promise.resolve();
    },
  };
}