import type { Question } from "./types";
import type { TheoryConceptMatch, TheoryCourse, TheorySubject } from "./theoryTypes";

const MINIMUM_MATCH_SCORE = 6;
const AMBIGUOUS_SCORE_RATIO = 0.9;
const AMBIGUOUS_SCORE_MARGIN = 4;

const CATEGORY_ALIASES: Record<string, string> = {
  "시스템 보안": "시스템 보안",
  "네트워크 보안": "네트워크 보안",
  "애플리케이션 보안": "애플리케이션 보안",
  "어플리케이션 보안": "애플리케이션 보안",
  "정보보안 일반": "정보보안 일반",
  "정보보안 관리 및 법규": "정보보안 관리 및 법규"
};

interface WeightedQuestionText {
  text: string;
  compactText: string;
  weight: number;
}

interface ScoredConcept {
  match: TheoryConceptMatch;
  score: number;
}

const subjectKeywordFrequencyCache = new WeakMap<TheorySubject, Map<string, number>>();
const questionMatchCache = new WeakMap<Question, WeakMap<TheoryCourse, TheoryMatchDiagnostics>>();

export interface TheoryMatchDiagnostics {
  match?: TheoryConceptMatch;
  score: number;
  runnerUpScore: number;
  ambiguous: boolean;
}

export function matchTheoryConcept(courses: TheoryCourse[], question: Question): TheoryConceptMatch | undefined {
  return diagnoseTheoryConceptMatch(courses, question).match;
}

export function diagnoseTheoryConceptMatch(courses: TheoryCourse[], question: Question): TheoryMatchDiagnostics {
  const course = courses.find((item) => item.certificateId === question.certificateId);
  const cached = course ? questionMatchCache.get(question)?.get(course) : undefined;
  if (cached) return cached;
  const subject = course ? findQuestionSubject(course.subjects, question.category) : undefined;
  if (!course || !subject) return { score: 0, runnerUpScore: 0, ambiguous: false };

  const fields = questionSearchFields(question);
  const keywordFrequencies = subjectKeywordFrequencies(subject);
  const ranked: ScoredConcept[] = [];
  for (const unit of subject.units.filter((item) => item.status === "published")) {
    for (const concept of unit.concepts) {
      const questionKeywords = new Set(concept.questionKeywords.map(normalize));
      const keywordWeights = new Map<string, number>();
      for (const keyword of concept.questionKeywords) keywordWeights.set(normalize(keyword), 1);
      for (const keyword of concept.keywords
        .filter((keyword) => !questionKeywords.has(normalize(keyword)) && keywordFrequencies.get(normalize(keyword)) === 1)) {
        keywordWeights.set(normalize(keyword), 0.75);
      }
      const keywords = [
        ...keywordWeights.entries().map(([keyword, weight]) => ({ keyword, weight }))
      ];
      const score = fields.reduce((sum, field) => {
        const evidence = keywords
          .filter((item) => item.keyword && containsKeyword(field.text, field.compactText, item.keyword))
          .map((item) => keywordSpecificity(item.keyword) * item.weight)
          .sort((left, right) => right - left);
        const fieldEvidence = (evidence[0] ?? 0) + evidence.slice(1).reduce((extra, value) => extra + value * 0.25, 0);
        return sum + fieldEvidence * field.weight;
      }, 0);
      if (score > 0) ranked.push({ match: { course, subject, unit, concept }, score });
    }
  }
  ranked.sort((left, right) => right.score - left.score || left.match.concept.id.localeCompare(right.match.concept.id));

  const best = ranked[0];
  const runnerUpScore = ranked[1]?.score ?? 0;
  if (!best || best.score < MINIMUM_MATCH_SCORE) return cacheDiagnostics(question, course, { score: best?.score ?? 0, runnerUpScore, ambiguous: false });

  const ambiguous = runnerUpScore >= best.score * AMBIGUOUS_SCORE_RATIO && best.score - runnerUpScore < AMBIGUOUS_SCORE_MARGIN;
  return cacheDiagnostics(question, course, { match: ambiguous ? undefined : best.match, score: best.score, runnerUpScore, ambiguous });
}

function cacheDiagnostics(question: Question, course: TheoryCourse, diagnostics: TheoryMatchDiagnostics) {
  const courseCache = questionMatchCache.get(question) ?? new WeakMap<TheoryCourse, TheoryMatchDiagnostics>();
  courseCache.set(course, diagnostics);
  questionMatchCache.set(question, courseCache);
  return diagnostics;
}

function subjectKeywordFrequencies(subject: TheorySubject) {
  const cached = subjectKeywordFrequencyCache.get(subject);
  if (cached) return cached;
  const frequencies = new Map<string, number>();
  for (const unit of subject.units.filter((item) => item.status === "published")) {
    for (const concept of unit.concepts) {
      const keywords = new Set([...concept.questionKeywords, ...concept.keywords].map(normalize));
      for (const keyword of keywords) frequencies.set(keyword, (frequencies.get(keyword) ?? 0) + 1);
    }
  }
  subjectKeywordFrequencyCache.set(subject, frequencies);
  return frequencies;
}

function findQuestionSubject(subjects: TheorySubject[], category: string) {
  const canonicalCategory = CATEGORY_ALIASES[normalize(category)];
  return canonicalCategory ? subjects.find((subject) => normalize(subject.title) === normalize(canonicalCategory)) : undefined;
}

function questionSearchFields(question: Question): WeightedQuestionText[] {
  const fields: Array<Omit<WeightedQuestionText, "compactText">> = [
    { text: question.prompt, weight: 4 },
    { text: question.referenceText ?? "", weight: 4 },
    { text: question.codeSnippet ?? "", weight: 5 },
    { text: question.explanation, weight: 2 }
  ];

  if (question.examType === "WRITTEN_CBT") {
    question.choices.forEach((choice, index) => fields.push({ text: choice, weight: index === question.correctChoiceIndex ? 1 : 0.25 }));
  } else {
    fields.push({ text: question.modelAnswer, weight: 3 });
    question.requiredKeyPoints.forEach((point) => fields.push({ text: point, weight: 2 }));
  }
  return fields.filter((field) => field.text.trim().length > 0).map((field) => {
    const text = normalize(field.text);
    return { ...field, text, compactText: compact(text) };
  });
}

function keywordSpecificity(keyword: string) {
  const length = keyword.replace(/\s+/g, "").length;
  if (length <= 2) return 1;
  if (length <= 4) return 2;
  if (length <= 8) return 3;
  if (length <= 16) return 4;
  return 5;
}

function containsKeyword(text: string, compactText: string, keyword: string) {
  let index = text.indexOf(keyword);
  if (!/^[a-z0-9]+$/i.test(keyword)) {
    if (index >= 0) return true;
    const compactKeyword = compact(keyword);
    return keyword.includes(" ") && compactKeyword.length >= 4 && compactText.includes(compactKeyword);
  }
  while (index >= 0) {
    const before = index === 0 ? "" : text[index - 1];
    const afterIndex = index + keyword.length;
    const after = afterIndex >= text.length ? "" : text[afterIndex];
    if (!/[a-z0-9]/i.test(before) && !/[a-z0-9]/i.test(after)) return true;
    index = text.indexOf(keyword, index + 1);
  }
  return false;
}

function compact(value: string) {
  return value.replace(/\s+/g, "");
}

function normalize(value: string) {
  return value.normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("ko-KR")
    .replace(/\bdiff(?:ie|e)[\s-]?hel+man+n?\b/g, "diffie-hellman")
    .replace(/\bphising\b/g, "phishing");
}
