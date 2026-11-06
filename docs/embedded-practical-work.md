# 임베디드 실기 연습문제 작업 기록

> 아래 첫 배치는 이전 작업 기록이다. 현재 결과는 문서 끝의 **후속 확장**을 기준으로 한다.

작업일: 2026-11-03. 담당: Codex 단독. 다른 에이전트 실행 없음.

## 권한과 변경 범위

- branch-guard status: active=true, role=worker, 배정·현재 브랜치 모두 `refs/heads/Yuris99/embedded-practical`.
- 시작 및 종료 HEAD: `1b7b7c05f85d4cafe28e21a4cc99e01911a08db2`. 커밋하지 않은 검토용 변경이다.
- 변경 파일: `content/questions/embedded-engineer-practical.csv`, `lib/generatedQuestions.ts`, `tests/questionIntegrity.test.mjs`, 본 문서.
- UI·디자인·저장 스키마·생성기·기존 CSV·다른 자격증 데이터·lockfile 수정 없음. 메인과 다른 작업트리 수정 없음.
- 커밋·병합·rebase·ref 갱신·push·배포 없음.

## 조사와 결과

먼저 CSV 규약, `lib/types.ts`, 생성 데이터, `scripts/generate-questions.mjs`, `tests/questionIntegrity.test.mjs`를 확인했다. `_`로 시작하지 않는 CSV는 자동 발견되므로 생성기는 수정하지 않았다. 모든 행에 `certificate_id=embedded-engineer`, `exam_type=PRACTICAL_WRITTEN_RESPONSE`를 명시했다. UTF-8 CSV의 실제 셀 줄바꿈으로 C 코드를 저장했다.

기존 임베디드 필기는 608문항(하드웨어 145, 펌웨어 151, 플랫폼 156, 소프트웨어 155, 출제기준 1), 실기는 0문항이었다. 추가 후 임베디드는 필기 608 + 실기 20 = 628문항이다. 전체 문제는 6,351 → 6,371, 전체 자격증 실기는 150 → 170문항이다.

| 주제 | 수 | 문항 번호와 내용 |
|---|---:|---|
| C 코드 분석 | 2 | 01 정수 변환, 02 빅엔디언 조립 빈칸 |
| 비트 연산·레지스터 | 3 | 03 설정·클리어·토글, 04 필드 변경 빈칸, 05 W1C |
| 인터럽트·타이머 | 3 | 06 주기 계산, 07 래핑 경과시간 빈칸, 08 원자적 스냅샷 |
| 주변장치 통신·ADC | 4 | 09 UART, 10 SPI, 11 I²C, 12 ADC 정수 환산 |
| 메모리 | 3 | 13 복사·널 종료, 14 지역 배열 수명, 15 DMA 송신 캐시 |
| RTOS·동시성 | 3 | 16 갱신 유실, 17 우선순위 역전, 18 교착 |
| 디버깅 | 2 | 19 배열 경계 관찰, 20 워치독 진행 감시 |

각 문항에 모범답안·필수 핵심어·해설·난이도·조건을 제공했다. 모든 prompt와 태그에 `창작 실기 연습`, source에 `자체 제작 · 창작 실기 연습 (기출 아님)`을 표시했다. source_year는 비웠으며 기출 출처·연도·외부 라이선스를 부여하지 않았다. 아래 공식 문서는 기술 사실 대조용이며 문항의 출처나 재사용 허가를 뜻하지 않는다.

기존 앱의 경로는 자격증 선택 → 실기 필답형/연습 → 문제 표시 → 직접 답안 입력 → 모범답안·해설 비교 → 자기평가이다. 핵심어는 콘텐츠로 보관되며 현재 풀이 화면의 자동 문자열 채점이나 별도 핵심어 표시를 추가하지 않았다. 실기 모의시험 템플릿도 이미 최대 20문항을 지원한다.

## 정답 검토와 공식 참고 자료

- 01·02·03·04·07·12·13의 C 식은 GCC C11로 컴파일하고 assert로 결과를 확인했다. 06·09·11 수치도 같은 실행에서 확인했다. W1C와 타이머 분주 방식은 가상 하드웨어 규칙으로 명시했다.
- 08은 단일 코어·8비트 읽기·마스크 가능한 ISR·플랫폼 함수의 순서 보장을 명시했다. 16은 표준 C 스레드의 데이터 경쟁과 구분한 가상 RTOS 실행 모델이다.
- 12는 분모 4095의 끝점 환산 규칙을 문제에서 정의했다. 15는 DMA 송신·write-back·독점 캐시 라인·DMA 접근 가능 RAM·배리어 완료를 전제로 한다. 실제 MCU 실측을 수행한 것은 아니다.
- [WG14 N1570 C11 초안](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf): 6.2.4 객체 수명, 6.3.1.3 정수 변환, 6.5.6 배열 경계, 6.5.7 시프트, 7.24.2.1 memcpy.
- [NXP UM10204](https://www.nxp.com/docs/en/user-guide/UM10204.pdf): 3.1.6 ACK, 3.1.10 7비트 주소와 R/W.
- [Microchip TB3215](https://www.microchip.com/content/dam/mchp/documents/MCU08/ApplicationNotes/ApplicationNotes/TB3215-Getting-Started-with-SPI-DS90003215.pdf): 5장 mode 0의 상승 샘플링·하강 준비.
- [ST AN4839](https://www.st.com/resource/en/application_note/DM00272913-.pdf): 3.2와 4장 DMA 시작 전 dirty 캐시 clean.
- [FreeRTOS Kernel Book 8장](https://github.com/FreeRTOS/FreeRTOS-Kernel-Book/blob/main/ch08.md): 8.3.2~8.3.4 우선순위 역전·상속·교착.

## 검증

- `npm.cmd ci --cache .next/npm-cache --no-audit --no-fund --loglevel=error`: lockfile 기반 로컬 설치 성공, 206 packages. 초기 기본 캐시 쓰기 실패와 레지스트리 EACCES는 로그로 진단했고, 허용된 네트워크 권한 실행으로 해결했다. 전역 설정·패키지 업데이트 없음.
- `npm.cmd run questions:generate`: CSV 6개에서 6,371문항 생성 성공. 재실행 SHA-256 동일: `a4e555e248d0bd94437cc9acac337bd8035699f004b329f7c520dba66ce8423f`.
- 시작 HEAD의 생성 데이터와 현재 데이터를 ID별 deepEqual 비교: 기존 6,351개 전체 필드 보존, 신규 20개만 추가.
- `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test tests/questionIntegrity.test.mjs`: 고유 ID·문항 완전성·핵심어·출처·연도 공란·주제 분포·문자 손상·기존 실기 필터와 모의시험 선택 검증.
- `npm.cmd test`: 최종 54개 전체 통과.
- `npm.cmd run lint`: 최종 `tsc --noEmit` 통과.
- `gcc -std=c11 -Wall -Wextra -Werror .next/embedded-content-check.c -o .next/embedded-content-check.exe` 후 실행: 종료 코드 0. 검증 입력과 실행 파일은 무시되는 `.next` 내부 임시 산출물이다.
- `npm.cmd run dev -- --hostname 127.0.0.1 --port 3217`: 로컬 Next.js 서버 Ready, `Invoke-WebRequest http://127.0.0.1:3217/` HTTP 200. 확인 후 해당 서버를 종료했다. dev가 자동 수정한 `next-env.d.ts`는 원상 복원했다.
- 최초 CSV 작성의 PowerShell 파이프 인코딩 손상은 검사에서 발견하여 UTF-8 파일 작성으로 복구했다. 최종 문항은 손상 문자·누락된 빈칸 표식 검사를 통과했다.

## 한계와 남은 확인

실제 브라우저 클릭·답안 제출·자기평가 화면은 미확인이다. Orca CLI는 로컬 runtime metadata에 접근하지 못했고, 내장 브라우저 도구는 `The browser access host is unavailable`을 반환했다. HTTP 200과 선택 함수 검증은 시각적 검증을 대신하지 않는다. 브라우저 사용 가능 시 임베디드기사 → 실기 필답형 선택, C 코드·조건 표시, 답안 제출 후 모범답안·해설, 자기평가·다음 문제 흐름을 확인해야 한다. 실물 보드·ISR·DMA·RTOS 타깃 실행, 프로덕션 빌드·배포도 수행하지 않았다.

사용자 검토 전이며 추가 작업 없이 대기한다.

## 후속 확장 — 2026-11-03

### 참고자료와 전체 열람

- 사용자 지정 [Drive PDF](https://drive.google.com/file/d/1kZHXTRlUGbcdxwjO5uqI4Oeuqe-7yoh_/view): `임베디드기사 2013~2025 실기복원문제집(정답용).pdf`.
- 메인이 받은 로컬 원본은 읽기만 했다. 346,521바이트, PDF 1.6, 22쪽, SHA-256 `fb47ac8882d18abb32cef7146c6bb53f1bfb45da72c67ad6cc46130ec8fd1681`. 원본·전체 추출문·전체 페이지 이미지를 레포에 추가하지 않았다.
- PyMuPDF로 22쪽 모두 텍스트를 추출하고 좌우 단을 분리했다. 22쪽 모두 1.3배 렌더를 직접 열람하여 그림·코드·표와 대조했다. 로컬 렌더는 Git 제외 경로 `.next/practical-reference`에만 있다.
- 실제 연도 표제는 **2015~2025**다. 2013·2014 수록은 확인되지 않았다. 연도는 PDF에 인쇄된 표제 기준이며 시험 시행일·공식성은 확인되지 않았다.
- 페이지별 전체 검토 범위는 아래와 같다. 문항 번호는 연도 내 번호이며 인쇄된 최종 번호 기준 합계 200개다. 반복된 개념도 원자료에는 별개 문항으로 들어 있다.

| PDF 쪽 | 인쇄 연도·번호 | 확인한 주제·유형·그림 |
|---|---|---|
| 1 | 2015, 1~12 | 링크·드라이버·CASE·Android·동기화·테스트·부팅, 단답/복수답/서술, 반가산기 회로 |
| 2 | 2016, 1~11 | Java 전체 코드/출력, Best Fit 표, 진리표, 시스템 콜·UML |
| 3 | 2016, 12~17 | 워킹 셋·I²C·검사·readelf·모델·MTD, 주로 단답 |
| 4 | 2017, 1~18 | XNOR 회로·UML 상태 그림, 페이지·캐시 계산, C 출력·MMU·PCB·JTAG |
| 5 | 2018, 1~13 | 반가산기 회로, C 포인터·malloc 출력, 동기화 빈칸, UML 집합 그림 |
| 6 | 2018, 14~19 | 데이지 체인·모델·Kconfig 명칭·문맥교환·pthread, 구식 IRQ 코드 |
| 7 | 2019, 1~11 | Make·장치·ARM LED 코드 빈칸·프로세스·인터럽트 순서·Best Fit 표·C 빈칸 |
| 8 | 2019, 11의 출력~17 | C 출력 이어짐·ioctl·부트로더·Android.mk·Kconfig 과정 도표·SRAM |
| 9 | 2020, 1~15 | 부팅·C·readelf·DRAM·검사·Btrfs·BIOS·스래싱·DMA·UML |
| 10 | 2020, 16~18 | 커널 경로·선택정렬, 다이오드 전압 회로 |
| 11 | 2021, 1~11 | UML 상태 그림·TLB·MTD·시스템 콜·PCB·C 출력·교차개발·인터럽트 서술 |
| 12 | 2021, 12~17 | C 조건식·구조체 복수선택·표준 스트림 빈칸, 모듈 로드 도표·ARM 빈칸 |
| 13 | 2021, 18~19 | C 복사 함수 복수 빈칸, CODARTS 지문이 좌우 단에 이어짐 |
| 14 | 2022, 1~12 | 구조체 코드·IRQ 순서·플래시 FS·권한·소켓 빈칸·소스 트리 |
| 15 | 2022, 12의 답~20 | 워치독·ZONE_NORMAL·UML·Make·csh·스텁·minterm 식·메모리 계산 |
| 16 | 2023, 1~12 | 상대주소·엔디언 계산·모델·union·링커·TCP 양방향 도표 |
| 17 | 2023, 13~20 | completion 서술·페이지 계산·다이오드 회로·메모리 오류 C·MBR·JTAG |
| 18 | 2024, 1~9 | 캐시 계산·PCB·모델·ARM LED 코드/조건·ARM 워치독 빈칸·MTD |
| 19 | 2024, 10~20 | 장치·SysV·부팅·보안·메모리·풀업, 단답/복수답 |
| 20 | 2025, 1~12 | Make·권한·UML 그림·ARM 스택 계산·커널/모듈 호출 도표·NAND 반가산기 |
| 21 | 2025, 13~20 | TCP 빈칸·일정·SPI·GCC·테스트·ARM 루프·스핀락 선택·트리 C 앞부분 |
| 22 | 2025, 20 이어짐 | C 정렬·균형 BST 생성·중위 순회 전체 후반과 출력 |

### 추가 결과와 출처 구분

기존 창작 20문항의 CSV는 바이트 단위로 보존했다. **119개 추가, 임베디드 실기 20 → 139개**, 임베디드 전체 628 → 747개(필기 608 유지), 앱 전체 6,371 → 6,490개다. 첫 작업 전 대비 실기 0 → 139개이며 다른 자격증 문항은 그대로다.

| 새 문항 유형 | 수 |
|---|---:|
| 단답 | 22 |
| 복수답 | 25 |
| 서술 | 24 |
| 코드·명령·코드 분석 | 24 |
| 계산·논리표 | 19 |
| 순서 | 5 |
| 합계 | 119 |

새 문항 주제 수: 리눅스·드라이버 21, 메모리·운영체제 17, C·Java 16, 설계·테스트 13, 빌드·개발 도구 11, 통신·주변장치 11, 디지털 논리 10, RTOS·동시성 8, ARM·레지스터 7, 부팅·보안 5.

- **복원 참고 21개**: 원자료와 대응하는 짧은 개념 문항을 다시 서술했다. source_year는 원자료의 표제 연도이며 공식 출제 확인을 의미하지 않는다.
- **변형·창작 98개**: 전제 보완·비교·오류 분석·새 코드·새 계산 과정을 포함한다. source_year는 비웠다. 원자료 개념에 기반한 창작을 당시 실제 시험 문항으로 표시하지 않는다.
- 각 문항 source에 Drive URL·표제 연도·쪽·번호·분류를 기록했다. `data/embedded-practical/reference-manifest.json`은 생성 ID별 대응표이다. source_review는 원자료 200개 항목의 대응·미선정·검토 대기를 별도로 기록한다.
- 태그 `유형:코드`·`유형:계산` 등으로 기존 연습·랜덤시험 필터에서 접근할 수 있다. 그림 의존 항목은 원그림을 빠뜨려 게시하지 않았다. 연결을 확정한 회로만 완전한 논리식·진리표로 재구성해 변형으로 표시했다.

### 기술 검토·미선정·검토 대기

| 위치 | 판단과 처리 |
|---|---|
| 2015 p.1 #4 | 폴링/데이지 체인을 소프트웨어/하드웨어 인터럽트로 나누는 문장 모호. 원문 복원형 제외 |
| 2015 p.1 #12 | 재검토 결과 OR·AND·NOT 구성도 `(A OR B) AND NOT(AB)`로 XOR를 구현한 정상 반가산기. 앞선 회로 오류 의심을 철회. R011에 동등식 설명 |
| 2016 p.2 #6, 2019 p.7 #10 | 부분복원 표시. 표 조건을 모두 명시한 새 계산 문제로만 사용 |
| 2016 p.3 #16 | V-모델의 원문 단정은 근거·문맥 부족. 미선정 |
| 2016 p.3 #17 등 | MTD를 블록 변환/파티션 기술로만 정의하는 표현 보완. R024·R082는 raw 플래시 계층과 구분 |
| 2018 p.5 #3, 2022 p.14 #3, 2025 p.20 #2 | module_init·register_chrdev·request_region의 역할 혼동. R039는 초기화 진입점 지정 문제로 새로 작성 |
| 2018 p.5 #4 | gets를 C11 정답으로 재사용하지 않음. R040은 fgets·길이·실패 검사로 변형 |
| 2018 p.5 #5 | 답란 공란. 원문 복원형 제외; 블랙박스 개념은 다른 완전한 지문을 참고 |
| 2018 p.5 #12 | 부분복원과 P/V 의미 혼동. R044에서 획득/대기와 해제/신호 구분 |
| 2018 p.6 #16·19 | 일부 config 이름·구식 SA_INTERRUPT/GPIO API는 버전 의존. 원코드 복원 게시 보류, IRQ 개념만 현대 API 명칭으로 변형 |
| 2019 p.7 #5, 2024 p.18 #5 | 감소 카운터·MVN 상위 비트·설명상 증가 패턴이 혼재. LED 완성 원코드 게시 보류, R055·R099는 명확한 개별 명령 효과만 분석 |
| 2020 p.9 #2 | hosted/freestanding과 스타트업을 구분하지 않은 main 설명 보완(R066) |
| 2020 p.9 #10~11·p.10 #16 | Btrfs/BIOS/커널 init 경로의 환경·버전 일반화 문제. 해당 원문은 미선정 |
| 2020 p.10 #17 | 마지막 패스의 뜻 모호. R073은 두 패스와 알고리즘을 명시 |
| 2020 p.10 #18, 2023 p.17 #16 | 원그림은 확인했으나 다이오드 이상/실제 전압강하·극성/접속 전제를 확정하기 부족. 3V를 추정해 게시하지 않고 검토 대기 |
| 2021 p.13 #19 | CODARTS는 전문 근거 추가 검증 필요. 미선정 |
| 2022 p.14 #9·p.15 #14 | 파일시스템 선택·ZONE_NORMAL을 모든 아키텍처에 일반화하지 않음. 전제 제한한 서술형으로 변형 |
| 2022 p.15 #15 | 유스케이스를 상세 처리 흐름과 동일시하지 않도록 비교 문항(R072)에서 보완 |
| 2023 p.16 #3 | 명령 길이 누락. R092는 1주소 단위 가상 기계로 명시 |
| 2025 p.20 #10 | 원도표의 함수 소속·호출 위치 모호. 원문 전체 오류 번호 확정 보류; R105는 심볼 공개 규칙만 명시 |
| 2025 p.21 #13 | TCP 종료가 언제나 정확히 4개 패킷이라는 일반화 제외. R107은 SYN 시퀀스 소비에 한정 |
| 2025 p.21 #16 | -o는 링크 강제 옵션이 아니라 출력 이름. R109는 -c와 별도 링크 명령 제시 |
| 2025 p.21 #19 | 답이 별도 텍스트가 아니라 원그림에 표시돼 있음. 스핀락은 항상 context switch가 없고 항상 싸다는 일반화 제외(R111) |
| 반복 단답 | 커널·PCB·cross compiler·readelf·working set 등 연도별 동일 주제는 연도만 바꿔 복제하지 않음. 비교·오류·활용 문제가 아닌 반복은 미선정 |

### 실기 기능과 디자인 통합 주의

설치된 Next.js 16.3.0의 로컬 TypeScript 및 Server/Client Components 가이드를 읽은 뒤 수정했다. 기존 문자열 답안·자기평가 스키마와 PRACTICAL_WRITTEN_RESPONSE를 유지한다. 자동 키워드 채점은 추가하지 않았다.

- `components/PracticalResponse.tsx`: 연습·시험 공용 실기 입력(8줄 textarea, 코드 맞춤법 검사 비활성, 번호별 입력 안내), 자동 확정 채점의 한계, 제출 후 모범답안·채점 핵심어 표시. 답안의 줄바꿈을 보존한다.
- `app/page.tsx`: QuestionView의 실기 textarea/모범답안 부분만 공용 컴포넌트로 교체, 실기 해설 줄바꿈 보존. 기존 제출·자기평가·다음 문제 제어는 유지.
- `components/TestMode.tsx`: 실기 시험 입력과 결과 복습만 동일 컴포넌트 사용. 실기 해설 제목은 공식 해설이 아닌 학습 해설. 필기 표시·채점은 유지.
- 공통 CSS·팔레트·홈 레이아웃 변경 없음. **Claude의 app/page.tsx 또는 TestMode.tsx와 충돌하면 위 import와 실기 분기만 통합**하고 디자인 전체를 이 파일로 덮어쓰지 않는다. PracticalResponse의 두 로컬 whiteSpace 스타일은 콘텐츠 줄바꿈 의미 보존용이다.

### 후속 최종 검증과 한계

- 생성: `npm.cmd run questions:generate` → 7 CSV, 6,490개. 재실행 SHA-256 동일: `b8ac356bcc1d5be63c69e9395157b4841bd9f57e3c84c4e519a8ee6c7257de9e`.
- 직전 생성 데이터 6,371개를 ID별 deepEqual 비교하여 **기존 20개를 포함한 모든 문항 전체 필드 보존**, 새 119개만 추가 확인.
- 첫 CSV SHA-256 `95bc0f5d10a0ea76eedfb8a983599fda4bb0838c6e3c958d8ec590532710c311` 보존 회귀 테스트.
- `npm.cmd test`: **58/58 통과**. ID·출처·연도 구분·참고 위치·유형별 수·번호 표식을 뺀 문항 중복·필터·시험 선택·여러 줄 저장·자기평가·비자동채점·원자료 200항목의 검토 상태 검증.
- `npm.cmd run lint`: **통과**. `git diff --check`도 확인.
- GCC `-std=c11 -Wall -Wextra -Werror`로 새 R031·R041·R069·R076 실행 출력, javac/java로 R016의 필드 숨김/동적 메서드 호출 출력 확인. 16입력 전체의 minterm 집합과 반가산기 동등식도 실행 검증했다. 다른 ARM·하드웨어·커널 코드는 직접 실행하지 않고 명시된 전제와 명령 의미를 검토했다.
- 추가 공식 검증 자료: [GCC Overall Options](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html), [Linux Driver Basics](https://docs.kernel.org/driver-api/basics.html), [Linux completion](https://docs.kernel.org/scheduler/completion.html), [Java 언어 명세 15장](https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html). 위 첫 배치의 WG14·NXP·ST·Microchip 자료도 사용했다.
- manifest ID 계산에서 NFKC 정규화 누락이 테스트에 잡혔다. 생성기의 정규화와 맞춘 뒤 전 항목 통과. 생성기 자체는 변경하지 않았다.
- 로컬 dev 서버 기동. 브라우저 호스트는 연결 불가였고, native Chrome 시도도 도구가 현재 URL을 충분히 판별하지 못해 정책상 종료했다. **실제 클릭·답안 입력→제출·자기평가와 PC/모바일 시각 검수는 미확인**이다. UI 도구의 차단을 다른 자동화 경로로 우회하지 않았다. 컴포넌트 렌더·프로덕션 빌드는 별도 확인이 필요하다.
- 최종 브랜치 `Yuris99/embedded-practical`, HEAD `1b7b7c05f85d4cafe28e21a4cc99e01911a08db2`. 미커밋 검토 상태, push·배포 없음. 원자료에 대한 남은 기술 검토와 실제 화면 검수는 메인의 통합 검토 항목이며 완료 후 새 작업을 시작하지 않는다.

후속 변경 파일: `content/questions/embedded-engineer-practical-reference.csv`, `data/embedded-practical/reference-manifest.json`, `data/embedded-practical/source-review.json`, `lib/generatedQuestions.ts`, `components/PracticalResponse.tsx`, `app/page.tsx`, `components/TestMode.tsx`, `tests/embedded-practical-reference.test.mjs`, `tests/questionIntegrity.test.mjs`, 본 문서. 기존 첫 CSV는 그대로 보존했다.

## 실기 요약집 추가 — 2026-11-06

사용자가 실기 요약집을 요청한 뒤 다음 두 로컬 PDF를 참고자료로 추가 제공했다. 등록된 worker와 배정 브랜치가 일치함을 다시 확인했다. 작업 기준 HEAD는 `5412b12f879674c9f72bd753d8e110fe8bca2b95`, 브랜치는 `Yuris99/embedded-practical`이다. 이번 변경은 미커밋이며 병합·push·배포하지 않았다.

### 자료와 검토 범위

두 파일은 `C:/Users/mose1/Documents/카카오톡 받은 파일/`에서 읽었다. 원본 파일을 수정하거나 저장소에 복사하지 않았다. 추출문·렌더는 무시 경로 `.next/summary-sources` 안에만 생성했다.

| 자료 | 크기·분량 | SHA-256 | 확인 방식 |
|---|---|---|---|
| 임베디드기사_ARM어셈블리_정리.pdf | 1,977,424바이트, 9쪽 | `f5f4bb77327fee0a6f859eec9c9113b6876dbfa2c15dff0b8a3fbfc9d22689d9` | 텍스트 없는 이미지 PDF. 9쪽 전체를 렌더로 열어 명령·주소 지정·플래그·스택·반복 코드와 설명 확인 |
| 임베디드기사_실기_완성교재.pdf | 2,158,823바이트, 36쪽 | `43746fddd457e0007c44ca6eebf6a44e1b9955b3c6df302af3333a17939eef1e` | 전체 텍스트 추출 후 목차·기술 본문·정정표·예상문제 부분 확인. 회로 표가 있는 2쪽과 커널 할당 설명의 27쪽은 렌더도 대조 |

완성 교재 24~32쪽은 자료 자체에서 **AI 예측·실제 기출 아님**으로 명시한다. 빈도·출제 이력·적용기간·공식 정답이라는 주장은 별도 확인 없이 요약집에 옮기지 않았다. 33~35쪽의 번호·정정표는 이전 복원집과 번호가 다를 수 있어 기존 문제은행 provenance를 덮어쓰지 않았다.

### 앱 구성

기존 `/summary`의 선택 목록에 **임베디드기사 실기**를 추가했다. 홈의 기존 개념 정리 링크에서 진입해 선택할 수 있다. 기존 컴시기·임베기 내용과 검색·목차·암기 체크를 재사용했다.

- 핵심 주제 20개: 답안 작성, C 포인터·수명, ARM 레지스터·플래그·주소·스택·루프, 비트/레지스터, 논리회로, 메모리 계산·가상메모리, 부팅, 빌드, 드라이버, OS, 동기화, TCP, 주변장치, 타이머, UML/테스트, 장애 대응.
- 풀이 예제 12개(코드 블록 7개), 비교 10개, 회상 문제 12개, 상세 노트 8개, 시험 전 체크 6개, 암기 항목 24개.
- 각 관련 개념에서 기존에 게시된 실기 문제 ID로 연결한다. 기존 `practiceQuestions` 딥링크를 사용하며 새 저장 스키마나 시험 유형을 만들지 않았다.
- 예제 코드는 기존 `codeBlock` 스타일로 줄바꿈과 가로 스크롤을 보존한다. 코드 내용도 검색한다. 출처·검토 기준을 별도 목차에 표시한다.
- 암기 체크는 기존과 같이 페이지의 메모리 상태이며 새로고침·재진입 시 영구 복원하지 않는다. 화면에서 이를 안내한다.

### 기술 보완과 출처

| 참고자료의 단순화·주의점 | 요약집 처리 |
|---|---|
| ARM의 FP·PC·호출 시 저장 레지스터를 고정 규칙처럼 서술 | A32/AAPCS32와 실행 상태·명령·호출 규약 전제를 명시 |
| S 접미사가 있는 명령만 CPSR 갱신하는 듯한 설명 | CMP·CMN·TST·TEQ도 플래그를 갱신함을 명시 |
| `[r0,#0x2000]`를 실제 A32 word STR에 사용 | 일반 즉시 오프셋 ±4095 한계를 알리고 완전한 주소를 별도 준비하는 새 예제 사용 |
| MVN 결과를 8비트 값으로만 해석 | 32비트 전체 반전과 데이터 마스크·예약 비트를 구별. 본문 뒤 카운터 감소 방식의 끝값은 0xFE까지라고 설명 |
| GCC -o를 링크 옵션으로 설명 | -c는 링크 생략, -o는 출력 이름이라고 구분 |
| GFP_KERNEL이 항상 ZONE_NORMAL이며 가장 빠르다는 설명 | 수면 가능한 문맥·아키텍처·존 제약과 할당 정책을 구별 |
| 스핀락에 문맥 교환이 절대 없다는 설명 | PREEMPT_RT·구현에 따른 차이를 안내 |
| 특정 스타트업 7단계를 모든 보드에 일반화 | 베어메탈과 Linux 부트 흐름의 예로 구분, 보드 전제 우선 |
| struct/union 크기를 합/최댓값으로만 확정 | 정렬·패딩을 함께 확인하도록 보완 |
| TCP 서버와 클라이언트 호출을 단일 순서로 나열 | 서버와 클라이언트를 분리하고 accept/connect 상호작용 설명 |

공식 기술 대조 자료는 요약집의 참고자료에도 연결했다: [Arm AAPCS32](https://github.com/ARM-software/abi-aa/blob/main/aapcs32/aapcs32.rst), [Arm LDR immediate offset](https://support.arm.com/documentation/dui0473/m/arm-and-thumb-instructions/ldr--immediate-offset-), [Arm 조건 실행](https://support.arm.com/documentation/den0013/0400/ARM-Thumb-Unified-Assembly-Language-Instructions/Instruction-set-basics/Conditional-execution), [WG14 N1570](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf), [GCC Options](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html), [Linux Driver Basics](https://docs.kernel.org/driver-api/basics.html), [Memory Allocation](https://docs.kernel.org/core-api/memory-allocation.html), [Lock Types](https://docs.kernel.org/locking/locktypes.html), [Completions](https://docs.kernel.org/scheduler/completion.html), [NXP I²C](https://www.nxp.com/docs/en/user-guide/UM10204.pdf).

특히 기존 R099의 큰 즉시 오프셋 표기는 주소 산술 학습과 실제 인코딩 가능성을 구별해 검토할 여지가 있다. 이번에는 요약집에 정확한 인코딩 전제와 대체 예제를 제공했으며 승인된 기존 문제은행 자체를 다시 작성하지 않았다. 실물 MCU·타깃 어셈블러로 전체 코드를 실행 검증한 것은 아니다.

### 검증과 변경 파일

- `npm.cmd test`: **60/60 통과**. 새 테스트는 관련 링크가 게시된 임베디드 실기로 연결되는지, 요약 데이터·출처가 완전한지 검증한다.
- `npm.cmd run lint`: **통과**. 설치된 Next.js 16.3.0의 로컬 Server/Client Components·TypeScript 가이드 확인 후 편집했다.
- `npm.cmd run dev -- --hostname 127.0.0.1 --port 3217` 후 설치된 Playwright Test runner로 **PC 1440×1000, 모바일 390×844 2/2 통과**.
- 브라우저 검증: 기존 필기 선택 → 실기 선택 → 코드 검색(STMFD)·검색 없음 → 암기 체크·선택 전환 후 유지 → 관련 문제 열기 → 여러 줄 답안 작성 → 제출 → 모범답안 확인 → 부분 정답 자기평가 → 다음 문제 활성화. 문서 가로 넘침과 브라우저 pageerror 없음도 확인했다.
- `.next/summary-browser`의 PC·모바일 소개/코드/풀이 캡처를 직접 열어 확인했다. 첫 브라우저 실행은 테스트가 기존 버튼 이름을 짧게 오기해 실패했으며 실제 접근성 이름에 맞춰 수정 후 두 환경 모두 통과했다. 테스트 설정·캡처·실패 trace는 임시 검증 산출물로 Git에 포함하지 않았다.
- 기존 두 실기 CSV와 `lib/generatedQuestions.ts`를 HEAD와 비교하여 **내용 변경 없음** 확인. 문항 수는 기존 임베디드 실기 139개, 전체 6,490개 그대로다.
- 실물 기기·전체 ARM 어셈블·프로덕션 빌드·배포 검증은 수행하지 않았다. 메인 dev의 최신 디자인 변경과의 통합은 이 작업에 포함하지 않았다.

변경 파일은 `app/summary/page.tsx`, `content/summaries/embedded-practical.ts`, `lib/summaryTypes.ts`, `tests/embedded-practical-summary.test.mjs`, 본 문서다. 공통 CSS·홈·문제 데이터·저장 스키마는 변경하지 않았다. 메인의 summary 페이지에 ThemeToggle 등 후속 변경이 있으므로 **해당 파일 전체를 덮어쓰지 말고 새 subject/extraNotes 등록·관련 링크·예제 코드·출처 렌더 부분을 통합**해야 한다.
