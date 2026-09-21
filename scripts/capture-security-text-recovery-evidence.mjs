import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const project = path.resolve(root, "..");
const ocrRoot = path.resolve(project, "ocr", "outputs", "full_ocr");
const planFile = path.join(root, "data", "information-security-quality", "text-recovery-batch-002-plan.json");
const extractionFile = path.join(root, "data", "information-security-extraction", "all-candidates.json");
const outputFile = path.join(root, "data", "information-security-quality", "text-recovery-batch-002-ocr-evidence.json");
const plan = JSON.parse(await fs.readFile(planFile, "utf8"));
const extraction = JSON.parse(await fs.readFile(extractionFile, "utf8"));
const pages = new Map();

for (const item of plan.selected) {
  let page = pages.get(item.pdfPage);
  if (!page) {
    const padded = String(item.pdfPage).padStart(4, "0");
    const jsonText = await fs.readFile(path.join(ocrRoot, "json", `page_${padded}.json`), "utf8");
    const json = JSON.parse(jsonText);
    const txt = await fs.readFile(path.join(ocrRoot, "txt", `page_${padded}.txt`), "utf8");
    page = { json, txt };
    pages.set(item.pdfPage, page);
  }
  const pageQuestionNumbers = extraction.filter((candidate) => candidate.source_page_pdf === item.pdfPage).map((candidate) => candidate.question_number);
  const regions = collectQuestionRegion(page.json, item.questionNumber, pageQuestionNumbers);
  const plainTextExcerpt = findTextExcerpt(page.txt, item.questionNumber);
  const sourceCandidate = extraction.filter((candidate) => candidate.source_page_pdf === item.pdfPage && candidate.question_number === item.questionNumber);
  const extractionRows = sourceCandidate.map((candidate) => ({
    sourceKey: candidate.source_key,
    reviewReasons: candidate.review_reasons,
    manualVisualCorrection: candidate.manual_visual_corrections ?? null,
    row: candidate.row
  }));
  item.ocrEvidence = {
    pageWidth: page.json.image_width_px,
    pageHeight: page.json.image_height_px,
    regionItemCount: regions.items.length,
    bboxXYXY: regions.bbox,
    meanConfidence: regions.meanConfidence,
    minimumConfidence: regions.minimumConfidence,
    jsonText: regions.text.slice(0, 1200),
    txtExcerpt: plainTextExcerpt.slice(0, 800),
    extractionMatchCount: sourceCandidate.length,
    extractedRowSnapshots: extractionRows
  };
}

const evidence = {
  format: "information-security-text-recovery-ocr-evidence",
  version: 1,
  capturedAt: new Date().toISOString(),
  sourcePdfSha256: plan.sourcePdfSha256,
  sourceDirectories: { json: "../ocr/outputs/full_ocr/json", txt: "../ocr/outputs/full_ocr/txt", images: "../ocr/outputs/full_ocr/images" },
  selectedCount: plan.selected.length,
  groupedPdfPageCount: pages.size,
  items: plan.selected.map(({ pdfPage, questionNumber, source, candidateIssueTypes, ocrEvidence }) => ({ pdfPage, questionNumber, source, candidateIssueTypes, ocrEvidence }))
};
await fs.writeFile(outputFile, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  selectedQuestions: evidence.selectedCount,
  groupedPages: evidence.groupedPdfPageCount,
  withOcrCoordinateRegions: evidence.items.filter((item) => item.ocrEvidence.regionItemCount).length,
  withExtractionMatch: evidence.items.filter((item) => item.ocrEvidence.extractionMatchCount === 1).length,
  withMultipleOrMissingExtractionMatches: evidence.items.filter((item) => item.ocrEvidence.extractionMatchCount !== 1).length,
  items: evidence.items.map((item) => ({ page: item.pdfPage, q: item.questionNumber, regions: item.ocrEvidence.regionItemCount, minConfidence: item.ocrEvidence.minimumConfidence, extractedRows: item.ocrEvidence.extractionMatchCount, manualCorrection: item.ocrEvidence.extractedRowSnapshots.some((row) => row.manualVisualCorrection) }))
}, null, 2));

function collectQuestionRegion(page, questionNumber, pageQuestionNumbers) {
  const isHeader = (text, allowedNumbers) => {
    const match = String(text).match(/^\s*0?(\d{1,3})(?!\d)\s*[\p{L}(]/u);
    return Boolean(match && allowedNumbers.includes(Number(match[1])));
  };
  const headers = page.items.filter((item) => isHeader(item.text, [questionNumber]));
  const header = headers.sort((a, b) => a.reading_order - b.reading_order)[0];
  if (!header) return { items: [], bbox: null, meanConfidence: null, minimumConfidence: null, text: "" };
  const [left, top] = header.bbox_xyxy;
  const column = header.column;
  const nextHeader = page.items.filter((item) => {
    const [itemLeft, itemTop] = item.bbox_xyxy;
    return isHeader(item.text, pageQuestionNumbers) && itemTop > top && sameColumn(item, header, page.image_width_px);
  }).sort((a, b) => a.bbox_xyxy[1] - b.bbox_xyxy[1])[0];
  const bottom = nextHeader ? nextHeader.bbox_xyxy[1] : page.image_height_px * 0.94;
  const items = page.items.filter((item) => {
    const [, itemTop] = item.bbox_xyxy;
    return itemTop >= top && itemTop < bottom && sameColumn(item, header, page.image_width_px);
  }).sort((a, b) => a.bbox_xyxy[1] - b.bbox_xyxy[1] || a.bbox_xyxy[0] - b.bbox_xyxy[0]);
  const boxes = items.map((item) => item.bbox_xyxy);
  const scores = items.map((item) => item.score).filter(Number.isFinite);
  const bbox = boxes.length ? [
    Math.min(...boxes.map((box) => box[0])), Math.min(...boxes.map((box) => box[1])),
    Math.max(...boxes.map((box) => box[2])), Math.max(...boxes.map((box) => box[3]))
  ] : null;
  return {
    items,
    bbox,
    meanConfidence: scores.length ? Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(4)) : null,
    minimumConfidence: scores.length ? Number(Math.min(...scores).toFixed(4)) : null,
    text: items.map((item) => item.text).join(" ")
  };
}

function sameColumn(item, header, width) {
  if (item.column && header.column) return item.column === header.column;
  return item.bbox_xyxy[0] < width / 2 === (header.bbox_xyxy[0] < width / 2);
}

function findTextExcerpt(text, questionNumber) {
  const expression = new RegExp(`(?:^|\\n)\\s*0?${questionNumber}(?!\\d)\\s*[\\p{L}(]`, "u");
  const match = expression.exec(text);
  if (!match) return "";
  const start = match.index + match[0].length;
  return text.slice(start, start + 800).replace(/\s+/gu, " ").trim();
}
