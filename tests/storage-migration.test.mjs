import assert from "node:assert/strict";
import test from "node:test";
import { emptyStudyState, mergeStudyStates, migrateStudyState, STUDY_DATA_FORMAT, STUDY_DATA_VERSION } from "../lib/storage.ts";

const answer = {
  questionId: "q1",
  questionVersion: 1,
  value: 2,
  isCorrect: true,
  answeredAt: "2026-07-22T00:00:00.000Z"
};

test("legacy unwrapped study data is migrated without losing valid records", () => {
  const migrated = migrateStudyState({ answers: { q1: answer }, bookmarks: ["q1"], aiExplanations: { cache: "설명" } });
  assert.deepEqual(migrated.answers.q1, answer);
  assert.deepEqual(migrated.bookmarks, ["q1"]);
  assert.equal(migrated.aiExplanations.cache, "설명");
  assert.deepEqual(migrated.testResults, []);
});

test("current versioned storage envelope is read", () => {
  const migrated = migrateStudyState({ format: STUDY_DATA_FORMAT, version: STUDY_DATA_VERSION, data: { bookmarks: ["q2"], notes: { q2: "메모" } } });
  assert.deepEqual(migrated.bookmarks, ["q2"]);
  assert.equal(migrated.notes.q2, "메모");
});

test("malformed sections are isolated while valid sections survive", () => {
  const migrated = migrateStudyState({ answers: { valid: answer, broken: { questionId: 3 } }, bookmarks: "not-an-array", notes: { q1: "유지", q2: 42 }, testResults: [{ id: "broken" }] });
  assert.deepEqual(Object.keys(migrated.answers), ["valid"]);
  assert.deepEqual(migrated.bookmarks, []);
  assert.deepEqual(migrated.notes, { q1: "유지" });
  assert.deepEqual(migrated.testResults, []);
});

test("non-object storage falls back to an empty state", () => {
  const migrated = migrateStudyState("broken");
  assert.deepEqual(migrated.bookmarks, []);
  assert.deepEqual(migrated.answers, {});
  assert.equal(migrated.activeTest, null);
});

test("rich question content survives storage migration", () => {
  const richQuestion = {
    id: "rich",
    certificateId: "test",
    category: "프로그래밍",
    examType: "WRITTEN_CBT",
    prompt: "코드의 결과는?",
    explanation: "설명",
    difficulty: "medium",
    version: 1,
    choices: ["1", "2", "3", "4"],
    correctChoiceIndex: 1,
    referenceText: "보기 1\n보기 2",
    codeSnippet: "const value = 2;\nconsole.log(value);",
    codeLanguage: "JavaScript",
    imageUrl: "/one.png",
    imageUrls: ["/two.png"]
  };
  const migrated = migrateStudyState({ customQuestions: [richQuestion] });
  assert.deepEqual(migrated.customQuestions, [richQuestion]);
});

test("cloud merge preserves records from both devices and keeps the latest answer", () => {
  const local = structuredClone(emptyStudyState);
  const cloud = structuredClone(emptyStudyState);
  local.bookmarks = ["local", "shared"];
  cloud.bookmarks = ["cloud", "shared"];
  local.answers.q1 = { questionId: "q1", questionVersion: 1, value: 2, answeredAt: "2026-01-02T00:00:00.000Z" };
  cloud.answers.q1 = { questionId: "q1", questionVersion: 1, value: 1, answeredAt: "2026-01-01T00:00:00.000Z" };
  cloud.answers.q2 = { questionId: "q2", questionVersion: 1, value: 3, answeredAt: "2026-01-03T00:00:00.000Z" };

  const merged = mergeStudyStates(local, cloud);

  assert.deepEqual(new Set(merged.bookmarks), new Set(["local", "cloud", "shared"]));
  assert.equal(merged.answers.q1.value, 2);
  assert.equal(merged.answers.q2.value, 3);
});

test("knowledge status survives storage migration", () => {
  const migrated = migrateStudyState({
    answers: {
      guessed: { ...answer, questionId: "guessed", knowledgeStatus: "unknown" },
      known: { ...answer, questionId: "known", knowledgeStatus: "known" },
      broken: { ...answer, questionId: "broken", knowledgeStatus: "maybe" }
    }
  });

  assert.equal(migrated.answers.guessed.knowledgeStatus, "unknown");
  assert.equal(migrated.answers.known.knowledgeStatus, "known");
  assert.equal(migrated.answers.broken, undefined);
});
