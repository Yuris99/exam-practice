import { notFound } from "next/navigation";
import { TheoryUnitOverview } from "@/components/TheoryUnitOverview";
import { findTheoryUnit } from "@/lib/theory";

type TheoryUnitPageProps = {
  params: Promise<{ certificateId: string; subjectSlug: string; unitSlug: string }>;
};

export default async function TheoryUnitPage({ params }: TheoryUnitPageProps) {
  const { certificateId, subjectSlug, unitSlug } = await params;
  const found = findTheoryUnit(certificateId, subjectSlug, unitSlug);
  if (!found || found.unit.status !== "published") notFound();
  return <TheoryUnitOverview {...found} />;
}
