"use client";

import { useMemo, useState } from "react";
import type { AiExplanationReport, AnswerValue, Question } from "@/lib/types";

interface AiExplanationProps {
  question: Question;
  learnerAnswer: AnswerValue;
  cachedExplanation?: string;
  onSave: (cacheKey: string, explanation: string) => void;
  reportStatus?: AiExplanationReport["status"];
  onReport?: (cacheKey: string, explanation: string, reason: AiExplanationReport["reason"], details: string) => void;
}

export function AiExplanation({ question, learnerAnswer, cachedExplanation, onSave, reportStatus, onReport }: AiExplanationProps) {
  const [explanation, setExplanation] = useState(cachedExplanation ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(Boolean(cachedExplanation) && reportStatus !== "hidden");
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState<AiExplanationReport["reason"]>("inaccurate");
  const [reportDetails, setReportDetails] = useState("");
  const [dailyUsage, setDailyUsage] = useState<{ remaining: number; limit: number } | null>(null);
  const cacheKey = useMemo(() => createExplanationCacheKey(question, learnerAnswer), [learnerAnswer, question]);

  async function loadExplanation() {
    if (explanation) {
      setExpanded((value) => !value);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ai-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, learnerAnswer, installationId: getInstallationId() })
      });
      const data = await response.json() as { explanation?: string; error?: string; dailyRemaining?: number; dailyLimit?: number };
      if (!response.ok || !data.explanation) throw new Error(data.error || "AI 해설을 불러오지 못했습니다.");
      setExplanation(data.explanation);
      setExpanded(true);
      if (typeof data.dailyRemaining === "number" && typeof data.dailyLimit === "number") setDailyUsage({ remaining: data.dailyRemaining, limit: data.dailyLimit });
      onSave(cacheKey, data.explanation);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "AI 해설을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function submitReport() {
    if (!onReport || !explanation || reportStatus) return;
    onReport(cacheKey, explanation, reportReason, reportDetails.trim());
    setShowReport(false);
  }

  return <div className="aiSection">
    <button className="aiExplainButton" disabled={loading} onClick={loadExplanation}>
      {loading ? "AI 해설 생성 중…" : explanation ? (expanded ? "저장된 AI 해설 접기" : "저장된 AI 해설 보기") : "AI에게 쉽게 설명받기"}
    </button>
    {error && <p className="aiError">{error}</p>}
    {dailyUsage && <p className="aiUsage">오늘 AI 해설 {dailyUsage.remaining}회 남음 · 일일 {dailyUsage.limit}회</p>}
    {reportStatus === "hidden" && explanation && <p className="aiHiddenNotice">신고 검토 후 숨김 처리된 해설입니다. 필요하면 저장된 내용을 다시 열어볼 수 있습니다.</p>}
    {expanded && explanation && <div className={`aiContent ${reportStatus === "hidden" ? "hiddenContent" : ""}`}><strong>AI 해설 · 이 기기에 저장됨</strong><p>{explanation}</p>
      {onReport && <button className="aiReportButton" disabled={Boolean(reportStatus)} onClick={() => setShowReport((value) => !value)}>{reportStatus ? (reportStatus === "open" ? "신고 검토 중" : reportStatus === "hidden" ? "숨김 처리됨" : "신고 처리됨") : "AI 해설 신고"}</button>}
      {showReport && !reportStatus && <div className="aiReportForm"><select value={reportReason} onChange={(event) => setReportReason(event.target.value as AiExplanationReport["reason"])}><option value="inaccurate">내용이 틀렸어요</option><option value="unclear">설명이 불명확해요</option><option value="too_long">해설이 너무 길어요</option><option value="other">기타</option></select><textarea value={reportDetails} onChange={(event) => setReportDetails(event.target.value)} placeholder="문제가 있는 부분을 알려 주세요 (선택)" /><button onClick={submitReport}>신고 저장</button></div>}
    </div>}
  </div>;
}

export function createExplanationCacheKey(question: Question, learnerAnswer: AnswerValue) {
  return `${question.id}:v${question.version}:${JSON.stringify(learnerAnswer)}:ko-v2`;
}

function getInstallationId() {
  const key = "certificate-practice:installation-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  window.localStorage.setItem(key, created);
  return created;
}
