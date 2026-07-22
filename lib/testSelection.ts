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
