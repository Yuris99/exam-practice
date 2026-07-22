import assert from "node:assert/strict";
import test from "node:test";
import { matchesQuestionMetadata, questionFilterOptions } from "../lib/questionFilters.ts";

function question(id, overrides = {}) {
  return {
    id,
    certificateId: "test",
    category: "데이터베이스",
    examType: "WRITTEN_CBT",
    prompt: `question ${id}`,
    explanation: "explanation",
    difficulty: "medium",
    version: 1,
    choices: ["A", "B", "C", "D"],
    correctChoiceIndex: 0,
    ...overrides
  };
}

test("metadata filter combines exam type, category, difficulty, year and tag", () => {
  const target = question("target", { sourceYear: 2024, tags: ["기출", "SQL"] });
  assert.equal(matchesQuestionMetadata(target, { examType: "WRITTEN_CBT", category: "데이터베이스", difficulty: "medium", sourceYear: "2024", tag: "기출" }), true);
  assert.equal(matchesQuestionMetadata(target, { examType: "WRITTEN_CBT", category: "데이터베이스", difficulty: "medium", sourceYear: "2023", tag: "기출" }), false);
  assert.equal(matchesQuestionMetadata(target, { examType: "WRITTEN_CBT", category: "데이터베이스", difficulty: "medium", sourceYear: "2024", tag: "보안" }), false);
});

test("all metadata filters include questions without year or tags", () => {
  assert.equal(matchesQuestionMetadata(question("legacy"), { examType: "WRITTEN_CBT", sourceYear: "all", tag: "all" }), true);
});

test("filter options are unique and ordered for Korean UI", () => {
  const options = questionFilterOptions([
    question("one", { category: "운영체제", sourceYear: 2023, tags: ["기출", "핵심"] }),
    question("two", { sourceYear: 2025, tags: ["기출"] }),
    question("three", { sourceYear: 2024, tags: ["SQL"] })
  ], "WRITTEN_CBT");
  assert.deepEqual(options.sourceYears, [2025, 2024, 2023]);
  assert.deepEqual(options.tags, ["기출", "핵심", "SQL"].sort((a, b) => a.localeCompare(b, "ko-KR")));
  assert.equal(options.categories.length, 2);
});
