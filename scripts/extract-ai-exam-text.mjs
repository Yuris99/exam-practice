import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputDirectory = path.join(root, "data", "AI시험");
const outputDirectory = path.join(root, ".tmp", "ai-exam-text");

await fs.mkdir(outputDirectory, { recursive: true });
const filenames = (await fs.readdir(inputDirectory))
  .filter((name) => name.toLowerCase().endsWith(".pdf"))
  .sort((a, b) => a.localeCompare(b, "ko"));

for (const filename of filenames) {
  const data = new Uint8Array(await fs.readFile(path.join(inputDirectory, filename)));
  const document = await pdfjs.getDocument({ data, disableWorker: true }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const lines = groupLines(content.items);
    pages.push(`\n===== PAGE ${pageNumber} =====\n${lines.join("\n")}`);
  }
  const outputName = filename.replace(/\.pdf$/i, ".txt");
  await fs.writeFile(path.join(outputDirectory, outputName), pages.join("\n"), "utf8");
  console.log(`${filename}: ${document.numPages} pages`);
}

function groupLines(items) {
  const lines = [];
  for (const item of items) {
    const text = item.str.trim();
    if (!text) continue;
    const y = Math.round(item.transform[5]);
    let line = lines.find((candidate) => Math.abs(candidate.y - y) <= 2);
    if (!line) {
      line = { y, chunks: [] };
      lines.push(line);
    }
    line.chunks.push({ x: item.transform[4], text });
  }
  return lines
    .sort((a, b) => b.y - a.y)
    .map((line) => line.chunks.sort((a, b) => a.x - b.x).map((chunk) => chunk.text).join(" "));
}
