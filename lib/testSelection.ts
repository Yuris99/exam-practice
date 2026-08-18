import type { Question } from "./types";

export const writtenSubjectOrder: Record<string, string[]> = {
  "information-processing-engineer": ["소프트웨어 설계", "소프트웨어 개발", "데이터베이스 구축", "프로그래밍 언어 활용", "정보시스템 구축 관리"],
  "embedded-engineer": ["임베디드 하드웨어", "임베디드 펌웨어", "임베디드 플랫폼", "임베디드 소프트웨어"],
  "computer-system-engineer": ["컴퓨터 프로그래밍", "디지털 회로 및 데이터 통신", "컴퓨터 구조", "운영체제 및 시스템 소프트웨어"],
  "information-security-engineer": ["시스템 보안", "네트워크 보안", "어플리케이션 보안", "정보보안 일반", "정보보안 관리 및 법규"],
  "ai-exam": ["1-1 AI·기계학습 기초", "1-2 AI·기계학습 방법", "2-1 자연어 처리 기본", "2-2 텍스트 파운데이션 모델", "3-1 딥러닝·영상 모델", "3-2 이미지 파운데이션 모델", "4-1 LangChain 서비스 개발", "4-2 Agent 모델", "5-1 리소스 효율적 AI 모델", "5-2 AI 모델 활용·Ambient AI"]
};

export function orderByExamStandard<T extends Question>(questions: T[]): T[] {
  if (!questions.length) return [];
  const configured = writtenSubjectOrder[questions[0].certificateId] ?? [];
  const encountered = [...new Set(questions.map((question) => question.category))];
  const categories = [...configured.filter((category) => encountered.includes(category)), ...encountered.filter((category) => !configured.includes(category))];
  const rank = new Map(categories.map((category, index) => [category, index]));
  return questions.map((question, index) => ({ question, index })).sort((left, right) =>
    (rank.get(left.question.category) ?? Number.MAX_SAFE_INTEGER) - (rank.get(right.question.category) ?? Number.MAX_SAFE_INTEGER)
    || left.index - right.index
  ).map(({ question }) => question);
}

export function selectBalancedByCategory(candidates: Question[], requestedCount: number) {
  const groups = new Map<string, Question[]>();
  candidates.forEach((question) => groups.set(question.category, [...(groups.get(question.category) ?? []), question]));
  const categories = shuffled([...groups.keys()]);
  categories.forEach((category) => groups.set(category, shuffled(groups.get(category) ?? [])));
  const selected: Question[] = [];
  while (selected.length < requestedCount) {
    let added = false;
    categories.forEach((category) => {
      if (selected.length >= requestedCount) return;
      const question = groups.get(category)?.shift();
      if (question) { selected.push(question); added = true; }
    });
    if (!added) break;
  }
  return selected;
}

/** Selects evenly from subjects while preserving the subject order in the bank. */
export function selectMockExamByCategory(candidates: Question[], requestedCount: number) {
  const configured = candidates.length ? writtenSubjectOrder[candidates[0].certificateId] ?? [] : [];
  const officialCandidates = configured.length ? candidates.filter((question) => configured.includes(question.category)) : candidates;
  if (officialCandidates.length) candidates = officialCandidates;
  candidates = orderByExamStandard(candidates);
  const groups = new Map<string, Question[]>();
  candidates.forEach((question) => groups.set(question.category, [...(groups.get(question.category) ?? []), question]));
  const categories = [...groups.keys()];
  categories.forEach((category) => groups.set(category, shuffled(groups.get(category) ?? [])));
  const base = categories.length ? Math.floor(requestedCount / categories.length) : 0;
  let remainder = categories.length ? requestedCount % categories.length : 0;
  const selected: Question[] = [];
  categories.forEach((category) => {
    const requested = base + (remainder-- > 0 ? 1 : 0);
    selected.push(...(groups.get(category) ?? []).slice(0, requested));
  });
  if (selected.length < requestedCount) {
    const used = new Set(selected.map((question) => question.id));
    categories.forEach((category) => {
      (groups.get(category) ?? []).forEach((question) => {
        if (selected.length < requestedCount && !used.has(question.id)) {
          selected.push(question);
          used.add(question.id);
        }
      });
    });
  }
  return selected;
}

export function createTestSnapshot(question: Question, shouldShuffleChoices: boolean): Question {
  const snapshot = structuredClone(question);
  if (!shouldShuffleChoices || snapshot.examType !== "WRITTEN_CBT") return snapshot;
  const originalCorrectChoiceIndex = snapshot.correctChoiceIndex;
  const choiceEntries = shuffled(snapshot.choices.map((choice, originalIndex) => ({ choice, originalIndex })));
  snapshot.choices = choiceEntries.map((entry) => entry.choice);
  snapshot.correctChoiceIndex = choiceEntries.findIndex((entry) => entry.originalIndex === originalCorrectChoiceIndex);
  return snapshot;
}

export function shuffled<T>(values: T[]) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}
