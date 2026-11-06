export type SummarySubject = {
  label: string;
  title: string;
  description: string;
  concepts: Array<{ title: string; body: string; points: string[]; practiceQuestionIds?: string[] }>;
  frequent: Array<{ title: string; body: string; answer: string; codeSnippet?: string; codeLanguage?: string }>;
  comparisons: Array<{ left: string; right: string; point: string }>;
  questions: Array<{ question: string; keywords: string }>;
  finalPrep: Array<{ title: string; body: string; points: string[] }>;
  memorize: string[];
  sources?: Array<{ title: string; pages?: string; url?: string; note: string }>;
};

export type ExtraNote = { title: string; lead: string; bullets: string[] };
