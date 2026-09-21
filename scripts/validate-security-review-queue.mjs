import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv, validateReviewQueue } from "./lib/security-review-pipeline.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const extractionDirectory = path.join(root, "data", "information-security-extraction");
const queue = JSON.parse(await fs.readFile(path.join(extractionDirectory, "manual-review.json"), "utf8"));
const csv = parseCsv(await fs.readFile(path.join(extractionDirectory, "manual-review.csv"), "utf8"));
const bank = parseCsv(await fs.readFile(path.join(root, "content", "questions", "information-security-engineer-written.csv"), "utf8"));
const registrationManifest = await readOptionalJson(path.join(extractionDirectory, "registration-manifest.json"));
const recoveryBatch = await readOptionalJson(path.join(extractionDirectory, "recovery-batch-001.json"));
const result = validateReviewQueue({ queue, csv, bankRows: bank.rows, registrationManifest, recoveryBatch });
const includeSamples = process.argv.includes("--details");

console.log(JSON.stringify({
  ok: result.ok,
  duration_ms: result.duration_ms,
  counts: result.counts,
  reconciliation: result.reconciliation,
  privacy_scan: result.privacy_scan,
  structural_review_counts: result.structural_review_counts,
  errors: result.errors,
  warnings: result.warnings,
  ...(includeSamples ? { samples: result.samples } : {})
}, null, 2));
if (!result.ok) process.exitCode = 1;

async function readOptionalJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}
