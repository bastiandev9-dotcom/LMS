/**
 * Type definitions mirroring the Elysia backend schema.
 * Keep this in sync with LMS/src/db/schema.ts and LMS/src/routes/*.ts
 */

// ─── User & Session ──────────────────────────────────────────────────────────

export type UserRole = "admin" | "guru" | "siswa" | "teacher" | "student";

export interface User {
  id: string;
  name: string;
  full_name: string;
  email: string | null;
  nomor_induk: string | null;
  kelas: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  must_change_password: boolean;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// ─── Request / Response shapes ───────────────────────────────────────────────

/**
 * Registrasi mandiri hanya untuk siswa dan harus cocok dengan roster
 * yang diimpor admin (nomor induk + tanggal lahir).
 */
export interface RegisterRequest {
  email: string;
  nomor_induk: string;
  tanggal_lahir: string; // YYYY-MM-DD
}

/** `identifier` = email terdaftar atau nomor induk (NIS/NIP). */
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  data: string; // Bearer token
  must_change_password?: boolean;
  success?: boolean;
  message?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiMessage {
  success: boolean;
  message: string;
}

export interface ApiError {
  error?: string;
  message?: string;
  code?: string;
}
