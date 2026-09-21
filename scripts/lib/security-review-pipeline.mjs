import { performance } from "node:perf_hooks";

export const REVIEW_STAGES = [
  "ocr_data_loading",
  "image_extraction",
  "ai_review",
  "data_transformation",
  "validation",
  "registration_and_deployment"
];

export const REVIEW_GROUPS = [
  ["visual_or_table_review", (item) => hasReason(item, "visual_or_table_review")],
  ["duplicate_review", (item) => reasons(item).some((reason) => reason.startsWith("duplicate_prompt_"))],
  ["answer_key_not_recognized", (item) => hasReason(item, "answer_key_not_recognized")],
  ["choice_structure", (item) => reasons(item).some((reason) => /^(?:choice_count_|choice_number_sequence|choice_text_missing|duplicate_choices)/u.test(reason))],
  ["low_confidence_question_region", (item) => reasons(item).some((reason) => reason.startsWith("low_confidence_"))],
  ["past_exam_year_not_recognized", (item) => hasReason(item, "past_exam_year_not_recognized")],
  ["numeric_code_or_special_visual_review", (item) => hasReason(item, "numeric_code_or_special_visual_review")],
  ["other_review_reason", () => true]
];

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else value += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") {
      row.push(value);
      value = "";
    } else if (character === "\n") {
      row.push(value.replace(/\r$/u, ""));
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
      value = "";
    } else value += character;
  }
  if (quoted) throw new Error("CSV has an unterminated quoted field.");
  if (value !== "" || row.length > 0) {
    row.push(value.replace(/\r$/u, ""));
    if (row.some((cell) => cell !== "")) rows.push(row);
  }
  const headers = rows.shift() ?? [];
  return {
    headers,
    rows: rows.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])))
  };
}

export function normalizeText(value) {
  return String(value ?? "").normalize("NFKC").toLocaleLowerCase("ko-KR").replace(/\s+/gu, "").replace(/[^\p{L}\p{N}]/gu, "");
}

export function questionFingerprint(itemOrRow) {
  const row = itemOrRow?.row ?? itemOrRow ?? {};
  const parts = [row.prompt, row.choice1, row.choice2, row.choice3, row.choice4].map(normalizeText);
  if (parts[0].length < 8 || parts.slice(1).some((part) => part.length === 0)) return "";
  return parts.join("|");
}

export function validateReviewQueue({ queue, csv, bankRows, registrationManifest, recoveryBatch }) {
  const started = performance.now();
  const errors = [];
  const warnings = [];
  const structural = {};
  const csvMismatches = [];
  const headers = csv.headers;

  if (queue.length !== csv.rows.length) errors.push(`manual-review JSON/CSV row count mismatch: ${queue.length} vs ${csv.rows.length}`);
  const rowCount = Math.min(queue.length, csv.rows.length);
  for (let index = 0; index < rowCount; index += 1) {
    const expected = queue[index]?.row ?? {};
    const actual = csv.rows[index];
    const mismatched = headers.filter((header) => String(expected[header] ?? "") !== String(actual[header] ?? ""));
    if (mismatched.length && csvMismatches.length < 20) csvMismatches.push({ index: index + 1, source_key: queue[index]?.source_key, fields: mismatched });
  }
  if (csvMismatches.length) errors.push(`manual-review JSON/CSV content mismatch in at least ${csvMismatches.length} row(s)`);

  const sourceKeys = countBy(queue, (item) => item.source_key);
  const contentHashes = countBy(queue.filter((item) => item.content_hash), (item) => item.content_hash);
  const queueFingerprints = countBy(queue, questionFingerprint);
  const bankFingerprints = new Set(bankRows.map(questionFingerprint).filter(Boolean));
  const bankSourceFingerprints = new Set(bankRows.map(bankSourceFingerprint).filter(Boolean));
  const exactBankMatches = queue.filter((item) => {
    const content = questionFingerprint(item);
    return content && bankFingerprints.has(content);
  }).map((item) => item.source_key);
  const sourceBankCollisions = queue.filter((item) => bankSourceFingerprints.has(queueSourceFingerprint(item))).map((item) => item.source_key);
  const bankMatches = [...new Set([...exactBankMatches, ...sourceBankCollisions])];
  const duplicateSourceKeys = duplicateKeys(sourceKeys);
  const duplicateContentHashes = duplicateKeys(contentHashes);
  const duplicateFingerprints = duplicateKeys(queueFingerprints);
  if (duplicateSourceKeys.length) warnings.push(`${duplicateSourceKeys.length} duplicate source_key group(s) require version review`);
  if (exactBankMatches.length) warnings.push(`${exactBankMatches.length} review queue row(s) exactly match active bank content and will be skipped`);
  if (sourceBankCollisions.length) warnings.push(`${sourceBankCollisions.length} review queue row(s) share a PDF page/question identity with active bank and will be skipped`);
  if (duplicateContentHashes.length) warnings.push(`${duplicateContentHashes.length} duplicate content_hash group(s) require version review`);
  if (duplicateFingerprints.length) warnings.push(`${duplicateFingerprints.length} duplicate prompt/choice group(s) require version review`);

  for (const item of queue) {
    const row = item.row ?? {};
    const choiceValues = [row.choice1, row.choice2, row.choice3, row.choice4].filter((choice) => String(choice ?? "").trim() !== "");
    const normalizedChoices = choiceValues.map(normalizeText).filter(Boolean);
    if (!Number.isInteger(item.source_page_pdf) || item.source_page_pdf < 1) increment(structural, "invalid_source_page");
    if (!Number.isInteger(item.question_number) || item.question_number < 1) increment(structural, "invalid_question_number");
    if (!String(row.prompt ?? "").trim()) increment(structural, "missing_prompt");
    if (choiceValues.length !== 4) increment(structural, `choice_count_${choiceValues.length}`);
    if (new Set(normalizedChoices).size !== normalizedChoices.length) increment(structural, "duplicate_choices");
    const answer = Number(row.correct_answer || item.answer_choice_number);
    if (!Number.isInteger(answer) || answer < 1 || answer > 4) increment(structural, "answer_out_of_range_or_missing");
    if (!item.review_required) increment(structural, "review_required_false");
    if (!reasons(item).length) increment(structural, "missing_review_reason");
  }

  const extracted = Number(registrationManifest?.extractionCandidateCount ?? recoveryBatch?.source_candidate_count ?? 0);
  const inferredPilot = Number(recoveryBatch?.active_information_security_before ?? 0)
    + Number(recoveryBatch?.manual_review_before ?? 0)
    - extracted;
  const reusedPilot = Number(registrationManifest?.reusedPilotCount ?? (inferredPilot > 0 ? inferredPilot : 0));
  const excludedDuplicates = Number(recoveryBatch?.already_registered_duplicate_count ?? 0);
  const expectedInventory = extracted + reusedPilot;
  const accountedInventory = bankRows.length + queue.length + excludedDuplicates;
  const reconciliation = {
    extraction_candidates: extracted || null,
    reused_pilot: reusedPilot || null,
    active_bank: bankRows.length,
    review_queue: queue.length,
    excluded_registered_duplicates: excludedDuplicates,
    expected_inventory: expectedInventory || null,
    accounted_inventory: accountedInventory,
    difference: expectedInventory ? accountedInventory - expectedInventory : null
  };
  if (reconciliation.difference !== null && reconciliation.difference !== 0) errors.push(`inventory reconciliation difference: ${reconciliation.difference}`);

  return {
    ok: errors.length === 0,
    duration_ms: elapsed(started),
    counts: {
      queue_json: queue.length,
      queue_csv: csv.rows.length,
      active_bank: bankRows.length,
      duplicate_source_key_groups: duplicateSourceKeys.length,
      duplicate_content_hash_groups: duplicateContentHashes.length,
      duplicate_prompt_choice_groups: duplicateFingerprints.length,
      queue_rows_already_in_bank: bankMatches.length,
      exact_bank_content_matches: exactBankMatches.length,
      source_identity_bank_collisions: sourceBankCollisions.length,
      csv_mismatch_samples: csvMismatches.length
    },
    structural_review_counts: sortObject(structural),
    reconciliation,
    privacy_scan: scanPrivacy(queue),
    errors,
    warnings,
    samples: {
      csv_mismatches: csvMismatches,
      bank_matches: bankMatches.slice(0, 20),
      duplicate_source_keys: duplicateSourceKeys.slice(0, 20)
    }
  };
}

export function selectPageClusteredBatch(queue, size, bankRows = []) {
  if (!Number.isInteger(size) || size < 1) throw new Error("Batch size must be a positive integer.");
  const bankFingerprints = new Set(bankRows.map(questionFingerprint).filter(Boolean));
  const bankSourceFingerprints = new Set(bankRows.map(bankSourceFingerprint).filter(Boolean));
  const eligible = queue.filter((item) => {
    const content = questionFingerprint(item);
    const alreadyRegistered = (content && bankFingerprints.has(content)) || bankSourceFingerprints.has(queueSourceFingerprint(item));
    return item.review_required && !alreadyRegistered;
  });
  const pages = new Map();
  for (const item of eligible) {
    const page = Number(item.source_page_pdf);
    if (!pages.has(page)) pages.set(page, []);
    pages.get(page).push(item);
  }
  for (const items of pages.values()) items.sort(candidateOrder);

  const selected = [];
  const selectedKeys = new Set();
  const uncoveredGroups = new Set(REVIEW_GROUPS.slice(0, -1).map(([name]) => name));
  while (selected.length < Math.min(size, eligible.length)) {
    const candidates = [...pages.entries()].filter(([, items]) => items.some((item) => !selectedKeys.has(item.source_key)));
    if (!candidates.length) break;
    candidates.sort((left, right) => pageScore(right, selectedKeys, uncoveredGroups) - pageScore(left, selectedKeys, uncoveredGroups) || left[0] - right[0]);
    const [, pageItems] = candidates[0];
    for (const item of pageItems) {
      if (selected.length >= size || selectedKeys.has(item.source_key)) continue;
      const group = classifyReviewGroup(item);
      selected.push({ item, group });
      selectedKeys.add(item.source_key);
      uncoveredGroups.delete(group);
    }
  }
  return {
    selected,
    excluded_already_registered: queue.length - eligible.length,
    source_page_count: new Set(selected.map(({ item }) => item.source_page_pdf)).size
  };
}

export function classifyReviewGroup(item) {
  return REVIEW_GROUPS.find(([, predicate]) => predicate(item))?.[0] ?? "other_review_reason";
}

export function createReviewSession(batchId) {
  return {
    schema_version: 1,
    batch_id: batchId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    stages: Object.fromEntries(REVIEW_STAGES.map((stage) => [stage, { status: "not_started", duration_ms: null, runs: [] }]))
  };
}

export function recordCompletedStage(session, stage, durationMs, detail = "") {
  assertStage(stage);
  const now = new Date().toISOString();
  const entry = session.stages[stage];
  entry.status = "completed";
  entry.duration_ms = Math.round((entry.duration_ms ?? 0) + durationMs);
  entry.runs.push({ started_at: null, finished_at: now, duration_ms: Math.round(durationMs), detail });
  session.updated_at = now;
  return session;
}

export function transitionStage(session, stage, action, detail = "") {
  assertStage(stage);
  const now = new Date().toISOString();
  const entry = session.stages[stage];
  if (action === "start") {
    if (entry.active_started_at) throw new Error(`${stage} is already running.`);
    entry.status = "running";
    entry.active_started_at = now;
  } else if (action === "finish") {
    if (!entry.active_started_at) throw new Error(`${stage} has not been started.`);
    const duration = Math.max(0, Date.parse(now) - Date.parse(entry.active_started_at));
    entry.runs.push({ started_at: entry.active_started_at, finished_at: now, duration_ms: duration, detail });
    entry.duration_ms = (entry.duration_ms ?? 0) + duration;
    entry.status = "completed";
    delete entry.active_started_at;
  } else throw new Error(`Unknown action: ${action}`);
  session.updated_at = now;
  return session;
}

export function elapsed(started) {
  return Math.round(performance.now() - started);
}

function assertStage(stage) {
  if (!REVIEW_STAGES.includes(stage)) throw new Error(`Unknown stage ${stage}. Expected one of: ${REVIEW_STAGES.join(", ")}`);
}

function hasReason(item, reason) {
  return reasons(item).includes(reason);
}

function reasons(item) {
  return Array.isArray(item.review_reasons) ? item.review_reasons : [];
}

function candidateOrder(left, right) {
  return Number(left.question_number) - Number(right.question_number) || String(left.source_key).localeCompare(String(right.source_key), "ko");
}

function pageScore([, items], selectedKeys, uncoveredGroups) {
  const remaining = items.filter((item) => !selectedKeys.has(item.source_key));
  const newGroups = new Set(remaining.map(classifyReviewGroup).filter((group) => uncoveredGroups.has(group))).size;
  return newGroups * 1000 + remaining.length;
}

function countBy(items, keyFunction) {
  const counts = new Map();
  for (const item of items) {
    const key = keyFunction(item);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function queueSourceFingerprint(item) {
  const page = Number(item?.source_page_pdf);
  const question = Number(item?.question_number);
  return Number.isInteger(page) && Number.isInteger(question) ? `${page}:${question}` : "";
}

function bankSourceFingerprint(row) {
  const source = String(row?.source ?? "");
  const match = source.match(/PDF\s*(\d+)쪽[^\n]*?\b(\d+)번/u);
  return match ? `${Number(match[1])}:${Number(match[2])}` : "";
}

function duplicateKeys(counts) {
  return [...counts.entries()].filter(([, count]) => count > 1).map(([key, count]) => ({ key, count }));
}

function scanPrivacy(queue) {
  const text = JSON.stringify(queue);
  const keyNames = new Set();
  const visit = (value) => {
    if (Array.isArray(value)) for (const item of value) visit(item);
    else if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) {
        if (/^(?:password|passwd|secret|access_?token|refresh_?token|api_?key|private_?key|email|phone|address)$/iu.test(key)) keyNames.add(key);
        visit(child);
      }
    }
  };
  visit(queue);
  return {
    credential_or_personal_field_names: [...keyNames].sort(),
    local_user_path_occurrences: (text.match(/(?:[A-Z]:\\Users\\|\/Users\/|\/home\/)[^\s"\\/]+/giu) ?? []).length,
    workspace_user_path_occurrences: (text.match(/(?:[A-Z]:\\Users\\mose1\b|\/Users\/mose1\b|\/home\/mose1\b)/giu) ?? []).length,
    secret_token_pattern_occurrences: (text.match(/(?:sk-[A-Za-z0-9_-]{20,}|gh[opusr]_[A-Za-z0-9]{20,})/gu) ?? []).length
  };
}

function increment(target, key) {
  target[key] = (target[key] ?? 0) + 1;
}

function sortObject(value) {
  return Object.fromEntries(Object.entries(value).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0])));
}
