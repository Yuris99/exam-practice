export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "certificate-practice:theme";
export const themeColors = { light: "#f1f3f6", dark: "#101615" };

// Runs before paint; a blocked storage API must not prevent the system fallback.
export const themeInitializationScript = `(() => {
  let saved;
  try { saved = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}); } catch {}
  const theme = saved === "light" || saved === "dark" ? saved : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
})();`;

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColors[theme]);
}
