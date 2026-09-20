import Link from "next/link";
import { getTheoryConceptForQuestion, theoryConceptHref } from "@/lib/theory";
import type { Question } from "@/lib/types";
import styles from "./TheoryTrail.module.css";

export function TheoryReviewLink({ question, incorrect = false }: { question: Question; incorrect?: boolean }) {
  const match = getTheoryConceptForQuestion(question);
  if (!match) return null;
  return <Link className={styles.reviewLink} href={theoryConceptHref(match)}><span>{incorrect ? "오답과 연결된 개념" : "관련 이론"} · {match.unit.title}</span><strong>{match.concept.title} 복습 →</strong></Link>;
}
