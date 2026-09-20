import assert from "node:assert/strict";
import test from "node:test";
import { informationSecurityTheoryCourse } from "../content/theory/information-security-engineer.ts";
import { matchTheoryConcept } from "../lib/theoryMatching.ts";

function question(prompt, overrides = {}) {
  return {
    id: "q",
    certificateId: "information-security-engineer",
    category: "시스템 보안",
    examType: "WRITTEN_CBT",
    prompt,
    explanation: "",
    difficulty: "medium",
    version: 1,
    choices: ["1", "2", "3", "4"],
    correctChoiceIndex: 0,
    tags: ["기출"],
    ...overrides
  };
}

test("theory course follows subject, unit and concept hierarchy", () => {
  const subject = informationSecurityTheoryCourse.subjects[0];
  const unit = subject.units.find((item) => item.id === "operating-system-intro");
  assert.equal(subject.title, "시스템 보안");
  assert.equal(unit?.status, "published");
  assert.equal(unit?.concepts.length, 6);
  assert.deepEqual(unit?.sourcePdfPages, Array.from({ length: 15 }, (_, index) => index + 21));
});

test("questions map to the correct theory concept", () => {
  const courses = [informationSecurityTheoryCourse];
  assert.equal(matchTheoryConcept(courses, question("SJF와 SRT 스케줄링 기법의 차이는?"))?.concept.id, "process-lifecycle-scheduling");
  assert.equal(matchTheoryConcept(courses, question("교착상태 발생 조건으로 옳은 것은?"))?.concept.id, "concurrency-deadlock");
  assert.equal(matchTheoryConcept(courses, question("최악 적합 기억장치 배치 기법은?"))?.concept.id, "memory-management");
  assert.equal(matchTheoryConcept(courses, question("참조 모니터의 역할은?"))?.concept.id, "access-control-secure-os");
});

test("other certificates and subjects are not linked", () => {
  const courses = [informationSecurityTheoryCourse];
  assert.equal(matchTheoryConcept(courses, question("커널 모드", { certificateId: "information-processing-engineer" })), undefined);
  assert.equal(matchTheoryConcept(courses, question("SSH", { category: "네트워크 보안" })), undefined);
  assert.equal(matchTheoryConcept(courses, question("리눅스 커널 모듈을 올리거나 내리는 Capability는?")), undefined);
});
