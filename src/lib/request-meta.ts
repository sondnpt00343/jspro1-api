import type { FastifyRequest } from "fastify";

export function getRequestIp(request: FastifyRequest): string | null {
  return request.ip || null;
}

export function getUserAgent(request: FastifyRequest): string | null {
  const value = request.headers["user-agent"];
  return typeof value === "string" ? value : null;
}
