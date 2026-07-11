#!/usr/bin/env bash
set -euo pipefail

expected="v0.8.0"
actual=$(git -C submodules/phoenixd describe --tags --exact-match 2>/dev/null || true)
if [[ "$actual" != "$expected" ]]; then
  echo "phoenixd submodule must be pinned to $expected, got ${actual:-unversioned}" >&2
  exit 1
fi

if grep -q 'PHOENIXD_BRANCH=v0.3.3' submodules/phoenixd/.docker/Dockerfile; then
  echo "legacy Phoenixd 0.3.3 JVM image still configured" >&2
  exit 1
fi

if ! grep -q 'phoenixdReleaseExecutable' submodules/phoenixd/.docker/Dockerfile; then
  echo "expected modern native Phoenixd image build" >&2
  exit 1
fi

echo "phoenixd runtime pin: $expected (native build)"
