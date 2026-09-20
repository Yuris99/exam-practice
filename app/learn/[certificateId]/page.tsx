import { notFound } from "next/navigation";
import { TheoryCourseOverview } from "@/components/TheoryCourseOverview";
import { getTheoryCourse } from "@/lib/theory";

type TheoryCoursePageProps = {
  params: Promise<{ certificateId: string }>;
};

export default async function TheoryCoursePage({ params }: TheoryCoursePageProps) {
  const { certificateId } = await params;
  const course = getTheoryCourse(certificateId);
  if (!course) notFound();
  return <TheoryCourseOverview course={course} />;
}
