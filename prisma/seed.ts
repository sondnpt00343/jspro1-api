import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inSingleQuote = false;
  let inLineComment = false;
  let dollarTag: string | null = null;

  for (let index = 0; index < sql.length; index += 1) {
    const char = sql[index];
    const next = sql[index + 1];

    if (inLineComment) {
      current += char;
      if (char === "\n") {
        inLineComment = false;
      }
      continue;
    }

    if (!inSingleQuote && !dollarTag && char === "-" && next === "-") {
      inLineComment = true;
      current += char;
      continue;
    }

    if (!inSingleQuote && char === "$") {
      const match = sql.slice(index).match(/^\$[A-Za-z0-9_]*\$/);
      if (match) {
        const tag = match[0];
        if (dollarTag === tag) {
          dollarTag = null;
        } else if (!dollarTag) {
          dollarTag = tag;
        }
        current += tag;
        index += tag.length - 1;
        continue;
      }
    }

    if (!dollarTag && char === "'" && sql[index - 1] !== "\\") {
      inSingleQuote = !inSingleQuote;
    }

    if (!inSingleQuote && !dollarTag && char === ";") {
      const statement = normalizeStatement(current);
      if (statement && statement !== "BEGIN" && statement !== "COMMIT") {
        statements.push(statement);
      }
      current = "";
      continue;
    }

    current += char;
  }

  const tail = normalizeStatement(current);
  if (tail && tail !== "BEGIN" && tail !== "COMMIT") {
    statements.push(tail);
  }

  return statements;
}

function normalizeStatement(statement: string): string {
  return statement.replace(/^\s*(?:--[^\n]*(?:\n|$)\s*)+/g, "").trim();
}

async function main() {
  const seedPath = await resolveSeedPath();
  const sql = await readFile(seedPath, "utf8");

  for (const statement of splitSqlStatements(sql)) {
    await prisma.$executeRawUnsafe(statement);
  }
}

async function resolveSeedPath(): Promise<string> {
  const candidates = [
    join(dirname(fileURLToPath(import.meta.url)), "seed.sql"),
    join(process.cwd(), "prisma", "seed.sql")
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next known runtime location.
    }
  }

  return candidates[0];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
