import type { Question } from "@/lib/types";

export function QuestionMetadata({ question, compact = false }: { question: Question; compact?: boolean }) {
  const visibleTags = question.tags?.slice(0, compact ? 2 : 3) ?? [];
  const hiddenTagCount = (question.tags?.length ?? 0) - visibleTags.length;

  return <div className={`questionMetadata ${compact ? "compact" : ""}`}>
    <span>{question.category}</span>
    {question.source && <span>{question.source}</span>}
    {question.sourceYear && <span>{question.sourceYear}년</span>}
    {visibleTags.map((tag) => <b key={tag}>#{tag}</b>)}
    {hiddenTagCount > 0 && <b>+{hiddenTagCount}</b>}
  </div>;
}
