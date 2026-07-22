import assert from "node:assert/strict";
import test from "node:test";
import { koreanDateKey, koreanStudyStreak, recentKoreanDays } from "../lib/koreanDate.ts";

test("Korean date key advances at 15:00 UTC", () => {
  assert.equal(koreanDateKey("2026-07-21T14:59:59.000Z"), "2026-07-21");
  assert.equal(koreanDateKey("2026-07-21T15:00:00.000Z"), "2026-07-22");
});

test("recent days are anchored to the Korean calendar", () => {
  const days = recentKoreanDays(3, new Date("2026-07-21T16:00:00.000Z"));
  assert.deepEqual(days, [
    { key: "2026-07-20", label: "7/20" },
    { key: "2026-07-21", label: "7/21" },
    { key: "2026-07-22", label: "7/22" }
  ]);
});

test("study streak counts consecutive Korean dates", () => {
  const timestamps = ["2026-07-21T16:00:00.000Z", "2026-07-20T16:00:00.000Z"];
  assert.equal(koreanStudyStreak(timestamps, new Date("2026-07-22T00:00:00.000Z")), 2);
});

test("study streak may continue from yesterday when today is empty", () => {
  const timestamps = ["2026-07-20T16:00:00.000Z", "2026-07-19T16:00:00.000Z"];
  assert.equal(koreanStudyStreak(timestamps, new Date("2026-07-22T00:00:00.000Z")), 2);
});
