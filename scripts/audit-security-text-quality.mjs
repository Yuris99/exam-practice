import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inspectSecurityQuestionText, summarizeSecurityTextQuality } from "./lib/security-text-quality.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.resolve(root, process.argv[2] ?? "content/questions/information-security-engineer-written.csv");
const outputArgument = process.argv.find((argument) => argument.startsWith("--output="));
const rows = parseCsv(await fs.readFile(input, "utf8"));
const [headers, ...data] = rows;
const records = data.filter((row) => row.some((cell) => cell.trim())).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
const results = records.map((row) => ({ source: row.source, ...inspectSecurityQuestionText(row) }));

if (outputArgument) {
  const output = path.resolve(root, outputArgument.slice("--output=".length));
  const summary = summarizeSecurityTextQuality(records);
  const compactResults = results.filter((result) => result.findings.length).map((result) => ({
    source: result.source,
    status: result.status,
    reasons: result.findings.map((finding) => finding.code),
    fields: [...new Set(result.findings.flatMap((finding) => finding.fields))]
  }));
  await fs.writeFile(output, `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    input: path.relative(root, input).replace(/\\/gu, "/"),
    summary,
    interpretation: "candidate_review and source_review_required are triage states, not confirmed errors; no automatic text replacement is authorized.",
    falsePositiveExamples: ["개인정보보호관리체계 같은 정상 복합 전문용어", "문법적으로 정상인 의존 명사와 조사", "코드·명령어·경로·수식 안의 의도된 공백과 기호"],
    results: compactResults
  }, null, 2)}\n`, "utf8");
}
console.log(JSON.stringify(summarizeSecurityTextQuality(records), null, 2));

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
