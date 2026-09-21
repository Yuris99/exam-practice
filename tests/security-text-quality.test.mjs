import assert from "node:assert/strict";
import test from "node:test";
import { inspectSecurityQuestionText, SECURITY_TEXT_QUALITY_CODES } from "../scripts/lib/security-text-quality.mjs";

test("spacing candidates are warnings rather than confirmed errors", () => {
  const result = inspectSecurityQuestionText({ prompt: "개인정보보호관리체계에 대한 설명" });
  assert.equal(result.status, "candidate_review");
  assert.equal(result.findings[0].code, SECURITY_TEXT_QUALITY_CODES.HANGUL_SPACING_CANDIDATE);
  assert.equal(result.findings[0].blocksRegistration, false);
});

test("known broken glyphs require source review and are never auto-corrected", () => {
  const result = inspectSecurityQuestionText({ prompt: "파일을 오픈(pen)할 때", explanation: "인적션 공격" });
  const finding = result.findings.find((item) => item.code === SECURITY_TEXT_QUALITY_CODES.BROKEN_GLYPH_CANDIDATE);
  assert.equal(result.status, "source_review_required");
  assert.deepEqual(finding.fields, ["prompt", "explanation"]);
  assert.equal(finding.blocksRegistration, true);
});

test("flattened explanation tables require the source image", () => {
  const result = inspectSecurityQuestionText({ explanation: "SSTF 가까운 요청 SCAN 왕복 C-SCAN 한 방향 FCFS 도착 순서" });
  assert.ok(result.findings.some((item) => item.code === SECURITY_TEXT_QUALITY_CODES.FLATTENED_TABLE_CANDIDATE));
});

test("code and paths are not treated as ordinary spacing errors", () => {
  const result = inspectSecurityQuestionText({ code_snippet: "apktool d sample.apk\n/etc/passwd\nCAP_SYS_MODULE" });
  assert.equal(result.findings.some((item) => item.code === SECURITY_TEXT_QUALITY_CODES.LINE_BREAK_SPLIT_CANDIDATE), false);
  assert.equal(result.findings.some((item) => item.code === SECURITY_TEXT_QUALITY_CODES.BROKEN_GLYPH_CANDIDATE), false);
});

test("common dependent-noun spacing does not become a split-word finding", () => {
  const result = inspectSecurityQuestionText({ prompt: "사용할 수 있는 것 중 하나이다." });
  assert.equal(result.findings.some((item) => item.code === SECURITY_TEXT_QUALITY_CODES.LINE_BREAK_SPLIT_CANDIDATE), false);
});
