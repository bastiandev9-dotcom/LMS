// ── Query profil user ─────────────────────────────────────────────────
// password_hash tidak pernah ikut di-select. Untuk data internal sesi
// (token version, status wajib ganti password) gunakan getSessionUserById.

import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { DEFAULT_ROLE, getUserRoleName } from "./role-service";

const profileColumns = {
  id: users.id,
  fullName: users.fullName,
  email: users.email,
  nomorInduk: users.nomorInduk,
  kelas: users.kelas,
  phone: users.phone,
  avatarUrl: users.avatarUrl,
  isActive: users.isActive,
  passwordChangedAt: users.passwordChangedAt,
  tokenVersion: users.tokenVersion,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

type UserRow = {
  id: string;
  fullName: string;
  email: string | null;
  nomorInduk: string | null;
  kelas: string | null;
  phone: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  passwordChangedAt: Date | null;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
};

async function loadUser(userId: string): Promise<UserRow> {
  const rows = await db
    .select(profileColumns)
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const user = rows[0];
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

async function toPublicUser(user: UserRow) {
  const role = await getUserRoleName(user.id);

  return {
    id: user.id,
    name: user.fullName,
    full_name: user.fullName,
    email: user.email,
    nomor_induk: user.nomorInduk,
    kelas: user.kelas,
    phone: user.phone,
    avatar_url: user.avatarUrl,
    is_active: user.isActive,
    must_change_password: user.passwordChangedAt === null,
    role: role ?? DEFAULT_ROLE,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };
}

/** Data user untuk response publik (tanpa field internal). */
export async function getCurrentUserById(userId: string) {
  return toPublicUser(await loadUser(userId));
}

/** Data user + field internal yang dibutuhkan authMiddleware. */
export async function getSessionUserById(userId: string) {
  const user = await loadUser(userId);
  return {
    ...(await toPublicUser(user)),
    tokenVersion: user.tokenVersion,
  };
}

export async function updateUserProfile(
  userId: string,
  patch: { fullName?: string; phone?: string; avatarUrl?: string }
) {
  const rows = await db
    .update(users)
    .set(patch)
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      nomorInduk: users.nomorInduk,
      kelas: users.kelas,
      phone: users.phone,
      avatarUrl: users.avatarUrl,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  const updated = rows[0];
  if (!updated) {
    throw new Error("User tidak ditemukan");
  }
  return updated;
}

export async function logoutUser(_token: string) {
  // JWT bersifat stateless; logout cukup menghapus token di klien.
  return;
}
