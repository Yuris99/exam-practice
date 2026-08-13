import assert from "node:assert/strict";
import test from "node:test";
import { generatedQuestions as questions } from "../lib/generatedQuestions.ts";

test("published question IDs are unique", () => {
  assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);
});

test("published multiple-choice questions have unique choices", () => {
  for (const question of questions) {
    if (question.examType !== "WRITTEN_CBT") continue;
    const normalized = question.choices.map((choice) => choice.normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase("ko-KR"));
    assert.equal(new Set(normalized).size, normalized.length, question.source ?? question.id);
  }
});

test("unrestored source questions and imported exam headers are not published", () => {
  for (const question of questions) {
    const content = [question.prompt, ...(question.examType === "WRITTEN_CBT" ? question.choices : [])].join(" ");
    assert.doesNotMatch(content, /문제\s*(?:복원\s*)?오류/);
    assert.doesNotMatch(content, /년\s*\d{2}\s*월\s*\d{2}\s*일\s*필기\s*기출문제/);
  }
});
