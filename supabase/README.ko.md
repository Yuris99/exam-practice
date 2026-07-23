# Supabase 로그인 및 동기화 설정

1. Supabase 프로젝트를 생성합니다.
2. SQL Editor에서 `schema.sql` 전체를 실행합니다.
3. Authentication > Providers > Google에서 Google 로그인을 활성화하고 Google Cloud에서 발급한 Client ID와 Client Secret을 입력합니다.
4. Authentication > URL Configuration에서 운영 Vercel 주소를 Site URL과 Redirect URLs에 등록합니다.
5. Vercel 프로젝트의 Environment Variables에 다음 값을 등록합니다.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Supabase Connect 화면에 표시되는 Project URL과 Publishable key를 사용합니다. `service_role` 키는 브라우저나 Vercel의 `NEXT_PUBLIC_` 환경변수에 절대 넣지 않습니다.

로그인하지 않은 사용자의 데이터는 기존처럼 브라우저에 저장됩니다. Google 로그인 시 로컬 데이터와 클라우드 데이터를 병합한 뒤 `user_study_data` 테이블의 사용자 전용 행에 저장합니다. RLS 정책으로 다른 사용자의 행은 읽거나 변경할 수 없습니다.

## 통합 관리자 등록

업데이트된 `schema.sql`을 다시 실행한 뒤, 관리자로 사용할 Google 계정으로 사이트에 한 번 로그인합니다. 그 다음 SQL Editor에서 아래 쿼리의 이메일을 관리자 계정 이메일로 바꾸어 실행합니다.

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'admin@example.com'
on conflict (user_id) do nothing;
```

사이트에서 로그아웃 후 다시 로그인하면 상단에 `통합 관리자` 버튼이 표시됩니다. `admin_users`에 등록되지 않은 사용자는 중앙 신고 테이블을 전체 조회하거나 상태를 변경할 수 없습니다.
