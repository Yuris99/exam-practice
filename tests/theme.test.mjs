import assert from "node:assert/strict";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { applyTheme, themeInitializationScript, THEME_STORAGE_KEY, themeColors } from "../lib/theme.ts";

for (const { saved, systemDark, expected, blocked } of [
  { saved: "light", systemDark: true, expected: "light" },
  { saved: "dark", systemDark: false, expected: "dark" },
  { saved: null, systemDark: true, expected: "dark" },
  { saved: null, systemDark: false, expected: "light" },
  { saved: "invalid", systemDark: false, expected: "light" },
  { blocked: true, systemDark: true, expected: "dark" }
]) {
  test(`theme before paint: saved=${saved}, systemDark=${systemDark}, blocked=${!!blocked}`, () => {
    const dataset = {};
    runInNewContext(themeInitializationScript, {
      localStorage: { getItem(key) { assert.equal(key, THEME_STORAGE_KEY); if (blocked) throw new Error("Storage blocked"); return saved; } },
      window: { matchMedia(query) { assert.equal(query, "(prefers-color-scheme: dark)"); return { matches: systemDark }; } },
      document: { documentElement: { dataset } }
    });
    assert.equal(dataset.theme, expected);
  });
}

test("theme changes update browser chrome after hydration without adding metadata", () => {
  const previousDocument = globalThis.document;
  const dataset = {};
  let metaColor;
  globalThis.document = { documentElement: { dataset }, querySelector() { return { setAttribute(name, value) { assert.equal(name, "content"); metaColor = value; } }; } };
  try {
    for (const theme of ["dark", "light"]) {
      applyTheme(theme);
      assert.equal(dataset.theme, theme);
      assert.equal(metaColor, themeColors[theme]);
    }
  } finally { globalThis.document = previousDocument; }
});
