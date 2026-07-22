import type { ExamType, Question } from "./types";

export interface QuestionMetadataFilters {
  examType: ExamType;
  category?: string;
  difficulty?: "all" | Question["difficulty"];
  sourceYear?: string;
  tag?: string;
}

export function matchesQuestionMetadata(question: Question, filters: QuestionMetadataFilters) {
  if (question.examType !== filters.examType) return false;
  if (filters.category && filters.category !== "all" && question.category !== filters.category) return false;
  if (filters.difficulty && filters.difficulty !== "all" && question.difficulty !== filters.difficulty) return false;
  if (filters.sourceYear && filters.sourceYear !== "all" && String(question.sourceYear ?? "") !== filters.sourceYear) return false;
  if (filters.tag && filters.tag !== "all" && !(question.tags ?? []).includes(filters.tag)) return false;
  return true;
}

export function questionFilterOptions(questions: Question[], examType: ExamType) {
  const matching = questions.filter((question) => question.examType === examType);
  return {
    categories: [...new Set(matching.map((question) => question.category))].sort((a, b) => a.localeCompare(b, "ko-KR")),
    sourceYears: [...new Set(matching.flatMap((question) => question.sourceYear ? [question.sourceYear] : []))].sort((a, b) => b - a),
    tags: [...new Set(matching.flatMap((question) => question.tags ?? []))].sort((a, b) => a.localeCompare(b, "ko-KR"))
  };
}
