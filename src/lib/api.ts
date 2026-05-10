import axios from 'axios';
import { authSlice } from './features/authSlice';

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the access token to headers
api.interceptors.request.use(
  (config) => {
    if (store) {
      const state = store.getState();
      const token = state.auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry && store) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        const { token } = response.data.data;

        // Update the token in Redux
        store.dispatch(authSlice.actions.updateToken(token));

        // Update the authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user
        store.dispatch(authSlice.actions.logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
