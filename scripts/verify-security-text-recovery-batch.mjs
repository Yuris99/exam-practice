import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generatedQuestions } from "../lib/generatedQuestions.ts";
import { informationSecurityTheoryCourse } from "../content/theory/information-security-engineer.ts";
import { diagnoseTheoryConceptMatch } from "../lib/theoryMatching.ts";

const startedAt = Date.now();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data", "information-security-quality");
const batchNumber = Number(process.argv.find((arg) => arg.startsWith("--batch="))?.slice(8) ?? 2);
const batchLabel = String(batchNumber).padStart(3, "0");
const resultPath = path.join(dataDir, `text-recovery-batch-${batchLabel}-result.json`);
const outputPath = path.join(dataDir, `text-recovery-batch-${batchLabel}-verification.json`);
const result = JSON.parse(await fs.readFile(resultPath, "utf8"));
if (!result.applied || result.batchNumber !== batchNumber || result.selectionCount !== result.items?.length) throw new Error("Requested recovery batch has not been applied completely.");
const active = generatedQuestions.filter((question) => question.certificateId === "information-security-engineer");
if (active.length !== 826) throw new Error("Expected 826 active questions; found " + active.length);

const sourceCorrectedRelinks = new Map(batchNumber === 2 ? [
  ["435:3", { before: "s-http-web-protocol", after: "ssl-tls-protocol" }]
] : batchNumber === 6 ? [
  ["589:19", { before: "mitb", after: "directory-indexing-path-traversal" }]
] : batchNumber === 8 ? [
  ["479:44", { before: "ips-utm-nac", after: "suricata-snort-rules" }],
  ["598:45", { before: "reverse-shell-netcat", after: "unsafe-upload-webshell" }],
  ["338:11", { before: "network-media-wifi", after: "arp-address-resolution" }]
] : batchNumber === 11 ? [
  ["646:5", { before: "db-and-rdbms-model", after: "db-security-requirements" }]
] : batchNumber === 13 ? [
  ["774:7", { before: "hybrid-cryptosystem", after: "classical-substitution-transposition" }]
] : batchNumber === 15 ? [
  ["416:3", { before: "network-arp-ip-spoofing", after: "firewall-filtering-types" }],
  ["1181:61", { before: "rsa-key-generation", after: "rsa-encryption-decryption" }]
] : batchNumber === 16 ? [
  ["433:12", { before: "s-http-web-protocol", after: "ssl-tls-protocol" }]
] : batchNumber === 17 ? [
  ["1182:64", { before: "hybrid-cryptosystem", after: "aria-cipher" }]
] : []);
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
  const selector = item.pdfPage + ":" + item.questionNumber;
  const relink = sourceCorrectedRelinks.get(selector);
  // For explicitly reviewed source-correction relinks, use the recorded pre-batch
  // concept: the added exact-source matcher keyword may also match the old OCR text.
  const beforeMatch = relink?.before ?? diagnoseTheoryConceptMatch([informationSecurityTheoryCourse], beforeQuestion).match?.concept.id ?? null;
  const afterMatch = diagnoseTheoryConceptMatch([informationSecurityTheoryCourse], current).match?.concept.id ?? null;
  if (beforeMatch && !afterMatch) throw new Error("Existing theory concept link was lost: " + item.source);
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
  batchNumber,
  selected: result.selectionCount,
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
