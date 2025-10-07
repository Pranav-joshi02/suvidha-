"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole, UserDTO } from "@/types/api";

export type { UserRole };
export type User = UserDTO;

interface AuthState {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; role?: UserRole; error?: string }>;
  logout: () => void;
}

async function apiFetch<T>(input: string, init?: RequestInit & { auth?: boolean }): Promise<T> {
  const headers: HeadersInit = { "Content-Type": "application/json", ...(init?.headers || {}) };
  if (init?.auth) {
    const token = authStore.getState().token;
    if (token) (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  const res = await fetch(input, { ...init, headers });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message || res.statusText);
  }
  return res.json();
}

export const authStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      async login(email, password) {
        try {
          const data = await apiFetch<{ token: string; user: User }>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
          });
          set({ token: data.token, user: data.user });
          return { ok: true, role: data.user.role };
        } catch (e) {
          return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
        }
      },
      logout() {
        set({ token: null, user: null });
      },
    }),
    { name: "pos-auth" }
  )
);

export function useAuth() {
  return authStore();
}

export { apiFetch };
