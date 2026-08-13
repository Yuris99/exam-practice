create table if not exists public.user_study_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  study_state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_study_data enable row level security;

drop policy if exists "Users can read their own study data" on public.user_study_data;
create policy "Users can read their own study data"
on public.user_study_data
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own study data" on public.user_study_data;
create policy "Users can insert their own study data"
on public.user_study_data
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own study data" on public.user_study_data;
create policy "Users can update their own study data"
on public.user_study_data
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Users can check their own admin role" on public.admin_users;
create policy "Users can check their own admin role"
on public.admin_users for select to authenticated
using ((select auth.uid()) = user_id);

create table if not exists public.question_reports (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  question_version integer not null,
  question_snapshot jsonb,
  reason text not null,
  details text not null default '',
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_explanation_reports (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  question_version integer not null,
  question_snapshot jsonb,
  cache_key text not null,
  explanation_snapshot text not null,
  reason text not null,
  details text not null default '',
  status text not null default 'open' check (status in ('open', 'resolved', 'hidden')),
  created_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.question_reports enable row level security;
alter table public.ai_explanation_reports enable row level security;

drop policy if exists "Users manage their own question reports" on public.question_reports;
create policy "Users manage their own question reports"
on public.question_reports for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Admins manage all question reports" on public.question_reports;
create policy "Admins manage all question reports"
on public.question_reports for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "Users manage their own AI reports" on public.ai_explanation_reports;
create policy "Users manage their own AI reports"
on public.ai_explanation_reports for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Admins manage all AI reports" on public.ai_explanation_reports;
create policy "Admins manage all AI reports"
on public.ai_explanation_reports for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create index if not exists question_reports_status_created_idx on public.question_reports(status, created_at desc);
create index if not exists ai_reports_status_created_idx on public.ai_explanation_reports(status, created_at desc);

create table if not exists public.question_overrides (
  question_id text primary key,
  question_data jsonb not null,
  updated_by uuid not null references auth.users(id),
  updated_at timestamptz not null default now()
);

alter table public.question_overrides enable row level security;

drop policy if exists "Everyone can read question overrides" on public.question_overrides;
create policy "Everyone can read question overrides"
on public.question_overrides for select to anon, authenticated
using (true);

drop policy if exists "Admins manage question overrides" on public.question_overrides;
create policy "Admins manage question overrides"
on public.question_overrides for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

grant select on public.question_overrides to anon, authenticated;

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

insert into public.app_settings (key, value)
values ('ai_providers', '{"geminiEnabled": true, "openaiEnabled": false}'::jsonb)
on conflict (key) do nothing;

alter table public.app_settings enable row level security;

drop policy if exists "Everyone can read app settings" on public.app_settings;
create policy "Everyone can read app settings"
on public.app_settings for select to anon, authenticated
using (true);

drop policy if exists "Admins manage app settings" on public.app_settings;
create policy "Admins manage app settings"
on public.app_settings for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

grant select on public.app_settings to anon, authenticated;

create table if not exists public.ai_explanation_overrides (
  cache_key text primary key,
  question_id text not null,
  explanation text not null,
  updated_by uuid not null references auth.users(id),
  updated_at timestamptz not null default now()
);

alter table public.ai_explanation_overrides enable row level security;

drop policy if exists "Everyone can read AI explanation overrides" on public.ai_explanation_overrides;
create policy "Everyone can read AI explanation overrides"
on public.ai_explanation_overrides for select to anon, authenticated
using (true);

drop policy if exists "Admins manage AI explanation overrides" on public.ai_explanation_overrides;
create policy "Admins manage AI explanation overrides"
on public.ai_explanation_overrides for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

grant select on public.ai_explanation_overrides to anon, authenticated;

create table if not exists public.ai_usage_logs (
  id bigint generated always as identity primary key,
  provider text not null,
  model text not null,
  prompt_tokens bigint not null default 0,
  completion_tokens bigint not null default 0,
  total_tokens bigint not null default 0,
  created_at timestamptz not null default now()
);

alter table public.ai_usage_logs enable row level security;

drop policy if exists "Admins read AI usage logs" on public.ai_usage_logs;
create policy "Admins read AI usage logs"
on public.ai_usage_logs for select to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create index if not exists ai_usage_logs_created_idx on public.ai_usage_logs(created_at desc);
