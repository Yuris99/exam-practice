import assert from "node:assert/strict";
import test from "node:test";
import { gradeTest } from "../lib/testGrading.ts";

test("a mock exam fails when any subject is below the minimum", () => {
  const result = gradeTest(72, 60, [
    { category: "A", correct: 8, total: 10, accuracy: 80 },
    { category: "B", correct: 3, total: 10, accuracy: 30 }
  ], 40);
  assert.equal(result.passed, false);
  assert.equal(result.reason, "category");
  assert.deepEqual(result.failedCategories.map((item) => item.category), ["B"]);
});

test("a mock exam requires both the total and every subject minimum", () => {
  assert.equal(gradeTest(59, 60, [{ category: "A", correct: 6, total: 10, accuracy: 60 }], 40).reason, "total");
  assert.equal(gradeTest(60, 60, [{ category: "A", correct: 4, total: 10, accuracy: 40 }], 40).reason, "passed");
});

test("a random exam remains ungraded", () => {
  assert.equal(gradeTest(90, null, [], null).passed, null);
});
