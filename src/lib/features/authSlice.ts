import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { User, Role } from '@/types/models';

export interface AuthState {
  user: User | null;
  role: Role | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Safely access localStorage
const loadState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,
    };
  }

  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState === null) {
      return {
        user: null,
        role: null,
        token: null,
        isAuthenticated: false,
      };
    }
    return JSON.parse(serializedState);
  } catch {
    return {
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,
    };
  }
};

const initialState: AuthState = loadState();

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const saveState = (state: AuthState) => {
  if (typeof window !== 'undefined') {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('authState', serializedState);
    } catch {
      // Ignore write errors
    }
  }
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ user: User; role: Role; token: string }>
    ) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      saveState(state);
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      saveState(state);
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      saveState(state);
    },
    updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (action.payload.role) {
          state.role = action.payload.role;
        }
        saveState(state);
      }
    },
  },
});

export const { login, logout, updateCurrentUser } = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectRole = (state: RootState) => state.auth.role;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;
