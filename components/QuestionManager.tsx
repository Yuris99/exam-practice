"use client";

import { useRef, useState } from "react";
import type { ExamType, Question, StudyState } from "@/lib/types";
import { BACKUP_FORMAT, BACKUP_VERSION, emptyStudyState, migrateStudyState } from "@/lib/storage";
import { togglePageSelection, toggleSelectedId } from "@/lib/bulkSelection";
import { koreanDateKey } from "@/lib/koreanDate";

interface QuestionManagerProps {
  study: StudyState;
  setStudy: React.Dispatch<React.SetStateAction<StudyState>>;
  questionBank: Question[];
}

interface FormState {
  examType: ExamType;
  difficulty: Question["difficulty"];
  category: string;
  prompt: string;
  choices: string[];
  correctChoice: string;
  modelAnswer: string;
  keyPoints: string;
  explanation: string;
  imageUrl: string;
  imageUrls: string;
  referenceText: string;
  codeSnippet: string;
  codeLanguage: string;
  tags: string;
  source: string;
  sourceYear: string;
}

interface ImportPreview {
  questions: Question[];
  errors: string[];
}

const initialForm: FormState = {
  examType: "WRITTEN_CBT",
  difficulty: "medium",
  category: "",
  prompt: "",
  choices: ["", "", "", ""],
  correctChoice: "1",
  modelAnswer: "",
  keyPoints: "",
  explanation: "",
  imageUrl: "",
  imageUrls: "",
  referenceText: "",
  codeSnippet: "",
  codeLanguage: "",
  tags: "",
  source: "",
  sourceYear: ""
};

export function QuestionManager({ study, setStudy, questionBank }: QuestionManagerProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "archived">("all");
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [listPage, setListPage] = useState(1);
  const [managerSection, setManagerSection] = useState<"questions" | "reports" | "data">("questions");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const backupInput = useRef<HTMLInputElement>(null);

  function saveQuestion() {
    const existing = editingId ? study.customQuestions.find((question) => question.id === editingId) : undefined;
    const result = formToQuestion(form, existing);
    if (typeof result === "string") {
      setMessage(result);
      return;
    }
    setStudy((current) => ({
      ...current,
      customQuestions: existing
        ? current.customQuestions.map((question) => question.id === existing.id ? result : question)
        : [result, ...current.customQuestions]
    }));
    setForm(initialForm);
    setEditingId(null);
    setMessage(existing ? "문제를 수정하고 버전을 올렸습니다. 진행 중이거나 완료된 시험의 스냅샷은 변경되지 않습니다." : "문제를 초안으로 저장했습니다. 검토 후 게시해 주세요.");
    setShowForm(false);
  }

  function removeQuestion(id: string) {
    if (!window.confirm("이 문제를 삭제할까요? 삭제한 문제는 복구할 수 없습니다.")) return;
    setStudy((current) => ({
      ...current,
      customQuestions: current.customQuestions.filter((question) => question.id !== id)
    }));
    setSelectedQuestionIds((current) => current.filter((selectedId) => selectedId !== id));
  }

  function editQuestion(question: Question) {
    setEditingId(question.id);
    setForm(questionToForm(question));
    setShowForm(true);
    setMessage(`버전 ${question.version} 문제를 수정합니다.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function duplicateQuestion(question: Question) {
    const duplicate = structuredClone(question);
    duplicate.id = `custom-${crypto.randomUUID()}`;
    duplicate.version = 1;
    duplicate.publicationStatus = "draft";
    duplicate.prompt = `${duplicate.prompt} (복사본)`;
    setStudy((current) => ({ ...current, customQuestions: [duplicate, ...current.customQuestions] }));
    setMessage("문제를 초안으로 복제했습니다.");
  }

  function updatePublicationStatus(id: string, publicationStatus: "draft" | "published" | "archived") {
    setStudy((current) => ({ ...current, customQuestions: current.customQuestions.map((question) => question.id === id ? { ...question, publicationStatus } : question) }));
    setMessage(publicationStatus === "published" ? "문제를 게시했습니다." : publicationStatus === "archived" ? "문제를 보관했습니다." : "문제를 초안으로 되돌렸습니다.");
  }

  function updateSelectedPublicationStatus(publicationStatus: "draft" | "published" | "archived") {
    if (!selectedQuestionIds.length) return;
    const selected = new Set(selectedQuestionIds);
    setStudy((current) => ({ ...current, customQuestions: current.customQuestions.map((question) => selected.has(question.id) ? { ...question, publicationStatus } : question) }));
    setMessage(`${selectedQuestionIds.length}개 문제의 상태를 변경했습니다.`);
  }

  function removeSelectedQuestions() {
    if (!selectedQuestionIds.length || !window.confirm(`선택한 ${selectedQuestionIds.length}개 문제를 삭제할까요? 삭제한 문제는 복구할 수 없습니다.`)) return;
    const selected = new Set(selectedQuestionIds);
    setStudy((current) => ({ ...current, customQuestions: current.customQuestions.filter((question) => !selected.has(question.id)) }));
    setMessage(`${selectedQuestionIds.length}개 문제를 삭제했습니다.`);
    setSelectedQuestionIds([]);
  }

  function publishAllDrafts() {
    const draftCount = study.customQuestions.filter((question) => (question.publicationStatus ?? "published") === "draft").length;
    if (!draftCount || !window.confirm(`초안 ${draftCount}개를 모두 게시할까요?`)) return;
    setStudy((current) => ({ ...current, customQuestions: current.customQuestions.map((question) => (question.publicationStatus ?? "published") === "draft" ? { ...question, publicationStatus: "published" } : question) }));
    setMessage(`초안 ${draftCount}개를 게시했습니다.`);
  }

  function addChoice() {
    setForm((current) => ({ ...current, choices: [...current.choices, ""] }));
  }

  function removeChoice(index: number) {
    setForm((current) => {
      if (current.choices.length <= 2) return current;
      const correctIndex = Number(current.correctChoice) - 1;
      const choices = current.choices.filter((_, choiceIndex) => choiceIndex !== index);
      const nextCorrectIndex = correctIndex === index ? 0 : correctIndex > index ? correctIndex - 1 : correctIndex;
      return { ...current, choices, correctChoice: String(Math.max(0, Math.min(choices.length - 1, nextCorrectIndex)) + 1) };
    });
  }

  async function loadQuestionImage(file: File) {
    if (!["image/png", "image/jpeg", "image/gif", "image/webp", "image/avif"].includes(file.type)) { setMessage("PNG, JPEG, GIF, WebP 또는 AVIF 이미지만 업로드할 수 있습니다."); return; }
    if (file.size > 1024 * 1024) { setMessage("이미지는 1MB 이하만 업로드할 수 있습니다."); return; }
    try {
      const imageUrl = await readFileAsDataUrl(file);
      setForm((current) => current.imageUrl.trim() ? { ...current, imageUrls: [current.imageUrls.trim(), imageUrl].filter(Boolean).join("\n") } : { ...current, imageUrl });
      setMessage("문제 이미지를 불러왔습니다. 문제를 저장해야 반영됩니다.");
    } catch {
      setMessage("이미지 파일을 읽지 못했습니다.");
    }
  }

  async function importCsv(file: File) {
    try {
      const rows = parseCsv(await file.text());
      const imported: Question[] = [];
      const errors: string[] = [];
      const existingKeys = new Set(questionBank.map(questionDuplicateKey));
      const importedKeys = new Set<string>();
      rows.slice(1).forEach((row, index) => {
        if (row.every((cell) => !cell.trim())) return;
        const formRow: FormState = {
          examType: normalizeExamType(row[0]),
          difficulty: normalizeDifficulty(row[11]),
          category: row[1] ?? "",
          prompt: row[2] ?? "",
          choices: [row[3] ?? "", row[4] ?? "", row[5] ?? "", row[6] ?? ""],
          correctChoice: row[7] ?? "1",
          modelAnswer: row[8] ?? "",
          keyPoints: row[9] ?? "",
          explanation: row[10] ?? "",
          imageUrl: row[12] ?? "",
          tags: row[13] ?? "",
          source: row[14] ?? "",
          sourceYear: row[15] ?? "",
          referenceText: row[16] ?? "",
          codeSnippet: row[17] ?? "",
          codeLanguage: row[18] ?? "",
          imageUrls: row[19] ?? ""
        };
        const question = formToQuestion(formRow);
        if (typeof question === "string") errors.push(`${index + 2}행: ${question}`);
        else {
          const duplicateKey = questionDuplicateKey(question);
          if (existingKeys.has(duplicateKey)) errors.push(`${index + 2}행: 이미 문제은행에 같은 문제가 있습니다.`);
          else if (importedKeys.has(duplicateKey)) errors.push(`${index + 2}행: 파일 안에 같은 문제가 중복되어 있습니다.`);
          else { imported.push(question); importedKeys.add(duplicateKey); }
        }
      });
      setImportPreview({ questions: imported, errors });
      setMessage(`검증 완료: 저장 가능 ${imported.length}개, 오류 ${errors.length}개`);
    } catch {
      setMessage("CSV 파일을 읽을 수 없습니다. UTF-8 형식인지 확인해 주세요.");
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function confirmImport() {
    if (!importPreview?.questions.length) return;
    setStudy((current) => ({ ...current, customQuestions: [...importPreview.questions, ...current.customQuestions] }));
    setMessage(`${importPreview.questions.length}개 문제를 초안으로 저장했습니다.`);
    setImportPreview(null);
  }

  function cancelImport() {
    setImportPreview(null);
    setMessage("CSV 가져오기를 취소했습니다.");
  }

  function downloadImportErrors() {
    if (!importPreview?.errors.length) return;
    const content = ["행,오류", ...importPreview.errors.map((error) => {
      const match = error.match(/^(\d+)행:\s*(.*)$/);
      return match ? `${match[1]},${csvCell(match[2])}` : `,${csvCell(error)}`;
    })].join("\r\n");
    downloadBlob(`\uFEFF${content}`, `question-import-errors-${koreanDateKey(new Date())}.csv`, "text/csv;charset=utf-8");
  }

  function exportAllData() {
    const backup = {
      format: BACKUP_FORMAT,
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      data: study
    };
    downloadBlob(JSON.stringify(backup, null, 2), `certificate-practice-backup-${koreanDateKey(new Date())}.json`, "application/json");
    setMessage("전체 학습 데이터를 내보냈습니다.");
  }

  async function importBackup(file: File) {
    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      const data = validateBackup(parsed);
      if (!window.confirm("현재 기기의 데이터를 백업 파일 내용으로 교체할까요? 이 작업은 되돌릴 수 없습니다.")) return;
      setStudy(data);
      setMessage("백업 데이터를 복원했습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "백업 파일을 읽지 못했습니다.");
    } finally {
      if (backupInput.current) backupInput.current.value = "";
    }
  }

  function resetAllData() {
    if (!window.confirm("추가 문제, 답안, 시험 기록, 북마크와 AI 해설을 모두 삭제할까요? 이 작업은 되돌릴 수 없습니다.")) return;
    setStudy(structuredClone(emptyStudyState));
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    setSelectedQuestionIds([]);
    setMessage("이 기기의 모든 학습 데이터를 초기화했습니다.");
  }

  function resolveReport(id: string) {
    setStudy((current) => ({ ...current, questionReports: current.questionReports.map((report) => report.id === id ? { ...report, status: "resolved" } : report) }));
  }

  function updateAiReport(id: string, status: "resolved" | "hidden") {
    setStudy((current) => ({ ...current, aiExplanationReports: current.aiExplanationReports.map((report) => report.id === id ? { ...report, status } : report) }));
  }

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("ko-KR");
  const filteredQuestions = study.customQuestions.filter((question) => {
    if (statusFilter !== "all" && (question.publicationStatus ?? "published") !== statusFilter) return false;
    if (!normalizedQuery) return true;
    return `${question.category} ${question.prompt} ${question.referenceText ?? ""} ${question.codeSnippet ?? ""} ${question.source ?? ""} ${question.sourceYear ?? ""} ${(question.tags ?? []).join(" ")}`.toLocaleLowerCase("ko-KR").includes(normalizedQuery);
  });
  const pageSize = 20;
  const pageCount = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));
  const currentPage = Math.min(listPage, pageCount);
  const visibleQuestions = filteredQuestions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const visibleQuestionIds = visibleQuestions.map((question) => question.id);
  const allVisibleSelected = visibleQuestionIds.length > 0 && visibleQuestionIds.every((id) => selectedQuestionIds.includes(id));

  return <section>
    <div className="hero"><p>로컬 문제은행</p><h1>문제 관리</h1><span>등록한 문제는 계정 없이 이 브라우저에 저장됩니다.</span></div>
    <div className="managerTabs" role="tablist" aria-label="문제 관리 메뉴">
      <button role="tab" aria-selected={managerSection === "questions"} className={managerSection === "questions" ? "active" : ""} onClick={() => setManagerSection("questions")}>문제 <small>{study.customQuestions.length}</small></button>
      <button role="tab" aria-selected={managerSection === "reports"} className={managerSection === "reports" ? "active" : ""} onClick={() => setManagerSection("reports")}>신고 <small>{study.questionReports.filter((report) => report.status === "open").length + study.aiExplanationReports.filter((report) => report.status === "open").length}</small></button>
      <button role="tab" aria-selected={managerSection === "data"} className={managerSection === "data" ? "active" : ""} onClick={() => setManagerSection("data")}>데이터</button>
    </div>
    {managerSection === "questions" && <div role="tabpanel" className="managerSection">
    <div className="managerActions">
      <button className="submit" onClick={() => { if (showForm) { setShowForm(false); setEditingId(null); setForm(initialForm); } else setShowForm(true); }}>{showForm ? "입력 닫기" : "+ 문제 추가"}</button>
      <button onClick={() => fileInput.current?.click()}>CSV 가져오기</button>
      <button onClick={downloadTemplate}>CSV 양식 받기</button>
      {study.customQuestions.some((question) => (question.publicationStatus ?? "published") === "draft") && <button onClick={publishAllDrafts}>모든 초안 게시</button>}
      <input ref={fileInput} hidden type="file" accept=".csv,text/csv" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importCsv(file); }} />
    </div>
    {message && <p className="managerMessage">{message}</p>}

    {importPreview && <div className="panel importPreview">
      <div className="sectionTitle"><h2>CSV 가져오기 미리보기</h2><span>저장 가능 {importPreview.questions.length}개 · 오류 {importPreview.errors.length}개</span></div>
      {importPreview.questions.length > 0 && <div className="importSample">{importPreview.questions.slice(0, 5).map((question) => <div key={question.id}><small>{question.examType === "WRITTEN_CBT" ? "필기 CBT" : "실기 필답형"} · {question.category}</small><strong>{question.prompt}</strong></div>)}{importPreview.questions.length > 5 && <p>외 {importPreview.questions.length - 5}개</p>}</div>}
      {importPreview.errors.length > 0 && <div className="importErrors"><strong>확인이 필요한 행</strong>{importPreview.errors.slice(0, 8).map((error) => <p key={error}>{error}</p>)}{importPreview.errors.length > 8 && <p>외 {importPreview.errors.length - 8}개 오류</p>}<button onClick={downloadImportErrors}>오류 보고서 받기</button></div>}
      <div className="importActions"><button onClick={cancelImport}>취소</button><button className="submit" disabled={importPreview.questions.length === 0} onClick={confirmImport}>초안으로 저장</button></div>
    </div>}

    {showForm && <div className="panel editor">
      <label>시험 유형</label>
      <div className="segments"><button className={form.examType === "WRITTEN_CBT" ? "active" : ""} onClick={() => setForm({ ...form, examType: "WRITTEN_CBT" })}>필기 CBT</button><button className={form.examType === "PRACTICAL_WRITTEN_RESPONSE" ? "active" : ""} onClick={() => setForm({ ...form, examType: "PRACTICAL_WRITTEN_RESPONSE" })}>실기 필답형</button></div>
      <label>난이도</label><select value={form.difficulty} onChange={(event) => setForm({ ...form, difficulty: event.target.value as Question["difficulty"] })}><option value="easy">쉬움</option><option value="medium">보통</option><option value="hard">어려움</option></select>
      <div className="editorGrid"><div><label>분류</label><input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="예: 데이터베이스" /></div><div><label>문제</label><textarea className="promptEditor" value={form.prompt} onChange={(event) => setForm({ ...form, prompt: event.target.value })} placeholder="문제 내용과 코드 등을 여러 줄로 입력하세요" /></div></div>
      <label>보기 또는 참고 자료</label><textarea className="contentEditor" value={form.referenceText} onChange={(event) => setForm({ ...form, referenceText: event.target.value })} placeholder="문제와 구분해서 보여 줄 보기, 조건, 표 형식 자료 등을 입력하세요" />
      <div className="editorGrid codeEditor"><div><label>코드</label><textarea value={form.codeSnippet} onChange={(event) => setForm({ ...form, codeSnippet: event.target.value })} placeholder="들여쓰기를 유지한 코드를 입력하세요" spellCheck={false} /></div><div><label>코드 언어</label><input value={form.codeLanguage} onChange={(event) => setForm({ ...form, codeLanguage: event.target.value })} placeholder="예: Java, SQL, Python" /></div></div>
      <div className="editorGrid metadataEditor"><div><label>태그</label><input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="쉼표로 구분" /></div><div><label>출처</label><input value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value })} placeholder="예: 2024년 기출" /></div><div><label>출제 연도</label><input type="number" inputMode="numeric" value={form.sourceYear} onChange={(event) => setForm({ ...form, sourceYear: event.target.value })} placeholder="2024" /></div></div>
      <label>참고 이미지</label><input value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} placeholder="첫 이미지의 https 주소 또는 /images/example.png" /><textarea className="imageUrlEditor" value={form.imageUrls} onChange={(event) => setForm({ ...form, imageUrls: event.target.value })} placeholder="추가 이미지 주소를 한 줄에 하나씩 입력하세요 (최대 6장)" /><div className="imageEditorActions"><label>이미지 파일 추가<input hidden type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) void loadQuestionImage(file); event.target.value = ""; }} /></label>{getFormImageUrls(form).length > 0 && <button onClick={() => setForm({ ...form, imageUrl: "", imageUrls: "" })}>이미지 모두 제거</button>}</div>{getFormImageUrls(form).length > 0 && <div className="imagePreviewList">{getFormImageUrls(form).map((url, index) => <img className="imagePreview" src={url} alt={`문제 이미지 ${index + 1} 미리보기`} key={url} />)}</div>}
      {form.examType === "WRITTEN_CBT" ? <>
        <label>선택지</label><div className="choiceEditor">{form.choices.map((choice, index) => <div className="choiceRow" key={index}><input value={choice} onChange={(event) => { const choices = [...form.choices]; choices[index] = event.target.value; setForm({ ...form, choices }); }} placeholder={`${index + 1}번 선택지`} /><button disabled={form.choices.length <= 2} onClick={() => removeChoice(index)} aria-label={`${index + 1}번 선택지 삭제`}>삭제</button></div>)}</div><button className="addChoiceButton" onClick={addChoice}>+ 선택지 추가</button>
        <label>정답 번호</label><select value={form.correctChoice} onChange={(event) => setForm({ ...form, correctChoice: event.target.value })}>{form.choices.map((_, index) => <option key={index + 1}>{index + 1}</option>)}</select>
      </> : <><label>모범답안</label><textarea value={form.modelAnswer} onChange={(event) => setForm({ ...form, modelAnswer: event.target.value })} /><label>필수 핵심 내용</label><input value={form.keyPoints} onChange={(event) => setForm({ ...form, keyPoints: event.target.value })} placeholder="쉼표로 구분" /></>}
      <label>공식 해설</label><textarea className="shortTextarea" value={form.explanation} onChange={(event) => setForm({ ...form, explanation: event.target.value })} />
      <button className="fullButton" onClick={saveQuestion}>{editingId ? "수정 내용 저장" : "문제 저장"}</button>
    </div>}

    <div className="sectionTitle"><h2>내 문제 {study.customQuestions.length}개</h2></div>
    <div className="managerListToolbar"><input type="search" value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setListPage(1); }} placeholder="문제·과목·태그·출처 검색" /><span>{filteredQuestions.length}개 찾음</span></div>
    <div className="chips statusFilters">{(["all", "draft", "published", "archived"] as const).map((status) => <button key={status} className={statusFilter === status ? "active" : ""} onClick={() => { setStatusFilter(status); setListPage(1); }}>{status === "all" ? "전체" : statusLabel(status)} <small>{status === "all" ? study.customQuestions.length : study.customQuestions.filter((question) => (question.publicationStatus ?? "published") === status).length}</small></button>)}</div>
    {visibleQuestions.length > 0 && <div className="bulkToolbar"><label><input type="checkbox" checked={allVisibleSelected} onChange={() => setSelectedQuestionIds((current) => togglePageSelection(current, visibleQuestionIds))} /> 현재 페이지 선택</label><span>{selectedQuestionIds.length}개 선택</span>{selectedQuestionIds.length > 0 && <div><button onClick={() => updateSelectedPublicationStatus("published")}>게시</button><button onClick={() => updateSelectedPublicationStatus("archived")}>보관</button><button onClick={() => updateSelectedPublicationStatus("draft")}>초안</button><button className="delete" onClick={removeSelectedQuestions}>삭제</button><button onClick={() => setSelectedQuestionIds([])}>해제</button></div>}</div>}
    {study.customQuestions.length === 0 ? <div className="panel emptyManager">아직 추가한 문제가 없습니다.</div> : visibleQuestions.length === 0 ? <div className="panel emptyManager">검색 조건에 맞는 문제가 없습니다.</div> : <><div className="managedList">{visibleQuestions.map((question) => { const status = question.publicationStatus ?? "published"; const sourceLabel = [question.source, question.sourceYear ? `${question.sourceYear}년` : ""].filter(Boolean).join(" · "); return <article className={`panel ${selectedQuestionIds.includes(question.id) ? "selected" : ""}`} key={question.id}><label className="manageSelect"><input type="checkbox" checked={selectedQuestionIds.includes(question.id)} onChange={() => setSelectedQuestionIds((current) => toggleSelectedId(current, question.id))} /><span className="srOnly">{question.prompt} 선택</span></label><div className="managedQuestionText"><small><span className={`statusBadge ${status}`}>{statusLabel(status)}</span> · {question.examType === "WRITTEN_CBT" ? "필기 CBT" : "실기 필답형"} · {difficultyLabel(question.difficulty)} · {question.category}{sourceLabel ? ` · ${sourceLabel}` : ""} · v{question.version}</small><strong>{question.prompt}</strong></div><div className="managedActions">{status !== "published" && <button onClick={() => updatePublicationStatus(question.id, "published")}>게시</button>}{status === "published" && <button onClick={() => updatePublicationStatus(question.id, "archived")}>보관</button>}{status === "archived" && <button onClick={() => updatePublicationStatus(question.id, "draft")}>초안 전환</button>}<button onClick={() => editQuestion(question)}>수정</button><button onClick={() => duplicateQuestion(question)}>복제</button><button className="delete" onClick={() => removeQuestion(question.id)}>삭제</button></div></article>; })}</div>{pageCount > 1 && <div className="pagination"><button disabled={currentPage === 1} onClick={() => setListPage(currentPage - 1)}>이전</button><span>{currentPage} / {pageCount}</span><button disabled={currentPage === pageCount} onClick={() => setListPage(currentPage + 1)}>다음</button></div>}</>}
    </div>}

    {managerSection === "reports" && <div role="tabpanel" className="managerSection">
    <div className="sectionTitle"><h2>문제 신고</h2><span>미처리 {study.questionReports.filter((report) => report.status === "open").length}개</span></div>
    {study.questionReports.length === 0 ? <div className="panel emptyManager">저장된 문제 신고가 없습니다.</div> : <div className="reportList">{study.questionReports.slice(0, 20).map((report) => { const question = questionBank.find((item) => item.id === report.questionId); return <article className={`panel ${report.status}`} key={report.id}><div><small>{reportReasonLabel(report.reason)} · v{report.questionVersion}</small><strong>{question?.prompt ?? "삭제되거나 찾을 수 없는 문제"}</strong><p>{report.details || "추가 설명 없음"}</p></div><button disabled={report.status === "resolved"} onClick={() => resolveReport(report.id)}>{report.status === "resolved" ? "처리됨" : "처리 완료"}</button></article>; })}</div>}

    <div className="sectionTitle"><h2>AI 해설 신고</h2><span>미처리 {study.aiExplanationReports.filter((report) => report.status === "open").length}개</span></div>
    {study.aiExplanationReports.length === 0 ? <div className="panel emptyManager">저장된 AI 해설 신고가 없습니다.</div> : <div className="reportList">{study.aiExplanationReports.slice(0, 20).map((report) => { const question = questionBank.find((item) => item.id === report.questionId); return <article className={`panel ${report.status}`} key={report.id}><div><small>{aiReportReasonLabel(report.reason)} · v{report.questionVersion}</small><strong>{question?.prompt ?? "삭제되거나 찾을 수 없는 문제"}</strong><p>{report.explanationSnapshot}</p>{report.details && <p>신고 내용: {report.details}</p>}</div><div className="managedActions"><button disabled={report.status === "resolved"} onClick={() => updateAiReport(report.id, "resolved")}>확인 완료</button><button className="delete" disabled={report.status === "hidden"} onClick={() => updateAiReport(report.id, "hidden")}>해설 숨김</button></div></article>; })}</div>}
    </div>}

    {managerSection === "data" && <div role="tabpanel" className="managerSection">
    <div className="sectionTitle"><h2>학습 데이터 관리</h2></div>
    <div className="panel dataManager">
      <div><strong>계정 없이 데이터 옮기기</strong><p>추가 문제, 답안, 시험 기록, 북마크와 저장된 AI 해설을 하나의 파일로 관리합니다.</p></div>
      <div className="dataActions"><button onClick={exportAllData}>전체 데이터 내보내기</button><button onClick={() => backupInput.current?.click()}>백업 가져오기</button><button className="danger" onClick={resetAllData}>모든 데이터 초기화</button></div>
      <input ref={backupInput} hidden type="file" accept=".json,application/json" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importBackup(file); }} />
    </div>
    </div>}
  </section>;
}

function reportReasonLabel(reason: StudyState["questionReports"][number]["reason"]) {
  return { incorrect_answer: "정답 오류", question_error: "문제 오류", insufficient_explanation: "해설 부족", other: "기타" }[reason];
}

function aiReportReasonLabel(reason: StudyState["aiExplanationReports"][number]["reason"]) {
  return { inaccurate: "내용 오류", unclear: "설명 불명확", too_long: "너무 긴 해설", other: "기타" }[reason];
}

function statusLabel(status: "draft" | "published" | "archived") {
  return { draft: "초안", published: "게시됨", archived: "보관됨" }[status];
}

function difficultyLabel(difficulty: Question["difficulty"]) {
  return { easy: "쉬움", medium: "보통", hard: "어려움" }[difficulty];
}

function formToQuestion(form: FormState, existing?: Question): Question | string {
  if (!form.category.trim()) return "분류를 입력해 주세요.";
  if (!form.prompt.trim()) return "문제를 입력해 주세요.";
  const tags = [...new Set(form.tags.split(/[,|;]/).map((tag) => tag.trim()).filter(Boolean))];
  if (tags.length > 20) return "태그는 최대 20개까지 입력할 수 있습니다.";
  if (tags.some((tag) => tag.length > 40)) return "태그 하나는 40자 이내로 입력해 주세요.";
  if (form.source.trim().length > 100) return "출처는 100자 이내로 입력해 주세요.";
  const sourceYear = form.sourceYear.trim() ? Number(form.sourceYear) : undefined;
  if (sourceYear !== undefined && (!Number.isInteger(sourceYear) || sourceYear < 1900 || sourceYear > new Date().getFullYear() + 1)) return "출제 연도를 올바르게 입력해 주세요.";
  const imageUrls = getFormImageUrls(form);
  if (imageUrls.length > 6) return "참고 이미지는 최대 6장까지 등록할 수 있습니다.";
  if (imageUrls.some((url) => !isAllowedImageUrl(url))) return "이미지는 https 주소, 사이트 내부 경로 또는 업로드한 이미지 형식만 사용할 수 있습니다.";
  if (form.referenceText.length > 10_000) return "보기 또는 참고 자료는 10,000자 이내로 입력해 주세요.";
  if (form.codeSnippet.length > 20_000) return "코드는 20,000자 이내로 입력해 주세요.";
  if (form.codeLanguage.trim().length > 30) return "코드 언어 이름은 30자 이내로 입력해 주세요.";
  if (form.codeLanguage.trim() && !form.codeSnippet.trim()) return "코드 언어를 지정하려면 코드도 입력해 주세요.";
  const base = {
    id: existing?.id ?? `custom-${crypto.randomUUID()}`,
    certificateId: "information-processing-engineer",
    category: form.category.trim(),
    prompt: form.prompt.trim(),
    explanation: form.explanation.trim(),
    difficulty: form.difficulty,
    version: existing ? existing.version + 1 : 1,
    publicationStatus: existing?.publicationStatus ?? "draft",
    ...(imageUrls[0] ? { imageUrl: imageUrls[0] } : {}),
    ...(imageUrls.length > 1 ? { imageUrls: imageUrls.slice(1) } : {}),
    ...(form.referenceText.trim() ? { referenceText: form.referenceText.trim() } : {}),
    ...(form.codeSnippet.trim() ? { codeSnippet: form.codeSnippet.trim() } : {}),
    ...(form.codeSnippet.trim() && form.codeLanguage.trim() ? { codeLanguage: form.codeLanguage.trim() } : {}),
    ...(tags.length ? { tags } : {}),
    ...(form.source.trim() ? { source: form.source.trim() } : {}),
    ...(sourceYear !== undefined ? { sourceYear } : {})
  };
  if (form.examType === "WRITTEN_CBT") {
    if (form.choices.length < 2) return "선택지를 두 개 이상 입력해 주세요.";
    if (form.choices.some((choice) => !choice.trim())) return "빈 선택지가 없도록 모두 입력해 주세요.";
    const correctChoiceIndex = Number(form.correctChoice) - 1;
    if (!Number.isInteger(correctChoiceIndex) || correctChoiceIndex < 0 || correctChoiceIndex >= form.choices.length) return "정답 번호가 선택지 범위를 벗어났습니다.";
    return { ...base, examType: "WRITTEN_CBT", choices: form.choices.map((choice) => choice.trim()), correctChoiceIndex };
  }
  if (!form.modelAnswer.trim()) return "모범답안을 입력해 주세요.";
  return { ...base, examType: "PRACTICAL_WRITTEN_RESPONSE", modelAnswer: form.modelAnswer.trim(), requiredKeyPoints: form.keyPoints.split(",").map((point) => point.trim()).filter(Boolean) };
}

function questionToForm(question: Question): FormState {
  if (question.examType === "WRITTEN_CBT") {
    return {
      examType: question.examType,
      difficulty: question.difficulty,
      category: question.category,
      prompt: question.prompt,
      choices: [...question.choices],
      correctChoice: String(question.correctChoiceIndex + 1),
      modelAnswer: "",
      keyPoints: "",
      explanation: question.explanation,
      imageUrl: question.imageUrl ?? "",
      imageUrls: question.imageUrls?.join("\n") ?? "",
      referenceText: question.referenceText ?? "",
      codeSnippet: question.codeSnippet ?? "",
      codeLanguage: question.codeLanguage ?? "",
      tags: question.tags?.join(", ") ?? "",
      source: question.source ?? "",
      sourceYear: question.sourceYear ? String(question.sourceYear) : ""
    };
  }
  return {
    examType: question.examType,
    difficulty: question.difficulty,
    category: question.category,
    prompt: question.prompt,
    choices: ["", "", "", ""],
    correctChoice: "1",
    modelAnswer: question.modelAnswer,
    keyPoints: question.requiredKeyPoints.join(", "),
    explanation: question.explanation,
    imageUrl: question.imageUrl ?? "",
    imageUrls: question.imageUrls?.join("\n") ?? "",
    referenceText: question.referenceText ?? "",
    codeSnippet: question.codeSnippet ?? "",
    codeLanguage: question.codeLanguage ?? "",
    tags: question.tags?.join(", ") ?? "",
    source: question.source ?? "",
    sourceYear: question.sourceYear ? String(question.sourceYear) : ""
  };
}

function normalizeExamType(value = ""): ExamType {
  return value.trim().toUpperCase().includes("PRACTICAL") || value.includes("실기")
    ? "PRACTICAL_WRITTEN_RESPONSE"
    : "WRITTEN_CBT";
}

function normalizeDifficulty(value = ""): Question["difficulty"] {
  const normalized = value.trim().toLowerCase();
  if (normalized === "easy" || normalized === "쉬움") return "easy";
  if (normalized === "hard" || normalized === "어려움") return "hard";
  return "medium";
}

function questionDuplicateKey(question: Question) {
  const normalizedPrompt = question.prompt.normalize("NFKC").trim().replaceAll(/\s+/g, " ").toLocaleLowerCase("ko-KR");
  return `${question.examType}:${normalizedPrompt}`;
}

function parseCsv(source: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === '"' && quoted && source[index + 1] === '"') { cell += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && source[index + 1] === "\n") index += 1;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function downloadTemplate() {
  const header = "exam_type,category,prompt,choice1,choice2,choice3,choice4,correct_answer,model_answer,key_points,explanation,difficulty,image_url,tags,source,source_year,reference_text,code_snippet,code_language,image_urls";
  const example = "WRITTEN_CBT,데이터베이스,다음 SQL의 실행 결과는?,1,2,3,4,2,,,COUNT는 행 수를 반환한다,medium,,SQL|기출,2024년 기출,2024,테이블에는 2개의 행이 있다,SELECT COUNT(*) FROM sample;,SQL,";
  downloadBlob(`\uFEFF${header}\n${example}\n`, "question-template.csv", "text/csv;charset=utf-8");
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function isAllowedImageUrl(value: string) {
  return value.startsWith("https://") || (value.startsWith("/") && !value.startsWith("//")) || /^data:image\/(?:png|jpeg|gif|webp|avif);base64,/i.test(value);
}

function getFormImageUrls(form: Pick<FormState, "imageUrl" | "imageUrls">) {
  return [...new Set([form.imageUrl, ...form.imageUrls.split(/\r?\n|\|/)].map((url) => url.trim()).filter(Boolean))];
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("invalid result"));
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

function validateBackup(value: unknown): StudyState {
  if (!value || typeof value !== "object") throw new Error("올바른 백업 파일이 아닙니다.");
  const backup = value as { format?: unknown; version?: unknown; data?: unknown };
  if (backup.format !== BACKUP_FORMAT || typeof backup.version !== "number" || backup.version < 1 || backup.version > BACKUP_VERSION) throw new Error("지원하지 않는 백업 형식입니다.");
  if (!backup.data || typeof backup.data !== "object") throw new Error("백업 데이터가 없습니다.");
  const data = backup.data as Record<string, unknown>;
  const knownKeys = ["answers", "bookmarks", "aiExplanations", "activeTest", "testResults", "customQuestions", "activePractice", "activities", "notes", "noteUpdatedAt", "questionReports", "aiExplanationReports"];
  if (!knownKeys.some((key) => key in data)) throw new Error("인식할 수 있는 학습 데이터가 없습니다.");
  return migrateStudyState(data);
}
