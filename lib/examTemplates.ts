import type { ExamTemplate, ExamType } from "./types";

const certificateLabels: Record<string, string> = {
  "information-processing-engineer": "정보처리기사",
  "embedded-engineer": "임베디드기사",
  "computer-system-engineer": "컴퓨터시스템기사",
  "information-security-engineer": "정보보안기사",
  "ai-exam": "AI 시험"
};

export function createExamTemplates(certificateId: string): ExamTemplate[] {
  const certificateLabel = certificateLabels[certificateId] ?? certificateId;
  return [
    createTemplate(certificateId, certificateLabel, "WRITTEN_CBT", 100),
    createTemplate(certificateId, certificateLabel, "PRACTICAL_WRITTEN_RESPONSE", 20)
  ];
}

function createTemplate(certificateId: string, certificateLabel: string, examType: ExamType, questionCount: number): ExamTemplate {
  const isMultipleChoice = examType === "WRITTEN_CBT";
  const typeLabel = certificateId === "ai-exam" ? isMultipleChoice ? "객관식" : "단답형" : isMultipleChoice ? "필기" : "실기";
  return {
    id: `${certificateId}-${isMultipleChoice ? "written" : "practical"}-mock`,
    title: `${certificateLabel} ${typeLabel} 모의시험`,
    certificateId,
    examType,
    questionCount,
    durationSeconds: 150 * 60,
    passingScore: 60,
    categoryMinimumScore: isMultipleChoice ? 40 : null,
    description: `${typeLabel} 문제은행에서 최대 ${questionCount}문제를 출제하고 150분 동안 응시합니다.`,
    categoryStrategy: "balanced",
    shuffleQuestions: true,
    shuffleChoices: isMultipleChoice
  };
}
