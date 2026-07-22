import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputDirectory = path.join(root, "data", "임베디드 기사(필기)");
const outputFile = path.join(root, "content", "questions", "embedded-engineer-written.csv");
const filenames = (await fs.readdir(inputDirectory))
  .filter((name) => name.toLowerCase().endsWith(".html"))
  .sort((a, b) => b.localeCompare(a));

const parsed = [];
for (const filename of filenames) {
  const html = await fs.readFile(path.join(inputDirectory, filename), "utf8");
  const date = filename.match(/(\d{4})-(\d{2})-(\d{2})/)?.slice(1).join("-") ?? "";
  const segments = [...html.matchAll(/<h2[^>]*>\s*문제\s+(\d+)\s*<\/h2>([\s\S]*?)(?=<h2[^>]*>\s*문제\s+\d+\s*<\/h2>|$)/g)];
  for (const match of segments) parsed.push(parseSegment(match[2], Number(match[1]), filename, date));
}

const knownCategories = new Map();
for (const item of parsed) if (item.category) knownCategories.set(normalize(item.prompt), item.category);

const complete = [];
const skipped = [];
const seen = new Set();
for (const item of parsed) {
  if (!item.prompt || item.choices.length < 2 || !item.correctAnswer || item.correctAnswer > item.choices.length) {
    skipped.push(`${item.filename} 문제 ${item.number}: 선택지 또는 정답 없음`);
    continue;
  }
  const key = `${normalize(item.prompt)}:${normalize(item.referenceText)}:${item.imagePaths.join("|")}`;
  if (seen.has(key)) continue;
  seen.add(key);
  item.category ||= knownCategories.get(key) ?? inferCategory(`${item.prompt}\n${item.choices.join("\n")}`);
  complete.push(item);
}

const header = ["exam_type", "category", "prompt", "choice1", "choice2", "choice3", "choice4", "correct_answer", "model_answer", "key_points", "explanation", "difficulty", "image_url", "tags", "source", "source_year", "reference_text", "code_snippet", "code_language", "image_urls", "certificate_id"];
const rows = complete.map((item) => [
  "WRITTEN_CBT", item.category, item.prompt,
  item.choices[0] ?? "", item.choices[1] ?? "", item.choices[2] ?? "", item.choices[3] ?? "",
  String(item.correctAnswer), "", "", item.explanation, "medium", item.imagePaths[0] ?? "",
  "임베디드 기사|필기|기출", `임베디드기사 ${item.date} 문제 ${item.number}`, item.date.slice(0, 4),
  item.referenceText,
  "", "", item.imagePaths.slice(1).join("|"), "embedded-engineer"
]);
await fs.mkdir(path.dirname(outputFile), { recursive: true });
await fs.writeFile(outputFile, `\uFEFF${[header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`, "utf8");

console.log(`Scanned ${parsed.length} question section(s) from ${filenames.length} HTML file(s).`);
console.log(`Wrote ${complete.length} unique complete question(s) to ${path.relative(root, outputFile)}.`);
console.log(`Skipped ${skipped.length} incomplete question(s) and ${parsed.length - skipped.length - complete.length} duplicate(s).`);
if (skipped.length) console.log(skipped.map((value) => `- ${value}`).join("\n"));

function parseSegment(segment, number, filename, date) {
  const paragraphs = [...segment.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => htmlToText(match[1])).filter(Boolean);
  const categoryLine = paragraphs.find((text) => text.includes("과목:") && /임베디드 (?:하드웨어|펌웨어|플랫폼|소프트웨어)/.test(text));
  const category = categoryLine?.match(/임베디드 (?:하드웨어|펌웨어|플랫폼|소프트웨어)/)?.[0] ?? "";
  const choiceParagraph = paragraphs.find((text) => /^①\s*/m.test(text) && /^②\s*/m.test(text));
  const choices = choiceParagraph ? [...choiceParagraph.matchAll(/[①②③④⑤⑥]\s*([\s\S]*?)(?=\n[①②③④⑤⑥]\s*|$)/g)].map((match) => match[1].trim()) : [];
  const answerText = paragraphs.find((text) => text.startsWith("정답:")) ?? "";
  const answerSymbol = answerText.match(/[①②③④⑤⑥]|\d+/)?.[0] ?? "";
  const correctAnswer = answerSymbol ? ({ "①": 1, "②": 2, "③": 3, "④": 4, "⑤": 5, "⑥": 6 }[answerSymbol] ?? Number(answerSymbol)) : 0;
  const explanation = (paragraphs.find((text) => text.startsWith("해설:")) ?? "").replace(/^해설:\s*/, "");
  const ignored = new Set([categoryLine, choiceParagraph, answerText, paragraphs.find((text) => text.startsWith("해설:"))]);
  const rawPrompt = paragraphs.filter((text) => !ignored.has(text) && !["더보기", "닫기"].includes(text)).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  const imagePaths = [...new Set([...segment.matchAll(/\[이미지\]\s*([^<\s]+)/g)].map((match) => match[1]))];
  const { prompt, referenceText } = splitPromptContent(rawPrompt);
  return { number, filename, date, category, prompt, referenceText, choices, correctAnswer, explanation, imagePaths };
}

function splitPromptContent(value) {
  const lines = value.split("\n");
  const referenceStart = lines.findIndex((line) => line.includes("[보기]") && line.includes("┌"));
  const referenceEnd = referenceStart >= 0 ? lines.findIndex((line, index) => index > referenceStart && line.includes("└")) : -1;
  const referenceLines = referenceStart >= 0 && referenceEnd > referenceStart
    ? lines.slice(referenceStart + 1, referenceEnd).map((line) => line.replace(/^\s*│\s?/, "").replace(/\s*│\s*$/, "").trim()).filter(Boolean)
    : [];
  const promptLines = referenceStart >= 0 && referenceEnd > referenceStart
    ? [...lines.slice(0, referenceStart), ...lines.slice(referenceEnd + 1)]
    : lines;
  const prompt = promptLines.join("\n").replace(/\[이미지\]\s*\/static\/images\/[^\s]+/g, "").replace(/\n{3,}/g, "\n\n").trim() || "다음 문제 이미지를 보고 답하세요.";
  return { prompt, referenceText: referenceLines.join("\n") };
}

function htmlToText(value) {
  return decodeEntities(value.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<[^>]+>/g, "")).replace(/\u00a0/g, " ").split("\n").map((line) => line.trim()).filter(Boolean).join("\n").trim();
}

function decodeEntities(value) {
  return value.replace(/&nbsp;/gi, " ").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code))).replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function inferCategory(text) {
  const scores = {
    "임베디드 하드웨어": count(text, /회로|게이트|플립플롭|메모리|기억장치|대역폭|BCD|A\/D|프로세서|CPU|MPU|ARM|버스|인터럽트|레지스터|전압|센서|통신|UART|USB|RS-?232|엔디안/gi),
    "임베디드 펌웨어": count(text, /펌웨어|부트|커널|디바이스|드라이버|JTAG|크로스 컴파일|GPIO|타깃|임베디드 리눅스/gi),
    "임베디드 플랫폼": count(text, /OSI|리눅스|프로세스|스레드|파일 시스템|네트워크|TCP|UDP|IP|프로토콜|스케줄링|운영체제|쉘|메시지 큐/gi),
    "임베디드 소프트웨어": count(text, /스택|PUSH|POP|트리|순회|JAVA|Printf|포인터|소프트웨어|UML|객체|테스트|자료구조|알고리즘|데이터베이스|SQL|C언어|프로그램|설계|요구사항/gi)
  };
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[1] ? Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] : "임베디드 기사 출제기준";
}

function count(text, expression) { return [...text.matchAll(expression)].length; }
function normalize(value) { return value.normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase("ko-KR"); }
function csvCell(value) { const text = String(value ?? ""); return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }
