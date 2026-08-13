import type { ExamType } from "./types";

export const certificateLabels: Record<string, string> = {
  "information-processing-engineer": "정보처리기사",
  "embedded-engineer": "임베디드기사",
  "computer-system-engineer": "컴퓨터시스템기사",
  "information-security-engineer": "정보보안기사",
  "ai-exam": "AI 시험"
};

export function examTypeLabel(certificateId: string, examType: ExamType) {
  if (certificateId === "ai-exam") return examType === "WRITTEN_CBT" ? "객관식" : "단답형";
  return examType === "WRITTEN_CBT" ? "필기 CBT" : "실기 필답형";
}
