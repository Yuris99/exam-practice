"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadStudyState } from "@/lib/storage";
import { theoryUnitHref } from "@/lib/theory";
import type { TheoryCourse } from "@/lib/theoryTypes";
import styles from "./TheoryTrail.module.css";

export function TheoryCourseOverview({ course }: { course: TheoryCourse }) {
  const [completed, setCompleted] = useState<string[]>([]);
  useEffect(() => setCompleted(Object.keys(loadStudyState().theoryProgress)), []);
  const published = course.subjects.flatMap((subject) => subject.units.filter((unit) => unit.status === "published").flatMap((unit) => unit.concepts.map((concept) => `${course.certificateId}:${subject.id}:${unit.id}:${concept.id}`)));
  const completedCount = published.filter((key) => completed.includes(key)).length;
  const progress = published.length ? Math.round(completedCount / published.length * 100) : 0;

  return <TheoryShell title={course.title}>
    <main className={styles.main}>
      <div className={styles.crumbs}><Link href="/">문제은행</Link><span>›</span><span>이론 학습</span></div>
      <section className={styles.hero}><small>CODE TRAIL · {course.sourceTitle}</small><h1>{course.title}</h1><p>과목 → 단원 → 개념 순서로 학습하고, 각 개념에서 관련 기출문제를 바로 풀 수 있습니다.</p><div className={styles.progressRow}><span className={styles.progressTrack}><i style={{ width: `${progress}%` }} /></span><b>{completedCount}/{published.length} 개념 완료</b></div></section>
      {course.subjects.map((subject) => <section className={styles.subject} key={subject.id}><div className={styles.subjectHeader}><h2>{subject.title}</h2><p>{subject.description}</p></div><div className={styles.unitGrid}>{subject.units.map((unit, index) => {
        const content = <><i>{String(index + 1).padStart(2, "0")}</i><div><small>{unit.chapter}</small><strong>{unit.title}</strong><span>{unit.summary}</span></div><em>{unit.status === "published" ? `${unit.concepts.length}개 개념` : "확장 예정"}</em></>;
        return unit.status === "published" ? <Link className={styles.unitCard} href={theoryUnitHref(course, subject, unit)} key={unit.id}>{content}</Link> : <article className={`${styles.unitCard} ${styles.planned}`} key={unit.id}>{content}</article>;
      })}</div></section>)}
    </main>
  </TheoryShell>;
}

export function TheoryShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className={styles.shell}><header className={styles.topbar}><Link className={styles.brand} href="/"><i>✓</i><span>{title}</span></Link><Link className={styles.back} href="/">문제은행으로</Link></header>{children}</div>;
}
