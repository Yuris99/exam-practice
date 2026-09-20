import { notFound } from "next/navigation";
import { TheoryConceptLesson } from "@/components/TheoryConceptLesson";
import { questions } from "@/lib/questions";
import { findTheoryConcept, relatedPastQuestions } from "@/lib/theory";

type TheoryConceptPageProps = {
  params: Promise<{ certificateId: string; subjectSlug: string; unitSlug: string; conceptSlug: string }>;
};

export default async function TheoryConceptPage({ params }: TheoryConceptPageProps) {
  const { certificateId, subjectSlug, unitSlug, conceptSlug } = await params;
  const match = findTheoryConcept(certificateId, subjectSlug, unitSlug, conceptSlug);
  if (!match || match.unit.status !== "published") notFound();
  const relatedQuestions = relatedPastQuestions(questions, match).map(({ id, prompt, source, sourceYear }) => ({ id, prompt, source, sourceYear }));
  return <TheoryConceptLesson match={match} relatedQuestions={relatedQuestions} />;
}
