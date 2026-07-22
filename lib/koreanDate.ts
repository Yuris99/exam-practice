const KOREA_OFFSET_MS = 9 * 60 * 60 * 1000;

export function koreanDateKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const korean = new Date(date.getTime() + KOREA_OFFSET_MS);
  return `${korean.getUTCFullYear()}-${String(korean.getUTCMonth() + 1).padStart(2, "0")}-${String(korean.getUTCDate()).padStart(2, "0")}`;
}

export function recentKoreanDays(count: number, now: Date = new Date()) {
  const currentKey = koreanDateKey(now);
  if (!currentKey || count <= 0) return [];
  const [year, month, day] = currentKey.split("-").map(Number);
  const anchor = new Date(Date.UTC(year, month - 1, day));
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(anchor);
    date.setUTCDate(date.getUTCDate() - (count - 1 - index));
    return { key: `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`, label: `${date.getUTCMonth() + 1}/${date.getUTCDate()}` };
  });
}

export function koreanStudyStreak(timestamps: string[], now: Date = new Date()) {
  const activeDays = new Set(timestamps.map(koreanDateKey).filter(Boolean));
  if (!activeDays.size) return 0;
  const today = koreanDateKey(now);
  if (!today) return 0;
  const [year, month, day] = today.split("-").map(Number);
  const cursor = new Date(Date.UTC(year, month - 1, day));
  if (!activeDays.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);

  let count = 0;
  while (activeDays.has(koreanDateKeyFromUtcDate(cursor))) {
    count += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return count;
}

export function formatKoreanDateTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 없음";
  return new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

export function formatKoreanDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 없음";
  return new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "numeric", day: "numeric" }).format(date);
}

function koreanDateKeyFromUtcDate(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}
