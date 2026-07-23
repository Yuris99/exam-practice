"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { loadAdminReports, saveQuestionOverride, updateCentralReportStatus, type AdminAiReport, type AdminQuestionReport } from "@/lib/supabase";
import { formatKoreanDateTime } from "@/lib/koreanDate";
import type { Question } from "@/lib/types";

export function AdminDashboard({ userId, onQuestionSaved }: { userId: string; onQuestionSaved: (question: Question) => void }) {
  const [questionReports, setQuestionReports] = useState<AdminQuestionReport[]>([]);
  const [aiReports, setAiReports] = useState<AdminAiReport[]>([]);
  const [section, setSection] = useState<"question" | "ai">("question");
  const [showResolved, setShowResolved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<{ reportId: string; question: Question; prompt: string; explanation: string } | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    setMessage("");
    try {
      const data = await loadAdminReports();
      setQuestionReports(data.questionReports);
      setAiReports(data.aiReports);
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
    const question = { ...editing.question, prompt, explanation, version: editing.question.version + 1 };
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

  const visibleQuestions = questionReports.filter((report) => showResolved || report.status === "open");
  const visibleAi = aiReports.filter((report) => showResolved || report.status === "open");

  return <section>
    <div className="hero"><p>관리자 전용</p><h1>통합 관리자</h1><span>전체 사용자의 문제 신고와 AI 해설 신고를 처리합니다.</span></div>
    <div className="adminSummary summary resultSummary">
      <div><strong>{questionReports.filter((report) => report.status === "open").length}</strong><span>미처리 문제 신고</span></div>
      <div><strong>{aiReports.filter((report) => report.status === "open").length}</strong><span>미처리 AI 신고</span></div>
      <div><strong>{questionReports.length}</strong><span>전체 문제 신고</span></div>
      <div><strong>{aiReports.length}</strong><span>전체 AI 신고</span></div>
    </div>
    <div className="managerTabs adminTabs">
      <button className={section === "question" ? "active" : ""} onClick={() => setSection("question")}>문제 신고 <small>{visibleQuestions.length}</small></button>
      <button className={section === "ai" ? "active" : ""} onClick={() => setSection("ai")}>AI 해설 신고 <small>{visibleAi.length}</small></button>
      <button className={showResolved ? "active" : ""} onClick={() => setShowResolved((value) => !value)}>{showResolved ? "전체 표시" : "미처리만"}</button>
    </div>
    {message && <p className="managerMessage">{message}</p>}
    {loading ? <div className="panel emptyManager">신고를 불러오는 중…</div> : section === "question"
      ? <ReportList empty="표시할 문제 신고가 없습니다.">{visibleQuestions.map((report) => <article className={`panel adminReport ${report.status}`} key={report.id}>
          <ReportHeader status={report.status} createdAt={report.createdAt} userId={report.userId} />
          <strong>{report.questionSnapshot?.prompt ?? report.questionId}</strong>
          <p>{questionReason(report.reason)} · 문제 v{report.questionVersion}</p>
          <p>{report.details || "추가 설명 없음"}</p>
          {editing?.reportId === report.id ? <div className="adminQuestionEditor"><label>문제 내용<textarea value={editing.prompt} onChange={(event) => setEditing((current) => current ? { ...current, prompt: event.target.value } : current)} /></label><label>공식 해설<textarea value={editing.explanation} onChange={(event) => setEditing((current) => current ? { ...current, explanation: event.target.value } : current)} /></label><div className="managedActions"><button onClick={saveReportedQuestion}>전체 반영 후 처리</button><button onClick={() => setEditing(null)}>취소</button></div></div> : <div className="managedActions">{report.questionSnapshot && <button onClick={() => setEditing({ reportId: report.id, question: report.questionSnapshot!, prompt: report.questionSnapshot!.prompt, explanation: report.questionSnapshot!.explanation })}>문제 수정</button>}<button disabled={report.status === "resolved"} onClick={() => updateQuestion(report.id, "resolved")}>처리 완료</button>{report.status === "resolved" && <button onClick={() => updateQuestion(report.id, "open")}>다시 열기</button>}</div>}
        </article>)}</ReportList>
      : <ReportList empty="표시할 AI 해설 신고가 없습니다.">{visibleAi.map((report) => <article className={`panel adminReport ${report.status}`} key={report.id}>
          <ReportHeader status={report.status} createdAt={report.createdAt} userId={report.userId} />
          <strong>{report.questionSnapshot?.prompt ?? report.questionId}</strong>
          <p>{aiReason(report.reason)} · 문제 v{report.questionVersion}</p>
          <blockquote>{report.explanationSnapshot}</blockquote>
          {report.details && <p>신고 내용: {report.details}</p>}
          <div className="managedActions"><button disabled={report.status === "resolved"} onClick={() => updateAi(report.id, "resolved")}>확인 완료</button><button className="delete" disabled={report.status === "hidden"} onClick={() => updateAi(report.id, "hidden")}>해설 숨김</button>{report.status !== "open" && <button onClick={() => updateAi(report.id, "open")}>다시 열기</button>}</div>
        </article>)}</ReportList>}
  </section>;
}

function ReportList({ children, empty }: { children: ReactNode[]; empty: string }) {
  return children.length ? <div className="adminReportList">{children}</div> : <div className="panel emptyManager">{empty}</div>;
}

function ReportHeader({ status, createdAt, userId }: { status: string; createdAt: string; userId: string }) {
  return <div className="adminReportMeta"><span className={`statusBadge ${status === "open" ? "draft" : status === "hidden" ? "archived" : "published"}`}>{status === "open" ? "미처리" : status === "hidden" ? "숨김" : "처리됨"}</span><span>{formatKoreanDateTime(createdAt)}</span><span title={userId}>사용자 {userId.slice(0, 8)}</span></div>;
}

function questionReason(reason: AdminQuestionReport["reason"]) {
  return reason === "incorrect_answer" ? "정답 오류" : reason === "question_error" ? "문제 오류" : reason === "insufficient_explanation" ? "해설 부족" : "기타";
}

function aiReason(reason: AdminAiReport["reason"]) {
  return reason === "inaccurate" ? "내용 오류" : reason === "unclear" ? "불명확한 설명" : reason === "too_long" ? "너무 긴 해설" : "기타";
}
