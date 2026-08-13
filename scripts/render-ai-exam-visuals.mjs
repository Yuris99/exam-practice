import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "@napi-rs/canvas";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.join(root, "data", "AI시험");
const preview = path.join(root, ".tmp", "ai-visual-preview");
const publicDirectory = path.join(root, "public", "questions", "ai-exam");
const selections = {
  "2-1._자연어_처리_기본.pdf": [3, 4, 7, 8, 9],
  "3-1._딥러닝_영상모델.pdf": [2, 6, 7, 8, 9, 11, 15, 17],
  "3-2_이미지_파운데이션_모델.pdf": [10, 11, 12, 14],
  "4-1_LangChain_서비스_개발.pdf": [6, 10, 13, 14],
  "4-2.agent_모델.pdf": [8, 9, 10, 11],
  "5-1._리소스_효율적_ai_모델.pdf": [12, 13, 14, 17, 18],
  "5-2._ai모델_활용_ambient_ai.pdf": [2, 3, 4, 5, 8, 9]
};

await fs.mkdir(preview, { recursive: true });
await fs.mkdir(publicDirectory, { recursive: true });
const thumbnails = [];
for (const [filename, pages] of Object.entries(selections)) {
  const data = new Uint8Array(await fs.readFile(path.join(input, filename)));
  const document = await pdfjs.getDocument({ data, disableWorker: true }).promise;
  for (const pageNumber of pages) {
    const page = await document.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    const label = `${filename.slice(0, 3).replaceAll(/[^0-9-]/g, "")}-p${String(pageNumber).padStart(2, "0")}`;
    const file = path.join(preview, `${label}.png`);
    await fs.writeFile(file, canvas.toBuffer("image/png"));
    thumbnails.push({ input: await sharp(file).resize({ width: 240 }).extend({ top: 26, background: "white" }).composite([{ input: Buffer.from(`<svg width="240" height="26"><text x="6" y="19" font-size="16">${label}</text></svg>`), top: 0, left: 0 }]).png().toBuffer() });
  }
}
const columns = 5;
const metadata = await sharp(thumbnails[0].input).metadata();
const width = metadata.width;
const height = metadata.height;
const sheet = sharp({ create: { width: width * columns, height: height * Math.ceil(thumbnails.length / columns), channels: 3, background: "#ddd" } });
await sheet.composite(thumbnails.map((thumb, i) => ({ input: thumb.input, left: (i % columns) * width, top: Math.floor(i / columns) * height }))).png().toFile(path.join(preview, "contact-sheet.png"));
const crops = [
  ["2-1-p03.png", "cbow.png", 400, 200, 470, 550],
  ["3-1-p06.png", "max-pooling.png", 315, 450, 500, 330],
  ["4-2-p08.png", "agent-components.png", 275, 735, 720, 390],
  ["5-1-p12.png", "qat-vs-ptq.png", 295, 550, 700, 540],
  ["5-2-p05.png", "tpt.png", 340, 180, 570, 330],
  ["5-2-p05.png", "prompt-align.png", 400, 720, 520, 340]
];
for (const [source, target, left, top, cropWidth, cropHeight] of crops) {
  await sharp(path.join(preview, source)).extract({ left, top, width: cropWidth, height: cropHeight }).png().toFile(path.join(publicDirectory, target));
}
console.log(path.join(preview, "contact-sheet.png"));
