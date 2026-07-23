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
