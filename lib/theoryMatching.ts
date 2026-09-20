import type { Question } from "./types";
import type { TheoryConceptMatch, TheoryCourse } from "./theoryTypes";

export function matchTheoryConcept(courses: TheoryCourse[], question: Question): TheoryConceptMatch | undefined {
  const course = courses.find((item) => item.certificateId === question.certificateId);
  if (!course || question.category !== "시스템 보안") return undefined;
  const text = normalize(`${question.prompt} ${question.referenceText ?? ""}`);
  let best: { match: TheoryConceptMatch; score: number } | undefined;
  for (const subject of course.subjects) {
    for (const unit of subject.units.filter((item) => item.status === "published")) {
      for (const concept of unit.concepts) {
        const score = concept.questionKeywords.reduce((sum, keyword) => {
          const normalizedKeyword = normalize(keyword);
          return text.includes(normalizedKeyword) ? sum + Math.max(1, normalizedKeyword.length / 4) : sum;
        }, 0);
        if (score > 0 && (!best || score > best.score)) best = { match: { course, subject, unit, concept }, score };
      }
    }
  }
  return best?.match;
}

function normalize(value: string) {
  return value.normalize("NFKC").replace(/\s+/g, " ").toLocaleLowerCase("ko-KR");
}
