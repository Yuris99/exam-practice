import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import sharp from "sharp";
import { createCanvas } from "@napi-rs/canvas";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputDirectory = path.join(root, "data", "정보처리기사(필기)");
const outputFile = path.join(root, "content", "questions", "information-processing-engineer-written.csv");
const imageRoot = path.join(root, "public", "questions", "information-processing-engineer", "exams");
const reportFile = path.join(inputDirectory, "IMPORT_REPORT.ko.md");
const categories = ["소프트웨어 설계", "소프트웨어 개발", "데이터베이스 구축", "프로그래밍 언어 활용", "정보시스템 구축 관리"];
const answerNumber = { "①": 1, "②": 2, "③": 3, "④": 4, "❶": 1, "❷": 2, "❸": 3, "❹": 4, "가": 1, "나": 2, "다": 3, "라": 4 };
const choicePattern = /[①②③④❶❷❸❹]/g;
const header = ["exam_type", "category", "prompt", "choice1", "choice2", "choice3", "choice4", "correct_answer", "model_answer", "key_points", "explanation", "difficulty", "image_url", "tags", "source", "source_year", "reference_text", "code_snippet", "code_language", "image_urls", "certificate_id"];

const filenames = (await fs.readdir(inputDirectory))
  .filter((name) => name.toLowerCase().endsWith(".pdf") && parseExam(name))
  .sort((a, b) => {
    const left = parseExam(a);
    const right = parseExam(b);
    return left.year - right.year || left.round.localeCompare(right.round, "ko");
  });
await fs.mkdir(imageRoot, { recursive: true });

const questions = [];
const failures = [];
for (const filename of filenames) {
  const exam = parseExam(filename);
  const examKey = `${exam.year}-${exam.round.replaceAll(/[^0-9]/g, "") || "0"}`;
  const data = new Uint8Array(await fs.readFile(path.join(inputDirectory, filename)));
  const document = await pdfjs.getDocument({ data, disableWorker: true }).promise;
  const { records, pageAnchors, answerText } = await readQuestions(document);
  const answers = readAnswers(answerText);
  const byNumber = new Map(records.map((record) => [record.number, record]));
  for (const [pageNumber, anchors] of pageAnchors) {
    await extractPageImages(await document.getPage(pageNumber), anchors, byNumber, examKey);
  }
  for (const record of records) {
    if (exam.year < 2020 && !isCurrentLegacyRange(record.number)) continue;
    const parsed = parseQuestion(record.parts.join(" "));
    const correctAnswer = answers.get(record.number) ?? parsed?.markedAnswer;
    if (!parsed || parsed.prompt.replace(/[?\s]/g, "").length < 3 || parsed.choices.length !== 4 || !correctAnswer) {
      failures.push(`${filename} · ${record.number}번 · ${clean(record.parts.join(" ")).slice(0, 100)}`);
      continue;
    }
    const category = exam.year < 2020
      ? legacyCategory(record.number, parsed.prompt)
      : categories[Math.min(4, Math.floor((record.number - 1) / 20))];
    const roundLabel = exam.round === "1,2" ? "1·2회" : `${exam.round}회`;
    questions.push({
      category, ...parsed, correctAnswer, images: record.images,
      source: `정보처리기사 ${exam.year}년 ${roundLabel} ${record.number}번`,
      sourceYear: exam.year,
      legacy: exam.year < 2020
    });
  }
  console.log(`${filename}: 문항 ${records.length}개, 정답 ${answers.size}개`);
}

const finalQuestions = deduplicateQuestions(questions);
const referencedImages = new Set(finalQuestions.flatMap((question) => question.images));
await removeUnreferencedImages(imageRoot, referencedImages);
const rows = finalQuestions.map((question) => [
  "WRITTEN_CBT", question.category, question.prompt, ...question.choices,
  String(question.correctAnswer), "", "", "", "medium", question.images[0] ?? "",
  `정보처리기사|필기|기출|${question.legacy ? "개편 전 현행범위 선별" : "2020년 이후"}|${question.category}`, question.source,
  String(question.sourceYear), "", "", "", question.images.slice(1).join("|"),
  "information-processing-engineer"
]);
await fs.writeFile(outputFile, `\uFEFF${[header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`, "utf8");
await fs.writeFile(reportFile, buildReport(referencedImages), "utf8");
console.log(`총 ${finalQuestions.length}개 고유 문항과 ${referencedImages.size}개 이미지를 저장했습니다.`);

function parseExam(filename) {
  const year = Number(filename.match(/(20\d{2})년/)?.[1]);
  if (year < 2011) return null;
  const round = filename.includes("1, 2회")
    ? "1,2"
    : filename.match(/년\s*(?:\d+\.\s*)?([1-4])회/)?.[1];
  return round ? { year, round } : null;
}

async function readQuestions(document) {
  const records = [];
  const pageAnchors = new Map();
  let current = null;
  let answerText = "";
  let answerSection = false;
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    const hasAnswerHeading = content.items.some((item) => /^정답(?:\s|$)/.test(clean(item.str)));
    if (answerSection || (current?.number >= 80 && hasAnswerHeading)) {
      answerSection = true;
      answerText += ` ${pageText}`;
      continue;
    }
    const anchors = [];
    for (const item of content.items) {
      const text = clean(item.str);
      if (!text || isFurniture(text)) continue;
      const start = text.match(/^(\d{1,3})\.\s*(.*)$/);
      const number = start ? Number(start[1]) : 0;
      if (start && number >= 1 && number <= 100 && (!current || number === current.number + 1)) {
        if (current) records.push(current);
        current = { number, parts: [start[2]], images: [] };
        anchors.push({ number, x: item.transform[4], y: item.transform[5] });
      } else if (current) current.parts.push(text);
    }
    if (anchors.length) pageAnchors.set(pageNumber, anchors);
  }
  if (current) records.push(current);
  return { records, pageAnchors, answerText };
}

function readAnswers(text) {
  const answers = new Map();
  for (const match of text.matchAll(/(\d{1,3})\s*\.\s*([①②③④❶❷❸❹가나다라])(?:\s*\.|\s|$)/g)) {
    const number = Number(match[1]);
    if (number >= 1 && number <= 100) answers.set(number, answerNumber[match[2]]);
  }
  return answers;
}

function parseQuestion(text) {
  const normalized = text.replace(/(^|\s)(가|나|다|라)\.\s/g, (_, prefix, symbol) => `${prefix}${["가", "나", "다", "라"].indexOf(symbol) + 1}CHOICE `);
  const legacyMatches = [...normalized.matchAll(/([1-4])CHOICE/g)];
  if (legacyMatches.length >= 4) {
    const matches = legacyMatches.slice(-4);
    const prefix = clean(normalized.slice(0, matches[0].index));
    const choices = matches.map((match, index) => clean(normalized.slice(match.index + match[0].length, matches[index + 1]?.index ?? normalized.length)));
    if (prefix && choices.every(Boolean)) return { prompt: prefix, choices };
  }
  const matches = [...text.matchAll(choicePattern)].slice(-4);
  if (matches.length !== 4) return null;
  const prefix = clean(text.slice(0, matches[0].index));
  const questionMark = Math.max(prefix.lastIndexOf("?"), prefix.lastIndexOf("？"));
  const leadingChoice = questionMark >= 0 ? clean(prefix.slice(questionMark + 1)) : "";
  // Several source PDFs emit a choice's circled number after its text. In that
  // layout the text after ④ is already the next question, so deliberately ignore it.
  const trailingNumberLayout = Boolean(leadingChoice);
  const prompt = trailingNumberLayout ? clean(prefix.slice(0, questionMark + 1)) : prefix;
  const choices = trailingNumberLayout
    ? [
        leadingChoice,
        clean(text.slice(matches[0].index + matches[0][0].length, matches[1].index)),
        clean(text.slice(matches[1].index + matches[1][0].length, matches[2].index)),
        clean(text.slice(matches[2].index + matches[2][0].length, matches[3].index))
      ]
    : matches.map((match, index) => clean(text.slice(match.index + match[0].length, matches[index + 1]?.index ?? text.length)));
  if (!prompt || choices.some((choice) => !choice)) return null;
  const marked = matches.find((match) => /[❶❷❸❹]/.test(match[0]));
  return { prompt, choices, markedAnswer: marked ? answerNumber[marked[0]] : undefined };
}

function isCurrentLegacyRange(number) {
  return (number >= 1 && number <= 20) || (number >= 61 && number <= 80);
}

function legacyCategory(number, prompt) {
  if (number <= 20) return "데이터베이스 구축";
  return /(요구|분석|설계|UML|객체|모델|모형|아키텍처|인터페이스|UI|자료 흐름|DFD|구조도|결합도|응집도)/i.test(prompt)
    ? "소프트웨어 설계"
    : "소프트웨어 개발";
}

function deduplicateQuestions(items) {
  const unique = new Map();
  for (const item of items) {
    const key = item.prompt.normalize("NFKC").replace(/\s+/g, " ").toLocaleLowerCase("ko-KR");
    const existing = unique.get(key);
    if (!existing || (!existing.images.length && item.images.length)) unique.set(key, item);
  }
  return [...unique.values()];
}

async function extractPageImages(page, anchors, byNumber, examKey) {
  // Rendering resolves the page's image objects in pdf.js. The canvas itself is
  // discarded because the original embedded raster is sharper than a page crop.
  const viewport = page.getViewport({ scale: 1 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
  const operations = await page.getOperatorList();
  for (let index = 0; index < operations.fnArray.length; index += 1) {
    if (operations.fnArray[index] !== pdfjs.OPS.paintImageXObject) continue;
    const name = operations.argsArray[index]?.[0];
    const transform = findImageTransform(operations, index);
    if (typeof name !== "string" || !transform) continue;
    const [widthOnPage, , , heightOnPage, x, y] = transform;
    if (Math.abs(widthOnPage) < 12 || Math.abs(heightOnPage) < 12) continue;
    const column = x < 300 ? "left" : "right";
    const imageTop = y + Math.abs(heightOnPage);
    const anchor = anchors
      .filter((candidate) => (candidate.x < 300 ? "left" : "right") === column && candidate.y >= imageTop - 10)
      .sort((a, b) => a.y - b.y)[0];
    const record = anchor && byNumber.get(anchor.number);
    if (!record) continue;
    const image = await getPageObject(page, name);
    if (!image?.data || image.width < 30 || image.height < 20 || ![2, 3].includes(image.kind)) continue;
    const directory = path.join(imageRoot, examKey);
    await fs.mkdir(directory, { recursive: true });
    const imageName = `q${String(record.number).padStart(3, "0")}-${record.images.length + 1}.png`;
    const destination = path.join(directory, imageName);
    const channels = image.kind === 2 ? 3 : 4;
    await sharp(Buffer.from(image.data), { raw: { width: image.width, height: image.height, channels } }).png().toFile(destination);
    record.images.push(`/questions/information-processing-engineer/exams/${examKey}/${imageName}`);
  }
}

function findImageTransform(operations, imageIndex) {
  for (let index = imageIndex - 1; index >= Math.max(0, imageIndex - 10); index -= 1) {
    if (operations.fnArray[index] === pdfjs.OPS.transform) return operations.argsArray[index];
  }
  return null;
}

function getPageObject(page, name) {
  return page.objs.has(name) ? page.objs.get(name) : null;
}

function clean(value) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function isFurniture(text) {
  return /^-\s*\d+\s*-$/.test(text)
    || /^회\s*\d/.test(text)
    || /^정보처리기사 필기 기출문제/.test(text)
    || /저작권 안내/.test(text);
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

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function buildReport(referencedImages) {
  const counts = Object.fromEntries(categories.map((category) => [category, finalQuestions.filter((question) => question.category === category).length]));
  return `# 정보처리기사 필기 가져오기 결과

## 적용 기준

- 2020년 이후 기출은 5과목 전체를 사용했습니다.
- 2020년 이전 기출은 현행 범위와 직접 겹치는 데이터베이스와 소프트웨어공학 문항만 선별했습니다. 폐지된 전자계산기 구조, 운영체제, 데이터통신 과목은 제외했습니다.
- 2020년 이후 문항은 번호 기준으로 현행 5과목에 분류하고, 개편 전 데이터베이스·소프트웨어공학 문항은 현행 데이터베이스 구축·소프트웨어 설계·소프트웨어 개발로 재분류했습니다.
- 출제기준 PDF는 과목 체계를 확인하는 기준 자료로 사용하며 문제 데이터에는 포함하지 않았습니다.

## 결과

- 처리한 PDF: ${filenames.length}개
- 저장한 고유 문항: ${finalQuestions.length}개
- 원본 문항(파싱 성공): ${questions.length}개
- 연결한 이미지: ${referencedImages.size}개
${categories.map((category) => `- ${category}: ${counts[category]}개`).join("\n")}
- 파싱 실패: ${failures.length}개

## 파싱 실패 문항

${failures.length ? failures.map((failure) => `- ${failure}`).join("\n") : "- 없음"}
`;
}
