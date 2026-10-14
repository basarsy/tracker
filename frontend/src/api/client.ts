import axios from "axios";
import type { ApiErrorBody } from "./types";

const TOKEN_KEY = "jobtracker.token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      setToken(null);
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    const body = error.response?.data as ApiErrorBody | undefined;
    const message = body?.message ?? error.message ?? "Request failed";
    return Promise.reject(new Error(message));
  },
);
