import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetCsv = path.join(root, "content", "questions", "information-security-engineer-written.csv");
const generatedFile = path.join(root, "lib", "generatedQuestions.ts");
const readyFile = path.join(root, "data", "information-security-extraction", "ready-questions.csv");
const candidateFile = path.join(root, "data", "information-security-extraction", "all-candidates.json");
const answerMapFile = path.join(root, "data", "information-security-extraction", "manual-answer-keys-book.json");
const registrationManifestFile = path.join(root, "data", "information-security-extraction", "registration-manifest.json");
const pilotFile = path.resolve(root, "..", "Folio", "artifacts", "question-bank-pilot", "2025-1-questions-001-020.json");
const bankCertificateId = "information-security-engineer";

const originalCsv = await fs.readFile(targetCsv, "utf8");
const originalGenerated = await fs.readFile(generatedFile, "utf8");
const readyRows = parseCsv(await fs.readFile(readyFile, "utf8"));
const candidates = JSON.parse(await fs.readFile(candidateFile, "utf8"));
const answerMap = JSON.parse(await fs.readFile(answerMapFile, "utf8"));
const pilot = JSON.parse(await fs.readFile(pilotFile, "utf8"));
const existingRows = parseCsv(originalCsv);
let previousRegistration = null;
try {
  previousRegistration = JSON.parse(await fs.readFile(registrationManifestFile, "utf8"));
} catch {
  previousRegistration = null;
}

if (pilot.format !== "folio-question-bank-staging" || pilot.registrationStatus !== "not-registered" || pilot.questions?.length !== 20) {
  throw new Error("The approved 20-question pilot JSON is missing, changed, or already registered.");
}
if (answerMap.source_pdf_sha256 !== "332f9ce3f1aaaebe2b4d728796c9cfb6415126a2d95257fccc90bace02647623") {
  throw new Error("The manual answer map does not match the read-only source PDF.");
}
if (readyRows.length !== 748 || candidates.length !== 1846) {
  throw new Error(`Unexpected extraction counts: ready CSV rows=${readyRows.length - 1}, candidate records=${candidates.length}.`);
}

const headers = existingRows[0].map((header) => header.trim());
const readyHeaders = readyRows[0].map((header) => header.trim());
if (JSON.stringify(headers) !== JSON.stringify(readyHeaders)) throw new Error("Pilot CSV and extracted CSV headers do not match exactly.");
if (!headers.includes("certificate_id")) throw new Error("Target CSV does not identify its certificate explicitly.");

const certificateIndex = headers.indexOf("certificate_id");
const typeIndex = headers.indexOf("exam_type");
const promptIndex = headers.indexOf("prompt");
const referenceIndex = headers.indexOf("reference_text");
const imageIndex = headers.indexOf("image_url");
const sourceIndex = headers.indexOf("source");
const answerIndex = headers.indexOf("correct_answer");
const choiceIndexes = [1, 2, 3, 4].map((number) => headers.indexOf(`choice${number}`));
const currentData = existingRows.slice(1).filter((row) => row.some((cell) => cell.trim()));
const newData = readyRows.slice(1).filter((row) => row.some((cell) => cell.trim()));

if (currentData.some((row) => row[certificateIndex] !== bankCertificateId)) throw new Error("Active question CSV contains a different certificate; refusing to overwrite it.");
if (newData.some((row) => row[certificateIndex] !== bankCertificateId)) throw new Error("Ready extraction CSV contains a different certificate.");
if (newData.some((row) => !row[promptIndex]?.trim() || !/^[1-4]$/.test(row[answerIndex] ?? "") || choiceIndexes.some((index) => !row[index]?.trim()))) {
  throw new Error("Ready extraction CSV contains a missing prompt, choice, or answer.");
}

let pilotRows;
if (currentData.length === 20) {
  pilotRows = currentData;
} else {
  const previousCsvWasRegisteredByThisScript = previousRegistration
    && previousRegistration.registeredCount === currentData.length
    && previousRegistration.csvSha256 === sha256(originalCsv)
    && previousRegistration.reusedPilotCount === 20;
  if (!previousCsvWasRegisteredByThisScript) throw new Error(`Active CSV has ${currentData.length} rows and is not the verified pilot or a previously registered snapshot from this script.`);
  pilotRows = currentData.filter((row) => /2025년 1회 (?:[1-9]|1\d|20)번/u.test(row[sourceIndex] ?? ""));
  if (pilotRows.length !== 20 || currentData.length - pilotRows.length !== previousRegistration.readyExtractionCount) {
    throw new Error("The active registered snapshot does not contain exactly the reusable pilot and previously imported extraction rows.");
  }
}

if (pilotRows.length !== 20 || pilotRows.some((row) => row[certificateIndex] !== bankCertificateId)) {
  throw new Error("Could not identify the exact 20-question pilot for reuse.");
}
const combined = [...pilotRows, ...newData];
const duplicateOwners = new Map();
for (const [index, row] of combined.entries()) {
  const key = [row[certificateIndex], row[typeIndex], row[promptIndex], row[referenceIndex], row[imageIndex]]
    .map(normalize).join("|");
  if (duplicateOwners.has(key)) throw new Error(`Duplicate import key between rows ${duplicateOwners.get(key)} and ${index + 1}.`);
  duplicateOwners.set(key, index + 1);
}

const beforeQuestions = parseGeneratedQuestions(originalGenerated);
const beforeOtherCertificates = canonicalize(beforeQuestions.filter((question) => question.certificateId !== bankCertificateId));
const expectedSecurityCount = combined.length;
const timestamp = new Date().toISOString().replace(/[-:]/gu, "").replace(/\.\d{3}Z$/u, "Z");
const backupDirectory = path.join(root, "backups", `information-security-full-replacement-${timestamp}`);
await fs.mkdir(backupDirectory, { recursive: false });
await fs.copyFile(targetCsv, path.join(backupDirectory, path.basename(targetCsv)));
await fs.copyFile(generatedFile, path.join(backupDirectory, path.basename(generatedFile)));
const backupManifest = {
  createdAt: new Date().toISOString(),
  reason: "Pre-replacement backup of the active information-security CSV and generated question-bank snapshot.",
  activeCsvRows: currentData.length,
  generatedQuestionCountsByCertificate: countByCertificate(beforeQuestions),
  files: {
    [path.basename(targetCsv)]: sha256(originalCsv),
    [path.basename(generatedFile)]: sha256(originalGenerated)
  }
};
await fs.writeFile(path.join(backupDirectory, "manifest.json"), `${JSON.stringify(backupManifest, null, 2)}\n`, "utf8");

let csvChanged = false;
try {
  const newCsv = stringifyCsv([existingRows[0], ...combined]);
  const tempCsv = `${targetCsv}.replacement.tmp`;
  await fs.writeFile(tempCsv, newCsv, "utf8");
  await fs.rename(tempCsv, targetCsv);
  csvChanged = true;

  const generation = spawnSync(process.execPath, [path.join(root, "scripts", "generate-questions.mjs")], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe"
  });
  if (generation.status !== 0) throw new Error(`Question generator failed:\n${generation.stdout}\n${generation.stderr}`);

  const generated = await fs.readFile(generatedFile, "utf8");
  const afterQuestions = parseGeneratedQuestions(generated);
  const afterOtherCertificates = canonicalize(afterQuestions.filter((question) => question.certificateId !== bankCertificateId));
  if (JSON.stringify(afterOtherCertificates) !== JSON.stringify(beforeOtherCertificates)) {
    throw new Error("Generated records for other certificates changed; rolling back.");
  }
  const afterSecurityCount = afterQuestions.filter((question) => question.certificateId === bankCertificateId).length;
  if (afterSecurityCount !== expectedSecurityCount) throw new Error(`Expected ${expectedSecurityCount} information-security questions; generator produced ${afterSecurityCount}.`);

  const reviewCount = candidates.filter((candidate) => candidate.review_required).length;
  const registrationManifest = {
    createdAt: new Date().toISOString(),
    sourcePdfSha256: answerMap.source_pdf_sha256,
    extractionCandidateCount: candidates.length,
    readyExtractionCount: newData.length,
    reusedPilotCount: pilotRows.length,
    replacedActiveRowCount: currentData.length,
    registeredCount: afterSecurityCount,
    heldForManualReview: reviewCount,
    duplicateReadyRowsSkipped: 0,
    backupDirectory: path.relative(root, backupDirectory).replace(/\\/gu, "/"),
    otherCertificateCountsBeforeAndAfter: {
      before: countByCertificate(beforeQuestions, bankCertificateId),
      after: countByCertificate(afterQuestions, bankCertificateId)
    },
    csvSha256: sha256(newCsv),
    generatedQuestionsSha256: sha256(generated)
  };
  await fs.writeFile(path.join(root, "data", "information-security-extraction", "registration-manifest.json"), `${JSON.stringify(registrationManifest, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({
    activeCsv: path.relative(root, targetCsv),
    backupDirectory: registrationManifest.backupDirectory,
    pilotReused: pilotRows.length,
    readyRowsAdded: newData.length,
    registeredInformationSecurityQuestions: afterSecurityCount,
    heldForManualReview: reviewCount,
    otherCertificateCountsUnchanged: true,
    generator: generation.stdout.trim()
  }, null, 2));
} catch (error) {
  if (csvChanged) {
    await fs.copyFile(path.join(backupDirectory, path.basename(targetCsv)), targetCsv);
    await fs.copyFile(path.join(backupDirectory, path.basename(generatedFile)), generatedFile);
  }
  throw error;
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

function normalize(value) {
  return String(value ?? "").normalize("NFKC").replace(/\s+/gu, " ").trim().toLocaleLowerCase("ko-KR");
}

function parseGeneratedQuestions(source) {
  const prefix = "export const generatedQuestions = JSON.parse(";
  const suffix = ") as Question[];";
  const start = source.indexOf(prefix);
  const end = source.lastIndexOf(suffix);
  if (start < 0 || end < 0) throw new Error("Cannot parse the generated question-bank snapshot.");
  const jsonStringLiteral = source.slice(start + prefix.length, end);
  return JSON.parse(JSON.parse(jsonStringLiteral));
}

function canonicalize(questions) {
  return questions.map((question) => JSON.stringify(question)).sort();
}

function countByCertificate(questions, omitCertificateId) {
  const counts = {};
  for (const question of questions) {
    if (question.certificateId === omitCertificateId) continue;
    counts[question.certificateId] = (counts[question.certificateId] ?? 0) + 1;
  }
  return counts;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}
