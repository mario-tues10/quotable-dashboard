// src/services/apiClient.ts
import axios from 'axios';

const API_BASE_URL =
  (import.meta.env.VITE_QUOTABLE_API_BASE_URL as string | undefined) || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
}
