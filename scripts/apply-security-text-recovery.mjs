import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const planFile = path.join(root, "data", "information-security-quality", "text-recovery-pilot-001-plan.json");
const resultFile = path.join(root, "data", "information-security-quality", "text-recovery-pilot-001-result.json");
const stableIdFile = path.join(root, "data", "information-security-quality", "question-id-overrides.json");
const csvFile = path.join(root, "content", "questions", "information-security-engineer-written.csv");
const generatedFile = path.join(root, "lib", "generatedQuestions.ts");
const apply = process.argv.includes("--apply");

const plan = JSON.parse(await fs.readFile(planFile, "utf8"));
if (plan.format !== "information-security-text-recovery-plan" || plan.version !== 1) throw new Error("Unsupported recovery plan.");
if (plan.selectionLimit !== 20 || plan.items.length !== 20) throw new Error("Recovery pilot must contain exactly 20 selected questions.");
if (new Set(plan.items.map((item) => `${item.pdfPage}:${item.questionNumber}`)).size !== 20) throw new Error("Recovery plan contains duplicate selectors.");
if (plan.items.filter((item) => item.status === "verified_corrected").length + plan.items.filter((item) => item.status === "held").length !== 20) {
  throw new Error("Every selected question must be corrected or held.");
}

const originalCsv = await fs.readFile(csvFile, "utf8");
const originalGenerated = await fs.readFile(generatedFile, "utf8");
const originalStableIds = await readOptional(stableIdFile);
const rows = parseCsv(originalCsv);
const headers = rows[0];
const records = rows.slice(1).filter((row) => row.some((cell) => cell.trim())).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
const beforeQuestions = parseGeneratedQuestions(originalGenerated);
const securityBefore = beforeQuestions.filter((question) => question.certificateId === "information-security-engineer");
if (records.length !== 826 || securityBefore.length !== 826) throw new Error(`Expected 826 active security questions, found CSV=${records.length}, generated=${securityBefore.length}.`);

const existingResultSource = await readOptional(resultFile);
if (apply && existingResultSource) {
  const existingResult = JSON.parse(existingResultSource);
  if (existingResult.applied && existingResult.selectionCount === 20) {
    for (const item of existingResult.items) {
      const record = records.find((candidate) => candidate.source === item.source);
      const generated = securityBefore.find((question) => question.source === item.source);
      if (!record || !generated || generated.id !== item.questionId) throw new Error(`Previously applied recovery is inconsistent for ${item.source}.`);
      if (JSON.stringify(record) !== JSON.stringify(item.after)) throw new Error(`Previously applied row drifted for ${item.source}.`);
    }
    console.log(JSON.stringify({ selectionCount: 20, correctedCount: existingResult.correctedCount, heldCount: existingResult.heldCount, activeSecurityQuestionCount: 826, questionIdsPreserved: true, alreadyApplied: true }, null, 2));
    process.exit(0);
  }
}

const stableIds = originalStableIds ? JSON.parse(originalStableIds) : { format: "question-id-overrides", version: 1, overrides: {} };
stableIds.overrides ??= {};
const resultItems = [];

for (const item of plan.items) {
  const matches = records.filter((record) => sourceSelector(record.source, item.pdfPage, item.questionNumber));
  if (matches.length !== 1) throw new Error(`Expected one active row for PDF ${item.pdfPage} question ${item.questionNumber}; found ${matches.length}.`);
  const record = matches[0];
  const generated = securityBefore.filter((question) => question.source === record.source);
  if (generated.length !== 1) throw new Error(`Could not resolve the generated ID for ${record.source}.`);
  const before = structuredClone(record);
  const beforeChoices = [1, 2, 3, 4].map((number) => record[`choice${number}`]).filter(Boolean);

  if (item.status === "verified_corrected") {
    for (const [field, value] of Object.entries(item.after ?? {})) {
      if (!headers.includes(field)) throw new Error(`Unknown corrected field ${field}.`);
      record[field] = value;
    }
    stableIds.overrides[`${record.certificate_id}|${record.source}`] = generated[0].id;
  }

  const afterChoices = [1, 2, 3, 4].map((number) => record[`choice${number}`]).filter(Boolean);
  assertProtected(before, record, beforeChoices, afterChoices, item);
  const changedFields = headers.filter((field) => before[field] !== record[field]);
  if (item.status === "verified_corrected" && changedFields.length === 0) throw new Error(`Verified correction has no diff: ${record.source}`);
  if (item.status === "held" && changedFields.length !== 0) throw new Error(`Held question was modified: ${record.source}`);
  resultItems.push({
    pdfPage: item.pdfPage,
    questionNumber: item.questionNumber,
    status: item.status,
    errorTypes: item.errorTypes,
    holdReason: item.holdReason,
    questionId: generated[0].id,
    source: record.source,
    sourceImage: `../ocr/outputs/full_ocr/images/pdf_page_${String(item.pdfPage).padStart(4, "0")}.png`,
    changedFields,
    before,
    after: structuredClone(record)
  });
}

const result = {
  format: "information-security-text-recovery-result",
  version: 1,
  generatedAt: new Date().toISOString(),
  applied: apply,
  selectionCount: resultItems.length,
  correctedCount: resultItems.filter((item) => item.status === "verified_corrected").length,
  heldCount: resultItems.filter((item) => item.status === "held").length,
  sourceReview: {
    startedAt: plan.sourceReviewStartedAt,
    completedAt: plan.sourceReviewCompletedAt,
    elapsedSeconds: plan.sourceReviewElapsedSeconds,
    measurement: "wall-clock timestamps recorded around grouped PDF/OCR/current-bank comparison"
  },
  invariants: {
    activeSecurityQuestionCount: 826,
    protectedFields: ["certificate_id", "category", "exam_type", "source", "source_year", "correct_answer", "image_url", "image_urls"],
    choiceCountAndPositionPreserved: true,
    stableQuestionIdsRequired: true
  },
  items: resultItems
};

if (!apply) {
  console.log(JSON.stringify({ selectionCount: result.selectionCount, correctedCount: result.correctedCount, heldCount: result.heldCount, dryRun: true }, null, 2));
  process.exit(0);
}

try {
  await fs.writeFile(stableIdFile, `${JSON.stringify(stableIds, null, 2)}\n`, "utf8");
  await fs.writeFile(csvFile, stringifyCsv([headers, ...records.map((record) => headers.map((header) => record[header] ?? ""))]), "utf8");
  const generation = spawnSync(process.execPath, [path.join(root, "scripts", "generate-questions.mjs")], { cwd: root, encoding: "utf8", stdio: "pipe" });
  if (generation.status !== 0) throw new Error(`Question generation failed:\n${generation.stdout}\n${generation.stderr}`);

  const afterGeneratedSource = await fs.readFile(generatedFile, "utf8");
  const afterQuestions = parseGeneratedQuestions(afterGeneratedSource);
  const securityAfter = afterQuestions.filter((question) => question.certificateId === "information-security-engineer");
  if (securityAfter.length !== 826) throw new Error(`Security question count changed to ${securityAfter.length}.`);
  const targetSources = new Set(resultItems.map((item) => item.source));
  const beforeUntouched = beforeQuestions.filter((question) => !targetSources.has(question.source)).map(canonical).sort();
  const afterUntouched = afterQuestions.filter((question) => !targetSources.has(question.source)).map(canonical).sort();
  if (JSON.stringify(beforeUntouched) !== JSON.stringify(afterUntouched)) throw new Error("A non-target question changed.");
  for (const item of resultItems) {
    const after = securityAfter.find((question) => question.source === item.source);
    if (!after || after.id !== item.questionId) throw new Error(`Question ID changed for ${item.source}.`);
    item.afterGeneratedId = after.id;
  }
  result.csvSha256Before = sha256(originalCsv);
  result.csvSha256After = sha256(await fs.readFile(csvFile, "utf8"));
  result.generatedSha256Before = sha256(originalGenerated);
  result.generatedSha256After = sha256(afterGeneratedSource);
  await fs.writeFile(resultFile, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ selectionCount: 20, correctedCount: result.correctedCount, heldCount: result.heldCount, activeSecurityQuestionCount: securityAfter.length, questionIdsPreserved: true }, null, 2));
} catch (error) {
  await fs.writeFile(csvFile, originalCsv, "utf8");
  await fs.writeFile(generatedFile, originalGenerated, "utf8");
  if (originalStableIds === null) await fs.rm(stableIdFile, { force: true });
  else await fs.writeFile(stableIdFile, originalStableIds, "utf8");
  throw error;
}

function assertProtected(before, after, beforeChoices, afterChoices, item) {
  for (const field of ["certificate_id", "category", "exam_type", "source", "source_year", "correct_answer", "image_url", "image_urls"]) {
    if (before[field] !== after[field]) throw new Error(`Protected field ${field} changed for PDF ${item.pdfPage} question ${item.questionNumber}.`);
  }
  if (beforeChoices.length !== afterChoices.length) throw new Error(`Choice count changed for PDF ${item.pdfPage} question ${item.questionNumber}.`);
  if (beforeChoices.length !== 4 || afterChoices.some((choice) => !choice.trim())) throw new Error(`Choice structure is invalid for PDF ${item.pdfPage} question ${item.questionNumber}.`);
}

function sourceSelector(source, pdfPage, questionNumber) {
  const match = String(source).match(/PDF (\d+).*· (\d+)번/u);
  return Boolean(match && Number(match[1]) === pdfPage && Number(match[2]) === questionNumber);
}

function parseGeneratedQuestions(source) {
  const prefix = "export const generatedQuestions = JSON.parse(";
  const suffix = ") as Question[];";
  const start = source.indexOf(prefix); const end = source.lastIndexOf(suffix);
  if (start < 0 || end < 0) throw new Error("Cannot parse generated questions.");
  return JSON.parse(JSON.parse(source.slice(start + prefix.length, end)));
}

function parseCsv(source) {
  const rows = []; let row = []; let cell = ""; let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === '"' && quoted && source[index + 1] === '"') { cell += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && source[index + 1] === "\n") index += 1;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (quoted) throw new Error("CSV contains an unclosed quote.");
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function stringifyCsv(rows) {
  return `${rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/gu, '""')}"`).join(",")).join("\n")}\n`;
}

function canonical(question) { return JSON.stringify(question); }
function sha256(value) { return createHash("sha256").update(value).digest("hex"); }
async function readOptional(file) { try { return await fs.readFile(file, "utf8"); } catch (error) { if (error.code === "ENOENT") return null; throw error; } }
