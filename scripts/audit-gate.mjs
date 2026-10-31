// Full (dev + production) npm audit gate with an exact advisory allowlist.
// Production dependencies are audited separately with plain
// `npm audit --omit=dev --audit-level=low`, which allows nothing.
//
// An allowlisted advisory passes only when it is moderate or lower and every
// installed copy of every flagged package is development-only. Anything else,
// including a malformed report, fails closed.

const BLOCKING_SEVERITIES = new Set(["high", "critical"]);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function installsOf(lockfile, name) {
  const pattern = new RegExp(`(^|/)node_modules/${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
  return Object.entries(lockfile.packages ?? {}).filter(([path]) => pattern.test(path));
}

export function evaluateFullAudit(audit, lockfile, allowlist) {
  if (!isRecord(audit) || !isRecord(audit.vulnerabilities) || audit.error) {
    throw new Error("npm audit: malformed report");
  }
  const errors = [];
  for (const [key, vulnerability] of Object.entries(audit.vulnerabilities)) {
    if (!isRecord(vulnerability) || !Array.isArray(vulnerability.via)) {
      throw new Error(`npm audit: malformed entry ${key}`);
    }
    if (BLOCKING_SEVERITIES.has(vulnerability.severity)) {
      errors.push(`${key}: ${vulnerability.severity} findings are never allowlisted`);
    }
    for (const via of vulnerability.via) {
      if (typeof via === "string") continue;
      const allowed = allowlist.some(
        (entry) => entry.url === via.url && entry.name === via.name,
      );
      if (!allowed) errors.push(`${key}: advisory ${via.url} is not allowlisted`);
    }
    const flagged = Array.isArray(vulnerability.nodes)
      ? vulnerability.nodes.map((path) => [path, lockfile.packages?.[path]])
      : installsOf(lockfile, key);
    for (const [path, entry] of flagged) {
      if (!isRecord(entry)) {
        errors.push(`${key}: flagged install ${path} is missing from package-lock.json`);
      } else if (entry.dev !== true) {
        errors.push(`${key}: ${path} ships to production, so it cannot be allowlisted`);
      }
    }
  }
  return { ok: errors.length === 0, errors };
}

// Advisories published 2026-10-30 with no fix outside a new major line. They
// reach Zapin only through development tooling (eslint 8 and its plugins,
// nodemon), which cannot take minimatch 11 / glob 14 without a breaking
// toolchain upgrade. Remove each entry once the tooling is upgraded.
export const ALLOWLIST = [
  { url: "https://github.com/advisories/GHSA-g3hv-75wg-m249", name: "minimatch" },
  { url: "https://github.com/advisories/GHSA-3g3m-2fjr-6pw4", name: "glob" },
];

async function main() {
  const { spawnSync } = await import("node:child_process");
  const { readFileSync } = await import("node:fs");
  const result = spawnSync("npm", ["audit", "--json"], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.error || (result.status !== 0 && result.status !== 1)) {
    throw new Error(`npm audit failed to run (${result.error?.message ?? `exit ${result.status}`})`);
  }
  const audit = JSON.parse(result.stdout);
  const lockfile = JSON.parse(readFileSync("package-lock.json", "utf8"));
  const { ok, errors } = evaluateFullAudit(audit, lockfile, ALLOWLIST);
  const total = Object.keys(audit.vulnerabilities).length;
  if (!ok) {
    for (const error of errors) console.error(`AUDIT GATE: ${error}`);
    return 1;
  }
  console.log(`Full audit gate passed: ${total} flagged package(s), all allowlisted and development-only.`);
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(
    (code) => { process.exitCode = code; },
    (error) => {
      console.error(`AUDIT GATE: ${error.message}; failing closed`);
      process.exitCode = 1;
    },
  );
}
