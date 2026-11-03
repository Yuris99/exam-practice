import assert from "node:assert/strict";
import test from "node:test";
import { generatedQuestions as questions } from "../lib/generatedQuestions.ts";
import { matchesQuestionMetadata, questionFilterOptions } from "../lib/questionFilters.ts";
import { selectMockExamByCategory } from "../lib/testSelection.ts";

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

test("embedded practical first batch has complete original practice content", () => {
  const batch = questions.filter((question) => question.certificateId === "embedded-engineer"
    && question.examType === "PRACTICAL_WRITTEN_RESPONSE"
    && /^\[창작 실기 연습 \d{2}\]/u.test(question.prompt));
  assert.equal(batch.length, 20);
  const categories = new Map();
  for (const question of batch) {
    categories.set(question.category, (categories.get(question.category) ?? 0) + 1);
    assert.equal(question.publicationStatus, "published");
    assert.equal(question.version, 1);
    assert.equal(question.source, "자체 제작 · 창작 실기 연습 (기출 아님)");
    assert.equal(question.sourceYear, undefined, question.id);
    assert.ok(question.tags.includes("창작 실기 연습"), question.id);
    assert.ok(question.referenceText?.trim(), question.id);
    assert.ok(question.modelAnswer.trim(), question.id);
    assert.ok(question.explanation.trim(), question.id);
    assert.ok(question.requiredKeyPoints.length >= 3, question.id);
    assert.equal(new Set(question.requiredKeyPoints).size, question.requiredKeyPoints.length);
    for (const point of question.requiredKeyPoints) {
      assert.ok(point.trim(), question.id);
      assert.ok(`${question.modelAnswer}\n${question.explanation}`.includes(point), `${question.id}: ${point}`);
    }
    if (question.codeSnippet) assert.equal(question.codeLanguage, "c", question.id);
    assert.doesNotMatch([question.prompt, question.referenceText, question.codeSnippet,
      question.modelAnswer, question.explanation].join("\n"), /[\u0000\uFFFD]|\?{2,}/u, question.id);
  }
  assert.deepEqual(Object.fromEntries(categories), {
    "C 코드 분석": 2,
    "비트 연산·레지스터": 3,
    "인터럽트·타이머": 3,
    "주변장치 통신·ADC": 4,
    "메모리": 3,
    "RTOS·동시성": 3,
    "디버깅": 2,
  });
});

test("embedded practical questions reach existing practice filters and mock selection", () => {
  const bank = questions.filter((question) => question.certificateId === "embedded-engineer");
  const examType = "PRACTICAL_WRITTEN_RESPONSE";
  const filters = { examType, category: "all", difficulty: "all", sourceYear: "all", tag: "all" };
  const practical = bank.filter((question) => matchesQuestionMetadata(question, filters));
  assert.equal(practical.length, 139);
  assert.ok(questionFilterOptions(bank, examType).categories.length >= 7);
  assert.equal(bank.filter((question) => matchesQuestionMetadata(question, {
    ...filters, tag: "창작 실기 연습",
  })).length, 20);
  const mock = selectMockExamByCategory(practical, 20);
  assert.equal(new Set(mock.map((question) => question.id)).size, 20);
  assert.ok(mock.every((question) => question.examType === examType));
});
