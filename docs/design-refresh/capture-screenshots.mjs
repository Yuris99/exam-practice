import { createRequire } from "node:module";
const require = createRequire("C:/Users/mose1/Documents/project/PersonalAIWorkspace/local/tools/playwright/package.json");
const { chromium } = require("@playwright/test");

const [, , outDir, label] = process.argv;
const base = "http://localhost:3127";
const concept = "/learn/information-security-engineer/system-security/operating-system-intro/process-lifecycle-scheduling";
const viewports = { desktop: { width: 1366, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } };
const log = [];
const browser = await chromium.launch();
for (const [name, vp] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor ?? 1, locale: "ko-KR" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.setItem("certificate-practice:selected-certificate", "information-security-engineer"));
  await page.reload({ waitUntil: "networkidle" });
  await page.screenshot({ path: `${outDir}/${label}-${name}-home.png`, fullPage: true });
  // keyboard focus check on nav
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  log.push(`${name} focus after 2 tabs: ${await page.evaluate(() => { const a = document.activeElement; return `${a?.tagName}.${a?.className} "${a?.textContent?.slice(0, 20)}" outline=${getComputedStyle(a).outlineStyle}/${getComputedStyle(a).outlineColor}`; })}`);
  // practice: start written CBT from home mode grid
  await page.locator(".modeGrid > button").first().click();
  await page.waitForSelector(".questionCard");
  await page.screenshot({ path: `${outDir}/${label}-${name}-question.png`, fullPage: false });
  await page.locator(".choiceList button").nth(1).click();
  await page.locator(".questionActions .submit").click();
  await page.waitForSelector(".feedback");
  log.push(`${name} after submit: feedback="${(await page.locator(".feedback > strong").textContent())}" next="${await page.locator(".questionActions .submit").textContent()}"`);
  await page.locator(".feedback").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${outDir}/${label}-${name}-question-feedback.png`, fullPage: false });
  // theory lesson + related practice return flow
  await page.goto(base + concept, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outDir}/${label}-${name}-theory.png`, fullPage: false });
  await page.screenshot({ path: `${outDir}/${label}-${name}-theory-full.png`, fullPage: true });
  const single = page.locator("a[class*='question']").filter({ hasText: /./ }).first();
  if (await single.count()) {
    await single.click();
    await page.waitForSelector(".questionCard");
    await page.locator(".choiceList button, textarea").first().click();
    if (await page.locator("textarea").count()) await page.locator("textarea").first().fill("답");
    await page.locator(".questionActions .submit").click();
    const btn = page.locator(".questionActions .submit");
    log.push(`${name} related practice last button: "${await btn.textContent()}"`);
    if (!(await btn.isDisabled())) {
      await btn.click();
      await page.waitForURL(/\/learn\//, { timeout: 8000 }).catch(() => {});
      log.push(`${name} return after finish: ${page.url().replace(base, "")}`);
    } else log.push(`${name} return flow: submit disabled (practical self-assessment needed)`);
  }
  await page.goto(base + "/learn/information-security-engineer", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outDir}/${label}-${name}-theory-course.png`, fullPage: false });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  log.push(`${name} horizontal overflow on course page: ${overflow}; page errors: ${errors.length ? errors.join(" | ") : "none"}`);
  await ctx.close();
}
await browser.close();
console.log(log.join("\n"));
