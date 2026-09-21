# 검수 대기 복구 배치 001

- 검수 대상: 100문항
- 복구 성공 및 신규 등록: 59문항
- 기존 등록과 동일하여 중복 제외: 4문항
- 미등록·검수 보류: 37문항
- 정보보안기사 문항 수: 767 → 826 (+59)
- 검수 대기열: 1,099 → 1,036 (-63: 신규 등록 59 + 기존 중복 4)
- 과목별 복구: 네트워크 보안 16, 시스템 보안 12, 어플리케이션 보안 6, 정보보안 관리 및 법규 12, 정보보안 일반 13
- 출처별 복구: 백전백승 기출문제 8, 지피지기 기출문제 37, 천기누설 예상문제 14
- 연도·회차별 복구: 2022-1회 1, 2022-2회 3, 2022-4회 1, 2023-1회 2, 2023-2회 5, 2024-1회 2, 2024-2회 2, 2024-4회 1, 2025-1회 3, 2025-2회 7, 2025-4회 5, null-null회 27
- 보류 사유별 수: duplicate_or_version_conflict 3, question_region_or_ocr_fragment_unrecoverable 27, visual_sequence_or_exact_symbols_unrecoverable 6, answer_not_verified 1
- 집계 차이: 후보 1,846 = 당시 등록 후보 747 + 검수 대기 1,099. 등록 767 + 대기 1,099 = 1,866으로 20 차이가 나며, 이는 앞서 검증·등록된 시범 20문항이다.
- 답안은 원본 PDF 정답표 또는 해당 문항 이미지에서 확인한 경우만 반영했고, 근거가 충분하지 않은 문제는 보류했다.
- 중복 4문항은 기존 은행 또는 이번 배치의 복구 문항에 이미 포함되어 있어 추가하지 않았다. 각 기존 출처는 결과 JSON에 기록했다. PDF 377쪽 패킷 덤프 표는 원본 crop 이미지로 첨부했다.
- PDF 593쪽 문항의 판독이 불확실한 특수문자 줄은 원문 crop 이미지로 그대로 보존하고, 텍스트로 추측해 바꾸지 않았다.
- 다른 자격증, 기존 정보보안기사 문제 및 이론 콘텐츠는 변경하지 않았다.

## 보류 문항

- #11 지피지기 기출문제-123-36 (PDF 123쪽, duplicate_or_version_conflict)
- #12 지피지기 기출문제-376-28 (PDF 376쪽, duplicate_or_version_conflict)
- #13 천기누설 예상문제-836-17 (PDF 836쪽, duplicate_or_version_conflict)
- #21 천기누설 예상문제-63-23 (PDF 63쪽, question_region_or_ocr_fragment_unrecoverable)
- #22 천기누설 예상문제-92-2 (PDF 92쪽, question_region_or_ocr_fragment_unrecoverable)
- #23 천기누설 예상문제-153-22 (PDF 153쪽, question_region_or_ocr_fragment_unrecoverable)
- #24 천기누설 예상문제-279-100 (PDF 279쪽, question_region_or_ocr_fragment_unrecoverable)
- #27 지피지기 기출문제-377-4 (PDF 377쪽, question_region_or_ocr_fragment_unrecoverable)
- #28 지피지기 기출문제-415-3 (PDF 415쪽, question_region_or_ocr_fragment_unrecoverable)
- #30 천기누설 예상문제-508-1 (PDF 508쪽, question_region_or_ocr_fragment_unrecoverable)
- #31 천기누설 예상문제-547-3 (PDF 547쪽, question_region_or_ocr_fragment_unrecoverable)
- #32 천기누설 예상문제-620-6 (PDF 620쪽, question_region_or_ocr_fragment_unrecoverable)
- #33 천기누설 예상문제-692-1 (PDF 692쪽, question_region_or_ocr_fragment_unrecoverable)
- #34 천기누설 예상문제-716-16 (PDF 716쪽, question_region_or_ocr_fragment_unrecoverable)
- #36 천기누설 예상문제-817-3 (PDF 817쪽, question_region_or_ocr_fragment_unrecoverable)
- #38 천기누설 예상문제-959-3 (PDF 959쪽, question_region_or_ocr_fragment_unrecoverable)
- #39 지피지기 기출문제-1016-31 (PDF 1016쪽, question_region_or_ocr_fragment_unrecoverable)
- #41 천기누설 예상문제-63-25 (PDF 63쪽, question_region_or_ocr_fragment_unrecoverable)
- #42 천기누설 예상문제-91-100 (PDF 91쪽, question_region_or_ocr_fragment_unrecoverable)
- #43 천기누설 예상문제-146-1 (PDF 146쪽, question_region_or_ocr_fragment_unrecoverable)
- #45 천기누설 예상문제-291-1 (PDF 291쪽, question_region_or_ocr_fragment_unrecoverable)
- #47 천기누설 예상문제-404-2 (PDF 404쪽, question_region_or_ocr_fragment_unrecoverable)
- #50 지피지기 기출문제-595-38 (PDF 595쪽, question_region_or_ocr_fragment_unrecoverable)
- #51 천기누설 예상문제-636-3 (PDF 636쪽, question_region_or_ocr_fragment_unrecoverable)
- #52 천기누설 예상문제-692-2 (PDF 692쪽, question_region_or_ocr_fragment_unrecoverable)
- #53 천기누설 예상문제-734-3 (PDF 734쪽, question_region_or_ocr_fragment_unrecoverable)
- #59 2025-2-4 (PDF 1140쪽, question_region_or_ocr_fragment_unrecoverable)
- #68 천기누설 예상문제-722-2 (PDF 722쪽, question_region_or_ocr_fragment_unrecoverable)
- #84 지피지기 기출문제-1018-31 (PDF 1018쪽, question_region_or_ocr_fragment_unrecoverable)
- #97 지피지기 기출문제-1047-6 (PDF 1047쪽, question_region_or_ocr_fragment_unrecoverable)
- #5 천기누설 예상문제-652-12 (PDF 652쪽, visual_sequence_or_exact_symbols_unrecoverable)
- #6 지피지기 기출문제-760-28 (PDF 760쪽, visual_sequence_or_exact_symbols_unrecoverable)
- #9 지피지기 기출문제-977-18 (PDF 977쪽, visual_sequence_or_exact_symbols_unrecoverable)
- #48 천기누설 예상문제-483-2 (PDF 483쪽, visual_sequence_or_exact_symbols_unrecoverable)
- #56 지피지기 기출문제-978-23 (PDF 978쪽, visual_sequence_or_exact_symbols_unrecoverable)
- #75 2025-2-93 (PDF 1160쪽, visual_sequence_or_exact_symbols_unrecoverable)
- #66 지피지기 기출문제-472-19 (PDF 472쪽, answer_not_verified)

## 이론 연결

- 관련 개념 자동 연결: 51/59문항, 미연결: 8문항, 연결된 고유 개념: 46개, 모호 판정: 3문항
- 네트워크 보안: 15/16 연결, 개념 14개, 모호 1
- 시스템 보안: 12/12 연결, 개념 11개, 모호 0
- 어플리케이션 보안: 6/6 연결, 개념 5개, 모호 0
- 정보보안 관리 및 법규: 7/12 연결, 개념 7개, 모호 1
- 정보보안 일반: 11/13 연결, 개념 9개, 모호 1
