import test from "node:test";
import assert from "node:assert/strict";
import { createExamTemplates } from "../lib/examTemplates.ts";
import { examTypeLabel } from "../lib/certificates.ts";

test("mock exam templates follow the selected certificate", () => {
  const templates = createExamTemplates("ai-exam");
  assert.equal(templates[0].title, "AI 시험 객관식 모의시험");
  assert.equal(templates[1].title, "AI 시험 단답형 모의시험");
  assert.ok(templates.every((template) => template.certificateId === "ai-exam"));
});

test("certificate exam templates retain written and practical labels", () => {
  const templates = createExamTemplates("embedded-engineer");
  assert.equal(templates[0].title, "임베디드기사 필기 모의시험");
  assert.equal(templates[1].title, "임베디드기사 실기 모의시험");
});

test("AI exam type labels use question formats instead of certificate terminology", () => {
  assert.equal(examTypeLabel("ai-exam", "WRITTEN_CBT"), "객관식");
  assert.equal(examTypeLabel("ai-exam", "PRACTICAL_WRITTEN_RESPONSE"), "단답형");
  assert.equal(examTypeLabel("embedded-engineer", "WRITTEN_CBT"), "필기 CBT");
});
