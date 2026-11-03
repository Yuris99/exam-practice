import type { PracticalQuestion } from "@/lib/types";

export function PracticalAnswerInput({ value, onChange, disabled = false }: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return <div>
    <p id="practical-answer-help">복수 답은 번호별로, 코드와 계산 과정은 줄을 나누어 작성하세요.</p>
    <textarea aria-label="실기 답안" aria-describedby="practical-answer-help" rows={8}
      spellCheck={false} disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)}
      placeholder="번호별 답, 계산 과정 또는 코드를 여러 줄로 입력하세요" />
    <p>실기는 자동으로 정오를 확정하지 않습니다. 제출 후 모범답안·핵심어·해설과 비교해 직접 평가하세요. 핵심어가 같아도 조건·과정이 틀리면 정답이 아닙니다.</p>
  </div>;
}

export function PracticalAnswerReview({ question, answer }: { question: PracticalQuestion; answer?: string }) {
  return <section aria-label="실기 답안 비교">
    {answer !== undefined && <><strong>내 답안</strong><p style={{ whiteSpace: "pre-wrap" }}>{answer || "미답변"}</p></>}
    <strong>학습용 모범답안</strong>
    <p style={{ whiteSpace: "pre-wrap" }}>{question.modelAnswer}</p>
    <strong>채점 핵심어·동의어</strong>
    <ul>{question.requiredKeyPoints.map((point) => <li key={point}>{point}</li>)}</ul>
    <p>핵심어는 자기평가를 돕는 기준입니다. 동등한 표현도 인정하되 논리·순서·단위·전제를 함께 확인하세요.</p>
  </section>;
}
