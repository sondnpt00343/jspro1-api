import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "@prisma/client";
import { ApiError, conflict } from "./api-error.js";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler(
    (error: FastifyError | Error, request: FastifyRequest, reply: FastifyReply) => {
      if (error instanceof ApiError) {
        return reply.status(error.statusCode).send({
          error: {
            code: error.code,
            message: error.message,
            ...(error.details ? { details: error.details } : {})
          }
        });
      }

      if ("validation" in error && error.validation) {
        return reply.status(400).send({
          error: {
            code: "VALIDATION_ERROR",
            message: "Dữ liệu gửi lên chưa hợp lệ.",
            details: error.validation
          }
        });
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const apiError = conflict("Dữ liệu đã tồn tại.", error.meta ?? null);
        return reply.status(apiError.statusCode).send({
          error: {
            code: apiError.code,
            message: apiError.message,
            details: apiError.details
          }
        });
      }

      request.log.error(error);
      return reply.status(500).send({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Máy chủ gặp lỗi khi xử lý yêu cầu."
        }
      });
    }
  );
}
