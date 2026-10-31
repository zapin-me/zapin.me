import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);

function resolvedVersion(project, dependency) {
  const lockfile = JSON.parse(
    readFileSync(new URL(`${project}/package-lock.json`, root), "utf8"),
  );
  return lockfile.packages?.[`node_modules/${dependency}`]?.version;
}

function assertAtLeast(actual, minimum, dependency, project) {
  assert.ok(actual, `${dependency} must be resolved in ${project}`);
  const actualParts = actual.split(".").map(Number);
  const minimumParts = minimum.split(".").map(Number);

  for (let index = 0; index < 3; index += 1) {
    if (actualParts[index] > minimumParts[index]) return;
    if (actualParts[index] < minimumParts[index]) {
      assert.fail(
        `${dependency} ${actual} in ${project} is below the secure minimum ${minimum}`,
      );
    }
  }
}

// GHSA-6pq8-jhm2-2vcw (medium): qs.stringify arrayFormat "comma" TypeError
test("backend resolves qs at the patched minimum", () => {
  assertAtLeast(resolvedVersion("0_backend", "qs"), "6.16.1", "qs", "0_backend");
});

test("frontend resolves qs at the patched minimum", () => {
  assertAtLeast(resolvedVersion("1_frontend", "qs"), "6.16.1", "qs", "1_frontend");
});

test("backend resolves undici at the patched minimum", () => {
  assertAtLeast(
    resolvedVersion("0_backend", "undici"),
    "6.28.1",
    "undici",
    "0_backend",
  );
});

test("frontend resolves postcss-selector-parser at the patched minimum", () => {
  assertAtLeast(
    resolvedVersion("1_frontend", "postcss-selector-parser"),
    "6.1.5",
    "postcss-selector-parser",
    "1_frontend",
  );
});

test("frontend resolves glob at the patched minimum", () => {
  // GHSA-3g3m-2fjr-6pw4 (medium), production path via tailwindcss -> sucrase
  assertAtLeast(resolvedVersion("1_frontend", "glob"), "14.0.2", "glob", "1_frontend");
});

test("frontend production minimatch installs are patched", () => {
  // GHSA-g3hv-75wg-m249 (medium) has no fix below 11.0.1; dev-only lint
  // tooling may still carry older copies, production paths may not.
  const lockfile = JSON.parse(
    readFileSync(new URL("1_frontend/package-lock.json", root), "utf8"),
  );
  for (const [path, entry] of Object.entries(lockfile.packages)) {
    if (!/(^|\/)node_modules\/minimatch$/.test(path) || entry.dev === true) continue;
    assertAtLeast(entry.version, "11.0.1", `minimatch (${path})`, "1_frontend");
  }
});

test("frontend resolves zod at the patched minimum", () => {
  // GHSA-mrhx-c7xc-m3w5 (high); no 3.x fix exists
  assertAtLeast(resolvedVersion("1_frontend", "zod"), "4.6.6", "zod", "1_frontend");
});

test("frontend resolves next at the patched minimum", () => {
  // GHSA-2464-fhr4-w9xw (critical RCE) and GHSA-p3m5-59mp-jv5r (high DoS)
  assertAtLeast(resolvedVersion("1_frontend", "next"), "15.5.28", "next", "1_frontend");
});
