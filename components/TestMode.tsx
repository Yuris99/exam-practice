"use client";

import { useEffect, useMemo, useState } from "react";
import { AiExplanation, createExplanationCacheKey } from "@/components/AiExplanation";
import { QuestionContent } from "@/components/QuestionContent";
import { QuestionMetadata } from "@/components/QuestionMetadata";
import { examTemplates } from "@/lib/examTemplates";
import { createTestSnapshot, selectBalancedByCategory, shuffled } from "@/lib/testSelection";
import { formatKoreanDate } from "@/lib/koreanDate";
import { matchesQuestionMetadata, questionFilterOptions } from "@/lib/questionFilters";
import type { AnswerValue, ExamType, Question, StudyState, TestResult, TestSession } from "@/lib/types";

interface TestModeProps {
  study: StudyState;
  setStudy: React.Dispatch<React.SetStateAction<StudyState>>;
  questionBank: Question[];
  onPracticeQuestions: (examType: ExamType, questionIds: string[]) => void;
  resultToOpenId?: string | null;
  onResultOpened?: () => void;
}

type ReviewFilter = "all" | "incorrect" | "unanswered" | "flagged";

export function TestMode({ study, setStudy, questionBank, onPracticeQuestions, resultToOpenId, onResultOpened }: TestModeProps) {
  const [testKind, setTestKind] = useState<"mock" | "random">("mock");
  const [examType, setExamType] = useState<ExamType>("WRITTEN_CBT");
  const [questionCount, setQuestionCount] = useState(20);
  const [useTimer, setUseTimer] = useState(true);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(20);
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState<"all" | Question["difficulty"]>("all");
  const [sourceYear, setSourceYear] = useState("all");
  const [tag, setTag] = useState("all");
  const [includeSolved, setIncludeSolved] = useState(true);
  const [shuffleChoices, setShuffleChoices] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [latestResult, setLatestResult] = useState<TestResult | null>(null);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const [expandedReviewIds, setExpandedReviewIds] = useState<string[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const session = study.activeTest;

  useEffect(() => {
    if (!resultToOpenId) return;
    const result = study.testResults.find((item) => item.id === resultToOpenId);
    if (result) setLatestResult(result);
    onResultOpened?.();
  }, [onResultOpened, resultToOpenId, study.testResults]);

  const sessionQuestions = useMemo(() => {
    if (!session) return [];
    if (session.questionSnapshots?.length) return session.questionSnapshots;
    return session.questionIds.flatMap((id) => {
      const question = questionBank.find((item) => item.id === id);
      return question ? [question] : [];
    });
  }, [questionBank, session]);

  useEffect(() => {
    if (!session || session.durationSeconds === null) return;
    const durationSeconds = session.durationSeconds;
    const startedAt = session.startedAt;
    const interval = window.setInterval(() => {
      setNow(Date.now());
      const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
      if (elapsed >= durationSeconds) finishTest(session, questionBank, setStudy, setLatestResult);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [questionBank, session, setStudy]);

  useEffect(() => {
    setReviewFilter("all");
    setExpandedReviewIds([]);
  }, [latestResult?.id]);

  if (latestResult) {
    const score = latestResult.scoredQuestionCount
      ? Math.round(latestResult.correctCount / latestResult.scoredQuestionCount * 100)
      : null;
    const resultQuestions = latestResult.questionSnapshots?.length ? latestResult.questionSnapshots : latestResult.questionIds.flatMap((id) => {
      const question = questionBank.find((item) => item.id === id);
      return question ? [question] : [];
    });
    const passed = score !== null && latestResult.passingScore !== null && latestResult.passingScore !== undefined
      ? score >= latestResult.passingScore
      : null;
    const unansweredCount = latestResult.questionIds.filter((id) => {
      const value = latestResult.answers[id];
      return value === undefined || value === "";
    }).length;
    const incorrectCount = resultQuestions.filter((question) => {
      if (question.examType !== "WRITTEN_CBT") return false;
      const answer = latestResult.answers[question.id];
      return answer !== undefined && answer !== "" && answer !== question.correctChoiceIndex;
    }).length;
    const incorrectQuestionIds = resultQuestions.flatMap((question) => {
      const answer = latestResult.answers[question.id];
      if (answer === undefined || answer === "") return [question.id];
      if (question.examType === "WRITTEN_CBT" && answer !== question.correctChoiceIndex) return [question.id];
      if (question.examType === "PRACTICAL_WRITTEN_RESPONSE" && latestResult.selfAssessments?.[question.id] === "incorrect") return [question.id];
      return [];
    });
    const elapsedSeconds = Math.max(0, Math.floor((new Date(latestResult.completedAt).getTime() - new Date(latestResult.startedAt).getTime()) / 1000));
    const categoryScores = getCategoryScores(resultQuestions, latestResult.answers);
    const visibleResultQuestions = resultQuestions.filter((question) => {
      const answer = latestResult.answers[question.id];
      const answered = answer !== undefined && answer !== "";
      if (reviewFilter === "unanswered") return !answered;
      if (reviewFilter === "flagged") return latestResult.flaggedQuestionIds?.includes(question.id) ?? false;
      if (reviewFilter === "incorrect") {
        if (!answered) return false;
        if (question.examType === "WRITTEN_CBT") return answer !== question.correctChoiceIndex;
        return latestResult.selfAssessments?.[question.id] === "incorrect";
      }
      return true;
    });
    return <section>
      <div className="hero"><p>{latestResult.mode === "mock" ? "모의시험 완료" : "시험 완료"}</p><h1>{score === null ? "제출했어요" : `${score}점`}</h1><span>{latestResult.title ?? (latestResult.examType === "WRITTEN_CBT" ? "필기 CBT" : "실기 필답형")}</span></div>
      <div className="summary resultSummary"><div><strong>{latestResult.correctCount}</strong><span>정답</span></div><div><strong>{incorrectCount}</strong><span>오답</span></div><div><strong>{unansweredCount}</strong><span>미답변</span></div><div><strong>{formatDuration(elapsedSeconds)}</strong><span>소요 시간</span></div></div>
      <div className="panel resultPanel">
        <h2>{passed === true ? "합격 기준을 넘었어요" : passed === false ? `합격 기준 ${latestResult.passingScore}점에 도전해 보세요` : "결과를 복습해 보세요"}</h2>
        <p>시험 결과는 이 기기의 학습 기록에 저장되었습니다.</p>
        {incorrectQuestionIds.length > 0 && <button className="fullButton" onClick={() => onPracticeQuestions(latestResult.examType, incorrectQuestionIds)}>틀린 문제 {incorrectQuestionIds.length}개 연습하기</button>}
        <button className="fullButton" onClick={() => setLatestResult(null)}>새 시험 만들기</button>
        <button className="resultDelete" onClick={() => { if (!window.confirm("이 시험 결과와 관련 통계 기록을 삭제할까요? 삭제한 기록은 복구할 수 없습니다.")) return; const questionIds = new Set(latestResult.questionIds); setStudy((current) => ({ ...current, testResults: current.testResults.filter((result) => result.id !== latestResult.id), activities: current.activities.filter((activity) => !(activity.source === "test" && activity.occurredAt === latestResult.completedAt && questionIds.has(activity.questionId))) })); setLatestResult(null); }}>시험 기록 삭제</button>
      </div>
      {categoryScores.length > 0 && <><div className="sectionTitle"><h2>과목별 정확도</h2></div><div className="panel categoryPerformance">{categoryScores.map((item) => <div key={item.category}><div><strong>{item.category}</strong><span>{item.correct} / {item.total} · {item.accuracy}%</span></div><p><i style={{ width: `${item.accuracy}%` }} /></p></div>)}</div></>}
      <div className="sectionTitle"><h2>문제별 복습</h2><span>{visibleResultQuestions.length}문제</span></div>
      <div className="chips reviewFilters">
        {(["all", "incorrect", "unanswered", "flagged"] as const).map((filter) => <button key={filter} className={reviewFilter === filter ? "active" : ""} onClick={() => setReviewFilter(filter)}>{filter === "all" ? "전체" : filter === "incorrect" ? "오답" : filter === "unanswered" ? "미답변" : "검토 표시"}</button>)}
      </div>
      <div className="resultReviewList">
        {visibleResultQuestions.map((question) => {
          const answer = latestResult.answers[question.id];
          const answered = answer !== undefined && answer !== "";
          const correct = question.examType === "WRITTEN_CBT" && answer === question.correctChoiceIndex;
          const cacheKey = answered ? createExplanationCacheKey(question, answer) : "";
          const aiReport = answered ? study.aiExplanationReports.find((report) => report.cacheKey === cacheKey) : undefined;
          const expanded = expandedReviewIds.includes(question.id);
          return <article className={`panel resultReview ${correct ? "correct" : answered ? "incorrect" : "unanswered"}`} key={question.id}>
            <div className="resultReviewTitle"><span>{latestResult.questionIds.indexOf(question.id) + 1}</span><div><QuestionMetadata question={question} compact />{latestResult.flaggedQuestionIds?.includes(question.id) && <small>검토 표시</small>}<strong>{question.prompt}</strong></div><b>{correct ? "정답" : answered ? (question.examType === "WRITTEN_CBT" ? "오답" : "검토") : "미답변"}</b></div>
            <button className="reviewToggle" onClick={() => setExpandedReviewIds((current) => current.includes(question.id) ? current.filter((id) => id !== question.id) : [...current, question.id])}>{expanded ? "해설 접기" : "답과 해설 보기"}</button>
            {expanded && <div className="reviewDetails">
            <QuestionContent question={question} />
            {question.examType === "WRITTEN_CBT" ? <div className="answerComparison"><p>내 답: {typeof answer === "number" ? `${answer + 1}번 ${question.choices[answer]}` : "미답변"}</p><p>정답: {question.correctChoiceIndex + 1}번 {question.choices[question.correctChoiceIndex]}</p></div> : <div className="answerComparison"><p>내 답: {typeof answer === "string" && answer ? answer : "미답변"}</p><p>모범답안: {question.modelAnswer}</p></div>}
            <p className="officialReview"><strong>공식 해설</strong><br />{question.explanation || "등록된 공식 해설이 없습니다."}</p>
            {question.examType === "PRACTICAL_WRITTEN_RESPONSE" && answered && <div className="selfAssessment"><span>내 답안 평가</span>{(["correct", "partial", "incorrect"] as const).map((value) => <button key={value} className={(latestResult.selfAssessments ?? {})[question.id] === value ? "active" : ""} onClick={() => saveSelfAssessment(latestResult, question.id, value, setStudy, setLatestResult)}>{value === "correct" ? "정답" : value === "partial" ? "부분 정답" : "오답"}</button>)}</div>}
            {answered && <AiExplanation question={question} learnerAnswer={answer} cachedExplanation={study.aiExplanations[cacheKey]} onSave={(key, explanation) => setStudy((current) => ({ ...current, aiExplanations: { ...current.aiExplanations, [key]: explanation } }))} reportStatus={aiReport?.status} onReport={(key, explanation, reason, details) => setStudy((current) => ({ ...current, aiExplanationReports: [{ id: crypto.randomUUID(), cacheKey: key, questionId: question.id, questionVersion: question.version, explanationSnapshot: explanation, reason, details, createdAt: new Date().toISOString(), status: "open" }, ...current.aiExplanationReports] }))} />}
            </div>}
          </article>;
        })}
        {visibleResultQuestions.length === 0 && <div className="panel emptyManager">해당하는 문제가 없습니다.</div>}
      </div>
    </section>;
  }

  if (!session) {
    const { categories, sourceYears, tags } = questionFilterOptions(questionBank, examType);
    const eligibleQuestions = questionBank.filter((question) => matchesQuestionMetadata(question, { examType, category, difficulty, sourceYear, tag })
      && (includeSolved || !study.answers[question.id]));
    const availableCount = eligibleQuestions.length;
    return <section>
      <div className="hero"><p>실전 모드</p><h1>시험 선택</h1><span>문제를 풀어도 화면이 새로고침되지 않으며 답안은 자동 저장됩니다.</span></div>
      <div className="panel setup">
        <div className="segments testKind" aria-label="시험 방식">
          <button className={testKind === "mock" ? "active" : ""} onClick={() => setTestKind("mock")}>모의시험</button>
          <button className={testKind === "random" ? "active" : ""} onClick={() => setTestKind("random")}>랜덤 시험</button>
        </div>
        {testKind === "mock" ? <div className="templateList">
          {examTemplates.map((template) => {
            const count = questionBank.filter((question) => question.examType === template.examType).length;
            const actualCount = Math.min(template.questionCount, count);
            return <article className="templateCard" key={template.id}>
              <div><small>{template.examType === "WRITTEN_CBT" ? "필기 CBT" : "실기 필답형"}</small><h2>{template.title}</h2><p>{template.description}</p></div>
              <div className="templateMeta"><span><strong>{actualCount}</strong>문제</span><span><strong>{Math.floor(template.durationSeconds / 60)}</strong>분</span><span><strong>{template.passingScore}</strong>점 합격</span><span><strong>균형</strong>과목 배분</span></div>
              {actualCount < template.questionCount && <p className="availability">현재 문제은행에 등록된 {actualCount}문제만 출제됩니다.</p>}
              <button className="fullButton" disabled={actualCount === 0} onClick={() => startTest({ examType: template.examType, requestedCount: template.questionCount, durationSeconds: template.durationSeconds, mode: "mock", title: template.title, passingScore: template.passingScore, categoryStrategy: template.categoryStrategy, shuffleQuestions: template.shuffleQuestions, shuffleChoices: template.shuffleChoices }, questionBank, setStudy)}>모의시험 시작</button>
            </article>;
          })}
        </div> : <>
        <label>시험 유형</label>
        <div className="segments">
          <button className={examType === "WRITTEN_CBT" ? "active" : ""} onClick={() => { setExamType("WRITTEN_CBT"); setCategory("all"); setSourceYear("all"); setTag("all"); }}>필기 CBT</button>
          <button className={examType === "PRACTICAL_WRITTEN_RESPONSE" ? "active" : ""} onClick={() => { setExamType("PRACTICAL_WRITTEN_RESPONSE"); setCategory("all"); setSourceYear("all"); setTag("all"); }}>실기 필답형</button>
        </div>
        <div className="randomFilters">
          <label><span>과목</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">전체 과목</option>{categories.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
          <label><span>난이도</span><select value={difficulty} onChange={(event) => setDifficulty(event.target.value as typeof difficulty)}><option value="all">전체 난이도</option><option value="easy">쉬움</option><option value="medium">보통</option><option value="hard">어려움</option></select></label>
          {sourceYears.length > 0 && <label><span>출제 연도</span><select value={sourceYear} onChange={(event) => setSourceYear(event.target.value)}><option value="all">전체 연도</option>{sourceYears.map((year) => <option value={year} key={year}>{year}년</option>)}</select></label>}
          {tags.length > 0 && <label><span>태그</span><select value={tag} onChange={(event) => setTag(event.target.value)}><option value="all">전체 태그</option>{tags.map((item) => <option value={item} key={item}>#{item}</option>)}</select></label>}
        </div>
        <label>문제 수</label>
        <div className="countOptions">
          {[10, 20, 40].map((count) => <button key={count} className={questionCount === count ? "active" : ""} onClick={() => { setQuestionCount(count); setTimeLimitMinutes(count); }}>{count}문제</button>)}
        </div>
        <div className="toggleRow"><span><strong>제한 시간</strong><small>{useTimer ? `${timeLimitMinutes}분 후 자동 제출` : "시간 제한 없이 응시"}</small></span><button className={useTimer ? "toggle active" : "toggle"} onClick={() => setUseTimer((value) => !value)} aria-label="제한 시간 전환"><i /></button></div>
        {useTimer && <label className="timerField"><span>시험 시간</span><span><input type="number" min={1} max={300} value={timeLimitMinutes} onChange={(event) => setTimeLimitMinutes(Math.max(1, Math.min(300, Number(event.target.value) || 1)))} inputMode="numeric" />분</span><small>1분에서 300분 사이로 설정할 수 있습니다.</small></label>}
        <div className="toggleRow"><span><strong>이미 푼 문제 포함</strong><small>끄면 아직 풀지 않은 문제만 출제</small></span><button className={includeSolved ? "toggle active" : "toggle"} onClick={() => setIncludeSolved((value) => !value)} aria-label="이미 푼 문제 포함 전환"><i /></button></div>
        {examType === "WRITTEN_CBT" && <div className="toggleRow"><span><strong>선택지 순서 섞기</strong><small>시험 시작 시 정답 위치도 함께 보정</small></span><button className={shuffleChoices ? "toggle active" : "toggle"} onClick={() => setShuffleChoices((value) => !value)} aria-label="선택지 순서 섞기 전환"><i /></button></div>}
        <p className="availability">선택한 조건에 맞는 문제는 {availableCount}개입니다.</p>
        <button className="fullButton" disabled={availableCount === 0} onClick={() => startTest({ examType, requestedCount: questionCount, durationSeconds: useTimer ? timeLimitMinutes * 60 : null, mode: "random", title: examType === "WRITTEN_CBT" ? "필기 CBT 랜덤 시험" : "실기 필답형 랜덤 시험", passingScore: null, eligibleQuestionIds: eligibleQuestions.map((question) => question.id), categoryStrategy: "random", shuffleQuestions: true, shuffleChoices: examType === "WRITTEN_CBT" && shuffleChoices }, questionBank, setStudy)}>랜덤 시험 시작</button>
        </>}
      </div>
      {study.testResults.length > 0 && <><div className="sectionTitle"><h2>최근 시험</h2></div><div className="recentTests">{study.testResults.slice(0, 5).map((result) => {
        const resultScore = result.scoredQuestionCount ? Math.round(result.correctCount / result.scoredQuestionCount * 100) : null;
        return <button className="panel" key={result.id} onClick={() => setLatestResult(result)}><span><strong>{result.title ?? (result.examType === "WRITTEN_CBT" ? "필기 CBT" : "실기 필답형")}</strong><small>{formatKoreanDate(result.completedAt)} · {result.questionIds.length}문제</small></span><b>{resultScore === null ? "복습" : `${resultScore}점`}</b></button>;
      })}</div></>}
    </section>;
  }

  const question = sessionQuestions[session.currentIndex];
  if (!question) return <section className="panel errorPanel">시험 문제를 불러올 수 없습니다.</section>;
  const answer = session.answers[question.id];
  const elapsed = Math.floor((now - new Date(session.startedAt).getTime()) / 1000);
  const remaining = session.durationSeconds === null ? null : Math.max(0, session.durationSeconds - elapsed);

  return <section className="questionPage">
    <div className="testHeader">
      <div><button onClick={() => setShowNavigator((value) => !value)}>{session.currentIndex + 1} / {sessionQuestions.length} · 문제 목록</button><button className="testExit" onClick={() => { if (window.confirm("진행 중인 시험과 저장된 답안을 삭제하고 시험을 중단할까요?")) { setStudy((current) => ({ ...current, activeTest: null })); setShowNavigator(false); } }}>시험 중단</button></div>
      {remaining !== null && <b>{formatTime(remaining)}</b>}
    </div>

    {showNavigator && <div className="panel testNavigator">
      {sessionQuestions.map((item, index) => <button key={item.id} className={`${session.answers[item.id] !== undefined ? "answered" : ""} ${index === session.currentIndex ? "current" : ""} ${session.flaggedQuestionIds.includes(item.id) ? "flagged" : ""}`} onClick={() => { updateSession(setStudy, { currentIndex: index }); setShowNavigator(false); }}>{index + 1}</button>)}
    </div>}

    <article className="panel questionCard">
      <div className="testQuestionLabel"><QuestionMetadata question={question} /><button className={session.flaggedQuestionIds.includes(question.id) ? "flag active" : "flag"} onClick={() => toggleFlag(question.id, session, setStudy)}>⚑ 검토</button></div>
      <h1>{question.prompt}</h1>
      <QuestionContent question={question} />
      {question.examType === "WRITTEN_CBT" ? <div className="choiceList">
        {question.choices.map((choice, index) => <button key={choice} className={answer === index ? "selected" : ""} onClick={() => saveTestAnswer(question.id, index, setStudy)}><span>{index + 1}</span>{choice}</button>)}
      </div> : <textarea value={typeof answer === "string" ? answer : ""} onChange={(event) => saveTestAnswer(question.id, event.target.value, setStudy)} placeholder="답안을 입력하세요" />}
    </article>

    <div className="testActions">
      <button disabled={session.currentIndex === 0} onClick={() => updateSession(setStudy, { currentIndex: session.currentIndex - 1 })}>이전</button>
      {session.currentIndex < sessionQuestions.length - 1
        ? <button className="submit" onClick={() => updateSession(setStudy, { currentIndex: session.currentIndex + 1 })}>다음</button>
        : <button className="submit" onClick={() => confirmAndFinishTest(session, questionBank, setStudy, setLatestResult)}>시험 제출</button>}
    </div>
  </section>;
}

interface StartTestOptions {
  examType: ExamType;
  requestedCount: number;
  durationSeconds: number | null;
  mode: "mock" | "random";
  title: string;
  passingScore: number | null;
  eligibleQuestionIds?: string[];
  categoryStrategy: "balanced" | "random";
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
}

function startTest(options: StartTestOptions, questionBank: Question[], setStudy: TestModeProps["setStudy"]) {
  const eligibleQuestionIds = options.eligibleQuestionIds ? new Set(options.eligibleQuestionIds) : null;
  const candidates = questionBank.filter((question) => question.examType === options.examType && (!eligibleQuestionIds || eligibleQuestionIds.has(question.id)));
  const orderedCandidates = options.categoryStrategy === "balanced"
    ? selectBalancedByCategory(candidates, options.requestedCount)
    : options.shuffleQuestions ? shuffled(candidates) : [...candidates];
  const selected = orderedCandidates.slice(0, Math.min(options.requestedCount, orderedCandidates.length));
  const snapshots = selected.map((question) => createTestSnapshot(question, options.shuffleChoices));
  const session: TestSession = {
    id: crypto.randomUUID(),
    examType: options.examType,
    questionIds: snapshots.map((question) => question.id),
    currentIndex: 0,
    answers: {},
    flaggedQuestionIds: [],
    startedAt: new Date().toISOString(),
    durationSeconds: options.durationSeconds,
    questionSnapshots: snapshots,
    mode: options.mode,
    title: options.title,
    passingScore: options.passingScore
  };
  setStudy((current) => ({ ...current, activeTest: session }));
}

function updateSession(setStudy: TestModeProps["setStudy"], patch: Partial<TestSession>) {
  setStudy((current) => current.activeTest
    ? { ...current, activeTest: { ...current.activeTest, ...patch } }
    : current);
}

function saveTestAnswer(questionId: string, value: AnswerValue, setStudy: TestModeProps["setStudy"]) {
  setStudy((current) => current.activeTest
    ? { ...current, activeTest: { ...current.activeTest, answers: { ...current.activeTest.answers, [questionId]: value } } }
    : current);
}

function toggleFlag(questionId: string, session: TestSession, setStudy: TestModeProps["setStudy"]) {
  const flaggedQuestionIds = session.flaggedQuestionIds.includes(questionId)
    ? session.flaggedQuestionIds.filter((id) => id !== questionId)
    : [...session.flaggedQuestionIds, questionId];
  updateSession(setStudy, { flaggedQuestionIds });
}

function finishTest(session: TestSession, questionBank: Question[], setStudy: TestModeProps["setStudy"], setLatestResult: (result: TestResult) => void) {
  const sessionQuestions = session.questionIds.flatMap((id) => {
    const question = questionBank.find((item) => item.id === id);
    return question ? [question] : [];
  });
  const frozenQuestions = session.questionSnapshots?.length ? session.questionSnapshots : sessionQuestions;
  const scored = frozenQuestions.filter((question) => question.examType === "WRITTEN_CBT");
  const correctCount = scored.filter((question) => session.answers[question.id] === question.correctChoiceIndex).length;
  const completedAt = new Date().toISOString();
  const result: TestResult = {
    id: session.id,
    examType: session.examType,
    questionIds: session.questionIds,
    answers: session.answers,
    startedAt: session.startedAt,
    completedAt,
    correctCount,
    scoredQuestionCount: scored.length,
    selfAssessments: {},
    questionSnapshots: frozenQuestions.map((question) => structuredClone(question)),
    mode: session.mode,
    title: session.title,
    passingScore: session.passingScore,
    flaggedQuestionIds: session.flaggedQuestionIds
  };
  const activities = frozenQuestions.flatMap((question) => {
    const answer = session.answers[question.id];
    if (answer === undefined || answer === "") return [];
    return [{
      id: crypto.randomUUID(),
      source: "test" as const,
      examType: question.examType,
      questionId: question.id,
      category: question.category,
      isCorrect: question.examType === "WRITTEN_CBT" ? answer === question.correctChoiceIndex : undefined,
      occurredAt: completedAt
    }];
  });
  setStudy((current) => ({ ...current, activeTest: null, testResults: [result, ...current.testResults], activities: [...activities, ...current.activities] }));
  setLatestResult(result);
}

function confirmAndFinishTest(session: TestSession, questionBank: Question[], setStudy: TestModeProps["setStudy"], setLatestResult: (result: TestResult) => void) {
  const unansweredCount = session.questionIds.filter((id) => {
    const value = session.answers[id];
    return value === undefined || value === "";
  }).length;
  if (unansweredCount > 0 && !window.confirm(`아직 풀지 않은 문제가 ${unansweredCount}개 있습니다. 그대로 제출할까요?`)) return;
  finishTest(session, questionBank, setStudy, setLatestResult);
}

function saveSelfAssessment(result: TestResult, questionId: string, assessment: "correct" | "partial" | "incorrect", setStudy: TestModeProps["setStudy"], setLatestResult: (result: TestResult) => void) {
  const updated = { ...result, selfAssessments: { ...(result.selfAssessments ?? {}), [questionId]: assessment } };
  setLatestResult(updated);
  setStudy((current) => ({ ...current, testResults: current.testResults.map((item) => item.id === updated.id ? updated : item) }));
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const remainder = seconds % 60;
  return hours > 0 ? `${hours}시간 ${minutes}분` : minutes > 0 ? `${minutes}분 ${remainder}초` : `${remainder}초`;
}

function getCategoryScores(questions: Question[], answers: Record<string, AnswerValue>) {
  const scores = new Map<string, { correct: number; total: number }>();
  questions.forEach((question) => {
    if (question.examType !== "WRITTEN_CBT") return;
    const current = scores.get(question.category) ?? { correct: 0, total: 0 };
    current.total += 1;
    if (answers[question.id] === question.correctChoiceIndex) current.correct += 1;
    scores.set(question.category, current);
  });
  return [...scores.entries()].map(([category, value]) => ({ category, ...value, accuracy: Math.round(value.correct / value.total * 100) }));
}
