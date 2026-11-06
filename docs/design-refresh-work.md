# 디자인 개편 작업 기록 (Yuris99/design-refresh)

> 이 문서는 3차 배치(아래 첫 절), 2차 배치(기준 커밋 `93665be`)와 1차 배치 기록(그 아래 "1차 배치" 절, 기준 커밋 `840b509`)으로 이루어집니다. 1차의 다크 녹색 방향은 사용자 피드백("현재 색이 마음에 들지 않음")으로 철회했습니다. 1차 절의 색·토큰 설명은 이제 기록으로만 남습니다.

## 3차 배치: "OMR 답안지" (TASTE + UI UX Pro Max + frontend-design)

- 기준: `93665be`(2차 결과, dev에 이미 병합됨 `dba99b8`). 같은 브랜치에서 이어서 작업. 병합·rebase 없음
- 사용자 피드백: "디자인 아직 구린 것 같다" → 2차의 연한 teal·둥근 알약·같은 모양 카드 반복을 템플릿 느낌의 원인으로 보고 방향을 교체
- 상태: 기술 검증과 브라우저 확인을 마침. **사용자 디자인 승인: 미정**
- 문제·채점·저장 로직, 문제 데이터, TSX는 수정하지 않음. 이번 배치는 CSS 3개 파일만 변경

### 스킬 사용 기록

| 스킬 | 한 일 | 결과 |
| --- | --- | --- |
| frontend-design | 소재에서 시각 언어를 찾고 계획 → 기본값 점검 → 구현 → 스크린샷 비평 | 소재: 한국 자격시험의 **OMR 답안지·시험지**. 계획 점검에서 빼낸 기본값: 테라코타/크림, 알약 버튼, 브랜드색 채운 버튼, 좌측 색 띠(초안의 primaryCard 좌측 파란 띠는 "side stripe"라 제거) |
| taste-skill | `draw.mjs --app --kind workspace --theme light --options 3` → `achromatic-ledger` 선택(seed 1277877551). 시트: `docs/design-refresh/taste-direction-batch3.json` | 선택 이유: 매일 오래 푸는 개인 학습 도구라 크롬에 색이 없고, 주 데이터 하나에만 색을 쓰는 규칙이 시험지 성격과 맞음. Face: 블루그레이 바탕(#f1f3f6)과 주 데이터 색 #1d5fbf(=OMR 인쇄 파랑). Geist 웹폰트는 외부 서비스 금지 때문에 쓰지 않음 |
| ui-ux-pro-max | `exam quiz practice education --domain product`, `selected state radio choice --domain ux`, `primary button hierarchy --domain ux`, `serif reading long text korean --domain typography` | 학습/퀴즈 제품은 "정답 초록 + 오답 빨강 + 진행 파랑" → 색 역할과 일치. 추천 스타일(Claymorphism)은 TASTE 규칙(그림자·장식 금지)과 충돌해 기각. 현재 위치 표시, 44px, 4.5:1 기준은 유지 |

### 방향

- 바탕은 블루그레이 책상(#f1f3f6), 면은 흰 답안지, 글자와 **유일한 주 버튼은 컴퓨터용 사인펜 검정**(#15171a, `--cta`)
- **OMR 인쇄 파랑**(#1d5fbf)은 현재 위치·진행에만 씀: 메뉴 아이콘, 문항 번호 "1 / 826", 진도 막대, 통계 막대, 보기 동그라미 테두리
- 채점 색은 답에만: 초록 #1b7a3d(정답), 빨강 #c4242a(오답). 형광펜 노랑(#fff3b0)은 암기 블록 제목과 플래그에만
- **보기 = OMR 마킹 칸**: 세로 타원(24×34) 테두리는 파랑, 고르면 검정으로 칠해짐, 채점 후 초록/빨강. "정답 / 내 답 · 정답 / 내 답 · 오답" 글자 표시는 유지
- **문제 지문과 이론 제목은 명조체**(Noto Serif KR → 나눔명조 → AppleMyungjo → 바탕): 인쇄된 시험지처럼 보이게 함. 해설·본문은 산세리프 유지(긴 화면 읽기)
- 홈의 시작 카드는 **수험표**처럼 구성: 자격증명을 명조 24~30px로 크게, 오른쪽에 검정 시작 버튼(PC). 학습 방식 목록의 CBT/TEST/TRAIL 코드 배지는 숨김
- 모서리는 8/6px 한 쌍, 알약(999px) 없음. 데스크톱 메뉴 활성은 무채색 단(`--nav-active`), 모바일 탭은 검정 상단 막대
- 해설 판정 줄("정답입니다/정답을 확인하세요")은 보기 상태에 따라 초록/빨강 점과 글자색 (`:has()`)

### 검증

| 항목 | 결과 |
| --- | --- |
| `npm run lint` (tsc) | 통과 |
| `npm test` | 52/52 통과 |
| `next build` | 통과 (`next-env.d.ts` 원복) |
| 5개 폭 캡처 (1440/1366/768/390/360, `capture-batch2.mjs`) | 홈→CBT→선택→제출 정상, 포커스 링 3px #1d5fbf, 문제 풀이 중 "연습" 굵게, 해설 끝이 하단 바에 가리지 않음, 이론 관련 연습 "연습 완료" → 원래 /learn URL 복귀, 가로 넘침 없음, JS 오류 없음 |
| TASTE `inspect.mjs --app` | 이론 개념·과정: 0 FAIL. 홈: 1 FAIL(로고 버튼 DOM의 ✓ 글자 — 이전과 같음, 메인 수정 줄이라 보류). WARN: 웹폰트 미로드(의도: 외부 폰트 서비스 금지), 긴 학습 본문 below-fold |
| TASTE `lint.mjs --app` | 0 FAIL, 11 WARN(떠 있는 하단 바·메뉴의 그림자 등 허용 범위) |
| 초기 비평에서 고친 것 | 선택한 보기의 동그라미가 비어 보임(2차의 hover 규칙이 우선) → `:not(.selected)`와 덮어쓰기 규칙. 명조 지문 700이 무거움 → 600/20px/행간 1.8. 이론 다음 글 링크 inset 그림자(button-fx FAIL) → 2px 테두리 |

대비(WCAG, 토큰 쌍): 본문 16.16, 흐린 글자 5.32~6.36, 검정 버튼 흰 글자 17.96, 파랑 테두리/흰 6.10, accent-text 8.59, 정답 글자 7.31, 오답 글자 7.87, 형광펜 위 글자 7.18, 입력칸 테두리 `--control-edge` #7b828c 3.5 이상, 포커스 5.49.

스크린샷: `docs/design-refresh/screenshots/batch3/after-{1440,1366,768,390,360}-*.png` (60장). 비교 기준은 `screenshots/batch2/`(2차), `screenshots/after-*`(1차), `screenshots/before-*`(원본).

### dev 통합 주의 (중요)

- dev는 2차를 병합한 뒤 **화이트/다크 테마**(`app/themes.css`, `ThemeToggle`, `lib/theme.ts`)와 임베디드 실기 기능을 추가했습니다. 이 브랜치는 rebase 금지라 dev 위에 올리지 않았고, 대신 **충돌을 피하는 형태**로 바꿨습니다.
  - `design-refresh.css`, `TheoryTrail.module.css`는 기존 줄을 고치지 않고 **파일 끝에 덧붙이기만** 했습니다(알약 radius도 끝에서 덮어씀).
  - 주 버튼은 dev가 도입한 `--cta` / `--cta-ink` 토큰을 씁니다. 라이트 값은 globals `:root`에서 `--cta:var(--ink)`입니다.
- 3-way 시뮬레이션(base `93665be`, CRLF→LF 정규화):
  - `globals.css`, `design-refresh.css`, `page.tsx`, `layout.tsx`: dev와 메인 작업본 모두 충돌 0건
  - `TheoryTrail.module.css`: 1건. dev와 이 브랜치가 모두 파일 끝에 덧붙인 부분이라 **양쪽 다 유지**하면 됩니다(dev의 `.brand` 말줄임 3줄 + 이 브랜치의 3차 블록)
- **다크 모드**: dev `themes.css`의 다크 값은 아직 2차 teal 계열이라, 병합하면 다크에서는 teal 강조가 남습니다. OMR 방향에 맞춘 다크 제안 값(themes.css `:root[data-theme="dark"]`에서 교체, 미검증):
  `--bg:#121416; --surface:#1b1e22; --surface2:#22262b; --surface3:#2c3137; --line:#33383f; --line-soft:#2a2e34; --line-strong:#4f5660; --text:#eceef1; --text-2:#cfd3d9; --muted:#a3aab4; --accent:#7fa8ec; --accent-text:#a9c4f4; --accent-soft:#1f2c42; --accent-faint:#1a2333; --accent-line:#3d5a8a; --cta:#eceef1; --cta-ink:#121416; --cta-hover:#ffffff; --nav-active:#2c3137; --ok:#4fb873; --ok-soft:#1b2e22; --ok-line:#2f6b45; --ok-text:#9fdcb4; --warn-soft:#3a3215; --focus:#8bb8ff;`
- 메인 작업본의 `AptitudePractice.module.css` 하드코딩 색 패치(2차 절 참고)는 여전히 필요합니다. `--green/--deep`은 이제 파랑(#1d5fbf)을 가리킵니다.
- 로고 ✓ 글자 → SVG 교체, 문제 풀이 중 연습 탭 `aria-current`도 통합 후 할 일로 남아 있습니다.

### 남은 일

- 다크 테마를 OMR 값으로 맞추고 실제 다크 화면 검수(위 제안 값)
- 통계 "시험 유형별"의 CBT/答 코드 배지 정리, 0문제인 날의 막대 표시(JSX)
- 시험 진행·결과 복습, 이미지·수식 문제, 실기 자기평가 화면 개별 검수, 실제 기기 확인
- 명조 지문이 Windows의 바탕체로 대체될 때의 렌더링 확인(이 PC에는 Noto Serif KR 설치됨)

## 2차 배치: 새 팔레트와 PC·모바일 사용성 (TASTE + UI UX Pro Max)

- 기준: `840b509`(1차 결과, 보존). 같은 브랜치 `Yuris99/design-refresh`에서 이어서 작업
- 상태: 기술 검증과 브라우저 확인을 마침. **사용자 디자인 승인: 미정**
- 문제·채점·저장 로직, 문제 데이터, 메인/다른 작업트리는 수정하지 않음

### 스킬 사용 기록

**TASTE (주 시각 방향)**: `SKILL.md`, `references/app-screens.md`를 전부 읽음
- `draw.mjs --app --kind workspace --screens home,detail,list --options 3` 실행: `editorial-greeting`(light), `achromatic-ledger`(light) 2개가 나옴
- **선택: `editorial-greeting`, seed 1992942278.** 개인 학습 홈, 넓은 화면의 가운데 정렬 칼럼, 숫자는 regular weight, 톤 패널. 매일 혼자 읽는 학습 앱에 맞음. achromatic-ledger는 돈·리포트 화면용이라 제외
- 시트 토큰을 그대로 따른 것: 흰 표면, 잉크 `#1f201d`계 텍스트, deep teal 강조(`#1b6e66` → 대비를 높여 `#17675f`), pill 컨트롤(999px), 그림자·그라데이션 없음, 강조색은 다음 행동·선택·진행에만 씀
- **Its face**: "제품 세계의 표면"을 골랐습니다. 시험지(흰 종이)가 책상(세이지 그레이 `#eef2f0`) 위에 놓인 모습입니다. 크롬(상단바·레일)은 책상색, 읽는 면(문제 카드·이론 블록)은 흰 시험지로 둡니다
- 의도적 편차(근거)
  - 글꼴: 시트의 Instrument Sans에는 한글이 없고, 사용자가 새 외부 서비스·패키지를 금지했습니다. 그래서 웹폰트를 넣지 않고 설치된 한글 서체 스택(Pretendard → Apple SD Gothic Neo → Noto Sans KR → 맑은 고딕)을 유지했습니다. inspect의 `font-fallback` WARN은 이 결정 때문입니다
  - 본문 크기: app 기본 14px 대신 16px(문제 본문 18~20px, 이론 본문 17px)로 했습니다. 긴 한국어 문제·해설을 읽는 제품이라 Pro Max 기준(16px, 행간 1.5~1.75)을 우선했습니다
  - 흰 시트를 따로 인셋하지 않음: 문제 카드와 이론 블록 자체가 흰 시트 역할을 합니다(white cards on off-white ground 변형)
- `inspect.mjs --app` 결과 (1440/768/390)

| 화면 | before (1차 결과 840b509) | after (2차 최종) |
|---|---|---|
| 홈 `/` | 3 FAIL (✓ 글리프, 그라데이션, 버튼 그림자) · 1 WARN | **1 FAIL** (로고 버튼의 ✓ 텍스트, 아래 설명) · 1 WARN (font-fallback) |
| 이론 개념 | 4 FAIL (✓, 그라데이션, 버튼 그림자, 화면 가장자리 텍스트) · 3 WARN (font, 행 높이 어긋남, h1 38px) | **0 FAIL** · 2 WARN (font-fallback, below-fold: 긴 학습 본문이라 정상) |
| 이론 과정 개요 | (미측정) | 1차 실행 1 FAIL(390px 11px 여백) → 수정 후 **0 FAIL** · 2 WARN (font, below-fold) |

  - 홈의 남은 FAIL: 로고 버튼 텍스트 `✓`입니다. 화면에서는 CSS mask SVG로 바꿔 보이지 않게 했지만 DOM에는 글자가 남습니다. 이 줄(`brandControls`)은 메인이 미커밋으로 수정 중이라, 충돌을 피하려고 JSX를 바꾸지 않았습니다. **통합 뒤 `✓`를 SVG로 바꾸면 해결됩니다.** 버튼에는 이미 `aria-label="홈"`이 있습니다
  - `lint.mjs --app`: 0 FAIL, 10 WARN. `backdrop-filter:none`(끄는 선언)이 glass로 잘못 잡힌 것, 그리고 떠 있는 하단 액션바·메뉴의 그림자(허용 범위)입니다

**UI UX Pro Max (UX 기준 검증)**: `scripts/search.py` 실행
- `--design-system "education exam practice study app reading"`: 보라 팔레트와 아동용 서체(Baloo 2/Comic Neue)를 추천했습니다. 성인 자격증 수험자에게 맞지 않고 TASTE의 violet 금지와도 충돌해 **채택하지 않음**(시각 방향은 TASTE가 결정)
- `--domain color "education learning"`: 1위가 LMS teal `#0D9488`로, TASTE의 deep teal 방향과 일치합니다(교차 확인)
- `--domain typography "korean readable sans"`: Noto Sans KR. 이미 스택에 포함되어 있고 웹폰트 로드는 하지 않음
- `--domain ux` 검색과 적용
  - 줄 길이 65~75자, 행간 1.5~1.75: 이론 본문 max 68ch·1.85, 문제 본문 1.65, 해설 1.8
  - Focus Not Obscured: `scroll-padding-top:72px`, 모바일 `scroll-padding-bottom:168px`(하단 메뉴 + 액션바)
  - Focus Appearance: 2px 이상, 3:1 이상 → 3px `#0b5fd1` 포커스 링(흰 배경 5.88:1, 선택 배경 4.92:1)
  - 터치 크기 44px, 간격 8px: 칩·세그먼트·보조 버튼 44px, 도구·필터 40~42px, 간격 8px
  - Fixed Positioning / safe area: 모바일 액션바를 `78px + safe-area` 위에 고정. 페이지 끝에서 해설이 가려지지 않는지 자동 측정함(아래)
  - Color Only: 선택지에 "정답", "내 답 · 정답", "내 답 · 오답" 텍스트 라벨. 칩 활성 상태는 색과 굵기를 함께 바꿈
  - Contrast 4.5:1: 아래 측정표
- `--stack nextjs "css global layout font"`: next/font 권장. 외부 폰트 금지 조건 때문에 적용하지 않음

### 디자인 방향 요약

- **"시험지 책상"**: 세이지 그레이 책상 위에 흰 시험지를 놓은 느낌입니다. 잉크색 본문에 deep teal 하나(다음 행동, 선택, 진행, 현재 위치)를 쓰고, 앰버는 암기·플래그, 빨강은 오답에만 씁니다. 그라데이션·글로우·장식 그림자는 없습니다. 그림자는 떠 있는 액션바와 메뉴에만 씁니다.
- 다크 모드는 이번 배치에서 제공하지 않습니다. 모든 색이 토큰이라 `prefers-color-scheme` 다크 세트를 추가할 수 있으며, 남은 일로 둡니다.

### 화면별 변경

- **공통**: `:root` 토큰 전면 교체(라이트), body 16px, 보조 텍스트 3단계(`--text-2` 11.5:1, `--muted` 5.3~6.5:1). 폼 필드 테두리 `--control-edge`(3.5:1, WCAG 1.4.11). 버튼은 pill로 통일, 기본 버튼은 teal 채움 한 종류. 남은 하드코딩 다크 색(rgba 상단바·탭 등)을 토큰으로 바꿈
- **탐색**: 데스크톱 레일은 책상색 배경, 활성 항목은 흰 pill + 테두리 + teal 아이콘(강조색을 크롬 배경에 칠하지 않음). 모바일 하단바는 활성 탭에 3px teal 막대 + 굵게. **문제 풀이 중(view=question)에는 "연습" 탭이 현재 위치로 표시됨**(`.appShell[data-view]` + CSS, 아래 메뉴 이슈 참고). 로고는 검정 사각형 + SVG 체크(CSS mask)
- **홈**: 제목 28px, 계속하기 카드는 그라데이션을 없애고 teal-faint 평면 + pill CTA. 학습 방식 목록의 배지는 무채색. 통계 띠는 regular weight 수치. 데스크톱 칼럼은 가운데 정렬(최대 1120px)로 오른쪽 빈 띠를 없앰
- **문제/피드백**: 흰 문제 카드(28~32px 패딩), 본문 20px(모바일 18px)/1.65. 선택지는 흰 바탕 + 3.5:1 테두리이고 번호를 첫 줄에 맞춤(긴 보기 대응). 선택 상태는 2px teal과 연한 배경, 정답·오답에는 텍스트 라벨. 보기·코드 블록은 밝은 톤 패널(코드 15.8:1). 해설은 중립 톤 패널 16px/1.8. **다음 행동 바**는 데스크톱에서 sticky(카드 하단에 붙어 따라옴), 모바일에서는 하단 메뉴 위에 고정. 북마크 버튼은 SVG 하트 + `aria-pressed`/`aria-label`(이전에는 접근성 이름 없음)
- **이론**: 그라데이션 제거, 흰 블록과 본문 17px/1.85/68ch. 브레드크럼은 밑줄 링크, 마지막 항목은 진하게. 사이드 목록의 현재 항목은 teal-soft pill. ✓는 SVG 아이콘(완료 항목에는 `aria-label="학습함"`), "과정 완료 🎉"의 이모지 제거. 상태 흐름 다이어그램은 데스크톱에서 한 줄에 맞추고, 820px 이하에서는 세로 배치(↓). 모바일 여백 16px. 1280px 이상은 사이드바 280px. 암기 포인트는 흰 바탕 + 앰버 테두리·제목
- **시험·통계·북마크·문제관리·/summary**: 공통 토큰과 컨트롤 규칙을 맞춤(pill 버튼, 내비게이터 상태, 플래그 앰버, 차트 teal, 상태 배지, 콜아웃 테두리). 화면 구조는 바꾸지 않음

### 이전 미확인 항목 확인 결과

- **잘못 강조되는 메뉴**: 원인을 확인했습니다. 상태 버그가 아니라 0.15s 배경 전환을 클릭 직후 스크린샷이 중간에 찍은 것입니다(측정값 `rgba(255,255,255,.886)`, active 클래스 없음). 실제 문제는 문제 풀이 화면에서 **어떤 메뉴도 현재 위치로 표시되지 않던 것**이라 위처럼 "연습"을 표시하도록 고쳤습니다. 캡처 스크립트는 각 촬영 전에 400ms 대기합니다. 스크린리더용 `aria-current`는 메인이 수정 중인 nav 렌더 줄이라 바꾸지 않았고, 통합 뒤 `view === "question"`이면 연습 탭에 `aria-current="page"`를 주도록 권장합니다
- **대비 측정**(WCAG 상대 휘도 계산, 토큰 기준)

| 쌍 | 대비 |
|---|---|
| 본문 `--text` / 흰 표면 | 16.37 |
| `--text-2` / 흰 표면 | 11.53 |
| `--muted` / 흰 표면 · 책상 · 톤 패널 · 칩 | 6.54 · 5.79 · 6.06 · 5.32 |
| 흰 글자 / teal 버튼 | 6.68 |
| `--accent-text` / teal-soft · teal-faint | 7.88 · 8.63 |
| 앰버 글자 / 앰버 배경 | 7.09 |
| 오답 글자 / 오답 배경 · 흰 글자 / 오답 배지 | 7.91 · 6.57 |
| 포커스 링 / 흰 표면 · 선택 배경 | 5.88 · 4.92 |
| 폼 필드 테두리 `--control-edge` / 흰 표면 | 3.50 |
| 일반 카드·선택지 테두리 `--line-strong` / 흰 표면 | 1.79 (텍스트 라벨이 있는 버튼 경계라 장식선으로 판단) |
| 코드 글자 / 코드 배경 | 15.76 |

### 검수 (브라우저 확인)

`docs/design-refresh/capture-batch2.mjs`(Playwright Chromium, 자체 dev 서버 `localhost:3127`). 5개 폭: 1440×900, 1366×768, 768×1024, 390×844, 360×740
- 5개 폭 모두: 홈 → 필기 CBT 시작 → 선택 → 제출 → 판정 표시, Tab 포커스 링 3px 확인. 문제 화면에서 "연습" 탭이 굵게(700) 표시됨. **페이지 끝에서 해설이 고정 액션바에 가려지지 않음**(측정 false). 시험·통계·북마크·문제관리 화면 렌더, 가로 넘침 없음, JS 오류 없음
- 이론 개념 → 관련 기출 → "연습 완료" → 원래 이론 URL 복귀: 5개 폭 모두 정상
- 스크린샷: `docs/design-refresh/screenshots/batch2/after-{1440,1366,768,390,360}-{home,question,question-selected,question-feedback,question-end,test,history,bookmarks,manage,theory,theory-full,theory-course}.png`(60장)
- before 비교: 1차 결과는 `docs/design-refresh/screenshots/after-*.png`(1366/390), 원본은 `before-*.png`

**기술 검증**: `npm.cmd run lint` 통과, `npm.cmd test` 52/52 통과, `npx next build` 통과(prebuild 질문 생성은 건너뜀, `lib/generatedQuestions.ts` 변경 없음)

**미확인**
- 실제 iOS/Android 기기와 Safari, 가로 모드 실물(CSS 규칙만 있음)
- 로그인 상태의 계정 메뉴, 관리자 화면, 시험 진행 중 화면(내비게이터·타이머)과 결과 복습 화면, 실기 필답형 자기평가, 이미지·KaTeX 수식이 있는 문제의 실제 렌더
- 다크 모드(미제공)
- 사용자 디자인 승인: **미정**

### 메인 미커밋 변경과의 통합 주의점 (2차 추가)

- `git merge-file` 3-way 시뮬레이션(LF 정규화 후): `app/globals.css`, `app/page.tsx`, `app/layout.tsx`, `components/TheoryConceptLesson.tsx`, `components/TheoryCourseOverview.tsx`, `components/TheoryTrail.module.css` 모두 **충돌 0건**
- 2차에서 `page.tsx`에 추가로 바꾼 줄: `<div className="appShell" data-view={view}>`, QuestionView 북마크 버튼(SVG + aria), BookmarksView 해제 버튼(SVG). 메인의 변경 줄과 겹치지 않음
- **반드시 고칠 것: `components/AptitudePractice.module.css`(메인 신규)의 다크 하드코딩 색 3곳이 라이트 테마에서 읽히지 않습니다.**
  - 5행 `background:#243b2e`: 선택된 시험/영역/유형 버튼이 어두운 녹색 배경 위 어두운 글자가 됨
  - 29행 `color:#d0e2d7`: 밝은 배경 위 밝은 글자
  - 31행 `color:#d2e3c5; background:#243b2e`: 완료 안내가 어두운 녹색 블록
  - 권장 패치(통합 시 메인에서 적용, 이 브랜치는 메인 파일을 수정하지 않음)

    ```css
    /* 5행 */  background:var(--accent-soft); box-shadow:inset 0 0 0 1px var(--accent);
    /* 29행 */ color:var(--muted);
    /* 31행 */ color:var(--accent-text); background:var(--accent-faint);
    ```

  - `var(--green)`/`var(--deep)`/`var(--surface*)`/`var(--line)`/`var(--muted)`/`var(--text)`는 모두 유지되며 새 라이트 값을 가리킵니다
- 메인 `globals.css`의 `.aptitudePracticeBack button`은 var만 써서 그대로 동작합니다(teal 글자 / 흰 바탕)
- 통합 뒤 할 일: 로고 `✓` → SVG, nav `aria-current`에 question → 연습 반영, AptitudePractice 화면 렌더 확인

### 남은 일

1. 다크 모드 토큰 세트(야간 학습용, `prefers-color-scheme`)
2. 통합 뒤 AptitudePractice 색 패치와 렌더 확인, 로고·aria-current 정리
3. 시험 진행·결과 복습, 이미지/수식 문제, 실기 자기평가 화면의 개별 검수
4. 통계 차트의 0일 막대가 최소 5% teal 조각으로 보이는 문제(HistoryView 인라인 스타일, JSX 수정 필요)
5. 실제 기기 확인, 사용자 디자인 승인

---

# 1차 배치 기록 (기준 커밋 840b509)

- 담당: Claude (Orca worker, branch-guard status로 역할과 배정 브랜치 일치를 확인함)
- 시작 HEAD: `1b7b7c05f85d4cafe28e21a4cc99e01911a08db2`
- 주 디자인 스킬: **impeccable** (refinement 모드, craft-floor 기준 적용, `impeccable detect` 실행)
- 상태: 기술 검증과 브라우저 확인을 마침. **사용자 디자인 승인은 받지 않음.**

## 디자인 방향과 근거

**"밤 공부 책상"**: 어두운 잉크빛 녹색 표면, 진행·행동에는 세이지 녹색 강조색 하나, 암기·플래그에는 앰버, 오답에만 빨강을 씁니다.

- 사용 장면: 퇴근·하교 뒤 휴대폰으로 긴 한국어 문제·해설·이론을 읽습니다. 다크 테마, PWA themeColor, 녹색 정체성은 그대로 두고 **다듬기(refinement)** 를 택했습니다. 테마를 통째로 바꾸면 메인의 미커밋 기능(AptitudePractice CSS가 `--green`/`--deep` 사용)과 충돌하고, 사용자가 레퍼런스를 주지 않았기 때문입니다.
- 가장 큰 문제는 가독성이었습니다. 메타·버튼·통계 라벨이 8~11px였습니다. 최소 12px, 본문 15~16px, 문제 본문 18~20px/행간 1.6, 이론 본문 16px/행간 1.85/최대 68ch로 올렸습니다.
- 색은 하드코딩 hex 약 150곳을 의미 기반 토큰(`--surface/2/3`, `--sunken`, `--accent-*`, `--warn-*`, `--danger-*`, `--text-2`, `--focus`)으로 치환했습니다. 기존 `--green`, `--deep`은 별칭으로 남겨 호환됩니다.
- 정보 위계: 페이지 제목을 맨 위에 두고 태그라인은 보조 문구로 내렸습니다(문구는 바꾸지 않고 CSS order만 바꿈). 홈의 "학습 방식"은 같은 크기 아이콘 카드 격자에서 훑어보기 쉬운 행동 목록으로 바꿨습니다.
- 정답·오답 표시: 색에만 의존하지 않도록 선택지에 "정답"/"내 답" 라벨을 붙였습니다(CSS `::after`, 콘텐츠·로직 변경 없음).
- 탐색: 유니코드 글리프(⌂✎▣▥♡) 대신 같은 선 굵기의 SVG 아이콘을 넣었습니다. 모바일은 활성 탭 위에 막대 표시, 데스크톱 레일은 활성 항목을 테두리와 배경으로 구분합니다.
- 장식: 두꺼운 좌측 줄무늬 콜아웃은 1px 색조 테두리로 바꿨습니다. 모션은 150ms 색 전환과 CTA 누름 정도만 넣었고 `prefers-reduced-motion`에서는 끕니다. 패키지·웹폰트·외부 서비스는 추가하지 않았습니다(Pretendard가 없으면 Apple SD Gothic Neo / Noto Sans KR / 맑은 고딕으로 대체).

## 변경 파일과 화면

| 파일 | 내용 |
|---|---|
| `app/globals.css` | `:root` 토큰 확장, body 기본(폰트 스택, 15px, keep-all, tabular-nums), selection/scrollbar/focus 대상 확장, 하드코딩 색 → 토큰, font-size 일괄 상향(8~10→12, 11~12→13, 13→14). **34~41행(.navigation/.hero, 메인이 편집 중인 부분)은 건드리지 않음** |
| `app/design-refresh.css` (신규) | 개편 레이어: 상단바, 탐색, 홈 hero/계속하기 카드/학습 방식 목록/통계, 문제 풀이(메타·본문·보기·코드·선택지 상태·피드백·도구·하단 액션바), 콜아웃 |
| `app/layout.tsx` | `design-refresh.css` import 추가, themeColor `#0f1411` |
| `app/page.tsx` | `navItems` 배열만 수정(SVG 아이콘, `icon` 타입 `string`→`React.ReactNode`). 렌더 JSX는 그대로 |
| `components/TheoryTrail.module.css` | 이론 개요·단원·개념 화면: 토큰화, 본문 폭·크기, 암기 포인트, 관련 기출 목록, 모바일 진도 카드 압축(제목이 첫 화면에 보이게), 관련 이론 링크 모바일 세로 배치 |
| `docs/design-refresh/` | 전/후 스크린샷 24장, 캡처·상호작용 확인 스크립트 |

적용 화면: 홈(자격증 선택 포함 상단바), 연습 설정(칩/세그먼트), 문제 풀이(필기 CBT 선택·채점·피드백), 이론(과정 개요·단원·개념). 공통 토큰과 글자 크기 상향은 통계·북마크·시험·문제 관리·관리자·/summary에도 적용되지만, **이 화면들은 개별 디자인 검토와 스크린샷 확인을 하지 않았습니다.**

## 검증

**기술 검증**
- `npm.cmd run lint` (tsc --noEmit): 통과
- `npm.cmd test`: 52/52 통과
- `npx next build`: 통과. `prebuild`의 질문 생성을 건너뛰려고 next build를 직접 실행했고 `lib/generatedQuestions.ts`는 변경되지 않음. postbuild 자산 복사는 실행하지 않음
- `impeccable detect`: 남은 side-tab 경고는 globals.css 원래 규칙뿐이며 모두 design-refresh.css에서 덮어씀

**브라우저 확인** (Playwright Chromium, 자체 dev 서버 `localhost:3127`, 데스크톱 1366×900 / 모바일 390×844 @2x, 전·후 동일 스크립트)
- 홈 → "필기 CBT" → 선택지 선택 → 답안 제출 → 피드백 표시, 버튼이 "다음 문제"로 바뀜: 데스크톱·모바일 정상
- 이론 개념(`process-lifecycle-scheduling`) → 관련 기출 1문제 풀이 → "연습 완료" → 원래 이론 URL로 복귀: 데스크톱·모바일 정상
- 키보드: Tab 포커스 링 표시 확인(자격증 select, outline `#a9dfbd` 2px)
- 과정 개요 페이지 가로 넘침 없음, 페이지 JS 오류 없음
- 스크린샷: `docs/design-refresh/screenshots/{before,after}-{desktop,mobile}-{home,question,question-feedback,theory,theory-full,theory-course}.png`

**미확인**
- 실제 휴대폰 기기, Safari/iOS, 가로 모드
- 시험 모드, 통계, 북마크, 문제 관리, 관리자, /summary의 시각 검토
- 실기 필답형 자기평가 흐름의 시각 검토, 로그인 상태 계정 메뉴
- 명도 대비는 토큰 값으로 설계만 함(muted `#9eaaa2` on `#161d19` 약 7:1 추정). 도구로 측정하지 않음
- 데스크톱 문제 화면에서 사이드 레일의 "홈"이 강조돼 보임. 기존과 같은 동작인지 원인을 확인하지 못함
- after 스크린샷 이후 결과 복습 카드의 상단 줄무늬를 색조 테두리로 바꿨음(이 변경은 렌더링으로 확인하지 않음)
- 사용자 디자인 승인: 받지 않음

## 메인 미커밋 변경과의 통합 주의점

메인 체크아웃(`C:/Users/mose1/Documents/project/exam-practice`, dev)에는 읽기만 했습니다. 이 브랜치 HEAD 기준 파일과 메인 작업본을 `git merge-file`로 3-way 병합 시뮬레이션한 결과입니다.

- **줄바꿈 주의**: 메인 작업본 일부가 CRLF라서 그대로 병합하면 파일 전체가 충돌로 보입니다. LF로 정규화하면 `app/globals.css`, `app/page.tsx`, `app/layout.tsx` 모두 **충돌 0건**이었습니다.
- `app/globals.css`: 메인은 39행 뒤에 `.navigation { grid-auto-flow:column … }`와 `.aptitudePracticeBack*` 4줄을 추가했습니다. 이 브랜치는 그 주변(34~41행)을 바꾸지 않았고 개편 규칙은 별도 파일에 두었습니다. 메인 규칙은 모바일 탭 수를 가변으로 만들며, 개편 레이어와 함께 동작합니다(데스크톱은 flex라 영향 없음).
- `app/page.tsx`: 메인은 aptitude import·state·`selectCertificate` 문구·nav filter·라벨·main 렌더·HomeView(`onOpenAptitude`, APT 버튼)를 바꿨습니다. 이 브랜치는 `navItems` 배열만 바꿨습니다. 메인의 nav 렌더(`<span>{item.icon}</span>`)는 ReactNode 아이콘과 그대로 호환됩니다. **보존할 기능**: 시험 선택 시 aptitude 분기, "유형별 연습" 라벨, aptitude에서 시험 탭 숨김, `← 유형 선택으로` 바, QuestionManager `defaultCertificateId`.
- `components/AptitudePractice.module.css`(메인 신규): `--green`, `--deep`, `--surface`, `--surface2`, `--line`, `--muted`, `--text`를 씁니다. 모두 유지되며 `--green`/`--deep`은 새 강조 토큰을 가리키므로 색이 조금 밝고 차분해집니다. 하드코딩 `#243b2e` 등 3곳은 이 브랜치에서 토큰화하지 않았습니다(메인 파일이라 손대지 않음). 통합 뒤 `--accent-soft` 등으로 바꾸는 것을 권장합니다.
- 메인 APT 버튼(`.modeGrid` 첫 항목)은 새 목록 스타일에 그대로 들어갑니다. 통합 뒤 실제 렌더링 확인이 필요합니다.
- `components/QuestionMetadata.tsx`(메인 변경): 이 브랜치는 TSX를 건드리지 않았고 구분점(·)을 CSS로만 바꿨습니다(`span:not(:last-of-type)::after`). 메인의 태그 변환 로직과 독립적입니다.
- `components/QuestionManager.tsx`, `lib/*`, `content/*`, scripts, tests: 이 브랜치에서 변경하지 않았습니다.

## 남은 일 (다음 배치 후보)

1. 시험 모드(내비게이터·타이머·결과 복습), 통계, 북마크, 문제 관리, /summary의 개별 디자인과 스크린샷
2. 메인 통합 뒤 AptitudePractice 화면 렌더 확인과 하드코딩 색 토큰화
3. 홈 "학습 방식" 아이콘 배지(CBT/答/TEST 텍스트)를 SVG 아이콘으로 교체(HomeView JSX 변경이 필요해 메인의 HomeView 변경이 통합된 뒤 진행 권장)
4. 명도 대비 측정, 실제 iOS/Android 기기 확인
5. 제품 맥락 문서(PRODUCT.md/DESIGN.md)를 사용자와 정리(impeccable init)

## 푸시/병합

- 푸시: 하지 않음. 병합·rebase·다른 ref 갱신: 하지 않음.
- dev 서버: 이 작업트리에서 `next dev -p 3127`로 직접 실행(다른 작업자 서버는 건드리지 않음).
