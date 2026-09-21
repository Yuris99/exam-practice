import { promises as fs } from "node:fs";
import path from "node:path";
import { REVIEW_STAGES, transitionStage } from "./lib/security-review-pipeline.mjs";

const [sessionArgument, stage, action, ...detailParts] = process.argv.slice(2);
if (!sessionArgument || !REVIEW_STAGES.includes(stage) || !["start", "finish"].includes(action)) {
  console.error(`Usage: node scripts/update-security-review-session.mjs <review-session.json> <${REVIEW_STAGES.join("|")}> <start|finish> [detail]`);
  process.exit(2);
}
const sessionFile = path.resolve(sessionArgument);
const session = JSON.parse(await fs.readFile(sessionFile, "utf8"));
transitionStage(session, stage, action, detailParts.join(" "));
const temporary = `${sessionFile}.${process.pid}.tmp`;
await fs.writeFile(temporary, `${JSON.stringify(session, null, 2)}\n`, "utf8");
try {
  await fs.rename(temporary, sessionFile);
} catch (error) {
  if (!new Set(["EPERM", "EEXIST"]).has(error?.code)) throw error;
  await fs.copyFile(temporary, sessionFile);
  await fs.unlink(temporary);
}
console.log(JSON.stringify({ stage, status: session.stages[stage].status, duration_ms: session.stages[stage].duration_ms }));
