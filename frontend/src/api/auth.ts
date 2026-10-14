import { api, setToken } from "./client";
import type { LoginResponse } from "./types";

export async function login(username: string, password: string) {
  const { data } = await api.post<LoginResponse>("/auth/login", { username, password });
  setToken(data.token);
  return data;
}

export async function me() {
  const { data } = await api.get<{ username: string }>("/auth/me");
  return data;
}

export function logout() {
  setToken(null);
}
