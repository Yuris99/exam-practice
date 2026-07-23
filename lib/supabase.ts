import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { StudyState } from "./types";
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
