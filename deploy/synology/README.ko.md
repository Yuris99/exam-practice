# 시놀로지 NAS 배포

## 1. 배포 흐름

`dev`에 푸시하면 GitHub Actions가 테스트를 실행하고 `linux/amd64`용 `ghcr.io/yuris99/exam-practice:dev` 이미지를 게시한다. 시놀로지 작업 스케줄러는 5분마다 `update.sh`를 실행한다. Docker Compose는 이미지 다이제스트가 변경된 경우에만 앱을 다시 생성한다.

Intel Celeron J3455는 `linux/amd64` 이미지를 사용한다.

## 2. 첫 이미지 게시

1. 로컬 `dev` 브랜치를 GitHub에 푸시한다.
2. 저장소의 **Actions** 탭에서 **Publish container**가 성공했는지 확인한다.
3. GitHub에 새로 생성된 `exam-practice` 패키지를 열고 **Package settings**에서 공개 범위로 변경한다.

소스 저장소가 공개여도 GitHub Container Registry 패키지는 처음에 비공개일 수 있다. 공개 패키지는 NAS에서 레지스트리 인증 없이 받을 수 있다.

## 3. 시놀로지 프로젝트 생성

1. 이 `deploy/synology` 디렉터리를 `/volume1/docker/exam-practice`와 같은 NAS의 영구 디렉터리에 복사한다.
2. DSM Container Manager에서 **프로젝트**를 열고 **생성**을 선택한 다음 `compose.yaml`을 지정하여 프로젝트를 빌드한다.
3. `http://NAS_IP:3000`을 열어 사이트를 확인한다.
4. `http://NAS_IP:3000/api/health`를 열어 `{"status":"ok"}`가 반환되는지 확인한다.

호스트 포트를 바꾸려면 프로젝트 생성 전에 `compose.yaml` 옆에 `APP_PORT=원하는_포트`가 들어 있는 `.env` 파일을 만든다.

## 4. 5분 자동 갱신 활성화

DSM **제어판 → 작업 스케줄러**에서 다음 설정으로 사용자 정의 예약 작업을 만든다.

- 사용자: Docker를 실행할 수 있는 관리자
- 일정: 5분마다
- 명령: `sh /volume1/docker/exam-practice/update.sh`

작업을 한 번 수동 실행하고 결과를 확인한다. 이후 `dev`에 푸시할 때마다 검증된 이미지가 게시되고 NAS는 약 5분 이내에 반영한다.

## 5. 역방향 프록시와 HTTPS

DSM **제어판 → 로그인 포털 → 고급 → 역방향 프록시**에서 원하는 HTTPS 호스트 이름을 `http://127.0.0.1:3000`으로 전달한다. 해당 호스트 이름에 시놀로지 또는 Let's Encrypt 인증서를 지정한다. localhost 외부에서 PWA를 안정적으로 설치하려면 HTTPS가 필요하다.

역방향 프록시가 동작하면 선택적으로 DSM 방화벽에서 3000번 포트를 로컬 네트워크로 제한한다.

## 6. 선택적 AI 설정

실제 AI 해설을 활성화할 때만 `compose.yaml` 옆에 `.env` 파일을 만든다.

```dotenv
GEMINI_API_KEY=replace_me
GEMINI_MODEL=gemini-3.5-flash
AI_DAILY_LIMIT=100
```

환경 변수를 변경한 뒤 Container Manager 프로젝트를 다시 빌드한다. 이 `.env` 파일은 커밋하지 않는다.

## 7. 패키지를 비공개로 전환

GitHub 저장소와 GHCR 패키지의 공개 범위는 별개다. 저장소는 나중에 비공개로 바꿀 수 있다. GHCR 패키지도 비공개라면 `read:packages` 권한만 있는 GitHub classic personal access token을 만들고 NAS에서 한 번 로그인한다.

```sh
echo 'TOKEN' | docker login ghcr.io -u GITHUB_USERNAME --password-stdin
```

로그인 후에도 같은 Compose 파일과 갱신 일정이 계속 동작한다. 토큰이 노출되면 폐기하고 새로 발급한다.

## 8. 이전 버전으로 복구

각 이미지는 전체 Git 커밋 SHA 태그로도 게시된다. 이전 버전으로 돌아가려면 `compose.yaml`의 `:dev`를 `:COMMIT_SHA`로 바꾸고 프로젝트를 다시 생성한 다음 `/api/health`를 확인한다. 자동 갱신을 재개할 때 `:dev`로 되돌린다.
