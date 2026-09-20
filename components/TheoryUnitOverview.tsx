"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadStudyState } from "@/lib/storage";
import type { TheoryCourse, TheorySubject, TheoryUnit } from "@/lib/theoryTypes";
import { TheoryShell } from "./TheoryCourseOverview";
import styles from "./TheoryTrail.module.css";

export function TheoryUnitOverview({ course, subject, unit }: { course: TheoryCourse; subject: TheorySubject; unit: TheoryUnit }) {
  const [completed, setCompleted] = useState<string[]>([]);
  useEffect(() => setCompleted(Object.keys(loadStudyState().theoryProgress)), []);
  const keyFor = (conceptId: string) => `${course.certificateId}:${subject.id}:${unit.id}:${conceptId}`;
  const completedCount = unit.concepts.filter((concept) => completed.includes(keyFor(concept.id))).length;
  const progress = Math.round(completedCount / unit.concepts.length * 100);
  return <TheoryShell title={course.title}><main className={styles.main}>
    <div className={styles.crumbs}><Link href="/">문제은행</Link><span>›</span><Link href={`/learn/${course.certificateId}`}>{course.title}</Link><span>›</span><span>{unit.title}</span></div>
    <section className={styles.hero}><small>{subject.title} · {unit.chapter}</small><h1>{unit.title}</h1><p>{unit.summary}</p><div className={styles.progressRow}><span className={styles.progressTrack}><i style={{ width: `${progress}%` }} /></span><b>{completedCount}/{unit.concepts.length} 완료</b></div></section>
    <div className={styles.conceptGrid}>{unit.concepts.map((concept, index) => <Link className={`${styles.conceptCard} ${completed.includes(keyFor(concept.id)) ? styles.done : ""}`} key={concept.id} href={`/learn/${course.certificateId}/${subject.id}/${unit.id}/${concept.id}`}><small>STEP {index + 1}</small><strong>{concept.title}</strong><span>{concept.summary}</span><b>학습 시작 →</b></Link>)}</div>
  </main></TheoryShell>;
}
