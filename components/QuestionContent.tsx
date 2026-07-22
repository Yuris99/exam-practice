import { QuestionImage } from "@/components/QuestionImage";
import type { Question } from "@/lib/types";

export function QuestionContent({ question }: { question: Question }) {
  return <>
    {question.referenceText && <section className="referenceBox" aria-label="보기 또는 참고 자료"><strong>보기</strong><div>{question.referenceText}</div></section>}
    {question.codeSnippet && <section className="codeBlock" aria-label="문제 코드"><header><strong>코드</strong>{question.codeLanguage && <span>{question.codeLanguage}</span>}</header><pre tabIndex={0} aria-label="가로로 스크롤할 수 있는 문제 코드"><code>{question.codeSnippet}</code></pre></section>}
    <QuestionImage question={question} />
  </>;
}
