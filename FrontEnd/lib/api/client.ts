/**
 * API client untuk backend LMS melalui BFF same-origin.
 *
 * Semua request dikirim ke `/api/v1/*` (proxy) atau `/api/auth/*` (route
 * handler sesi). Browser tidak pernah memegang JWT: token disimpan di
 * cookie HttpOnly yang di-set oleh server, sehingga request terautentikasi
 * memakai cookie tersebut, bukan header Authorization dari JavaScript.
 */

import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
  ApiSuccess,
  ApiMessage,
  ApiError,
  User,
} from "./types";

// Same-origin: route handler Next.js yang meneruskan ke backend.
const BASE_URL = "";

// ─── Low-level fetch helper ──────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  { headers, ...options }: RequestInit = {}
): Promise<{ data: T | null; error: ApiError | null; status: number }> {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    credentials: "same-origin",
  });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    return {
      data: null,
      error: (body as ApiError) ?? { error: "Unknown error" },
      status: res.status,
    };
  }

  return { data: body as T, error: null, status: res.status };
}

// ─── Public API (no auth) ────────────────────────────────────────────────────

export const api = {
  auth: {
    /** POST /api/auth/login — BFF yang men-set cookie HttpOnly */
    login: (body: LoginRequest) =>
      apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    /** POST /api/v1/auth/register — registrasi siswa (link aktivasi via email) */
    register: (body: RegisterRequest) =>
      apiFetch<ApiMessage>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    /** POST /api/v1/auth/activate — buat password dari token email aktivasi */
    activate: (body: { token: string; password: string }) =>
      apiFetch<ApiSuccess<User>>("/api/v1/auth/activate", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    /** POST /api/v1/auth/forgot-password — kirim tautan reset ke email */
    forgotPassword: (body: { identifier: string }) =>
      apiFetch<ApiMessage>("/api/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    /** POST /api/v1/auth/reset-password — buat password baru dari token email */
    resetPassword: (body: { token: string; password: string }) =>
      apiFetch<ApiMessage>("/api/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
} as const;

// ─── Authenticated API (cookie HttpOnly) ─────────────────────────────────────

export const authApi = {
  auth: {
    changePassword: {
      /** PUT /api/auth/change-password — ganti password + rotasi cookie sesi */
      put: (body: ChangePasswordRequest) =>
        apiFetch<ApiSuccess<User>>("/api/auth/change-password", {
          method: "PUT",
          body: JSON.stringify(body),
        }),
    },
  },

  users: {
    current: {
      /** GET /api/auth/session — data user dari cookie sesi */
      get: () => apiFetch<ApiSuccess<User>>("/api/auth/session"),
    },

    logout: {
      /** POST /api/auth/logout — hapus cookie sesi di server */
      delete: () =>
        apiFetch<ApiSuccess<"OK">>("/api/auth/logout", { method: "POST" }),
    },
  },
} as const;
