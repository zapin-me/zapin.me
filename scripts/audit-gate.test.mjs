import assert from "node:assert/strict";
import test from "node:test";
import { evaluateFullAudit } from "./audit-gate.mjs";

const MINIMATCH_URL = "https://github.com/advisories/GHSA-g3hv-75wg-m249";
const ALLOWLIST = [{ url: MINIMATCH_URL, name: "minimatch" }];

function advisory(name, url, severity = "moderate") {
  return { source: 1, name, dependency: name, url, severity, range: "<11.0.1" };
}

function report(vulnerabilities) {
  return { vulnerabilities };
}

const devLock = {
  packages: {
    "": { name: "app" },
    "node_modules/minimatch": { version: "3.1.5", dev: true },
    "node_modules/eslint": { version: "8.57.0", dev: true },
  },
};

test("passes when npm audit reports no vulnerabilities", () => {
  const result = evaluateFullAudit(report({}), devLock, ALLOWLIST);
  assert.deepEqual(result, { ok: true, errors: [] });
});

test("rejects an advisory that is not allowlisted", () => {
  const result = evaluateFullAudit(
    report({
      minimatch: {
        name: "minimatch",
        severity: "moderate",
        via: [advisory("minimatch", "https://github.com/advisories/GHSA-xxxx-yyyy-zzzz")],
      },
    }),
    devLock,
    ALLOWLIST,
  );
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /GHSA-xxxx-yyyy-zzzz/);
});

test("passes an allowlisted advisory on a development-only package", () => {
  const result = evaluateFullAudit(
    report({
      minimatch: { name: "minimatch", severity: "moderate", via: [advisory("minimatch", MINIMATCH_URL)] },
      eslint: { name: "eslint", severity: "moderate", via: ["minimatch"] },
    }),
    devLock,
    ALLOWLIST,
  );
  assert.deepEqual(result, { ok: true, errors: [] });
});

test("rejects an allowlisted advisory when the package ships to production", () => {
  const lock = structuredClone(devLock);
  lock.packages["node_modules/glob/node_modules/minimatch"] = { version: "9.0.9" };
  const result = evaluateFullAudit(
    report({
      minimatch: { name: "minimatch", severity: "moderate", via: [advisory("minimatch", MINIMATCH_URL)] },
    }),
    lock,
    ALLOWLIST,
  );
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /node_modules\/glob\/node_modules\/minimatch.*production/);
});

test("never allowlists high or critical findings", () => {
  const result = evaluateFullAudit(
    report({
      minimatch: { name: "minimatch", severity: "high", via: [advisory("minimatch", MINIMATCH_URL, "high")] },
    }),
    devLock,
    ALLOWLIST,
  );
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /high/);
});

test("fails closed on a malformed audit report", () => {
  assert.throws(() => evaluateFullAudit({ error: { code: "ENOLOCK" } }, devLock, ALLOWLIST), /malformed/);
});

test("checks only the installs npm flags, not patched production copies", () => {
  const lock = structuredClone(devLock);
  lock.packages["node_modules/glob/node_modules/minimatch"] = { version: "11.0.3" };
  const result = evaluateFullAudit(
    report({
      minimatch: {
        name: "minimatch",
        severity: "moderate",
        via: [advisory("minimatch", MINIMATCH_URL)],
        nodes: ["node_modules/minimatch"],
      },
    }),
    lock,
    ALLOWLIST,
  );
  assert.deepEqual(result, { ok: true, errors: [] });
});
