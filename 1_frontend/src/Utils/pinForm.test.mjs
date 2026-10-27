import assert from "node:assert/strict";
import test from "node:test";
import { validatePinForm } from "./pinForm.mjs";

test("valid pin form has no errors", () => {
  assert.deepEqual(validatePinForm({ message: "gm", amount: 1440 }), {});
});

test("empty message and zero amount report field errors", () => {
  assert.deepEqual(validatePinForm({ message: "", amount: 0 }), {
    message: "Message is required",
    amount: "Amount must be at least 1",
  });
});

test("oversized message and amount report max errors", () => {
  assert.deepEqual(
    validatePinForm({ message: "x".repeat(501), amount: 1000001 }),
    {
      message: "Max message length is 500 characters.",
      amount: "Max amount is 1,000,000.",
    },
  );
});
