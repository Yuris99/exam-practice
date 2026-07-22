import assert from "node:assert/strict";
import test from "node:test";
import { createTestSnapshot, selectBalancedByCategory } from "../lib/testSelection.ts";

function cbt(id, category, correctChoiceIndex = 1) {
  return {
    id,
    certificateId: "test",
    category,
    examType: "WRITTEN_CBT",
    prompt: `question ${id}`,
    explanation: "explanation",
    difficulty: "medium",
    version: 1,
    choices: ["A", "B", "C", "D"],
    correctChoiceIndex
  };
}

test("balanced selection spreads questions across available categories", () => {
  const candidates = [
    ...Array.from({ length: 5 }, (_, index) => cbt(`a${index}`, "A")),
    ...Array.from({ length: 5 }, (_, index) => cbt(`b${index}`, "B")),
    ...Array.from({ length: 5 }, (_, index) => cbt(`c${index}`, "C"))
  ];
  const selected = selectBalancedByCategory(candidates, 8);
  const counts = ["A", "B", "C"].map((category) => selected.filter((question) => question.category === category).length);
  assert.equal(selected.length, 8);
  assert.equal(new Set(selected.map((question) => question.id)).size, 8);
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1);
});

test("balanced selection fills from remaining categories when one category is short", () => {
  const candidates = [cbt("a0", "A"), ...Array.from({ length: 5 }, (_, index) => cbt(`b${index}`, "B"))];
  const selected = selectBalancedByCategory(candidates, 5);
  assert.equal(selected.length, 5);
  assert.equal(selected.filter((question) => question.category === "A").length, 1);
  assert.equal(selected.filter((question) => question.category === "B").length, 4);
});

test("choice shuffling keeps the correct answer, rich content, and source immutability", () => {
  const source = { ...cbt("q1", "A", 2), referenceText: "보기 자료", codeSnippet: "SELECT *\nFROM sample;", codeLanguage: "SQL", imageUrl: "https://example.com/one.png", imageUrls: ["https://example.com/two.png"] };
  const original = structuredClone(source);
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const snapshot = createTestSnapshot(source, true);
    assert.equal(snapshot.choices[snapshot.correctChoiceIndex], "C");
    assert.deepEqual([...snapshot.choices].sort(), ["A", "B", "C", "D"]);
    assert.equal(snapshot.referenceText, source.referenceText);
    assert.equal(snapshot.codeSnippet, source.codeSnippet);
    assert.deepEqual(snapshot.imageUrls, source.imageUrls);
  }
  assert.deepEqual(source, original);
});

test("practical snapshots remain structurally unchanged", () => {
  const source = {
    id: "p1",
    certificateId: "test",
    category: "P",
    examType: "PRACTICAL_WRITTEN_RESPONSE",
    prompt: "practical",
    explanation: "explanation",
    difficulty: "hard",
    version: 1,
    modelAnswer: "answer",
    requiredKeyPoints: ["answer"]
  };
  assert.deepEqual(createTestSnapshot(source, true), source);
});
