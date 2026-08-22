"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { TestMode } from "@/components/TestMode";
import { QuestionManager } from "@/components/QuestionManager";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AiExplanation, createExplanationCacheKey } from "@/components/AiExplanation";
import { PwaStatus } from "@/components/PwaStatus";
import { QuestionTools } from "@/components/QuestionTools";
import { QuestionContent } from "@/components/QuestionContent";
import { QuestionMetadata } from "@/components/QuestionMetadata";
import { questions } from "@/lib/questions";
import { emptyStudyState, loadStudyState, mergeStudyStates, saveStudyState } from "@/lib/storage";
import { checkIsAdmin, getSupabaseClient, loadCloudStudyState, loadQuestionOverrides, saveCloudStudyState, signInWithGoogle, signOut, syncCentralReports } from "@/lib/supabase";
import { formatKoreanDateTime, koreanDateKey, koreanStudyStreak, recentKoreanDays } from "@/lib/koreanDate";
import { matchesQuestionMetadata, questionFilterOptions } from "@/lib/questionFilters";
import { shuffled } from "@/lib/testSelection";
import { certificateLabels, examTypeLabel } from "@/lib/certificates";
import type { User } from "@supabase/supabase-js";
import type { AiExplanationReport, ExamType, Question, SavedAnswer, StudyState, TestResult } from "@/lib/types";

type View = "home" | "practice" | "question" | "test" | "history" | "bookmarks" | "manage" | "admin";
type PracticeFilter = "all" | "unsolved" | "incorrect" | "bookmarked";
type DifficultyFilter = "all" | Question["difficulty"];
const CERTIFICATE_STORAGE_KEY = "certificate-practice:selected-certificate";
const navItems: Array<{ view: View; icon: string; label: string }> = [
  { view: "home", icon: "⌂", label: "홈" },
  { view: "practice", icon: "✎", label: "연습" },
  { view: "test", icon: "▣", label: "시험" },
  { view: "history", icon: "▥", label: "통계" },
  { view: "bookmarks", icon: "♡", label: "북마크" }
];

export default function HomePage() {
  const [view, setView] = useState<View>("home");
  const [examType, setExamType] = useState<ExamType>("WRITTEN_CBT");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [draftAnswer, setDraftAnswer] = useState<number | string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [testResultToOpen, setTestResultToOpen] = useState<string | null>(null);
  const [study, setStudy] = useState<StudyState>(emptyStudyState);
  const [ready, setReady] = useState(false);
  const [storageStatus, setStorageStatus] = useState<"saved" | "saving" | "error">("saved");
  const [storageError, setStorageError] = useState("");
  const [account, setAccount] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [cloudReady, setCloudReady] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [questionOverrides, setQuestionOverrides] = useState<Question[]>([]);
  const [selectedCertificateId, setSelectedCertificateId] = useState("information-processing-engineer");
  const latestStudy = useRef(study);
  latestStudy.current = study;

  useEffect(() => {
    setStudy(loadStudyState());
    setReady(true);
    loadQuestionOverrides().then(setQuestionOverrides).catch(() => {
      // Bundled questions remain available if public overrides cannot be loaded.
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    setStorageStatus("saving");
    const timeout = window.setTimeout(async () => {
      const result = saveStudyState(study);
      if (!result.ok) {
        setStorageStatus("error");
        setStorageError(result.error ?? "");
        return;
      }
      try {
        if (account && cloudReady) {
          await saveCloudStudyState(account.id, study);
          await syncCentralReports(account.id, study, [...questions, ...study.customQuestions]);
        }
        setStorageStatus("saved");
        setStorageError("");
      } catch (error) {
        const message = readableError(error, "클라우드 저장에 실패했습니다.");
        setStorageStatus("error");
        setStorageError(message);
      }
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [account, cloudReady, ready, study]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setAuthReady(true);
      return;
    }
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setAuthError(readableError(error, "저장된 로그인 정보를 불러오지 못했습니다."));
        setAccount(null);
      } else {
        setAccount(data.session?.user ?? null);
      }
      setAuthReady(true);
    }).catch((error) => {
      if (!active) return;
      setAuthError(readableError(error, "저장된 로그인 정보를 불러오지 못했습니다."));
      setAccount(null);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccount(session?.user ?? null);
      setAuthReady(true);
      if (!session) setCloudReady(false);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!ready || !account) return;
    let cancelled = false;
    setCloudReady(false);
    loadCloudStudyState(account.id).then(async (cloudState) => {
      if (cancelled) return;
      const localState = loadStudyState();
      const merged = cloudState ? mergeStudyStates(localState, cloudState) : localState;
      setStudy(merged);
      saveStudyState(merged);
      await saveCloudStudyState(account.id, merged);
      if (!cancelled) {
        setCloudReady(true);
        setAuthError("");
      }
    }).catch((error) => {
      if (!cancelled) {
        const message = readableError(error, "클라우드 데이터를 불러오지 못했습니다.");
        setAuthError(message);
        setStorageError(message);
        setStorageStatus("error");
        setCloudReady(false);
      }
    });
    return () => { cancelled = true; };
  }, [account, ready]);

  useEffect(() => {
    if (!account) {
      setIsAdmin(false);
      if (view === "admin") setView("home");
      return;
    }
    checkIsAdmin(account.id).then(setIsAdmin).catch(() => setIsAdmin(false));
  }, [account, view]);

  useEffect(() => {
    function flushLatestState() {
      if (document.visibilityState === "hidden") saveStudyState(latestStudy.current);
    }
    function flushBeforeUnload() {
      saveStudyState(latestStudy.current);
    }
    document.addEventListener("visibilitychange", flushLatestState);
    window.addEventListener("beforeunload", flushBeforeUnload);
    return () => {
      document.removeEventListener("visibilitychange", flushLatestState);
      window.removeEventListener("beforeunload", flushBeforeUnload);
    };
  }, []);

  async function retryStorage() {
    setStorageStatus("saving");
    const result = saveStudyState(study);
    if (!result.ok) {
      setStorageStatus("error");
      setStorageError(result.error ?? "");
      return;
    }
    try {
      if (account) await saveCloudStudyState(account.id, study);
      setCloudReady(Boolean(account));
      setStorageStatus("saved");
      setStorageError("");
    } catch (error) {
      setStorageStatus("error");
      setStorageError(readableError(error, "클라우드 저장에 실패했습니다."));
    }
  }

  async function toggleAccount() {
    setAuthError("");
    try {
      if (account) {
        await signOut();
        setAccount(null);
        setCloudReady(false);
      } else {
        await signInWithGoogle();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "로그인 처리에 실패했습니다.";
      setAuthError(message);
      setStorageError(message);
      setStorageStatus("error");
    }
  }

  const allQuestionBank = useMemo(() => {
    const overrides = new Map(questionOverrides.map((question) => [question.id, question]));
    const base = [...questions, ...study.customQuestions];
    const baseIds = new Set(base.map((question) => question.id));
    return [...base.map((question) => overrides.get(question.id) ?? question), ...questionOverrides.filter((question) => !baseIds.has(question.id))];
  }, [questionOverrides, study.customQuestions]);
  const certificateOptions = useMemo(() => [...new Set(allQuestionBank.map((question) => question.certificateId))].map((id) => ({ id, label: certificateLabels[id] ?? id })), [allQuestionBank]);
  const selectedQuestionBank = useMemo(() => allQuestionBank.filter((question) => question.certificateId === selectedCertificateId), [allQuestionBank, selectedCertificateId]);
  const questionBank = useMemo(() => selectedQuestionBank.filter((question) => (question.publicationStatus ?? "published") === "published"), [selectedQuestionBank]);
  const activeQuestions = useMemo(
    () => (study.activePractice?.questionIds ?? []).flatMap((id) => {
      const question = allQuestionBank.find((item) => item.id === id);
      return question ? [question] : [];
    }),
    [allQuestionBank, study.activePractice?.questionIds]
  );
  const question = activeQuestions[questionIndex] ?? activeQuestions[0];

  useEffect(() => {
    const saved = window.localStorage.getItem(CERTIFICATE_STORAGE_KEY);
    if (saved && allQuestionBank.some((item) => item.certificateId === saved)) setSelectedCertificateId(saved);
  }, [allQuestionBank]);

  function selectCertificate(certificateId: string) {
    if (certificateId === selectedCertificateId) return;
    if ((study.activePractice || study.activeTest) && !window.confirm("자격증을 바꾸면 현재 연습 또는 시험이 종료됩니다. 바꿀까요?")) return;
    setStudy((current) => ({ ...current, activePractice: null, activeTest: null }));
    setSelectedCertificateId(certificateId);
    window.localStorage.setItem(CERTIFICATE_STORAGE_KEY, certificateId);
    setQuestionIndex(0);
    setDraftAnswer(null);
    setSubmitted(false);
    setTestResultToOpen(null);
    setView("home");
  }

  function startPractice(type: ExamType, category = "all", filter: PracticeFilter = "all", difficulty: DifficultyFilter = "all", sourceYear = "all", tag = "all") {
    const selectedIds = shuffled(questionBank.filter((item) => {
      if (!matchesQuestionMetadata(item, { examType: type, category, difficulty, sourceYear, tag })) return false;
      const answer = study.answers[item.id];
      if (filter === "unsolved") return !answer;
      if (filter === "incorrect") return answer?.isCorrect === false;
      if (filter === "bookmarked") return study.bookmarks.includes(item.id);
      return true;
    })).map((item) => item.id);
    setExamType(type);
    setQuestionIndex(0);
    setDraftAnswer(null);
    setSubmitted(false);
    setStudy((current) => ({ ...current, activePractice: { examType: type, questionIds: selectedIds, currentIndex: 0, draftAnswer: null, submitted: false, startedAt: new Date().toISOString(), drafts: {}, submittedQuestionIds: [] } }));
    setView("question");
  }

  function resumePractice() {
    const session = study.activePractice;
    if (!session) return;
    const availableIds = session.questionIds.filter((id) => allQuestionBank.some((question) => question.id === id));
    if (availableIds.length === 0) {
      setStudy((current) => ({ ...current, activePractice: null }));
      setView("practice");
      return;
    }
    const restoredIndex = Math.min(session.currentIndex, availableIds.length - 1);
    if (availableIds.length !== session.questionIds.length || restoredIndex !== session.currentIndex) {
      setStudy((current) => current.activePractice ? { ...current, activePractice: { ...current.activePractice, questionIds: availableIds, currentIndex: restoredIndex } } : current);
    }
    setExamType(session.examType);
    setQuestionIndex(restoredIndex);
    setDraftAnswer(session.draftAnswer);
    setSubmitted(session.submitted);
    setView("question");
  }

  function updatePracticeDraft(answer: number | string) {
    setDraftAnswer(answer);
    setStudy((current) => current.activePractice
      ? { ...current, activePractice: { ...current.activePractice, draftAnswer: answer, drafts: { ...(current.activePractice.drafts ?? {}), [question?.id ?? current.activePractice.questionIds[current.activePractice.currentIndex]]: answer } } }
      : current);
  }

  function submitAnswer() {
    if (!question || draftAnswer === null || draftAnswer === "") return;
    const isCorrect = question.examType === "WRITTEN_CBT"
      ? draftAnswer === question.correctChoiceIndex
      : undefined;
    const answer: SavedAnswer = {
      questionId: question.id,
      questionVersion: question.version,
      value: draftAnswer,
      isCorrect,
      answeredAt: new Date().toISOString()
    };
    setStudy((current) => ({
      ...current,
      answers: { ...current.answers, [question.id]: answer },
      activePractice: current.activePractice ? { ...current.activePractice, draftAnswer, submitted: true, drafts: { ...(current.activePractice.drafts ?? {}), [question.id]: draftAnswer }, submittedQuestionIds: current.activePractice.submittedQuestionIds?.includes(question.id) ? current.activePractice.submittedQuestionIds : [...(current.activePractice.submittedQuestionIds ?? []), question.id] } : null,
      activities: [{
        id: crypto.randomUUID(),
        source: "practice",
        examType: question.examType,
        questionId: question.id,
        category: question.category,
        isCorrect,
        occurredAt: answer.answeredAt
      }, ...current.activities]
    }));
    setSubmitted(true);
  }

  function movePracticeQuestion(targetIndex: number) {
    const session = study.activePractice;
    const targetQuestion = activeQuestions[targetIndex];
    if (!session || !targetQuestion || targetIndex < 0 || targetIndex >= activeQuestions.length) return;
    const wasSubmitted = session.submittedQuestionIds?.includes(targetQuestion.id) ?? false;
    const targetDraft = session.drafts?.[targetQuestion.id] ?? (wasSubmitted ? study.answers[targetQuestion.id]?.value : null) ?? null;
    setQuestionIndex(targetIndex);
    setDraftAnswer(targetDraft);
    setSubmitted(wasSubmitted);
    setStudy((current) => current.activePractice ? { ...current, activePractice: { ...current.activePractice, currentIndex: targetIndex, draftAnswer: targetDraft, submitted: wasSubmitted } } : current);
  }

  function nextQuestion() {
    if (questionIndex >= activeQuestions.length - 1) {
      setStudy((current) => ({ ...current, activePractice: null }));
      setDraftAnswer(null);
      setSubmitted(false);
      setView("home");
      return;
    }
    movePracticeQuestion(questionIndex + 1);
  }

  function assessPracticalAnswer(assessment: "correct" | "partial" | "incorrect") {
    if (!question || question.examType !== "PRACTICAL_WRITTEN_RESPONSE") return;
    setStudy((current) => {
      const savedAnswer = current.answers[question.id];
      if (!savedAnswer) return current;
      let activityUpdated = false;
      const activities = current.activities.map((activity) => {
        if (activityUpdated || activity.source !== "practice" || activity.questionId !== question.id) return activity;
        activityUpdated = true;
        return {
          ...activity,
          selfAssessment: assessment,
          isCorrect: assessment === "correct" ? true : assessment === "incorrect" ? false : undefined
        };
      });
      return {
        ...current,
        answers: {
          ...current.answers,
          [question.id]: {
            ...savedAnswer,
            selfAssessment: assessment,
            isCorrect: assessment === "correct" ? true : assessment === "incorrect" ? false : undefined
          }
        },
        activities
      };
    });
  }

  function setKnowledgeStatus(knowledgeStatus: "known" | "unknown") {
    if (!question) return;
    setStudy((current) => {
      const savedAnswer = current.answers[question.id];
      if (!savedAnswer) return current;
      let activityUpdated = false;
      const activities = current.activities.map((activity) => {
        if (activityUpdated || activity.source !== "practice" || activity.questionId !== question.id) return activity;
        activityUpdated = true;
        return { ...activity, knowledgeStatus };
      });
      return {
        ...current,
        answers: {
          ...current.answers,
          [question.id]: { ...savedAnswer, knowledgeStatus }
        },
        activities
      };
    });
  }

  function toggleBookmark(id: string) {
    setStudy((current) => ({
      ...current,
      bookmarks: current.bookmarks.includes(id)
        ? current.bookmarks.filter((questionId) => questionId !== id)
        : [...current.bookmarks, id]
    }));
  }

  function startPracticeQuestions(type: ExamType, questionIds: string[]) {
    const availableIds = questionIds.filter((id) => questionBank.some((question) => question.id === id && question.examType === type));
    if (!availableIds.length) return;
    setExamType(type);
    setQuestionIndex(0);
    setDraftAnswer(null);
    setSubmitted(false);
    setStudy((current) => ({ ...current, activePractice: { examType: type, questionIds: availableIds, currentIndex: 0, draftAnswer: null, submitted: false, startedAt: new Date().toISOString(), drafts: {}, submittedQuestionIds: [] } }));
    setView("question");
  }

  return (
    <div className="appShell">
      <header className="topbar">
        <div className="brandControls"><button className="logo" onClick={() => setView("home")} aria-label="홈">✓</button><label className="certificatePicker"><span className="srOnly">자격증 선택</span><select value={selectedCertificateId} onChange={(event) => selectCertificate(event.target.value)}>{certificateOptions.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}</select></label></div>
        <div className="topbarActions">
          <button className={view === "manage" ? "manageLink active" : "manageLink"} onClick={() => setView("manage")}>내 문제 관리</button>
          {account ? (
            <details className="accountMenu">
              <summary className="accountButton signedIn" title={`${account.email ?? "Google 계정"} · 다음 방문에도 자동 로그인`}>계정</summary>
              <div className="accountMenuPanel">
                <strong>{account.email ?? "Google 계정"}</strong>
                <span>{cloudReady ? "자동 로그인 · 동기화됨" : "자동 로그인 · 동기화 중"}</span>
                {isAdmin && <button onClick={() => setView("admin")}>통합 관리자</button>}
                <button onClick={() => setView("manage")}>내 문제 관리</button>
                <button className="accountSignOut" onClick={toggleAccount}>로그아웃</button>
              </div>
            </details>
          ) : <button className="accountButton" onClick={toggleAccount} disabled={!authReady} title={authError || "한 번 로그인하면 다음 방문부터 자동 로그인됩니다."}>Google 로그인</button>}
          <StorageStatus status={storageStatus} error={storageError || authError} onRetry={retryStorage} /><PwaStatus />
        </div>
      </header>

      <nav className="navigation" aria-label="주요 메뉴">
        {navItems.map((item) => (
          <button key={item.view} className={view === item.view ? "active" : ""} aria-current={view === item.view ? "page" : undefined} onClick={() => setView(item.view)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>

      <main>
        {view === "home" && <HomeView study={study} onStart={startPractice} onNavigate={setView} onResume={resumePractice} questionBank={questionBank} certificateLabel={certificateLabels[selectedCertificateId] ?? selectedCertificateId} />}
        {view === "practice" && <PracticeSetup examType={examType} setExamType={setExamType} onStart={startPractice} questionBank={questionBank} study={study} />}
        {view === "question" && question && (
          <QuestionView
            question={question}
            index={questionIndex}
            total={activeQuestions.length}
            draftAnswer={draftAnswer}
            setDraftAnswer={updatePracticeDraft}
            submitted={submitted}
            savedAnswer={study.answers[question.id]}
            bookmarked={study.bookmarks.includes(question.id)}
            onBookmark={() => toggleBookmark(question.id)}
            onSubmit={submitAnswer}
            onSelfAssess={assessPracticalAnswer}
            onKnowledgeChange={setKnowledgeStatus}
            onPrevious={() => movePracticeQuestion(questionIndex - 1)}
            onNext={nextQuestion}
            canGoPrevious={questionIndex > 0}
            isLast={questionIndex === activeQuestions.length - 1}
            cachedAiExplanation={study.answers[question.id] ? study.aiExplanations[createExplanationCacheKey(question, study.answers[question.id].value)] : undefined}
            aiReport={study.answers[question.id] ? study.aiExplanationReports.find((report) => report.cacheKey === createExplanationCacheKey(question, study.answers[question.id].value)) : undefined}
            onSaveAiExplanation={(cacheKey, explanation) => setStudy((current) => ({ ...current, aiExplanations: { ...current.aiExplanations, [cacheKey]: explanation } }))}
            onReportAiExplanation={(cacheKey, explanation, reason, details) => setStudy((current) => ({ ...current, aiExplanationReports: [{ id: crypto.randomUUID(), cacheKey, questionId: question.id, questionVersion: question.version, explanationSnapshot: explanation, reason, details, createdAt: new Date().toISOString(), status: "open" }, ...current.aiExplanationReports] }))}
            note={study.notes[question.id] ?? ""}
            onNoteChange={(note) => setStudy((current) => ({ ...current, notes: { ...current.notes, [question.id]: note }, noteUpdatedAt: { ...current.noteUpdatedAt, [question.id]: new Date().toISOString() } }))}
            onReport={(reason, details) => setStudy((current) => ({ ...current, questionReports: [{ id: crypto.randomUUID(), questionId: question.id, questionVersion: question.version, reason, details, createdAt: new Date().toISOString(), status: "open" }, ...current.questionReports] }))}
          />
        )}
        {view === "question" && !question && <EmptyPracticeResult onBack={() => setView("practice")} />}
        {view === "test" && <TestMode study={study} setStudy={setStudy} questionBank={questionBank} resultToOpenId={testResultToOpen} onResultOpened={() => setTestResultToOpen(null)} onPracticeQuestions={(type, questionIds) => {
          startPracticeQuestions(type, questionIds);
        }} />}
        {view === "history" && <HistoryView study={study} questionBank={questionBank} onOpenQuestion={startPracticeQuestions} onOpenTestResult={(result) => { setTestResultToOpen(result.id); setView("test"); }} />}
        {view === "bookmarks" && <BookmarksView study={study} questionBank={selectedQuestionBank} onRemove={toggleBookmark} onPractice={startPracticeQuestions} />}
        {view === "manage" && <QuestionManager study={study} setStudy={setStudy} questionBank={allQuestionBank} />}
        {view === "admin" && isAdmin && account && <AdminDashboard userId={account.id} questions={allQuestionBank} onQuestionSaved={(updated) => setQuestionOverrides((current) => [updated, ...current.filter((question) => question.id !== updated.id)])} />}
      </main>
    </div>
  );
}

function readableError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return `${fallback} (${error.message})`;
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return `${fallback} (${error.message})`;
  }
  return fallback;
}

function StorageStatus({ status, error, onRetry }: { status: "saved" | "saving" | "error"; error: string; onRetry: () => void }) {
  if (status === "error") return <button className="storageStatus error" title={error} onClick={onRetry}>저장 실패 · 재시도</button>;
  return <span className={`storageStatus ${status}`} aria-live="polite">{status === "saving" ? "저장 중…" : "저장됨"}</span>;
}

function HomeView({ study, onStart, onNavigate, onResume, questionBank, certificateLabel }: {
  study: StudyState;
  onStart: (type: ExamType, category?: string, filter?: PracticeFilter, difficulty?: DifficultyFilter, sourceYear?: string, tag?: string) => void;
  onNavigate: (view: View) => void;
  onResume: () => void;
  questionBank: Question[];
  certificateLabel: string;
}) {
  const questionIds = new Set(questionBank.map((item) => item.id));
  const selectedAnswers = Object.values(study.answers).filter((answer) => questionIds.has(answer.questionId));
  const answerCount = selectedAnswers.length;
  const scored = selectedAnswers.filter((answer) => answer.isCorrect !== undefined);
  const accuracy = scored.length ? Math.round(scored.filter((answer) => answer.isCorrect).length / scored.length * 100) : 0;
  const masteredCount = selectedAnswers.filter((answer) => answer.isCorrect === true && answer.knowledgeStatus !== "unknown").length;
  const masteryRate = percentage(masteredCount, questionBank.length);
  const activePractice = study.activePractice;
  const activeTest = study.activeTest;
  const activeQuestion = activePractice ? questionBank.find((question) => question.id === activePractice.questionIds[activePractice.currentIndex]) : undefined;
  const certificateId = questionBank[0]?.certificateId ?? "unknown";

  return <section>
    <div className="hero"><p>오늘도 한 문제씩</p><h1>합격에 가까워지는 시간</h1><span>{examTypeLabel(certificateId, "WRITTEN_CBT")}과 {examTypeLabel(certificateId, "PRACTICAL_WRITTEN_RESPONSE")}을 원하는 방식으로 연습하세요.</span></div>
    <div className="activeSessionGrid">
      {activeTest && <div className="primaryCard testResumeCard"><small>진행 중 시험 · {Object.keys(activeTest.answers).length}/{activeTest.questionIds.length}문제 답변</small><h2>{activeTest.title ?? (activeTest.examType === "WRITTEN_CBT" ? "필기 CBT 시험" : "실기 필답형 시험")}</h2><button onClick={() => onNavigate("test")}>{activeTest.currentIndex + 1}번부터 이어서 →</button></div>}
      <div className="primaryCard">
        <small>{activePractice ? `진행 중 · ${examTypeLabel(certificateId, activePractice.examType)}` : certificateLabel}</small><h2>{activePractice ? `${activeQuestion?.category ?? "연습"} ${activePractice.currentIndex + 1}번부터 이어서` : "부담 없이 한 문제부터 시작해요."}</h2>
        <button onClick={activePractice ? onResume : () => onStart("WRITTEN_CBT")}>{activePractice ? "이어서 풀기 →" : `${examTypeLabel(certificateId, "WRITTEN_CBT")} 문제 풀기 →`}</button>
      </div>
    </div>
    <div className="sectionTitle"><h2>학습 방식</h2></div>
    <div className="modeGrid">
      <button onClick={() => onStart("WRITTEN_CBT")}><i>CBT</i><strong>{examTypeLabel(certificateId, "WRITTEN_CBT")}</strong><span>4지선다 문제를 바로 채점해요</span></button>
      <button onClick={() => onStart("PRACTICAL_WRITTEN_RESPONSE")}><i>答</i><strong>{examTypeLabel(certificateId, "PRACTICAL_WRITTEN_RESPONSE")}</strong><span>답안을 직접 작성해요</span></button>
      <button onClick={() => onNavigate("test")}><i>TEST</i><strong>시험 모드</strong><span>모의시험 또는 랜덤 시험을 풀어요</span></button>
      <Link href="/summary"><i>NOTE</i><strong>개념 정리</strong><span>컴시기와 임베기를 따로 훑어요</span></Link>
    </div>
    <div className="sectionTitle"><h2>현재 기록</h2><button onClick={() => onNavigate("history")}>자세히</button></div>
    <div className="summary standardSummary"><div><strong>{answerCount}</strong><span>푼 문제</span></div><div><strong>{accuracy}%</strong><span>{examTypeLabel(certificateId, "WRITTEN_CBT")} 정답률</span></div><div><strong>{masteryRate}%</strong><span>완전 정복 · {masteredCount}/{questionBank.length}</span></div><div><strong>{study.bookmarks.filter((id) => questionIds.has(id)).length}</strong><span>북마크</span></div></div>
  </section>;
}

function BookmarksView({ study, questionBank, onRemove, onPractice }: {
  study: StudyState;
  questionBank: Question[];
  onRemove: (questionId: string) => void;
  onPractice: (examType: ExamType, questionIds: string[]) => void;
}) {
  const [examFilter, setExamFilter] = useState<"all" | ExamType>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const bookmarkedQuestions = study.bookmarks.flatMap((id) => {
    const question = questionBank.find((item) => item.id === id);
    return question ? [question] : [];
  });
  const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");
  const filteredQuestions = bookmarkedQuestions.filter((question) => (examFilter === "all" || question.examType === examFilter)
    && (!normalizedQuery || `${question.category} ${question.prompt}`.toLocaleLowerCase("ko-KR").includes(normalizedQuery)));
  const pageSize = 20;
  const pageCount = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleQuestions = filteredQuestions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const publishedBookmarks = bookmarkedQuestions.filter((question) => (question.publicationStatus ?? "published") === "published");
  const writtenIds = publishedBookmarks.filter((question) => question.examType === "WRITTEN_CBT").map((question) => question.id);
  const practicalIds = publishedBookmarks.filter((question) => question.examType === "PRACTICAL_WRITTEN_RESPONSE").map((question) => question.id);
  const certificateId = questionBank[0]?.certificateId ?? "unknown";

  return <section>
    <div className="hero"><p>다시 볼 문제</p><h1>북마크</h1><span>저장한 문제를 유형별로 모아 연습할 수 있습니다.</span></div>
    <div className="bookmarkPracticeActions">{writtenIds.length > 0 && <button onClick={() => onPractice("WRITTEN_CBT", writtenIds)}>{examTypeLabel(certificateId, "WRITTEN_CBT")} {writtenIds.length}문제 연습</button>}{practicalIds.length > 0 && <button onClick={() => onPractice("PRACTICAL_WRITTEN_RESPONSE", practicalIds)}>{examTypeLabel(certificateId, "PRACTICAL_WRITTEN_RESPONSE")} {practicalIds.length}문제 연습</button>}</div>
    <div className="bookmarkToolbar"><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="문제 내용 또는 과목 검색" /><span>{filteredQuestions.length}개</span></div>
    <div className="chips bookmarkFilters">{(["all", "WRITTEN_CBT", "PRACTICAL_WRITTEN_RESPONSE"] as const).map((type) => <button key={type} className={examFilter === type ? "active" : ""} onClick={() => { setExamFilter(type); setPage(1); }}>{type === "all" ? "전체" : examTypeLabel(certificateId, type)}</button>)}</div>
    {visibleQuestions.length === 0 ? <div className="panel emptyManager">{bookmarkedQuestions.length ? "검색 조건에 맞는 북마크가 없습니다." : "아직 저장한 문제가 없습니다."}</div> : <div className="bookmarkList">{visibleQuestions.map((question) => {
      const answer = study.answers[question.id];
      const archived = (question.publicationStatus ?? "published") !== "published";
      return <article className="panel" key={question.id}><button className="bookmarkOpen" disabled={archived} onClick={() => onPractice(question.examType, [question.id])}><small>{examTypeLabel(question.certificateId, question.examType)} · {question.category}{archived ? " · 출제 제외" : ""}</small><strong>{question.prompt}</strong><span>{!answer ? "아직 풀지 않음" : answer.knowledgeStatus === "unknown" ? "최근 답안 · 아직 모름" : answer.isCorrect === true ? "최근 답안 정답" : answer.isCorrect === false ? "최근 답안 오답" : answer.selfAssessment === "partial" ? "최근 답안 부분 정답" : "답안 저장됨"}</span></button><button onClick={() => onRemove(question.id)} aria-label="북마크 해제">♥</button></article>;
    })}</div>}
    {pageCount > 1 && <div className="pagination"><button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>이전</button><span>{currentPage} / {pageCount}</span><button disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>다음</button></div>}
  </section>;
}

function PracticeSetup({ examType, setExamType, onStart, questionBank, study }: {
  examType: ExamType;
  setExamType: (type: ExamType) => void;
  onStart: (type: ExamType, category?: string, filter?: PracticeFilter, difficulty?: DifficultyFilter, sourceYear?: string, tag?: string) => void;
  questionBank: Question[];
  study: StudyState;
}) {
  const [category, setCategory] = useState("all");
  const [filter, setFilter] = useState<PracticeFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [sourceYear, setSourceYear] = useState("all");
  const [tag, setTag] = useState("all");
  const { categories, sourceYears, tags } = questionFilterOptions(questionBank, examType);
  const certificateId = questionBank[0]?.certificateId ?? "unknown";
  const matchingCount = questionBank.filter((question) => {
    if (!matchesQuestionMetadata(question, { examType, category, difficulty, sourceYear, tag })) return false;
    const answer = study.answers[question.id];
    if (filter === "unsolved") return !answer;
    if (filter === "incorrect") return answer?.isCorrect === false;
    if (filter === "bookmarked") return study.bookmarks.includes(question.id);
    return true;
  }).length;

  function chooseExamType(type: ExamType) {
    setExamType(type);
    setCategory("all");
    setDifficulty("all");
    setSourceYear("all");
    setTag("all");
  }

  return <section><div className="hero"><p>맞춤 연습</p><h1>무엇을 연습할까요?</h1><span>시험 유형을 선택하세요.</span></div>
    <div className="panel setup">
      <label>시험 유형</label>
      <div className="segments">
        <button className={examType === "WRITTEN_CBT" ? "active" : ""} onClick={() => chooseExamType("WRITTEN_CBT")}>{examTypeLabel(certificateId, "WRITTEN_CBT")}</button>
        <button className={examType === "PRACTICAL_WRITTEN_RESPONSE" ? "active" : ""} onClick={() => chooseExamType("PRACTICAL_WRITTEN_RESPONSE")}>{examTypeLabel(certificateId, "PRACTICAL_WRITTEN_RESPONSE")}</button>
      </div>
      <label>자격증</label><div className="selectBox">{certificateLabels[questionBank[0]?.certificateId ?? ""] ?? "선택한 자격증"}</div>
      <label>학습 범위</label><div className="chips"><button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>전체</button>{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <label>난이도</label><div className="chips"><button className={difficulty === "all" ? "active" : ""} onClick={() => setDifficulty("all")}>전체</button><button className={difficulty === "easy" ? "active" : ""} onClick={() => setDifficulty("easy")}>쉬움</button><button className={difficulty === "medium" ? "active" : ""} onClick={() => setDifficulty("medium")}>보통</button><button className={difficulty === "hard" ? "active" : ""} onClick={() => setDifficulty("hard")}>어려움</button></div>
      {(sourceYears.length > 0 || tags.length > 0) && <div className="randomFilters metadataFilters">{sourceYears.length > 0 && <label><span>출제 연도</span><select value={sourceYear} onChange={(event) => setSourceYear(event.target.value)}><option value="all">전체 연도</option>{sourceYears.map((year) => <option value={year} key={year}>{year}년</option>)}</select></label>}{tags.length > 0 && <label><span>태그</span><select value={tag} onChange={(event) => setTag(event.target.value)}><option value="all">전체 태그</option>{tags.map((item) => <option value={item} key={item}>#{item}</option>)}</select></label>}</div>}
      <label>문제 필터</label><div className="chips"><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>모든 문제</button><button className={filter === "unsolved" ? "active" : ""} onClick={() => setFilter("unsolved")}>안 푼 문제</button><button className={filter === "incorrect" ? "active" : ""} onClick={() => setFilter("incorrect")}>오답</button><button className={filter === "bookmarked" ? "active" : ""} onClick={() => setFilter("bookmarked")}>북마크</button></div>
      <p className="practiceCount">조건에 맞는 문제 {matchingCount}개</p>
      <button className="fullButton" disabled={matchingCount === 0} onClick={() => onStart(examType, category, filter, difficulty, sourceYear, tag)}>연습 시작하기</button>
    </div>
  </section>;
}

function EmptyPracticeResult({ onBack }: { onBack: () => void }) {
  return <section className="emptyPractice"><div><span>0</span><h1>조건에 맞는 문제가 없어요</h1><p>다른 과목이나 문제 필터를 선택해 주세요.</p><button className="fullButton" onClick={onBack}>연습 설정으로 돌아가기</button></div></section>;
}

function QuestionView({ question, index, total, draftAnswer, setDraftAnswer, submitted, savedAnswer, bookmarked, onBookmark, onSubmit, onSelfAssess, onKnowledgeChange, onPrevious, onNext, canGoPrevious, isLast, cachedAiExplanation, aiReport, onSaveAiExplanation, onReportAiExplanation, note, onNoteChange, onReport }: {
  question: Question;
  index: number;
  total: number;
  draftAnswer: number | string | null;
  setDraftAnswer: (answer: number | string) => void;
  submitted: boolean;
  savedAnswer?: SavedAnswer;
  bookmarked: boolean;
  onBookmark: () => void;
  onSubmit: () => void;
  onSelfAssess: (assessment: "correct" | "partial" | "incorrect") => void;
  onKnowledgeChange: (status: "known" | "unknown") => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  isLast: boolean;
  cachedAiExplanation?: string;
  aiReport?: AiExplanationReport;
  onSaveAiExplanation: (cacheKey: string, explanation: string) => void;
  onReportAiExplanation: (cacheKey: string, explanation: string, reason: AiExplanationReport["reason"], details: string) => void;
  note: string;
  onNoteChange: (note: string) => void;
  onReport: (reason: import("@/lib/types").QuestionReport["reason"], details: string) => void;
}) {
  return <section className="questionPage">
    <div className="questionMeta"><span>{index + 1} / {total}</span><b>{examTypeLabel(question.certificateId, question.examType)}</b></div>
    <article className="panel questionCard">
      <QuestionMetadata question={question} /><h1>{question.prompt}</h1><QuestionContent question={question} />
      {question.examType === "WRITTEN_CBT" ? <div className="choiceList">
        {question.choices.map((choice, choiceIndex) => {
          const selected = draftAnswer === choiceIndex;
          const correct = submitted && choiceIndex === question.correctChoiceIndex;
          const wrong = submitted && selected && !correct;
          return <button key={choice} disabled={submitted} className={`${selected ? "selected" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`} onClick={() => setDraftAnswer(choiceIndex)}><span>{choiceIndex + 1}</span>{choice}</button>;
        })}
      </div> : <textarea disabled={submitted} value={typeof draftAnswer === "string" ? draftAnswer : ""} onChange={(event) => setDraftAnswer(event.target.value)} placeholder="답안을 입력하세요" />}
      {!submitted && <button className={`dontKnow ${draftAnswer === -1 || draftAnswer === "모르겠어요" ? "selected" : ""}`} onClick={() => setDraftAnswer(question.examType === "WRITTEN_CBT" ? -1 : "모르겠어요")}>모르겠어요</button>}

      <QuestionTools note={note} onNoteChange={onNoteChange} onReport={onReport} />

      {submitted && <div className="feedback">
        <strong>{question.examType === "WRITTEN_CBT" ? (savedAnswer?.isCorrect ? "정답입니다" : "정답을 확인하세요") : "모범답안과 비교해 보세요"}</strong>
        {question.examType === "WRITTEN_CBT" && savedAnswer?.isCorrect && <div className="knowledgeCheck"><span>이 문제를 알고 풀었나요?</span><button className={savedAnswer.knowledgeStatus !== "unknown" ? "active" : ""} onClick={() => onKnowledgeChange("known")}>알고 풀었어요</button><button className={savedAnswer.knowledgeStatus === "unknown" ? "unknown active" : "unknown"} onClick={() => onKnowledgeChange("unknown")}>찍어서 맞음 · 아직 모름</button></div>}
        {question.examType === "PRACTICAL_WRITTEN_RESPONSE" && <><p>모범답안: {question.modelAnswer}</p><div className="selfAssessment"><span>내 답안은 어땠나요?</span>{(["correct", "partial", "incorrect"] as const).map((value) => <button key={value} className={savedAnswer?.selfAssessment === value ? "active" : ""} onClick={() => onSelfAssess(value)}>{value === "correct" ? "정답" : value === "partial" ? "부분 정답" : "오답"}</button>)}</div></>}
        <p>{question.explanation}</p>
        {savedAnswer && <AiExplanation question={question} learnerAnswer={savedAnswer.value} cachedExplanation={cachedAiExplanation} onSave={onSaveAiExplanation} reportStatus={aiReport?.status} onReport={onReportAiExplanation} />}
      </div>}
    </article>
    <div className="questionActions"><button className="bookmark" onClick={onBookmark}>{bookmarked ? "♥" : "♡"}</button><button className="previous" disabled={!canGoPrevious} onClick={onPrevious}>이전</button><button className="submit" disabled={submitted && question.examType === "PRACTICAL_WRITTEN_RESPONSE" && !savedAnswer?.selfAssessment} onClick={submitted ? onNext : onSubmit}>{submitted ? (question.examType === "PRACTICAL_WRITTEN_RESPONSE" && !savedAnswer?.selfAssessment ? "답안을 평가해 주세요" : isLast ? "연습 완료" : "다음 문제") : "답안 제출"}</button></div>
  </section>;
}

function HistoryView({ study, questionBank, onOpenQuestion, onOpenTestResult }: { study: StudyState; questionBank: Question[]; onOpenQuestion: (examType: ExamType, questionIds: string[]) => void; onOpenTestResult: (result: TestResult) => void }) {
  const questionIds = new Set(questionBank.map((question) => question.id));
  const activities = study.activities.filter((activity) => questionIds.has(activity.questionId));
  const testResults = study.testResults.filter((result) => result.questionIds.some((id) => questionIds.has(id)));
  const written = activities.filter((activity) => activity.examType === "WRITTEN_CBT");
  const practical = activities.filter((activity) => activity.examType === "PRACTICAL_WRITTEN_RESPONSE");
  const writtenAccuracy = percentage(written.filter((activity) => activity.isCorrect).length, written.length);
  const assessedPractical = [
    ...practical.flatMap((activity) => activity.selfAssessment ? [activity.selfAssessment] : []),
    ...testResults.flatMap((result) => Object.values(result.selfAssessments ?? {}))
  ];
  const practicalSuccess = percentage(assessedPractical.filter((value) => value === "correct" || value === "partial").length, assessedPractical.length);
  const successfulPracticalCount = assessedPractical.filter((value) => value === "correct" || value === "partial").length;
  const overallSuccess = percentage(written.filter((activity) => activity.isCorrect).length + successfulPracticalCount, written.length + assessedPractical.length);
  const streak = koreanStudyStreak(activities.map((activity) => activity.occurredAt));
  const days = recentKoreanDays(7);
  const dayCounts = days.map((day) => activities.filter((activity) => koreanDateKey(activity.occurredAt) === day.key).length);
  const maxDayCount = Math.max(1, ...dayCounts);
  const categoryRows = Array.from(new Set(activities.map((activity) => activity.category))).map((category) => {
    const records = activities.filter((activity) => activity.category === category && activity.examType === "WRITTEN_CBT");
    return { category, count: activities.filter((activity) => activity.category === category).length, accuracy: percentage(records.filter((record) => record.isCorrect).length, records.length) };
  }).sort((a, b) => b.count - a.count);
  const recentEntries = [
    ...activities.filter((activity) => activity.source === "practice").map((activity) => ({
      id: activity.id,
      occurredAt: activity.occurredAt,
      label: activity.examType === "WRITTEN_CBT" ? "필기 연습" : "실기 연습",
      detail: activity.category,
      result: activity.knowledgeStatus === "unknown" ? "아직 모름" : activity.isCorrect === true ? "정답" : activity.isCorrect === false ? "오답" : activity.selfAssessment === "partial" ? "부분 정답" : "답안 저장",
      questionId: activity.questionId,
      examType: activity.examType,
      testResult: undefined as TestResult | undefined
    })),
    ...testResults.map((result) => ({
      id: result.id,
      occurredAt: result.completedAt,
      label: result.title ?? (result.examType === "WRITTEN_CBT" ? "필기 시험" : "실기 시험"),
      detail: `${result.questionIds.length}문제`,
      result: result.scoredQuestionCount ? `${Math.round(result.correctCount / result.scoredQuestionCount * 100)}점` : "제출 완료",
      questionId: undefined as string | undefined,
      examType: result.examType,
      testResult: result as TestResult | undefined
    }))
  ].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()).slice(0, 10);

  return <section><div className="hero"><p>이 기기의 기록</p><h1>학습 통계</h1><span>연습과 시험에서 제출한 모든 답변을 기준으로 계산합니다.</span></div>
    <div className="summary resultSummary"><div><strong>{activities.length}</strong><span>누적 풀이</span></div><div><strong>{overallSuccess}%</strong><span>평가 성공률</span></div><div><strong>{streak}일</strong><span>연속 학습</span></div><div><strong>{testResults.length}</strong><span>완료 시험</span></div></div>

    <div className="statsGrid">
      <article className="panel chartCard"><div className="sectionTitle"><h2>최근 7일</h2><span>{dayCounts.reduce((sum, count) => sum + count, 0)}문제</span></div><div className="activityChart">{days.map((day, index) => <div key={day.key}><span><i style={{ height: `${Math.max(5, dayCounts[index] / maxDayCount * 100)}%` }} /></span><b>{dayCounts[index]}</b><small>{day.label}</small></div>)}</div></article>
      <article className="panel typeStats"><h2>시험 유형별</h2><div><i>CBT</i><span><strong>필기시험</strong><small>{written.length}문제 풀이</small></span><b>{writtenAccuracy}%</b></div><div><i>答</i><span><strong>실기시험</strong><small>{practical.length}문제 풀이</small></span><b>{assessedPractical.length ? `${practicalSuccess}%` : `${practical.length}개`}</b></div></article>
    </div>

    <div className="sectionTitle"><h2>과목별 성과</h2><span>필기 정답률</span></div>
    {categoryRows.length ? <div className="panel categoryPerformance">{categoryRows.map((row) => <div key={row.category}><div><strong>{row.category}</strong><span>{row.count}문제 · {row.accuracy}%</span></div><p><i style={{ width: `${row.accuracy}%` }} /></p></div>)}</div> : <div className="panel emptyManager">문제를 풀면 과목별 통계가 표시됩니다.</div>}
    <div className="sectionTitle"><h2>최근 학습</h2><span>최대 10건</span></div>
    {recentEntries.length ? <div className="panel recentActivityList">{recentEntries.map((entry) => { const content = <><span><strong>{entry.label}</strong><small>{entry.detail} · {formatKoreanDateTime(entry.occurredAt)}</small></span><b>{entry.result}</b><i>›</i></>; return <button key={`${entry.id}:${entry.occurredAt}`} onClick={() => entry.testResult ? onOpenTestResult(entry.testResult) : entry.questionId && onOpenQuestion(entry.examType, [entry.questionId])} aria-label={entry.testResult ? `${entry.label} 결과 복습` : `${entry.detail} 문제 다시 풀기`}>{content}</button>; })}</div> : <div className="panel emptyManager">학습을 시작하면 최근 기록이 표시됩니다.</div>}
  </section>;
}

function percentage(value: number, total: number) {
  return total ? Math.round(value / total * 100) : 0;
}
