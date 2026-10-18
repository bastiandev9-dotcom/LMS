#!/usr/bin/env bash
# ── Backup database SiManis ───────────────────────────────────────────
# Membuat dump terkompresi (custom format) untuk kedua database dari
# container PostgreSQL lokal.
#
# Pemakaian:
#   bun run db:backup
#   PG_CONTAINER=nama-container bash scripts/db-backup.sh

set -euo pipefail

cd "$(dirname "$0")/.."

CONTAINER="${PG_CONTAINER:-simanis-db}"
PG_USER="${POSTGRES_USER:-postgres}"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT_DIR="backups"

if ! docker inspect "$CONTAINER" >/dev/null 2>&1; then
  echo "❌ Container '$CONTAINER' tidak ditemukan. Jalankan: docker compose up -d" >&2
  exit 1
fi

if [ "$(docker inspect -f '{{.State.Running}}' "$CONTAINER")" != "true" ]; then
  echo "❌ Container '$CONTAINER' sedang berhenti." >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

for db in simanis storage_simanis; do
  target="$OUT_DIR/$db-$STAMP.dump"
  echo "⏳ Backup $db → $target"
  docker exec "$CONTAINER" pg_dump -U "$PG_USER" -d "$db" -Fc > "$target"

  if [ ! -s "$target" ]; then
    echo "❌ Backup $db gagal (file kosong)" >&2
    exit 1
  fi
done

echo "✅ Backup selesai: $OUT_DIR/*-$STAMP.dump"
