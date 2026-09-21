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

test("all information security subjects map within their own theory subject", () => {
  const courses = [informationSecurityTheoryCourse];
  assert.equal(matchTheoryConcept(courses, question("커널 모드", { certificateId: "information-processing-engineer" })), undefined);
  assert.equal(matchTheoryConcept(courses, question("리눅스 커널 모듈을 올리거나 내리는 Capability는?"))?.concept.id, "unix-linux-access-control");
  assert.equal(matchTheoryConcept(courses, question("IPv6 주소의 길이는?", { category: "네트워크 보안" }))?.concept.id, "ipv6-transition");
  assert.equal(matchTheoryConcept(courses, question("SQL Injection 공격의 특징은?", { category: "어플리케이션 보안" }))?.concept.id, "sql-injection-types");
  assert.equal(matchTheoryConcept(courses, question("AES의 라운드 변환인 SubBytes의 특징은?", { category: "정보보안 일반" }))?.concept.id, "aes-round-structure");
  assert.equal(matchTheoryConcept(courses, question("개인정보 유출 신고 72시간 기준은?", { category: "정보보안 관리 및 법규" }))?.concept.id, "personal-information-breach-notice-and-reporting");
});

test("ambiguous or unsupported questions are not forced into a concept", () => {
  const courses = [informationSecurityTheoryCourse];
  assert.equal(matchTheoryConcept(courses, question("다음 중 옳은 것은?", { category: "네트워크 보안" })), undefined);
  assert.equal(matchTheoryConcept(courses, question("IPv6의 특징은?", { category: "데이터베이스" })), undefined);
});

test("answer content supports matching without letting distractors dominate", () => {
  const courses = [informationSecurityTheoryCourse];
  const match = matchTheoryConcept(courses, question("다음 설명에 해당하는 것은?", {
    category: "네트워크 보안",
    choices: ["SSH", "IPv6", "FTP", "AES"],
    correctChoiceIndex: 1,
    explanation: "128비트 주소 공간을 사용하는 인터넷 프로토콜이다."
  }));
  assert.equal(match?.concept.id, "ipv6-transition");
});

test("OCR spacing loss still matches specific system tools", () => {
  const courses = [informationSecurityTheoryCourse];
  assert.equal(matchTheoryConcept(courses, question("Syslog와 같은 시스템로그를 주기적으로 스캔하는 시스템로깅 도구는?", {
    choices: ["Nikto", "X-Scan", "N-Stealth", "SWATCH(Simple WATCHer)"],
    correctChoiceIndex: 2,
    explanation: "SWATCH는 시스템로그를 주기적으로 스캔해 행위를 분석하는 로그감시 도구이다."
  }))?.concept.id, "system-integrity-monitoring");
  assert.equal(matchTheoryConcept(courses, question("EDR의 보안사고탐지·보안사고통제·보안사고분석·보안사고치료 기능은?"))?.concept.id, "endpoint-security-solutions");
});
