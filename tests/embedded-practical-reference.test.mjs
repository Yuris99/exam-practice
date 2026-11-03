import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { generatedQuestions } from "../lib/generatedQuestions.ts";
import { migrateStudyState } from "../lib/storage.ts";
import { calculateCategoryScores, gradeTest } from "../lib/testGrading.ts";
const manifest = JSON.parse(readFileSync(new URL("../data/embedded-practical/reference-manifest.json", import.meta.url), "utf8"));
const byId = new Map(generatedQuestions.map((question) => [question.id, question]));

test("all printed source items have a review disposition and uncertain originals stay unapproved", () => {
  const review = JSON.parse(readFileSync(new URL("../data/embedded-practical/source-review.json", import.meta.url), "utf8"));
  assert.equal(review.items.length, 200);
  assert.deepEqual(review.pagesRead, Array.from({ length: 22 }, (_, index) => index + 1));
  assert.equal(new Set(review.items.map((item) => `${item.year}:${item.question}`)).size, 200);
  for (const item of review.items) {
    assert.ok(["reference", "adapted", "review_required", "not_selected"].includes(item.status));
    for (const id of item.generatedIds) assert.ok(byId.has(id), id);
    if (item.status === "review_required") {
      assert.ok(item.generatedIds.every((id) => manifest.items.find((entry) => entry.id === id)?.classification === "adapted"));
    }
  }
  for (const [year, question] of [[2020, 18], [2023, 16]]) {
    const circuit = review.items.find((item) => item.year === year && item.question === question);
    assert.equal(circuit.status, "review_required");
    assert.deepEqual(circuit.generatedIds, []);
  }
});

test("reference batch is complete, traceable, distinct and honest about provenance", () => {
  assert.equal(manifest.items.length, 119);
  const identities = new Set();
  const types = new Map();
  for (const item of manifest.items) {
    const question = byId.get(item.id);
    assert.ok(question, item.id);
    assert.equal(question.certificateId, "embedded-engineer");
    assert.equal(question.examType, "PRACTICAL_WRITTEN_RESPONSE");
    assert.equal(question.prompt, item.prompt);
    assert.ok(question.source.includes(manifest.sourceUrl));
    assert.ok(question.source.includes(`p.${item.page}`));
    assert.ok(question.source.includes(`문항 ${item.question}`));
    assert.equal(question.sourceYear, item.classification === "reference" ? item.year : undefined);
    assert.ok(item.year >= 2015 && item.year <= 2025);
    assert.ok(item.page >= 1 && item.page <= 22);
    assert.ok(question.tags.includes(`유형:${item.kind}`));
    assert.ok(question.modelAnswer.trim() && question.explanation.trim());
    assert.ok(question.requiredKeyPoints.length >= 2);
    assert.ok(question.referenceText.includes("공식 기출·공식 정답을 뜻하지 않는다"));
    assert.doesNotMatch([question.prompt, question.modelAnswer, question.explanation, question.codeSnippet].join("\n"), /[\u0000\uFFFD]|\?{2,}/u);
    const normalized = question.prompt.replace(/^\[[^\]]+\]\s*/u, "").normalize("NFKC").replace(/\s+/gu, " ");
    assert.ok(!identities.has(normalized), normalized);
    identities.add(normalized);
    types.set(item.kind, (types.get(item.kind) ?? 0) + 1);
  }
  assert.equal(manifest.items.filter((item) => item.classification === "reference").length, 21);
  assert.deepEqual(Object.fromEntries([...types].sort()), { "계산": 19, "단답": 22, "복수답": 25, "서술": 24, "순서": 5, "코드": 24 });
});

test("accepted first batch CSV is byte-for-byte preserved", () => {
  const bytes = readFileSync(new URL("../content/questions/embedded-engineer-practical.csv", import.meta.url));
  assert.equal(createHash("sha256").update(bytes).digest("hex"), "95bc0f5d10a0ea76eedfb8a983599fda4bb0838c6e3c958d8ec590532710c311");
});

test("multiline practical drafts and self assessment survive migration without keyword grading", () => {
  const question = byId.get(manifest.items.find((item) => item.kind === "코드").id);
  const value = "① $(CC)\n② gcc -c main.c\n코드와 설명을 함께 기록";
  const state = migrateStudyState({
    answers: { [question.id]: { questionId: question.id, questionVersion: 1, value, selfAssessment: "partial", answeredAt: "2026-11-03T00:00:00Z" } },
    activePractice: { examType: question.examType, questionIds: [question.id], currentIndex: 0, draftAnswer: value, submitted: false, startedAt: "2026-11-03T00:00:00Z", drafts: { [question.id]: value } },
  });
  assert.equal(state.answers[question.id].value, value);
  assert.equal(state.answers[question.id].selfAssessment, "partial");
  assert.equal(state.answers[question.id].isCorrect, undefined);
  assert.equal(state.activePractice.draftAnswer, value);
  assert.deepEqual(calculateCategoryScores([question], { [question.id]: question.requiredKeyPoints.join(" ") }), []);
  assert.equal(gradeTest(null, 60, [], null).reason, "ungraded");
});
