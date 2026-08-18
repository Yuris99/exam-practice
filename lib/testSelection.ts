import type { Question } from "./types";

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
