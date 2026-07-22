import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputDirectory = path.join(root, "data", "컴퓨터시스템기사(필기)");
const imageRoot = path.join(root, "public", "questions", "computer-system-engineer");
const outputFile = path.join(root, "content", "questions", "computer-system-engineer-written.csv");
const reportEn = path.join(inputDirectory, "IMAGE_CROP_REPORT.md");
const reportKo = path.join(inputDirectory, "IMAGE_CROP_REPORT.ko.md");
const answerSymbols = { "❶": 1, "❷": 2, "❸": 3, "❹": 4, "❺": 5, "①": 1, "②": 2, "③": 3, "④": 4, "⑤": 5 };
const choicePattern = /[①②③④⑤❶❷❸❹❺]/g;

const filenames = (await fs.readdir(inputDirectory)).filter((name) => /\([AB]형\).*\.pdf$/i.test(name)).sort();
await fs.mkdir(imageRoot, { recursive: true });

const questions = [];
const manualCandidates = [];
const excludedQuestions = [];
let extractedImageCount = 0;

for (const filename of filenames) {
  const lineage = filename.includes("(A형)") ? "A" : "B";
  const dateDigits = filename.match(/(20\d{6})/)?.[1] ?? "unknown";
  const date = dateDigits === "unknown" ? "" : `${dateDigits.slice(0, 4)}-${dateDigits.slice(4, 6)}-${dateDigits.slice(6, 8)}`;
  const data = new Uint8Array(await fs.readFile(path.join(inputDirectory, filename)));
  const document = await pdfjs.getDocument({ data, disableWorker: true }).promise;
  const subjectNames = await readSubjectNames(document);
  const records = [];
  const pageAnchors = new Map();
  let current = null;

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const anchors = [];
    for (const item of content.items) {
      const text = cleanText(item.str);
      if (!text || isPageFurniture(text)) continue;
      const start = text.match(/^(\d{1,3})\.\s*(.*)$/);
      if (start && Number(start[1]) >= 1 && Number(start[1]) <= 100 && (!current || Number(start[1]) === current.number + 1)) {
        if (current) records.push(current);
        current = { number: Number(start[1]), parts: [start[2]], pageNumber, images: [], textItems: [item] };
        anchors.push({ number: current.number, x: item.transform[4], y: item.transform[5] });
      } else if (current && !/^\d\s*과목\s*:/.test(text)) {
        current.parts.push(text);
        current.textItems.push(item);
      }
    }
    pageAnchors.set(pageNumber, anchors);
  }
  if (current) records.push(current);

  const byNumber = new Map(records.map((record) => [record.number, record]));
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const anchors = pageAnchors.get(pageNumber) ?? [];
    const operations = await page.getOperatorList();
    for (let index = 0; index < operations.fnArray.length; index += 1) {
      if (operations.fnArray[index] !== pdfjs.OPS.paintImageXObject) continue;
      const name = operations.argsArray[index]?.[0];
      if (typeof name !== "string") continue;
      const transform = findImageTransform(operations, index);
      if (!transform) continue;
      const [widthOnPage, , , heightOnPage, x, y] = transform;
      const column = x < 280 ? "left" : "right";
      const top = y + Math.abs(heightOnPage);
      const candidates = anchors.filter((anchor) => (anchor.x < 280 ? "left" : "right") === column && anchor.y >= top - 8).sort((a, b) => (a.y - top) - (b.y - top));
      const anchor = candidates[0];
      if (!anchor) continue;
      const record = byNumber.get(anchor.number);
      if (!record) continue;
      const image = await getPageObject(page, name);
      if (!image?.data || !image.width || !image.height) continue;
      const questionDirectory = path.join(imageRoot, lineage.toLowerCase(), dateDigits);
      await fs.mkdir(questionDirectory, { recursive: true });
      const imageNumber = record.images.length + 1;
      const imageName = `q${String(record.number).padStart(3, "0")}-${imageNumber}.png`;
      const destination = path.join(questionDirectory, imageName);
      await writeImage(image, destination);
      record.images.push(`/questions/computer-system-engineer/${lineage.toLowerCase()}/${dateDigits}/${imageName}`);
      extractedImageCount += 1;
    }
  }

  for (const record of records) {
    const parsed = parseQuestion(record.parts.join(" "));
    if (!parsed || parsed.choices.length < 2 || parsed.correctAnswer > parsed.choices.length) {
      excludedQuestions.push({ lineage, filename, date, number: record.number, prompt: record.parts.join(" ").slice(0, 180).trim() });
      continue;
    }
    const subjectIndex = Math.min(subjectNames.length - 1, Math.floor((record.number - 1) / 20));
    const legacyCategory = subjectNames[subjectIndex] ?? `${subjectIndex + 1}과목`;
    const category = mapToCurrentCategory(legacyCategory, `${parsed.prompt} ${parsed.choices.join(" ")}`);
    const sourceExam = lineage === "A" ? "전자계산기조직응용기사" : "전자계산기기사";
    const question = {
      lineage, filename, date, dateDigits, number: record.number, category, legacyCategory,
      ...parsed, images: record.images,
      source: `${sourceExam} ${date} ${record.number}번`,
      sourceYear: date.slice(0, 4)
    };
    questions.push(question);
    if (!record.images.length && needsManualVisual(parsed.prompt)) manualCandidates.push(question);
  }
  console.log(`${filename}: ${records.length} sections, ${records.filter((record) => record.images.length).length} question(s) with extracted images`);
}

const deduplicatedQuestions = deduplicateQuestions(questions);
const referencedImages = new Set(deduplicatedQuestions.flatMap((question) => question.images));
await removeUnreferencedImages(imageRoot, referencedImages);
const header = ["exam_type", "category", "prompt", "choice1", "choice2", "choice3", "choice4", "correct_answer", "model_answer", "key_points", "explanation", "difficulty", "image_url", "tags", "source", "source_year", "reference_text", "code_snippet", "code_language", "image_urls", "certificate_id"];
const rows = deduplicatedQuestions.map((question) => [
  "WRITTEN_CBT", question.category, question.prompt,
  question.choices[0] ?? "", question.choices[1] ?? "", question.choices[2] ?? "", question.choices[3] ?? "",
  String(question.correctAnswer), "", "", "", "medium", question.images[0] ?? "",
  `컴퓨터시스템기사|필기|기출|${question.lineage}계보|${question.legacyCategory}`, question.source, question.sourceYear,
  "", "", "", question.images.slice(1).join("|"), "computer-system-engineer"
]);
await fs.writeFile(outputFile, `\uFEFF${[header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`, "utf8");
await fs.writeFile(reportEn, buildReport("en", manualCandidates, excludedQuestions, filenames.length, deduplicatedQuestions.length, referencedImages.size), "utf8");
await fs.writeFile(reportKo, buildReport("ko", manualCandidates, excludedQuestions, filenames.length, deduplicatedQuestions.length, referencedImages.size), "utf8");
console.log(`Wrote ${deduplicatedQuestions.length} unique questions (${questions.length - deduplicatedQuestions.length} duplicates removed).`);
console.log(`Extracted ${extractedImageCount} images and retained ${referencedImages.size} referenced images.`);
console.log(`Manual crop candidates: ${manualCandidates.length}.`);
console.log(`Excluded questions requiring source review: ${excludedQuestions.length}.`);

async function readSubjectNames(document) {
  const found = new Map();
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const content = await (await document.getPage(pageNumber)).getTextContent();
    const text = content.items.map((item) => item.str).join(" ");
    for (const match of text.matchAll(/([1-5])\s*과목\s*:\s*([^\n]+?)(?=\s*컴퓨터시스템기사|$)/g)) found.set(Number(match[1]), match[2].replace(/\s+/g, " ").trim());
  }
  return [...found.entries()].sort((a, b) => a[0] - b[0]).map((entry) => entry[1]);
}

function parseQuestion(text) {
  const allMatches = [...text.matchAll(choicePattern)];
  if (allMatches.length < 4) return null;
  const choiceCount = allMatches.some((match) => match[0] === "⑤" || match[0] === "❺") ? 5 : 4;
  const matches = allMatches.slice(-choiceCount);
  const prompt = text.slice(0, matches[0].index).replace(/\s+/g, " ").trim();
  const choices = matches.slice(0, 5).map((match, index) => text.slice(match.index + match[0].length, matches[index + 1]?.index ?? text.length).replace(/\s+/g, " ").trim());
  const correct = matches.find((match) => "❶❷❸❹❺".includes(match[0]));
  if (!prompt || !correct || choices.some((choice) => !choice)) return null;
  return { prompt, choices, correctAnswer: answerSymbols[correct[0]] };
}

function cleanText(value) { return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim(); }
function isPageFurniture(text) { return text.includes("www.comcbt.com") || text.startsWith("컴퓨터시스템기사") || /^[()AB형\s]+$/.test(text) || /^◐|^◑/.test(text); }
function findImageTransform(operations, imageIndex) {
  for (let index = imageIndex - 1; index >= Math.max(0, imageIndex - 8); index -= 1) if (operations.fnArray[index] === pdfjs.OPS.transform) return operations.argsArray[index];
  return null;
}
function getPageObject(page, name) { return new Promise((resolve) => page.objs.get(name, resolve)); }
async function writeImage(image, destination) {
  if (image.kind === 2) return sharp(Buffer.from(image.data), { raw: { width: image.width, height: image.height, channels: 3 } }).png().toFile(destination);
  if (image.kind === 3) return sharp(Buffer.from(image.data), { raw: { width: image.width, height: image.height, channels: 4 } }).png().toFile(destination);
  throw new Error(`Unsupported PDF image kind ${image.kind} for ${destination}`);
}
function needsManualVisual(prompt) { return /(그림|회로|트리|그래프|파형|순서도|블록도|프로그램(?:이|의)?\s*(?:실행|결과)|코드의\s*실행)/i.test(prompt); }
function mapToCurrentCategory(legacyCategory, text) {
  if (/운영체제/.test(legacyCategory)) return "운영체제 및 시스템 소프트웨어";
  if (/전자계산기구조|마이크로\s*전자계산기/.test(legacyCategory)) return "컴퓨터 구조";
  if (/논리회로|데이터통신/.test(legacyCategory) && !/자료구조/.test(legacyCategory)) return "디지털 회로 및 데이터 통신";
  if (/전자계산기 프로그래밍/.test(legacyCategory)) return "컴퓨터 프로그래밍";
  if (/시스템 프로그래밍/.test(legacyCategory)) {
    return /(운영체제|프로세스|스케줄|기억장치 관리|가상기억|파일 시스템|시스템 콜|IPC|디바이스 드라이버|부트)/i.test(text)
      ? "운영체제 및 시스템 소프트웨어" : "컴퓨터 프로그래밍";
  }
  if (/자료구조 및 데이터통신/.test(legacyCategory)) {
    return /(통신|프로토콜|OSI|TCP|UDP|IP|LAN|WAN|HDLC|변조|전송|회선|라우팅|네트워크|에러 제어|오류 제어)/i.test(text)
      ? "디지털 회로 및 데이터 통신" : "컴퓨터 프로그래밍";
  }
  return "컴퓨터 구조";
}
function deduplicateQuestions(items) {
  const unique = new Map();
  for (const item of items) {
    const key = item.prompt.normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase("ko-KR");
    const existing = unique.get(key);
    if (!existing || (!existing.images.length && item.images.length) || item.date > existing.date) unique.set(key, item);
  }
  return [...unique.values()];
}
async function removeUnreferencedImages(directory, referencedUrls) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await removeUnreferencedImages(fullPath, referencedUrls);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".png")) {
      const relative = `/${path.relative(path.join(root, "public"), fullPath).split(path.sep).join("/")}`;
      if (!referencedUrls.has(relative)) await fs.unlink(fullPath);
    }
  }
}
function csvCell(value) { const text = String(value ?? ""); return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }

function buildReport(language, candidates, excluded, fileCount, questionCount, imageCount) {
  const korean = language === "ko";
  const title = korean ? "# 컴퓨터시스템기사 이미지 수동 작업 목록" : "# Computer System Engineer Manual Image Work";
  const summary = korean
    ? `## 요약\n\n- 처리한 PDF: ${fileCount}개\n- 변환한 문제: ${questionCount}개\n- 자동 추출한 이미지: ${imageCount}개\n- 수동 이미지 확인 후보: ${candidates.length}개\n- 변환 제외 및 원문 확인 문제: ${excluded.length}개\n\nPDF에 래스터 이미지로 포함된 자료는 자동으로 \`public/questions/computer-system-engineer/\`에 저장했다. 아래 문제는 문장상 그림·회로·코드가 필요해 보이지만 자동 매핑된 이미지가 없어 PDF 원문을 확인해야 한다.`
    : `## Summary\n\n- PDFs processed: ${fileCount}\n- Questions converted: ${questionCount}\n- Images extracted automatically: ${imageCount}\n- Manual image review candidates: ${candidates.length}\n- Excluded questions requiring source review: ${excluded.length}\n\nRaster images embedded in the PDFs were saved automatically below \`public/questions/computer-system-engineer/\`. The questions below appear to require a diagram, circuit, or code sample but have no automatically mapped image, so the source PDF must be checked.`;
  const instructions = korean
    ? `## 작업 방법\n\n1. 아래 출처 PDF에서 해당 문제를 찾는다.\n2. 문제 본문과 선택지는 제외하고 필요한 그림·표·코드 영역만 자른다.\n3. 이미지가 선명하도록 PNG로 저장한다.\n4. 권장 경로 \`public/questions/computer-system-engineer/manual/<날짜>/q<문제번호>.png\`에 넣는다.\n5. CSV의 해당 행 \`image_url\`에 슬래시 시작 경로를 입력한다.\n6. 실제 시각 자료가 필요 없는 문제라면 목록에서 확인 완료로 표시한다.`
    : `## Procedure\n\n1. Open the cited source PDF and locate the question.\n2. Crop only the required diagram, table, or code area, excluding the prompt and choices.\n3. Save a legible PNG.\n4. Use the recommended path \`public/questions/computer-system-engineer/manual/<date>/q<question-number>.png\`.\n5. Put the leading-slash path in that CSV row's \`image_url\`.\n6. If the question needs no visual material, mark it reviewed in this list.`;
  const listTitle = korean ? "## 수동 확인 후보" : "## Manual review candidates";
  const empty = korean ? "후보 없음" : "No candidates";
  const lines = candidates.length ? candidates.map((question) => `- [ ] ${question.lineage} · ${question.date} · ${question.number}${korean ? "번" : ""} — ${question.prompt}\n  \`${question.filename}\``).join("\n") : empty;
  const excludedTitle = korean ? "## 변환 제외 문제" : "## Excluded questions";
  const excludedLines = excluded.length ? excluded.map((question) => `- [ ] ${question.lineage} · ${question.date} · ${question.number}${korean ? "번" : ""} — ${question.prompt}\n  \`${question.filename}\``).join("\n") : empty;
  return `${title}\n\n${summary}\n\n${instructions}\n\n${listTitle}\n\n${lines}\n\n${excludedTitle}\n\n${excludedLines}\n`;
}
