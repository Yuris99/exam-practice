"use client";

import { useState } from "react";
import type { QuestionReport } from "@/lib/types";

interface QuestionToolsProps {
  note: string;
  onNoteChange: (note: string) => void;
  onReport: (reason: QuestionReport["reason"], details: string) => void;
}

export function QuestionTools({ note, onNoteChange, onReport }: QuestionToolsProps) {
  const [showNote, setShowNote] = useState(Boolean(note));
  const [showReport, setShowReport] = useState(false);
  const [reason, setReason] = useState<QuestionReport["reason"]>("incorrect_answer");
  const [details, setDetails] = useState("");
  const [reported, setReported] = useState(false);

  function submitReport() {
    onReport(reason, details.trim());
    setReported(true);
    setShowReport(false);
    setDetails("");
  }

  return <div className="questionTools">
    <div className="toolButtons"><button onClick={() => setShowNote((value) => !value)}>✎ {note ? "메모 있음" : "메모"}</button><button onClick={() => { setShowReport((value) => !value); setReported(false); }}>! 문제 신고</button></div>
    {showNote && <div className="noteEditor"><textarea value={note} onChange={(event) => onNoteChange(event.target.value)} placeholder="나만의 암기법이나 헷갈린 내용을 기록하세요" /><small>입력한 내용은 이 기기에 자동 저장됩니다.</small></div>}
    {showReport && <div className="reportEditor"><select value={reason} onChange={(event) => setReason(event.target.value as QuestionReport["reason"])}><option value="incorrect_answer">정답 오류</option><option value="question_error">문제 오류</option><option value="insufficient_explanation">해설 부족</option><option value="other">기타</option></select><textarea value={details} onChange={(event) => setDetails(event.target.value)} placeholder="문제가 있는 부분을 알려 주세요 (선택)" /><button onClick={submitReport}>신고 저장</button></div>}
    {reported && <p className="reportComplete">문제 신고를 이 기기에 저장했습니다.</p>}
  </div>;
}
