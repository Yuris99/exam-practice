# 프로젝트 CSV 문제

이 폴더에 UTF-8 CSV 파일을 넣습니다. 파일 이름이 `_`로 시작하지 않는 모든 `.csv` 파일은 `dev`와 `build` 실행 전에 검증되어 앱에 포함됩니다.

1. `_template.csv`를 `information-processing-2026.csv` 같은 새 이름으로 복사합니다.
2. 한 행에 문제 하나를 작성하고 UTF-8 CSV로 저장합니다.
3. 로컬에서는 `npm.cmd run dev`를 실행합니다. 배포 빌드에서도 같은 생성 작업이 자동 실행됩니다.
4. 로컬 이미지는 `public/questions/`에 넣고 `/questions/q001.png` 같은 경로를 사용합니다.

시험 유형은 `WRITTEN_CBT`와 `PRACTICAL_WRITTEN_RESPONSE`를 지원합니다. CBT의 `correct_answer`에는 1부터 시작하는 정답 번호를 입력합니다. 실기 문제에는 `model_answer`가 필요하며 핵심어는 `|`, 쉼표 또는 세미콜론으로 구분합니다. 태그와 추가 이미지 경로는 `|`로 구분합니다.

확장 콘텐츠 열:

- `reference_text`: 지문, 조건, 표 형태 텍스트 또는 `[보기]` 블록입니다. 큰따옴표로 감싼 CSV 셀 안에 실제 줄바꿈을 사용합니다.
- `code_snippet`: Markdown 코드 울타리 없이 소스 코드만 입력하며, 언어를 알면 `code_language`도 지정합니다.
- `image_url`: 대표 이미지 URL 또는 `public/` 아래 경로입니다. 예: `/questions/q001.png`
- `image_urls`: 추가 이미지 경로를 `|`로 구분하며, 대표 이미지를 포함해 최대 6장입니다.
- `certificate_id`: `information-processing-engineer`, `embedded-engineer` 같은 고정 식별자를 사용합니다.

다른 AI에 전달할 프롬프트는 영문 `AI_IMPORT_PROMPT.md` 또는 한국어 `AI_IMPORT_PROMPT.ko.md`를 사용합니다.

`_template.csv`처럼 이름이 `_`로 시작하는 파일은 무시됩니다. 잘못된 행이 있으면 파일명과 행 번호를 표시하고 빌드를 중단합니다.
