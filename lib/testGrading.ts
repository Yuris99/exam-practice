import type { AnswerValue, Question } from "./types";

export interface CategoryScore {
  category: string;
  correct: number;
  total: number;
  accuracy: number;
}

export function calculateCategoryScores(questions: Question[], answers: Record<string, AnswerValue>): CategoryScore[] {
  const scores = new Map<string, { correct: number; total: number }>();
  questions.forEach((question) => {
    if (question.examType !== "WRITTEN_CBT") return;
    const current = scores.get(question.category) ?? { correct: 0, total: 0 };
    current.total += 1;
    if (answers[question.id] === question.correctChoiceIndex) current.correct += 1;
    scores.set(question.category, current);
  });
  return [...scores.entries()].map(([category, value]) => ({
    category,
    ...value,
    accuracy: Math.round(value.correct / value.total * 100)
  }));
}

export function gradeTest(score: number | null, passingScore: number | null | undefined, categoryScores: CategoryScore[], categoryMinimumScore: number | null | undefined) {
  if (score === null || passingScore === null || passingScore === undefined) return { passed: null, failedCategories: [] as CategoryScore[], reason: "ungraded" as const };
  const failedCategories = categoryMinimumScore == null ? [] : categoryScores.filter((item) => item.accuracy < categoryMinimumScore);
  if (failedCategories.length) return { passed: false, failedCategories, reason: "category" as const };
  if (score < passingScore) return { passed: false, failedCategories, reason: "total" as const };
  return { passed: true, failedCategories, reason: "passed" as const };
}
