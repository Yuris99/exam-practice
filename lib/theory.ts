import { informationSecurityTheoryCourse } from "../content/theory/information-security-engineer";
import { matchTheoryConcept } from "./theoryMatching";
import type { Question } from "./types";
import type { TheoryConceptMatch, TheoryCourse, TheorySubject, TheoryUnit } from "./theoryTypes";

export type { TheoryConceptMatch } from "./theoryTypes";

export const theoryCourses: TheoryCourse[] = [informationSecurityTheoryCourse];

export function getTheoryCourse(certificateId: string) {
  return theoryCourses.find((course) => course.certificateId === certificateId);
}

export function findTheoryUnit(certificateId: string, subjectId: string, unitId: string) {
  const course = getTheoryCourse(certificateId);
  const subject = course?.subjects.find((item) => item.id === subjectId);
  const unit = subject?.units.find((item) => item.id === unitId);
  return course && subject && unit ? { course, subject, unit } : undefined;
}

export function findTheoryConcept(certificateId: string, subjectId: string, unitId: string, conceptId: string): TheoryConceptMatch | undefined {
  const found = findTheoryUnit(certificateId, subjectId, unitId);
  const concept = found?.unit.concepts.find((item) => item.id === conceptId);
  return found && concept ? { ...found, concept } : undefined;
}

export function listPublishedConcepts(course: TheoryCourse) {
  return course.subjects.flatMap((subject) => subject.units.filter((unit) => unit.status === "published").flatMap((unit) => unit.concepts.map((concept) => ({ course, subject, unit, concept }))));
}

export function getTheoryConceptForQuestion(question: Question): TheoryConceptMatch | undefined {
  return matchTheoryConcept(theoryCourses, question);
}

export function theoryConceptHref(match: TheoryConceptMatch) {
  return `/learn/${match.course.certificateId}/${match.subject.id}/${match.unit.id}/${match.concept.id}`;
}

export function theoryUnitHref(course: TheoryCourse, subject: TheorySubject, unit: TheoryUnit) {
  return `/learn/${course.certificateId}/${subject.id}/${unit.id}`;
}

export function theoryProgressKey(match: TheoryConceptMatch) {
  return [match.course.certificateId, match.subject.id, match.unit.id, match.concept.id].join(":");
}

export function relatedPastQuestions(questions: Question[], match: TheoryConceptMatch, limit = 8) {
  return questions.filter((question) => (question.publicationStatus ?? "published") === "published" && question.examType === "WRITTEN_CBT" && question.tags?.includes("기출") && getTheoryConceptForQuestion(question)?.concept.id === match.concept.id).slice(0, limit);
}
