import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imageRoot = path.resolve(process.env.SECURITY_OCR_IMAGE_DIR ?? path.join(root, "..", "ocr", "outputs", "full_ocr", "images"));
const outputRoot = path.resolve(process.env.SECURITY_REVIEW_SHEETS_DIR ?? path.join(root, "data", "information-security-extraction", "answer-review-sheets"));
const arg = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index < 0 ? fallback : process.argv[index + 1];
};
const fromPage = Number(arg("--from", "1"));
const toPage = Number(arg("--to", "1204"));
const pagesPerSheet = Number(arg("--pages-per-sheet", "8"));
const scale = Math.max(1, Number(arg("--scale", "1")) || 1);
const explicitPages = arg("--pages", "").split(",").map(Number).filter((page) => Number.isInteger(page) && page >= 1 && page <= 1204);
const questionOnly = process.argv.includes("--question-pages-only");
const missingAnswerOnly = process.argv.includes("--missing-answer-pages-only");
const answerFooterOnly = process.argv.includes("--answer-footer-pages-only");
const eventFile = path.join(root, "data", "information-security-extraction", "pages.jsonl");

let selectedPages = explicitPages.length ? explicitPages : Array.from({ length: Math.max(0, toPage - fromPage + 1) }, (_, i) => fromPage + i);
if (questionOnly || missingAnswerOnly) {
  const events = (await fs.readFile(eventFile, "utf8")).split(/\r?\n/u).filter(Boolean).map(JSON.parse);
  const questionPages = new Set(events.filter((event) => event.question_section && event.detected_question_starts.length > 0 && (!missingAnswerOnly || event.question_start_without_answer_key.length > 0) && (!answerFooterOnly || (event.answer_footer_label && event.answer_footer_question_numbers?.length > 0))).map((event) => event.pdf_page_number));
  selectedPages = selectedPages.filter((page) => questionPages.has(page));
}

await fs.mkdir(outputRoot, { recursive: true });
let sheetCount = 0;
const sheetManifest = [];
for (let offset = 0; offset < selectedPages.length; offset += pagesPerSheet) {
  const group = selectedPages.slice(offset, offset + pagesPerSheet);
  sheetManifest.push({ sheet: sheetCount + 1, pages: group });
  const rows = [];
  for (const pdfPage of group) {
    const pageLabel = `PDF ${String(pdfPage).padStart(4, "0")}`;
    const label = Buffer.from(`<svg width="126" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="126" height="150" fill="#eef2ff"/><text x="8" y="78" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="#111827">${pageLabel}</text></svg>`);
    const crop = await sharp(path.join(imageRoot, `pdf_page_${String(pdfPage).padStart(4, "0")}.png`))
      .extract({ left: 180, top: 2570, width: 900, height: 150 })
      .png()
      .toBuffer();
    rows.push(await sharp({ create: { width: 1026, height: 150, channels: 4, background: "#ffffff" } })
      .composite([{ input: label, left: 0, top: 0 }, { input: crop, left: 126, top: 0 }])
      .resize({ width: 1026 * scale, height: 150 * scale })
      .png()
      .toBuffer());
  }
  const sheetPath = path.join(outputRoot, `answer-review-${String(++sheetCount).padStart(3, "0")}.png`);
  await sharp({ create: { width: 1026 * scale, height: 150 * scale * rows.length, channels: 4, background: "#ffffff" } })
    .composite(rows.map((input, index) => ({ input, left: 0, top: 150 * scale * index })))
    .png()
    .toFile(sheetPath);
  console.log(`${path.basename(sheetPath)}  pages ${group[0]}-${group.at(-1)} (${rows.length})`);
}
await fs.writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify({ from_pdf_page: fromPage, to_pdf_page: toPage, pages_per_sheet: pagesPerSheet, scale, sheets: sheetManifest }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ page_count: selectedPages.length, pages_per_sheet: pagesPerSheet, scale, sheet_count: sheetCount, output: outputRoot }));
