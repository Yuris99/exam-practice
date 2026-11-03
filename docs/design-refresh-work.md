# 디자인 개편 작업 기록 (Yuris99/design-refresh, 1차 배치)

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
