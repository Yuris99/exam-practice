# 정보보안기사 검수 파이프라인

`manual-review.json`이 검수 대기열의 기준 데이터이며 `manual-review.csv`는 사람이 확인하기 위한 동일 행의 투영본이다. 두 파일은 문제 본문과 OCR 메타데이터만 포함하고 현재 크기가 각각 약 2.7 MB와 1.0 MB여서 Git으로 함께 추적한다. 다음 명령은 두 파일의 행·필드 일치, 활성 문제은행과의 중복, 대기열 내부 중복, 문제 번호·보기 수·정답 범위, 전체 재고 합계를 검사한다.

```powershell
npm run security:review:validate
```

새 배치를 준비할 때는 기존 디렉터리를 덮어쓰지 않는 고유 ID를 사용한다. 결과는 기본적으로 운영체제 임시 디렉터리에 생성되며 저장소에는 포함하지 않는다.

```powershell
npm run security:review:prepare -- --batch-id batch-002 --size 100
```

선정은 검수 사유 다양성을 유지하면서 같은 PDF 페이지의 문항을 우선 묶는다. OCR JSON과 페이지 이미지는 고유 페이지당 한 번만 읽고, 문제 영역은 OCR 좌표로, 정답표는 하단 OCR 경계로 자른다. 활성 문제은행과 본문·보기 지문이 같은 항목은 선정 전에 제외한다. 자동 구조 검증을 통과한 뒤에도 정답이나 누락 내용을 추론해서 채우지는 않는다.

배치 폴더의 `review-session.json`에는 OCR 로딩, 이미지 추출, 데이터 변환, 검증 시간이 자동 기록된다. 외부에서 수행되는 AI 검수와 후속 등록·배포 시간은 다음처럼 시작과 종료를 기록한다.

```powershell
node scripts/update-security-review-session.mjs <배치폴더>/review-session.json ai_review start
node scripts/update-security-review-session.mjs <배치폴더>/review-session.json ai_review finish
node scripts/update-security-review-session.mjs <배치폴더>/review-session.json registration_and_deployment start
node scripts/update-security-review-session.mjs <배치폴더>/review-session.json registration_and_deployment finish
```

## 확인된 병목과 변경점

- 기존 배치 스크립트는 검수 JSON과 OCR JSON을 한 번씩 읽고 OCR 페이지를 캐시했으므로 이 부분은 반복 I/O 병목이 아니었다.
- 반면 원본 페이지 이미지는 문항·정답마다 다시 읽었고, 생성한 카드 파일도 연락표 조합 때 다시 읽었다. 이제 고유 페이지당 한 번 읽고 카드 버퍼를 메모리에서 재사용한다.
- 기존 `spreadPick`은 다양한 구간에서 문항을 고르기 위해 페이지를 의도적으로 분산했다. 이제 검수 사유의 다양성을 우선하되 같은 페이지 문항을 한 묶음으로 선정한다.
- 기존 연락표는 네 문항 단위였지만 서로 다른 페이지가 섞일 수 있었다. 새 manifest는 `page_groups`를 제공하고 문항을 페이지 순서로 배치한다.
- 문제 번호, 보기 4개, 보기 중복, 정답 1–4, source key/hash, 활성 은행 중복과 JSON/CSV 일치 여부를 코드로 먼저 확인한다. 이미지 확인은 자동 검증으로 확정할 수 없는 항목에 집중한다.
- 기존 스크립트의 콘솔 출력은 이미 요약 1건 수준이었다. 새 스크립트도 집계와 단계별 시간만 한 번 출력한다.
- 검수 스크립트 자체는 테스트나 프로덕션 빌드를 반복 실행하지 않는다. 배치 중에는 대기열 검증과 단위 테스트를 사용하고, 커밋·배포 직전에 전체 검증을 한 번 수행한다.

이 문서의 시간 관련 항목은 측정값을 만들지 않는다. 다음 배치부터 `review-session.json`에 기록된 실제 시간만 성과 비교에 사용한다.
