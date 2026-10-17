import { join } from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

/**
 * Jalankan migrasi untuk kedua database: `simanis` (DATABASE_URL) dan
 * `storage_simanis` (STORAGE_DATABASE_URL).
 *
 * Perintah: `bun run db:migrate` (dijalankan dari folder BackEnd).
 *
 * Catatan: script ini hanya membuat/mengubah tabel — database-nya sendiri
 * harus sudah ada. Untuk Docker, pembuatan `storage_simanis` ditangani
 * `docker-compose.yml` melalui folder `initdb/`.
 */
const projectRoot = join(import.meta.dir, "..", "..");

const targets = [
  ["DATABASE_URL", "drizzle"],
  ["STORAGE_DATABASE_URL", "drizzle-storage"],
] as const;

for (const [envName, migrationsFolder] of targets) {
  const url = process.env[envName];

  if (!url) {
    console.error(`❌ ${envName} belum diisi di .env`);
    process.exit(1);
  }

  const folder = join(projectRoot, migrationsFolder);

  // Migrasi sebaiknya pakai satu koneksi saja.
  const client = postgres(url, {
    max: 1,
    // NOTICE "already exists, skipping" dari `CREATE SCHEMA/TABLE IF NOT EXISTS`
    // pada run kedua hanya mengotori output, jadi disaring.
    // 42P06 = duplicate_schema, 42P07 = duplicate_table, 42710 = duplicate_object.
    onnotice: (notice) => {
      if (!["42P06", "42P07", "42710"].includes(notice.code ?? "")) {
        console.warn(`⚠️  ${notice.message}`);
      }
    },
  });

  try {
    console.log(`⏳ Migrating ${migrationsFolder} ...`);
    await migrate(drizzle(client), { migrationsFolder: folder });
    console.log(`✅ Migrasi ${migrationsFolder} selesai`);
  } catch (error) {
    console.error(`❌ Migrasi ${migrationsFolder} gagal:\n`, error);
    console.error(
      "   Pastikan database-nya sudah ada (lihat README → Setup Database).",
    );
    await client.end();
    process.exit(1);
  }

  await client.end();
}

console.log("🎉 Semua migrasi berhasil dijalankan");
process.exit(0);
