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
