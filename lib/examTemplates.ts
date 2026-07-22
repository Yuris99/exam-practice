import type { ExamTemplate } from "./types";

export const examTemplates: ExamTemplate[] = [
  {
    id: "information-processing-engineer-written-mock",
    title: "정보처리기사 필기 모의시험",
    certificateId: "information-processing-engineer",
    examType: "WRITTEN_CBT",
    questionCount: 100,
    durationSeconds: 150 * 60,
    passingScore: 60,
    description: "필기 문제은행에서 최대 100문제를 출제하고 150분 동안 응시합니다.",
    categoryStrategy: "balanced",
    shuffleQuestions: true,
    shuffleChoices: true
  },
  {
    id: "information-processing-engineer-practical-mock",
    title: "정보처리기사 실기 모의시험",
    certificateId: "information-processing-engineer",
    examType: "PRACTICAL_WRITTEN_RESPONSE",
    questionCount: 20,
    durationSeconds: 150 * 60,
    passingScore: 60,
    description: "실기 필답형 문제은행에서 최대 20문제를 출제하고 150분 동안 응시합니다.",
    categoryStrategy: "balanced",
    shuffleQuestions: true,
    shuffleChoices: false
  }
];
