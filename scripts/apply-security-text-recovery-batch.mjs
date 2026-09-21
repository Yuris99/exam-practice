import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data", "information-security-quality");
const planPath = path.join(dataDir, "text-recovery-batch-002-plan.json");
const evidencePath = path.join(dataDir, "text-recovery-batch-002-ocr-evidence.json");
const decisionsPath = path.join(dataDir, "text-recovery-batch-002-decisions.json");
const resultPath = path.join(dataDir, "text-recovery-batch-002-result.json");
const csvPath = path.join(root, "content", "questions", "information-security-engineer-written.csv");
const generatedPath = path.join(root, "lib", "generatedQuestions.ts");
const overridesPath = path.join(dataDir, "question-id-overrides.json");
const apply = process.argv.includes("--apply");
const reapply = process.argv.includes("--reapply");
const startedAt = Date.now();

// Transcribed from the answer keys visible in each original PDF page image.
const sourceAnswers = {
  65: { 1: 4, 2: 1, 3: 4 }, 69: { 13: 1, 14: 2, 15: 2 },
  71: { 20: 4, 21: 1, 22: 1, 23: 3 }, 78: { 3: 2, 4: 3, 6: 4 },
  79: { 7: 2, 8: 2, 9: 3 }, 80: { 10: 2, 11: 4, 13: 4 },
  193: { 1: 3, 2: 4, 3: 4, 4: 4 }, 435: { 1: 1, 2: 3, 3: 2 },
  474: { 26: 2, 27: 3 }, 651: { 8: 4, 9: 2, 11: 3 },
  825: { 15: 4, 16: 4, 17: 3, 18: 3 }, 945: { 1: 3, 2: 1, 4: 4 },
  975: { 12: 4, 13: 4, 15: 1 }, 986: { 1: 3, 2: 2, 3: 3 },
  1152: { 72: 4, 73: 3 }, 1159: { 91: 4, 92: 3 }, 1168: { 14: 3, 16: 1 }
};
const editableFields = new Set([
  "prompt", "choice1", "choice2", "choice3", "choice4", "explanation",
  "reference_text", "code_snippet"
]);
const phases = {};

const loadStarted = Date.now();
const [plan, evidence, decisions, originalCsv, originalGenerated, originalOverrides, originalResult] = await Promise.all([
  readJson(planPath), readJson(evidencePath), readJson(decisionsPath),
  fs.readFile(csvPath, "utf8"), fs.readFile(generatedPath, "utf8"), readOptional(overridesPath), readOptional(resultPath)
]);
const rows = parseCsv(originalCsv);
const headers = rows[0];
const records = rows.slice(1).filter((row) => row.some((cell) => cell.trim()))
  .map((row) => Object.fromEntries(headers.map((header, i) => [header, row[i] ?? ""])));
if (reapply) {
  if (!originalResult) throw new Error("Cannot reapply without the previous batch result.");
  const previous = JSON.parse(originalResult);
  if (!previous.applied || previous.items?.length !== 50) throw new Error("Previous batch result is not a complete applied 50-question batch.");
  for (const item of previous.items) {
    const target = records.find((row) => row.source === item.source);
    if (!target || JSON.stringify(target) !== JSON.stringify(item.after)) {
      throw new Error("Target row changed since prior batch apply; refusing to overwrite: " + item.source);
    }
    Object.assign(target, item.before);
  }
}
const beforeQuestions = parseGenerated(originalGenerated);
const securityBefore = beforeQuestions.filter((question) => question.certificateId === "information-security-engineer");
if (plan.selectionLimit !== 50 || plan.selected?.length !== 50 ||
    decisions.selectionCount !== 50 || decisions.items?.length !== 50) throw new Error("Batch must contain exactly 50 selections and decisions.");
if (records.length !== 826 || securityBefore.length !== 826) throw new Error("Active information-security question count is not 826.");
const planKeys = new Set(plan.selected.map(key));
const decisionKeys = new Set(decisions.items.map(key));
if (planKeys.size !== 50 || decisionKeys.size !== 50 || [...planKeys].some((value) => !decisionKeys.has(value))) {
  throw new Error("Selection plan and decision manifest do not contain the same 50 unique questions.");
}
const prior = await readJson(path.join(dataDir, "text-recovery-pilot-001-result.json"));
const priorKeys = new Set((prior.items ?? []).map((item) => String(item.pdfPage) + ":" + item.questionNumber));
if (plan.selected.some((item) => priorKeys.has(key(item)) || (item.pdfPage === 39 && item.questionNumber === 10))) {
  throw new Error("Previously reviewed questions or the separate PDF 39 q10 conflict are selected.");
}
phases.dataLoadAndSelectionChecksMs = Date.now() - loadStarted;

const transformStarted = Date.now();
const evidenceMap = new Map(evidence.items.map((item) => [key(item), item]));
const beforeBySource = new Map(securityBefore.map((question) => [question.source, question]));
const stableIds = originalOverrides ? JSON.parse(originalOverrides) :
  { format: "question-id-overrides", version: 1, overrides: {} };
stableIds.overrides ??= {};
const reviewedItems = [];
const sourceConflicts = [];

for (const decision of decisions.items) {
  const selector = key(decision);
  const planned = plan.selected.find((item) => key(item) === selector);
  const evidenceItem = evidenceMap.get(selector);
  if (!planned || !evidenceItem || evidenceItem.ocrEvidence?.extractionMatchCount !== 1) {
    throw new Error("Plan, OCR, or extraction evidence missing for " + selector);
  }
  const answer = sourceAnswers[decision.pdfPage]?.[decision.questionNumber];
  if (!answer) throw new Error("Source answer key missing for " + selector);
  const matchingRows = records.filter((row) => hasSource(row.source, decision.pdfPage, decision.questionNumber));
  if (matchingRows.length !== 1) throw new Error("Expected one active CSV row for " + selector);
  const row = matchingRows[0];
  const before = structuredClone(row);
  const generatedBefore = beforeBySource.get(row.source);
  if (!generatedBefore) throw new Error("Generated question missing for " + row.source);
  if (JSON.stringify(before) !== JSON.stringify(planned.before)) throw new Error("Active row drifted since selection; refusing overwrite: " + row.source);
  const matchesAnswer = Number(row.correct_answer) === answer;
  if (!matchesAnswer) sourceConflicts.push(selector);

  if (decision.status === "held") {
    if (!decision.holdReason || decision.after || matchesAnswer) throw new Error("Held item is not an answer conflict: " + selector);
  } else if (decision.status === "verified_corrected") {
    if (!matchesAnswer || !decision.after || !Object.keys(decision.after).length) throw new Error("Unsafe/unmatched correction for " + selector);
    for (const [field, value] of Object.entries(decision.after)) {
      if (!editableFields.has(field) || !headers.includes(field) || typeof value !== "string") {
        throw new Error("Correction attempted a protected or unknown field " + field + " for " + selector);
      }
      row[field] = value;
    }
    if (!Object.keys(decision.after).some((field) => before[field] !== row[field])) throw new Error("No actual diff for " + selector);
    stableIds.overrides[row.certificate_id + "|" + row.source] = generatedBefore.id;
  } else if (decision.status === "verified_no_change") {
    if (!matchesAnswer || (decision.after && Object.keys(decision.after).length)) throw new Error("Invalid no-change item " + selector);
  } else {
    throw new Error("Unknown decision status for " + selector);
  }

  for (const field of [
    "certificate_id", "category", "exam_type", "source", "source_year", "correct_answer",
    "model_answer", "key_points", "difficulty", "image_url", "image_urls", "tags", "code_language"
  ]) {
    if (before[field] !== row[field]) throw new Error("Protected field changed (" + field + ") for " + selector);
  }
  const choiceFields = ["choice1", "choice2", "choice3", "choice4"];
  if (choiceFields.some((field) => !before[field]?.trim() || !row[field]?.trim())) throw new Error("Choice structure invalid for " + selector);
  const afterChoices = choiceFields.map((field) => row[field]);
  if (afterChoices.length !== 4) throw new Error("Choice count changed for " + selector);
  reviewedItems.push({
    pdfPage: decision.pdfPage,
    questionNumber: decision.questionNumber,
    status: decision.status,
    errorTypes: decision.errorTypes,
    holdReason: decision.holdReason ?? null,
    sourceAnswer: answer,
    registeredAnswerBefore: Number(before.correct_answer),
    answerMatchesSource: matchesAnswer,
    questionId: generatedBefore.id,
    source: row.source,
    sourceImage: "../ocr/outputs/full_ocr/images/pdf_page_" + String(decision.pdfPage).padStart(4, "0") + ".png",
    evidence: {
      extractionMatchCount: evidenceItem.ocrEvidence.extractionMatchCount,
      coordinateRegionsFound: Boolean(evidenceItem.ocrEvidence.bboxXYXY),
      bboxXYXY: evidenceItem.ocrEvidence.bboxXYXY,
      meanConfidence: evidenceItem.ocrEvidence.meanConfidence,
      minimumConfidence: evidenceItem.ocrEvidence.minimumConfidence
    },
    changedFields: headers.filter((field) => before[field] !== row[field]),
    before,
    after: structuredClone(row)
  });
}
const statusCounts = {
  corrected: reviewedItems.filter((item) => item.status === "verified_corrected").length,
  noChange: reviewedItems.filter((item) => item.status === "verified_no_change").length,
  held: reviewedItems.filter((item) => item.status === "held").length
};
if (reviewedItems.length !== 50 || statusCounts.corrected !== 44 || statusCounts.noChange !== 0 ||
    statusCounts.held !== 6 || sourceConflicts.length !== 6 ||
    reviewedItems.some((item) => item.status === "held" && item.changedFields.length)) {
  throw new Error("Unexpected outcome counts: " + JSON.stringify({ statusCounts, sourceConflicts }));
}
const changedSources = new Set(reviewedItems.filter((item) => item.changedFields.length).map((item) => item.source));
const beforeUntouched = beforeQuestions.filter((question) => !changedSources.has(question.source)).map(canonical).sort();
const stagedCsv = stringifyCsv([headers, ...records.map((row) => headers.map((header) => row[header] ?? ""))]);
const stagedRecords = parseCsv(stagedCsv).slice(1).filter((row) => row.some((cell) => cell.trim()))
  .map((row) => Object.fromEntries(headers.map((header, i) => [header, row[i] ?? ""])));
for (const item of reviewedItems) {
  const staged = stagedRecords.find((row) => row.source === item.source);
  if (!staged || JSON.stringify(staged) !== JSON.stringify(item.after)) throw new Error("Staged CSV diff mismatch for " + item.source);
}
phases.transformAndProtectedFieldChecksMs = Date.now() - transformStarted;

const result = {
  format: "information-security-text-recovery-result",
  version: 1,
  batchNumber: 2,
  generatedAt: new Date().toISOString(),
  applied: apply,
  selectionCount: reviewedItems.length,
  statusCounts,
  sourceAnswerConflicts: sourceConflicts,
  sourcePages: [...new Set(reviewedItems.map((item) => item.pdfPage))].sort((a, b) => a - b),
  evidenceSummary: {
    pageCount: new Set(reviewedItems.map((item) => item.pdfPage)).size,
    extractionMatches: reviewedItems.filter((item) => item.evidence.extractionMatchCount === 1).length,
    coordinateRegionsFound: reviewedItems.filter((item) => item.evidence.coordinateRegionsFound).length,
    sourcePageImageReviewedCount: 50
  },
  invariants: {
    activeSecurityQuestionCountBefore: 826,
    activeSecurityQuestionCountAfter: 826,
    registeredAnswersChanged: 0,
    questionIdsAndStudyIdentifiersPreserved: true,
    choiceCountAndOrderPreserved: true,
    nonTargetQuestionsChanged: 0,
    otherCertificatesChanged: 0,
    previousPilotQuestionsReprocessed: 0
  },
  timingsMs: phases,
  items: reviewedItems
};

if (!apply) {
  console.log(JSON.stringify({
    dryRun: true, selectionCount: 50, statusCounts, answerConflicts: sourceConflicts.length,
    pages: result.evidenceSummary.pageCount, coordinates: result.evidenceSummary.coordinateRegionsFound
  }));
  process.exit(0);
}

const generateStarted = Date.now();
try {
  const overrideData = stableIds;
  await fs.writeFile(overridesPath, JSON.stringify(overrideData, null, 2) + "\n", "utf8");
  await fs.writeFile(csvPath, stagedCsv, "utf8");
  const generation = spawnSync(process.execPath, [path.join(root, "scripts", "generate-questions.mjs")], {
    cwd: root, encoding: "utf8", stdio: "pipe"
  });
  if (generation.status !== 0) throw new Error("Question generation failed:\n" + generation.stdout + "\n" + generation.stderr);
  const afterGeneratedSource = await fs.readFile(generatedPath, "utf8");
  const allAfter = parseGenerated(afterGeneratedSource);
  const securityAfter = allAfter.filter((question) => question.certificateId === "information-security-engineer");
  if (securityAfter.length !== 826) throw new Error("Active question count changed to " + securityAfter.length);
  const afterUntouched = allAfter.filter((question) => !changedSources.has(question.source)).map(canonical).sort();
  if (JSON.stringify(beforeUntouched) !== JSON.stringify(afterUntouched)) throw new Error("A non-target question or another certificate changed.");
  for (const item of reviewedItems) {
    const question = securityAfter.find((candidate) => candidate.source === item.source);
    if (!question || question.id !== item.questionId) throw new Error("Question ID/study identity changed for " + item.source);
    item.generatedIdAfter = question.id;
  }
  result.csvSha256Before = reapply ? JSON.parse(originalResult).csvSha256Before : sha256(originalCsv);
  result.csvSha256After = sha256(await fs.readFile(csvPath, "utf8"));
  result.generatedSha256Before = reapply ? JSON.parse(originalResult).generatedSha256Before : sha256(originalGenerated);
  result.generatedSha256After = sha256(afterGeneratedSource);
  result.timingsMs.generateAndInvariantChecksMs = Date.now() - generateStarted;
  result.timingsMs.totalApplyMs = Date.now() - startedAt;
  result.reappliedFromPreviousBatchResult = reapply;
  await fs.writeFile(resultPath, JSON.stringify(result, null, 2) + "\n", "utf8");
  console.log(JSON.stringify({ applied: true, selectionCount: 50, statusCounts, activeQuestions: 826, idsPreserved: true }));
} catch (error) {
  await fs.writeFile(csvPath, originalCsv, "utf8");
  await fs.writeFile(generatedPath, originalGenerated, "utf8");
  if (originalOverrides === null) await fs.rm(overridesPath, { force: true });
  else await fs.writeFile(overridesPath, originalOverrides, "utf8");
  if (originalResult === null) await fs.rm(resultPath, { force: true });
  else await fs.writeFile(resultPath, originalResult, "utf8");
  throw error;
}

function key(item) { return String(item.pdfPage) + ":" + item.questionNumber; }
function hasSource(source, page, number) {
  const match = String(source).match(/PDF\s+(\d+).*?·\s*(\d+)번/u);
  return Boolean(match && Number(match[1]) === page && Number(match[2]) === number);
}
function parseGenerated(source) {
  const prefix = "export const generatedQuestions = JSON.parse(";
  const suffix = ") as Question[];";
  const start = source.indexOf(prefix);
  const end = source.lastIndexOf(suffix);
  if (start < 0 || end < 0) throw new Error("Cannot parse generated questions.");
  return JSON.parse(JSON.parse(source.slice(start + prefix.length, end)));
}
function parseCsv(source) {
  const output = []; let row = []; let cell = ""; let quoted = false;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (char === '"' && quoted && source[i + 1] === '"') { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && source[i + 1] === "\n") i += 1;
      row.push(cell); output.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (quoted) throw new Error("CSV contains an unclosed quote.");
  if (cell || row.length) { row.push(cell); output.push(row); }
  return output;
}
function stringifyCsv(input) {
  return input.map((row) => row.map((cell) => '"' + String(cell ?? "").replace(/"/gu, '""') + '"').join(",")).join("\n") + "\n";
}
function canonical(question) { return JSON.stringify(question); }
function sha256(value) { return createHash("sha256").update(value).digest("hex"); }
async function readJson(file) { return JSON.parse(await fs.readFile(file, "utf8")); }
async function readOptional(file) {
  try { return await fs.readFile(file, "utf8"); }
  catch (error) { if (error.code === "ENOENT") return null; throw error; }
}
