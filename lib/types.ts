export type ExamType = "WRITTEN_CBT" | "PRACTICAL_WRITTEN_RESPONSE";

export interface BaseQuestion {
  id: string;
  certificateId: string;
  category: string;
  examType: ExamType;
  prompt: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  version: number;
  publicationStatus?: "draft" | "published" | "archived";
  imageUrl?: string;
  imageUrls?: string[];
  referenceText?: string;
  codeSnippet?: string;
  codeLanguage?: string;
  tags?: string[];
  source?: string;
  sourceYear?: number;
}

export interface WrittenCbtQuestion extends BaseQuestion {
  examType: "WRITTEN_CBT";
  choices: string[];
  correctChoiceIndex: number;
}

export interface PracticalQuestion extends BaseQuestion {
  examType: "PRACTICAL_WRITTEN_RESPONSE";
  modelAnswer: string;
  requiredKeyPoints: string[];
}

export type Question = WrittenCbtQuestion | PracticalQuestion;

export type AnswerValue = number | string;

export interface SavedAnswer {
  questionId: string;
  questionVersion: number;
  value: AnswerValue;
  isCorrect?: boolean;
  knowledgeStatus?: "known" | "unknown";
  selfAssessment?: "correct" | "partial" | "incorrect";
  answeredAt: string;
}

export interface TestSession {
  id: string;
  certificateId?: string;
  examType: ExamType;
  questionIds: string[];
  currentIndex: number;
  answers: Record<string, AnswerValue>;
  flaggedQuestionIds: string[];
  startedAt: string;
  durationSeconds: number | null;
  questionSnapshots?: Question[];
  mode?: "mock" | "random";
  title?: string;
  passingScore?: number | null;
  categoryMinimumScore?: number | null;
}

export interface PracticeSession {
  examType: ExamType;
  questionIds: string[];
  currentIndex: number;
  draftAnswer: AnswerValue | null;
  submitted: boolean;
  startedAt: string;
  drafts?: Record<string, AnswerValue>;
  submittedQuestionIds?: string[];
}

export interface ActivityRecord {
  id: string;
  source: "practice" | "test";
  examType: ExamType;
  questionId: string;
  category: string;
  isCorrect?: boolean;
  knowledgeStatus?: "known" | "unknown";
  selfAssessment?: "correct" | "partial" | "incorrect";
  occurredAt: string;
}

export interface QuestionReport {
  id: string;
  questionId: string;
  questionVersion: number;
  reason: "incorrect_answer" | "question_error" | "insufficient_explanation" | "other";
  details: string;
  createdAt: string;
  status: "open" | "resolved";
}

export interface AiExplanationReport {
  id: string;
  cacheKey: string;
  questionId: string;
  questionVersion: number;
  explanationSnapshot: string;
  reason: "inaccurate" | "unclear" | "too_long" | "other";
  details: string;
  createdAt: string;
  status: "open" | "resolved" | "hidden";
}

export interface TestResult {
  id: string;
  certificateId?: string;
  examType: ExamType;
  questionIds: string[];
  answers: Record<string, AnswerValue>;
  startedAt: string;
  completedAt: string;
  correctCount: number;
  scoredQuestionCount: number;
  selfAssessments: Record<string, "correct" | "partial" | "incorrect">;
  questionSnapshots?: Question[];
  mode?: "mock" | "random";
  title?: string;
  passingScore?: number | null;
  categoryMinimumScore?: number | null;
  flaggedQuestionIds?: string[];
}

export interface ExamTemplate {
  id: string;
  title: string;
  certificateId: string;
  examType: ExamType;
  questionCount: number;
  durationSeconds: number;
  passingScore: number;
  categoryMinimumScore: number | null;
  description: string;
  categoryStrategy: "balanced" | "random";
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
}

export interface StudyState {
  answers: Record<string, SavedAnswer>;
  bookmarks: string[];
  aiExplanations: Record<string, string>;
  activeTest: TestSession | null;
  testResults: TestResult[];
  customQuestions: Question[];
  activePractice: PracticeSession | null;
  activities: ActivityRecord[];
  notes: Record<string, string>;
  noteUpdatedAt: Record<string, string>;
  questionReports: QuestionReport[];
  aiExplanationReports: AiExplanationReport[];
}
