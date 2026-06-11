import { Type, type Static } from "@sinclair/typebox";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { env } from "../../config/env.js";
import { badRequest, conflict, unauthorized } from "../../lib/api-error.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import { getRequestIp, getUserAgent } from "../../lib/request-meta.js";
import { createSessionToken, daysFromNow, hashSessionToken } from "../../lib/session.js";
import { toUserSummary } from "../../lib/serializers.js";
import { getAuthUserInclude, setSessionCookie, clearSessionCookie } from "../../plugins/auth.js";

const emailPattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";

const RegisterBody = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 120 }),
  email: Type.String({ pattern: emailPattern, maxLength: 190 }),
  password: Type.String({ minLength: 8, maxLength: 200 })
});

const LoginBody = Type.Object({
  email: Type.String({ pattern: emailPattern, maxLength: 190 }),
  password: Type.String({ minLength: 1, maxLength: 200 })
});

async function createSession(
  app: Parameters<FastifyPluginAsync>[0],
  request: FastifyRequest,
  reply: FastifyReply,
  userId: string
) {
  const token = createSessionToken();
  await app.prisma.authSession.create({
    data: {
      userId,
      tokenHash: hashSessionToken(token),
      ipAddress: getRequestIp(request),
      userAgent: getUserAgent(request),
      expiresAt: daysFromNow(env.SESSION_TTL_DAYS)
    }
  });
  setSessionCookie(reply, token);
}

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: Static<typeof RegisterBody> }>(
    "/register",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute"
        }
      },
      schema: {
        body: RegisterBody
      }
    },
    async (request, reply) => {
      const name = request.body.name.trim();
      const email = request.body.email.trim().toLowerCase();

      if (!name) {
        throw badRequest("Tên không được để trống.");
      }

      const existingUser = await app.prisma.user.findUnique({
        where: { email }
      });
      if (existingUser) {
        throw conflict("Email này đã được đăng ký.");
      }

      const passwordHash = await hashPassword(request.body.password);
      const user = await app.prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.create({
          data: {
            name,
            email,
            passwordHash,
            status: "active"
          }
        });
        await tx.userProfile.create({
          data: {
            userId: createdUser.id,
            displayName: name,
            themePreference: "system"
          }
        });

        return tx.user.findUniqueOrThrow({
          where: { id: createdUser.id },
          include: getAuthUserInclude()
        });
      });

      await createSession(app, request, reply, user.id);
      return reply.status(201).send({
        user: toUserSummary(user)
      });
    }
  );

  app.post<{ Body: Static<typeof LoginBody> }>(
    "/login",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "1 minute"
        }
      },
      schema: {
        body: LoginBody
      }
    },
    async (request, reply) => {
      const user = await app.prisma.user.findUnique({
        where: {
          email: request.body.email.trim().toLowerCase()
        },
        include: getAuthUserInclude()
      });

      const isValid =
        user && user.status === "active" && (await verifyPassword(user.passwordHash, request.body.password));

      if (!isValid || !user) {
        throw unauthorized("Email hoặc mật khẩu không đúng.");
      }

      await createSession(app, request, reply, user.id);
      return {
        user: toUserSummary(user)
      };
    }
  );

  app.post("/logout", async (request, reply) => {
    await app.authenticateOptional(request);
    if (request.currentSessionId) {
      await app.prisma.authSession.update({
        where: {
          id: request.currentSessionId
        },
        data: {
          revokedAt: new Date()
        }
      });
    }

    clearSessionCookie(reply);
    return {
      ok: true
    };
  });

  app.get("/me", async (request) => {
    const user = await app.requireAuth(request);
    return {
      user: toUserSummary(user)
    };
  });
};
