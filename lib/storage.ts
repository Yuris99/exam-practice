import type { ActivityRecord, AiExplanationReport, Question, QuestionReport, SavedAnswer, StudyState, TestResult } from "./types";

const STORAGE_KEY = "certificate-practice:v1";
export const STUDY_DATA_FORMAT = "certificate-practice-data";
export const STUDY_DATA_VERSION = 2;
export const BACKUP_FORMAT = "certificate-practice-backup";
export const BACKUP_VERSION = 2;

export const emptyStudyState: StudyState = {
  answers: {},
  bookmarks: [],
  aiExplanations: {},
  activeTest: null,
  testResults: [],
  customQuestions: [],
  activePractice: null,
  activities: [],
  notes: {},
  questionReports: [],
  aiExplanationReports: []
};

export function loadStudyState(): StudyState {
  if (typeof window === "undefined") return emptyStudyState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStudyState;
    return migrateStudyState(JSON.parse(raw));
  } catch {
    return emptyStudyState;
  }
}

export interface StorageSaveResult {
  ok: boolean;
  error?: string;
}

export function saveStudyState(state: StudyState): StorageSaveResult {
  if (typeof window === "undefined") return { ok: false, error: "브라우저에서만 저장할 수 있습니다." };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ format: STUDY_DATA_FORMAT, version: STUDY_DATA_VERSION, data: state }));
    return { ok: true };
  } catch (error) {
    const quotaExceeded = error instanceof DOMException && (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED");
    return { ok: false, error: quotaExceeded ? "저장 공간이 부족합니다. 학습 데이터를 내보낸 뒤 오래된 기록을 정리해 주세요." : "브라우저가 로컬 저장을 허용하지 않습니다." };
  }
}

export function mergeStudyStates(local: StudyState, cloud: StudyState): StudyState {
  const byId = <T extends { id: string }>(older: T[], newer: T[]) => {
    const merged = new Map(older.map((item) => [item.id, item]));
    newer.forEach((item) => merged.set(item.id, item));
    return [...merged.values()];
  };
  const answers = { ...cloud.answers };
  Object.entries(local.answers).forEach(([id, answer]) => {
    const cloudAnswer = answers[id];
    if (!cloudAnswer || new Date(answer.answeredAt).getTime() >= new Date(cloudAnswer.answeredAt).getTime()) answers[id] = answer;
  });
  return {
    answers,
    bookmarks: [...new Set([...cloud.bookmarks, ...local.bookmarks])],
    aiExplanations: { ...cloud.aiExplanations, ...local.aiExplanations },
    activeTest: local.activeTest ?? cloud.activeTest,
    testResults: byId(cloud.testResults, local.testResults),
    customQuestions: byId(cloud.customQuestions, local.customQuestions),
    activePractice: local.activePractice ?? cloud.activePractice,
    activities: byId(cloud.activities, local.activities),
    notes: { ...cloud.notes, ...local.notes },
    questionReports: byId(cloud.questionReports, local.questionReports),
    aiExplanationReports: byId(cloud.aiExplanationReports, local.aiExplanationReports)
  };
}

export function migrateStudyState(value: unknown): StudyState {
  const root = isRecord(value) && value.format === STUDY_DATA_FORMAT && isRecord(value.data) ? value.data : value;
  if (!isRecord(root)) return structuredClone(emptyStudyState);

  const answers = recordEntries(root.answers, isSavedAnswer);
  const aiExplanations = stringRecord(root.aiExplanations);
  const notes = stringRecord(root.notes);
  const testResults = arrayOf(root.testResults, isTestResult).map((result) => ({ ...result, selfAssessments: isRecord(result.selfAssessments) ? result.selfAssessments : {} })) as TestResult[];

  return {
    answers: answers as Record<string, SavedAnswer>,
    bookmarks: arrayOf(root.bookmarks, (item): item is string => typeof item === "string"),
    aiExplanations,
    activeTest: isTestSession(root.activeTest) ? root.activeTest : null,
    testResults,
    customQuestions: arrayOf(root.customQuestions, isQuestion),
    activePractice: isPracticeSession(root.activePractice) ? root.activePractice : null,
    activities: arrayOf(root.activities, isActivityRecord),
    notes,
    questionReports: arrayOf(root.questionReports, isQuestionReport),
    aiExplanationReports: arrayOf(root.aiExplanationReports, isAiExplanationReport)
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function arrayOf<T>(value: unknown, predicate: (item: unknown) => item is T): T[] {
  return Array.isArray(value) ? value.filter(predicate) : [];
}

function recordEntries<T>(value: unknown, predicate: (item: unknown) => item is T): Record<string, T> {
  if (!isRecord(value)) return {};
  const result: Record<string, T> = {};
  Object.entries(value).forEach(([key, item]) => {
    if (predicate(item)) result[key] = item;
  });
  return result;
}

function stringRecord(value: unknown): Record<string, string> {
  return recordEntries(value, (item): item is string => typeof item === "string");
}

function isExamType(value: unknown) {
  return value === "WRITTEN_CBT" || value === "PRACTICAL_WRITTEN_RESPONSE";
}

function hasString(value: Record<string, unknown>, key: string) {
  return typeof value[key] === "string";
}

function isQuestion(value: unknown): value is Question {
  if (!isRecord(value) || !hasString(value, "id") || !hasString(value, "certificateId") || !hasString(value, "category") || !hasString(value, "prompt") || !hasString(value, "explanation") || !isExamType(value.examType) || (value.difficulty !== "easy" && value.difficulty !== "medium" && value.difficulty !== "hard") || typeof value.version !== "number") return false;
  if (value.imageUrl !== undefined && typeof value.imageUrl !== "string") return false;
  if (value.imageUrls !== undefined && (!Array.isArray(value.imageUrls) || !value.imageUrls.every((url) => typeof url === "string"))) return false;
  if (value.referenceText !== undefined && typeof value.referenceText !== "string") return false;
  if (value.codeSnippet !== undefined && typeof value.codeSnippet !== "string") return false;
  if (value.codeLanguage !== undefined && typeof value.codeLanguage !== "string") return false;
  if (value.examType === "WRITTEN_CBT") return Array.isArray(value.choices) && value.choices.every((choice) => typeof choice === "string") && Number.isInteger(value.correctChoiceIndex);
  return typeof value.modelAnswer === "string" && Array.isArray(value.requiredKeyPoints) && value.requiredKeyPoints.every((point) => typeof point === "string");
}

function isSavedAnswer(value: unknown): value is SavedAnswer {
  return isRecord(value) && hasString(value, "questionId") && typeof value.questionVersion === "number" && (typeof value.value === "string" || typeof value.value === "number") && hasString(value, "answeredAt");
}

function isTestResult(value: unknown): value is TestResult {
  return isRecord(value) && hasString(value, "id") && isExamType(value.examType) && Array.isArray(value.questionIds) && isRecord(value.answers) && hasString(value, "startedAt") && hasString(value, "completedAt") && typeof value.correctCount === "number" && typeof value.scoredQuestionCount === "number";
}

function isTestSession(value: unknown): value is StudyState["activeTest"] & Record<string, unknown> {
  return isRecord(value) && hasString(value, "id") && isExamType(value.examType) && Array.isArray(value.questionIds) && value.questionIds.every((id) => typeof id === "string") && isRecord(value.answers) && Array.isArray(value.flaggedQuestionIds) && typeof value.currentIndex === "number" && (value.durationSeconds === null || typeof value.durationSeconds === "number") && hasString(value, "startedAt");
}

function isPracticeSession(value: unknown): value is StudyState["activePractice"] & Record<string, unknown> {
  return isRecord(value) && isExamType(value.examType) && Array.isArray(value.questionIds) && value.questionIds.every((id) => typeof id === "string") && typeof value.currentIndex === "number" && typeof value.submitted === "boolean" && hasString(value, "startedAt");
}

function isActivityRecord(value: unknown): value is ActivityRecord {
  return isRecord(value) && hasString(value, "id") && (value.source === "practice" || value.source === "test") && isExamType(value.examType) && hasString(value, "questionId") && hasString(value, "category") && hasString(value, "occurredAt");
}

function isQuestionReport(value: unknown): value is QuestionReport {
  return isRecord(value) && hasString(value, "id") && hasString(value, "questionId") && hasString(value, "createdAt") && (value.status === "open" || value.status === "resolved");
}

function isAiExplanationReport(value: unknown): value is AiExplanationReport {
  return isRecord(value) && hasString(value, "id") && hasString(value, "cacheKey") && hasString(value, "questionId") && hasString(value, "explanationSnapshot") && hasString(value, "createdAt") && (value.status === "open" || value.status === "resolved" || value.status === "hidden");
}
