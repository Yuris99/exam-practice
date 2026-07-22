"use client";

import { useEffect, useState } from "react";
import type { Question } from "@/lib/types";

export function QuestionImage({ question }: { question: Question }) {
  const imageUrls = [...new Set([question.imageUrl, ...(question.imageUrls ?? [])].filter((url): url is string => Boolean(url)))];
  const imageKey = imageUrls.join("\n");
  const [failed, setFailed] = useState<string[]>([]);

  useEffect(() => setFailed([]), [imageKey]);

  const visibleImages = imageUrls.filter((url) => !failed.includes(url));
  if (!imageUrls.length) return null;
  return <div className={`questionImages ${visibleImages.length > 1 ? "multiple" : ""}`} aria-label="문제 참고 이미지">
    {visibleImages.map((url, index) => <figure className="questionImage" key={url}><img src={url} alt={`${question.category} 문제 참고 이미지 ${index + 1}`} loading="lazy" onError={() => setFailed((current) => [...current, url])} /></figure>)}
    {failed.map((url) => <div className="questionImageMissing" role="status" key={`missing:${url}`}><strong>이미지 파일이 없습니다</strong><span>{url}</span></div>)}
  </div>;
}
