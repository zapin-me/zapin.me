import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { nonPublicEnvKeys } from "../1_frontend/scripts/check-public-env.mjs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

// Instructions of the last stage of a multi-stage Dockerfile (the image that runs).
function finalStage(dockerfile) {
  const stages = dockerfile.split(/^FROM\s/m);
  return stages[stages.length - 1];
}

// Lines of one top-level service block in docker-compose.yml (2-space indentation).
function composeService(compose, name) {
  const lines = compose.split("\n");
  const start = lines.findIndex((line) => line === `  ${name}:`);
  assert.notEqual(start, -1, `service ${name} must exist in docker-compose.yml`);
  const block = [];
  for (const line of lines.slice(start + 1)) {
    if (/^ {0,2}\S/.test(line)) break;
    block.push(line);
  }
  return block.join("\n");
}

test("frontend image builds the Next.js app", () => {
  assert.match(read("1_frontend/Dockerfile"), /^RUN npm run build$/m);
});

test("frontend image runs the production server, never the dev server", () => {
  const runtime = finalStage(read("1_frontend/Dockerfile"));
  assert.match(runtime, /(CMD|ENTRYPOINT).*start:prod/);
  assert.doesNotMatch(read("1_frontend/Dockerfile"), /start:dev|next dev/);
});

test("frontend image runs as the unprivileged node user", () => {
  assert.match(finalStage(read("1_frontend/Dockerfile")), /^USER node$/m);
});

test("frontend image declares a health check", () => {
  assert.match(finalStage(read("1_frontend/Dockerfile")), /^HEALTHCHECK /m);
});

test("compose runs the frontend from its image without bind-mounting the source", () => {
  const frontend = composeService(read("docker-compose.yml"), "frontend");
  assert.doesNotMatch(frontend, /volumes:/);
  assert.doesNotMatch(read("docker-compose.yml"), /frontend-node-modules/);
});

test("public env check accepts NEXT_PUBLIC_ keys, comments and blank lines", () => {
  const env = "# browser config\nNEXT_PUBLIC_BACKEND_URL=https://api.zapin.me\n\nNEXT_PUBLIC_GA_TAG=\n";
  assert.deepEqual(nonPublicEnvKeys(env), []);
});

test("public env check reports keys that would be baked into the image", () => {
  const env = "NEXT_PUBLIC_BACKEND_URL=https://api.zapin.me\nAPI_SECRET=x\nexport TOKEN=y\n";
  assert.deepEqual(nonPublicEnvKeys(env), ["API_SECRET", "TOKEN"]);
});

test("the frontend sample env only holds public browser values", () => {
  assert.deepEqual(nonPublicEnvKeys(read("1_frontend/.env-sample")), []);
});
