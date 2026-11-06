import assert from "node:assert/strict";
import test from "node:test";
import { embeddedPracticalSummary as summary, embeddedPracticalNotes as notes } from "../content/summaries/embedded-practical.ts";
import { generatedQuestions } from "../lib/generatedQuestions.ts";

test("practical summary links resolve to published embedded practical questions", () => {
  const byId = new Map(generatedQuestions.map((question) => [question.id, question]));
  const linked = summary.concepts.flatMap((concept) => concept.practiceQuestionIds ?? []);
  assert.ok(linked.length > 20);
  for (const id of linked) {
    const question = byId.get(id);
    assert.ok(question, id);
    assert.equal(question.certificateId, "embedded-engineer", id);
    assert.equal(question.examType, "PRACTICAL_WRITTEN_RESPONSE", id);
    assert.equal(question.publicationStatus, "published", id);
  }
});

test("summary has complete study material and traceable user references", () => {
  for (const collection of [summary.concepts, summary.frequent, summary.comparisons, summary.questions, summary.finalPrep, summary.memorize, notes]) {
    assert.ok(collection.length > 0);
  }
  assert.equal(new Set(summary.concepts.map((concept) => concept.title)).size, summary.concepts.length);
  assert.equal(new Set(summary.memorize).size, summary.memorize.length);
  for (const example of summary.frequent) {
    assert.ok(example.body && example.answer);
    if (example.codeSnippet) {
      assert.ok(example.codeLanguage);
      assert.doesNotMatch(example.codeSnippet, /[\u0000\uFFFD]/u);
    }
  }
  assert.ok(summary.sources.some((source) => source.title === "임베디드기사_ARM어셈블리_정리.pdf" && source.pages.includes("1~9")));
  assert.ok(summary.sources.some((source) => source.title === "임베디드기사_실기_완성교재.pdf" && source.pages.includes("1~36")));
  assert.ok(summary.description.includes("공식 기출·공식 정답집은 아닙니다"));
  for (const source of summary.sources) {
    assert.ok(source.note);
    if (source.url) assert.equal(new URL(source.url).protocol, "https:");
  }
});
