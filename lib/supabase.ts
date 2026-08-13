import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AiExplanationReport, Question, QuestionReport, StudyState } from "./types";
import { migrateStudyState } from "./storage";

let browserClient: SupabaseClient | null | undefined;

export function getSupabaseClient() {
  if (browserClient !== undefined) return browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  browserClient = url && key
    ? createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
    : null;
  return browserClient;
}

export async function loadCloudStudyState(userId: string): Promise<StudyState | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("user_study_data")
    .select("study_state")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ? migrateStudyState(data.study_state) : null;
}

export async function saveCloudStudyState(userId: string, studyState: StudyState) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase
    .from("user_study_data")
    .upsert({
      user_id: userId,
      study_state: studyState,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });
  if (error) throw error;
}

export async function syncCentralReports(userId: string, studyState: StudyState, questions: Question[]) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const questionMap = new Map(questions.map((question) => [question.id, question]));
  const questionRows = studyState.questionReports.map((report) => ({
    id: report.id,
    user_id: userId,
    question_id: report.questionId,
    question_version: report.questionVersion,
    question_snapshot: questionMap.get(report.questionId) ?? null,
    reason: report.reason,
    details: report.details,
    status: report.status,
    created_at: report.createdAt,
    updated_at: new Date().toISOString()
  }));
  const aiRows = studyState.aiExplanationReports.map((report) => ({
    id: report.id,
    user_id: userId,
    question_id: report.questionId,
    question_version: report.questionVersion,
    question_snapshot: questionMap.get(report.questionId) ?? null,
    cache_key: report.cacheKey,
    explanation_snapshot: report.explanationSnapshot,
    reason: report.reason,
    details: report.details,
    status: report.status,
    created_at: report.createdAt,
    updated_at: new Date().toISOString()
  }));
  if (questionRows.length) {
    const { error } = await supabase.from("question_reports").upsert(questionRows, { onConflict: "id", ignoreDuplicates: true });
    if (error) throw error;
  }
  if (aiRows.length) {
    const { error } = await supabase.from("ai_explanation_reports").upsert(aiRows, { onConflict: "id", ignoreDuplicates: true });
    if (error) throw error;
  }
}

export async function checkIsAdmin(userId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  const { data, error } = await supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export interface AdminQuestionReport extends QuestionReport {
  userId: string;
  questionSnapshot?: Question;
}

export interface AdminAiReport extends AiExplanationReport {
  userId: string;
  questionSnapshot?: Question;
}

export async function loadAdminReports() {
  const supabase = getSupabaseClient();
  if (!supabase) return { questionReports: [], aiReports: [] };
  const [questionResult, aiResult] = await Promise.all([
    supabase.from("question_reports").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("ai_explanation_reports").select("*").order("created_at", { ascending: false }).limit(200)
  ]);
  if (questionResult.error) throw questionResult.error;
  if (aiResult.error) throw aiResult.error;
  return {
    questionReports: (questionResult.data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      questionId: row.question_id,
      questionVersion: row.question_version,
      questionSnapshot: row.question_snapshot as Question | undefined,
      reason: row.reason,
      details: row.details,
      status: row.status,
      createdAt: row.created_at
    })) as AdminQuestionReport[],
    aiReports: (aiResult.data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      questionId: row.question_id,
      questionVersion: row.question_version,
      questionSnapshot: row.question_snapshot as Question | undefined,
      cacheKey: row.cache_key,
      explanationSnapshot: row.explanation_snapshot,
      reason: row.reason,
      details: row.details,
      status: row.status,
      createdAt: row.created_at
    })) as AdminAiReport[]
  };
}

export async function updateCentralReportStatus(kind: "question" | "ai", id: string, status: string) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");
  const table = kind === "question" ? "question_reports" : "ai_explanation_reports";
  const { error } = await supabase.from(table).update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}

export async function loadQuestionOverrides(): Promise<Question[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("question_overrides").select("question_data");
  if (error) throw error;
  return (data ?? []).flatMap((row) => row.question_data && typeof row.question_data === "object" ? [row.question_data as Question] : []);
}

export async function saveQuestionOverride(userId: string, question: Question) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");
  const { error } = await supabase.from("question_overrides").upsert({
    question_id: question.id,
    question_data: question,
    updated_by: userId,
    updated_at: new Date().toISOString()
  }, { onConflict: "question_id" });
  if (error) throw error;
}

export interface AiProviderSettings {
  geminiEnabled: boolean;
  openaiEnabled: boolean;
}

export const defaultAiProviderSettings: AiProviderSettings = { geminiEnabled: true, openaiEnabled: false };

export async function loadAiProviderSettings(): Promise<AiProviderSettings> {
  const supabase = getSupabaseClient();
  if (!supabase) return defaultAiProviderSettings;
  const { data, error } = await supabase.from("app_settings").select("value").eq("key", "ai_providers").maybeSingle();
  if (error) throw error;
  const value = data?.value as Partial<AiProviderSettings> | undefined;
  return {
    geminiEnabled: value?.geminiEnabled !== false,
    openaiEnabled: value?.openaiEnabled === true
  };
}

export async function saveAiProviderSettings(userId: string, value: AiProviderSettings) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");
  const { error } = await supabase.from("app_settings").upsert({
    key: "ai_providers",
    value,
    updated_by: userId,
    updated_at: new Date().toISOString()
  }, { onConflict: "key" });
  if (error) throw error;
}

export async function loadAiExplanationOverride(cacheKey: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("ai_explanation_overrides").select("explanation").eq("cache_key", cacheKey).maybeSingle();
  if (error) throw error;
  return typeof data?.explanation === "string" ? data.explanation : null;
}

export async function saveAiExplanationOverride(userId: string, cacheKey: string, questionId: string, explanation: string) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");
  const { error } = await supabase.from("ai_explanation_overrides").upsert({ cache_key: cacheKey, question_id: questionId, explanation, updated_by: userId, updated_at: new Date().toISOString() }, { onConflict: "cache_key" });
  if (error) throw error;
}

export interface AiUsageLog {
  id: number;
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  createdAt: string;
}

export async function loadAiUsageLogs(): Promise<AiUsageLog[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("ai_usage_logs").select("*").order("created_at", { ascending: false }).limit(5000);
  if (error) throw error;
  return (data ?? []).map((row) => ({ id: row.id, provider: row.provider, model: row.model, promptTokens: row.prompt_tokens, completionTokens: row.completion_tokens, totalTokens: row.total_tokens, createdAt: row.created_at }));
}

export async function signInWithGoogle() {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin }
  });
  if (error) throw error;
}

export async function signOut() {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
