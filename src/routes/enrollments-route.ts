import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  createEnrollment,
  listEnrollmentsByStudent,
  updateEnrollmentStatus,
} from "../services/enrollments-services";
import { handleError } from "../utils/response";

export const enrollmentsRoute = new Elysia({ prefix: "/api/v1/enrollments" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ body, user, status }: any) => {
      try {
        const created = await createEnrollment({
          studentId: user.id,
          subjectId: body.subject_id,
        });
        return status(201, {
          success: true,
          message: "Enrollment created",
          data: created,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, {
          success: false,
          message: err.message,
        });
      }
    },
    {
      beforeHandle: requireRole(["siswa"]),
      detail: {
        tags: ["Enrollments"],
        summary: "Daftar ke mata pelajaran",
        description: "Hanya bisa dilakukan oleh siswa. Otomatis menggunakan ID siswa yang login.",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        subject_id: t.String(),
      }),
    }
  )
  .get("/my-courses", async ({ user, status }: any) => {
    try {
      const data = await listEnrollmentsByStudent(user.id);
      return status(200, {
        success: true,
        message: "Enrollments retrieved",
        data,
      });
    } catch (error) {
      const err = handleError(error);
      return status(err.status, {
        success: false,
        message: err.message,
      });
    }
  }, {
    beforeHandle: requireRole(["admin", "guru", "siswa"]),
    detail: {
      tags: ["Enrollments"],
      summary: "List mata pelajaran yang diikuti",
      security: [{ BearerAuth: [] }],
    },
  })
  .patch(
    "/:id/status",
    async ({ params, body, status }: any) => {
      try {
        const updated = await updateEnrollmentStatus(params.id, body.status);
        return status(200, {
          success: true,
          message: "Enrollment status updated",
          data: updated,
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, {
          success: false,
          message: err.message,
        });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru"]),
      detail: {
        tags: ["Enrollments"],
        summary: "Update status enrollment",
        description: "Digunakan admin/guru untuk approve atau reject pendaftaran.",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
      body: t.Object({
        status: t.String(),
      }),
    }
  );
