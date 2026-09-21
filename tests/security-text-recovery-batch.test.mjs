import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (relative) => JSON.parse(await readFile(path.join(root, relative), "utf8"));
const planPath = "data/information-security-quality/text-recovery-batch-002-plan.json";
const decisionsPath = "data/information-security-quality/text-recovery-batch-002-decisions.json";

test("batch 2 reviews exactly 50 unique, source-traceable questions", async () => {
  const [plan, decisions] = await Promise.all([readJson(planPath), readJson(decisionsPath)]);
  assert.equal(plan.selectionLimit, 50);
  assert.equal(plan.selected.length, 50);
  assert.equal(decisions.selectionCount, 50);
  assert.equal(decisions.items.length, 50);
  assert.equal(new Set(plan.selected.map((item) => item.source)).size, 50);
  assert.equal(new Set(decisions.items.map((item) => item.pdfPage + ":" + item.questionNumber)).size, 50);
  assert.deepEqual(
    new Set(decisions.items.map((item) => item.pdfPage + ":" + item.questionNumber)),
    new Set(plan.selected.map((item) => item.pdfPage + ":" + item.questionNumber))
  );
});

test("batch 2 holds all source-answer conflicts and excludes prior pilot/conflict rows", async () => {
  const [plan, decisions, pilot] = await Promise.all([
    readJson(planPath),
    readJson(decisionsPath),
    readJson("data/information-security-quality/text-recovery-pilot-001-result.json")
  ]);
  const prior = new Set(pilot.items.map((item) => item.pdfPage + ":" + item.questionNumber));
  const held = decisions.items.filter((item) => item.status === "held");
  assert.equal(held.length, 6);
  assert.ok(held.every((item) => item.errorTypes.includes("answer_conflict") && item.holdReason && !item.after));
  assert.ok(plan.selected.every((item) => !prior.has(item.pdfPage + ":" + item.questionNumber)));
  assert.ok(plan.selected.every((item) => !(item.pdfPage === 39 && item.questionNumber === 10)));
});

test("decision patches only text; IDs, answers, sources, and choice positions are immutable", async () => {
  const [plan, decisions] = await Promise.all([readJson(planPath), readJson(decisionsPath)]);
  const planByKey = new Map(plan.selected.map((item) => [item.pdfPage + ":" + item.questionNumber, item]));
  const textFields = new Set(["prompt", "choice1", "choice2", "choice3", "choice4", "explanation", "reference_text", "code_snippet"]);
  for (const item of decisions.items) {
    const before = planByKey.get(item.pdfPage + ":" + item.questionNumber)?.before;
    assert.ok(before, "selected baseline exists");
    assert.ok(before.correct_answer);
    assert.ok(before.source.includes("PDF " + item.pdfPage + "쪽"));
    assert.ok(before.source.endsWith("· " + item.questionNumber + "번"));
    assert.ok(item.status === "verified_corrected" || item.status === "held" || item.status === "verified_no_change");
    if (item.status === "held") continue;
    assert.ok(item.after && Object.keys(item.after).length > 0);
    for (const field of Object.keys(item.after)) assert.ok(textFields.has(field), "only text fields can be changed");
    for (const field of ["certificate_id", "category", "exam_type", "source", "source_year", "correct_answer", "image_url", "image_urls"]) {
      assert.ok(!Object.hasOwn(item.after, field), "protected field absent from patch");
    }
  }
});
