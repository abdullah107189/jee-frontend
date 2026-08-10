import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const isBrowser = typeof window !== 'undefined';

const readStorage = (key: string) => {
  if (!isBrowser) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors in non-browser contexts.
  }
};

const removeStorage = (key: string) => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage errors in non-browser contexts.
  }
};

const getSavedUser = () => {
  const saved = readStorage('user');
  return saved ? JSON.parse(saved) : { name: 'Md. Rahman', role: 'customer' };
};

interface AuthState {
  user: { name: string; role: string } | null;
  token: string | null;
}

const initialState: AuthState = {
  user: getSavedUser(),
  token: readStorage('token') || 'mock_customer_token',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      writeStorage('token', action.payload.token);
      writeStorage('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      removeStorage('token');
      removeStorage('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
