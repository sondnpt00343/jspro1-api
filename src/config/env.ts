import "dotenv/config";

function readNumber(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) {
    return fallback;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric environment variable: ${key}`);
  }

  return parsed;
}

function readBoolean(key: string, fallback: boolean): boolean {
  const raw = process.env[key];
  if (!raw) {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(raw.toLowerCase());
}

function readList(key: string, fallback: string[]): string[] {
  const raw = process.env[key];
  if (!raw) {
    return fallback;
  }

  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  HOST: process.env.HOST ?? "0.0.0.0",
  PORT: readNumber("PORT", 4000),
  DATABASE_URL:
    process.env.DATABASE_URL ??
    "postgresql://blog:blog@localhost:5432/jspro1_api?schema=public",
  CORS_ORIGINS: readList("CORS_ORIGINS", [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ]),
  COOKIE_NAME: process.env.COOKIE_NAME ?? "blog_session",
  COOKIE_SECURE: readBoolean("COOKIE_SECURE", process.env.NODE_ENV === "production"),
  SESSION_TTL_DAYS: readNumber("SESSION_TTL_DAYS", 30),
  PASSWORD_RESET_TTL_MINUTES: readNumber("PASSWORD_RESET_TTL_MINUTES", 30),
  RATE_LIMIT_MAX: readNumber("RATE_LIMIT_MAX", 200),
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW ?? "1 minute"
};

export function isProduction() {
  return env.NODE_ENV === "production";
}

export function isTest() {
  return env.NODE_ENV === "test";
}
