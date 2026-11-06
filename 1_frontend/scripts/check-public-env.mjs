// Fails the frontend image build when 1_frontend/.env holds anything other than
// NEXT_PUBLIC_* values. The image bakes .env in at build time; NEXT_PUBLIC_*
// values are inlined into the browser bundle anyway, server secrets are not.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export function nonPublicEnvKeys(text) {
  const keys = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (line === "" || line.startsWith("#")) continue;
    const key = line.replace(/^export\s+/, "").split("=")[0].trim();
    if (!key.startsWith("NEXT_PUBLIC_")) keys.push(key);
  }
  return keys;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = process.argv[2] ?? ".env";
  const keys = nonPublicEnvKeys(readFileSync(file, "utf8"));
  if (keys.length > 0) {
    console.error(`${file} must only hold NEXT_PUBLIC_* values; found: ${keys.join(", ")}`);
    process.exit(1);
  }
}
