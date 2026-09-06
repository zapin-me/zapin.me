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

test("backend resolves qs at the patched minimum", () => {
  assertAtLeast(resolvedVersion("0_backend", "qs"), "6.16.0", "qs", "0_backend");
});

test("frontend resolves qs at the patched minimum", () => {
  assertAtLeast(resolvedVersion("1_frontend", "qs"), "6.16.0", "qs", "1_frontend");
});

test("frontend resolves postcss-selector-parser at the patched minimum", () => {
  assertAtLeast(
    resolvedVersion("1_frontend", "postcss-selector-parser"),
    "6.1.3",
    "postcss-selector-parser",
    "1_frontend",
  );
});
