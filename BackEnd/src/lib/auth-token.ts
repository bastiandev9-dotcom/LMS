// ── Token sekali pakai untuk aktivasi & reset password ────────────────
// Token mentah (256-bit) hanya dikirim ke email. Database menyimpan
// hash SHA-256-nya, sehingga bocornya tabel tidak membocorkan token.

import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "../db";
import { authTokens } from "../db/schema";

export type AuthTokenType = "activation" | "password_reset";

const TOKEN_TTL_MS: Record<AuthTokenType, number> = {
  activation: 24 * 60 * 60 * 1000, // 24 jam
  password_reset: 60 * 60 * 1000, // 1 jam
};

export interface IssuedToken {
  token: string;
  expiresAt: Date;
}

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Terbitkan token baru dan batalkan token sejenis yang belum terpakai,
 * sehingga hanya link terakhir yang berlaku.
 */
export async function issueAuthToken(
  userId: string,
  type: AuthTokenType
): Promise<IssuedToken> {
  await db
    .delete(authTokens)
    .where(
      and(
        eq(authTokens.userId, userId),
        eq(authTokens.type, type),
        isNull(authTokens.usedAt)
      )
    );

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS[type]);

  await db.insert(authTokens).values({
    userId,
    type,
    tokenHash: hashToken(token),
    expiresAt,
  });

  return { token, expiresAt };
}

/**
 * Pakai token sekali saja. Update bersyarat (belum terpakai & belum
 * kedaluwarsa) membuat dua request paralel tidak bisa memakai token yang sama.
 */
export async function consumeAuthToken(
  rawToken: string,
  type: AuthTokenType
): Promise<string> {
  if (!rawToken.trim()) {
    throw new Error("Token tidak valid atau sudah kedaluwarsa");
  }

  const rows = await db
    .update(authTokens)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(authTokens.tokenHash, hashToken(rawToken.trim())),
        eq(authTokens.type, type),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, new Date())
      )
    )
    .returning({ userId: authTokens.userId });

  const consumed = rows[0];
  if (!consumed) {
    throw new Error("Token tidak valid atau sudah kedaluwarsa");
  }

  return consumed.userId;
}

/** Batalkan seluruh token aktif milik user (dipakai setelah password berubah). */
export async function revokeAuthTokens(userId: string): Promise<void> {
  await db
    .delete(authTokens)
    .where(and(eq(authTokens.userId, userId), isNull(authTokens.usedAt)));
}
