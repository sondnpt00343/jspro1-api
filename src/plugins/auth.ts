import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { env } from "../config/env.js";
import { unauthorized } from "../lib/api-error.js";
import { daysFromNow, hashSessionToken } from "../lib/session.js";
import { toUserSummary } from "../lib/serializers.js";
import type { UserSummarySource } from "../types/user.js";

const authUserInclude = {
  profile: {
    include: {
      avatar: {
        include: {
          variants: true
        }
      }
    }
  }
} as const;

export function getAuthUserInclude() {
  return authUserInclude;
}

export function setSessionCookie(reply: FastifyReply, token: string) {
  reply.setCookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.COOKIE_SECURE,
    path: "/",
    expires: daysFromNow(env.SESSION_TTL_DAYS)
  });
}

export function clearSessionCookie(reply: FastifyReply) {
  reply.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.COOKIE_SECURE,
    path: "/"
  });
}

export function registerAuth(app: FastifyInstance) {
  app.decorateRequest("currentUser", undefined);
  app.decorateRequest("currentSessionId", undefined);

  app.decorate("authenticateOptional", async (request: FastifyRequest) => {
    const token = request.cookies[env.COOKIE_NAME];
    if (!token) {
      return;
    }

    const session = await app.prisma.authSession.findFirst({
      where: {
        tokenHash: hashSessionToken(token),
        revokedAt: null,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: {
          include: authUserInclude
        }
      }
    });

    if (!session || session.user.status !== "active") {
      return;
    }

    request.currentSessionId = session.id;
    request.currentUser = session.user as UserSummarySource;
  });

  app.decorate("requireAuth", async (request: FastifyRequest) => {
    await app.authenticateOptional(request);
    if (!request.currentUser) {
      throw unauthorized();
    }

    return request.currentUser;
  });
}

export function toCurrentUserPayload(user: UserSummarySource) {
  return toUserSummary(user);
}
