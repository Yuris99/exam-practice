import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ocrRoot = path.resolve(process.env.SECURITY_OCR_ROOT ?? path.join(root, "..", "ocr", "outputs", "full_ocr"));
const outputDirectory = path.resolve(process.env.SECURITY_EXTRACTION_DIR ?? path.join(root, "data", "information-security-extraction"));
const resume = process.argv.includes("--resume");
const totalPages = 1204;
const categoryBySubject = {
  1: "시스템 보안",
  2: "네트워크 보안",
  3: "어플리케이션 보안",
  4: "정보보안 일반",
  5: "정보보안 관리 및 법규"
};
const circles = new Map([["①", 1], ["②", 2], ["③", 3], ["④", 4]]);
const pageProgressPath = path.join(outputDirectory, "pages.jsonl");
const questionProgressPath = path.join(outputDirectory, "questions.jsonl");
const progressPath = path.join(outputDirectory, "progress.json");

await fs.mkdir(outputDirectory, { recursive: true });

let lastPage = 0;
let activeSection = null;
let activeCategory = null;
let questions = [];
if (resume) {
  try {
    const saved = JSON.parse(await fs.readFile(progressPath, "utf8"));
    lastPage = Number(saved.lastCompletedPdfPage) || 0;
    activeSection = saved.activeSection ?? null;
    activeCategory = saved.activeCategory ?? null;
    questions = await readJsonLines(questionProgressPath);
    questions = questions.filter((question) => question.source_page_pdf <= lastPage);
    await fs.writeFile(questionProgressPath, questions.map((question) => JSON.stringify(question)).join("\n") + (questions.length ? "\n" : ""), "utf8");
    const committedPages = (await readJsonLines(pageProgressPath)).filter((event) => event.pdf_page_number <= lastPage);
    await fs.writeFile(pageProgressPath, committedPages.map((event) => JSON.stringify(event)).join("\n") + (committedPages.length ? "\n" : ""), "utf8");
  } catch {
    lastPage = 0;
  }
} else {
  await fs.writeFile(pageProgressPath, "", "utf8");
  await fs.writeFile(questionProgressPath, "", "utf8");
}

const reviewQueue = await readJsonLines(path.join(outputDirectory, "manual-review-inputs.jsonl"));
const reviewByPage = new Map(reviewQueue.map((entry) => [entry.pdf_page_number, entry]));

for (let pdfPage = 1; pdfPage <= totalPages; pdfPage += 1) {
  const jsonPath = path.join(ocrRoot, "json", `page_${String(pdfPage).padStart(4, "0")}.json`);
  const page = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  const pageItems = Array.isArray(page.items) ? page.items : [];
  const pageMean = mean(pageItems.map((item) => Number(item.score)).filter(Number.isFinite));
  const hasAnswerFooter = containsAnswerFooter(page);
  const answerKey = parseAnswerKey(page);
  const answerFooterNumbers = parseAnswerFooterQuestionNumbers(page);
  const starts = detectQuestionStarts(page);
  const foundSection = detectSectionStart(page, starts.length > 0);
  const detectedCategory = findCategory(page);

  if (foundSection) activeSection = foundSection;
  if (detectedCategory) activeCategory = detectedCategory;

  if (pdfPage <= lastPage) continue;

  const isOfficial2025 = pdfPage >= 1100 && pdfPage <= 1195;
  const section = isOfficial2025
    ? officialSection(pdfPage)
    : page.pdf_page_number < 1098 && starts.length > 0 && activeSection
      ? activeSection
      : null;
  const category = isOfficial2025 ? null : detectedCategory ?? activeCategory;
  const blocks = section ? buildQuestionBlocks(page, starts, section, category, answerKey, pageMean) : [];

  for (const question of blocks) {
    if (isOfficial2025 && question.exam_session === 1 && question.question_number <= 20) continue;
    questions.push(question);
    await fs.appendFile(questionProgressPath, `${JSON.stringify(question)}\n`, "utf8");
  }

  const pageEvent = {
    pdf_page_number: pdfPage,
    question_section: section?.section ?? null,
    question_type: section?.type ?? null,
    answer_footer_label: hasAnswerFooter,
    answer_key_questions: answerKey.size,
    answer_key_question_numbers: [...answerKey.keys()].sort((a, b) => a - b),
    answer_footer_question_numbers: answerFooterNumbers,
    detected_question_starts: starts.map((item) => item.question_number),
    answer_key_without_question_start: [...answerKey.keys()].filter((number) => !starts.some((start) => start.question_number === number)),
    question_start_without_answer_key: starts.map((item) => item.question_number).filter((number) => !answerKey.has(number)),
    extracted_questions: blocks.length,
    mean_ocr_confidence: pageMean,
    manual_review_page: reviewByPage.has(pdfPage)
  };
  await fs.appendFile(pageProgressPath, `${JSON.stringify(pageEvent)}\n`, "utf8");

  const checkpoint = {
    format: "information-security-textbook-extraction-progress",
    version: 1,
    source_pdf: page.source_pdf,
    source_pdf_sha256: "332f9ce3f1aaaebe2b4d728796c9cfb6415126a2d95257fccc90bace02647623",
    total_pdf_pages: totalPages,
    lastCompletedPdfPage: pdfPage,
    activeSection,
    activeCategory,
    extractedQuestionCount: questions.length,
    updatedAt: new Date().toISOString()
  };
  await writeJsonAtomic(progressPath, checkpoint);
}

await applyVisualQuestionCorrections(questions);
await applyVisualAnswerKeys(questions);
const resolved = resolveDuplicates(questions);
await writeJsonAtomic(path.join(outputDirectory, "all-candidates.json"), resolved.candidates);
await writeJsonAtomic(path.join(outputDirectory, "ready-questions.json"), resolved.ready);
await writeJsonAtomic(path.join(outputDirectory, "manual-review.json"), resolved.review);
await writeCsv(path.join(outputDirectory, "ready-questions.csv"), resolved.ready.map((question) => question.row));
await writeCsv(path.join(outputDirectory, "manual-review.csv"), resolved.review.map((question) => question.row));
await writeJsonAtomic(path.join(outputDirectory, "summary.json"), makeSummary(resolved, questions));

console.log(JSON.stringify(makeSummary(resolved, questions), null, 2));

function detectSectionStart(page, hasQuestionContent) {
  if (!hasQuestionContent || page.pdf_page_number < 19 || page.pdf_page_number > 1097) return null;
  const top = page.items
    .filter((item) => ["left", "right"].includes(item.column) && item.bbox_xyxy[1] < 500)
    .map((item) => compact(item.text))
    .join(" ");
  if (top.includes("천기누설") && top.includes("예상문제")) return { section: "천기누설 예상문제", type: "expected" };
  if (top.includes("지피지기") && top.includes("기출문제")) return { section: "지피지기 기출문제", type: "past" };
  return null;
}

function officialSection(pdfPage) {
  if (pdfPage <= 1131) return { section: "백전백승 기출문제", type: "official", year: 2025, session: 1 };
  if (pdfPage <= 1163) return { section: "백전백승 기출문제", type: "official", year: 2025, session: 2 };
  return { section: "백전백승 기출문제", type: "official", year: 2025, session: 4 };
}

function detectQuestionStarts(page) {
  const result = [];
  const maxY = page.image_height_px * 0.84;
  for (const column of ["left", "right"]) {
    const items = page.items
      .filter((item) => item.column === column && item.bbox_xyxy[1] > 150 && item.bbox_xyxy[1] < maxY)
      .sort((a, b) => a.reading_order - b.reading_order);
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const text = String(item.text ?? "").trim();
      const x = item.bbox_xyxy[0];
      if (column === "left" ? x > 300 : x < 1000 || x > 1190) continue;
      const inline = text.match(/^\s*(\d{1,3})\s*(.*)$/u);
      if (inline && inline[2].length >= 4 && !/^년/u.test(inline[2]) && !/^[①②③④]/u.test(inline[2])) {
        const number = Number(inline[1]);
        if (number >= 1 && number <= 100 && plausibleStem(inline[2])) {
          result.push({ index: item.reading_order, item, column, question_number: number, prefix_in_item: true });
          continue;
        }
      }
      if (/^\d{1,3}$/u.test(text)) {
        const number = Number(text);
        const next = items[index + 1];
        const yGap = next ? Math.abs(next.bbox_xyxy[1] - item.bbox_xyxy[1]) : Infinity;
        if (number >= 1 && number <= 100 && next && yGap < 110 && (plausibleStem(String(next.text ?? "")) || /^[①②③④]/u.test(String(next.text ?? "").trim()))) {
          result.push({ index: item.reading_order, item, column, question_number: number, prefix_in_item: false });
        }
      }
    }
  }
  return result.sort((a, b) => a.index - b.index);
}

function plausibleStem(text) {
  const value = String(text).trim();
  if (value.length < 5 || /^(?:정답|해설|기출문제|예상문제|지피지기|천기누설)/u.test(value)) return false;
  if (/^\d{1,3}년/u.test(value)) return false;
  return /^[가-힣A-Za-z0-9"'“‘([{<]/u.test(value);
}

function containsAnswerFooter(page) {
  return page.items.some((item) => {
    const y = item.bbox_xyxy[1];
    return y > page.image_height_px * 0.84 && y < page.image_height_px * 0.94 && compact(item.text) === "정답";
  });
}

function parseAnswerKey(page) {
  const answerItems = page.items
    .filter((item) => {
      const y = item.bbox_xyxy[1];
      return y > page.image_height_px * 0.84 && y < page.image_height_px * 0.94;
    })
    .sort((a, b) => a.bbox_xyxy[0] - b.bbox_xyxy[0]);
  if (!containsAnswerFooter(page)) return new Map();

  const result = new Map();
  let pendingNumber = null;
  for (const item of answerItems) {
    const text = String(item.text ?? "").trim();
    if (!text || compact(text) === "정답" || /^\d+-\d+$/u.test(text)) continue;
    const combined = [...text.matchAll(/(\d{1,3})\s*([①②③④])/gu)];
    if (combined.length) {
      for (const match of combined) result.set(Number(match[1]), circles.get(match[2]));
      pendingNumber = null;
      continue;
    }
    if (/^\d{1,3}$/u.test(text)) {
      pendingNumber = Number(text);
      continue;
    }
    if (pendingNumber !== null && circles.has(text)) {
      result.set(pendingNumber, circles.get(text));
      pendingNumber = null;
    }
  }
  return result;
}

function parseAnswerFooterQuestionNumbers(page) {
  const footerItems = page.items
    .filter((item) => item.bbox_xyxy[1] > page.image_height_px * 0.84 && item.bbox_xyxy[1] < page.image_height_px * 0.94)
    .sort((a, b) => a.bbox_xyxy[0] - b.bbox_xyxy[0]);
  const result = [];
  for (const item of footerItems) {
    if (compact(item.text) === "정답") continue;
    for (const match of String(item.text ?? "").matchAll(/\d{2,3}/gu)) {
      const number = Number(match[0]);
      if (number >= 1 && number <= 100) result.push(number);
    }
  }
  return [...new Set(result)];
}

function findCategory(page) {
  const allText = page.items.map((item) => String(item.text ?? "")).join(" ");
  const footerText = page.items
    .filter((item) => item.bbox_xyxy[1] > page.image_height_px * 0.84)
    .map((item) => compact(item.text))
    .join(" ");
  const match = footerText.match(/([1-5])과목/u) ?? allText.match(/([1-5])과목/u);
  return match ? categoryBySubject[Number(match[1])] : null;
}

function buildQuestionBlocks(page, starts, section, pageCategory, answerKey, pageMean) {
  const result = [];
  for (const column of ["left", "right"]) {
    const columnStarts = starts.filter((start) => start.column === column).sort((a, b) => a.index - b.index);
    const items = page.items
      .filter((item) => item.column === column && item.bbox_xyxy[1] > 150 && item.bbox_xyxy[1] < page.image_height_px * 0.84)
      .sort((a, b) => a.reading_order - b.reading_order);
    for (let position = 0; position < columnStarts.length; position += 1) {
      const start = columnStarts[position];
      const nextStart = columnStarts[position + 1];
      const blockItems = items.filter((item) => item.reading_order >= start.index && (!nextStart || item.reading_order < nextStart.index));
      const question = parseQuestionBlock(page, blockItems, start, section, pageCategory, answerKey, pageMean, items);
      result.push(question);
    }
  }
  return result.sort((a, b) => a.source_page_pdf - b.source_page_pdf || a.question_number - b.question_number);
}

function parseQuestionBlock(page, items, start, section, pageCategory, answerKey, pageMean, pageColumnItems) {
  const reasons = [];
  let state = "stem";
  let stemParts = [];
  let explanationParts = [];
  const choices = [];
  let currentChoice = null;
  const relevantScores = [];

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    let text = String(item.text ?? "").trim();
    if (!text) continue;
    if (Number.isFinite(Number(item.score))) relevantScores.push(Number(item.score));
    if (index === 0) {
      if (start.prefix_in_item) text = text.replace(/^\s*\d{1,3}\s*/u, "");
      else if (/^\d{1,3}$/u.test(text)) continue;
    }
    if (compact(text).startsWith("해설")) {
      state = "explanation";
      text = text.replace(/^해설\s*/u, "").trim();
      if (text) explanationParts.push(text);
      continue;
    }
    if (state === "explanation") {
      explanationParts.push(text);
      continue;
    }

    const markers = [...text.matchAll(/[①②③④]/gu)];
    if (markers.length) {
      let cursor = 0;
      for (const marker of markers) {
        const before = text.slice(cursor, marker.index).trim();
        if (before) {
          if (state === "stem") stemParts.push(before);
          else if (currentChoice) currentChoice.parts.push(before);
        }
        const markerNumber = circles.get(marker[0]);
        const priorText = text.slice(marker.index + marker[0].length, markers[markers.indexOf(marker) + 1]?.index ?? text.length).trim();
        currentChoice = { number: markerNumber, parts: priorText ? [priorText] : [] };
        choices.push(currentChoice);
        state = "choices";
        cursor = markers[markers.indexOf(marker) + 1]?.index ?? text.length;
      }
      continue;
    }
    if (state === "stem") stemParts.push(text);
    else if (currentChoice) currentChoice.parts.push(text);
  }

  const prompt = joinParts(stemParts);
  const parsedChoices = choices.map((choice) => ({ number: choice.number, text: joinParts(choice.parts) }));
  const answer = answerKey.get(start.question_number) ?? null;
  const category = section.type === "official"
    ? categoryBySubject[Math.min(5, Math.ceil(start.question_number / 20))]
    : pageCategory;

  if (!prompt) reasons.push("question_text_missing");
  if (prompt.length < 12) reasons.push("question_text_short");
  if (parsedChoices.length !== 4) reasons.push(`choice_count_${parsedChoices.length}`);
  if (parsedChoices.some((choice, index) => choice.number !== index + 1)) reasons.push("choice_number_sequence");
  if (parsedChoices.some((choice) => !choice.text)) reasons.push("choice_text_missing");
  if (new Set(parsedChoices.map((choice) => normalize(choice.text))).size !== parsedChoices.length) reasons.push("duplicate_choices");
  if (!answer) reasons.push("answer_key_not_recognized");
  if (!category) reasons.push("subject_not_recognized");

  const allQuestionText = `${prompt}\n${parsedChoices.map((choice) => choice.text).join("\n")}`;
  if (/(?:그림|도식|그래프|도표|이미지|사진|다음 표|표에서|표에 대한)/u.test(allQuestionText)) reasons.push("visual_or_table_review");
  if (/[0-9{};=<>#]|\b(?:int\s+main|printf|scanf|select\s+|insert\s+into|update\s+\w+|delete\s+from|chmod|grep|iptables|return\s+\d)\b|(?:\/(?:etc|var|bin|usr)\/)|[A-Za-z]:\\/iu.test(allQuestionText)) reasons.push("numeric_code_or_special_visual_review");
  if (/(?:�|￿)/u.test(allQuestionText)) reasons.push("ocr_replacement_character");
  const minScore = relevantScores.length ? Math.min(...relevantScores) : null;
  if (minScore !== null && minScore < 0.75) reasons.push("low_confidence_question_region");
  if (pageMean !== null && pageMean < 0.75) reasons.push("low_confidence_page");
  if (reviewByPage.has(page.pdf_page_number)) reasons.push("ocr_page_flagged_for_review");

  const printedPage = page.items
    .filter((item) => item.bbox_xyxy[1] > page.image_height_px * 0.9)
    .map((item) => String(item.text ?? "").trim())
    .find((text) => /^\d-\d{1,3}$/u.test(text)) ?? "";
  const cue = findExamCue(pageColumnItems, start.index);
  const year = section.year ?? cue.year ?? null;
  const session = section.session ?? cue.session ?? null;
  if (section.type === "past" && !year) reasons.push("past_exam_year_not_recognized");

  const sourcePage = `PDF ${page.pdf_page_number}쪽${printedPage ? ` (인쇄 ${printedPage})` : ""}`;
  const source = `2026 수제비 정보보안기사 필기 기본서 · ${section.section} · ${sourcePage} · ${start.question_number}번`;
  const explanation = joinParts(explanationParts);
  const row = {
    exam_type: "WRITTEN_CBT",
    category: category ?? "",
    prompt,
    choice1: parsedChoices[0]?.text ?? "",
    choice2: parsedChoices[1]?.text ?? "",
    choice3: parsedChoices[2]?.text ?? "",
    choice4: parsedChoices[3]?.text ?? "",
    correct_answer: answer ?? "",
    model_answer: "",
    key_points: "",
    explanation,
    difficulty: "medium",
    image_url: "",
    tags: makeTags(section, category, year, session),
    source,
    source_year: year ?? "",
    reference_text: "",
    code_snippet: "",
    code_language: "",
    image_urls: "",
    certificate_id: "information-security-engineer"
  };
  const sourceKey = section.type === "official"
    ? `2025-${session}-${start.question_number}`
    : `${section.section}-${page.pdf_page_number}-${start.question_number}`;
  const record = {
    source_key: sourceKey,
    source_section: section.section,
    source_type: section.type,
    exam_year: year,
    exam_session: session,
    subject: category,
    question_number: start.question_number,
    source_page_pdf: page.pdf_page_number,
    printed_page: printedPage,
    minimum_ocr_confidence: minScore,
    page_mean_ocr_confidence: pageMean,
    answer_choice_number: answer,
    choices: parsedChoices,
    review_required: reasons.length > 0,
    review_reasons: [...new Set(reasons)],
    row,
    content_hash: createHash("sha256").update([prompt, ...parsedChoices.map((choice) => choice.text)].join("\n")).digest("hex")
  };
  return record;
}

function findExamCue(items, startReadingOrder) {
  for (const item of [...items].filter((value) => value.reading_order <= startReadingOrder).reverse()) {
    const text = String(item.text ?? "");
    const match = text.match(/(20\d{2}|\d{2})\s*년\s*(\d+)\s*회/u);
    if (match) {
      const year = Number(match[1]) < 100 ? 2000 + Number(match[1]) : Number(match[1]);
      if (text.includes(",") || text.includes("~")) return { year: null, session: null };
      return { year, session: Number(match[2]) };
    }
  }
  return { year: null, session: null };
}

function makeTags(section, category, year, session) {
  const tags = ["정보보안기사", "필기", section.type === "expected" ? "예상" : "기출", section.section];
  if (year) tags.push(`${year}년`);
  if (session) tags.push(`${session}회`);
  if (category) tags.push(category);
  return [...new Set(tags)].join("|");
}

async function applyVisualAnswerKeys(candidates) {
  const filePath = path.join(outputDirectory, "manual-answer-keys.json");
  let manual;
  try {
    manual = JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return;
  }
  if (manual.source_pdf_sha256 !== "332f9ce3f1aaaebe2b4d728796c9cfb6415126a2d95257fccc90bace02647623") {
    throw new Error("Visual answer-key map does not match the source PDF checksum");
  }
  for (const candidate of candidates) {
    if (candidate.source_type !== "official" || candidate.exam_year !== 2025 || !candidate.exam_session) continue;
    const mapping = manual.sessions[`${candidate.exam_year}-${candidate.exam_session}`];
    if (!mapping) continue;
    let offset = candidate.question_number - mapping.first_question;
    let answerKeyPdfPage = null;
    let answer = null;
    for (let pageIndex = 0; pageIndex < mapping.page_answer_strings.length; pageIndex += 1) {
      const answers = mapping.page_answer_strings[pageIndex];
      if (offset < answers.length) {
        answer = Number(answers[offset]);
        answerKeyPdfPage = mapping.first_pdf_page + pageIndex;
        break;
      }
      offset -= answers.length;
    }
    if (!answer) continue;
    applyVisualAnswer(candidate, answer, answerKeyPdfPage);
  }

  const bookPath = path.join(outputDirectory, "manual-answer-keys-book.json");
  let book;
  try {
    book = JSON.parse(await fs.readFile(bookPath, "utf8"));
  } catch {
    return;
  }
  if (book.source_pdf_sha256 !== manual.source_pdf_sha256) throw new Error("Practice answer-key map does not match the source PDF checksum");
  for (const candidate of candidates) {
    if (candidate.source_type === "official") continue;
    const answer = book.page_answers?.[String(candidate.source_page_pdf)]?.[String(candidate.question_number)];
    if (!Number.isInteger(answer) || answer < 1 || answer > 4) continue;
    applyVisualAnswer(candidate, answer, candidate.source_page_pdf);
  }
}

async function applyVisualQuestionCorrections(candidates) {
  const filePath = path.join(outputDirectory, "manual-question-corrections.json");
  let corrections;
  try {
    corrections = JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return;
  }
  if (corrections.source_pdf_sha256 !== "332f9ce3f1aaaebe2b4d728796c9cfb6415126a2d95257fccc90bace02647623") {
    throw new Error("Manual question corrections do not match the source PDF checksum");
  }
  for (const correction of corrections.corrections ?? []) {
    const matches = candidates.filter((candidate) => candidate.source_type === "official"
      && candidate.source_page_pdf === correction.pdf_page
      && candidate.question_number === correction.parsed_question_number
      && candidate.exam_year === correction.exam_year
      && candidate.exam_session === correction.exam_session);
    if (matches.length !== 1) throw new Error(`Expected one OCR candidate for manual question correction on PDF ${correction.pdf_page}; found ${matches.length}`);
    const candidate = matches[0];
    const previousNumber = candidate.question_number;
    const correctedNumber = correction.verified_question_number;
    const correctedCategory = categoryBySubject[Math.min(5, Math.ceil(correctedNumber / 20))];
    candidate.question_number = correctedNumber;
    candidate.subject = correctedCategory;
    candidate.source_key = `${candidate.exam_year}-${candidate.exam_session}-${correctedNumber}`;
    candidate.manual_question_number_override = {
      parsed_question_number: previousNumber,
      verified_question_number: correctedNumber,
      source_page_pdf: correction.pdf_page
    };
    candidate.row.category = correctedCategory;
    candidate.row.tags = makeTags({ type: candidate.source_type, section: candidate.source_section }, correctedCategory, candidate.exam_year, candidate.exam_session);
    candidate.row.source = candidate.row.source.replace(/·\s*\d{1,3}번$/u, `· ${correctedNumber}번`);
    for (const choiceCorrection of correction.choice_corrections ?? []) {
      const column = `choice${choiceCorrection.choice_number}`;
      const current = candidate.row[column];
      if (!current.includes(choiceCorrection.from)) {
        throw new Error(`Expected OCR choice text on PDF ${correction.pdf_page} to include ${choiceCorrection.from}`);
      }
      candidate.row[column] = current.replace(choiceCorrection.from, choiceCorrection.to);
      const choice = candidate.choices.find((item) => item.number === choiceCorrection.choice_number);
      if (!choice) throw new Error(`Missing choice ${choiceCorrection.choice_number} on PDF ${correction.pdf_page}`);
      choice.text = candidate.row[column];
    }
    candidate.manual_visual_corrections = (candidate.manual_visual_corrections ?? []).concat(correction.note);
    candidate.content_hash = createHash("sha256").update([candidate.row.prompt, ...[1, 2, 3, 4].map((number) => candidate.row[`choice${number}`])].join("\n")).digest("hex");
  }
}

function applyVisualAnswer(candidate, answer, answerKeyPdfPage) {
  const ocrAnswer = candidate.answer_choice_number;
  candidate.ocr_answer_choice_number = ocrAnswer;
  candidate.answer_choice_number = answer;
  candidate.answer_key_source_pdf_page = answerKeyPdfPage;
  candidate.answer_verification = ocrAnswer === answer ? "visual_confirmed_ocr" : ocrAnswer === null ? "visual_manual_recovery" : "visual_overrode_ocr_conflict";
  candidate.ocr_answer_mismatch_visually_resolved = ocrAnswer !== null && ocrAnswer !== answer;
  candidate.row.correct_answer = answer;
  candidate.review_reasons = candidate.review_reasons.filter((reason) => reason !== "answer_key_not_recognized");
  candidate.review_reasons = [...new Set(candidate.review_reasons)];
  candidate.review_required = candidate.review_reasons.length > 0;
}

function resolveDuplicates(input) {
  const candidates = [...input];
  const promptGroups = new Map();
  for (const candidate of candidates) {
    const key = normalize(candidate.row.prompt);
    if (!key) continue;
    if (!promptGroups.has(key)) promptGroups.set(key, []);
    promptGroups.get(key).push(candidate);
  }
  for (const group of promptGroups.values()) {
    if (group.length < 2) continue;
    const contents = new Set(group.map((item) => item.content_hash));
    const choicesAnswers = new Set(group.map((item) => JSON.stringify([item.choices, item.answer_choice_number])));
    if (contents.size === 1 && choicesAnswers.size === 1) {
      for (const duplicate of group.slice(1)) {
        duplicate.review_required = true;
        duplicate.review_reasons.push("duplicate_prompt_same_content");
      }
      continue;
    }
    for (const candidate of group) {
      candidate.review_required = true;
      candidate.review_reasons.push("duplicate_prompt_content_conflict");
    }
  }
  const review = candidates.filter((item) => item.review_required);
  const ready = candidates.filter((item) => !item.review_required);
  return { candidates, ready, review };
}

function makeSummary(resolved, rawQuestions) {
  const groupCounts = (items, getter) => Object.fromEntries(
    [...items.reduce((map, item) => map.set(getter(item), (map.get(getter(item)) ?? 0) + 1), new Map())].sort(([a], [b]) => String(a).localeCompare(String(b), "ko"))
  );
  return {
    source_pdf_pages: totalPages,
    extraction_candidate_count: rawQuestions.length,
    ready_count: resolved.ready.length,
    manual_review_count: resolved.review.length,
    section_counts: groupCounts(resolved.candidates, (item) => item.source_section),
    subject_counts: groupCounts(resolved.ready, (item) => item.subject),
    year_session_counts: groupCounts(resolved.ready, (item) => `${item.exam_year ?? "예상"}-${item.exam_session ?? ""}`),
    review_reason_counts: resolved.review.reduce((counts, item) => {
      for (const reason of item.review_reasons) counts[reason] = (counts[reason] ?? 0) + 1;
      return counts;
    }, {}),
    generated_at: new Date().toISOString()
  };
}

function normalize(value) {
  return String(value ?? "").normalize("NFKC").replace(/\s+/gu, " ").trim().toLocaleLowerCase("ko-KR");
}

function compact(value) {
  return String(value ?? "").normalize("NFKC").replace(/\s+/gu, "").trim();
}

function joinParts(parts) {
  return parts.map((part) => String(part ?? "").replace(/\s+/gu, " ").trim()).filter(Boolean).join(" ").trim();
}

function mean(values) {
  return values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4)) : null;
}

async function readJsonLines(filePath) {
  try {
    const contents = await fs.readFile(filePath, "utf8");
    return contents.split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}

async function writeJsonAtomic(filePath, value) {
  const temporary = `${filePath}.tmp`;
  const contents = `${JSON.stringify(value, null, 2)}\n`;
  await fs.writeFile(temporary, contents, "utf8");
  try {
    await fs.rename(temporary, filePath);
  } catch (error) {
    if (!new Set(["EPERM", "EEXIST"]).has(error?.code)) throw error;
    await fs.copyFile(temporary, filePath);
    await fs.unlink(temporary);
  }
}

async function writeCsv(filePath, rows) {
  const headers = ["exam_type", "category", "prompt", "choice1", "choice2", "choice3", "choice4", "correct_answer", "model_answer", "key_points", "explanation", "difficulty", "image_url", "tags", "source", "source_year", "reference_text", "code_snippet", "code_language", "image_urls", "certificate_id"];
  const cell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const lines = [headers.map(cell).join(","), ...rows.map((row) => headers.map((header) => cell(row[header])).join(","))];
  await fs.writeFile(filePath, `${lines.join("\r\n")}\r\n`, "utf8");
}
