import axios from 'axios';
import { store } from '../state/store';

/**
 * PUBLIC_INTERFACE
 * getBaseURL - Reads API base URL from environment variables.
 * CRA uses REACT_APP_ prefix for env variables.
 */
export function getBaseURL() {
  // Note: Ensure REACT_APP_API_BASE_URL is set in the environment (.env)
  const url = process.env.REACT_APP_API_BASE_URL || '';
  return url.replace(/\/+$/, ''); // trim trailing slash
}

/**
 * PUBLIC_INTERFACE
 * httpClient - Pre-configured Axios instance with baseURL and interceptors.
 */
export const httpClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token exists
httpClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state?.auth?.token;
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Basic response interceptor placeholder (can be extended for global errors)
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: handle 401 globally in future
    return Promise.reject(error);
  }
);
