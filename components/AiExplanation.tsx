"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import type { AiExplanationReport, AnswerValue, Question } from "@/lib/types";
import { defaultAiProviderSettings, loadAiExplanationOverride, loadAiProviderSettings, type AiProviderSettings } from "@/lib/supabase";

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
  const [provider, setProvider] = useState<"gemini" | "openai">("gemini");
  const [providers, setProviders] = useState<AiProviderSettings>(defaultAiProviderSettings);
  const cacheKey = useMemo(() => createExplanationCacheKey(question, learnerAnswer, provider), [learnerAnswer, provider, question]);

  useEffect(() => { loadAiProviderSettings().then(setProviders).catch(() => undefined); }, []);
  useEffect(() => {
    loadAiExplanationOverride(cacheKey).then((override) => {
      if (!override) return;
      setExplanation(override);
      setExpanded(true);
    }).catch(() => undefined);
  }, [cacheKey]);

  async function loadExplanation(selectedProvider = provider) {
    if (explanation && selectedProvider === provider) {
      setExpanded((value) => !value);
      return;
    }
    if (selectedProvider !== provider) setExplanation("");
    setLoading(true);
    setProvider(selectedProvider);
    setError("");
    try {
      const response = await fetch("/api/ai-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, learnerAnswer, installationId: getInstallationId(), provider: selectedProvider })
      });
      const data = await response.json() as { explanation?: string; error?: string; dailyRemaining?: number; dailyLimit?: number };
      if (!response.ok || !data.explanation) throw new Error(data.error || "AI 해설을 불러오지 못했습니다.");
      setExplanation(data.explanation);
      setExpanded(true);
      if (typeof data.dailyRemaining === "number" && typeof data.dailyLimit === "number") setDailyUsage({ remaining: data.dailyRemaining, limit: data.dailyLimit });
      onSave(createExplanationCacheKey(question, learnerAnswer, selectedProvider), data.explanation);
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
    {providers.geminiEnabled && <button className="aiExplainButton" disabled={loading} onClick={() => loadExplanation("gemini")}>
      {loading ? "AI 해설 생성 중…" : explanation ? (expanded ? "저장된 AI 해설 접기" : "저장된 AI 해설 보기") : "AI에게 쉽게 설명받기"}
    </button>}
    {providers.openaiEnabled && <button className="aiExplainButton aiOpenAiButton" disabled={loading} onClick={() => loadExplanation("openai")}>{loading && provider === "openai" ? "GPT 해설 생성 중…" : "GPT에게 설명받기"}</button>}
    {!providers.geminiEnabled && !providers.openaiEnabled && <p className="aiUsage">현재 사용할 수 있는 AI 해설이 없습니다.</p>}
    {error && <p className="aiError">{error}</p>}
    {dailyUsage && <p className="aiUsage">오늘 AI 해설 {dailyUsage.remaining}회 남음 · 일일 {dailyUsage.limit}회</p>}
    {reportStatus === "hidden" && explanation && <p className="aiHiddenNotice">신고 검토 후 숨김 처리된 해설입니다. 필요하면 저장된 내용을 다시 열어볼 수 있습니다.</p>}
    {expanded && explanation && <div className={`aiContent ${reportStatus === "hidden" ? "hiddenContent" : ""}`}><strong>AI 해설 · 저장됨</strong><div className="aiMarkdown"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{explanation}</ReactMarkdown></div>
      {onReport && <button className="aiReportButton" disabled={Boolean(reportStatus)} onClick={() => setShowReport((value) => !value)}>{reportStatus ? (reportStatus === "open" ? "신고 검토 중" : reportStatus === "hidden" ? "숨김 처리됨" : "신고 처리됨") : "AI 해설 신고"}</button>}
      {showReport && !reportStatus && <div className="aiReportForm"><select value={reportReason} onChange={(event) => setReportReason(event.target.value as AiExplanationReport["reason"])}><option value="inaccurate">내용이 틀렸어요</option><option value="unclear">설명이 불명확해요</option><option value="too_long">해설이 너무 길어요</option><option value="other">기타</option></select><textarea value={reportDetails} onChange={(event) => setReportDetails(event.target.value)} placeholder="문제가 있는 부분을 알려 주세요 (선택)" /><button onClick={submitReport}>신고 저장</button></div>}
    </div>}
  </div>;
}

export function createExplanationCacheKey(question: Question, learnerAnswer: AnswerValue, provider: "gemini" | "openai" = "gemini") {
  return `${question.id}:v${question.version}:${JSON.stringify(learnerAnswer)}:ko-v4-${provider}-markdown`;
}

function getInstallationId() {
  const key = "certificate-practice:installation-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  window.localStorage.setItem(key, created);
  return created;
}
