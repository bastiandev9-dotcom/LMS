// ── Role kanonis & helper penugasan role ──────────────────────────────
// Satu sumber kebenaran untuk nama role, dipakai oleh auth, manajemen
// user, dan middleware.

import { eq } from "drizzle-orm";
import { db } from "../db";
import { roles, userRoles } from "../db/schema";

export const CANONICAL_ROLES = ["admin", "guru", "siswa"] as const;
export type CanonicalRole = (typeof CANONICAL_ROLES)[number];

export const DEFAULT_ROLE: CanonicalRole = "siswa";

// Alias lama tetap diterima saat membaca role dari klien, tetapi semua
// role baru selalu disimpan dengan nama kanonis.
const ROLE_ALIASES: Record<string, CanonicalRole> = {
  teacher: "guru",
  student: "siswa",
};

export function canonicalRole(role: unknown): string {
  const name = typeof role === "string" ? role : "";
  return ROLE_ALIASES[name] ?? name;
}

export async function getUserRoleName(userId: string): Promise<string | null> {
  const rows = await db
    .select({ name: roles.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId))
    .limit(1);
  return rows[0]?.name ?? null;
}

export async function ensureRole(name: CanonicalRole) {
  const existing = await db
    .select()
    .from(roles)
    .where(eq(roles.name, name))
    .limit(1);

  if (existing[0]) return existing[0];

  const created = await db.insert(roles).values({ name }).returning();
  const role = created[0];
  if (!role) {
    throw new Error("Gagal membuat role");
  }
  return role;
}
