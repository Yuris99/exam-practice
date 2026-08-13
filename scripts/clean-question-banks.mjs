import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const directory = path.join(root, "content", "questions");
const filenames = [
  "computer-system-engineer-written.csv",
  "embedded-engineer-written.csv",
  "information-processing-engineer-written.csv",
  "information-security-engineer-written.csv"
];

for (const filename of filenames) {
  const file = path.join(directory, filename);
  const source = (await fs.readFile(file, "utf8")).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const rows = parseCsv(source);
  const headers = rows[0];
  const column = Object.fromEntries(headers.map((header, index) => [header.trim(), index]));
  const kept = [headers];
  const removed = [];
  const seen = new Set();
  for (const row of rows.slice(1)) {
    if (row.every((cell) => !cell.trim())) continue;
    for (let index = 0; index < row.length; index += 1) row[index] = repairKnownTypos(row[index]);
    const choices = [1, 2, 3, 4].map((number) => row[column[`choice${number}`]]?.trim()).filter(Boolean);
    const normalized = choices.map(normalize);
    const images = [row[column.image_url], ...(row[column.image_urls] ?? "").split("|")].map((value) => value?.trim()).filter(Boolean);
    const missingImages = [];
    for (const image of images) {
      try { await fs.access(path.join(root, "public", image.replace(/^\/+/, ""))); }
      catch { missingImages.push(image); }
    }
    const prompt = row[column.prompt] ?? "";
    const duplicateKey = `${normalize(prompt)}:${normalize(row[column.reference_text] ?? "")}:${images.join("|")}`;
    if (new Set(normalized).size !== normalized.length || missingImages.length || /문제\s*(?:복원\s*)?오류/.test(prompt) || /실제\s*시험장에서는\s*모두\s*정답/.test(prompt) || seen.has(duplicateKey)) {
      removed.push(row[column.source] || row[column.prompt]?.slice(0, 80));
      continue;
    }
    seen.add(duplicateKey);
    kept.push(row);
  }
  await fs.writeFile(file, `\uFEFF${kept.map((row) => row.map(csvCell).join(",")).join("\n")}\n`, "utf8");
  console.log(`${filename}: kept ${kept.length - 1}, removed ${removed.length}`);
  for (const item of removed) console.log(`- ${item}`);
}

function normalize(value) { return value.normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase("ko-KR"); }
function repairKnownTypos(value) {
  return value
    .replaceAll("산술식 연삭", "산술식 연산")
    .replaceAll("100MHz일 EO", "100MHz일 때")
    .replaceAll("Associatinve", "Associative")
    .replaceAll("Solid State Druve", "Solid State Drive")
    .replaceAll("memory adress register", "memory address register")
    .replaceAll("adress line", "address line")
    .replaceAll("TLC 년 08 월 16 일 필기 기출문제", "TLC")
    .replace(/(?:정보보안기사|전자계산기(?:조직응용)?기사|컴퓨터시스템기사)?\s*년\s*\d{2}\s*월\s*\d{2}\s*일\s*필기\s*기출문제/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
function csvCell(value) { const text = String(value ?? ""); return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }
function parseCsv(source) {
  const rows = []; let row = []; let cell = ""; let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === '"' && quoted && source[index + 1] === '"') { cell += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if (char === "\n" && !quoted) { row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += char;
  }
  if (quoted) throw new Error("CSV contains an unclosed quote");
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
