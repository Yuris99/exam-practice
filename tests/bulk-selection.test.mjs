import assert from "node:assert/strict";
import test from "node:test";
import { togglePageSelection, toggleSelectedId } from "../lib/bulkSelection.ts";

test("individual selection toggles without mutating the original list", () => {
  const original = ["a"];
  assert.deepEqual(toggleSelectedId(original, "b"), ["a", "b"]);
  assert.deepEqual(toggleSelectedId(original, "a"), []);
  assert.deepEqual(original, ["a"]);
});

test("page selection preserves selections from other pages", () => {
  assert.deepEqual(togglePageSelection(["outside"], ["a", "b"]), ["outside", "a", "b"]);
  assert.deepEqual(togglePageSelection(["outside", "a", "b"], ["a", "b"]), ["outside"]);
});
