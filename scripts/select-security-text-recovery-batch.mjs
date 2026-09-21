import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inspectSecurityQuestionText } from "./lib/security-text-quality.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const limit = Number(process.argv.find((arg) => arg.startsWith("--limit="))?.slice(8) ?? 50);
const outputArg = process.argv.find((arg) => arg.startsWith("--output="))?.slice(9) ?? "data/information-security-quality/text-recovery-batch-002-plan.json";
if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw new Error("Batch limit must be between 1 and 50.");

const bankPath = path.join(root, "content", "questions", "information-security-engineer-written.csv");
const priorPath = path.join(root, "data", "information-security-quality", "text-recovery-pilot-001-result.json");
const source = await fs.readFile(bankPath, "utf8");
const [headers, ...rawRows] = parseCsv(source);
const rows = rawRows.filter((row) => row.some((cell) => cell.trim())).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
const prior = JSON.parse(await fs.readFile(priorPath, "utf8"));
const previouslyReviewed = new Set(prior.items.map((item) => item.source));
const candidateGroups = new Map();
let untraceableSourceRows = 0;
let noFindingRows = 0;

for (const row of rows) {
  if (row.certificate_id !== "information-security-engineer") continue;
  const sourceMatch = row.source.match(/PDF (\d+).*· (\d+)번/u);
  if (!sourceMatch) { untraceableSourceRows += 1; continue; }
  if (previouslyReviewed.has(row.source)) continue;
  const pdfPage = Number(sourceMatch[1]);
  const questionNumber = Number(sourceMatch[2]);
  const quality = inspectSecurityQuestionText(row);
  if (!quality.findings.length) { noFindingRows += 1; continue; }
  const issueTypes = quality.findings.map((finding) => finding.code);
  const score = issueTypes.reduce((sum, code) => sum + ({
    broken_glyph_candidate: 10,
    flattened_table_candidate: 8,
    line_break_split_candidate: 5,
    hangul_spacing_candidate: 3,
    joined_punctuation_candidate: 2
  }[code] ?? 0), 0);
  const pageGroup = candidateGroups.get(pdfPage) ?? [];
  pageGroup.push({ row, pdfPage, questionNumber, issueTypes, score });
  candidateGroups.set(pdfPage, pageGroup);
}

const rankedPages = [...candidateGroups.entries()].map(([pdfPage, items]) => ({
  pdfPage,
  items: items.sort((a, b) => b.score - a.score || a.questionNumber - b.questionNumber),
  rankScore: items.slice(0, 6).reduce((sum, item) => sum + item.score, 0)
})).sort((a, b) => b.rankScore - a.rankScore || b.items.length - a.items.length || a.pdfPage - b.pdfPage);

const selected = [];
for (const page of rankedPages) {
  for (const item of page.items.slice(0, 6)) {
    if (selected.length >= limit) break;
    selected.push(item);
  }
  if (selected.length >= limit) break;
}
if (selected.length !== limit) throw new Error(`Only ${selected.length} eligible traceable quality candidates; expected ${limit}.`);

const plan = {
  format: "information-security-text-recovery-batch-plan",
  version: 1,
  batchNumber: 2,
  selectionLimit: limit,
  generatedAt: new Date().toISOString(),
  sourcePdfSha256: "332f9ce3f1aaaebe2b4d728796c9cfb6415126a2d95257fccc90bace02647623",
  activeQuestionCount: rows.length,
  selectionMethod: "Quality audit finding candidates ranked by glyph/table/line-split/spacing signals; source pages grouped and capped at six questions per page.",
  excluded: {
    previouslyReviewedSources: previouslyReviewed.size,
    untraceableSourceRows,
    resolutionConflictSource: "2026 수제비 정보보안기사 필기 기본서 · 지피지기 기출문제 · PDF 39쪽 · 10번",
    resolutionConflictExcluded: true
  },
  selected: selected.map(({ row, pdfPage, questionNumber, issueTypes, score }) => ({
    pdfPage,
    questionNumber,
    status: "pending_source_review",
    candidateIssueTypes: issueTypes,
    auditScore: score,
    source: row.source,
    sourceImage: `../ocr/outputs/full_ocr/images/pdf_page_${String(pdfPage).padStart(4, "0")}.png`,
    beforeSha256: sha256(JSON.stringify(row)),
    before: row,
    after: null,
    holdReason: null
  }))
};

const output = path.resolve(root, outputArg);
await fs.writeFile(output, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  selected: selected.length,
  pages: [...new Set(selected.map((item) => item.pdfPage))].length,
  pageQuestionCounts: Object.fromEntries([...new Set(selected.map((item) => item.pdfPage))].sort((a, b) => a - b).map((page) => [page, selected.filter((item) => item.pdfPage === page).length])),
  excludedPreviouslyReviewed: previouslyReviewed.size,
  excludedUntraceableSourceRows: untraceableSourceRows,
  issueTypeCounts: Object.fromEntries([...new Set(selected.flatMap((item) => item.issueTypes))].map((code) => [code, selected.filter((item) => item.issueTypes.includes(code)).length]))
}, null, 2));

function parseCsv(input) {
  const rows = []; let row = []; let cell = ""; let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (char === '"' && quoted && input[index + 1] === '"') { cell += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && input[index + 1] === "\n") index += 1;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (quoted) throw new Error("CSV contains an unclosed quote.");
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function sha256(value) { return createHash("sha256").update(value).digest("hex"); }
