import { informationSecurityTheoryCourse } from "../content/theory/information-security-engineer.ts";
import { generatedQuestions } from "../lib/generatedQuestions.ts";
import { diagnoseTheoryConceptMatch } from "../lib/theoryMatching.ts";

const certificateId = "information-security-engineer";
const categories = ["시스템 보안", "네트워크 보안", "어플리케이션 보안", "정보보안 일반", "정보보안 관리 및 법규"];
const questions = generatedQuestions.filter((question) => question.certificateId === certificateId);
const showDetails = process.argv.includes("--details");

function legacySystemMatch(question) {
  if (question.category !== "시스템 보안") return undefined;
  const text = `${question.prompt} ${question.referenceText ?? ""}`.normalize("NFKC").replace(/\s+/g, " ").toLocaleLowerCase("ko-KR");
  let best;
  for (const subject of informationSecurityTheoryCourse.subjects) {
    for (const unit of subject.units.filter((item) => item.status === "published")) {
      for (const concept of unit.concepts) {
        const legacyKeywords = concept.id === "system-integrity-monitoring"
          ? concept.questionKeywords.filter((keyword) => !["Syslog", "시스템 로그", "로그 감시", "시스템 로깅"].includes(keyword))
          : concept.questionKeywords;
        const score = legacyKeywords.reduce((sum, keyword) => {
          const normalizedKeyword = keyword.normalize("NFKC").replace(/\s+/g, " ").toLocaleLowerCase("ko-KR");
          return text.includes(normalizedKeyword) ? sum + Math.max(1, normalizedKeyword.length / 4) : sum;
        }, 0);
        if (score > 0 && (!best || score > best.score)) best = { id: concept.id, score };
      }
    }
  }
  return best?.id;
}

const result = categories.map((category) => {
  const categoryQuestions = questions.filter((question) => question.category === category);
  const diagnostics = categoryQuestions.map((question) => diagnoseTheoryConceptMatch([informationSecurityTheoryCourse], question));
  const linked = diagnostics.filter((item) => item.match);
  const summary = {
    category,
    total: categoryQuestions.length,
    linked: linked.length,
    unlinked: categoryQuestions.length - linked.length,
    linkedConcepts: new Set(linked.map((item) => item.match.concept.id)).size,
    uncertainLinks: linked.filter((item) => item.ambiguous).length,
    rejectedAsAmbiguous: diagnostics.filter((item) => item.ambiguous).length
  };
  if (!showDetails) return summary;
  return {
    ...summary,
    samples: categoryQuestions.map((question, index) => ({ question, diagnostic: diagnostics[index] }))
      .filter(({ diagnostic }) => diagnostic.ambiguous || (diagnostic.match && diagnostic.runnerUpScore >= diagnostic.score * 0.8) || !diagnostic.match)
      .slice(0, 5)
      .map(({ question, diagnostic }) => ({ id: question.id, prompt: question.prompt.slice(0, 100), match: diagnostic.match?.concept.id, score: diagnostic.score, runnerUpScore: diagnostic.runnerUpScore, ambiguous: diagnostic.ambiguous }))
  };
});

const systemQuestions = questions.filter((question) => question.category === "시스템 보안");
const conceptSubject = new Map(informationSecurityTheoryCourse.subjects.flatMap((subject) => subject.units.flatMap((unit) => unit.concepts.map((concept) => [concept.id, subject.title]))));
const systemRegression = systemQuestions.reduce((result, question) => {
  const legacy = legacySystemMatch(question);
  if (!legacy) return result;
  const current = diagnoseTheoryConceptMatch([informationSecurityTheoryCourse], question).match?.concept.id;
  const legacyWithinSystem = conceptSubject.get(legacy) === "시스템 보안";
  if (!legacyWithinSystem) result.legacyOutsideSystem += 1;
  else if (!current) result.withinSystem.lost += 1;
  else if (current === legacy) result.withinSystem.same += 1;
  else result.withinSystem.changed += 1;
  if (!current) result.lost += 1;
  else if (current === legacy) result.same += 1;
  else result.changed += 1;
  return result;
}, { same: 0, changed: 0, lost: 0, legacyOutsideSystem: 0, withinSystem: { same: 0, changed: 0, lost: 0 } });
const systemRegressionSamples = showDetails ? systemQuestions.map((question) => {
  const legacy = legacySystemMatch(question);
  const current = diagnoseTheoryConceptMatch([informationSecurityTheoryCourse], question).match?.concept.id;
  return { id: question.id, prompt: question.prompt.slice(0, 100), legacy, current, legacySubject: legacy ? conceptSubject.get(legacy) : undefined };
}).filter((item) => item.legacy && item.legacy !== item.current)
  .sort((left, right) => Number(right.legacySubject === "시스템 보안") - Number(left.legacySubject === "시스템 보안"))
  .slice(0, 12) : undefined;
console.log(JSON.stringify({
  certificateId,
  total: questions.length,
  legacySystemLinked: systemQuestions.filter(legacySystemMatch).length,
  systemRegression,
  ...(systemRegressionSamples ? { systemRegressionSamples } : {}),
  categories: result
}, null, 2));
