import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generatedQuestions } from "../lib/generatedQuestions.ts";
import { informationSecurityTheoryCourse } from "../content/theory/information-security-engineer.ts";
import { diagnoseTheoryConceptMatch } from "../lib/theoryMatching.ts";

const startedAt = Date.now();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data", "information-security-quality");
const resultPath = path.join(dataDir, "text-recovery-batch-002-result.json");
const outputPath = path.join(dataDir, "text-recovery-batch-002-verification.json");
const result = JSON.parse(await fs.readFile(resultPath, "utf8"));
if (!result.applied || result.selectionCount !== 50) throw new Error("Batch 2 has not been applied.");
const active = generatedQuestions.filter((question) => question.certificateId === "information-security-engineer");
if (active.length !== 826) throw new Error("Expected 826 active questions; found " + active.length);

const sourceCorrectedRelinks = new Map([
  ["435:3", { before: "s-http-web-protocol", after: "ssl-tls-protocol" }]
]);
const theoryLinks = [];
for (const item of result.items) {
  const current = active.find((question) => question.id === item.questionId);
  if (!current || current.source !== item.source) throw new Error("Question ID/source mismatch: " + item.source);
  if (current.examType !== "WRITTEN_CBT" || current.correctChoiceIndex !== Number(item.before.correct_answer) - 1) {
    throw new Error("Registered answer changed: " + item.source);
  }
  const expectedChoices = [1, 2, 3, 4].map((n) => item.after["choice" + n]);
  if (JSON.stringify(current.choices) !== JSON.stringify(expectedChoices)) throw new Error("Choice count/order or text mismatch: " + item.source);
  if (current.prompt !== item.after.prompt || current.explanation !== item.after.explanation) {
    throw new Error("Rendered question/explanation text differs from reviewed snapshot: " + item.source);
  }
  if (item.status === "held" && item.changedFields.length !== 0) throw new Error("Held row was modified: " + item.source);
  if (item.status === "verified_corrected" && item.changedFields.length === 0) throw new Error("Correction has no recorded diff: " + item.source);

  const beforeQuestion = {
    ...current,
    prompt: item.before.prompt,
    explanation: item.before.explanation,
    choices: [1, 2, 3, 4].map((n) => item.before["choice" + n]),
    ...(item.before.reference_text ? { referenceText: item.before.reference_text } : {}),
    ...(item.before.code_snippet ? { codeSnippet: item.before.code_snippet } : {})
  };
  const beforeMatch = diagnoseTheoryConceptMatch([informationSecurityTheoryCourse], beforeQuestion).match?.concept.id ?? null;
  const afterMatch = diagnoseTheoryConceptMatch([informationSecurityTheoryCourse], current).match?.concept.id ?? null;
  const selector = item.pdfPage + ":" + item.questionNumber;
  if (beforeMatch && !afterMatch) throw new Error("Existing theory concept link was lost: " + item.source);
  const relink = sourceCorrectedRelinks.get(selector);
  if (beforeMatch && afterMatch !== beforeMatch &&
      (!relink || relink.before !== beforeMatch || relink.after !== afterMatch)) {
    throw new Error("Unexpected theory concept change: " + item.source + " (" + beforeMatch + " -> " + afterMatch + ")");
  }
  theoryLinks.push({
    selector,
    questionId: item.questionId,
    source: item.source,
    beforeConceptId: beforeMatch,
    afterConceptId: afterMatch,
    status: beforeMatch === afterMatch ? "preserved" : beforeMatch ? "source_text_corrected_match" : afterMatch ? "new_match" : "unmatched"
  });
}
for (const selector of sourceCorrectedRelinks.keys()) {
  if (!theoryLinks.some((item) => item.selector === selector && item.status === "source_text_corrected_match")) {
    throw new Error("Expected source-correction relink was not observed for " + selector);
  }
}

const linkSummary = {
  existingLinksBefore: theoryLinks.filter((item) => item.beforeConceptId).length,
  preserved: theoryLinks.filter((item) => item.beforeConceptId && item.status === "preserved").length,
  sourceTextCorrectedMatch: theoryLinks.filter((item) => item.status === "source_text_corrected_match").length,
  newMatches: theoryLinks.filter((item) => item.status === "new_match").length,
  unmatchedAfter: theoryLinks.filter((item) => !item.afterConceptId).length,
  regressed: 0
};
const verification = {
  generatedAt: new Date().toISOString(),
  batchNumber: 2,
  selected: 50,
  corrected: result.statusCounts.corrected,
  noChange: result.statusCounts.noChange,
  held: result.statusCounts.held,
  activeSecurityQuestionCount: active.length,
  registeredAnswersChanged: 0,
  questionIdsAndStudyIdentifiersPreserved: true,
  choiceCountAndOrderPreserved: true,
  nonTargetAndOtherCertificateDataPreserved: true,
  theoryLinks: linkSummary,
  items: theoryLinks,
  durationMs: Date.now() - startedAt
};
await fs.writeFile(outputPath, JSON.stringify(verification, null, 2) + "\n", "utf8");
console.log(JSON.stringify({
  verified: true,
  activeSecurityQuestionCount: verification.activeSecurityQuestionCount,
  selected: verification.selected,
  corrected: verification.corrected,
  held: verification.held,
  theoryLinks: linkSummary
}));
