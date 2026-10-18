// ── Utilitas password ─────────────────────────────────────────────────
// Terpusat di satu modul agar hashing, validasi kekuatan, dan formula
// password default selalu konsisten di seluruh service.

import { BadRequestError } from "../utils/response";

export const PASSWORD_MIN_LENGTH = 8;

const HASH_OPTIONS = { algorithm: "argon2id" } as const;

export async function hashPassword(plain: string): Promise<string> {
  return Bun.password.hash(plain, HASH_OPTIONS);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return Bun.password.verify(plain, hash);
}

export function assertPasswordStrength(password: string): void {
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new BadRequestError(`Password minimal ${PASSWORD_MIN_LENGTH} karakter`);
  }
}

/** Hanya digit yang dipakai, supaya NIS "1023.0145-87" tetap valid. */
export function normalizeNomorInduk(value: string): string {
  return value.replace(/\D/g, "");
}

/** Validasi sekaligus normalisasi format tanggal `YYYY-MM-DD`. */
export function normalizeTanggalLahir(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) {
    throw new BadRequestError("Format tanggal lahir harus YYYY-MM-DD");
  }

  const [, year, month, day] = match;
  const parsed = new Date(`${value.trim()}T00:00:00Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() + 1 !== Number(month) ||
    parsed.getUTCDate() !== Number(day)
  ) {
    throw new BadRequestError("Tanggal lahir tidak valid");
  }

  return value.trim();
}

/**
 * Password awal yang deterministik: DDMM + YYYY + 3 digit terakhir nomor
 * induk. Contoh: lahir 2010-08-15 dengan NIS ...4587 -> "150820104587".
 *
 * Password ini hanya berlaku sampai user login pertama (password_changed_at
 * masih NULL) dan wajib diganti lewat endpoint ganti password.
 */
export function buildDefaultPassword(
  tanggalLahir: string,
  nomorInduk: string
): string {
  const normalizedDate = normalizeTanggalLahir(tanggalLahir);
  const [year = "", month = "", day = ""] = normalizedDate.split("-");
  const nis = normalizeNomorInduk(nomorInduk);

  if (nis.length < 3) {
    throw new BadRequestError("Nomor induk minimal 3 digit");
  }

  return `${day}${month}${year}${nis.slice(-3)}`;
}
