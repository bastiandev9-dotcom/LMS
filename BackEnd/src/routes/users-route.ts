import { Elysia, t } from "elysia";
import { authMiddleware } from "../middleware/auth-middleware";
import { logoutUser, updateUserProfile } from "../services/users-services";

// Register & login berada di /api/v1/auth (auth-route.ts). Route ini
// hanya berisi data sesi user yang sedang login.
export const usersRoute = new Elysia({ prefix: "/api/v1/users" })
  .use(authMiddleware)
  .get(
    "/current",
    async ({ user, status }) => {
      return status(200, { data: user });
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Data user yang sedang login",
        security: [{ BearerAuth: [] }],
      },
    }
  )
  .delete(
    "/logout",
    async ({ session, status }) => {
      await logoutUser(session.token);
      return status(200, { data: "OK" });
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Logout",
        description: "Stateless logout — token dihapus di sisi klien.",
        security: [{ BearerAuth: [] }],
      },
    }
  )
  .put(
    "/profile",
    async ({ body, user, status }: any) => {
      try {
        const updated = await updateUserProfile(user.id, {
          fullName: body.fullName,
          phone: body.phone,
          avatarUrl: body.avatarUrl,
        });
        return status(200, {
          success: true,
          message: "Profil berhasil diperbarui",
          data: updated,
        });
      } catch (error) {
        if (error instanceof Error && error.message === "User tidak ditemukan") {
          return status(404, { success: false, message: error.message });
        }
        throw error;
      }
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Update profil user",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        fullName: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        avatarUrl: t.Optional(t.String()),
      }),
    }
  );
