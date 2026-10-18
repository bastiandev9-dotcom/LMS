// ── Rate limit in-memory (per proses) ─────────────────────────────────
// Cukup untuk menahan brute force & spam email pada single-instance
// deployment. Jika nanti di-scale horizontal, ganti Map ini dengan Redis.

import { TooManyRequestsError } from "../utils/response";

interface Bucket {
  hits: number[];
}

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

// X-Forwarded-For hanya dipercaya bila backend memang berada di balik
// reverse proxy tepercaya; kalau tidak, klien bisa memalsukan IP.
const TRUST_PROXY = process.env.TRUST_PROXY === "true";

/** Ambil IP klien dari reverse proxy atau socket Bun. */
export function getClientIp(
  request: Request,
  server?: { requestIP(req: Request): { address: string } | null } | null
): string {
  if (TRUST_PROXY) {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
      const first = forwarded.split(",")[0]?.trim();
      if (first) return first;
    }

    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
  }

  return server?.requestIP(request)?.address ?? "unknown";
}

/**
 * Catat satu percobaan dan lempar 429 bila melewati batas.
 * Key sebaiknya menggabungkan aksi + IP (mis. `login:127.0.0.1`).
 */
export function enforceRateLimit(
  key: string,
  limit: number,
  windowMs: number
): void {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  const hits = bucket.hits.filter((time) => now - time < windowMs);

  if (hits.length >= limit) {
    bucket.hits = hits;
    buckets.set(key, bucket);
    throw new TooManyRequestsError(
      "Terlalu banyak percobaan. Coba lagi beberapa saat lagi."
    );
  }

  hits.push(now);
  bucket.hits = hits;
  buckets.set(key, bucket);

  if (buckets.size > MAX_BUCKETS) {
    for (const [bucketKey, value] of buckets) {
      if (value.hits.every((time) => now - time >= windowMs)) {
        buckets.delete(bucketKey);
      }
    }
  }
}
