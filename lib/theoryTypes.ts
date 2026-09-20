export type TheoryBlock =
  | { type: "text"; title: string; paragraphs: string[] }
  | { type: "bullets"; title: string; items: string[] }
  | { type: "table"; title: string; columns: string[]; rows: string[][] }
  | { type: "code"; title: string; language: string; code: string; caption?: string }
  | { type: "diagram"; title: string; nodes: Array<{ label: string; detail?: string }>; caption?: string };

export interface TheoryConcept {
  id: string;
  title: string;
  summary: string;
  sourcePdfPages: number[];
  keywords: string[];
  questionKeywords: string[];
  blocks: TheoryBlock[];
  memoryPoints: string[];
}

export interface TheoryUnit {
  id: string;
  title: string;
  chapter: string;
  summary: string;
  status: "published" | "planned";
  sourcePdfPages?: number[];
  concepts: TheoryConcept[];
}

export interface TheorySubject {
  id: string;
  title: string;
  description: string;
  units: TheoryUnit[];
}

export interface TheoryCourse {
  certificateId: string;
  title: string;
  sourceTitle: string;
  subjects: TheorySubject[];
}

export interface TheoryConceptMatch {
  course: TheoryCourse;
  subject: TheorySubject;
  unit: TheoryUnit;
  concept: TheoryConcept;
}
