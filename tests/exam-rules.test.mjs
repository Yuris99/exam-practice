import assert from "node:assert/strict";
import test from "node:test";
import { orderByExamStandard, selectMockExamByCategory } from "../lib/testSelection.ts";

function question(id, certificateId, category) {
  return { id, certificateId, category, examType: "WRITTEN_CBT", prompt: id, explanation: "", difficulty: "medium", version: 1, choices: ["A", "B"], correctChoiceIndex: 0 };
}

test("information processing subjects follow the published exam order", () => {
  const input = [
    question("db", "information-processing-engineer", "데이터베이스 구축"),
    question("manage", "information-processing-engineer", "정보시스템 구축 관리"),
    question("design", "information-processing-engineer", "소프트웨어 설계"),
    question("language", "information-processing-engineer", "프로그래밍 언어 활용"),
    question("develop", "information-processing-engineer", "소프트웨어 개발")
  ];
  assert.deepEqual(orderByExamStandard(input).map((item) => item.id), ["design", "develop", "db", "language", "manage"]);
});

test("embedded subjects put firmware before platform", () => {
  const input = [
    question("platform", "embedded-engineer", "임베디드 플랫폼"),
    question("software", "embedded-engineer", "임베디드 소프트웨어"),
    question("hardware", "embedded-engineer", "임베디드 하드웨어"),
    question("firmware", "embedded-engineer", "임베디드 펌웨어")
  ];
  assert.deepEqual(orderByExamStandard(input).map((item) => item.id), ["hardware", "firmware", "platform", "software"]);
});

test("formal mock exams exclude categories outside the certificate standard", () => {
  const input = [
    question("design", "information-processing-engineer", "소프트웨어 설계"),
    question("develop", "information-processing-engineer", "소프트웨어 개발"),
    question("unrelated", "information-processing-engineer", "1-1 AI·기계학습 기초")
  ];
  assert.deepEqual(selectMockExamByCategory(input, 3).map((item) => item.id).sort(), ["design", "develop"]);
});
