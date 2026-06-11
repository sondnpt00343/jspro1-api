import { Type, type Static } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";
import { getRequestIp, getUserAgent } from "../../lib/request-meta.js";

const emailPattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";

const ContactBody = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 120 }),
  email: Type.String({ pattern: emailPattern, maxLength: 190 }),
  message: Type.String({ minLength: 10, maxLength: 5000 })
});

export const contactRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: Static<typeof ContactBody> }>(
    "/contact-messages",
    {
      config: {
        rateLimit: {
          max: 20,
          timeWindow: "1 minute"
        }
      },
      schema: {
        body: ContactBody
      }
    },
    async (request, reply) => {
      const contactMessage = await app.prisma.contactMessage.create({
        data: {
          name: request.body.name.trim(),
          email: request.body.email.trim().toLowerCase(),
          message: request.body.message.trim(),
          status: "new",
          ipAddress: getRequestIp(request),
          userAgent: getUserAgent(request)
        }
      });

      return reply.status(201).send({
        contactMessage: {
          id: contactMessage.id,
          status: contactMessage.status,
          createdAt: contactMessage.createdAt.toISOString()
        }
      });
    }
  );
};
