import assert from "node:assert/strict";
import test from "node:test";
import {
  createReviewSession,
  parseCsv,
  questionFingerprint,
  selectPageClusteredBatch,
  transitionStage,
  validateReviewQueue
} from "../scripts/lib/security-review-pipeline.mjs";

const baseRow = {
  exam_type: "필기",
  category: "정보보안기사",
  prompt: "테스트 문제",
  choice1: "보기 1",
  choice2: "보기 2",
  choice3: "보기 3",
  choice4: "보기 4",
  correct_answer: "1",
  source: ""
};

function candidate(id, page, reason = "numeric_code_or_special_visual_review") {
  return {
    source_key: `source-${id}`,
    content_hash: `hash-${id}`,
    source_page_pdf: page,
    question_number: id,
    review_required: true,
    review_reasons: [reason],
    answer_choice_number: 1,
    row: { ...baseRow, prompt: `정보보안 테스트 문제 ${id} 상세 본문` }
  };
}

test("CSV parser preserves commas, quotes, and newlines in quoted fields", () => {
  const parsed = parseCsv('prompt,choice1\r\n"문제, 하나","따옴표 ""보기"""\r\n"두 줄\n문제",보기\r\n');
  assert.deepEqual(parsed.headers, ["prompt", "choice1"]);
  assert.equal(parsed.rows[0].prompt, "문제, 하나");
  assert.equal(parsed.rows[0].choice1, '따옴표 "보기"');
  assert.equal(parsed.rows[1].prompt, "두 줄\n문제");
});

test("queue validation reconciles JSON, CSV, bank, and excluded duplicates", () => {
  const queue = [candidate(1, 10), candidate(2, 10), candidate(3, 11)];
  const headers = Object.keys(baseRow);
  const csv = { headers, rows: queue.map((item) => Object.fromEntries(headers.map((header) => [header, item.row[header] ?? ""]))) };
  const bankRows = [{ ...baseRow, prompt: "이미 등록된 문제" }];
  const result = validateReviewQueue({
    queue,
    csv,
    bankRows,
    registrationManifest: null,
    recoveryBatch: {
      source_candidate_count: 3,
      active_information_security_before: 1,
      manual_review_before: 3,
      already_registered_duplicate_count: 0
    }
  });
  assert.equal(result.ok, true);
  assert.equal(result.counts.queue_json, 3);
  assert.equal(result.reconciliation.difference, 0);
});

test("page-clustered selection keeps same-page questions together and skips bank duplicates", () => {
  const queue = [
    candidate(1, 10, "visual_or_table_review"),
    candidate(2, 10, "choice_count_3"),
    candidate(3, 20, "answer_key_not_recognized"),
    candidate(4, 20, "low_confidence_question_region"),
    candidate(5, 30, "past_exam_year_not_recognized")
  ];
  const bankRows = [{ ...queue[4].row }];
  const result = selectPageClusteredBatch(queue, 4, bankRows);
  assert.equal(result.selected.length, 4);
  assert.equal(result.source_page_count, 2);
  assert.equal(result.excluded_already_registered, 1);
  assert.equal(result.selected.some(({ item }) => questionFingerprint(item) === questionFingerprint(bankRows[0])), false);
});

test("manual stages can be timed without mutating queue data", () => {
  const session = createReviewSession("batch-test");
  transitionStage(session, "ai_review", "start", "visual inspection");
  assert.equal(session.stages.ai_review.status, "running");
  transitionStage(session, "ai_review", "finish", "visual inspection complete");
  assert.equal(session.stages.ai_review.status, "completed");
  assert.equal(session.stages.ai_review.runs.length, 1);
});
