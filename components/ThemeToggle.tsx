"use client";

import { useEffect, useState } from "react";
import { applyTheme, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    function syncTheme() {
      const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      applyTheme(current);
      setTheme(current);
    }
    syncTheme();
    function onStorage(event: StorageEvent) {
      if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
      applyTheme(event.newValue === "dark" || event.newValue === "light" ? event.newValue : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      syncTheme();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    applyTheme(next);
    setTheme(next);
    try { window.localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* The theme still works for this visit. */ }
  }

  const label = theme === "light" ? "다크 모드로 전환" : "화이트 모드로 전환";
  return <button type="button" className="themeToggle" onClick={toggle} aria-label={label} title={label}>
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {theme === "light" ? <path d="M20.7 13.1A8.6 8.6 0 0 1 10.9 3.3a8.6 8.6 0 1 0 9.8 9.8Z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>}
    </svg><span>{theme === "light" ? "다크 모드" : "화이트 모드"}</span>
  </button>;
}
