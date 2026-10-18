import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  activateRosterUser,
  createManagedUser,
  importStudents,
  listRoster,
  resetPasswordToDefault,
} from "../services/admin-users-service";
import { handleError } from "../utils/response";

const MAX_IMPORT_ROWS = 200;

const studentRow = t.Object({
  full_name: t.String(),
  nomor_induk: t.String(),
  tanggal_lahir: t.String(),
  kelas: t.Optional(t.String()),
  email: t.Optional(t.String()),
});

// Manajemen akun guru/siswa. Hanya admin — siswa tidak pernah bisa
// memilih role-nya sendiri.
export const adminUsersRoute = new Elysia({
  prefix: "/api/v1/admin/users",
})
  .use(authMiddleware)
  .get(
    "/roster",
    async ({ status }) => {
      try {
        const data = await listRoster();
        return status(200, { success: true, data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Admin"],
        summary: "Daftar siswa yang belum aktivasi",
        security: [{ BearerAuth: [] }],
      },
    }
  )
  .post(
    "/import",
    async ({ body, status }) => {
      try {
        if (body.students.length === 0) {
          return status(400, {
            success: false,
            message: "Daftar siswa kosong",
          });
        }
        if (body.students.length > MAX_IMPORT_ROWS) {
          return status(400, {
            success: false,
            message: `Maksimal ${MAX_IMPORT_ROWS} siswa per impor`,
          });
        }

        const data = await importStudents({
          rows: body.students,
          activate: body.activate ?? false,
        });
        return status(201, { success: true, data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Admin"],
        summary: "Impor daftar siswa",
        description:
          "Dengan `activate: false` baris menjadi roster (siswa aktivasi mandiri). Dengan `activate: true` akun langsung aktif memakai password default DDMMYYYY + 3 digit terakhir NIS.",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        activate: t.Optional(t.Boolean()),
        students: t.Array(studentRow),
      }),
    }
  )
  .post(
    "/",
    async ({ body, status }) => {
      try {
        const data = await createManagedUser({
          fullName: body.full_name,
          nomorInduk: body.nomor_induk,
          tanggalLahir: body.tanggal_lahir,
          role: body.role,
          kelas: body.kelas,
          email: body.email,
        });
        return status(201, { success: true, data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Admin"],
        summary: "Buat akun guru atau siswa",
        description:
          "Akun langsung aktif dengan password default; user wajib menggantinya saat login pertama.",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        full_name: t.String(),
        nomor_induk: t.String(),
        tanggal_lahir: t.String(),
        role: t.Union([t.Literal("guru"), t.Literal("siswa")]),
        kelas: t.Optional(t.String()),
        email: t.Optional(t.String()),
      }),
    }
  )
  .post(
    "/:id/activate",
    async ({ params, status }) => {
      try {
        const data = await activateRosterUser(params.id);
        return status(200, { success: true, data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Admin"],
        summary: "Aktifkan siswa roster dengan password default",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  )
  .post(
    "/:id/reset-password",
    async ({ params, status }) => {
      try {
        const data = await resetPasswordToDefault(params.id);
        return status(200, { success: true, data });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin"]),
      detail: {
        tags: ["Admin"],
        summary: "Reset password user ke password default",
        description:
          "Semua sesi lama user langsung berakhir dan user wajib mengganti password saat login berikutnya.",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  );
