"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadStudyState, saveStudyState } from "@/lib/storage";
import type { TheoryConceptMatch } from "@/lib/theory";
import { theoryConceptHref, theoryProgressKey } from "@/lib/theory";
import type { TheoryBlock } from "@/lib/theoryTypes";
import { TheoryShell } from "./TheoryCourseOverview";
import styles from "./TheoryTrail.module.css";

export interface RelatedTheoryQuestion { id: string; prompt: string; source?: string; sourceYear?: number }

export function TheoryConceptLesson({ match, relatedQuestions }: { match: TheoryConceptMatch; relatedQuestions: RelatedTheoryQuestion[] }) {
  const { course, subject, unit, concept } = match;
  const key = theoryProgressKey(match);
  const [completedKeys, setCompletedKeys] = useState<string[]>([]);
  useEffect(() => setCompletedKeys(Object.keys(loadStudyState().theoryProgress)), []);
  const currentIndex = unit.concepts.findIndex((item) => item.id === concept.id);
  const previous = currentIndex > 0 ? unit.concepts[currentIndex - 1] : undefined;
  const next = currentIndex < unit.concepts.length - 1 ? unit.concepts[currentIndex + 1] : undefined;
  const done = completedKeys.includes(key);
  const unitKeys = unit.concepts.map((item) => `${course.certificateId}:${subject.id}:${unit.id}:${item.id}`);
  const completedCount = unitKeys.filter((item) => completedKeys.includes(item)).length;
  const progress = Math.round(completedCount / unitKeys.length * 100);
  const practiceHref = useMemo(() => `/?practiceQuestions=${encodeURIComponent(relatedQuestions.map((question) => question.id).join(","))}`, [relatedQuestions]);

  function toggleComplete() {
    const study = loadStudyState();
    const theoryProgress = { ...study.theoryProgress };
    if (theoryProgress[key]) delete theoryProgress[key];
    else theoryProgress[key] = { completedAt: new Date().toISOString() };
    const result = saveStudyState({ ...study, theoryProgress });
    if (result.ok) setCompletedKeys(Object.keys(theoryProgress));
  }

  return <TheoryShell title={course.title}><main className={styles.main}>
    <div className={styles.crumbs}><Link href="/">문제은행</Link><span>›</span><Link href={`/learn/${course.certificateId}`}>{subject.title}</Link><span>›</span><Link href={`/learn/${course.certificateId}/${subject.id}/${unit.id}`}>{unit.title}</Link><span>›</span><span>{concept.title}</span></div>
    <div className={styles.lessonLayout}>
      <article className={styles.lesson}>
        <header className={styles.lessonHeader}><small>STEP {currentIndex + 1} · {unit.title}</small><h1>{concept.title}</h1><p>{concept.summary}</p><div className={styles.keywords}>{concept.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div></header>
        {concept.blocks.map((block, index) => <ContentBlock block={block} key={`${block.title}:${index}`} />)}
        <section className={`${styles.block} ${styles.memory}`}><h2>암기 포인트</h2><ul>{concept.memoryPoints.map((point) => <li key={point}>{point}</li>)}</ul></section>
        <section className={styles.questions}><div className={styles.questionsHeader}><div><h2>관련 기출문제</h2><span>{relatedQuestions.length ? `${relatedQuestions.length}문제가 이 개념과 연결되어 있습니다.` : "연결된 검증 문제를 준비 중입니다."}</span></div>{relatedQuestions.length > 0 && <Link className={styles.practiceAll} href={practiceHref}>한 번에 풀기</Link>}</div><div className={styles.questionList}>{relatedQuestions.map((question) => <Link className={styles.question} href={`/?practiceQuestions=${question.id}`} key={question.id}><div><small>{question.sourceYear ? `${question.sourceYear}년 · ` : ""}{question.source ?? "기출문제"}</small><strong>{question.prompt}</strong></div><i>→</i></Link>)}</div></section>
        <nav className={styles.pager}>{previous ? <Link href={`/learn/${course.certificateId}/${subject.id}/${unit.id}/${previous.id}`}>← 이전 개념<strong>{previous.title}</strong></Link> : <span />}{next && <Link href={`/learn/${course.certificateId}/${subject.id}/${unit.id}/${next.id}`}>다음 개념 →<strong>{next.title}</strong></Link>}</nav>
      </article>
      <aside className={styles.sidebar}>
        <section className={styles.sideCard}><strong>학습 진도 {progress}%</strong><div className={styles.progressRow}><span className={styles.progressTrack}><i style={{ width: `${progress}%` }} /></span><b>{completedCount}/{unitKeys.length}</b></div><button className={`${styles.completeButton} ${done ? styles.done : ""}`} onClick={toggleComplete}>{done ? "✓ 학습 완료됨" : "이 개념 학습 완료"}</button><p className={styles.source}>{course.sourceTitle}<br />원본 PDF {formatPages(concept.sourcePdfPages)}쪽</p></section>
        <section className={styles.sideCard}><strong>{unit.title}</strong><ol>{unit.concepts.map((item, index) => { const itemMatch = { ...match, concept: item }; return <li key={item.id}><Link className={item.id === concept.id ? styles.current : ""} href={theoryConceptHref(itemMatch)}>{index + 1}. {item.title}</Link></li>; })}</ol></section>
      </aside>
    </div>
  </main></TheoryShell>;
}

function ContentBlock({ block }: { block: TheoryBlock }) {
  if (block.type === "text") return <section className={styles.block}><h2>{block.title}</h2>{block.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>;
  if (block.type === "bullets") return <section className={styles.block}><h2>{block.title}</h2><ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
  if (block.type === "table") return <section className={styles.block}><h2>{block.title}</h2><div className={styles.tableWrap}><table className={styles.table}><thead><tr>{block.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={`${rowIndex}:${cellIndex}`}>{cell}</td>)}</tr>)}</tbody></table></div></section>;
  if (block.type === "code") return <section className={styles.block}><h2>{block.title}</h2><pre className={styles.code}><code>{block.code}</code></pre>{block.caption && <p className={styles.caption}>{block.caption}</p>}</section>;
  return <section className={styles.block}><h2>{block.title}</h2><div className={styles.diagram}>{block.nodes.map((node) => <div key={node.label}><strong>{node.label}</strong>{node.detail && <small>{node.detail}</small>}</div>)}</div>{block.caption && <p className={styles.caption}>{block.caption}</p>}</section>;
}

function formatPages(pages: number[]) {
  if (!pages.length) return "-";
  return pages.length === 1 ? String(pages[0]) : `${pages[0]}–${pages.at(-1)}`;
}
