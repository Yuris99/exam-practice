"use client";

import { useEffect, useState } from "react";

export function PwaStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // The app remains fully usable when service workers are unavailable.
      });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return <span className={online ? "localBadge" : "localBadge offline"}>{online ? "계정 없이 이 기기에 저장" : "오프라인 · 로컬 저장 중"}</span>;
}
