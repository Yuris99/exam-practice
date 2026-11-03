// Batch-2 capture + interaction check. Usage: node capture-batch2.mjs <outDir> <label>
// Needs the dev server on localhost:3127 and the shared Playwright install.
import { createRequire } from "node:module";
const require = createRequire("C:/Users/mose1/Documents/project/PersonalAIWorkspace/local/tools/playwright/package.json");
const { chromium } = require("@playwright/test");

const [, , outDir, label] = process.argv;
const base = "http://localhost:3127";
const concept = "/learn/information-security-engineer/system-security/operating-system-intro/process-lifecycle-scheduling";
const viewports = {
  "1440": { width: 1440, height: 900 },
  "1366": { width: 1366, height: 768 },
  "768": { width: 768, height: 1024, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  "390": { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  "360": { width: 360, height: 740, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};
const settle = (page) => page.waitForTimeout(400);
const log = [];
const browser = await chromium.launch();
for (const [name, vp] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor ?? 1, locale: "ko-KR" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  const shot = async (id, full = false) => { await settle(page); await page.screenshot({ path: `${outDir}/${label}-${name}-${id}.png`, fullPage: full }); };
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.setItem("certificate-practice:selected-certificate", "information-security-engineer"));
  await page.reload({ waitUntil: "networkidle" });
  await shot("home");
  let ov = await overflow();
  // keyboard: focus ring on the first focusable controls
  await page.keyboard.press("Tab"); await page.keyboard.press("Tab");
  const focus = await page.evaluate(() => { const a = document.activeElement; const s = getComputedStyle(a); return `${a.tagName}.${a.className} outline=${s.outlineWidth} ${s.outlineStyle} ${s.outlineColor}`; });
  // practice: start written CBT, pick choice 2, submit
  await page.locator(".modeGrid > button").first().click();
  await page.waitForSelector(".questionCard");
  await shot("question");
  const navCurrent = await page.evaluate(() => [...document.querySelectorAll(".navigation button")].map((b) => `${b.textContent}:${getComputedStyle(b).fontWeight}`).join(","));
  await page.locator(".choiceList button").nth(1).click();
  await shot("question-selected");
  await page.locator(".questionActions .submit").click();
  await page.waitForSelector(".feedback");
  const verdict = await page.locator(".feedback > strong").textContent();
  await page.locator(".feedback").scrollIntoViewIfNeeded();
  await shot("question-feedback");
  // is the end of the feedback hidden behind the docked action bar / tab bar?
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await settle(page);
  const obscured = await page.evaluate(() => {
    const fb = document.querySelector(".feedback").getBoundingClientRect();
    const bar = document.querySelector(".questionActions").getBoundingClientRect();
    return getComputedStyle(document.querySelector(".questionActions")).position === "fixed" ? fb.bottom > bar.top + 1 : false;
  });
  await shot("question-end");
  ov = ov || await overflow();
  // other screens through the nav
  for (const [view, id] of [["시험", "test"], ["통계", "history"], ["북마크", "bookmarks"]]) {
    await page.locator(".navigation button", { hasText: view }).click();
    await shot(id);
    ov = ov || await overflow();
  }
  await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent === "내 문제 관리")?.click());
  await shot("manage");
  // theory lesson + related practice return flow
  await page.goto(base + concept, { waitUntil: "networkidle" });
  await shot("theory");
  await shot("theory-full", true);
  ov = ov || await overflow();
  const related = page.locator("a[class*='question']").first();
  let ret = "no related question";
  if (await related.count()) {
    await related.click();
    await page.waitForSelector(".questionCard");
    await page.locator(".choiceList button, textarea").first().click();
    if (await page.locator("textarea").count()) await page.locator("textarea").first().fill("답");
    await page.locator(".questionActions .submit").click();
    const btn = page.locator(".questionActions .submit");
    const txt = await btn.textContent();
    if (!(await btn.isDisabled())) { await btn.click(); await page.waitForURL(/\/learn\//, { timeout: 8000 }).catch(() => {}); ret = `"${txt}" -> ${page.url().replace(base, "")}`; }
    else ret = `"${txt}" (self-assessment required)`;
  }
  await page.goto(base + "/learn/information-security-engineer", { waitUntil: "networkidle" });
  await shot("theory-course");
  ov = ov || await overflow();
  log.push(`[${name}] focus: ${focus}\n  nav weights in question view: ${navCurrent}\n  verdict: ${verdict}; feedback hidden behind fixed bar at page end: ${obscured}\n  related practice: ${ret}\n  horizontal overflow on any screen: ${ov}; page errors: ${errors.length ? errors.join(" | ") : "none"}`);
  await ctx.close();
}
await browser.close();
console.log(log.join("\n"));
