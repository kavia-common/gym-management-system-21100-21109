import axios from 'axios';
import { store } from '../state/store';
import { config } from '../config';

/**
 * PUBLIC_INTERFACE
 * getBaseURL - Reads API base URL from centralized config.
 * CRA uses REACT_APP_ prefix for env variables.
 */
export function getBaseURL() {
  // Central source of truth for base URL
  return config.apiBaseUrl;
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
  (reqConfig) => {
    const state = store.getState();
    const token = state?.auth?.token;
    if (token) {
      // eslint-disable-next-line no-param-reassign
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
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
