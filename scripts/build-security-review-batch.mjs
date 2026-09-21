import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { performance } from "node:perf_hooks";
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import {
  createReviewSession,
  elapsed,
  parseCsv,
  recordCompletedStage,
  selectPageClusteredBatch,
  validateReviewQueue
} from "./lib/security-review-pipeline.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDirectory = path.join(root, "data", "information-security-extraction");
const ocrRoot = path.resolve(root, "..", "ocr", "outputs", "full_ocr");
const options = parseArguments(process.argv.slice(2));
if (!options.batchId) throw new Error("--batch-id is required so an existing batch cannot be overwritten accidentally.");
const outputRoot = options.output
  ? path.resolve(options.output)
  : path.join(os.tmpdir(), `information-security-review-${options.batchId}`);

const loadStarted = performance.now();
const [queue, queueCsv, bankCsv, registrationManifest, recoveryBatch] = await Promise.all([
  readJson(path.join(dataDirectory, "manual-review.json")),
  fs.readFile(path.join(dataDirectory, "manual-review.csv"), "utf8").then(parseCsv),
  fs.readFile(path.join(root, "content", "questions", "information-security-engineer-written.csv"), "utf8").then(parseCsv),
  readOptionalJson(path.join(dataDirectory, "registration-manifest.json")),
  readOptionalJson(path.join(dataDirectory, "recovery-batch-001.json"))
]);
const queueLoadMs = elapsed(loadStarted);

const validation = validateReviewQueue({ queue, csv: queueCsv, bankRows: bankCsv.rows, registrationManifest, recoveryBatch });
if (!validation.ok) throw new Error(`Review queue integrity check failed: ${validation.errors.join("; ")}`);

const transformStarted = performance.now();
const selection = selectPageClusteredBatch(queue, options.size, bankCsv.rows);
if (selection.selected.length !== options.size) throw new Error(`Expected ${options.size} eligible candidates, found ${selection.selected.length}.`);
const selected = selection.selected.sort((left, right) => Number(left.item.source_page_pdf) - Number(right.item.source_page_pdf) || Number(left.item.question_number) - Number(right.item.question_number));
const transformationMs = elapsed(transformStarted);

const ocrStarted = performance.now();
const ocrPages = new Map();
const neededOcrPages = new Set(selected.flatMap(({ item }) => [item.source_page_pdf, item.answer_key_source_pdf_page ?? item.source_page_pdf]));
await Promise.all([...neededOcrPages].map(async (pageNumber) => {
  ocrPages.set(pageNumber, await readJson(path.join(ocrRoot, "json", `page_${String(pageNumber).padStart(4, "0")}.json`)));
}));
const ocrLoadingMs = elapsed(ocrStarted);

const imageStarted = performance.now();
const imageBuffers = new Map();
await Promise.all([...neededOcrPages].map(async (pageNumber) => {
  imageBuffers.set(pageNumber, await fs.readFile(path.join(ocrRoot, "images", `pdf_page_${String(pageNumber).padStart(4, "0")}.png`)));
}));
await fs.mkdir(outputRoot, { recursive: false });

const manifest = [];
const cardBuffers = [];
for (const [index, entry] of selected.entries()) {
  const candidate = entry.item;
  const questionPage = ocrPages.get(candidate.source_page_pdf);
  const answerPageNumber = candidate.answer_key_source_pdf_page ?? candidate.source_page_pdf;
  const answerPage = ocrPages.get(answerPageNumber);
  const questionRegion = findQuestionRegion(questionPage, candidate);
  const answerRegion = findAnswerRegion(answerPage);
  const card = await makeCandidateCard({
    candidate,
    index: index + 1,
    group: entry.group,
    questionRegion,
    answerRegion,
    questionBuffer: imageBuffers.get(candidate.source_page_pdf),
    answerBuffer: imageBuffers.get(answerPageNumber)
  });
  const filename = `candidate-${String(index + 1).padStart(3, "0")}.png`;
  await fs.writeFile(path.join(outputRoot, filename), card);
  cardBuffers.push(card);
  manifest.push({
    batch_index: index + 1,
    selection_group: entry.group,
    source_key: candidate.source_key,
    source_page_pdf: candidate.source_page_pdf,
    answer_key_source_pdf_page: candidate.answer_key_source_pdf_page ?? null,
    question_number: candidate.question_number,
    source_section: candidate.source_section,
    source_type: candidate.source_type,
    subject: candidate.subject,
    year: candidate.exam_year,
    session: candidate.exam_session,
    review_reasons: candidate.review_reasons,
    answer_choice_number: candidate.answer_choice_number,
    answer_verification: candidate.answer_verification ?? null,
    confidence: candidate.minimum_ocr_confidence,
    question_image_crop: questionRegion !== null,
    answer_image_crop: answerRegion.source,
    crop_file: filename
  });
}

const sheets = [];
for (let index = 0; index < cardBuffers.length; index += 4) {
  const buffers = cardBuffers.slice(index, index + 4);
  const metadata = await Promise.all(buffers.map((buffer) => sharp(buffer).metadata()));
  const cellWidth = 1000;
  const cellHeight = Math.max(...metadata.map((item) => item.height));
  const rowCount = Math.ceil(buffers.length / 2);
  const sheet = await sharp({ create: { width: cellWidth * 2, height: cellHeight * rowCount, channels: 4, background: "#e4e8ee" } })
    .composite(buffers.map((input, cell) => ({ input, left: cellWidth * (cell % 2), top: cellHeight * Math.floor(cell / 2) })))
    .png().toBuffer();
  const sheetName = `${options.batchId}-${String(sheets.length + 1).padStart(2, "0")}.png`;
  await fs.writeFile(path.join(outputRoot, sheetName), sheet);
  sheets.push({ file: sheetName, first_batch_index: index + 1, last_batch_index: index + buffers.length });
}
const imageExtractionMs = elapsed(imageStarted);

const selectedReasons = countValues(manifest.flatMap((entry) => entry.review_reasons));
const selectedGroups = countValues(manifest.map((entry) => entry.selection_group));
const selectedSubjects = countValues(manifest.map((entry) => entry.subject || "미분류"));
const manifestByPage = new Map();
for (const entry of manifest) {
  if (!manifestByPage.has(entry.source_page_pdf)) manifestByPage.set(entry.source_page_pdf, []);
  manifestByPage.get(entry.source_page_pdf).push(entry);
}
const pageGroups = [...manifestByPage.entries()].map(([page, entries]) => ({
  source_page_pdf: page,
  candidate_indexes: entries.map((entry) => entry.batch_index),
  question_numbers: entries.map((entry) => entry.question_number)
}));
const manifestDocument = {
  schema_version: 2,
  batch_id: options.batchId,
  queue_count: queue.length,
  batch_count: manifest.length,
  source_page_count: selection.source_page_count,
  excluded_already_registered: selection.excluded_already_registered,
  selectedGroups,
  selectedSubjects,
  selectedReasons,
  page_groups: pageGroups,
  candidates: manifest,
  sheets
};
await fs.writeFile(path.join(outputRoot, "selection-manifest.json"), `${JSON.stringify(manifestDocument, null, 2)}\n`, "utf8");

const session = createReviewSession(options.batchId);
recordCompletedStage(session, "validation", validation.duration_ms, "queue/CSV/bank integrity and structural pre-validation");
recordCompletedStage(session, "ocr_data_loading", ocrLoadingMs, `${neededOcrPages.size} unique OCR page(s); queue source loading ${queueLoadMs} ms`);
recordCompletedStage(session, "image_extraction", imageExtractionMs, `${neededOcrPages.size} unique source image(s), ${manifest.length} candidate card(s)`);
recordCompletedStage(session, "data_transformation", transformationMs, "page-clustered candidate selection and manifest transformation");
session.context = {
  queue_count: queue.length,
  batch_count: manifest.length,
  unique_question_pages: selection.source_page_count,
  unique_loaded_pages: neededOcrPages.size,
  queue_source_loading_ms: queueLoadMs
};
await fs.writeFile(path.join(outputRoot, "review-session.json"), `${JSON.stringify(session, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  batch_id: options.batchId,
  queue_count: queue.length,
  batch_count: manifest.length,
  source_page_count: selection.source_page_count,
  loaded_page_count: neededOcrPages.size,
  sheet_count: sheets.length,
  timings_ms: {
    queue_source_loading: queueLoadMs,
    validation: validation.duration_ms,
    data_transformation: transformationMs,
    ocr_data_loading: ocrLoadingMs,
    image_extraction: imageExtractionMs
  },
  output: outputRoot
}));

function parseArguments(argumentsList) {
  const result = { batchId: "", size: 100, output: "" };
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--batch-id") result.batchId = argumentsList[++index] ?? "";
    else if (argument === "--size") result.size = Number(argumentsList[++index]);
    else if (argument === "--output") result.output = argumentsList[++index] ?? "";
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (!Number.isInteger(result.size) || result.size < 1) throw new Error("--size must be a positive integer.");
  if (result.batchId && !/^[a-z0-9][a-z0-9-]*$/u.test(result.batchId)) throw new Error("--batch-id must contain only lowercase letters, numbers, and hyphens.");
  return result;
}

function findQuestionRegion(page, candidate) {
  const maxY = page.image_height_px * 0.84;
  const starts = [];
  for (const column of ["left", "right"]) {
    const items = page.items.filter((item) => item.column === column && item.bbox_xyxy[1] > 150 && item.bbox_xyxy[1] < maxY)
      .sort((left, right) => left.reading_order - right.reading_order);
    for (let position = 0; position < items.length; position += 1) {
      const item = items[position];
      const text = String(item.text ?? "").trim();
      const x = item.bbox_xyxy[0];
      if (column === "left" ? x > 300 : x < 1000 || x > 1190) continue;
      const inline = text.match(/^\s*(\d{1,3})\s*(.*)$/u);
      if (inline && Number(inline[1]) === candidate.question_number && inline[2].length >= 4 && !/^년/u.test(inline[2]) && !/^[①②③④]/u.test(inline[2])) {
        starts.push({ item, column, readingOrder: item.reading_order });
      } else if (/^\d{1,3}$/u.test(text) && Number(text) === candidate.question_number) {
        const next = items[position + 1];
        if (next && Math.abs(next.bbox_xyxy[1] - item.bbox_xyxy[1]) < 110) starts.push({ item, column, readingOrder: item.reading_order });
      }
    }
  }
  const matches = starts.map((start) => {
    const sameColumn = page.items.filter((item) => item.column === start.column && item.reading_order >= start.readingOrder && item.bbox_xyxy[1] < maxY)
      .sort((left, right) => left.reading_order - right.reading_order);
    const nextStart = starts.filter((next) => next.column === start.column && next.readingOrder > start.readingOrder)
      .sort((left, right) => left.readingOrder - right.readingOrder)[0];
    const block = sameColumn.filter((item) => !nextStart || item.reading_order < nextStart.readingOrder);
    const joined = compactText(block.map((item) => item.text).join(" "));
    const stem = compactText(candidate.row?.prompt).slice(0, 90);
    const overlap = stem ? [...stem].filter((character) => joined.includes(character)).length / stem.length : 0;
    return { ...start, block, overlap };
  }).sort((left, right) => right.overlap - left.overlap);
  const best = matches[0];
  if (!best || best.overlap < 0.1) return null;
  const columnItems = best.block.filter((item) => item.bbox_xyxy[3] > best.item.bbox_xyxy[1] - 35 && item.bbox_xyxy[1] < maxY);
  if (!columnItems.length) return null;
  const xMin = best.column === "left" ? 80 : Math.floor(page.image_width_px / 2);
  const xMax = best.column === "left" ? Math.floor(page.image_width_px / 2) : page.image_width_px - 80;
  const top = Math.max(0, Math.floor(Math.min(...columnItems.map((item) => item.bbox_xyxy[1])) - 38));
  const bottom = Math.min(Math.floor(maxY), Math.ceil(Math.max(...columnItems.map((item) => item.bbox_xyxy[3])) + 80));
  return { left: xMin, top, width: xMax - xMin, height: Math.max(100, bottom - top), overlap: best.overlap };
}

function findAnswerRegion(page) {
  const candidates = page.items.filter((item) => item.bbox_xyxy[1] >= page.image_height_px * 0.78 && item.bbox_xyxy[3] <= page.image_height_px * 0.99);
  if (!candidates.length) {
    return { left: 0, top: Math.floor(page.image_height_px * 0.84), width: page.image_width_px, height: Math.max(30, Math.floor(page.image_height_px * 0.11)), source: "fixed_footer_fallback" };
  }
  const top = Math.max(0, Math.floor(Math.min(...candidates.map((item) => item.bbox_xyxy[1])) - 24));
  const bottom = Math.min(page.image_height_px, Math.ceil(Math.max(...candidates.map((item) => item.bbox_xyxy[3])) + 24));
  return { left: 0, top, width: page.image_width_px, height: Math.max(30, bottom - top), source: "ocr_footer_bounds" };
}

async function makeCandidateCard({ candidate, index, group, questionRegion, answerRegion, questionBuffer, answerBuffer }) {
  const questionMetadata = await sharp(questionBuffer).metadata();
  const cropBox = questionRegion ?? { left: 60, top: 150, width: Math.floor(questionMetadata.width * 0.45), height: Math.floor(questionMetadata.height * 0.7) };
  const questionCrop = await sharp(questionBuffer).extract(clampRegion(cropBox, questionMetadata)).resize({ width: 940, withoutEnlargement: true }).png().toBuffer();
  const answerMetadata = await sharp(answerBuffer).metadata();
  const answerCrop = await sharp(answerBuffer).extract(clampRegion(answerRegion, answerMetadata)).resize({ width: 940, withoutEnlargement: true }).png().toBuffer();
  const [questionCropMetadata, answerCropMetadata] = await Promise.all([sharp(questionCrop).metadata(), sharp(answerCrop).metadata()]);
  const head = `${String(index).padStart(3, "0")} · PDF ${candidate.source_page_pdf} · Q${candidate.question_number} · ${candidate.subject || "subject unknown"} · answer ${candidate.answer_choice_number ?? "?"} · ${group}`;
  const reasonText = (candidate.review_reasons ?? []).join(", ").slice(0, 150);
  const header = Buffer.from(`<svg width="960" height="56"><rect width="100%" height="100%" fill="#fff"/><text x="10" y="23" font-size="16" font-family="Arial">${escapeXml(head)}</text><text x="10" y="45" font-size="12" font-family="Arial" fill="#555">${escapeXml(reasonText)}</text></svg>`);
  return sharp({ create: { width: 960, height: 56 + questionCropMetadata.height + answerCropMetadata.height + 12, channels: 4, background: "#fff" } })
    .composite([
      { input: header, left: 0, top: 0 },
      { input: questionCrop, left: 10, top: 56 },
      { input: answerCrop, left: 10, top: 60 + questionCropMetadata.height }
    ]).png().toBuffer();
}

function clampRegion(region, metadata) {
  const left = Math.max(0, Math.min(Math.floor(region.left), metadata.width - 1));
  const top = Math.max(0, Math.min(Math.floor(region.top), metadata.height - 1));
  return {
    left,
    top,
    width: Math.max(1, Math.min(Math.floor(region.width), metadata.width - left)),
    height: Math.max(1, Math.min(Math.floor(region.height), metadata.height - top))
  };
}

function compactText(value) {
  return String(value ?? "").normalize("NFKC").toLocaleLowerCase("ko-KR").replace(/\s+/gu, "").replace(/[^\p{L}\p{N}]/gu, "");
}

function escapeXml(value) {
  return String(value).replace(/&/gu, "&amp;").replace(/</gu, "&lt;").replace(/>/gu, "&gt;").replace(/"/gu, "&quot;").replace(/'/gu, "&apos;");
}

function countValues(values) {
  const result = {};
  for (const value of values) result[value] = (result[value] ?? 0) + 1;
  return result;
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

async function readOptionalJson(file) {
  try {
    return await readJson(file);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}
