"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { defaultAiProviderSettings, loadAdminReports, loadAiProviderSettings, loadAiUsageLogs, saveAiExplanationOverride, saveAiProviderSettings, saveQuestionOverride, updateCentralReportStatus, type AdminAiReport, type AdminQuestionReport, type AiProviderSettings, type AiUsageLog } from "@/lib/supabase";
import { formatKoreanDateTime } from "@/lib/koreanDate";
import { certificateLabels, examTypeLabel } from "@/lib/certificates";
import type { ExamType, Question } from "@/lib/types";

export function AdminDashboard({ userId, questions, onQuestionSaved }: { userId: string; questions: Question[]; onQuestionSaved: (question: Question) => void }) {
  const [questionReports, setQuestionReports] = useState<AdminQuestionReport[]>([]);
  const [aiReports, setAiReports] = useState<AdminAiReport[]>([]);
  const [section, setSection] = useState<"question" | "ai" | "settings">("question");
  const [showResolved, setShowResolved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<{ reportId: string; question: Question; prompt: string; explanation: string; choices: string[]; correctChoiceIndex: number; imageUrls: string[] } | null>(null);
  const [aiSettings, setAiSettings] = useState<AiProviderSettings>(defaultAiProviderSettings);
  const [aiEditing, setAiEditing] = useState<{ reportId: string; cacheKey: string; questionId: string; explanation: string } | null>(null);
  const [usageLogs, setUsageLogs] = useState<AiUsageLog[]>([]);
  const [certificateFilter, setCertificateFilter] = useState("all");
  const [examTypeFilter, setExamTypeFilter] = useState<"all" | ExamType>("all");

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    setMessage("");
    try {
      const [data, settings, usage] = await Promise.all([loadAdminReports(), loadAiProviderSettings(), loadAiUsageLogs()]);
      setQuestionReports(data.questionReports);
      setAiReports(data.aiReports);
      setAiSettings(settings);
      setUsageLogs(usage);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "신고를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function updateQuestion(id: string, status: "open" | "resolved") {
    try {
      await updateCentralReportStatus("question", id, status);
      setQuestionReports((current) => current.map((report) => report.id === id ? { ...report, status } : report));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "상태를 변경하지 못했습니다.");
    }
  }

  async function updateAi(id: string, status: "open" | "resolved" | "hidden") {
    try {
      await updateCentralReportStatus("ai", id, status);
      setAiReports((current) => current.map((report) => report.id === id ? { ...report, status } : report));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "상태를 변경하지 못했습니다.");
    }
  }

  async function saveReportedQuestion() {
    if (!editing) return;
    const prompt = editing.prompt.trim();
    const explanation = editing.explanation.trim();
    if (!prompt) {
      setMessage("문제 내용을 입력해 주세요.");
      return;
    }
    if (editing.question.examType === "WRITTEN_CBT" && (editing.choices.some((choice) => !choice.trim()) || editing.correctChoiceIndex >= editing.choices.length)) {
      setMessage("모든 보기와 정답을 올바르게 입력해 주세요.");
      return;
    }
    const images = editing.imageUrls.map((url) => url.trim()).filter(Boolean);
    const question: Question = editing.question.examType === "WRITTEN_CBT"
      ? { ...editing.question, prompt, explanation, choices: editing.choices.map((choice) => choice.trim()), correctChoiceIndex: editing.correctChoiceIndex, imageUrl: images[0], imageUrls: images.slice(1), version: editing.question.version + 1 }
      : { ...editing.question, prompt, explanation, imageUrl: images[0], imageUrls: images.slice(1), version: editing.question.version + 1 };
    try {
      await saveQuestionOverride(userId, question);
      onQuestionSaved(question);
      await updateQuestion(editing.reportId, "resolved");
      setEditing(null);
      setMessage("문제를 전체 사용자에게 반영하고 신고를 처리했습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "문제를 저장하지 못했습니다.");
    }
  }

  async function saveReportedAiExplanation() {
    if (!aiEditing?.explanation.trim()) return setMessage("AI 해설을 입력해 주세요.");
    try {
      await saveAiExplanationOverride(userId, aiEditing.cacheKey, aiEditing.questionId, aiEditing.explanation.trim());
      await updateAi(aiEditing.reportId, "resolved");
      setAiEditing(null);
      setMessage("교정한 AI 해설을 전체 사용자에게 반영했습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "AI 해설을 저장하지 못했습니다.");
    }
  }

  async function updateAiSettings(next: AiProviderSettings) {
    setAiSettings(next);
    try {
      await saveAiProviderSettings(userId, next);
      setMessage("AI 제공자 설정을 저장했습니다.");
    } catch (error) {
      setAiSettings(aiSettings);
      setMessage(error instanceof Error ? error.message : "AI 설정을 저장하지 못했습니다.");
    }
  }

  function beginEditing(report: AdminQuestionReport) {
    const question = report.questionSnapshot ?? questions.find((item) => item.id === report.questionId);
    if (!question) return setMessage("현재 문제은행에서 해당 문제를 찾지 못했습니다.");
    setEditing({ reportId: report.id, question, prompt: question.prompt, explanation: question.explanation, choices: question.examType === "WRITTEN_CBT" ? [...question.choices] : [], correctChoiceIndex: question.examType === "WRITTEN_CBT" ? question.correctChoiceIndex : 0, imageUrls: [question.imageUrl, ...(question.imageUrls ?? [])].filter((url): url is string => Boolean(url)) });
  }

  async function addImageFiles(files: FileList | null) {
    if (!editing || !files?.length) return;
    const urls = await Promise.all([...files].map(fileToDataUrl));
    setEditing((current) => current ? { ...current, imageUrls: [...current.imageUrls, ...urls] } : current);
  }

  const questionMap = new Map(questions.map((question) => [question.id, question]));
  const matchesExam = (report: AdminQuestionReport | AdminAiReport) => {
    const question = report.questionSnapshot ?? questionMap.get(report.questionId);
    if (!question) return certificateFilter === "all" && examTypeFilter === "all";
    return (certificateFilter === "all" || question.certificateId === certificateFilter) && (examTypeFilter === "all" || question.examType === examTypeFilter);
  };
  const filteredQuestions = questionReports.filter(matchesExam);
  const filteredAi = aiReports.filter(matchesExam);
  const visibleQuestions = filteredQuestions.filter((report) => showResolved || report.status === "open");
  const visibleAi = filteredAi.filter((report) => showResolved || report.status === "open");
  const certificateIds = [...new Set(questions.map((question) => question.certificateId))].sort((a, b) => (certificateLabels[a] ?? a).localeCompare(certificateLabels[b] ?? b, "ko"));
  const usage = summarizeUsage(usageLogs);

  return <section>
    <div className="hero"><p>관리자 전용</p><h1>통합 관리자</h1><span>전체 사용자의 문제 신고와 AI 해설 신고를 처리합니다.</span></div>
    <div className="adminSummary summary resultSummary">
      <div><strong>{filteredQuestions.filter((report) => report.status === "open").length}</strong><span>미처리 문제 신고</span></div>
      <div><strong>{filteredAi.filter((report) => report.status === "open").length}</strong><span>미처리 AI 신고</span></div>
      <div><strong>{filteredQuestions.length}</strong><span>선택 시험 문제 신고</span></div>
      <div><strong>{filteredAi.length}</strong><span>선택 시험 AI 신고</span></div>
    </div>
    <div className="panel adminExamFilters"><label>자격증<select value={certificateFilter} onChange={(event) => setCertificateFilter(event.target.value)}><option value="all">전체 자격증</option>{certificateIds.map((id) => <option value={id} key={id}>{certificateLabels[id] ?? id}</option>)}</select></label><label>시험 유형<select value={examTypeFilter} onChange={(event) => setExamTypeFilter(event.target.value as "all" | ExamType)}><option value="all">전체 유형</option><option value="WRITTEN_CBT">객관식 / 필기 CBT</option><option value="PRACTICAL_WRITTEN_RESPONSE">단답형 / 실기 필답형</option></select></label></div>
    <div className="managerTabs adminTabs">
      <button className={section === "question" ? "active" : ""} onClick={() => setSection("question")}>문제 신고 <small>{visibleQuestions.length}</small></button>
      <button className={section === "ai" ? "active" : ""} onClick={() => setSection("ai")}>AI 해설 신고 <small>{visibleAi.length}</small></button>
      <button className={section === "settings" ? "active" : ""} onClick={() => setSection("settings")}>AI 설정</button>
      <button className={showResolved ? "active" : ""} onClick={() => setShowResolved((value) => !value)}>{showResolved ? "전체 표시" : "미처리만"}</button>
    </div>
    {message && <p className="managerMessage">{message}</p>}
    {loading ? <div className="panel emptyManager">신고를 불러오는 중…</div> : section === "settings"
      ? <div className="adminSettingsGrid"><div className="panel adminAiSettings"><h2>AI 해설 제공자</h2><p>기본값은 기존 사용자와 같은 Gemini 사용, GPT 미사용입니다.</p><label><input type="checkbox" checked={aiSettings.geminiEnabled} onChange={(event) => updateAiSettings({ ...aiSettings, geminiEnabled: event.target.checked })} /> Gemini 해설 사용</label><label><input type="checkbox" checked={aiSettings.openaiEnabled} onChange={(event) => updateAiSettings({ ...aiSettings, openaiEnabled: event.target.checked })} /> GPT 해설 사용 · GMS / gpt-5-nano</label></div><div className="panel aiUsagePanel"><div className="usageTitle"><h2>AI 토큰 사용량</h2><button onClick={refresh}>새로고침</button></div><div className="summary resultSummary"><div><strong>{usage.today.total.toLocaleString()}</strong><span>오늘 총 토큰</span></div><div><strong>{usage.month.total.toLocaleString()}</strong><span>이번 달 총 토큰</span></div><div><strong>{usage.all.prompt.toLocaleString()}</strong><span>누적 입력</span></div><div><strong>{usage.all.completion.toLocaleString()}</strong><span>누적 출력</span></div></div><div className="usageModels">{usage.models.map((item) => <div key={`${item.provider}-${item.model}`}><strong>{item.provider} · {item.model}</strong><span>{item.requests.toLocaleString()}회 · 입력 {item.prompt.toLocaleString()} · 출력 {item.completion.toLocaleString()} · 합계 {item.total.toLocaleString()}</span></div>)}</div><small>최근 최대 5,000건 기준 · GMS 잔여 크레딧은 GMS 포털에서 확인해야 합니다.</small></div></div>
      : section === "question"
      ? <ReportList empty="표시할 문제 신고가 없습니다.">{visibleQuestions.map((report) => <article className={`panel adminReport ${report.status}`} key={report.id}>
          <ReportHeader status={report.status} createdAt={report.createdAt} userId={report.userId} />
          <QuestionReportTitle report={report} question={report.questionSnapshot ?? questionMap.get(report.questionId)} />
          <p>{questionReason(report.reason)} · 문제 v{report.questionVersion}</p>
          <p>{report.details || "추가 설명 없음"}</p>
          {editing?.reportId === report.id ? <div className="adminQuestionEditor"><label>문제 내용<textarea value={editing.prompt} onChange={(event) => setEditing((current) => current ? { ...current, prompt: event.target.value } : current)} /></label>{editing.question.examType === "WRITTEN_CBT" && <fieldset><legend>보기 및 정답</legend>{editing.choices.map((choice, index) => <label className="adminChoiceEditor" key={index}><input type="radio" name={`correct-${report.id}`} checked={editing.correctChoiceIndex === index} onChange={() => setEditing((current) => current ? { ...current, correctChoiceIndex: index } : current)} /><input value={choice} onChange={(event) => setEditing((current) => current ? { ...current, choices: current.choices.map((item, choiceIndex) => choiceIndex === index ? event.target.value : item) } : current)} /><button type="button" className="delete" disabled={editing.choices.length <= 2} onClick={() => setEditing((current) => current ? { ...current, choices: current.choices.filter((_, choiceIndex) => choiceIndex !== index), correctChoiceIndex: Math.min(current.correctChoiceIndex, current.choices.length - 2) } : current)}>삭제</button></label>)}<button type="button" onClick={() => setEditing((current) => current ? { ...current, choices: [...current.choices, ""] } : current)}>보기 추가</button></fieldset>}<label>공식 해설<textarea value={editing.explanation} onChange={(event) => setEditing((current) => current ? { ...current, explanation: event.target.value } : current)} /></label><fieldset><legend>문제 이미지</legend>{editing.imageUrls.map((url, index) => <div className="adminImageEditor" key={index}>{url && <img src={url} alt={`문제 이미지 ${index + 1}`} />}<input value={url.startsWith("data:") ? `업로드 이미지 ${index + 1}` : url} readOnly={url.startsWith("data:")} onChange={(event) => setEditing((current) => current ? { ...current, imageUrls: current.imageUrls.map((item, imageIndex) => imageIndex === index ? event.target.value : item) } : current)} /><button type="button" className="delete" onClick={() => setEditing((current) => current ? { ...current, imageUrls: current.imageUrls.filter((_, imageIndex) => imageIndex !== index) } : current)}>삭제</button></div>)}<button type="button" onClick={() => setEditing((current) => current ? { ...current, imageUrls: [...current.imageUrls, ""] } : current)}>URL 추가</button><label className="imageUploadButton">파일 추가<input type="file" accept="image/*" multiple onChange={(event) => addImageFiles(event.target.files)} /></label></fieldset><div className="managedActions"><button onClick={saveReportedQuestion}>전체 반영 후 처리</button><button onClick={() => setEditing(null)}>취소</button></div></div> : <div className="managedActions"><button onClick={() => beginEditing(report)}>문제 수정</button><button disabled={report.status === "resolved"} onClick={() => updateQuestion(report.id, "resolved")}>처리 완료</button>{report.status === "resolved" && <button onClick={() => updateQuestion(report.id, "open")}>다시 열기</button>}</div>}
        </article>)}</ReportList>
      : <ReportList empty="표시할 AI 해설 신고가 없습니다.">{visibleAi.map((report) => <article className={`panel adminReport ${report.status}`} key={report.id}>
          <ReportHeader status={report.status} createdAt={report.createdAt} userId={report.userId} />
          <QuestionReportTitle report={report} question={report.questionSnapshot ?? questionMap.get(report.questionId)} />
          <p>{aiReason(report.reason)} · 문제 v{report.questionVersion}</p>
          {aiEditing?.reportId === report.id ? <div className="adminQuestionEditor"><label>AI 해설 수정<textarea value={aiEditing.explanation} onChange={(event) => setAiEditing((current) => current ? { ...current, explanation: event.target.value } : current)} /></label><div className="managedActions"><button onClick={saveReportedAiExplanation}>수정본 반영 후 처리</button><button onClick={() => setAiEditing(null)}>취소</button></div></div> : <blockquote>{report.explanationSnapshot}</blockquote>}
          {report.details && <p>신고 내용: {report.details}</p>}
          <div className="managedActions"><button onClick={() => setAiEditing({ reportId: report.id, cacheKey: report.cacheKey, questionId: report.questionId, explanation: report.explanationSnapshot })}>AI 해설 수정</button><button disabled={report.status === "resolved"} onClick={() => updateAi(report.id, "resolved")}>확인 완료</button><button className="delete" disabled={report.status === "hidden"} onClick={() => updateAi(report.id, "hidden")}>해설 숨김</button>{report.status !== "open" && <button onClick={() => updateAi(report.id, "open")}>다시 열기</button>}</div>
        </article>)}</ReportList>}
  </section>;
}

function ReportList({ children, empty }: { children: ReactNode[]; empty: string }) {
  return children.length ? <div className="adminReportList">{children}</div> : <div className="panel emptyManager">{empty}</div>;
}

function ReportHeader({ status, createdAt, userId }: { status: string; createdAt: string; userId: string }) {
  return <div className="adminReportMeta"><span className={`statusBadge ${status === "open" ? "draft" : status === "hidden" ? "archived" : "published"}`}>{status === "open" ? "미처리" : status === "hidden" ? "숨김" : "처리됨"}</span><span>{formatKoreanDateTime(createdAt)}</span><span title={userId}>사용자 {userId.slice(0, 8)}</span></div>;
}

function QuestionReportTitle({ report, question }: { report: AdminQuestionReport | AdminAiReport; question?: Question }) {
  return <div className="adminReportTitle"><small>{question ? `${certificateLabels[question.certificateId] ?? question.certificateId} · ${examTypeLabel(question.certificateId, question.examType)}` : "시험 정보 없음"}</small><strong>{question?.prompt ?? report.questionId}</strong></div>;
}

function questionReason(reason: AdminQuestionReport["reason"]) {
  return reason === "incorrect_answer" ? "정답 오류" : reason === "question_error" ? "문제 오류" : reason === "insufficient_explanation" ? "해설 부족" : "기타";
}

function aiReason(reason: AdminAiReport["reason"]) {
  return reason === "inaccurate" ? "내용 오류" : reason === "unclear" ? "불명확한 설명" : reason === "too_long" ? "너무 긴 해설" : "기타";
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (file.size > 1_000_000) return reject(new Error("이미지는 파일당 1MB 이하여야 합니다."));
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("이미지를 읽지 못했습니다."));
    reader.readAsDataURL(file);
  });
}

function summarizeUsage(logs: AiUsageLog[]) {
  const now = new Date();
  const todayKey = now.toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
  const monthKey = todayKey.slice(0, 7);
  const sum = (items: AiUsageLog[]) => items.reduce((total, log) => ({ prompt: total.prompt + log.promptTokens, completion: total.completion + log.completionTokens, total: total.total + log.totalTokens }), { prompt: 0, completion: 0, total: 0 });
  const grouped = new Map<string, { provider: string; model: string; requests: number; prompt: number; completion: number; total: number }>();
  logs.forEach((log) => {
    const key = `${log.provider}:${log.model}`;
    const current = grouped.get(key) ?? { provider: log.provider, model: log.model, requests: 0, prompt: 0, completion: 0, total: 0 };
    current.requests += 1;
    current.prompt += log.promptTokens;
    current.completion += log.completionTokens;
    current.total += log.totalTokens;
    grouped.set(key, current);
  });
  return {
    today: sum(logs.filter((log) => new Date(log.createdAt).toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" }) === todayKey)),
    month: sum(logs.filter((log) => new Date(log.createdAt).toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" }).startsWith(monthKey))),
    all: sum(logs),
    models: [...grouped.values()].sort((a, b) => b.total - a.total)
  };
}
