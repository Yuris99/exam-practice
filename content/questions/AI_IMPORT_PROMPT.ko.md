# 문제은행 CSV 변환 프롬프트

## 역할

자격증 시험 원본 자료를 검증 가능한 UTF-8 CSV 문제은행으로 변환한다. 원문의 한국어 표현을 보존하고 누락된 문제, 선택지, 정답, 해설, 이미지 또는 메타데이터를 임의로 만들지 않는다.

## 출력

Markdown 코드 울타리나 설명 없이 CSV 원문만 출력한다. 다음 헤더와 열 순서를 정확히 사용한다.

```text
exam_type,category,prompt,choice1,choice2,choice3,choice4,correct_answer,model_answer,key_points,explanation,difficulty,image_url,tags,source,source_year,reference_text,code_snippet,code_language,image_urls,certificate_id
```

CSV 레코드 하나에 문제 하나를 작성하고 UTF-8로 인코딩한다. RFC 4180 인용 규칙을 따른다. 쉼표, 큰따옴표 또는 줄바꿈이 포함된 셀은 큰따옴표로 감싸고, 셀 내부의 큰따옴표는 `""`로 이스케이프한다.

## 시험 유형

- 객관식 필기 CBT: `WRITTEN_CBT`. 선택지를 중간 빈칸 없이 입력하며 일반적으로 4개를 채운다. `correct_answer`에는 1부터 시작하는 정답 번호를 입력하고 `model_answer`, `key_points`는 비운다.
- 주관식 실기 필답형: `PRACTICAL_WRITTEN_RESPONSE`. 모든 선택지와 `correct_answer`를 비운다. `model_answer`를 입력하고 `key_points`는 `|`로 구분한다.

## 확장 콘텐츠

- `prompt`에는 문제 질문 문장만 넣는다.
- 지문, 조건, 표 형태 자료 또는 `[보기]`로 표시된 텍스트는 `reference_text`로 옮긴다. 의미 있는 줄바꿈은 유지하고 `┌`, `─`, `│`, `└` 같은 장식 테두리는 제거한다.
- 소스 코드는 Markdown 코드 울타리 없이 `code_snippet`에 넣는다. `code_language`에는 `c`, `java`, `python`, `sql`, `text` 같은 언어 식별자를 넣는다.
- 대표 이미지 경로는 `image_url`, 추가 경로는 `image_urls`에 `|`로 구분하여 넣는다. 전체 이미지는 최대 6장이다.
- 프로젝트 내부 이미지는 `public/` 아래 실제 파일과 일치하는 슬래시 시작 경로를 사용한다. 예: `/questions/q001.png`, `/static/images/Engineer_Embedded/2026/q001.png`
- 전용 필드로 분리한 `[이미지]`, 이미지 경로, `[보기]` 블록 또는 소스 코드를 `prompt`에 다시 넣지 않는다.

## 메타데이터

- `difficulty`에는 `easy`, `medium`, `hard`만 사용한다. 원본에 신뢰할 수 있는 난이도가 없으면 `medium`을 사용한다.
- `tags`는 `|`로 구분한다.
- `source`에는 정확한 시험 또는 출처 표기를 넣고, 연도를 알면 `source_year`에 네 자리 숫자를 넣는다.
- `certificate_id`에는 요청받은 고정 ID를 사용한다. 예: `information-processing-engineer`, `embedded-engineer`
- `category`에는 공식 과목명을 보존한다. `미분류`를 사용하거나 문제 번호만 보고 과목을 만들지 않는다.

## 검증

- 필수 정답이 없거나 신뢰할 수 없으면 추측하지 말고 해당 문제를 제외한다.
- 유효한 선택지가 2개 미만이거나 정답 번호가 선택지 범위를 벗어난 CBT 문제는 제외한다.
- 모범답안이 없는 실기 문제는 제외한다.
- 완전히 동일한 문제는 중복 제거하고 해설과 메타데이터가 더 완전한 항목을 남긴다.
- 여러 줄 셀이 큰따옴표로 감싸졌는지와 모든 레코드가 정확히 21개 열인지 확인한다.
- 응답 전에 선택지 순서, 정답 번호, 한국어 원문, 보기·코드 분리, 이미지 경로와 CSV 이스케이프를 검증한다.

## 원본 자료

아래 구분선 다음에 제공된 원본 자료를 위 규칙에 따라 변환한다.

---

[여기에 원본 자료를 붙여 넣으세요]
