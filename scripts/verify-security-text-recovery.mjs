import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generatedQuestions } from "../lib/generatedQuestions.ts";
import { informationSecurityTheoryCourse } from "../content/theory/information-security-engineer.ts";
import { diagnoseTheoryConceptMatch } from "../lib/theoryMatching.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resultFile = path.join(root, "data", "information-security-quality", "text-recovery-pilot-001-result.json");
const outputFile = path.join(root, "data", "information-security-quality", "text-recovery-pilot-001-verification.json");
const result = JSON.parse(await fs.readFile(resultFile, "utf8"));
if (!result.applied || result.selectionCount !== 20) throw new Error("The 20-question recovery result is not applied.");

const securityQuestions = generatedQuestions.filter((question) => question.certificateId === "information-security-engineer");
if (securityQuestions.length !== 826) throw new Error(`Expected 826 security questions, found ${securityQuestions.length}.`);
const linkResults = [];

for (const item of result.items) {
  const current = securityQuestions.find((question) => question.id === item.questionId);
  if (!current || current.source !== item.source) throw new Error(`Question identity/source mismatch for ${item.source}.`);
  const expectedChoices = [1, 2, 3, 4].map((number) => item.after[`choice${number}`]).filter(Boolean);
  if (current.examType !== "WRITTEN_CBT" || current.correctChoiceIndex !== Number(item.after.correct_answer) - 1) throw new Error(`Answer changed for ${item.source}.`);
  if (JSON.stringify(current.choices) !== JSON.stringify(expectedChoices)) throw new Error(`Choice order changed for ${item.source}.`);

  const beforeQuestion = {
    ...current,
    prompt: item.before.prompt,
    explanation: item.before.explanation,
    choices: [1, 2, 3, 4].map((number) => item.before[`choice${number}`]).filter(Boolean),
    ...(item.before.reference_text ? { referenceText: item.before.reference_text } : {}),
    ...(item.before.code_snippet ? { codeSnippet: item.before.code_snippet } : {})
  };
  const before = diagnoseTheoryConceptMatch([informationSecurityTheoryCourse], beforeQuestion);
  const after = diagnoseTheoryConceptMatch([informationSecurityTheoryCourse], current);
  const beforeConceptId = before.match?.concept.id ?? null;
  const afterConceptId = after.match?.concept.id ?? null;
  if (beforeConceptId && !afterConceptId) throw new Error(`Theory link regressed for ${item.source}.`);
  if (beforeConceptId && afterConceptId !== beforeConceptId) throw new Error(`Theory link changed unexpectedly for ${item.source}: ${beforeConceptId} -> ${afterConceptId}.`);
  linkResults.push({ source: item.source, questionId: item.questionId, beforeConceptId, afterConceptId, outcome: beforeConceptId === afterConceptId ? "preserved" : "new_link" });
}

const verification = {
  generatedAt: new Date().toISOString(),
  activeSecurityQuestionCount: securityQuestions.length,
  selectedCount: linkResults.length,
  correctedCount: result.correctedCount,
  heldCount: result.heldCount,
  identitySourceAnswerAndChoiceOrderPreserved: true,
  theoryLinks: {
    preserved: linkResults.filter((item) => item.outcome === "preserved" && item.beforeConceptId).length,
    newlyMatched: linkResults.filter((item) => item.outcome === "new_link").length,
    stillUnmatched: linkResults.filter((item) => !item.afterConceptId).length,
    regressed: 0,
    items: linkResults
  }
};
await fs.writeFile(outputFile, `${JSON.stringify(verification, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  activeSecurityQuestionCount: verification.activeSecurityQuestionCount,
  selectedCount: verification.selectedCount,
  correctedCount: verification.correctedCount,
  heldCount: verification.heldCount,
  theoryLinks: { ...verification.theoryLinks, items: undefined }
}, null, 2));
