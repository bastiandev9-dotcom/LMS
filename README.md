# SiManis — Learning Management System

![Bun](https://img.shields.io/badge/Bun-1.4+-black?logo=bun)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green)

Platform manajemen pembelajaran (LMS) untuk SMK Mataram — mencakup manajemen siswa, guru, mata pelajaran, modul, dan bimbingan konseling.

---

## Struktur Proyek

```
LMS/
├── BackEnd/      # REST API — Bun + Elysia + Drizzle ORM
├── FrontEnd/     # Web App — Next.js 15 + Tailwind CSS
└── README.md
```

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Runtime | [Bun](https://bun.sh) v1.4+ |
| Backend Framework | [Elysia](https://elysiajs.com) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) |
| Database | PostgreSQL (via [Supabase](https://supabase.com) atau Docker) |
| Frontend Framework | [Next.js 15](https://nextjs.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| UI Components | [Shadcn/UI](https://ui.shadcn.com) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs) + [TanStack Query](https://tanstack.com/query) |
| Animation | [Framer Motion](https://www.framer.com/motion) |

---

## Prasyarat

- [Bun](https://bun.sh) v1.4+
- [Node.js](https://nodejs.org) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop) — database PostgreSQL 16 dijalankan lewat `docker compose`

---

## Cara Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/rafifhardjaa/LMS.git
cd LMS
```

### 2. Setup BackEnd

```bash
cd BackEnd

# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Edit .env — minimal ganti JWT_SECRET
```

Contoh isi `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/simanis
STORAGE_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/storage_simanis
JWT_SECRET=isi_string_acak_minimal_32_karakter
PORT=3000
```

```bash
# Nyalakan PostgreSQL (sekali saja untuk container + volume-nya)
docker compose up -d

# Terapkan migrasi ke kedua database
bun run db:migrate

# Isi data awal (opsional, untuk development)
bun run seed

# Jalankan server (watch mode)
bun run dev
```

> Langkah migrasi + seed bisa disingkat jadi satu perintah: `bun run db:setup`.

Server berjalan di `http://localhost:3000`.
Swagger UI tersedia di `http://localhost:3000/swagger`.

### 3. Setup FrontEnd

```bash
cd FrontEnd

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Pastikan NEXT_PUBLIC_API_URL mengarah ke backend

# Jalankan development server
npm run dev
```

Frontend berjalan di `http://localhost:3001`.

### Troubleshooting Database

**Gejala 1:** `bun run db:migrate` gagal dengan pesan `database "storage_simanis" does not exist`.

**Gejala 2:** `psql`/DBeaver hanya menampilkan database `simanis`; `storage_simanis` tidak ada atau ada tapi tanpa tabel.

Kedua gejala punya sebab yang sama: container PostgreSQL hanya membuat `simanis` (dari `POSTGRES_DB`), sedangkan `storage_simanis` dibuat oleh script di `BackEnd/initdb/`. Script init **hanya dijalankan saat volume database masih kosong**, jadi mesin yang volume-nya sudah terbentuk sebelum perubahan ini tidak mendapat database kedua.

Solusinya, dari folder `BackEnd`:

```bash
# Buang volume lama lalu buat ulang dari nol (data lokal akan hilang)
docker compose down -v
docker compose up -d

# Terapkan migrasi + data awal
bun run db:setup
```

Setelah itu `docker exec simanis-db psql -U postgres -lqt` harus menampilkan `simanis` **dan** `storage_simanis`.

Kalau DBeaver masih hanya menampilkan satu database, aktifkan opsi **Show all databases** di *Connection settings → PostgreSQL* pada koneksi tersebut.

---

## API Endpoints

### Auth — `/api/users`

| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| `GET` | `/` | — | Health check |
| `POST` | `/api/users` | — | Register user baru |
| `POST` | `/api/users/login` | — | Login → JWT token |
| `GET` | `/api/users/current` | Bearer | Data user aktif |
| `DELETE` | `/api/users/logout` | Bearer | Logout (stateless) |

### Subjects — `/api/subjects`

| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| `POST` | `/api/subjects` | admin, guru | Buat mata pelajaran |
| `GET` | `/api/subjects` | semua | List mata pelajaran |
| `PUT` | `/api/subjects/:id` | admin | Update mata pelajaran |
| `DELETE` | `/api/subjects/:id` | admin | Hapus mata pelajaran |

### Modules — `/api/modules`

| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| `POST` | `/api/modules` | admin, guru | Buat modul |
| `GET` | `/api/modules` | semua | List modul (filter `?subject_id=`) |
| `PUT` | `/api/modules/:id` | admin, guru pemilik | Update modul |
| `DELETE` | `/api/modules/:id` | admin, guru pemilik | Hapus modul |

> Role yang tersedia: `admin` \| `guru` \| `siswa`

---

## Struktur Folder

### BackEnd

```
BackEnd/
├── src/
│   ├── index.ts              # Entry point
│   ├── routes/               # Definisi endpoint Elysia
│   ├── services/             # Business logic
│   ├── middleware/           # Auth middleware (JWT)
│   └── db/
│       ├── index.ts          # Koneksi database simanis
│       ├── storage.ts        # Koneksi database storage_simanis
│       ├── schema.ts         # Definisi tabel (Drizzle)
│       ├── storage-schema.ts # Definisi tabel storage
│       ├── migrate.ts        # Runner migrasi kedua database
│       └── seed.ts           # Data awal
├── drizzle/                  # Migrasi SQL — database simanis
├── drizzle-storage/          # Migrasi SQL — database storage_simanis
├── initdb/                   # Script init container PostgreSQL
├── drizzle.config.ts         # Konfigurasi Drizzle Kit (simanis)
├── drizzle.storage.config.ts # Konfigurasi Drizzle Kit (storage_simanis)
├── docker-compose.yml        # PostgreSQL 16 → simanis + storage_simanis
└── package.json
```

### FrontEnd

```
FrontEnd/
├── app/                      # Halaman (Next.js App Router)
│   ├── admin/                # Dashboard admin
│   ├── teacher/              # Dashboard guru
│   ├── student/              # Dashboard siswa
│   └── auth/                 # Login & register
├── components/               # Komponen UI
│   ├── admin/
│   ├── teacher/
│   ├── student/
│   └── ui/                   # Komponen Shadcn
├── lib/
│   ├── api/                  # API client
│   ├── store/                # Zustand state
│   └── providers/            # React providers
├── hooks/                    # Custom hooks
└── middleware.ts             # Auth middleware Next.js
```

---

## Database & Migrasi

Satu server PostgreSQL menyimpan **dua database**:

| Database | Isi | Config Drizzle | Folder migrasi |
|---|---|---|---|
| `simanis` | data utama (users, subjects, modules, lessons, enrollments, ...) | `drizzle.config.ts` | `BackEnd/drizzle/` |
| `storage_simanis` | file upload (`uploaded_files`) | `drizzle.storage.config.ts` | `BackEnd/drizzle-storage/` |

Database-nya dibuat otomatis oleh `BackEnd/initdb/01-create-storage-db.sql` ketika volume Docker masih kosong; tabelnya dibuat oleh file migrasi yang ter-commit di repo. Karena itu **jangan** membuat tabel manual di DBeaver/psql — perubahan schema harus lewat migrasi supaya semua orang mendapat struktur yang sama.

### Setelah mengubah schema

```bash
cd BackEnd

# 1. Generate file migrasi dari schema.ts
bun run db:generate

# 2. Terapkan ke database
bun run db:migrate

# 3. Commit folder drizzle/ beserta meta/ — tanpa ini, mesin lain tidak ikut berubah
```

Untuk tabel storage (`src/db/storage-schema.ts`), langkah 1 diganti dengan `bun run db:generate:storage` (output ke `drizzle-storage/`).

`bun run db:push` hanya untuk eksperimen lokal: ia menyamakan database langsung tanpa menghasilkan file migrasi, sehingga tidak bisa direproduksi di mesin lain. Jangan dipakai sebagai alur utama.

---

## Scripts

### BackEnd

| Command | Fungsi |
|---|---|
| `bun run dev` | Jalankan server + auto-reload |
| `bun run db:migrate` | Terapkan migrasi ke database `simanis` dan `storage_simanis` |
| `bun run db:generate` | Buat file migrasi baru dari `src/db/schema.ts` |
| `bun run db:generate:storage` | Buat file migrasi baru dari `src/db/storage-schema.ts` |
| `bun run db:setup` | `db:migrate` lalu `seed` |
| `bun run db:push` | Push schema langsung tanpa file migrasi (dev cepat) |
| `bun run seed` | Isi data awal ke database |

> Jalankan semua perintah database dari folder `BackEnd`.

### FrontEnd

| Command | Fungsi |
|---|---|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan hasil build |
| `npm run lint` | Cek kode dengan ESLint |

---

## Alur Kontribusi

```
feature/nama-fitur  →  dev  →  staging  →  main
```

1. Buat branch dari `dev`:
   ```bash
   git checkout dev
   git checkout -b feature/nama-fitur
   ```

2. Commit perubahan:
   ```bash
   git add .
   git commit -m "feat: deskripsi singkat perubahan"
   ```

3. Push dan buat Pull Request ke `dev`:
   ```bash
   git push -u origin feature/nama-fitur
   ```

4. Setelah review → merge ke `dev` → `staging` → `main`

### Konvensi Commit Message

| Prefix | Kegunaan |
|---|---|
| `feat:` | Fitur baru |
| `fix:` | Bug fix |
| `chore:` | Maintenance, config |
| `refactor:` | Refactoring kode |
| `docs:` | Perubahan dokumentasi |

---

## Troubleshooting

- **`DATABASE_URL is not defined`** → Pastikan file `.env` sudah ada dan `DATABASE_URL` terisi dengan benar.
- **`bun run db:push` gagal** → Cek koneksi database, pastikan host & password Supabase sudah benar.
- **`JWT_SECRET` kosong** → Wajib diisi, server tidak bisa berjalan tanpa ini.
- **Port 3000 sudah dipakai** → Ganti `PORT` di `.env` (misal `PORT=3001`).
- **Token masih valid setelah logout** → Normal — auth menggunakan JWT stateless, logout hanya menghapus token di sisi klien.

---

## License

MIT © 2026 SMK Mataram
