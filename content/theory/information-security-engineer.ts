import type { TheoryCourse } from "../../lib/theoryTypes";

export const informationSecurityTheoryCourse: TheoryCourse = {
  certificateId: "information-security-engineer",
  title: "정보보안기사 이론 학습",
  sourceTitle: "2026 수제비 정보보안기사 필기 기본서",
  subjects: [
    {
      id: "system-security",
      title: "시스템 보안",
      description: "운영체제의 자원 관리부터 시스템 공격과 보안 도구까지 교재 목차 순서로 학습합니다.",
      units: [
        {
          id: "operating-system-intro",
          title: "운영체제 개론",
          chapter: "정보 시스템",
          summary: "운영체제의 기본 구조, 프로세스·메모리 관리, 접근 통제와 보안 운영체제를 하나의 흐름으로 연결합니다.",
          status: "published",
          sourcePdfPages: Array.from({ length: 15 }, (_, index) => index + 21),
          concepts: [
            {
              id: "shell-kernel-layers",
              title: "운영체제, 셸과 커널",
              summary: "사용자 명령이 하드웨어 자원에 도달하는 경로와 운영체제의 다섯 관리 계층을 이해합니다.",
              sourcePdfPages: [21, 22],
              keywords: ["운영체제", "셸", "커널", "시스템 호출", "사용자 모드", "커널 모드"],
              questionKeywords: ["운영체제의 주요 기능", "운영체제의 주요 자원", "운영체제 5계층", "운영체계 5계층", "시스템 호출", "시스템호출", "사용자 모드", "커널 모드", "Shell"],
              blocks: [
                { type: "text", title: "운영체제가 하는 일", paragraphs: ["운영체제는 사용자가 하드웨어를 쉽게 사용할 수 있도록 인터페이스를 제공하고, 실행 중인 프로그램에 CPU·메모리·입출력 장치 같은 자원을 배분한다.", "셸은 사용자의 명령을 읽고 해석한다. 커널은 부팅할 때 주기억장치에 적재되어 상주하며 프로그램과 하드웨어 사이에서 핵심 기능을 수행한다."] },
                { type: "diagram", title: "명령이 처리되는 경로", nodes: [{ label: "사용자", detail: "명령 입력" }, { label: "셸", detail: "명령 해석" }, { label: "커널", detail: "자원 관리" }, { label: "하드웨어", detail: "CPU·메모리·I/O" }], caption: "사용자 프로그램은 필요한 경우 시스템 호출을 통해 커널 서비스를 요청한다." },
                { type: "table", title: "사용자 모드와 커널 모드", columns: ["구분", "접근 범위", "핵심"], rows: [["사용자 모드", "하드웨어에 직접 접근할 수 없음", "대부분의 애플리케이션이 실행되며 시스템 호출로 커널 서비스를 사용"], ["커널 모드", "드라이버·메모리·CPU 등 모든 하드웨어 자원", "운영체제의 핵심 기능을 수행"]] },
                { type: "table", title: "운영체제의 5계층", columns: ["계층", "관리 영역", "역할"], rows: [["1", "프로세서 관리", "동기화와 프로세서 스케줄링"], ["2", "메모리 관리", "기억 공간 할당과 회수"], ["3", "프로세스 관리", "자원 할당·회수, 프로세스와 스레드의 스케줄링·동기화"], ["4", "주변 장치 관리", "입출력 스케줄링, 버퍼링·스풀링, 장치 접근 제어와 보안"], ["5", "파일 관리", "파일 생성·삭제·변경·유지"]] }
              ],
              memoryPoints: ["셸은 명령을 해석하고, 커널은 운영체제의 핵심 기능을 수행한다.", "사용자 모드에서 하드웨어가 필요하면 시스템 호출을 거친다.", "계층 순서: 프로세서 → 메모리 → 프로세스 → 주변 장치 → 파일."]
            },
            {
              id: "process-lifecycle-scheduling",
              title: "프로세스 상태와 스케줄링",
              summary: "프로세스가 생성되어 완료되기까지의 상태 변화와 선점·비선점 스케줄링을 구분합니다.",
              sourcePdfPages: [22, 23, 24, 25],
              keywords: ["프로세스", "PCB", "문맥 교환", "선점", "비선점", "스케줄링"],
              questionKeywords: ["프로세스 상태", "프로세스 스케줄링", "스케줄링 기법", "SJF", "SRT", "HRN", "FCFS", "라운드 로빈", "Round Robin", "다단계 큐", "MLQ", "MFQ"],
              blocks: [
                { type: "text", title: "프로세스와 PCB", paragraphs: ["프로세스는 운영체제로부터 자원을 할당받아 실행하는 작업의 단위다. 프로세스가 생성되면 운영체제가 관리 정보를 담는 프로세스 제어 블록(PCB)을 만든다.", "문맥 교환은 현재 실행 중인 프로세스의 상태를 PCB에 저장하고, 다음 프로세스의 PCB에서 상태를 복원하는 작업이다."] },
                { type: "diagram", title: "프로세스 상태 흐름", nodes: [{ label: "생성", detail: "프로세스 생성" }, { label: "준비", detail: "CPU 할당 대기" }, { label: "실행", detail: "CPU 사용" }, { label: "대기", detail: "I/O 완료 대기" }, { label: "완료", detail: "수행 종료" }], caption: "준비→실행은 디스패치, 실행→준비는 할당 시간 초과, 실행→대기는 입출력 발생, 대기→준비는 깨움으로 전이한다." },
                { type: "table", title: "상태 전이", columns: ["전이", "방향", "의미"], rows: [["디스패치", "준비 → 실행", "실행할 프로세스를 선정하고 CPU를 할당"], ["할당 시간 초과", "실행 → 준비", "타임 슬라이스 만료 또는 선점으로 CPU를 반납"], ["입출력 발생", "실행 → 대기", "즉시 끝낼 수 없는 시스템 호출이나 I/O 때문에 대기"], ["깨움", "대기 → 준비", "I/O가 끝나 다시 CPU를 받을 수 있는 상태가 됨"]] },
                { type: "table", title: "스케줄링 알고리즘 비교", columns: ["구분", "알고리즘", "핵심"], rows: [["선점", "SRT", "남은 처리 시간이 더 짧은 프로세스가 생기면 현재 작업을 선점"], ["선점", "MLQ", "여러 큐를 사용하며 상위 단계 작업이 하위 단계 작업을 선점"], ["선점", "MFQ", "큐마다 다른 시간 할당량을 두고 미완료 작업을 하위 단계로 이동"], ["선점", "RR", "같은 시간 할당량을 주고 미완료 프로세스를 준비 큐 뒤로 이동"], ["비선점", "HRN", "(대기 시간 + 서비스 시간) / 서비스 시간 값이 큰 순서"], ["비선점", "FCFS", "준비 큐에 도착한 순서"], ["비선점", "SJF", "실행 시간 추정치가 가장 작은 작업부터 처리"]] }
              ],
              memoryPoints: ["상태 순서의 뼈대는 생성 → 준비 → 실행 → 완료이고, I/O가 생기면 실행 → 대기 → 준비로 돌아온다.", "선점형: SRT·MLQ·MFQ·RR, 비선점형: HRN·FCFS·SJF.", "SJF의 기아 현상은 오래 기다린 프로세스의 우선순위를 높이는 에이징으로 완화한다."]
            },
            {
              id: "concurrency-deadlock",
              title: "병행 처리, 동기화와 교착상태",
              summary: "공유 자원의 경쟁을 제어하는 상호배제 기법과 교착상태의 조건·대응을 연결합니다.",
              sourcePdfPages: [25, 26, 27, 28],
              keywords: ["병행 프로세스", "임계 구역", "뮤텍스", "세마포어", "교착상태"],
              questionKeywords: ["세마포어", "뮤텍스", "상호배제", "임계 구역", "임계구역", "레이스 컨디션", "교착상태", "데드락", "인터럽트"],
              blocks: [
                { type: "text", title: "공유 자원을 안전하게 쓰는 법", paragraphs: ["병행 프로세스는 둘 이상의 프로세스가 함께 존재하며 실행되는 상태다. 공유 자원의 접근 순서에 따라 원하지 않는 결과가 생기는 레이스 컨디션을 막으려면 임계 구역과 상호배제가 필요하다.", "임계 구역은 한 시점에 하나의 프로세스만 공유 자원을 사용할 수 있도록 정한 영역이다. 뮤텍스는 다른 프로세스의 동시 사용을 막는 상호배제 제어다."] },
                { type: "table", title: "상호배제 기법", columns: ["기법", "핵심"], rows: [["데커", "두 프로세스의 상호배제를 보장하며 flag와 turn으로 진입을 결정"], ["피터슨", "두 프로세스가 상대에게 진입 기회를 양보"], ["램포트의 빵집", "각 프로세스에 번호를 주고 번호 순서대로 자원을 사용"], ["세마포어", "P와 V 연산으로 동기화하고 상호배제를 보장"], ["모니터", "공유 데이터와 이를 처리하는 프로시저로 구성하며 Wait·Signal을 사용"]] },
                { type: "code", title: "세마포어 P/V 연산", language: "text", code: "P(S)\nwhile S = 0 do wait\nS := S - 1\n// 임계 구역 실행\n\nV(S)\nS := S + 1", caption: "P는 사용 가능한 자원을 하나 확보하고, V는 임계 구역을 마친 뒤 자원을 반환한다. 세마포어 연산은 도중에 인터럽트되면 안 된다." },
                { type: "table", title: "교착상태 발생 조건", columns: ["조건", "의미"], rows: [["상호배제", "자원을 배타적으로 점유"], ["점유와 대기", "자원을 가진 채 다른 자원을 기다림"], ["비선점", "점유한 프로세스만 자원을 해제할 수 있음"], ["환형 대기", "둘 이상의 프로세스가 원형으로 자원을 기다림"]] },
                { type: "table", title: "교착상태 대응", columns: ["방법", "핵심", "대표 기법"], rows: [["예방", "발생 조건 자체를 막음", "점유·대기, 비선점, 환형 대기 조건 방지"], ["회피", "안전 상태일 때만 자원을 할당", "은행원 알고리즘"], ["발견", "상태를 감시해 교착상태를 검사", "자원 할당 그래프"], ["복구", "교착상태가 사라질 때까지 제거", "프로세스 종료, 자원 선점"]] }
              ],
              memoryPoints: ["교착상태 조건: 상호배제·점유와 대기·비선점·환형 대기.", "해결 흐름: 예방·회피·발견·복구.", "은행원 알고리즘은 교착상태 회피 기법이다."]
            },
            {
              id: "disk-thread-file",
              title: "디스크, 스레드와 파일 디스크립터",
              summary: "디스크 헤드 이동 알고리즘, 프로세스 안의 실행 단위, 파일 관리 정보를 정리합니다.",
              sourcePdfPages: [28, 29, 30],
              keywords: ["디스크 스케줄링", "스레드", "파일 디스크립터"],
              questionKeywords: ["디스크 스케줄링", "SSTF", "C-SCAN", "N-STEP SCAN", "LOOK", "파일 디스크립터", "파일 서술자", "File Descriptor", "스레드"],
              blocks: [
                { type: "table", title: "디스크 스케줄링", columns: ["알고리즘", "처리 방식"], rows: [["FCFS", "디스크 대기 큐에 먼저 들어온 요청부터 처리"], ["SSTF", "현재 헤드에서 탐색 거리가 가장 짧은 요청부터 처리"], ["SCAN", "진행 방향의 끝까지 처리한 뒤 반대 방향으로 이동"], ["C-SCAN", "한 방향으로 끝까지 이동한 뒤 반대쪽 끝에서 같은 방향으로 다시 처리"], ["LOOK", "진행 방향의 마지막 요청까지만 간 뒤 방향을 바꿈"], ["N-STEP SCAN", "진행 시작 시점의 요청 묶음만 처리하고 도중 요청은 다음 진행에서 처리"]] },
                { type: "text", title: "스레드", paragraphs: ["스레드는 프로세스보다 가볍고 독립적으로 수행되는 순차적인 제어 흐름이자 실행 단위다. 한 프로세스는 여러 스레드를 가질 수 있다.", "스레드는 커널이 생성·스케줄링하는 커널 수준 스레드와, 사용자 영역의 라이브러리로 구현하는 사용자 수준 스레드로 나뉜다."] },
                { type: "table", title: "파일 디스크립터가 보관하는 정보", columns: ["정보", "내용"], rows: [["이름", "파일 이름과 크기"], ["위치", "보조기억장치에서의 파일 위치"], ["유형", "텍스트·이진·기계어·실행 파일 등"], ["시간", "생성·제거·최종 수정 날짜와 시간"], ["액세스", "접근 제어 정보와 사용 횟수"]] }
              ],
              memoryPoints: ["SCAN은 끝까지, LOOK은 마지막 요청까지만 이동한다.", "스레드는 프로세스에서 실행 제어만 분리한 단위다.", "파일 디스크립터는 파일 시스템이 관리하므로 사용자가 직접 참조할 수 없다."]
            },
            {
              id: "memory-management",
              title: "주기억장치 관리",
              summary: "배치·할당·교체의 세 질문으로 메모리 관리 기법을 구분합니다.",
              sourcePdfPages: [30, 31, 32],
              keywords: ["First Fit", "Paging", "Segmentation", "가상기억장치", "LRU"],
              questionKeywords: ["기억장치의 메모리", "주기억장치", "가상메모리", "가상 메모리", "최초 적합", "최상 적합", "최악 적합", "First Fit", "Best Fit", "Worst Fit", "페이징", "세그먼테이션", "DAT", "연관사상", "연관 사상", "페이지 교체", "LFU", "LRU", "OPT"],
              blocks: [
                { type: "table", title: "주기억장치 배치", columns: ["기법", "선택 기준"], rows: [["최초 적합", "들어갈 수 있는 첫 번째 가용 공간"], ["최상 적합", "프로세스 크기와 가장 비슷한 가용 공간"], ["최악 적합", "가장 큰 가용 공간"]] },
                { type: "table", title: "연속 할당과 분산 할당", columns: ["구분", "기법", "특징"], rows: [["연속 할당", "연속된 메모리 공간", "물리 메모리보다 큰 프로세스를 그대로 실행하기 어려움"], ["분산 할당", "페이징", "같은 크기의 페이지와 프레임을 사용"], ["분산 할당", "세그먼테이션", "가변 크기의 논리적 블록으로 나눠 할당"]] },
                { type: "table", title: "페이징 주소 변환 속도", columns: ["방식", "매핑 테이블 위치", "속도"], rows: [["연관 사상", "연관 기억장치에 전체 테이블", "가장 빠름"], ["직접/연관 사상", "최근 항목은 연관 기억장치, 나머지는 주기억장치", "중간"], ["직접 사상", "큰 매핑 테이블을 주기억장치에 유지", "가장 느림"]] },
                { type: "table", title: "페이지 교체", columns: ["기법", "교체 대상"], rows: [["FIFO", "가장 먼저 들어온 페이지"], ["LFU", "사용 빈도가 가장 낮은 페이지"], ["LRU", "가장 오래 사용되지 않은 페이지"], ["OPT", "미래에 사용되지 않을 페이지"]] }
              ],
              memoryPoints: ["배치는 어디에 넣을지, 할당은 어떻게 나눌지, 교체는 무엇을 뺄지 결정한다.", "연관 사상 → 직접/연관 사상 → 직접 사상 순으로 DAT가 빠르다.", "FIFO는 먼저 들어온 것, LFU는 가장 적게 쓴 것, LRU는 가장 오래 안 쓴 것을 교체한다."]
            },
            {
              id: "access-control-secure-os",
              title: "운영체제 접근 통제와 보안 운영체제",
              summary: "접근 요청을 참조 모니터가 판단하고 감사 로그로 남기는 보안 운영체제 구조를 이해합니다.",
              sourcePdfPages: [33, 34, 35],
              keywords: ["접근 통제", "SSH", "보안 커널", "참조 모니터", "감사 로그"],
              questionKeywords: ["운영체제의 접근제어", "운영체제의 접근 제어", "보안 운영체제", "보안운영체제", "참조 모니터", "참조모니터", "보안 커널", "감사 로그", "텔넷", "SSH"],
              blocks: [
                { type: "text", title: "운영체제 접근 통제", paragraphs: ["운영체제의 접근 통제는 파일·디렉터리·메모리·입출력 장치 같은 시스템 자원에 대해 지정된 사용자의 접근을 허용할지 거부할지 결정하는 보안 메커니즘이다.", "터미널 서비스의 암호화 수준을 확인하고, 목적별 접근 제어 정책과 IP 통제를 적용한다. 암호화되지 않은 텔넷 대신 암호화 통신을 제공하는 SSH를 사용한다."] },
                { type: "table", title: "보안 운영체제의 기능", columns: ["기능", "역할"], rows: [["식별 및 인증", "사용자를 구분·인증하고 로그인과 비정상 접근을 관리"], ["접근 통제", "정당한 사용자에게 권한을 주고 그 밖의 접근은 거부"], ["능동적 침입 방지", "바이러스·웜, 관리자 권한 획득, 비인가 작업을 탐지·차단하고 통보"], ["시스템 보안 관리", "사용자·그룹 계정, 감사 로그, 보안 정책을 관리"]] },
                { type: "diagram", title: "보안 운영체제 구조", nodes: [{ label: "정보 주체", detail: "접근 요청" }, { label: "참조 모니터", detail: "모든 요청 감시·판단" }, { label: "정보 객체", detail: "허용 또는 차단" }, { label: "감사 로그", detail: "시간·사용자·객체·접근 기록" }], caption: "참조 모니터는 보안 커널 안에서 접근 통제를 수행하고 다른 보안 메커니즘과 정보를 교환한다." },
                { type: "table", title: "핵심 구조", columns: ["구조", "설명"], rows: [["보안 커널", "기존 운영체제 안에 이식되어 사용자의 모든 접근을 통제하는 소프트웨어"], ["참조 모니터", "주체가 객체에 접근하려는 모든 요청을 감시하고 접근 통제를 수행"], ["감사 로그", "시간·사용자·객체에 대한 모든 액세스 형태를 기록한 파일"]] }
              ],
              memoryPoints: ["주체는 접근을 요청하는 능동적 개체, 객체는 접근 대상인 수동적 개체다.", "보안 운영체제의 구조는 보안 커널·참조 모니터·감사 로그다.", "텔넷은 암호화되지 않으므로 원격 터미널에는 SSH를 활용한다."]
            }
          ]
        },
        {
          id: "windows",
          title: "윈도우",
          chapter: "정보 시스템",
          summary: "윈도우 구조와 부팅, 계정·인증, 공유·레지스트리 및 파일시스템 보안을 학습합니다.",
          status: "published",
          sourcePdfPages: Array.from({ length: 19 }, (_, index) => index + 46),
          concepts: [
            {
              id: "windows-architecture-boot",
              title: "윈도우 구조와 부팅",
              summary: "윈도우의 호환 계층과 관리 구성요소, 부팅 흐름을 구분합니다.",
              sourcePdfPages: [46, 48, 49, 50],
              keywords: ["Win32", "POSIX", "NTVDM", "HAL", "Windows Boot Manager", "BCD", "ntoskrnl.exe"],
              questionKeywords: ["윈도우 부팅 순서", "Windows 부팅 순서", "NTVDM", "Win32", "ntoskrnl.exe", "BCD", "HAL"],
              blocks: [
                { type: "text", title: "호환성과 하드웨어 추상화", paragraphs: ["Win32는 윈도우의 기본 응용 프로그램 인터페이스이고, POSIX 하위 시스템은 POSIX 호환 프로그램 실행 환경을 제공한다. NTVDM은 이전 16비트·DOS 계열 프로그램의 호환 실행을 지원한다.", "윈도우는 프로세스·메모리·입출력·보안 관리자를 통해 운영체제 자원을 관리한다. 마이크로커널은 핵심 기능을 수행하며, HAL(Hardware Abstraction Layer)은 운영체제 커널과 하드웨어 사이의 차이를 추상화한다."] },
                { type: "diagram", title: "윈도우 부팅 흐름", nodes: [{ label: "POST", detail: "전원 인가 후 하드웨어 자체 검사" }, { label: "CMOS 설정", detail: "부팅 장치와 순서 확인" }, { label: "MBR", detail: "부팅 가능한 파티션의 부트 코드 실행" }, { label: "Windows Boot Manager", detail: "bootmgr가 BCD 설정을 읽음" }, { label: "커널 초기화", detail: "ntoskrnl.exe와 시스템 드라이버 로드" }], caption: "펌웨어의 부팅 설정에서 시작하여 부트 관리자와 커널 순으로 제어가 넘어간다." },
                { type: "bullets", title: "시험 포인트", items: ["BIOS 기반 시스템에서 MBR은 첫 번째 부팅 디스크의 부팅 코드를 포함한다. 교재는 MBR 크기를 512바이트로 설명한다.", "Windows Boot Manager는 bootmgr이며, 부팅 구성은 BCD(Boot Configuration Data)에 저장된다.", "POST는 전원 인가 후 하드웨어를 점검하는 단계이고, CMOS 설정은 부팅 장치 선택에 영향을 준다."] }
              ],
              memoryPoints: ["HAL은 하드웨어 차이를 추상화하고, NTVDM은 구형 프로그램 호환 계층이다.", "부팅 흐름은 POST → CMOS 부팅 설정 → MBR → bootmgr/BCD → 커널·시스템 드라이버 순서로 기억한다."]
            },
            {
              id: "windows-accounts-authentication",
              title: "윈도우 계정과 인증",
              summary: "기본 계정·그룹, SID와 RID, UAC 및 NTLM 기반 인증 흐름을 정리합니다.",
              sourcePdfPages: [50, 51, 52, 53, 54],
              keywords: ["SID", "RID", "UAC", "NTLM", "SAM", "SRM", "Winlogon", "LSA", "Administrator"],
              questionKeywords: ["SID", "RID", "UAC", "NTLM", "SAM", "SRM", "윈도우 인증", "Windows 인증", "Challenge-Response"],
              blocks: [
                { type: "table", title: "기본 로컬 계정과 보안 식별자", columns: ["항목", "핵심 내용"], rows: [["기본 계정", "Administrator, System, DefaultAccount, Guest 등이 기본 계정으로 다뤄진다. 불필요하거나 미사용인 계정은 비활성화한다."], ["SID", "계정과 보안 주체를 식별하는 고유 보안 식별자. 계정 이름이 바뀌어도 SID는 식별 기준으로 사용된다."], ["RID", "SID의 마지막 상대 식별자 부분. 교재 기준 Administrator는 500, Guest는 501, 일반 사용자 계정은 1000 이상이다."], ["그룹", "Administrators, Backup Operators, Guests, Users 등 그룹별 권한을 최소화하고 필요한 사용자만 배치한다."]] },
                { type: "text", title: "UAC와 인증 구성요소", paragraphs: ["UAC(User Account Control)는 관리자 권한이 필요한 작업에서 동의 또는 자격 증명 확인을 요구해 권한 상승을 통제한다. 알림 수준이 낮을수록 사용자 확인이 줄어드므로 조직 보안정책에 맞춰 설정한다.", "로그온 과정에는 Winlogon과 인증 공급자(교재의 구형 환경 설명에는 GINA), LSA(Local Security Authority), SAM(Security Account Manager), SRM(Security Reference Monitor)이 관여한다. SAM의 계정 정보 확인과 SRM의 보안 참조·권한 검사가 구분된다."] },
                { type: "diagram", title: "NTLM Challenge-Response 개요", nodes: [{ label: "클라이언트", detail: "사용자 자격 증명으로 응답 계산" }, { label: "서버", detail: "임의 challenge 전달" }, { label: "인증기관", detail: "저장된 계정 검증정보로 응답 확인" }], caption: "비밀번호 자체를 네트워크로 직접 전송하지 않고 challenge에 대한 응답을 검증한다. 응답 계산에 사용되는 비밀번호 해시의 안전한 관리가 중요하다." },
                { type: "bullets", title: "운영 보안 원칙", items: ["관리자 계정의 사용을 제한하고, 일상 업무에는 일반 권한 계정을 사용한다.", "기본 제공 계정과 그룹의 권한을 점검하고, 불필요한 계정·그룹 구성원은 제거한다.", "UAC와 감사 정책을 활성화해 권한 상승과 계정 사용 이력을 확인할 수 있게 한다."] }
              ],
              memoryPoints: ["SID는 보안 주체 식별자이고 RID는 SID의 상대 식별자 부분이다.", "NTLM은 challenge-response 방식이며, SAM의 계정 검증과 SRM의 자원 접근 판단을 혼동하지 않는다.", "관리자 권한은 최소화하고 UAC를 통해 권한 상승을 통제한다."]
            },
            {
              id: "windows-shares-registry-policy",
              title: "공유·레지스트리·보안 정책",
              summary: "네트워크 공유와 숨김 공유, 레지스트리 자동 실행 위치, 로컬 보안 정책을 다룹니다.",
              sourcePdfPages: [47, 54, 55, 57, 58, 59, 60],
              keywords: ["net use", "net share", "IPC$", "ADMIN$", "Null Session", "RunOnce", "레지스트리", "secpol.msc"],
              questionKeywords: ["IPC$", "ADMIN$", "C$", "Null Session", "net share", "net use", "RunOnce", "ShutdownWithoutLogon", "Winlogon", "레지스트리 자동 실행", "secpol.msc"],
              blocks: [
                { type: "code", title: "공유 확인·해제", language: "text", code: "net share\nnet share C$ /delete\nnet use Z: \\\\서버주소\\공유이름 /user:계정" },
                { type: "table", title: "관리 공유와 위험", columns: ["공유", "의미·주의점"], rows: [["C$, D$ 등", "각 드라이브의 루트에 대한 기본 관리 공유. 이름 끝의 $는 네트워크 탐색 목록에서 숨기는 용도이지 접근 통제가 아니다."], ["ADMIN$", "Windows 설치 디렉터리에 대한 관리 공유."], ["IPC$", "프로세스 간 통신 및 원격 관리에 쓰이는 특수 공유."], ["Null Session", "인증되지 않은 익명 세션을 통한 정보 노출 위험. 익명 열거와 불필요한 공유 접근을 제한한다."]] },
                { type: "text", title: "기본 공유 비활성화", paragraphs: ["현재 세션의 C$ 공유는 `net share C$ /delete`로 제거할 수 있다. 교재는 영구 비활성화를 위해 `HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\LanmanServer\\Parameters` 아래 DWORD 값 `AutoShareWks=0`(워크스테이션) 또는 `AutoShareServer=0`(서버)을 제시한다. 레지스트리 변경은 백업과 변경 영향 검토 후 적용한다."] },
                { type: "table", title: "레지스트리 하이브와 자동 실행", columns: ["위치", "주요 범위"], rows: [["HKLM\\HARDWARE", "현재 하드웨어 구성 정보"], ["HKLM\\SAM", "로컬 계정·그룹 데이터베이스"], ["HKLM\\SECURITY", "보안 정책 및 보안 관련 정보"], ["HKLM\\SOFTWARE", "컴퓨터에 설치된 소프트웨어 설정"], ["HKLM\\SYSTEM", "시스템 시작·서비스·드라이버 설정"], ["HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run / RunOnce", "현재 사용자 로그온 시 실행되는 항목 / 1회 실행 항목"], ["HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run / RunOnce", "컴퓨터 전체 범위의 로그온 자동 실행 / 1회 실행 항목"]] },
                { type: "bullets", title: "로컬 보안 정책 점검", items: ["`secpol.msc`의 계정 정책에서 암호 길이·복잡성·최대 사용 기간·잠금 정책을 조직 기준에 맞춘다.", "감사 정책에서 로그온, 계정 관리, 정책 변경 등 필요한 이벤트 기록을 활성화한다.", "익명 계정의 SAM·공유 열거를 제한하고, 원격 종료·이동식 매체 사용 등 특권 작업을 최소 인원으로 제한한다."] }
              ],
              memoryPoints: ["공유 이름 뒤 `$`는 숨김 표시일 뿐 인증·권한 통제를 대신하지 않는다.", "Run은 로그온 때 반복 실행, RunOnce는 한 번 실행하는 자동 실행 레지스트리 위치다.", "기본 공유·익명 세션은 필요성을 확인하고 최소화한다."]
            },
            {
              id: "windows-filesystems-encryption",
              title: "파일시스템·암호화·파일 식별",
              summary: "FAT와 NTFS, EFS와 BitLocker, 파일 시그니처와 파일시스템 터널링을 비교합니다.",
              sourcePdfPages: [56, 61, 62, 63, 64],
              keywords: ["FAT16", "FAT32", "exFAT", "NTFS", "EFS", "BitLocker", "MFT", "55 AA", "파일시스템 터널링"],
              questionKeywords: ["FAT16", "FAT32", "exFAT", "NTFS", "EFS", "BitLocker", "MFT", "파일 시그니처", "55 AA", "Process Doppelgänging"],
              blocks: [
                { type: "table", title: "윈도우 파일시스템 비교", columns: ["파일시스템", "특징"], rows: [["FAT16", "16비트 파일 할당 테이블. 교재 표는 최대 볼륨 크기를 2GB로 제시한다."], ["FAT32", "32비트 파일 할당 테이블. 교재 표는 최대 볼륨 크기를 2TB로 제시한다."], ["exFAT", "플래시 메모리와 이동식 저장장치에 적합하도록 설계된 FAT 계열 파일시스템."], ["NTFS", "권한, 저널링, 압축·암호화 등의 기능을 지원하며 MFT를 중심으로 파일 메타데이터를 관리한다."]] },
                { type: "text", title: "NTFS와 암호화 범위", paragraphs: ["NTFS 볼륨은 부트 영역과 VBR, 파일 메타데이터를 관리하는 MFT, 시스템 파일, 파일 데이터 영역 등으로 구성된다. MFT(Master File Table)는 파일과 디렉터리의 메타데이터 레코드를 관리한다.", "EFS(Encrypting File System)는 NTFS 파일·폴더 단위 암호화다. BitLocker는 볼륨 단위 암호화를 제공하며, 교재는 부팅에 필요한 시스템 파티션을 별도로 두는 구성을 설명한다. 두 기능은 적용 단위와 복구·키 관리 방식이 다르다."] },
                { type: "table", title: "파일 시그니처 예", columns: ["형식", "시작 바이트(16진수)", "표기"], rows: [["실행 파일(PE)", "4D 5A", "MZ"], ["ZIP", "50 4B 03 04", "PK.."], ["셸 스크립트", "23 21", "#!"], ["PDF", "25 50 44 46 2D", "%PDF-"], ["ELF", "7F 45 4C 46", "ELF 매직 바이트"]] },
                { type: "bullets", title: "파일시스템 보안 포인트", items: ["MBR의 부트 시그니처는 마지막 두 바이트 `55 AA`로 식별한다.", "파일시스템 터널링은 FAT·NTFS에서 파일 삭제 후 짧은 시간(교재 기준 15초) 안에 동일 이름 파일이 생성될 때 이전 메타데이터가 재사용될 수 있는 동작이다.", "Process Doppelgänging은 트랜잭션 NTFS(TxF)와 메모리 매핑을 악용해 디스크의 파일 상태와 실행 이미지가 다르게 보이게 하는 기법으로 소개된다.", "확장자만으로 파일 형식을 판단하지 말고 매직 바이트와 실제 내용도 확인한다."] }
              ],
              memoryPoints: ["EFS는 파일·폴더 단위, BitLocker는 볼륨 단위 암호화다.", "NTFS의 중심 메타데이터 구조는 MFT이며, 파일 시그니처는 확장자와 별도로 형식을 확인하는 단서다.", "MBR 종료 표식 `55 AA`와 FAT·NTFS 파일시스템 터널링의 교재 기준 15초를 기억한다."]
            }
          ]
        },
        {
          id: "unix-linux",
          title: "유닉스/리눅스",
          chapter: "정보 시스템",
          summary: "유닉스·리눅스의 운영, 파일시스템 조사, 계정 인증과 접근통제를 학습합니다.",
          status: "published",
          sourcePdfPages: Array.from({ length: 41 }, (_, index) => index + 85),
          concepts: [
            {
              id: "unix-linux-foundations",
              title: "유닉스·리눅스 구조와 운영",
              summary: "운영체제 구성과 셸, Solaris BSM, 런레벨 및 cron 작업을 정리합니다.",
              sourcePdfPages: [85, 86, 87, 88, 89, 90],
              keywords: ["Unix", "Linux", "커널", "셸", "bash", "BSM", "런레벨", "cron", "crontab"],
              questionKeywords: ["유닉스·리눅스 운영체제 특징", "유닉스/리눅스", "BSM", "런레벨", "init 런레벨", "cron", "crontab"],
              blocks: [
                { type: "text", title: "구성요소와 셸", paragraphs: ["유닉스 계열 운영체제는 커널, 셸, 파일시스템으로 구성된다. 셸은 사용자가 입력한 명령을 해석해 운영체제 기능을 호출하는 명령어 해석기다. 교재는 Bourne(sh), C(csh), Korn(ksh), Bourne Again(bash) 셸을 비교하고 리눅스의 기본 셸로 bash를 소개한다.", "유닉스·리눅스는 대화식·다중작업·다중사용자 운영과 계층형 파일시스템을 지원한다. Solaris의 BSM(Basic Security Module)은 커널 기반 보안 감사·로깅 기능이며, 시스템 자원 사용을 고려해 보안 요구에 따라 활성화한다."] },
                { type: "table", title: "init 런레벨(교재 기준)", columns: ["레벨", "상태"], rows: [["0", "시스템 중지(Halt)"], ["1", "단일 사용자 모드: 점검·복구"], ["2", "NFS를 지원하지 않는 다중 사용자 모드"], ["3", "네트워크를 지원하는 다중 사용자 모드"], ["4", "미사용"], ["5", "X11을 사용하는 다중 사용자 모드"], ["6", "재부팅"]] },
                { type: "text", title: "예약 작업", paragraphs: ["cron 데몬은 정해진 시간에 명령이나 스크립트를 실행한다. `/etc/crontab`의 필드 순서는 분·시·일·월·요일·명령이며, 교재는 `/var/log/cron` 실행 기록과 `/etc/cron.allow` 허용 사용자 설정을 소개한다. 사용자별 작업은 `crontab`으로 편집·조회·삭제한다.", "필드 범위는 분 0–59, 시 0–23, 일 1–31, 월 1–12 또는 JAN–DEC, 요일 0–6 또는 SUN–SAT다. 교재 표에 나온 특수문자는 쉼표(값 지정), 하이픈(범위), 별표(모든 값), 슬래시(간격), 물음표(특정 값 없음), L(마지막 값), W(가장 가까운 평일)이다."] },
                { type: "code", title: "crontab과 동기화 예", language: "text", code: "# 매분 실행\n* * * * * /usr/a.sh\n\n# 교재 예: 매년 1월 1일 00:00\n0 0 1 1 ? /usr/a.sh\n\n# 종료 전 파일시스템 버퍼 동기화\nsync" }
              ],
              memoryPoints: ["셸은 명령어 해석기이며 bash는 리눅스에서 널리 쓰이는 셸이다.", "런레벨 0=중지, 1=단일 사용자, 3=다중 사용자, 5=X11, 6=재부팅이다.", "cron은 분→시→일→월→요일→명령 순서다. 교재에 제시된 확장 기호는 문제의 환경을 확인해 해석한다."]
            },
            {
              id: "unix-linux-filesystem-forensics",
              title: "파일시스템 구조와 조사 명령",
              summary: "부트 블록·슈퍼블록·i-node·데이터 블록과 시스템 조사 명령을 연결합니다.",
              sourcePdfPages: [92, 93, 94, 95, 96, 97, 98, 99, 100],
              keywords: ["i-node", "inode", "슈퍼블록", "mount", "umount", "lsof", "find", "좀비 프로세스", "ASLR"],
              questionKeywords: ["i-node", "inode", "슈퍼블록", "파일시스템 구조", "mount", "umount", "lsof", "find /", "nouser", "nogroup", "좀비 프로세스", "defunct", "randomize_va_space"],
              blocks: [
                { type: "table", title: "파일시스템 구성", columns: ["구성", "역할"], rows: [["부트 블록", "부팅에 필요한 코드를 저장한다."], ["슈퍼블록", "전체 파일시스템의 블록·i-node 수와 사용 가능량 등 상태 정보를 관리한다."], ["i-node", "파일·디렉터리 유형, 권한, 링크 수, UID/GID, 크기·시각 정보를 관리하고 데이터 블록을 가리킨다."], ["데이터 블록", "파일의 실제 내용을 저장한다."]] },
                { type: "text", title: "i-node와 파일 시각", paragraphs: ["i-node에는 직접 블록과 단일·이중·삼중 간접 블록 포인터가 있다. 교재 도식은 직접 블록 12개와 간접 블록을 이용한 확장 구조를 제시한다. mtime은 파일 내용 변경 시각, atime은 접근 시각, ctime은 i-node 속성 변경 시각이다.", "주요 디렉터리: `/bin` 기본 명령, `/boot` 부팅 파일, `/dev` 장치 파일, `/etc` 설정, `/home` 일반 사용자 홈, `/proc` 프로세스·커널 정보, `/root` root 홈, `/tmp` 임시 자료, `/var` 가변 데이터·로그, `/srv` 서비스 데이터다. 교재는 ASLR 상태를 `/proc/sys/kernel/randomize_va_space`에서 확인하며 0=비활성, 1=일부 영역, 2=주소 공간 무작위화로 구분한다."] },
                { type: "code", title: "마운트·파일·프로세스 조사", language: "bash", code: "mount /dev/cdrom /media/cdrom\numount /media/cdrom\n\nlsof -u 계정명\nlsof -i TCP\n\nfind / -nouser -print\nfind / -nogroup -print\n\ntop | grep zombie\nps -ef | grep defunct" },
                { type: "bullets", title: "조사 명령의 용도", items: ["`mount`는 장치·파일시스템을 디렉터리에 연결하고 `umount`는 해제한다. 불필요한 외부 장치 연결은 악성 파일 유입이나 정보 유출 위험을 높일 수 있다.", "`lsof`는 열린 파일과 이를 사용하는 프로세스를, `find`는 경로·소유자·유형 등의 조건에 맞는 파일을 찾는다.", "좀비 프로세스는 실행 종료 후 부모가 종료 상태를 회수하지 않아 프로세스 테이블에 남은 항목이다. `top`의 zombie 수나 `ps`의 `<defunct>`로 확인한다."] }
              ],
              memoryPoints: ["슈퍼블록은 파일시스템 전체, i-node는 개별 파일 메타데이터, 데이터 블록은 파일 내용을 관리한다.", "mtime=내용 수정, atime=접근, ctime=i-node 속성 변경 시각이다.", "소유자 없는 파일은 `find / -nouser`, 좀비 흔적은 `ps`의 `<defunct>`로 조사한다."]
            },
            {
              id: "unix-linux-account-authentication",
              title: "계정 파일·인증과 PAM",
              summary: "/etc/passwd와 /etc/shadow의 필드, sudoers 및 PAM 인증 구조를 정리합니다.",
              sourcePdfPages: [91, 101, 102, 103, 104, 105, 106],
              keywords: ["/etc/passwd", "/etc/shadow", "/etc/sudoers", "PAM", "UID", "GID", "no_magic_root", "login.defs"],
              questionKeywords: ["/etc/passwd", "passwd 파일", "/etc/shadow", "shadow 파일", "sudoers", "/etc/sudoers", "PAM", "Pluggable Authentication Modules", "no_magic_root", "login.defs", "passwd -x"],
              blocks: [
                { type: "table", title: "/etc/passwd 필드 순서", columns: ["순서", "항목", "설명"], rows: [["1", "계정명", "로그인 이름"], ["2", "패스워드 표시", "`x`이면 암호화된 패스워드가 `/etc/shadow`에 저장됨"], ["3", "UID", "사용자 식별자. root는 0"], ["4", "GID", "기본 그룹 식별자. root는 0"], ["5", "설명", "사용자 관련 정보"], ["6", "홈 디렉터리", "로그인 후 사용할 홈 경로"], ["7", "로그인 셸", "예: `/bin/bash`, `/sbin/nologin`, `/bin/false`"]] },
                { type: "table", title: "/etc/shadow 주요 정보", columns: ["정보", "설명"], rows: [["암호 해시", "교재 예: `$1` MD5, `$2a` Blowfish, `$2y` Eksblowfish, `$5` SHA-256, `$6` SHA-512"], ["Salt", "해시에 추가하는 임의 값"], ["변경·사용 기간", "마지막 변경일, 최소·최대 사용일"], ["만료 정보", "경고 기간, 비활성 일수, 계정 만료일"]] },
                { type: "text", title: "계정 관리와 PAM", paragraphs: ["`/etc/login.defs`는 새 계정의 UID/GID 범위, 암호 사용 기간, 기본 umask 등 정책 기본값을 정의한다. `useradd`는 계정을 만들고 `usermod`는 UID·그룹·홈 경로·로그인 셸 등을 변경한다. 기존 보조 그룹에 추가할 때는 `usermod -aG`를 사용한다.", "PAM(Pluggable Authentication Modules)은 응용 프로그램 재컴파일 없이 인증 정책을 모듈로 연결한다. 보통 `/etc/pam.d/서비스명`에 설정하며 각 행은 `type control module_path module_arguments` 구조다. `auth`, `account`, `password`, `session`은 인증, 계정 유효성, 암호 변경, 세션 관리를 맡는다."] },
                { type: "table", title: "PAM control 값", columns: ["값", "처리 개념"], rows: [["requisite", "실패하면 즉시 거부하고 뒤 모듈을 실행하지 않는다."], ["required", "실패해도 다음 모듈을 실행한 뒤 최종 실패 처리한다."], ["sufficient", "성공하고 앞선 required 실패가 없으면 허용하고 이후 모듈을 생략할 수 있다."], ["optional", "다른 주요 모듈이 없을 때 결과에 영향을 준다."], ["include", "다른 PAM 설정 파일의 규칙을 포함한다."]] },
                { type: "code", title: "계정 점검 예", language: "bash", code: "ls -l /etc/passwd /etc/shadow\nusermod -aG 보조그룹 계정명\npasswd -x 60 계정명" }
              ],
              memoryPoints: ["passwd 순서는 계정명:암호 표시:UID:GID:설명:홈:셸이며, `x`는 shadow 참조를 뜻한다.", "PAM의 네 type은 auth/account/password/session이고, 설정 행은 type·control·module_path·arguments로 구성된다.", "보조 그룹 추가는 `usermod -aG`, 패스워드 최대 사용 기간 지정은 `passwd -x`다."]
            },
            {
              id: "unix-linux-access-control",
              title: "파일 권한·특수 권한과 접근통제",
              summary: "기본 권한, umask, SUID·SGID·sticky bit와 계정 보안 점검을 익힙니다.",
              sourcePdfPages: [106, 107, 108, 109, 110, 111, 112],
              keywords: ["chmod", "chown", "chgrp", "umask", "setuid", "setgid", "sticky bit", "Capability", "hosts.allow", "hosts.deny"],
              questionKeywords: ["chmod", "chown", "chgrp", "umask", "setuid", "setgid", "sticky bit", "특수 권한", "4755", "Capability", "hosts.allow", "hosts.deny", "hosts.equiv", "rsh", "rlogin"],
              blocks: [
                { type: "table", title: "기본 권한", columns: ["권한", "파일", "디렉터리"], rows: [["r (4)", "내용 읽기", "목록 보기"], ["w (2)", "내용 수정", "파일 생성·삭제"], ["x (1)", "실행", "탐색·진입"], ["대상", "소유자(u), 그룹(g), 기타(o)", "대상별로 권한 비트를 적용"]] },
                { type: "text", title: "chmod와 umask", paragraphs: ["`chmod`는 권한을 8진수 또는 기호식으로 바꾼다. 예: `chmod u+x a.sh`는 소유자에게 실행 권한을 더하고, `chmod 435 a.txt`는 소유자 r·그룹 wx·기타 rx를 설정한다. `-R`은 하위 항목까지 재귀 적용한다.", "umask는 새 파일·디렉터리에 부여하지 않을 권한 마스크다. 교재의 계산은 기본 권한과 마스크의 비트 NOT 결과를 AND한다. 기본 파일 666과 디렉터리 777에 umask 022를 적용하면 각각 644와 755다."] },
                { type: "table", title: "특수 권한", columns: ["비트", "이름", "효과"], rows: [["4", "SUID", "실행 파일이 일시적으로 파일 소유자의 유효 UID로 동작한다."], ["2", "SGID", "실행 파일이 파일 소유 그룹의 유효 GID로 동작한다. 디렉터리에 설정하면 새 항목이 그룹을 상속할 수 있다."], ["1", "sticky bit", "공유 디렉터리에서 파일 소유자가 아닌 사용자의 삭제를 제한한다."]] },
                { type: "text", title: "권한 최소화와 원격 접근", paragraphs: ["4자리 권한은 특수 비트·소유자·그룹·기타 사용자 순서다. `4755`는 SUID와 소유자 rwx, 그룹·기타 rx다. 실행 비트가 함께 있으면 `s`/`t`, 없으면 `S`/`T`로 표시된다. RUID/EUID/SUID와 RGID/EGID/SGID는 프로세스의 실제·유효·저장 식별자를 구분한다.", "Capability는 슈퍼유저의 광범위한 권한을 개별 기능 단위로 나눠 최소 권한을 부여한다. `/etc/hosts.allow`는 클라이언트 허용, `/etc/hosts.deny`는 거부 규칙에 쓰인다. `/etc/hosts.equiv`는 rsh·rlogin의 신뢰 호스트 관계를 지정하므로 악용 위험 때문에 사용을 최소화한다. 원격 root 로그인, 약한 암호 정책, 미사용 계정·셸, 불필요한 SUID/SGID 파일도 점검한다."] },
                { type: "code", title: "권한 변경 예", language: "bash", code: "chmod u+x a.sh\nchmod 4755 soojebi\nchown root a.txt\nchgrp root a.txt\numask 022" }
              ],
              memoryPoints: ["권한은 r=4, w=2, x=1이며 대상은 소유자·그룹·기타 사용자다.", "SUID=4, SGID=2, sticky=1. 4755는 SUID 실행 파일 권한 예다.", "umask 022이면 신규 파일은 644, 디렉터리는 755다.", "불필요한 SUID/SGID와 신뢰 기반 원격 접근 설정은 줄인다."]
            }
          ]
        },
        {
          id: "android",
          title: "안드로이드",
          chapter: "정보 시스템",
          summary: "안드로이드 계층·컴포넌트·권한, 저장 경로, ADB 및 앱 분석 도구를 학습합니다.",
          status: "published",
          sourcePdfPages: Array.from({ length: 9 }, (_, index) => index + 136),
          concepts: [
            {
              id: "android-architecture-components",
              title: "안드로이드 구조와 앱 컴포넌트",
              summary: "리눅스 커널 기반 계층 구조와 매니페스트·컴포넌트·시스템 권한을 이해합니다.",
              sourcePdfPages: [136, 138, 139],
              keywords: ["Android", "AndroidManifest.xml", "Activity", "Service", "Broadcast Receiver", "Content Provider", "안드로이드 권한"],
              questionKeywords: ["AndroidManifest.xml", "AndroidManifest", "Activity", "Broadcast Receiver", "Content Provider", "android:exported", "안드로이드 시스템 권한", "ACCESS_CHECKIN_PROPERTIES", "CHANGE_COMPONENT_ENABLED_STATE"],
              blocks: [
                { type: "text", title: "계층 구조", paragraphs: ["안드로이드는 리눅스 커널을 기반으로 미들웨어와 사용자 인터페이스, 핵심 애플리케이션을 포함하는 모바일 운영체제다. 교재의 계층은 애플리케이션, 애플리케이션 프레임워크, Android Runtime(ART), Android Library, Linux Kernel 순서다.", "애플리케이션 프레임워크는 앱 개발 API와 기본 구조를 제공하고, ART는 앱 실행 환경이다. 라이브러리는 시스템에서 공통으로 사용하는 기능을 제공하며 Linux Kernel은 시스템의 핵심 자원·장치를 관리한다."] },
                { type: "table", title: "앱 컴포넌트", columns: ["컴포넌트", "역할"], rows: [["Activity", "사용자에게 보이는 화면과 상호작용을 구성"], ["Service", "화면과 별개로 백그라운드의 장시간 작업을 처리"], ["Broadcast Receiver", "시스템·앱 이벤트와 알림을 수신"], ["Content Provider", "앱 사이 데이터 제공·공유를 중개"]] },
                { type: "text", title: "매니페스트와 노출 권한", paragraphs: ["`AndroidManifest.xml`은 앱의 필수 권한과 주요 컴포넌트 관계, 패키지·버전 등의 정보를 선언한다. 앱 구성요소의 `android:exported` 값이 true이면 외부 애플리케이션에서 해당 컴포넌트에 접근할 수 있으므로 필요한 경우에만 노출하고 접근 권한을 점검한다.", "교재 예의 시스템 권한은 이름과 의미를 함께 익힌다. 권한 선언은 단순한 문자열 나열이 아니라 앱이 시스템 기능·자원에 접근할 수 있는 범위를 결정한다."] },
                { type: "table", title: "교재에 나온 시스템 권한", columns: ["권한", "허용 기능"], rows: [["ACCESS_CHECKIN_PROPERTIES", "체크인 데이터베이스 속성 테이블 접근"], ["CHANGE_COMPONENT_ENABLED_STATE", "앱 컴포넌트의 활성·비활성 상태 변경"], ["LOADER_USAGE_STATS", "액세스 로그 읽기"], ["SET_PROCESS_LIMIT", "프로세스 제한 지정"]] }
              ],
              memoryPoints: ["계층 순서는 Application → Application Framework → ART → Android Library → Linux Kernel이다.", "Activity는 화면, Service는 백그라운드 작업, Broadcast Receiver는 이벤트 수신, Content Provider는 앱 간 데이터 공유 역할이다.", "AndroidManifest.xml의 exported 컴포넌트는 외부 앱 접근을 허용할 수 있으므로 최소한으로 노출한다."]
            },
            {
              id: "android-filesystem-adb",
              title: "안드로이드 저장 경로와 ADB",
              summary: "시스템·앱 디렉터리의 쓰기 특성과 ADB 기본 명령을 구분합니다.",
              sourcePdfPages: [137, 139, 140],
              keywords: ["/data/app", "/data/data", "/data/local/tmp", "/system", "ADB", "adb pull", "adb push", "adb shell", "adb reboot"],
              questionKeywords: ["/data/local/tmp", "/data/app", "/data/data", "/system", "ADB", "adb pull", "adb push", "adb shell"],
              blocks: [
                { type: "table", title: "주요 경로와 접근 특성", columns: ["경로", "용도·주의점"], rows: [["/data/app", "설치된 앱 패키지(APK)가 저장되는 위치. 일반 권한으로 임의 수정할 수 없다."], ["/data/data", "앱별 사용자 데이터와 리소스·라이브러리 영역"], ["/data/local/tmp", "ADB로 연결한 뒤 파일 쓰기가 가능한 임시 디렉터리"], ["/system", "시스템 애플리케이션과 시스템 파일이 있으며 읽기 전용으로 설정되는 영역"], ["/bin, /boot, /dev, /sbin", "시스템 명령·부팅 파일·장치 파일·관리 명령 경로. 일반 ADB 쓰기 대상으로 보지 않는다."]] },
                { type: "text", title: "ADB(Android Debug Bridge)", paragraphs: ["ADB는 개발 컴퓨터와 안드로이드 기기 사이에서 앱 설치·디버깅·파일 복사·셸 접속 등 작업을 수행하는 명령 기반 도구다. 기기에서 PC로 복사하는 `adb pull`과 PC에서 기기로 복사하는 `adb push`의 방향을 혼동하지 않는다."] },
                { type: "code", title: "ADB 주요 명령", language: "bash", code: "adb reboot\nadb pull <기기 경로> <PC 경로>\nadb push <PC 경로> <기기 경로>\nadb shell\nadb logcat" },
                { type: "bullets", title: "안전한 분석 관점", items: ["`adb shell`은 기기의 명령 셸로 연결하고, `adb logcat`은 시스템·앱 로그를 확인한다.", "앱 데이터 경로와 임시 쓰기 경로를 구분한다. 경로에 접근 가능하다는 사실이 파일 내용의 신뢰성을 보장하지는 않는다.", "기본 ADB 접근만으로 시스템 디렉터리를 수정할 수 있는 것은 아니다. 시스템 파티션·권한 정책과 기기 상태를 함께 확인한다."] }
              ],
              memoryPoints: ["`/data/local/tmp`는 교재에서 ADB 연결 후 쓰기 가능한 경로로 제시된다. `/system`은 읽기 전용 영역이다.", "`adb pull`은 기기→PC, `adb push`는 PC→기기다.", "ADB 기본 명령: reboot, pull, push, shell, logcat."]
            },
            {
              id: "android-diagnostics-reverse-engineering",
              title: "로그 분석·앱 역공학과 루팅",
              summary: "Logcat 로그 수준과 dex2jar·apktool, 루팅의 의미를 구분합니다.",
              sourcePdfPages: [140, 141],
              keywords: ["Logcat", "android.util.Log", "dex2jar", "apktool", "Rooting", "루팅", "리버스엔지니어링"],
              questionKeywords: ["Logcat", "android.util.Log", "Log.e", "Log.w", "dex2jar", "apktool d", "apktool b", "루팅", "Rooting"],
              blocks: [
                { type: "table", title: "안드로이드 로그 수준", columns: ["유형", "용도", "메서드 예"], rows: [["ASSERT", "발생해서는 안 되는 심각한 오류", "Log.wtf"], ["ERROR", "가장 심각한 오류", "Log.e"], ["WARN", "향후 문제가 될 수 있는 상황", "Log.w"], ["INFO", "정보·진행 상태", "Log.i"], ["DEBUG", "디버깅·문제 점검", "Log.d"], ["VERBOSE", "상세 동작 추적", "Log.v"]] },
                { type: "table", title: "앱 분석 도구", columns: ["도구", "기능"], rows: [["dex2jar", "Dalvik Executable인 `.dex`를 자바 `.class` 형태로 변환해 분석에 활용"], ["apktool", "APK를 디컴파일해 리소스·코드를 확인하고 수정 후 다시 빌드"], ["루팅(Rooting)", "루트 접근 권한을 얻어 기기를 더 완전하게 제어하고 제조사·판매자의 제약을 해제하는 행위"]] },
                { type: "code", title: "apktool 명령", language: "bash", code: "# 디컴파일\napktool d 분석대상앱.apk\n\n# 수정한 소스 폴더에서 다시 빌드\napktool b 소스폴더경로" },
                { type: "bullets", title: "보안 점검 포인트", items: ["로그에는 개인정보·인증정보 등 민감한 값이 기록되지 않도록 하고, 운영 배포본의 디버그 로그를 통제한다.", "`android:exported`와 시스템 권한 선언, 앱 패키지 안의 리소스·코드는 분석 대상으로 삼는다. APK가 난독화되어도 민감정보를 평문으로 포함하지 않도록 한다.", "루팅은 사용자·앱의 권한 경계를 약화시킬 수 있으므로 단말 통제 정책과 앱의 루트 환경 대응을 고려한다."] }
              ],
              memoryPoints: ["로그 수준은 ASSERT·ERROR·WARN·INFO·DEBUG·VERBOSE 순이며, 코드 메서드는 `Log.wtf/e/w/i/d/v`다.", "dex2jar는 dex를 class로 변환하고 apktool은 APK 디컴파일·리빌드에 사용한다.", "루팅은 루트 접근 권한을 얻어 기기 제약을 해제하는 행위다."]
            }
          ]
        },
        {
          id: "system-information",
          title: "시스템 정보",
          chapter: "정보 시스템",
          summary: "환경변수와 Windows·Unix/Linux 로그, syslog·logrotate 및 웹 서버 로그를 학습합니다.",
          status: "published",
          sourcePdfPages: Array.from({ length: 11 }, (_, index) => index + 146),
          concepts: [
            {
              id: "system-environment-variables",
              title: "시스템 환경변수",
              summary: "프로세스 실행 환경에 전달되는 주요 Unix/Linux 변수를 구분합니다.",
              sourcePdfPages: [146],
              keywords: ["환경변수", "Environment Variable", "PATH", "HOME", "PWD", "SHELL", "USER", "TERM", "TMOUT"],
              questionKeywords: ["환경변수", "Environment Variable", "PATH", "HOME", "PWD", "SHELL", "TMOUT"],
              blocks: [
                { type: "text", title: "환경변수의 역할", paragraphs: ["환경변수는 운영체제와 실행 중인 프로세스에 전달되는 이름·값 정보다. 프로그램의 실행 경로, 사용자의 홈, 셸, 터미널과 같은 실행 환경을 정한다."] },
                { type: "table", title: "주요 환경변수", columns: ["변수", "내용"], rows: [["PATH", "실행 파일을 검색할 디렉터리 경로"], ["HOME", "사용자의 홈 디렉터리"], ["PWD", "현재 작업 디렉터리의 절대 경로"], ["SHELL", "현재 로그인 사용자의 기본 셸 경로"], ["USER", "현재 로그인 계정 이름"], ["TERM", "현재 터미널 종류"], ["TMOUT", "일정 시간 입력이 없을 때 자동 로그아웃까지의 시간 설정"]] },
                { type: "bullets", title: "점검 포인트", items: ["환경변수 값은 프로세스 동작에 영향을 준다. 특히 PATH에 신뢰할 수 없는 디렉터리가 포함되면 명령 실행 경로가 바뀔 수 있다.", "`PWD`는 현재 디렉터리 경로를 담고, `pwd` 명령은 현재 디렉터리를 출력한다.", "TMOUT은 유휴 세션 종료 정책과 관련되므로 운영 정책에 맞게 설정한다."] }
              ],
              memoryPoints: ["PATH=실행 파일 탐색 경로, HOME=홈, PWD=현재 경로, SHELL=기본 셸, USER=계정, TERM=터미널, TMOUT=유휴 로그아웃 시간이다."]
            },
            {
              id: "windows-event-logs",
              title: "Windows 이벤트 로그",
              summary: "이벤트 로그 종류, 뷰어와 Windows 버전별 저장 경로·파일명을 정리합니다.",
              sourcePdfPages: [146, 147],
              keywords: ["Windows 이벤트 로그", "Event Viewer", "Application.evtx", "Security.evtx", "System.evtx", "net session"],
              questionKeywords: ["윈도우 시스템 이벤트 로그", "Windows 이벤트 로그", "Application.evtx", "Security.evtx", "System.evtx", "AppEvent.evt", "SecEvent.evt", "net session", "이벤트 뷰어"],
              blocks: [
                { type: "table", title: "이벤트 로그 분류", columns: ["로그", "주요 내용"], rows: [["Application", "응용프로그램이 기록한 이벤트"], ["Security", "감사 설정에 따른 유효·실패 로그인, 파일 생성·열람·삭제 등 보안 이벤트"], ["System", "부팅 오류 등 운영체제·시스템 구성요소 이벤트"], ["Setup", "Windows 설치·업데이트 이벤트. Windows Vista 이후 파일로 제공"], ["기타", "기존 Windows의 디렉터리 서비스·파일 복제 서비스·DNS 서버 로그"]] },
                { type: "table", title: "Windows 버전별 이벤트 파일", columns: ["종류", "Windows 2000까지", "Vista 이후"], rows: [["응용프로그램", "AppEvent.evt", "Application.evtx"], ["보안", "SecEvent.evt", "Security.evtx"], ["시스템", "SysEvent.evt", "System.evtx"], ["설치", "없음", "Setup.evtx"]] },
                { type: "text", title: "저장 위치와 확인 도구", paragraphs: ["Windows 2000까지는 `%Windows%\\system32\\config\\`, Vista 이후는 `%Windows%\\system32\\winevt\\Logs\\` 아래에 이벤트 로그를 저장한다. 로그는 바이너리 형식이므로 Event Viewer(이벤트 뷰어)에서 열어 분석하며 CSV로 내보낼 수 있다.", "`net session`은 연결된 클라이언트 주소·계정·운영체제·세션 수와 연결 경과 시간을 확인하는 명령이다. 이벤트 기록과 현재 세션 정보를 함께 조사한다."] }
              ],
              memoryPoints: ["구형 `.evt` 파일명은 AppEvent/SecEvent/SysEvent, Vista 이후는 Application/Security/System `.evtx`다.", "구형 로그 경로는 `system32\\config`, Vista 이후는 `system32\\winevt\\Logs`다.", "Security 로그는 감사 설정이 있어야 보안 이벤트를 충분히 기록한다."]
            },
            {
              id: "unix-linux-system-logs",
              title: "Unix/Linux 주요 로그 파일",
              summary: "로그 목적·형식·조회 명령과 플랫폼별 주요 경로를 비교합니다.",
              sourcePdfPages: [147, 148, 149, 150, 151],
              keywords: ["utmp", "wtmp", "btmp", "lastlog", "sulog", "acct", "pacct", "dmesg", "secure", "messages", "xferlog"],
              questionKeywords: ["utmp", "wtmp", "btmp", "loginlog", "lastlog", "sulog", "acct/pacct", "pacct", "bash_history", "dmesg", "/var/log/secure", "messages", "boot.log", "xferlog", "finger 서비스"],
              blocks: [
                { type: "table", title: "로그인·계정 이력", columns: ["로그", "기록·조회", "대표 경로"], rows: [["utmp", "현재 로그인 사용자 상태. `w`, `who`, `whodo`, `finger`", "Unix `/var/adm/utmpx`; Linux `/var/run/utmp`"], ["wtmp", "성공 로그인·로그아웃, 부팅·종료 이력. `last`", "Unix `/var/adm/wtmpx`; Linux `/var/log/wtmp`"], ["btmp (Linux)", "실패한 로그인 시도. `lastb`", "`/var/log/btmp`"], ["loginlog (Unix)", "5회 이상 실패한 로그인 기록", "`/var/adm/loginlog`"], ["lastlog", "계정별 가장 최근 성공 로그인. `lastlog`, `finger`", "Unix `/var/adm/lastlog`; Linux `/var/log/lastlog`"], ["sulog (Unix)", "`su` 권한 전환의 시간·성공/실패·from/to 계정", "`/var/adm/sulog`"]] },
                { type: "table", title: "시스템·서비스 로그", columns: ["로그", "기록 내용·확인", "대표 경로"], rows: [["acct/pacct", "사용자 명령 실행·CPU 시간 등 계정 기록. `acctcom`, `lastcomm`; 기본 활성화 여부를 확인", "Unix `/var/adm/pacct`; Linux `/var/account/pacct`"], ["sh_history / .bash_history", "사용자가 셸에서 실행한 명령 이력", "사용자 홈 디렉터리"], ["dmesg", "Linux 부팅·커널 메시지. `dmesg`", "`/var/log/dmesg`"], ["secure", "Linux 사용자 인증·원격 로그인 관련 기록", "`/var/log/secure`"], ["messages", "일반 시스템 메시지와 데몬·접속 정보", "Unix `/var/adm/messages`; Linux `/var/log/messages`"], ["boot.log", "Linux 부팅 중 파일시스템 검사·서비스 실행 결과", "`/var/log/boot.log`"], ["xferlog", "FTP 로그인 및 파일 업로드·다운로드 기록", "FTP 데몬 설정에 따른 로그 경로"]] },
                { type: "bullets", title: "로그 조사 시 주의", items: ["Unix 계열은 로그가 여러 파일과 경로에 나뉘므로 운영체제별 저장 위치와 바이너리·텍스트 형식을 확인한다.", "`last`는 wtmp, `lastb`는 Linux btmp, `lastlog -u 계정명`은 계정별 최근 로그인 기록을 확인한다.", "`finger`는 사용자·로그인 상태·홈·plan 정보를 노출할 수 있는 오래된 조회 서비스이므로 불필요하면 중지하거나 방화벽으로 차단한다.", "FTP `xferlog`는 전송 시간·클라이언트 주소·파일 크기·파일명과 전송 방향·성공 여부를 조사하는 단서다."] }
              ],
              memoryPoints: ["utmp=현재 로그인, wtmp=성공 로그인/부팅, btmp=실패 로그인, lastlog=최근 성공 로그인, sulog=su 전환이다.", "`last`는 wtmp, `lastb`는 btmp, `lastlog`는 계정별 최근 기록을 조회한다.", "로그 경로는 Unix `/var/adm` 계열과 Linux `/var/log` 계열 차이를 구분한다."]
            },
            {
              id: "syslog-log-rotation",
              title: "syslog와 로그 관리",
              summary: "facility·priority·action 기반 syslog 설정과 실시간 모니터링·logrotate를 익힙니다.",
              sourcePdfPages: [152, 153, 154],
              keywords: ["syslog", "syslogd", "syslog.conf", "facility", "priority", "logrotate", "tail -f"],
              questionKeywords: ["syslog", "syslogd", "/etc/syslog.conf", "facility", "priority", "emerg", "alert", "crit", "logrotate", "rotate 4", "tail -f /var/log/secure"],
              blocks: [
                { type: "text", title: "syslog 규칙 구조", paragraphs: ["syslog는 Unix/Linux 시스템 로그를 생성·관리하는 체계다. syslogd는 시작 시 `/etc/syslog.conf`를 읽고 어떤 facility의 어떤 priority 메시지를 어떤 action(로그 파일·콘솔·원격 서버·사용자 터미널)에 남길지 정한다. 규칙은 `facility.priority action` 형식으로 이해한다."] },
                { type: "table", title: "Facility와 우선순위", columns: ["분류", "종류·의미"], rows: [["Facility", "`*` 전체, `auth` 인증·보안, `console` 콘솔 메시지, `daemon` 데몬 메시지, `syslog` syslogd 메시지, `user` 사용자 프로세스 메시지"], ["Priority(높음→낮음)", "emerg(시스템 중단 수준) → alert(즉시 조치) → crit(치명적 상황) → err(오류) → warning(경고) → notice(주의) → info(정보) → debug(디버깅)"]] },
                { type: "code", title: "모니터링·회전 예", language: "bash", code: "# secure 로그에 추가되는 내용을 실시간 확인\ntail -f /var/log/secure\n\n# logrotate 설정 예\nweekly\nrotate 4\nsize 1M\ncreate\ncompress\ninclude /etc/logrotate.d" },
                { type: "bullets", title: "logrotate 구성", items: ["logrotate는 로그 백업·새 파일 생성·압축과 오래된 로그 순환을 자동화한다. 주 실행 파일은 `/usr/sbin/logrotate`, 주기 실행 설정은 `/etc/cron.daily/logrotate`다.", "주 설정은 `/etc/logrotate.conf`, 서비스별 설정은 `/etc/logrotate.d/`, 작업 상태는 `/var/lib/logrotate.status`에 둔다.", "`weekly`는 주 단위 확인, `rotate 4`는 순환 보관 개수, `size 1M`은 1MB 초과 시 순환, `create`는 새 로그 생성, `compress`는 압축, `include`는 추가 규칙 포함이다."] }
              ],
              memoryPoints: ["syslog 규칙은 facility.priority와 action으로 구성하며 우선순위는 emerg부터 debug 순이다.", "`tail -f`는 파일 끝에 추가되는 로그를 실시간으로 확인한다.", "logrotate 설정 파일은 `/etc/logrotate.conf`와 `/etc/logrotate.d/`, 실행 기록은 `/var/lib/logrotate.status`다."]
            },
            {
              id: "web-server-logs",
              title: "웹 서버 로그(IIS·Apache)",
              summary: "IIS W3C 필드와 Apache common·combined 형식, 로그가 담는 보안 단서를 비교합니다.",
              sourcePdfPages: [154, 155, 156],
              keywords: ["IIS", "W3C", "Apache", "access_log", "error_log", "common", "combined", "httpd.conf"],
              questionKeywords: ["IIS 웹 서버 로그", "W3C", "cs-uri-stem", "cs-cookie", "sc-status", "Apache 웹 서버 로그", "access_log", "error_log", "common", "combined", "httpd.conf", "%>s", "%{Referer}i"],
              blocks: [
                { type: "table", title: "IIS W3C 주요 필드", columns: ["필드", "기록 내용"], rows: [["date / time", "요청 날짜·시간(교재는 GMT 기준으로 설명)"], ["s-ip / s-port", "웹 서버 IP와 포트"], ["cs-method", "HTTP 메서드"], ["cs-uri-stem / cs-uri-query", "요청 경로와 쿼리 파라미터"], ["cs-username / c-ip", "인증 사용자 계정과 클라이언트 IP"], ["cs(User-Agent)", "클라이언트 브라우저 정보"], ["cs(Referer) / cs(Cookie)", "유입 참조 페이지와 쿠키 값"], ["sc-status", "서버 응답 상태 코드"]] },
                { type: "table", title: "Apache 로그 형식", columns: ["형식", "포맷·특징"], rows: [["common", "`%h %l %u %t \"%r\" %>s %b` — 원격 호스트, 식별자, 인증 사용자, 시간, 요청 라인, 상태 코드, 전송 바이트"], ["combined", "common에 `%{Referer}i`와 `%{User-Agent}i`를 추가해 접속 경로·브라우저 정보를 남김"], ["로그 종류", "`access_log`는 요청·응답, `error_log`는 서버 오류"], ["주요 위치·설정", "로그는 `/var/log/httpd/`; 형식과 동작은 `httpd.conf`에서 확인"]] },
                { type: "bullets", title: "분석 포인트", items: ["요청 시각·클라이언트 IP·메서드·경로·쿼리·응답 코드를 조합해 비정상 접근과 오류를 추적한다.", "Referer, User-Agent, Cookie와 쿼리 문자열에는 민감정보가 포함될 수 있으므로 수집·보관·열람 권한과 보존 기간을 관리한다.", "W3C 필드에서 `c-ip`는 클라이언트 IP, `s-ip`는 서버 IP이며 `sc-status`가 서버 응답 코드다."] }
              ],
              memoryPoints: ["IIS W3C: `s-ip` 서버, `c-ip` 클라이언트, `cs-uri-stem` 경로, `sc-status` 응답 코드다.", "Apache common은 기본 요청 정보, combined는 Referer와 User-Agent를 더 기록한다.", "Apache access_log는 요청, error_log는 서버 오류이며 설정은 httpd.conf에서 확인한다."]
            }
          ]
        },
        {
          id: "system-attack-techniques",
          title: "시스템 공격 기법",
          chapter: "시스템 공격 기법",
          summary: "표적형 공격, 메모리·프로세스 취약점, 사회공학, 부채널 공격과 점검 도구를 학습합니다.",
          status: "published",
          sourcePdfPages: Array.from({ length: 32 }, (_, index) => index + 165),
          concepts: [
            {
              id: "apt-and-dll-injection",
              title: "APT와 DLL 인젝션",
              summary: "표적형 장기 침투 과정과 프로세스에 악성 DLL을 로드하는 기법을 구분합니다.",
              sourcePdfPages: [165, 166, 167, 168],
              keywords: ["APT", "Advanced Persistent Threat", "Cyber Kill Chain", "DLL 인젝션", "DLL Injection", "EDR", "PMS"],
              questionKeywords: ["APT", "Advanced Persistent Threat", "사이버 킬체인", "Cyber Kill Chain", "DLL 인젝션", "DLL Injection", "CreateRemoteThread", "VirtualAllocEx", "EDR", "PMS"],
              blocks: [
                { type: "text", title: "APT의 특성", paragraphs: ["APT(Advanced Persistent Threat)는 특정 표적을 정해 여러 수단으로 장기간 은밀하게 침투·관찰·탈취를 시도하는 공격이다. 스피어피싱, 드라이브 바이 다운로드(DBD), 워터링 홀, 백도어, 제로데이 취약점 등 복합 수단을 사용할 수 있다.", "교재는 사이버 킬체인을 정찰(Reconnaissance) → 무기화(Weaponization) → 전달(Delivery) → 익스플로잇(Exploit) → 설치(Installation) → 명령·제어(C2) → 목표 달성(Actions on Objectives)으로 설명한다. APT 준비는 목표 설정·무기화, 공격은 침투 → 탐색 → 수집/공격 → 유출로 정리한다."] },
                { type: "table", title: "APT 대응", columns: ["수단", "목적"], rows: [["보안 인식 교육", "피싱 이메일·첨부파일을 통한 초기 침투 감소"], ["EDR", "단말 행위를 탐지하고 실시간으로 통제·대응"], ["PMS·보안 업데이트", "취약한 시스템을 최신 패치 상태로 유지"], ["백업·백신", "데이터 복구력을 확보하고 악성코드를 탐지"]] },
                { type: "text", title: "DLL 인젝션", paragraphs: ["DLL 인젝션은 공격자가 준비한 동적 라이브러리를 다른 프로세스의 메모리 공간에 로드해 그 프로세스의 권한·동작을 이용하는 기법이다. 교재의 동작 흐름은 대상 프로세스 제어권 획득, DLL 경로 기록, DLL 로드, 원격 스레드 실행으로 설명하며 `OpenProcess`, `VirtualAllocEx`, `WriteProcessMemory`, `LoadLibrary`, `CreateRemoteThread` API를 예로 든다.", "대응은 신뢰된 코드 서명·무결성 검사, 프로세스 최소 권한, 불필요한 외부 코드 실행 제한, ASLR 및 EDR 기반 프로세스 행위 감시를 결합한다."] }
              ],
              memoryPoints: ["APT는 특정 표적을 장기간 은밀하게 공격한다. 킬체인 순서는 정찰→무기화→전달→익스플로잇→설치→C2→목표 달성이다.", "APT의 대응은 교육·EDR·패치관리·백업을 함께 적용한다.", "DLL 인젝션은 다른 프로세스 메모리에 DLL을 로드해 실행시키는 기법이며 무결성·권한·행위 감시가 대응 축이다."]
            },
            {
              id: "buffer-overflow-and-memory-protection",
              title: "버퍼 오버플로우와 메모리 보호",
              summary: "스택·힙 오버플로우의 원리와 방어 기법 및 ROP 우회를 이해합니다.",
              sourcePdfPages: [169, 170, 171, 172],
              keywords: ["버퍼 오버플로우", "Buffer Overflow", "Stackguard", "Stack Shield", "DEP", "NX", "ASLR", "RELRO", "PIE", "ROP"],
              questionKeywords: ["버퍼 오버플로우", "Buffer Overflow", "스택 버퍼", "힙 버퍼", "strcpy", "스택 가드", "Stackguard", "Stack Shield", "Non-Executable", "DEP", "ASLR", "RELRO", "PIE", "ROP"],
              blocks: [
                { type: "table", title: "프로세스 주소 공간과 오버플로우", columns: ["영역", "주요 내용"], rows: [["코드", "실행할 프로그램 명령"], ["데이터", "전역·static 변수"], ["힙", "실행 중 동적으로 할당한 메모리"], ["스택", "함수의 지역 변수·매개변수·복귀 주소"], ["스택 오버플로우", "버퍼 경계를 넘는 입력으로 인접 데이터나 복귀 주소를 덮어 제어 흐름을 바꾸는 공격"], ["힙 오버플로우", "동적 버퍼 경계를 넘겨 인접 힙 메타데이터·포인터를 훼손하는 공격"]] },
                { type: "code", title: "경계 검사가 없는 취약한 예", language: "c", code: "char p[4];\nstrcpy(p, argv[1]); // 입력 길이를 검사하지 않음" },
                { type: "text", title: "공격 흐름과 방어 계층", paragraphs: ["교재의 스택 공격 흐름은 공격 코드 준비 → 반환 주소 덮어쓰기 → 공격 코드 주소로 반환 → 코드 실행이다. 방어는 입력 길이·버퍼 경계 검사, 최소 권한, 커널 패치와 컴파일·실행 시 메모리 보호를 겹쳐 적용한다.", "스택 가드(Stackguard)는 변수와 복귀 주소 사이의 카나리 값 변조를 확인한다. 스택 쉴드(Stack Shield)는 함수 진입 시 복귀 주소를 별도 영역에 저장해 종료 시 비교한다. NX/DEP는 스택·힙의 데이터 영역을 실행하지 못하게 한다. ASLR은 주소를 무작위화하고, RELRO는 ELF의 중요한 재배치 영역을 읽기 전용으로 보호하며, PIE는 실행할 때마다 프로그램 주소가 달라지도록 한다.", "ROP(Return Oriented Programming)는 기존 코드 조각을 RET 연결로 이어 실행하는 기법으로, 공격자가 데이터 실행 방지 기법을 우회하려는 데 이용할 수 있다. 메모리 보호는 서로 보완적으로 적용한다."] },
                { type: "bullets", title: "안전한 구현 원칙", items: ["입력 크기를 확인하는 경계 검사를 수행하고, 길이 제한이 있는 입력·문자열 처리 방식을 사용한다.", "취약한 함수 사용 여부를 정적 분석하고 컴파일러 경고·보안 옵션을 적용한다.", "프로그램은 최소 권한으로 실행하고, 스택 가드·DEP/NX·ASLR·RELRO·PIE 적용 여부를 점검한다."] }
              ],
              memoryPoints: ["스택에는 지역 변수·매개변수·복귀 주소가, 힙에는 동적 할당 데이터가 놓인다.", "스택 가드=카나리, 스택 쉴드=복귀 주소 별도 저장·비교, NX/DEP=데이터 영역 실행 차단이다.", "ASLR=주소 무작위화, RELRO=재배치 정보 보호, PIE=실행 주소 독립화다. ROP는 기존 RET 코드 조각을 잇는다."]
            },
            {
              id: "race-condition-and-format-string",
              title: "레이스 컨디션과 포맷 스트링",
              summary: "공유 임시 파일 경쟁과 사용자 입력을 포맷 문자열로 사용하는 취약점을 비교합니다.",
              sourcePdfPages: [173, 174, 175, 176],
              keywords: ["Race Condition", "레이스 컨디션", "심볼릭 링크", "Format String", "포맷 스트링", "%n", "%x"],
              questionKeywords: ["레이스 컨디션", "Race Condition", "심볼릭 링크", "임시 파일", "umask 022", "포맷 스트링", "Format String", "printf(argv", "%n", "%hn", "%ln"],
              blocks: [
                { type: "text", title: "레이스 컨디션", paragraphs: ["레이스 컨디션은 둘 이상의 프로세스·스레드가 공유 자원에 동시에 접근할 때 실행 순서에 따라 결과가 달라지는 상황을 공격에 이용한다. 특히 높은 권한의 취약 프로그램이 예측 가능한 임시 파일을 만들 때 공격자가 그 이름에 대한 심볼릭 링크를 먼저 설정하면, 프로그램이 링크 대상 파일을 자신의 임시 파일로 오인해 덮어쓸 수 있다.", "교재의 절차는 취약 프로그램 실행·권한 상승 → 임시 파일 이름 파악 및 심볼릭 링크 생성 → 임시 파일 생성·처리 경쟁 → 링크 대상 변경이다. 임시 파일을 안전하게 생성하고 링크·권한을 확인하며 다른 사용자의 쓰기 권한을 최소화한다. 교재는 umask를 022 이하로 유지하는 대응을 제시한다."] },
                { type: "text", title: "포맷 스트링 취약점", paragraphs: ["포맷 스트링 취약점은 검증되지 않은 사용자 입력을 `printf` 등 출력 함수의 형식 문자열로 직접 전달할 때 발생한다. `%x` 등은 스택 값을 읽어 메모리 내용을 노출할 수 있고, `%n` 계열은 지금까지 출력한 문자 수를 지정 메모리에 기록할 수 있어 읽기뿐 아니라 메모리 변경 위험도 있다.", "일반 문자열 데이터와 포맷 문자열을 분리하고, 사용자가 형식 지정자를 제어하지 못하게 한다. 포맷 사용 함수의 인자 검증, 컴파일러 정적 검사와 시스템 패치를 적용한다."] },
                { type: "table", title: "대표 포맷 지정자", columns: ["지정자", "의미"], rows: [["%c / %s", "문자 1개 / 문자열"], ["%u / %d", "부호 없는 10진 정수 / 10진 정수"], ["%o / %x", "8진 정수 / 16진 정수"], ["%e / %f / %lf", "지수 표기 / 부동소수점 / 긴 부동소수점"], ["%n / %hn / %ln", "현재까지 출력한 문자 수를 각각 지정 변수에 저장"]] },
                { type: "bullets", title: "대응 요약", items: ["임시 파일 이름·권한·심볼릭 링크 상태를 확인해 경쟁 조건을 차단한다.", "사용자 입력은 데이터 인자로 전달하고 포맷 문자열로 사용하지 않는다.", "정적 분석과 안전한 입력 길이 검사로 관련 취약 함수를 찾아 수정한다."] }
              ],
              memoryPoints: ["레이스 컨디션은 공유 자원 접근 순서 경쟁이며, 임시 파일·심볼릭 링크 결합이 권한 상승으로 이어질 수 있다.", "umask 022 이하 유지와 안전한 임시 파일·링크 검사가 대응이다.", "포맷 스트링은 사용자 입력을 형식 인자로 사용할 때 발생한다. `%n`은 출력 문자 수를 메모리에 기록한다."]
            },
            {
              id: "fuzzing-and-social-engineering",
              title: "퍼징과 사회공학",
              summary: "입력 기반 취약점 탐지 방식과 사람·컴퓨터 기반 사회공학 공격을 구분합니다.",
              sourcePdfPages: [176, 177, 178],
              keywords: ["Fuzzing", "퍼징", "Social Engineering", "사회공학", "Phishing", "Vishing", "Smishing", "Qshing", "BEC"],
              questionKeywords: ["퍼징", "Fuzzing", "Mutation-based", "Generation-based", "Guided-based", "사회공학", "Social Engineering", "Shoulder Surfing", "Dumpster Diving", "Tailgating", "Phishing", "Vishing", "Clone Phishing", "Pharming", "Smishing", "Qshing", "BEC", "Whaling", "Cybersquatting"],
              blocks: [
                { type: "table", title: "퍼징 기법", columns: ["기법", "테스트 입력 생성"], rows: [["Mutation-based", "기존 입력(seed)을 무작위 변형해 테스트 케이스를 만든다."], ["Generation-based", "문법·프로토콜 등 입력 구조를 이해하고 유효한 입력을 생성한다."], ["Guided-based", "실행 후 얻은 커버리지·경로·결과를 피드백으로 사용해 다음 입력을 만든다."]] },
                { type: "table", title: "사회공학 분류", columns: ["기반", "기법", "핵심"], rows: [["인간 기반", "Shoulder Surfing", "화면·키보드 입력을 엿봄"], ["인간 기반", "Dumpster Diving", "폐기물에서 유용 정보 탐색"], ["인간 기반", "Tailgating/Piggybacking", "권한 있는 사람을 따라 통제 구역 진입"], ["인간 기반", "HUMINT / Whaling", "인적 네트워크 정보 수집 / 고위 임원 표적 사기"], ["컴퓨터 기반", "Phishing / Vishing / Smishing / Qshing", "이메일·메신저 / 음성통화 / 문자 / 악성 QR을 이용한 정보 탈취"], ["컴퓨터 기반", "Pharming / Clone Phishing", "주소 조작으로 가짜 사이트 유도 / 정상 메시지를 복제해 속임"], ["컴퓨터 기반", "BEC / Blackmail", "기업 이메일을 사칭해 송금·자료 요구 / 민감정보를 빌미로 협박"], ["도메인 악용", "Cybersquatting", "유명 브랜드와 혼동되는 도메인을 선점·악용"]] },
                { type: "bullets", title: "방어 관점", items: ["사회공학은 기술 취약점보다 신뢰·호기심·긴박감 등 사람의 심리를 이용하므로 반복 교육과 절차 검증이 필요하다.", "송금·계정 변경·민감 자료 제공 요청은 별도 채널로 재확인하고, 출입 통제와 폐기 문서 관리를 수행한다.", "퍼징은 다양한 입력에 대한 프로그램 반응을 분석해 소프트웨어·하드웨어 취약점을 발견하는 테스트 기법이다."] }
              ],
              memoryPoints: ["퍼징은 mutation(기존 입력 변형), generation(구조 기반 생성), guided(실행 피드백 활용)로 구분한다.", "사회공학은 인간 기반과 컴퓨터 기반으로 나누고, 공격 매체와 유도 방식을 구별한다.", "BEC는 기업 이메일 사칭으로 송금·자료를 요구하는 공격이다."]
            },
            {
              id: "cpu-side-channel-password-attacks",
              title: "CPU·부채널·패스워드 공격",
              summary: "Meltdown·Spectre, 물리적 부채널, 비밀번호 추측 공격의 원리를 비교합니다.",
              sourcePdfPages: [178, 179, 180],
              keywords: ["Meltdown", "Spectre", "Side-Channel", "부채널 공격", "Brute Force", "Dictionary Attack", "Credential Stuffing", "CryptoLocker"],
              questionKeywords: ["Meltdown", "Spectre", "부채널 공격", "Side-Channel Attack", "전력 분석", "시차 공격", "Brute Force", "무차별 대입", "Dictionary Attack", "사전 공격", "Credential Stuffing", "크리덴셜 스터핑", "CryptoLocker", "정보 누출", "악성 콘텐츠"],
              blocks: [
                { type: "table", title: "CPU 추측 실행 공격", columns: ["공격", "원리·대표 취약 동작"], rows: [["Meltdown", "비순차적 실행에서 권한 검사를 우회해 보호 영역 데이터를 추측 실행·캐시에 반영하고 부채널로 정보를 유출"], ["Spectre", "분기 예측·추측 실행을 조작해 경계 밖 메모리 접근을 유도하고 프로세스 상태 변화를 통해 기밀정보를 유출"], ["Spectre Variant 1", "Bounds Check Bypass(경계 검사 우회)"], ["Spectre Variant 2", "Branch Target Injection(분기 표적 주입)"]] },
                { type: "table", title: "부채널 공격", columns: ["관찰 정보", "기법"], rows: [["오류·오류 메시지", "출력·오류 여부로 내부 상태를 추정"], ["전력", "암호 연산 시 전력 소모 패턴 분석"], ["시간", "연산 수행 시간 차이 분석"], ["전자기파·주파수·빛·열", "연산 중 발생하는 물리 신호·오류를 측정"]] },
                { type: "table", title: "비밀번호·시스템 공격", columns: ["공격", "방식"], rows: [["Brute Force", "가능한 비밀번호 조합을 순차적으로 대입"], ["Dictionary Attack", "흔히 쓰는 단어·비밀번호 목록을 대입"], ["Credential Stuffing", "유출된 로그인 자격 증명을 다른 서비스에 재사용해 대입"], ["CryptoLocker", "파일을 강하게 암호화하고 복호화 대가를 요구하는 랜섬웨어 계열 공격"], ["정보 누출", "오류 메시지·개발 주석 등이 2차 공격에 필요한 정보를 노출"], ["악성 콘텐츠", "검증되지 않은 업로드 파일·콘텐츠를 통해 악성코드 감염을 유도"]] },
                { type: "text", title: "패스워드 방어", paragraphs: ["긴 고유 패스워드와 서비스별 재사용 방지, 다중 인증, 로그인 시도 제한·모니터링을 적용하면 대입 공격과 자격 증명 재사용의 영향을 줄일 수 있다. 오류 메시지와 시스템 로그에는 비밀 값이 노출되지 않도록 한다."] }
              ],
              memoryPoints: ["Meltdown은 권한 검사 우회·불량 데이터 캐시 적재, Spectre는 추측 실행·분기 예측 악용으로 구분한다.", "부채널은 알고리즘 자체보다 전력·시간·전자기파 등 구현 과정의 물리 정보를 분석한다.", "Brute Force는 가능한 조합, Dictionary는 흔한 단어, Credential Stuffing은 유출 자격 증명 재사용이다."]
            },
            {
              id: "system-attack-assessment-tools",
              title: "시스템 공격·패스워드 점검 도구",
              summary: "교재에 나온 시스템 도구 분류와 John the Ripper 공격 모드를 구분합니다.",
              sourcePdfPages: [180, 181],
              keywords: ["Nmap", "John the Ripper", "L0phtcrack", "Pwdump", "ipccrack", "Keylogger", "Rootkit"],
              questionKeywords: ["시스템 해킹 도구", "Nmap", "John the Ripper", "JohnTheRipper", "L0phtcrack", "Pwdump", "ipccrack", "Wordlist 모드", "Incremental 모드", "Single 모드"],
              blocks: [
                { type: "table", title: "교재의 도구 분류 예", columns: ["목적", "도구 예"], rows: [["포트 스캔", "SuperScan, Aat4xx, Nmap"], ["패스워드 크래킹·점검", "John the Ripper, L0phtcrack, Pwdump, ipccrack"], ["트로이 목마·키로거", "Netbus, Back Orifice, Keylog 계열"], ["루트킷", "Windows용·Linux용 도구 계열"]] },
                { type: "table", title: "John the Ripper 모드", columns: ["모드", "동작"], rows: [["Single", "계정명·사용자 정보 기반으로 비밀번호를 추정"], ["Wordlist", "지정된 단어 목록을 순서대로 해시와 비교"], ["Incremental", "가능한 문자 조합을 순차적으로 시도"], ["External", "사용자가 정의한 크래킹 함수·규칙을 사용"]] },
                { type: "code", title: "교재의 모드 예", language: "bash", code: "john --single passwd.1\njohn -w:words.lst passwd.1\njohn -i passwd.1" },
                { type: "bullets", title: "사용 범위", items: ["패스워드 점검 도구는 명시적 승인과 정해진 범위에서 방어 목적으로 사용하고 결과 파일·해시의 접근을 제한한다.", "교재는 John the Ripper를 Windows·Linux·Mac에서 사용하는 오픈소스 패스워드 점검 도구로 소개한다.", "도구 이름을 공격 유형과 연결한다. Nmap은 포트 스캔, Pwdump는 Windows 패스워드 덤프, L0phtcrack은 SAM 등을 이용한 패스워드 점검 도구로 수록되어 있다."] }
              ],
              memoryPoints: ["John Single은 사용자 정보, Wordlist는 사전, Incremental은 문자 조합, External은 사용자 정의 규칙을 이용한다.", "Nmap=포트 스캔, John the Ripper=해시 기반 패스워드 점검 도구다."]
            }
          ]
        },
        {
          id: "malware",
          title: "악성코드",
          chapter: "시스템 공격 기술의 이해 및 관리",
          summary: "바이러스·웜·트로이 목마·루트킷·랜섬웨어와 모바일·기타 악성코드의 특징과 대응을 학습합니다.",
          status: "published",
          sourcePdfPages: Array.from({ length: 20 }, (_, index) => index + 197),
          concepts: [
            {
              id: "malware-classification-and-virus",
              title: "악성코드 분류와 바이러스",
              summary: "호스트 독립·의존 악성코드와 바이러스 세대·탐지·대응 절차를 구분합니다.",
              sourcePdfPages: [197, 198, 199, 200],
              keywords: ["악성코드", "malware", "Virus", "바이러스", "macro virus", "polymorphic", "은폐형 바이러스"],
              questionKeywords: ["악성코드 분류", "호스트 독립형", "호스트 의존형", "바이러스", "Virus", "은폐형 바이러스", "암호화 바이러스", "갑옷형 바이러스", "다형성 바이러스", "매크로 바이러스", "Melissa", "Concept 바이러스", "VBScript"],
              blocks: [
                { type: "table", title: "호스트 의존성 기준", columns: ["분류", "특징·예"], rows: [["호스트 독립형", "호스트 프로그램 없이 자체 실행·전파 가능. 웜, 좀비 등"], ["호스트 의존형(기생형)", "다른 응용프로그램·유틸리티·시스템 프로그램이 필요. 트랩도어, 논리 폭탄, 트로이 목마, 바이러스"]] },
                { type: "table", title: "바이러스 유형", columns: ["세대·형태", "특징"], rows: [["1세대 원시형", "구조가 단순해 분석하기 쉬운 초기 바이러스"], ["2세대 암호화", "일부·대부분을 암호화해 저장하되 실행 시 해독부가 동작"], ["3세대 은폐형(Stealth)", "감염 사실·파일 크기 변화를 숨기고 검사 시 감염 전 내용을 보여줄 수 있음"], ["4세대 갑옷형(Armored)", "여러 암호화·분석 방해 기법으로 분석과 백신 개발을 어렵게 함"], ["다형성(Polymorphic)", "감염될 때마다 패턴과 해독부를 바꾸어 탐지를 회피"], ["매크로(Macro)", "문서 응용프로그램의 매크로 기능을 이용하며 OS에 덜 종속적. Melissa·Concept가 교재 예"]] },
                { type: "text", title: "VBScript와 바이러스 대응", paragraphs: ["VBScript는 Microsoft가 개발한 경량 스크립팅 언어이며 `.vbs` 확장자를 사용한다. 문서·메일 등에 첨부된 스크립트가 악성 행위를 수행할 수 있고, 교재는 LoveBug 사례를 든다.", "바이러스 대응은 탐지(감염 여부·위치 확인) → 식별(종류·특성 파악) → 제거(감염 시스템에서 제거해 전파 차단) 순서다. 파일 크기·타임스탬프 변화, 저장 공간 부족과 과도한 파일 입출력은 점검 단서가 될 수 있다."] },
                { type: "table", title: "안티바이러스 탐지", columns: ["방식", "원리·범위"], rows: [["Signature Scanning", "알려진 바이러스의 고유 시그니처를 코드·이진 문자열 등에서 찾음"], ["Behavioral Scanning", "파일 생성·프로세스 조작·네트워크 접속 등 실행 행위를 감시해 시그니처 탐지의 한계를 보완"]] },
                { type: "bullets", title: "예방", items: ["신뢰할 수 있는 소프트웨어를 사용하고 이메일 첨부·링크와 출처 불명 다운로드를 확인한다.", "정기적인 안티바이러스 검사와 업데이트, 중요 데이터 백업을 수행한다.", "사용하지 않는 Windows Script Host·VBScript·JavaScript·ActiveX 등 자동 실행 스크립트 기능은 정책에 따라 비활성화한다."] }
              ],
              memoryPoints: ["바이러스는 다른 파일에 기생하고, 웜은 호스트 파일 없이 네트워크로 자기 복제한다.", "은폐형은 감염 사실을 숨기고, 갑옷형은 분석을 어렵게 하며, 다형성은 감염 때마다 패턴을 바꾼다.", "대응 순서는 탐지→식별→제거, 안티바이러스는 시그니처·행위 기반 탐지를 함께 쓴다."]
            },
            {
              id: "worm-trojan-rootkit",
              title: "웜·트로이 목마·루트킷",
              summary: "독립 전파형 웜, 위장형 트로이 목마, 은폐형 권한 도구의 차이를 정리합니다.",
              sourcePdfPages: [197, 198, 200, 201, 202],
              keywords: ["Worm", "웜", "Trojan", "트로이 목마", "Rootkit", "루트킷", "CommWarrior", "Anti Rootkit"],
              questionKeywords: ["웜", "Worm", "Trojan Horse", "트로이 목마", "자가 복제", "CommWarrior", "Rootkit", "루트킷", "안티 루트킷", "Anti Rootkit", "키로깅"],
              blocks: [
                { type: "table", title: "웜과 트로이 목마 비교", columns: ["유형", "전파·동작"], rows: [["웜", "네트워크 연결을 이용해 실행 코드를 자기 복제. 메일·메신저·파일 공유·원격 실행·취약점 등을 통해 전파"], ["트로이 목마", "정상 프로그램처럼 위장해 사용자가 실행하도록 유도. 자체 복제하지 않으며 원격 제어·자격 증명 탈취·키로깅·파일 파괴를 수행할 수 있음"]] },
                { type: "text", title: "웜의 확산과 대응", paragraphs: ["교재는 웜의 확산을 서서히 시작(Slow Start) → 빠른 확산(Rapid Spread) → 서서히 전파 후 종료(Slow Spread & Termination)의 3단계로 설명한다. 휴대전화 주소록을 이용해 메시지를 보내는 CommWarrior가 모바일 웜 예다.", "최신 안티바이러스, 비정상 트래픽·포트·반복 연결 감시, Ingress(외부→내부) 및 Egress(내부→외부) 모니터링, IPS 탐지·차단으로 전파를 줄인다."] },
                { type: "text", title: "루트킷과 안티루트킷", paragraphs: ["루트킷은 침입 후 관리자(root) 권한을 얻거나 공격 도구·접근 기능을 제공하고, 자신과 다른 악성 구성요소를 숨기는 소프트웨어 모음이다. 교재는 Windows·Linux용 사례를 구분해 제시한다.", "안티루트킷은 커널 수준에서 동작하는 루트킷을 탐지하며 숨김 파일, 변경된 레지스트리, 보호된 프로세스 등을 점검한다. 정상 프로세스·파일·네트워크 상태와 로그를 함께 대조한다."] },
                { type: "bullets", title: "트로이 목마 예방", items: ["공식·신뢰할 수 있는 출처에서만 프로그램을 설치하고 불법·출처 불명 파일을 실행하지 않는다.", "첨부파일·링크를 확인하고 OS·응용프로그램·백신을 최신 상태로 유지한다.", "원격 연결, 자동 실행, 계정·파일 변경과 같은 비정상 행위를 모니터링한다."] }
              ],
              memoryPoints: ["웜은 스스로 복제·전파하지만 트로이 목마는 위장한 호스트 프로그램에 의존하고 자가 복제하지 않는다.", "웜 확산은 slow start→rapid spread→slow spread/termination 단계다.", "루트킷은 은폐·권한 기능을 제공하며 안티루트킷은 커널 수준 흔적을 탐지한다."]
            },
            {
              id: "ransomware",
              title: "랜섬웨어",
              summary: "감염·암호화·금전 요구 절차와 파일 암호화·화면 잠금·시스템 파괴 유형을 구분합니다.",
              sourcePdfPages: [203, 204],
              keywords: ["Ransomware", "랜섬웨어", "CryptoLocker", "CryptoWall", "Nemty", "Tflower", "GermanWiper"],
              questionKeywords: ["랜섬웨어", "Ransomware", "CryptoLocker", "CryptoWall", "Nemty", "Tflower", "Lilocked", "GermanWiper", "NotPetya", "BrowLock", "Petya"],
              blocks: [
                { type: "text", title: "동작 흐름", paragraphs: ["랜섬웨어는 데이터를 암호화하거나 시스템 사용을 제한한 뒤 복호화 키·복구를 대가로 금전을 요구한다. 교재는 파일 확장자 변경, 백신 강제 종료, Windows 복원 지점 삭제 등을 특징으로 든다.", "일반 흐름은 악성코드 침투·숙주 PC 감염 → 암호화 명령 → 파일·시스템 잠금과 금전 요구다. 이메일·악성 링크 등 감염 경로와 백업 복구 가능성을 함께 확인한다."] },
                { type: "table", title: "랜섬웨어 유형·교재 사례", columns: ["유형", "설명·사례"], rows: [["파일 암호화", "데이터를 암호화하고 복호화 비용을 요구. CryptoLocker, CryptoWall, BitCrypt, Nemty, Tflower, Lilocked"], ["화면 잠금", "OS 화면을 잠그거나 기관 경고 화면을 띄워 사용을 제한. BrowLock, WinLock, FBI Lock, Bogus"], ["시스템 파괴", "파일시스템·데이터를 파괴하거나 변조해 복구를 어렵게 함. Petya, GermanWiper, NotPetya"]] },
                { type: "table", title: "교재의 랜섬웨어 사례", columns: ["이름", "특징"], rows: [["Nemty", "감염 PC별 ID와 복호화 비용·월렛 주소를 지정"], ["Tflower", "RDP를 통해 유포되는 사례로 소개"], ["Lilocked", "Linux 기반 웹 서버 파일을 암호화하는 유형"], ["GermanWiper", "파일을 암호화하지 않고 덮어써 복구를 어렵게 하는 파괴형"]] },
                { type: "bullets", title: "대응", items: ["정기·오프라인 백업으로 복구 경로를 확보하고 실제 복원 가능성을 점검한다.", "OS·응용프로그램 패치, 이메일·원격 접속 통제, 백신 업데이트로 초기 감염과 확산을 줄인다.", "감염 시 추가 암호화를 막기 위해 격리·조사 절차를 따르고, 로그와 감염 경로를 보존한다."] }
              ],
              memoryPoints: ["랜섬웨어는 침투→암호화→금전 요구 흐름이며 파일 암호화·화면 잠금·시스템 파괴 유형이 있다.", "CryptoLocker 등 파일 암호화형과 BrowLock 화면 잠금형, GermanWiper 파괴형을 구분한다.", "백업·패치·원격 접속 및 첨부 파일 통제가 핵심 예방책이다."]
            },
            {
              id: "android-malware",
              title: "안드로이드 악성 행위",
              summary: "Clickjacking·Tabjacking·Likejacking·Cookiejacking을 UI·세션 악용 방식으로 비교합니다.",
              sourcePdfPages: [204],
              keywords: ["Clickjacking", "Tabjacking", "Likejacking", "Cookiejacking", "iframe"],
              questionKeywords: ["Clickjacking", "Tabjacking", "Likejacking", "Cookiejacking", "투명한 iframe", "세션 쿠키"],
              blocks: [
                { type: "table", title: "모바일·브라우저 인터페이스 공격", columns: ["기법", "동작"], rows: [["Clickjacking", "투명한 iframe 등을 정상 화면 위에 겹쳐 사용자가 의도하지 않은 동작을 클릭하게 유도"], ["Tabjacking", "새 탭을 열게 한 뒤 사용자의 입력·행위를 가로채거나 의도하지 않은 작업을 수행"], ["Likejacking", "소셜 미디어의 좋아요 등 UI 조작으로 원치 않는 페이지·계정 활동을 발생"], ["Cookiejacking", "세션 쿠키를 탈취해 인증된 세션이나 개인정보에 접근"]] },
                { type: "bullets", title: "방어 포인트", items: ["프레임 삽입 방지 정책과 클릭·화면 전환에 대한 사용자 확인을 적용한다.", "쿠키의 보안 속성·세션 만료·재인증 정책을 적용하고, 링크·앱 권한 요청을 검증한다.", "모바일 앱은 출처가 확인된 스토어에서 설치하고 브라우저·OS 보안 업데이트를 유지한다."] }
              ],
              memoryPoints: ["Clickjacking=겹친 UI 클릭 유도, Tabjacking=탭 전환 악용, Likejacking=좋아요 조작, Cookiejacking=세션 쿠키 탈취다."]
            },
            {
              id: "other-malware-types",
              title: "기타 악성 소프트웨어",
              summary: "스파이웨어부터 크립토재킹까지 목적과 전달·실행 역할을 구분합니다.",
              sourcePdfPages: [204, 205],
              keywords: ["Spyware", "Adware", "Malvertising", "Downloader", "Dropper", "Injector", "Keylogger", "Crimeware", "Browser Hijacking", "Hoax", "Cryptojacking"],
              questionKeywords: ["스파이웨어", "Spyware", "애드웨어", "Adware", "Malvertising", "익스플로잇", "Downloader", "Dropper", "Injector", "Keylogger", "키로거", "Crimeware", "Browser Hijacking", "Joke", "Hoax", "Cryptojacking", "크립토재킹"],
              blocks: [
                { type: "table", title: "정보 수집·광고·전달형", columns: ["유형", "특징"], rows: [["Spyware", "동의 없이 민감정보·사용자 활동을 수집해 원격지로 전송"], ["Adware", "팝업·인터페이스 광고를 자동 표시하거나 과도한 광고 수익을 유도"], ["Malvertising", "온라인 광고 공간에 악성코드를 숨겨 광고 노출·클릭을 통해 감염 유도"], ["Exploit", "OS·응용프로그램의 버그를 이용해 권한 획득 또는 기능 실행을 시도하는 코드·프로그램"], ["Downloader", "감염 후 지정 주소에서 다른 악성 소프트웨어를 내려받아 실행"], ["Dropper", "내부에 포함·압축한 코드를 풀어 악성 프로그램을 생성·설치"]] },
                { type: "table", title: "실행·통제·기타 유형", columns: ["유형", "특징"], rows: [["Injector", "새 파일을 만들지 않고 정상 프로세스 메모리에 악성 코드를 주입. 교재는 dropper와 구분"], ["Keylogger", "키 이벤트를 기록·전송하고 화면·작업 기록을 저장할 수 있음"], ["Crimeware", "인터넷 범죄를 수행하기 위해 사용하는 악성 소프트웨어 모음"], ["Browser Hijacking", "홈페이지·검색 페이지 등을 바꾸어 브라우저를 통제"], ["Joke / Hoax", "심리적 위협을 주거나 장난·속임을 목적으로 퍼지는 가짜 바이러스"], ["Cryptojacking", "피해자 기기의 CPU·전력을 몰래 사용해 암호화폐 채굴"]] },
                { type: "text", title: "유사 유형 구분", paragraphs: ["Downloader는 외부에서 악성 프로그램을 내려받고, Dropper는 내부에 포함된 코드를 풀어 설치한다. Injector는 파일 설치보다 기존 프로세스 메모리 안에서 악성 코드를 실행시키는 데 초점을 둔다. 키로거는 입력 정보를 기록하는 기능이며 다른 악성코드에 포함될 수 있다."] }
              ],
              memoryPoints: ["Downloader=외부 다운로드, Dropper=내장 코드 설치, Injector=다른 프로세스 메모리에 주입이다.", "Spyware는 정보 수집, Adware는 광고 표시, Malvertising은 광고를 매개로 악성코드를 유포한다.", "Cryptojacking은 피해자의 컴퓨팅 자원을 몰래 암호화폐 채굴에 사용한다."]
            }
          ]
        },
        {
          id: "system-security-tools",
          title: "시스템 분석 도구",
          chapter: "시스템 도구 및 보안 솔루션",
          summary: "취약점 진단, 무결성 점검, 단말 보호와 내부 정보 유출 방지 도구를 목적별로 구분합니다.",
          status: "published",
          sourcePdfPages: [217, 218, 219, 220],
          concepts: [
            {
              id: "system-vulnerability-assessment",
              title: "시스템 취약점 분석과 진단 도구",
              summary: "대상 호스트 내부를 점검하는 시스템 진단과 네트워크 자산을 폭넓게 스캔하는 진단의 차이를 익힙니다.",
              sourcePdfPages: [217, 218],
              keywords: ["취약점 분석", "Nessus", "SATAN", "SARA", "SAINT", "COPS", "COPE", "nmap", "Nikto", "Lynis", "GFI LanGuard", "Kali Linux"],
              questionKeywords: ["시스템 취약점 분석", "네트워크 취약점 분석", "Nessus", "SATAN", "SARA", "SAINT", "COPS/COPE", "nmap", "Nikto", "Lynis", "Kali Linux", "X-Scan", "N-Stealth", "NATAS", "DVWA", "WebGoat"],
              blocks: [
                { type: "text", title: "진단 범위 구분", paragraphs: ["시스템 취약점 분석은 대상 서버 자체에서 패스워드 취약점, 내부 설정 오류, 파일 Permission, 운영체제 수준 취약점을 점검합니다. 호스트 내부를 확인하므로 해당 시스템의 취약 정보를 비교적 정확하게 얻을 수 있습니다.", "네트워크 취약점 분석은 네트워크에 분포한 여러 호스트와 자원을 대상으로 합니다. 별도 에이전트 없이 다수의 호스트를 스캔할 수 있어 범위가 넓고 관리가 쉽지만, 개별 호스트 내부 설정을 직접 검사하는 시스템 진단과 목적이 다릅니다."] },
                { type: "table", title: "교재 수록 도구", columns: ["도구", "주요 용도·특징"], rows: [["Nessus", "클라이언트-서버 구조의 네트워크 취약점 스캐너. 잘못된 설정, 민감 데이터 접근, 기본·빈 비밀번호 등을 점검하고 GUI를 제공"], ["SATAN / SARA / SAINT", "IP 네트워크의 원격 취약점 점검 도구. SATAN 기반인 SARA는 Unix·HTML 보고를 지원하고, SAINT도 Unix 기반 원격 진단과 HTML 보고를 제공"], ["COPS / COPE", "Unix 시스템 내부의 취약한 비밀번호, 비밀번호 정책, 파일 권한과 설정을 검사하는 관리용 점검 도구"], ["nmap / Nikto", "nmap은 호스트·네트워크·포트 스캔, Nikto는 웹 서버의 위험 파일·구버전 소프트웨어·기타 취약점 점검"], ["GFI LanGuard / Lynis", "GFI LanGuard는 취약점 탐지·패치 관리·네트워크 감사 통합, Lynis는 Linux·Unix 보안 감사와 하드닝 지원"], ["Kali Linux / X-Scan / N-Stealth", "Kali Linux는 Debian 기반 모의침투 배포판. X-Scan은 서버·FTP·CGI·메일·SQL·IIS·HTTP 등의 점검, N-Stealth는 웹 애플리케이션 스캐너로 교재에서 N-Stalker 통합을 언급"]] },
                { type: "bullets", title: "훈련 환경", items: ["NATAS, DVWA, WebGoat은 웹 취약점 점검과 서버 측 웹 보안 학습에 사용하는 훈련 환경으로 소개됩니다.", "하드닝은 운영체제나 애플리케이션의 설정을 강화해 공격·변경에 대한 내성을 높이는 과정입니다."] }
              ],
              memoryPoints: ["시스템 진단은 호스트 내부 설정·권한·OS 취약점, 네트워크 진단은 여러 호스트·자산의 폭넓은 스캔에 초점을 둡니다.", "nmap=네트워크·포트 스캔, Nikto=웹 서버 점검, COPS/COPE=Unix 내부 점검, Lynis=Unix 계열 보안 감사로 구분합니다."]
            },
            {
              id: "system-integrity-monitoring",
              title: "시스템 무결성 점검과 로그 감시 도구",
              summary: "기준 상태와 현재 파일 상태를 비교해 무단 변경을 찾고 로그 패턴을 감시하는 도구를 구분합니다.",
              sourcePdfPages: [219],
              keywords: ["무결성", "Tripwire", "Fcheck", "Samhain", "AIDE", "SWATCH", "Chklastlog", "wtmp", "lastlog", "aide --init"],
              questionKeywords: ["시스템 무결성", "Tripwire", "Fcheck", "Samhain", "AIDE", "SWATCH", "Simple WATCHer", "Chklastlog", "wtmp", "/var/log/lastlog", "aide --init", "파일 소유자", "파일 해시", "Syslog", "시스템 로그", "로그 감시", "시스템 로깅"],
              blocks: [
                { type: "text", title: "무결성 검사 원리", paragraphs: ["무결성 점검 도구는 주요 디렉터리·파일의 기준 정보를 저장하고 이후 상태와 비교해 허가되지 않은 변경을 찾습니다. 파일시스템 상태 추적은 침해를 조기에 탐지하고 포렌식 근거를 확보하는 데 도움이 됩니다.", "교재가 제시한 점검 항목은 파일 소유자·소유 그룹, 파일 크기, 최근 접근 시간, 주요 파일의 해시값 변경입니다. 운영체제별로 레지스트리 설정 등 파일 외의 중요 상태도 점검 대상이 될 수 있습니다."] },
                { type: "table", title: "점검·감시 도구", columns: ["도구", "기능"], rows: [["Tripwire", "중요 디렉터리와 파일의 상태를 데이터베이스로 만들고 현재 상태와 비교해 변경을 감지"], ["Fcheck", "파일 무결성 검사 프로그램. 사용·설정이 비교적 쉬워 소규모 환경에도 활용"], ["Samhain", "시스템 무결성을 점검하며 여러 시스템을 중앙에서 관리하는 기능 제공"], ["AIDE", "변조 파일 탐지 도구. 기준 데이터베이스를 초기화하는 명령은 `aide --init`"], ["SWATCH", "로그를 주기적으로 검색해 특정 패턴·키워드를 찾고 알림을 보내는 로그 감시 도구"], ["Chklastlog", "wtmp 로그인·로그아웃 항목과 `/var/log/lastlog` 사용자 정보를 대조해 운영체제별 로그 변조 단서를 확인"]] },
                { type: "bullets", title: "운영 시 주의", items: ["기준 데이터베이스 자체가 공격자에 의해 변조되지 않도록 접근을 제한하고, 안전한 위치에 보관합니다.", "정기 점검 주기와 변경 승인 기록을 함께 관리해야 정상 변경과 무단 변경을 구분할 수 있습니다."] }
              ],
              memoryPoints: ["Tripwire·Fcheck·Samhain·AIDE는 파일·시스템 상태의 변경을 확인하고, SWATCH는 로그 패턴을 감시합니다.", "AIDE 초기 DB 명령은 `aide --init`, Chklastlog는 wtmp와 `/var/log/lastlog`를 대조합니다."]
            },
            {
              id: "endpoint-security-solutions",
              title: "단말 보안 솔루션",
              summary: "패치·악성코드 대응에서 EDR의 탐지·통제·분석·치료, 모바일 기기 관리까지 살펴봅니다.",
              sourcePdfPages: [220],
              keywords: ["PMS", "Anti-Virus", "EDR", "Endpoint Detection and Response", "MDM", "Mobile Device Management"],
              questionKeywords: ["단말 보안", "PMS", "Patch Management System", "Anti-Virus", "EDR", "탐지 통제 분석 치료", "보안사고 탐지", "보안사고 통제", "보안사고 분석", "보안사고 치료", "MDM", "Mobile Device Management", "루팅 탐지"],
              blocks: [
                { type: "table", title: "단말 보안 기능", columns: ["솔루션", "기능"], rows: [["PMS", "기업 PC의 패치 설치 현황을 확인하고 패치를 배포·관리하는 패치 관리 시스템"], ["Anti-Virus", "컴퓨터 바이러스를 탐지·제거하고 감염을 방지하는 보안 솔루션"], ["EDR", "Endpoint Detection and Response. 단말 행위를 바탕으로 파일 기반 악성코드 외의 보안 사고도 탐지하고 사고를 억제·조사·복구"], ["MDM", "Mobile Device Management. 스마트폰·태블릿 등 모바일 기기의 보안·도난 방지, 앱·네트워크 설정, 자산과 관리 대상 기기 통제"]] },
                { type: "text", title: "EDR 대응 순서", paragraphs: ["교재는 EDR의 핵심 기능을 탐지·통제·분석·치료로 묶습니다. 탐지는 단말 행위에서 사고를 찾고, 통제는 확산이나 추가 행위를 억제하며, 분석은 사고 원인과 영향을 조사하고, 치료는 단말을 감염 이전 상태로 복구하는 대응을 뜻합니다."] },
                { type: "bullets", title: "MDM 관리 항목", items: ["기기의 루팅 여부를 탐지·차단하는 보안 및 도난 방지", "원격 앱 설치·관리와 기기 설정·네트워크 구성 관리", "조직에서 관리하는 단말의 자산·등록 상태 확인"] }
              ],
              memoryPoints: ["PMS=패치 관리, Anti-Virus=악성코드 탐지·제거, EDR=단말 사고 대응, MDM=모바일 기기 관리입니다.", "EDR 대응은 탐지→통제→분석→치료 순으로 기억합니다."]
            },
            {
              id: "internal-data-loss-prevention",
              title: "내부 정보 유출 방지 솔루션",
              summary: "문서 암호화·중앙화, DLP와 네트워크 방화벽을 유출 경로에 맞게 구분합니다.",
              sourcePdfPages: [220],
              keywords: ["정보 유출", "DRM", "DLP", "문서중앙화", "네트워크 방화벽"],
              questionKeywords: ["내부 정보 유출", "문서 암호화", "DRM", "DLP", "문서중앙화", "문서 중앙화", "네트워크 방화벽", "메일", "메신저", "웹메일"],
              blocks: [
                { type: "table", title: "유출 방지 방식", columns: ["솔루션", "차단 대상·방식"], rows: [["문서 암호화(DRM)", "문서를 암호화해 보호합니다. 교재는 암호화 문서가 외부로 유출되어도 권한 없는 외부에서 복호화되지 않아야 한다는 점을 제시합니다."], ["DLP", "메일·메신저·웹 등을 통한 중요 정보의 유출을 탐지하고 차단합니다."], ["문서중앙화", "문서 작업 결과가 사용자 PC에 남지 않게 중앙에서 관리해 로컬 파일 유출을 어렵게 합니다."], ["네트워크 방화벽", "PC 메신저·웹메일 등 정보 유출 수단으로 쓰이는 네트워크 서비스·도메인을 기준으로 접근을 차단합니다."]] },
                { type: "bullets", title: "선택 기준", items: ["파일 자체를 보호해야 하면 문서 암호화, 유출 내용·경로를 감시해야 하면 DLP를 적용합니다.", "로컬 저장을 줄이려면 문서중앙화, 특정 네트워크 서비스 접속을 통제하려면 네트워크 방화벽을 사용합니다.", "하나의 통제만으로 모든 유출 경로를 막을 수 없으므로 문서·단말·네트워크 통제를 함께 설계합니다."] }
              ],
              memoryPoints: ["DRM은 문서를 암호화하고, DLP는 유출 내용을 탐지·차단하며, 문서중앙화는 PC 로컬 저장을 줄입니다.", "네트워크 방화벽은 메신저·웹메일 등 네트워크 경로를 통제합니다."]
            }
          ]
        },
        {
          id: "other-system-topics",
          title: "기타 시스템 보안 주제",
          chapter: "클라우드·신기술·저장장치·콘텐츠 보안",
          summary: "클라우드와 AI부터 저장장치, IoT, 블록체인, 콘텐츠 보호까지 시스템 보안의 확장 주제를 정리합니다.",
          status: "published",
          sourcePdfPages: Array.from({ length: 19 }, (_, index) => index + 227),
          concepts: [
            {
              id: "cloud-security",
              title: "클라우드 서비스 모델과 보안",
              summary: "IaaS·PaaS·SaaS의 제공 범위, 클라우드 위협, SECaaS와 CASB의 역할을 구분합니다.",
              sourcePdfPages: [227, 228, 229],
              keywords: ["클라우드", "Cloud", "IaaS", "PaaS", "SaaS", "SECaaS", "CASB", "하이퍼바이저", "멀티테넌시"],
              questionKeywords: ["클라우드", "Cloud Computing", "IaaS", "PaaS", "SaaS", "SECaaS", "CASB", "Cloud Access Security Broker", "취약점 상속", "가상 머신", "하이퍼바이저", "멀티테넌시", "Auto Scale-Out"],
              blocks: [
                { type: "text", title: "서비스 모델", paragraphs: ["클라우드 컴퓨팅은 가상화된 서버·스토리지·네트워크·애플리케이션 자원을 필요할 때 빌려 쓰고 사용량에 따라 비용을 지불하는 방식입니다.", "IaaS는 서버·스토리지·네트워크 같은 기반 자원을, PaaS는 애플리케이션 개발·실행 환경을, SaaS는 완성된 애플리케이션을 서비스로 제공합니다. 서비스 모델이 높아질수록 이용자가 직접 관리할 인프라 범위는 줄고 제공자의 관리 범위는 커집니다."] },
                { type: "table", title: "서비스 모델 비교", columns: ["모델", "제공 범위와 특징"], rows: [["IaaS", "기반 하드웨어 자원을 서비스로 제공. 수요에 따른 확장과 사용량 기반 과금으로 직접 장비를 구매하는 비용을 줄임"], ["PaaS", "앱 실행·개발 환경을 제공. 즉시 개발·배포, 컨테이너 기반의 경량 환경, 인프라 관리 부담 축소"], ["SaaS", "사용자에게 애플리케이션을 제공. 멀티테넌시 환경에서 자원을 사용자별로 격리·할당하고 제공자가 소프트웨어 계층까지 유지관리"]] },
                { type: "table", title: "클라우드 위협과 통제", columns: ["위협", "발생 원인·영향"], rows: [["서비스 거부와 자원 고갈", "DoS/DDoS가 Auto Scale-Out을 과도하게 유발하면 가상 머신이 불필요하게 늘어 자원 고갈·서비스 중단이 발생할 수 있음"], ["패킷 변조·계정 탈취", "네트워크 도청·변조, 탈취한 인증정보나 변조된 권한을 이용한 비인가 접근"], ["가상화 계층 위협", "하이퍼바이저 취약점·감염, 가상 머신 간 연결을 통한 악성코드 확산"], ["가상 머신 이동·가시성 한계", "이동 과정에서 패치되지 않은 환경이 전파될 수 있고, 기존 방화벽·IDS/IPS가 가상화 내부 트래픽을 충분히 통제하지 못할 수 있음"], ["위탁·공유 집중", "정보를 서비스 제공자에게 위탁하고 다수 사용자·데이터가 자원을 공유하므로 관리 복잡성, 유출과 장애 영향이 커질 수 있음"]] },
                { type: "table", title: "클라우드 보안 서비스", columns: ["기술", "역할"], rows: [["SECaaS", "클라우드 인프라를 통해 전문 보안 기능을 서비스로 제공하는 모델"], ["CASB", "클라우드 이용자와 제공자 사이에서 접근 통제, 내부 정보 유출 방지, 이상 탐지, 로깅·감사를 제공"]] }
              ],
              memoryPoints: ["IaaS=인프라, PaaS=개발·실행 플랫폼, SaaS=완성된 소프트웨어입니다.", "위탁·공유·가상화·동적 확장이 클라우드 보안의 주요 고려사항이며, CASB는 이용자와 제공자 사이의 통제 지점입니다."]
            },
            {
              id: "ai-security",
              title: "인공지능과 AI 보안 공격",
              summary: "AI·머신러닝·딥러닝의 포함 관계와 적대적 공격, AI를 이용한 정교한 공격을 구별합니다.",
              sourcePdfPages: [229, 230, 231],
              keywords: ["인공지능", "AI", "머신러닝", "딥러닝", "적대적 공격", "Poisoning", "Evasion", "Model Extraction", "Data Inversion", "Deepfake"],
              questionKeywords: ["인공지능", "Artificial Intelligence", "머신러닝", "Machine Learning", "딥러닝", "Deep Learning", "적대적 공격", "Adversarial Attack", "포이즈닝", "Poisoning", "이베이전", "Evasion", "Model Extract", "Data Inversion", "Spear Phishing", "딥페이크", "Deep Fake", "GAN"],
              blocks: [
                { type: "diagram", title: "AI 기술의 포함 관계", nodes: [{ label: "인공지능", detail: "컴퓨터가 지적 행동을 모방" }, { label: "머신러닝", detail: "데이터에서 패턴을 학습" }, { label: "딥러닝", detail: "인공신경망을 이용하는 머신러닝" }], caption: "교재의 관계: 딥러닝 ⊂ 머신러닝 ⊂ 인공지능. 학습 데이터의 품질은 분석 정확도에 영향을 줍니다." },
                { type: "table", title: "적대적 공격 유형", columns: ["유형", "공격 방식"], rows: [["포이즈닝(Poisoning)", "학습에 잘못된 데이터를 제공해 모델의 학습 결과를 오염"], ["이베이전(Evasion)", "입력 데이터에 사람이 거의 알아차리지 못할 변화를 주어 모델의 분류 결과를 속임"], ["모델 추출(Model Extraction)", "공개 모델의 입력·출력 결과를 이용해 모델을 모사하거나 탈취"], ["데이터 인버전(Model/Data Inversion)", "모델의 응답으로 학습 데이터를 추정·복원해 정보 유출을 유발"]] },
                { type: "table", title: "AI를 활용한 정교한 공격", columns: ["유형", "교재 설명"], rows: [["스피어 피싱", "공격 대상 정보를 사전에 수집해 공격 시간을 단축하고 표적화하는 방식"], ["딥페이크", "GAN의 생성자와 판별자가 경쟁 학습해 실제와 구분하기 어려운 이미지·영상 등 합성 콘텐츠를 생성"]] }
              ],
              memoryPoints: ["딥러닝은 머신러닝의 한 종류이고, 머신러닝은 AI 방식 중 하나입니다.", "Poisoning은 학습 데이터, Evasion은 입력·추론 결과, Model Extraction은 모델, Data Inversion은 학습 데이터 추정에 초점을 둡니다."]
            },
            {
              id: "storage-backup",
              title: "스토리지와 백업 관리",
              summary: "DAS·NAS·SAN과 WORM의 저장 방식, SLA 가용성 지표, 전체·차등·증분 백업을 비교합니다.",
              sourcePdfPages: [231, 232, 233],
              keywords: ["스토리지", "DAS", "NAS", "SAN", "WORM", "백업", "MTBF", "MTTF", "MTTR", "SLA", "증분백업", "차등백업"],
              questionKeywords: ["스토리지", "DAS", "NAS", "SAN", "WORM", "Write Once Read Many", "백업", "전체 백업", "차등 백업", "증분 백업", "Archive Bit", "아카이브 비트", "MTD", "SLA", "MTBF", "MTTF", "MTTR", "가용성"],
              blocks: [
                { type: "table", title: "스토리지 유형", columns: ["유형", "연결·특징"], rows: [["DAS", "서버 안이나 서버에 직접 연결하는 저장장치. 구조가 단순"], ["NAS", "LAN을 통해 연결하고 파일 기반 I/O를 처리하는 전용 스토리지"], ["SAN", "저장장치 전용 고속 네트워크로 연결. DAS의 빠른 처리와 NAS의 공유 특성을 결합"]] },
                { type: "text", title: "WORM 스토리지", paragraphs: ["WORM(Write Once Read Many)은 한 번 기록한 데이터를 정해진 보존 기간 동안 삭제·변경할 수 없게 하는 저장 방식입니다. 개인정보 접속 기록 보관과 로그 변조 방지에 쓰이며 랜섬웨어·악성코드로부터 보존 데이터를 보호합니다."] },
                { type: "table", title: "SLA와 가용성 지표", columns: ["지표", "의미·공식", "방향"], rows: [["MTBF", "평균 고장 간격 시간. MTBF = MTTF + MTTR", "길수록 좋음"], ["MTTF", "평균 운영 시간. MTTF = 총 운영 시간 ÷ 총 고장 건수", "길수록 좋음"], ["MTTR", "평균 수리 시간. MTTR = 총 수리 시간 ÷ 총 고장 건수", "짧을수록 좋음"], ["가용성", "MTTF ÷ MTBF = MTTF ÷ (MTTF + MTTR)", "높을수록 좋음"]] },
                { type: "table", title: "데이터 백업 방식", columns: ["방식", "백업 범위·특징", "복구 관점"], rows: [["전체(Full)", "선택한 데이터 전체를 백업. 아카이브 비트를 해제하며 매체와 시간이 많이 필요", "복구가 단순하지만 전체 백업 시간이 큼"], ["차등(Differential)", "마지막 전체 백업 이후 변경된 데이터를 백업. 전체 백업 이후의 변경 표시를 유지", "복구 시 전체 백업과 가장 최근 차등 백업이 필요. 시간이 지나며 백업량 증가"], ["증분(Incremental)", "마지막 전체 또는 증분 백업 이후 변경된 데이터만 백업", "백업량은 절약하지만 복구 시 전체 백업 이후의 증분 세트를 순서대로 적용"]] },
                { type: "bullets", title: "백업 계획", items: ["아카이브 비트는 새로 생성되거나 변경된 파일에 설정되는 백업 필요 표시입니다.", "중요 소프트웨어 복사본을 둘 이상 보유하고, 한 사본은 운영 위치와 떨어진 안전한 사이트에 보관하도록 교재는 권고합니다.", "장비 복구 목표와 SLA를 함께 검토하고 실제 복원 가능성까지 점검합니다."] }
              ],
              memoryPoints: ["MTBF=MTTF+MTTR, 가용성=MTTF/(MTTF+MTTR)입니다.", "차등은 마지막 전체 백업 뒤의 변경분, 증분은 마지막 백업 뒤의 변경분입니다.", "WORM은 보존 기간 중 기록을 변경·삭제하지 못하게 하는 저장 방식입니다."]
            },
            {
              id: "raid-levels",
              title: "RAID 레벨과 장애 허용 특성",
              summary: "스트라이핑·미러링·패리티 방식과 RAID 0~6 및 중첩 레벨의 성능·복구 차이를 비교합니다.",
              sourcePdfPages: [233, 234, 235],
              keywords: ["RAID", "스트라이핑", "미러링", "패리티", "독립 디스크", "디스크 어레이"],
              questionKeywords: ["RAID", "Redundant Array", "RAID 0", "RAID 1", "RAID 2", "RAID 3", "RAID 4", "RAID 5", "RAID 6", "RAID 0+1", "RAID 1+0", "패리티", "스트라이핑", "미러링"],
              blocks: [
                { type: "text", title: "RAID의 목적", paragraphs: ["RAID(Redundant Array of Independent Disks)는 여러 저용량 디스크를 배열로 구성해 데이터를 분산·중복 저장하는 기술입니다. 레벨마다 성능, 사용 가능 용량, 신뢰성 및 장애 허용 범위가 다릅니다."] },
                { type: "table", title: "RAID 0~4", columns: ["레벨", "저장 방식", "장점·제약"], rows: [["RAID 0", "패리티·오류 검출 없이 데이터를 스트라이핑", "최소 2개 디스크. 성능 향상과 전체 용량 활용에 유리하지만 디스크 장애 시 데이터 안전성을 보장하지 못함"], ["RAID 1", "동일 데이터를 2개 이상 디스크에 미러링", "최소 2개. 장애 시 다른 사본으로 서비스할 수 있으나 사용 가능 용량이 줄어듦"], ["RAID 2", "비트 단위 스트라이핑과 해밍 코드 기반 ECC", "전용 디스크에 ECC 정보를 두며 추가 연산·디스크가 필요해 속도가 느림"], ["RAID 3", "바이트 단위 스트라이핑과 별도 전용 패리티 디스크", "최소 3개. 한 디스크 장애를 복구할 수 있지만 패리티 디스크에 병목이 생길 수 있음"], ["RAID 4", "블록 단위 스트라이핑과 별도 전용 패리티 디스크", "최소 3개. 읽기는 유리하지만 쓰기 시 전용 패리티 디스크가 병목이 될 수 있음"]] },
                { type: "table", title: "RAID 5~6 및 중첩 레벨", columns: ["레벨", "저장 방식", "핵심 비교"], rows: [["RAID 5", "최소 3개. 데이터와 패리티를 여러 디스크에 분산", "분산 패리티로 성능과 안정성의 균형을 제공하며 단일 디스크 장애를 허용"], ["RAID 6", "최소 4개. 독립적인 패리티 정보를 두 벌 분산 저장", "두 디스크 장애까지 허용하도록 설계되어 RAID 5보다 여유가 크고 저장 효율은 낮음"], ["RAID 0+1", "RAID 0 스트라이프 세트 두 개를 서로 미러링", "속도와 복제성을 결합. 장애가 발생한 세트 전체가 이탈하는 방식으로 동작"], ["RAID 1+0 (RAID 10)", "미러링한 쌍을 다시 스트라이핑", "속도와 미러링을 결합. 서로 다른 미러 쌍에서 장애가 나면 추가 디스크 장애도 견딜 수 있으나 같은 쌍의 양쪽 디스크 장애는 복구 불가"]] },
                { type: "bullets", title: "그림으로 기억", items: ["RAID 0=분산 저장만, RAID 1=동일 복제, RAID 5=분산 단일 패리티, RAID 6=분산 이중 패리티입니다.", "RAID 0+1은 먼저 스트라이핑 후 미러링하고, RAID 1+0은 먼저 미러링한 뒤 스트라이핑합니다."] }
              ],
              memoryPoints: ["RAID 0은 장애 허용이 없고 RAID 1은 미러링, RAID 5는 분산 패리티, RAID 6은 이중 분산 패리티입니다.", "RAID 3은 바이트 스트라이핑, RAID 4는 블록 스트라이핑이며 둘 다 전용 패리티 디스크 병목이 생길 수 있습니다.", "RAID 0+1과 RAID 1+0의 중첩 순서를 구분합니다."]
            },
            {
              id: "reverse-engineering-debugging",
              title: "리버스 엔지니어링과 디버깅",
              summary: "프로그램 제작의 역방향 분석, 화이트·블랙·그레이박스, 분석 도구와 Core Dump를 학습합니다.",
              sourcePdfPages: [235, 236, 237],
              keywords: ["리버스 엔지니어링", "역공학", "컴파일러", "인터프리터", "디버깅", "OllyDbg", "PE", "Core Dump", "ulimit -c"],
              questionKeywords: ["리버스 엔지니어링", "역공학", "화이트박스", "블랙박스", "그레이박스", "컴파일러", "인터프리터", "OllyDbg", "Code View", "Register View", "Dump View", "Stack View", "Procexp", "FileMonitor", "ltrace", "디버깅", "Core Dump", "ulimit -c"],
              blocks: [
                { type: "text", title: "프로그램 변환과 역공학", paragraphs: ["일반적인 개발은 원시 프로그램을 컴파일러가 목적 프로그램으로 변환합니다. 리버스 엔지니어링은 완성된 프로그램을 분석해 내부 구조·동작을 이해하거나 소스 수준 정보를 재구성하는 역방향 분석입니다.", "컴파일러는 원시 프로그램 전체를 목적 코드로 번역하고, 인터프리터는 원시 프로그램을 한 줄씩 해석해 실행하며 별도의 목적 프로그램을 만들지 않습니다."] },
                { type: "table", title: "분석 방식과 사례", columns: ["방식·사례", "설명"], rows: [["화이트박스", "소스 코드와 내부 구조를 직접 분석해 프로그래밍·구현 오류를 찾음"], ["블랙박스", "내부 구조를 고려하지 않고 외부에서 관찰되는 입력·출력 행위로 분석"], ["그레이박스", "일부 내부 정보를 가진 상태에서 외부 행위와 내부 정보를 함께 분석"], ["패치", "파일이나 프로세스 메모리 내용을 변경하는 작업. 보안 업데이트도 패치 사례"], ["크랙", "패치와 유사한 기술을 불법·비도덕적 목적으로 사용하는 행위"]] },
                { type: "table", title: "분석 도구", columns: ["도구·화면", "확인 대상"], rows: [["OllyDbg", "Windows PE 파일의 동작을 디버깅하고 기계어를 어셈블리어로 표시"], ["Code View", "디스어셈블된 코드"], ["Register View", "레지스터 값"], ["Dump View", "메모리 주소의 헥사·ASCII·유니코드 값"], ["Stack View", "스택 포인터가 가리키는 스택 메모리"], ["Procexp / FileMonitor", "프로세스 동작 정보 / 파일 이벤트 정보"], ["ltrace", "Linux 애플리케이션이 호출하는 공유 라이브러리 함수를 추적·출력"]] },
                { type: "code", title: "Core Dump 크기 제한 확인·설정", language: "bash", code: "ulimit -c" },
                { type: "bullets", title: "Core Dump 해석", items: ["Core Dump에는 비정상 종료 당시 프로그램의 메모리와 Call Stack 정보가 포함될 수 있습니다.", "교재는 원격지와 주고받은 네트워크 패킷 정보는 Core Dump로 확인할 수 없다고 구분합니다.", "현재 실행 프로그램도 종료 상황에 따라 Core Dump 생성 대상이 될 수 있습니다."] }
              ],
              memoryPoints: ["컴파일러는 전체 번역, 인터프리터는 한 줄씩 해석·실행합니다.", "화이트박스=내부 코드 분석, 블랙박스=외부 관찰, 그레이박스=일부 내부 정보 활용입니다.", "`ulimit -c`는 Core Dump 파일 크기 제한을 다루며, Core Dump에 네트워크 패킷이 저장되는 것은 아닙니다."]
            },
            {
              id: "system-and-app-hardening",
              title: "운영체제·애플리케이션 하드닝",
              summary: "불필요한 기능 제거·패치·감사와 앱 난독화·안티디버깅·패킹으로 분석과 침입 내성을 높입니다.",
              sourcePdfPages: [238],
              keywords: ["하드닝", "Hardening", "난독화", "Obfuscation", "안티디버깅", "Binary Packing", "바이너리 패킹"],
              questionKeywords: ["하드닝", "Hardening", "OS 하드닝", "앱 하드닝", "운영체제 패치", "불필요한 포트", "난독화", "Obfuscation", "안티디버깅", "Anti-Debugging", "바이너리 패킹", "Binary Packing"],
              blocks: [
                { type: "text", title: "하드닝", paragraphs: ["하드닝은 운영체제나 애플리케이션을 리버스 엔지니어링·조작·모니터링·침입에 더 견고하게 만드는 보안 강화 과정입니다."] },
                { type: "table", title: "하드닝 활동", columns: ["대상·활동", "적용 내용"], rows: [["OS: 불필요한 SW 제거", "사용하지 않는 소프트웨어와 기능을 삭제해 공격 표면 축소"], ["OS: 감사·로그 설정", "감사 기능과 로깅을 활성화해 행위를 추적"], ["OS: 패치", "운영체제 보안 업데이트 적용"], ["OS: 포트 통제", "방화벽에서 미사용 통신 포트를 차단"], ["OS: 보안 프로그램", "필요한 보안 프로그램을 사전에 설치"], ["앱: 난독화", "소스나 실행 파일의 가독성을 낮춰 분석·이해를 어렵게 함"], ["앱: 안티디버깅", "실행 중 디버깅·분석을 방지"], ["앱: 바이너리 패킹", "실행 전 애플리케이션을 암호화·패킹해 분석을 어렵게 함"]] }
              ],
              memoryPoints: ["OS 하드닝은 최소화·로그·패치·포트 차단·보안 프로그램, 앱 하드닝은 난독화·안티디버깅·패킹입니다."]
            },
            {
              id: "byod-security",
              title: "BYOD와 모바일 업무 환경 보안",
              summary: "개인 소유 단말을 업무에 사용하는 BYOD와 모바일 가상화·VDI·DaaS 보호 방식을 구분합니다.",
              sourcePdfPages: [238, 239],
              keywords: ["BYOD", "CYOD", "모바일 가상화", "VDI", "DaaS", "Virtual Desktop Infrastructure"],
              questionKeywords: ["BYOD", "Bring Your Own Device", "CYOD", "Choose Your Own Device", "모바일 가상화", "Mobile Virtualization", "Hypervisor", "VDI", "Virtual Desktop Infrastructure", "DaaS", "Desktop as a Service"],
              blocks: [
                { type: "text", title: "BYOD와 CYOD", paragraphs: ["BYOD(Bring Your Own Device)는 개인이 소유한 노트북·스마트폰·태블릿을 직장 업무에 사용하는 관리 체계입니다. CYOD(Choose Your Own Device)는 조직이 허용한 선택지 중 업무용 단말을 선택해 사용하는 방식으로 교재에서 대비합니다."] },
                { type: "table", title: "BYOD 보안 기술", columns: ["기술", "보호 방식"], rows: [["모바일 가상화", "하나의 모바일 기기에 동일 OS의 업무용·개인용 인스턴스를 분리해 함께 제공"], ["VDI", "서버에서 사용자별 가상 데스크톱 환경을 제공"], ["DaaS", "가상 데스크톱 환경을 클라우드 서비스로 제공"]] },
                { type: "bullets", title: "기술 선택 기준", items: ["모바일 가상화는 한 단말에서 업무용·개인용 인스턴스를 분리하고, VDI는 서버에서 가상 데스크톱을 제공하며, DaaS는 이를 클라우드 서비스로 제공합니다."] }
              ],
              memoryPoints: ["BYOD는 직원 개인 기기를 업무에 사용, CYOD는 조직이 정한 기기 선택지에서 업무 단말을 선택하는 방식입니다.", "모바일 가상화는 단말 내부 분리, VDI는 서버의 가상 데스크톱, DaaS는 클라우드 데스크톱 서비스입니다."]
            },
            {
              id: "rfid-iot-security",
              title: "RFID와 IoT 보안",
              summary: "RFID의 통신 공격과 태그 보호 기술, IoT 기기의 보안 취약 원인과 요구사항을 연결합니다.",
              sourcePdfPages: [239, 240, 241],
              keywords: ["RFID", "Radio Frequency Identification", "IoT", "Internet of Things", "Hash Lock", "Challenge-Response"],
              questionKeywords: ["RFID", "Radio Frequency Identification", "도청", "트래픽 분석", "세션 가로채기", "Kill 명령", "Sleep", "Wake", "블로커 태그", "Faraday Cage", "Active Jamming", "Hash Lock", "Randomized Hash Lock", "원타임 패드", "해시 체인", "IoT", "사물인터넷", "Challenge-Response", "물리적 보안", "펌웨어 업데이트"],
              blocks: [
                { type: "text", title: "RFID 위협", paragraphs: ["RFID는 소형 반도체 태그의 식별 정보를 무선 주파수로 판독·추적하는 기술입니다. 리더와 태그 간 통신을 도청하거나 트래픽을 분석하고, 태그 정보를 위·변조하거나 세션을 가로채고, 과도한 요청으로 서비스 거부를 일으킬 수 있습니다."] },
                { type: "table", title: "RFID 보호 기술", columns: ["분류·기술", "동작"], rows: [["Kill 명령", "태그를 영구적으로 비활성화"], ["Sleep / Wake", "태그를 일시 정지하고 안전한 장소에서 다시 활성화"], ["블로커 태그", "전용 IC 태그로 주변 태그 ID가 읽히는 것을 차단"], ["Faraday Cage", "금속 차폐 공간으로 무선 주파수를 차단"], ["Active Jamming", "강한 전파를 발생시켜 RFID 통신을 교란"], ["Hash Lock", "해시값으로 생성한 ID를 전송해 저장 ID를 보호"], ["Randomized Hash Lock", "난수를 교환하는 Challenge-Response를 적용한 Hash Lock 확장"], ["XOR 기반 원타임 패드", "태그 비밀키를 이용해 리더 메시지를 XOR 변환해 전송"], ["재암호화", "공개키 암호화 방식으로 데이터를 암호화해 전송"], ["해시 체인", "해시값을 반복 갱신하고 통신 때 이전 해시값을 전달"]] },
                { type: "table", title: "IoT 위협 원인과 보안 요구", columns: ["항목", "위험", "요구사항"], rows: [["물리적 보안", "물리적 보호 취약", "물리 인터페이스 차단"], ["인증", "인증 부재, 약한 비밀번호, 접근 통제 부재", "인증·접근 통제와 IoT 제품 간 상호 인증"], ["암호화", "취약한 알고리즘·키 길이", "안전한 알고리즘, 키 관리, 난수 생성"], ["데이터 보호", "전송 데이터 보호 부재, 평문 저장, 무결성 부재", "안전한 통신 채널, 저장·전송 데이터 및 개인정보 보호"], ["플랫폼", "설정·실행 코드 무결성 부재, 취약한 업데이트, 사고 추적 불가", "무결성 검증, 안전한 펌웨어·소프트웨어 업데이트, 감시 로그 기록"]] },
                { type: "text", title: "Challenge-Response", paragraphs: ["서버가 임의의 난수(Challenge)를 보내면 클라이언트가 비밀키를 이용해 응답(Response)을 만들고 서버가 이를 검증합니다. 같은 비밀을 직접 전송하지 않고 난수 기반 응답을 확인하는 인증 방식입니다."] }
              ],
              memoryPoints: ["RFID 보호는 비암호화 방식(Kill·Sleep/Wake·Blocker·차폐·전파 교란)과 암호화·인증 방식(Hash Lock 계열 등)을 구분합니다.", "IoT 요구사항은 물리 보호, 인증·접근 통제, 안전한 암호·키, 데이터 보호, 플랫폼 무결성·안전 업데이트·로그입니다."]
            },
            {
              id: "quantum-and-post-quantum-crypto",
              title: "양자 컴퓨팅과 양자·양자내성 암호",
              summary: "큐비트·양자 게이트, 양자 키 분배(QKD), 양자내성 암호의 기반 문제 유형을 비교합니다.",
              sourcePdfPages: [241, 242],
              keywords: ["양자 컴퓨팅", "Quantum Computer", "큐비트", "Qubits", "양자 게이트", "QKD", "BB84", "양자내성 암호", "PQC"],
              questionKeywords: ["양자 컴퓨팅", "Quantum Computer", "큐비트", "Qubits", "Superposition", "양자 게이트", "Quantum Gates", "양자 암호", "Quantum Cryptography", "QKD", "Quantum Key Distribution", "BB84", "양자내성 암호", "PQC", "Post-Quantum Cryptography", "다변수 기반", "코드 기반", "해시 기반"],
              blocks: [
                { type: "text", title: "양자 계산의 구성", paragraphs: ["양자 컴퓨팅은 양자역학적 현상을 이용해 자료를 처리합니다. 큐비트는 기본 정보 단위로, 일반 비트처럼 0 또는 1만 갖는 것이 아니라 중첩 상태에서 0과 1의 상태를 함께 나타낼 수 있습니다. 양자 게이트는 큐비트에 연산을 수행합니다."] },
                { type: "table", title: "양자 암호와 양자내성 암호", columns: ["구분", "핵심", "교재의 예·기반"], rows: [["양자 암호", "양자 채널의 양자 특성을 이용해 비밀키를 분배(QKD)", "BB84는 양자 채널을 이용해 비밀키를 공유하는 프로토콜"], ["양자내성 암호(PQC)", "양자 컴퓨터 공격에 안전하도록 설계한 공개키 암호 계열", "다변수 기반은 다변수 함수 문제, 코드 기반은 선형 코드 디코딩 난도, 해시 기반은 해시 함수의 안전성을 이용"]] },
                { type: "bullets", title: "혼동 방지", items: ["양자 암호는 양자 통신 채널과 QKD를 활용하는 새로운 보안 체계입니다.", "양자내성 암호는 기존 암호 체계를 양자 컴퓨터 공격에 견디도록 강화하는 암호 설계 계열입니다."] }
              ],
              memoryPoints: ["큐비트는 중첩 상태를 표현하고, 양자 게이트가 연산을 수행합니다.", "QKD·BB84는 양자 키 분배, PQC는 양자 컴퓨터 공격에 대비하는 암호입니다.", "교재의 PQC 기반 분류: 다변수·코드·해시 기반."]
            },
            {
              id: "blockchain-merkle-tree",
              title: "블록체인과 머클 트리",
              summary: "P2P 분산원장, 블록 헤더의 구성요소, 작업증명용 논스와 머클 루트의 역할을 익힙니다.",
              sourcePdfPages: [242],
              keywords: ["블록체인", "Blockchain", "분산원장", "Merkle Tree", "머클 트리", "Proof of Work", "논스"],
              questionKeywords: ["블록체인", "Blockchain", "분산원장", "Ledger", "P2P", "Peer to Peer", "블록 헤더", "이전 블록 해시", "머클 루트", "Merkle Tree", "타임스탬프", "난이도 목표", "논스", "Nonce", "작업증명", "PoW", "Proof of Work"],
              blocks: [
                { type: "text", title: "분산원장", paragraphs: ["블록체인은 거래 원장을 특정 기관의 중앙 서버 대신 참가자들이 구성한 P2P 네트워크에 분산하고 공동으로 기록·관리하는 기술입니다. 블록이 이전 블록의 해시를 참조해 연결됩니다."] },
                { type: "table", title: "블록 헤더 구성요소", columns: ["요소", "역할"], rows: [["버전", "블록·트랜잭션 규칙의 버전 정보"], ["이전 블록 해시", "현재 블록을 앞선 블록과 연결"], ["머클 루트", "트랜잭션 해시 트리의 최상단 해시"], ["타임스탬프", "블록 생성 시간(UTC 기준)"], ["난이도 목표", "블록 생성 난이도를 결정"], ["논스(Nonce)", "작업증명(PoW) 조건을 만족하도록 조정하는 값"]] },
                { type: "text", title: "머클 트리", paragraphs: ["머클 트리는 대량의 데이터를 해시 기반 트리로 구성해 효율적으로 관리·검증하는 구조입니다. 블록체인은 트랜잭션 데이터의 해시를 단계적으로 결합하고 최종 머클 루트를 블록에 기록해 데이터 검증에 활용합니다."] }
              ],
              memoryPoints: ["블록은 이전 블록 해시로 연결되고 머클 루트는 트랜잭션 해시 트리의 최상단 값입니다.", "논스는 작업증명 값을 찾기 위해 조정하고, 타임스탬프는 UTC 기준 생성 시각입니다."]
            },
            {
              id: "elasticsearch-basics",
              title: "Elasticsearch 구조와 분석기 처리",
              summary: "클러스터·노드·샤드·복제의 역할, Index·Document·Field와 텍스트 분석 순서를 설명합니다.",
              sourcePdfPages: [243],
              keywords: ["Elasticsearch", "클러스터", "노드", "샤드", "복제", "인덱스", "도큐먼트", "필드", "Tokenizer"],
              questionKeywords: ["Elasticsearch", "Cluster", "Node", "Shard", "Replica", "Index", "Document", "Field", "Character Filter", "Tokenizer", "Token Filter", "분석기 모듈", "분석기 처리 절차"],
              blocks: [
                { type: "text", title: "검색·분석 엔진", paragraphs: ["Elasticsearch는 대용량 데이터를 빠르게 검색·분석하도록 설계된 분산형 오픈소스 검색·분석 엔진입니다. 보안 분야에서는 네트워크 로그를 수집하고 검색·분석하는 데 활용됩니다."] },
                { type: "table", title: "구성요소와 데이터 단위", columns: ["요소", "설명", "RDBMS 비교"], rows: [["클러스터(Cluster)", "하나 이상의 노드가 모인 집합", "분산 검색 단위"], ["노드(Node)", "Elasticsearch가 실행 중인 프로세스·인스턴스", "서버 인스턴스"], ["샤드(Shard)", "데이터를 분할해 저장하는 기본 단위", "분산 저장 단위"], ["복제(Replica)", "가용성과 내결함성을 높이기 위한 추가 샤드", "복제본"], ["인덱스(Index)", "여러 도큐먼트가 저장되는 논리 단위", "Database와 유사"], ["도큐먼트(Document)", "JSON 객체로 표현하는 데이터의 최소 단위", "Row와 유사"], ["필드(Field)", "도큐먼트 내부 데이터의 속성·값과 타입", "Column과 유사"]] },
                { type: "diagram", title: "분석기 처리 순서", nodes: [{ label: "Character Filter", detail: "문자 대치·제거" }, { label: "Tokenizer", detail: "문장을 토큰으로 분리" }, { label: "Token Filter", detail: "불용어 제거·형태소 분석 등" }], caption: "문자 필터 → 토크나이저 → 토큰 필터 순서로 텍스트를 처리합니다." }
              ],
              memoryPoints: ["클러스터는 노드 집합, 샤드는 분할 저장 단위, 복제는 가용성·내결함성용 추가 샤드입니다.", "Elasticsearch 분석 순서는 Character Filter→Tokenizer→Token Filter입니다.", "Index는 Database, Document는 Row, Field는 Column과 유사합니다."]
            },
            {
              id: "digital-content-protection",
              title: "DRM·스테가노그래피·워터마크·핑거프린트",
              summary: "디지털 저작물의 권한 관리와 은닉·소유자 표시·유출자 추적 기술을 구별합니다.",
              sourcePdfPages: [244, 245],
              keywords: ["DRM", "Digital Rights Management", "스테가노그래피", "Steganography", "디지털 워터마크", "핑거프린트", "Fingerprint"],
              questionKeywords: ["DRM", "Digital Rights Management", "콘텐츠 제공자", "콘텐츠 소비자", "콘텐츠 분배자", "클리어링하우스", "스테가노그래피", "Steganography", "FFD9", "50 4B 03 04", "Digital Watermark", "디지털 워터마크", "핑거프린트", "Fingerprint", "디지털 저작권"],
              blocks: [
                { type: "text", title: "DRM과 구성요소", paragraphs: ["DRM(Digital Rights Management)은 디지털 콘텐츠의 생성·유통·이용 전 과정에서 콘텐츠를 보호하고 부여된 권한에 따라 사용을 통제하는 기술입니다. 전자책·음악·영상·게임 등의 불법 유통·복제를 막고 권리자와 이용 조건을 관리합니다."] },
                { type: "table", title: "DRM 구성요소", columns: ["구성요소", "역할"], rows: [["콘텐츠 제공자", "콘텐츠를 제공하는 저작권자"], ["콘텐츠 소비자", "콘텐츠를 구매해 사용하는 주체"], ["콘텐츠 분배자", "암호화된 콘텐츠를 유통하는 곳·사람"], ["클리어링하우스", "키 관리와 라이선스 발급을 관리"], ["DRM 콘텐츠", "지식재산권 보호 대상인 콘텐츠 단위. 패키징 전 원본을 포함"]] },
                { type: "table", title: "콘텐츠 보호 기술 비교", columns: ["기술", "무엇을 보호·추적하는가"], rows: [["스테가노그래피", "기밀 정보가 존재한다는 사실 자체를 이미지·음악 등 다른 데이터 안에 숨김"], ["디지털 워터마크", "콘텐츠에 권리자·출처 정보를 삽입해 저작권 보호와 인증·복제 추적에 활용"], ["핑거프린트", "구매자별 식별 정보를 콘텐츠에 삽입해 불법 배포자를 추적"]] },
                { type: "code", title: "교재의 JPEG 뒤 데이터 은닉 예", language: "text", code: "JPEG 종료 마커: FF D9\n추가 데이터 예: 50 4B 03 04" },
                { type: "bullets", title: "저작권 유의점", items: ["창작물은 별도 등록 전에도 저작권 보호 대상이 될 수 있습니다.", "허락 없이 촬영·업로드한 사진은 초상권 침해 문제가 생길 수 있습니다.", "공개 공공데이터는 공공데이터 이용 조건을 확인해 활용하며, 비영리 전용 라이선스는 영리 기업 사용을 허용하지 않을 수 있습니다."] }
              ],
              memoryPoints: ["DRM은 권한·라이선스를 관리합니다.", "워터마크는 ‘누구의 콘텐츠인가’를 표시하고, 핑거프린트는 ‘누가 유출했는가’를 추적합니다.", "스테가노그래피는 정보 내용이 아니라 정보의 존재를 숨깁니다. 교재의 JPEG 예시는 FF D9 뒤에 50 4B 03 04를 덧붙입니다."]
            }
          ]
        },
      ]
    },
    {
      id: "network-security",
      title: "네트워크 보안",
      description: "네트워크 모델과 프로토콜부터 주소·장비·공격·보안기술까지 교재 목차에 따라 학습합니다.",
      units: [
        {
          id: "network-protocol-models",
          title: "네트워크 계층과 프로토콜 모델",
          chapter: "네트워크 일반",
          summary: "OSI 계층·주소·전송 단위, 데이터링크 오류 제어, IPv4·IPv6, ICMP 동작을 연결합니다.",
          status: "published",
          sourcePdfPages: Array.from({ length: 14 }, (_, index) => index + 257),
          concepts: [
            {
              id: "osi-seven-layers",
              title: "OSI 7계층과 캡슐화",
              summary: "계층별 역할·주소·프로토콜·PDU를 대응시키고 캡슐화와 역캡슐화 방향을 익힙니다.",
              sourcePdfPages: [259, 260, 261],
              keywords: ["OSI", "7계층", "캡슐화", "역캡슐화", "PDU", "Port", "MAC", "IP 주소"],
              questionKeywords: ["OSI 7계층", "OSI 7 Layer", "캡슐화", "역캡슐화", "Encapsulation", "De-Capsulation", "전송 단위", "데이터/세그먼트/패킷/프레임/비트", "Well Known Port", "MAC Address", "도메인 주소"],
              blocks: [
                { type: "text", title: "계층 구조", paragraphs: ["OSI(Open Systems Interconnection) 7계층은 네트워크 통신 기능을 계층으로 나눈 ISO 모델입니다. 하위 계층부터 물리→데이터링크→네트워크→전송→세션→표현→응용 계층 순서이며, 각 계층은 하위 계층의 기능을 이용해 상위 계층에 서비스를 제공합니다.", "송신 데이터는 아래 계층으로 내려가며 계층별 제어 헤더·트레일러가 붙는 캡슐화를 거칩니다. 수신 측에서는 아래 계층부터 제어 정보를 제거하는 역캡슐화가 진행됩니다."] },
                { type: "table", title: "계층·PDU·주소·예시", columns: ["계층", "역할·전송 단위", "주소·교재 예"], rows: [["7 응용", "응용 서비스, Data", "HTTP, FTP, SMTP, DNS, SNMP"], ["6 표현", "표현·변환, Data", "JPEG, MPEG"], ["5 세션", "대화·동기화, Data", "RPC, NetBIOS"], ["4 전송", "종단 간 전달, Segment", "TCP·UDP, 16비트 Port(0~65535)"], ["3 네트워크", "경로 선택·패킷 중계, Packet", "IP 주소, IP·ICMP·IGMP"], ["2 데이터링크", "인접 장비 간 프레임 전달, Frame", "MAC 주소"], ["1 물리", "비트를 신호로 변환·전송, Bit", "전기·광·무선 매체"]] },
                { type: "table", title: "계층별 주소", columns: ["주소", "계층·목적", "범위·특징"], rows: [["도메인 이름", "응용 계층에서 호스트를 사람이 읽기 쉽게 식별", "예: `www.soojebi.co.kr`의 계층별 이름"], ["Port", "전송 계층에서 네트워크 서비스·프로세스 식별", "16비트, 0~65535. Well Known 0~1023, Registered 1024~49151, Dynamic 49152~65535"], ["IP 주소", "네트워크 계층에서 논리 장치 식별", "다른 네트워크로 이동하면 바뀔 수 있음"], ["MAC 주소", "데이터링크 계층에서 인접 장비·프레임 전달에 사용", "NIC 교체 시 바뀔 수 있음"]] },
                { type: "bullets", title: "전송 단위 순서", items: ["송신 캡슐화: Data → Segment → Packet → Frame → Bit", "수신 역캡슐화: Bit → Frame → Packet → Segment → Data", "헤더는 계층 제어정보를 데이터 앞에, 트레일러는 데이터 뒤에 붙이는 제어정보입니다."] }
              ],
              memoryPoints: ["OSI 하위→상위: 물리·데이터링크·네트워크·전송·세션·표현·응용.", "PDU는 데이터→세그먼트→패킷→프레임→비트, 주소는 Port→IP→MAC 계층에 대응합니다."]
            },
            {
              id: "data-link-control",
              title: "데이터링크 계층과 오류 제어",
              summary: "동기화·오류·흐름·회선 제어와 ARQ 재전송 방식 및 데이터링크 프로토콜을 구분합니다.",
              sourcePdfPages: [261, 262, 263],
              keywords: ["데이터링크", "ARQ", "Stop-and-Wait", "Go-Back-N", "Selective Repeat", "HDLC", "PPP", "L2TP", "LLC"],
              questionKeywords: ["데이터링크 계층", "ARQ", "Automatic Repeat reQuest", "Stop-and-Wait ARQ", "Go-Back-N ARQ", "Selective Repeat ARQ", "HDLC", "PPP", "L2TP", "LLC", "슬라이딩 윈도우", "Half-Duplex", "Full-Duplex"],
              blocks: [
                { type: "table", title: "데이터링크 기능", columns: ["기능", "역할"], rows: [["동기화", "송·수신 노드가 데이터 전송 시작과 단위를 인식"], ["오류 제어", "전송 중 오류를 검출하고 신뢰성을 높임"], ["흐름 제어", "수신 노드 처리량보다 많은 프레임이 유입되지 않도록 조절"], ["회선 제어", "여러 노드가 통신할 때 회선 사용과 충돌을 제어"]] },
                { type: "table", title: "ARQ 방식", columns: ["방식", "재전송 원리"], rows: [["Stop-and-Wait", "프레임 하나를 보내고 ACK/NAK를 받을 때까지 기다린 뒤 다음 프레임 전송"], ["Go-Back-N", "오류 프레임이 발견되면 해당 프레임과 그 이후 이미 보낸 프레임을 다시 전송"], ["Selective Repeat", "연속 전송을 유지하고 오류가 난 프레임만 골라 재전송"]] },
                { type: "table", title: "데이터링크 프로토콜", columns: ["프로토콜", "특징"], rows: [["HDLC", "점대점·다중점 링크에서 반이중·전이중을 지원하는 비트 지향 프로토콜"], ["PPP", "두 지점 간 일대일 통신. 오류 검출은 제공하지만 재전송 복구·흐름 제어는 제공하지 않음"], ["L2TP", "여러 네트워크에서 PPP 트래픽을 터널링"], ["LLC", "링크 설정, 프레임 송수신과 상위 계층 프로토콜 종류를 알림"]] },
                { type: "bullets", title: "공유 매체 통신", items: ["반이중은 양방향 통신이 가능하지만 한 번에 한 방향으로만 전송하고, 전이중은 동시에 양방향 전송합니다.", "Stop-and-Wait는 응답 후 다음 프레임을 전송하고, 슬라이딩 윈도우는 윈도 크기만큼 여러 프레임을 연속 전송합니다."] }
              ],
              memoryPoints: ["데이터링크 기능: 동기화·오류·흐름·회선 제어.", "재전송 범위는 Stop-and-Wait=한 프레임 단위 대기, Go-Back-N=오류 뒤 전부, Selective Repeat=오류 프레임만입니다."]
            },
            {
              id: "ipv4-header-fragmentation",
              title: "IPv4 헤더와 단편화",
              summary: "IPv4 32비트 주소, 헤더 필드, TTL과 MTU에 따른 단편화·오프셋 계산을 학습합니다.",
              sourcePdfPages: [263, 264, 265, 266],
              keywords: ["IPv4", "32비트", "TTL", "MTU", "단편화", "Fragmentation", "DF", "MF", "Fragment Offset"],
              questionKeywords: ["IPv4 헤더", "32비트 주소", "Time To Live", "TTL", "MTU", "단편화", "Fragmentation", "Fragment Identifier", "Don't Fragment", "More Fragment", "Fragment Offset", "3980", "1480", "185"],
              blocks: [
                { type: "text", title: "헤더 기본", paragraphs: ["IPv4는 패킷 교환 네트워크에서 사용하는 32비트 주소의 비연결형 네트워크 계층 프로토콜입니다. 옵션을 쓰지 않은 IPv4 헤더의 기본 크기는 20바이트이며 주소·길이·서비스·분할·TTL·상위 프로토콜·검사 정보를 담습니다.", "TTL은 패킷이 통과할 수 있는 홉의 한계입니다. 라우터를 지날 때마다 1씩 줄고 0이 되면 폐기되어 무한 루프를 방지합니다."] },
                { type: "table", title: "단편화 필드", columns: ["필드", "기능"], rows: [["Identification", "같은 원본 데이터그램에서 나온 조각을 식별"], ["DF", "값 1이면 라우터 단편화를 금지하고, 0이면 단편화 가능"], ["MF", "뒤에 조각이 더 있으면 1, 마지막 조각이면 0"], ["Fragment Offset", "원본 데이터에서 조각이 시작하는 위치를 8바이트 단위로 표시"], ["MTU", "해당 네트워크 계층에서 전달 가능한 최대 패킷 크기(헤더 포함)"]] },
                { type: "text", title: "교재 계산 예: MTU 1,500바이트", paragraphs: ["4,000바이트 IPv4 패킷의 헤더가 20바이트이면 데이터는 3,980바이트입니다. MTU 1,500바이트에서 각 조각도 20바이트 헤더를 포함하므로 조각당 데이터 최대 크기는 1,480바이트입니다.", "3,980바이트는 1,480 + 1,480 + 1,020바이트의 데이터 조각으로 나뉩니다. 첫 조각 오프셋은 0, 두 번째는 1,480÷8=185, 세 번째는 2,960÷8=370입니다. MF는 뒤 조각이 있는 첫째·둘째 조각에서 1, 마지막 조각에서 0입니다."] },
                { type: "bullets", title: "계산 순서", items: ["원본 패킷에서 IPv4 헤더 크기를 빼 데이터 크기를 구합니다.", "MTU에서 조각 헤더 크기를 빼 조각별 데이터 최대치를 구합니다.", "Offset은 원본 데이터의 시작 바이트를 8로 나눈 값으로 기록합니다."] }
              ],
              memoryPoints: ["IPv4 주소는 32비트, 기본 헤더는 20바이트입니다.", "예제: 4,000−20=3,980바이트 데이터, MTU 1,500이면 조각 데이터 1,480·1,480·1,020바이트, Offset 0·185·370입니다."]
            },
            {
              id: "ipv6-transition",
              title: "IPv6와 IPv4 전환",
              summary: "IPv6의 128비트 주소와 주요 기능, 듀얼 스택·터널링·주소 변환을 비교합니다.",
              sourcePdfPages: [267, 268],
              keywords: ["IPv6", "128비트", "Flow Label", "듀얼 스택", "터널링", "주소 변환"],
              questionKeywords: ["IPv6", "128비트", "Flow Label", "Plug & Play", "Ad-Hoc", "Dual Stack", "Tunneling", "Address Translation", "IPv4에서 IPv6"],
              blocks: [
                { type: "table", title: "IPv6 특성", columns: ["특성", "설명"], rows: [["주소 공간", "128비트로 확장하여 주소 고갈 문제를 줄임. 16비트씩 8개를 16진수로 표현"], ["이동성·자동 설정", "네트워크 위치가 바뀌어도 주소를 유지하는 이동성과 Plug & Play 구성을 지원"], ["보안·QoS", "IPsec 기능 적용, 흐름 레이블(20비트)로 동일 흐름을 구분해 특별한 서비스 품질 처리 지원"], ["헤더", "기본 헤더 40바이트로 단순화하고 확장 헤더를 활용"]] },
                { type: "table", title: "전환 기술", columns: ["방식", "동작"], rows: [["듀얼 스택", "장비에 IPv4·IPv6 프로토콜을 함께 두고 상대에 따라 해당 스택을 선택"], ["터널링", "IPv4 네트워크를 통과하는 IPv6 패킷을 IPv4로 캡슐화해 다른 IPv6 망까지 전달"], ["주소 변환", "IPv4·IPv6 게이트웨이가 서로 다른 주소 체계의 패킷을 변환"]] }
              ],
              memoryPoints: ["IPv4=32비트, IPv6=128비트이며 IPv6 기본 헤더는 40바이트입니다.", "IPv4/IPv6 공존 방법은 듀얼 스택·터널링·주소 변환입니다."]
            },
            {
              id: "icmp-diagnostics",
              title: "ICMP 메시지와 진단 설정",
              summary: "ICMP 헤더·대표 메시지 번호와 Linux 커널 매개변수로 Echo 응답을 제어하는 법을 익힙니다.",
              sourcePdfPages: [268, 269, 270],
              keywords: ["ICMP", "Echo Request", "Echo Reply", "sysctl", "icmp_echo_ignore_all", "icmp_echo_ignore_broadcasts"],
              questionKeywords: ["ICMP", "Echo Request", "Echo Reply", "Destination Unreachable", "Time Exceeded", "Type 8", "Type 0", "sysctl", "kernel.ipv4.icmp_echo_ignore_all", "icmp_echo_ignore_broadcasts"],
              blocks: [
                { type: "text", title: "기능과 헤더", paragraphs: ["ICMP는 IP 패킷 전달 과정의 오류를 알리고 네트워크를 진단하는 프로토콜입니다. 헤더는 8바이트이며 Type(메시지 종류), Code(세부 정보), Checksum(오류 검출)을 포함합니다. ping은 Echo Request와 Echo Reply를 이용합니다."] },
                { type: "table", title: "교재의 주요 ICMP Type", columns: ["Type", "메시지", "용도"], rows: [["0", "Echo Reply", "Echo 요청에 대한 응답"], ["3", "Destination Unreachable", "목적지 도달 불가 알림"], ["4", "Source Quench", "혼잡으로 패킷 손실이 발생함을 송신 측에 알림"], ["5", "Redirect", "라우터가 더 짧은 경로를 알림"], ["8", "Echo Request", "ping 요청"], ["9", "Router Advertisement", "라우터 광고"], ["11", "Time Exceeded", "TTL이 0이 되어 폐기됨을 알림"], ["12", "Parameter Problem", "매개변수 설정 문제 알림"]] },
                { type: "code", title: "Echo 요청 응답 설정(교재 표기 그대로)", language: "bash", code: "sysctl -w kernel.ipv4.icmp_echo_ignore_all=0\nsysctl -w kernel.ipv4.icmp_echo_ignore_broadcasts=1" },
                { type: "table", title: "설정값", columns: ["매개변수", "0", "1"], rows: [["icmp_echo_ignore_all", "모든 Echo 요청에 응답", "모든 Echo 요청을 무시"], ["icmp_echo_ignore_broadcasts", "브로드캐스트 Echo 요청에 응답", "브로드캐스트 Echo 요청을 무시"]] }
              ],
              memoryPoints: ["ping 요청은 ICMP Type 8, 응답은 Type 0입니다. TTL 만료 메시지는 Type 11입니다.", "원본 이미지에서 `kernel.ipv4...` 경로 표기를 확인해 교재 표기 그대로 기록했습니다."]
            }
          ]
        },
        {
          id: "network-protocols-services",
          title: "라우팅·전송·응용 프로토콜",
          chapter: "네트워크 일반",
          summary: "라우팅 경로 선택, TCP·UDP, 주요 서비스 포트와 HTTP·SNMP 구조를 학습합니다.",
          status: "published",
          sourcePdfPages: Array.from({ length: 14 }, (_, index) => index + 271),
          concepts: [
            {
              id: "routing-protocols",
              title: "라우팅 알고리즘과 프로토콜",
              summary: "정적·동적 라우팅, Distance Vector·Link State·Path Vector와 RIP·OSPF·BGP를 비교합니다.",
              sourcePdfPages: [270, 271, 272],
              keywords: ["라우팅", "RIP", "OSPF", "BGP", "IGP", "EGP", "Distance Vector", "Link State", "Path Vector", "Bellman-Ford", "Dijkstra"],
              questionKeywords: ["라우팅 프로토콜", "Static Routing", "Dynamic Routing", "RIP", "OSPF", "BGP", "IGP", "EGP", "Bellman-Ford", "다익스트라", "Dijkstra", "Distance Vector", "Link State", "Path Vector", "홉 카운트", "Autonomous System"],
              blocks: [
                { type: "table", title: "경로 설정 분류", columns: ["유형", "특징"], rows: [["정적 라우팅", "관리자가 경로를 미리 설정. 라우터 처리 부담이 적고 경로가 통제되지만 네트워크 변화에 자동 대응하지 않음"], ["동적 라우팅", "라우터끼리 경로 정보를 교환해 상황에 따라 경로를 갱신"]] },
                { type: "table", title: "알고리즘·프로토콜", columns: ["방식·프로토콜", "분류·특징"], rows: [["Bellman-Ford / Distance Vector", "거리와 방향(다음 홉)을 기반으로 경로 계산. RIP가 대표적이며 홉 수는 15로 제한"], ["Dijkstra / Link State", "링크 상태 정보를 바탕으로 최단 경로 계산. OSPF는 영역(Area)으로 AS 내부를 나누며 홉 제한이 없음"], ["IGP", "동일 자치 시스템(AS) 내부 라우팅. RIP·OSPF 등이 속함"], ["EGP", "자치 시스템 사이의 경로 교환. BGP가 대표적이며 Path Vector 방식"]] },
                { type: "text", title: "메트릭과 AS", paragraphs: ["메트릭은 라우팅 프로토콜이 최적 경로를 선택할 때 사용하는 기준값입니다. AS(Autonomous System)는 하나의 관리 도메인에 속한 라우터 집합입니다."] }
              ],
              memoryPoints: ["RIP=IGP·Distance Vector·Bellman-Ford·홉 15 제한, OSPF=IGP·Link State·Dijkstra·Area, BGP=AS 간 EGP·Path Vector입니다."]
            },
            {
              id: "tcp-udp-transport",
              title: "TCP·UDP와 연결 관리",
              summary: "TCP 신뢰성·흐름/혼잡 제어와 연결 설정·종료, UDP의 비연결형 전달과 Keepalive를 정리합니다.",
              sourcePdfPages: [272, 273, 274, 275],
              keywords: ["TCP", "UDP", "3-Way Handshake", "4-Way Handshake", "SYN", "ACK", "FIN", "Keepalive", "tcp_keepalive_time"],
              questionKeywords: ["TCP", "UDP", "Transmission Control Protocol", "User Datagram Protocol", "3-Way Handshaking", "SYN+ACK", "4-Way Handshaking", "TCP 플래그", "Window Size", "tcp_keepalive_time", "7200"],
              blocks: [
                { type: "table", title: "TCP와 UDP", columns: ["항목", "TCP", "UDP"], rows: [["연결", "연결 지향", "비연결형"], ["전달", "순서·중복·손실을 제어하는 신뢰성 있는 바이트 스트림", "흐름·순서 제어가 없어 상대적으로 빠른 데이터그램"], ["제어", "흐름 제어와 혼잡 제어 제공", "교재는 흐름 제어·순서 제어가 없다고 설명"]] },
                { type: "text", title: "TCP 연결", paragraphs: ["3-Way Handshake는 연결을 설정하는 과정입니다: 클라이언트가 SYN을 보내고, 서버가 SYN+ACK로 수락하며, 클라이언트가 ACK로 확인합니다. 4-Way Handshake는 양쪽이 FIN과 ACK를 주고받으며 연결을 종료합니다.", "TCP 헤더는 최소 20바이트이며 출발지·목적지 Port, 순서·확인 번호, 헤더 길이, 제어 플래그, Window Size, Checksum, Urgent Pointer 등을 포함합니다. Window Size는 송수신 흐름 제어에 사용됩니다."] },
                { type: "code", title: "TCP Keepalive 설정 예", language: "bash", code: "cat /proc/sys/net/ipv4/tcp_keepalive_time\n7200" },
                { type: "bullets", title: "Keepalive", items: ["네트워크 연결이 활성 상태인지 주기적으로 확인하고 일정 시간 응답이 없으면 연결을 해제하는 메커니즘입니다.", "교재 예의 `tcp_keepalive_time` 값 7200은 2시간으로 제시됩니다."] }
              ],
              memoryPoints: ["TCP는 연결·신뢰성·순서·흐름/혼잡 제어, UDP는 비연결·낮은 제어 오버헤드입니다.", "연결 설정은 SYN→SYN+ACK→ACK, 종료는 양방향 FIN/ACK 절차입니다.", "교재 Keepalive 예: `cat /proc/sys/net/ipv4/tcp_keepalive_time`의 값은 7200초입니다."]
            },
            {
              id: "application-protocol-ports",
              title: "응용 프로토콜과 Well-Known 포트",
              summary: "파일·메일·원격 접속·이름·주소 관리 서비스의 프로토콜과 교재 수록 포트 번호를 대응합니다.",
              sourcePdfPages: [276, 277],
              keywords: ["응용 프로토콜", "FTP", "SSH", "Telnet", "SMTP", "DNS", "DHCP", "HTTP", "POP3", "IMAP", "SNMP", "HTTPS"],
              questionKeywords: ["응용 계층 프로토콜", "FTP", "SSH", "Telnet", "SMTP", "DNS", "DHCP", "HTTP", "POP3", "IMAP", "SNMP", "HTTPS", "포트 번호", "Well Known Port"],
              blocks: [
                { type: "table", title: "주요 서비스와 포트", columns: ["서비스", "포트·전송", "기능"], rows: [["FTP", "20/TCP 데이터, 21/TCP 제어", "파일 전송"], ["SSH / Telnet", "22/TCP / 23/TCP", "보안 원격 접속 / 원격 터미널 접속"], ["SMTP", "25/TCP", "메일 전송"], ["DNS", "53/TCP·UDP", "도메인 이름과 주소 정보 조회"], ["DHCP", "67/UDP 서버, 68/UDP 클라이언트", "IP 구성 정보의 자동 할당·관리"], ["HTTP / HTTPS", "80/TCP·UDP / 443/TCP", "웹 문서 전송 / TLS로 보호하는 웹 통신"], ["POP3 / IMAP", "110/TCP / 143/TCP", "메일 수신 / 서버와 동기화된 메일 접근"], ["SNMP", "161/UDP Agent, 162/UDP Manager", "네트워크 장비 모니터링·관리"]] },
                { type: "text", title: "메일·이름 서비스 비교", paragraphs: ["POP3는 서버에서 메일을 가져와 오프라인에서도 이용할 수 있습니다. IMAP은 중앙 서버와 동기화해 여러 단말에서 같은 메일 폴더를 확인하고 온라인·오프라인 사용을 지원합니다.", "Well-Known Port는 0~1023입니다. 교재는 서비스 설명과 포트 번호를 함께 암기하도록 강조합니다."] }
              ],
              memoryPoints: ["FTP 20/21, SSH 22, Telnet 23, SMTP 25, DNS 53, DHCP 67/68, HTTP 80, POP3 110, IMAP 143, SNMP 161/162, HTTPS 443입니다.", "SNMP는 Agent가 161, Manager가 162를 사용합니다."]
            },
            {
              id: "http-structure",
              title: "HTTP 메시지·메서드·상태 코드",
              summary: "요청·응답의 구성과 메서드·대표 응답 코드, 캐시·길이 헤더의 보안상 영향을 학습합니다.",
              sourcePdfPages: [277, 278, 279, 280, 281, 282],
              keywords: ["HTTP", "Request", "Response", "GET", "POST", "PUT", "DELETE", "Status Code", "Cache-Control", "RUDY", "Slowloris", "CC 공격"],
              questionKeywords: ["HTTP 요청", "HTTP 응답", "Start Line", "Status Line", "GET", "POST", "PUT", "DELETE", "TRACE", "OPTIONS", "200 OK", "301", "302", "400", "403", "404", "500", "504", "Cache-Control", "Content-Length", "RUDY", "Slowloris", "CC 공격", "HTTPS"],
              blocks: [
                { type: "table", title: "HTTP 메시지 구조", columns: ["구성요소", "요청", "응답"], rows: [["첫 줄", "Start Line: 메서드·대상 URI·HTTP 버전", "Status Line: HTTP 버전·상태 코드·설명"], ["Header", "추가 요청 정보", "추가 응답 정보"], ["Blank Line", "헤더와 본문 구분", "헤더와 본문 구분"], ["Body", "전달할 데이터(예: POST 폼 데이터)", "요청한 리소스·응답 데이터"]] },
                { type: "table", title: "메서드와 상태 코드", columns: ["항목", "뜻"], rows: [["GET", "리소스 조회. 본문을 쓰지 않는 요청이 많음"], ["POST", "본문에 데이터를 넣어 전송"], ["PUT / DELETE", "리소스 생성·갱신 / 삭제 요청"], ["TRACE / OPTIONS", "요청 경로 확인 / 지원 메서드 확인"], ["100 / 200", "Continue / OK"], ["300 / 301 / 302", "Multiple Choices / 영구 이동 / 임시 이동"], ["400 / 403 / 404", "잘못된 요청 / 접근 거부 / 리소스 없음"], ["500 / 504", "서버 내부 오류 / 게이트웨이·프록시 응답 시간 초과"]] },
                { type: "table", title: "헤더와 보안 메모", columns: ["항목", "기능·유의점"], rows: [["Host", "요청 대상 호스트 지정"], ["Content-Type / Content-Length", "본문 형식 / 본문 바이트 길이"], ["Cookie / Set-Cookie", "요청 쿠키 / 응답에서 설정하는 쿠키"], ["Cache-Control", "캐시 동작 제어. 교재는 `no-store`·`must-revalidate` 반복으로 서버 부담을 일으키는 CC 사례를 소개"], ["Content-Length", "교재의 RUDY 설명은 매우 큰 본문 길이를 선언하고 데이터를 천천히 보내 서버 연결을 점유하는 방식"], ["불완전한 헤더", "교재는 완성되지 않은 요청을 보내 서버가 기다리게 하는 Slowloris 유형을 설명"]] },
                { type: "bullets", title: "HTTPS", items: ["교재는 HTTPS를 SSL/TLS로 세션 데이터를 암호화하는 웹 통신으로 소개합니다.", "HTTP 메시지의 요청·응답 구조와 HTTPS 암호화 설명을 구분해 학습합니다."] }
              ],
              memoryPoints: ["요청은 시작 줄, 응답은 상태 줄로 시작하며 그 뒤 Header→빈 줄→Body 순서입니다.", "301=영구 이동, 302=임시 이동, 403=거부, 404=없음, 500=서버 오류, 504=게이트웨이 시간 초과입니다.", "교재는 Cache-Control 부하 사례(CC), Content-Length를 악용한 RUDY, 불완전한 헤더를 이용한 Slowloris를 예로 듭니다."]
            },
            {
              id: "snmp-management",
              title: "SNMP 관리 구조와 접근 통제",
              summary: "Manager·Agent, MIB·SMI·Community String과 Polling·Event Reporting의 차이를 정리합니다.",
              sourcePdfPages: [282, 283],
              keywords: ["SNMP", "Agent", "Manager", "MIB", "SMI", "Community String", "Polling", "Event Reporting"],
              questionKeywords: ["SNMP", "Simple Network Management Protocol", "SNMP Agent", "SNMP Manager", "MIB", "Management Information Base", "SMI", "Community String", "public", "private", "Read Only", "Read Write", "Polling", "Event Reporting"],
              blocks: [
                { type: "table", title: "SNMP 구성요소", columns: ["요소", "기능"], rows: [["Manager", "중앙 관리 시스템으로 여러 Agent에 정보를 요청하거나 이벤트를 수신. UDP 162 사용"], ["Agent", "관리 대상 장비에 설치되어 상태 정보를 수집·보관·제공. UDP 161 사용"], ["MIB", "관리 정보의 객체와 상태값을 정의하는 데이터베이스"], ["SMI", "관리 정보를 언어·플랫폼에 관계없이 표현하는 구조·표기 규칙"], ["Community String", "Manager와 Agent가 MIB 정보를 주고받을 때 사용하는 접근 문자열"]] },
                { type: "table", title: "수집 방식과 보안", columns: ["항목", "설명"], rows: [["Polling", "Manager가 Agent에 주기적으로 상태 정보를 요청"], ["Event Reporting", "이벤트 발생 시 Agent가 Manager에 정보를 보고"], ["RO / RW", "읽기 전용 / 읽기·쓰기 권한. 쓰기 권한은 MIB 변경 위험을 키우므로 제한"], ["기본 문자열", "교재는 `public`, `private`가 초기값으로 많이 사용되므로 변경·보호가 필요하다고 설명"]] }
              ],
              memoryPoints: ["Agent=UDP 161, Manager=UDP 162입니다.", "MIB는 관리 객체 정보, SMI는 정보 구조, Community String은 접근 문자열입니다.", "SNMP 쓰기 권한과 기본 `public`·`private` 값을 엄격히 관리합니다."]
            }
          ]
        },
        {
          id: "network-addressing-media",
          title: "네트워크 매체·주소·전송",
          chapter: "네트워크 일반",
          summary: "유·무선 LAN과 MAC 매체 접근, 토폴로지·SDN, IPv4/IPv6 주소 계산과 NAT를 익힙니다.",
          status: "published",
          sourcePdfPages: Array.from({ length: 11 }, (_, index) => index + 284),
          concepts: [
            {
              id: "network-media-wifi",
              title: "Ethernet·Wi-Fi와 매체 접근 제어",
              summary: "유선·무선 LAN 표준과 CSMA/CD, RTS/CTS, 토큰 방식의 매체 공유 원리를 비교합니다.",
              sourcePdfPages: [284, 285, 286],
              keywords: ["Ethernet", "Wi-Fi", "802.11", "CSMA/CD", "RTS/CTS", "NAV", "Token Bus", "Token Ring"],
              questionKeywords: ["Ethernet", "Wi-Fi", "IEEE 802.11", "802.11a", "802.11b", "802.11e", "802.11f", "802.11g", "MAC", "CSMA/CD", "Carrier Sense", "Collision Detection", "RTS", "CTS", "NAV", "Token Bus", "Token Ring", "IEEE 802.4", "IEEE 802.5"],
              blocks: [
                { type: "table", title: "Wi-Fi 표준(교재 기재값)", columns: ["표준", "주파수·특징"], rows: [["802.11a", "5 GHz 대역, 54 Mbps"], ["802.11b", "2.4 GHz 대역, 11 Mbps"], ["802.11e", "MAC 계층 QoS 기능으로 IP 전화·비디오 등 지원"], ["802.11f", "AP 간 로밍 개선"], ["802.11g", "802.11b와 유사한 대역에서 교재는 22 Mbps 이상으로 기재"], ["802.11i", "무선 LAN 보안 기능 향상"]] },
                { type: "table", title: "공유 매체 접근", columns: ["방식", "동작"], rows: [["CSMA/CD", "통신 중인지 감지하고 매체가 비어 있을 때 전송. 충돌을 감지하면 지수 백오프 후 재전송. 이더넷 반이중 환경에서 사용"], ["RTS/CTS", "무선 송신 의사와 허가를 제어 프레임으로 교환. 주변 장치는 예약 시간(NAV) 동안 대기"], ["Token Bus", "버스형 네트워크에서 토큰을 논리 순서대로 전달해 전송권 관리. IEEE 802.4"], ["Token Ring", "링을 따라 토큰을 전달해 전송권 관리. IEEE 802.5"]] },
                { type: "text", title: "매체 공유 용어", paragraphs: ["캐리어는 같은 매체에서 다른 노드가 보내는 신호이며, 충돌은 여러 노드가 동시에 전송해 프레임 전송이 실패한 상태입니다. RTS/CTS는 주변 무선 장비에 사용 예정 시간을 알려 숨은 노드 간 충돌을 줄이는 데 활용됩니다."] }
              ],
              memoryPoints: ["교재 표기: 802.11a=5GHz·54Mbps, 802.11b=2.4GHz·11Mbps, 802.11f=AP 로밍.", "CSMA/CD는 유선 반이중 매체의 충돌 감지, RTS/CTS는 무선 전송 예약·NAV입니다."]
            },
            {
              id: "network-scope-topology-sdn",
              title: "네트워크 범위·토폴로지와 SDN",
              summary: "WAN·LAN, 대표 토폴로지, 인트라넷·엑스트라넷·인터넷 및 SDN 제어/데이터 평면을 설명합니다.",
              sourcePdfPages: [286, 287, 288],
              keywords: ["WAN", "LAN", "Bus", "Tree", "Ring", "Star", "Mesh", "Intranet", "Extranet", "SDN"],
              questionKeywords: ["WAN", "LAN", "토폴로지", "Bus", "Tree", "Ring", "Star", "Mesh", "인트라넷", "엑스트라넷", "Internet", "SDN", "Software Defined Network", "제어 평면", "데이터 평면"],
              blocks: [
                { type: "table", title: "범위·공개 정도", columns: ["분류", "특징"], rows: [["WAN", "국가·지역 간 원거리 연결. 경로가 다양해 LAN보다 속도가 느리고 오류율이 높을 수 있음"], ["LAN", "건물·사무실·학교 등 제한된 지역의 근거리 네트워크"], ["인트라넷", "회사·조직 내부 네트워크"], ["엑스트라넷", "내부 구성원과 승인된 외부 인원이 함께 사용하는 네트워크"], ["인터넷", "전 세계 네트워크가 연결된 공중 네트워크"]] },
                { type: "table", title: "LAN 토폴로지", columns: ["형태", "구조·특징"], rows: [["Bus", "하나의 회선에 여러 노드를 연결. 전송 순서를 제어할 필요가 있음"], ["Tree", "노드가 계층·가지 형태로 연결"], ["Ring", "각 노드가 하나의 링에 순차 연결"], ["Star", "중앙 허브·스위치에 단말을 연결. 관리·오류 확인은 쉽지만 중앙 장비 장애가 전체에 영향"], ["Mesh", "노드 간 직접 연결. 완전 메시 회선 수는 n(n−1)/2"]] },
                { type: "diagram", title: "SDN 구조", nodes: [{ label: "애플리케이션", detail: "서비스·정책 요구" }, { label: "제어 계층", detail: "컨트롤러가 경로·자원·포워딩 관리" }, { label: "인프라 계층", detail: "단순 전달·스위칭 장비" }], caption: "SDN은 제어 평면과 데이터 평면을 분리해 소프트웨어로 네트워크를 관리합니다." }
              ],
              memoryPoints: ["WAN은 원거리, LAN은 제한된 지역. 인트라넷은 내부, 엑스트라넷은 승인된 외부와 공유합니다.", "완전 Mesh 회선 수는 n(n−1)/2이고, SDN은 제어와 패킷 전달을 분리합니다."]
            },
            {
              id: "ipv4-cidr-subnetting",
              title: "IPv4 클래스·CIDR·서브네팅",
              summary: "클래스 주소 범위와 프리픽스, 서브넷 마스크·AND 계산, FLSM 분할 예를 풉니다.",
              sourcePdfPages: [288, 289, 290, 291, 292],
              keywords: ["IPv4", "CIDR", "서브넷", "Subnetting", "FLSM", "Subnet Mask", "네트워크 ID", "Host ID", "AND"],
              questionKeywords: ["IPv4 주소 체계", "A 클래스", "B 클래스", "C 클래스", "D 클래스", "E 클래스", "CIDR", "서브넷 마스크", "서브네팅", "FLSM", "192.168.1.0/24", "/28", "AND 연산", "Network ID", "Host ID"],
              blocks: [
                { type: "table", title: "클래스 주소 범위", columns: ["클래스", "범위", "기본 마스크·CIDR", "용도"], rows: [["A", "0.0.0.0–127.255.255.255", "255.0.0.0 · /8", "대규모 호스트"], ["B", "128.0.0.0–191.255.255.255", "255.255.0.0 · /16", "중간 규모"], ["C", "192.0.0.0–223.255.255.255", "255.255.255.0 · /24", "소규모"], ["D", "224.0.0.0–239.255.255.255", "—", "멀티캐스트"], ["E", "240.0.0.0–255.255.255.255", "—", "연구·예약"]] },
                { type: "text", title: "CIDR과 서브넷 마스크", paragraphs: ["IPv4는 32비트 주소이며 8비트씩 네 개의 10진수 옥텟으로 표시합니다. 서브넷 마스크에서 네트워크 ID는 1, 호스트 ID는 0으로 표현합니다. `/n`은 앞에서부터 네트워크 비트를 n개 두는 CIDR 표기입니다.", "IP 주소와 서브넷 마스크를 2진수로 바꾸어 비트별 AND를 하면 네트워크 주소가 나옵니다. CIDR은 클래스 고정 경계 대신 프리픽스 길이를 사용해 주소를 더 유연하게 나눕니다."] },
                { type: "table", title: "교재 FLSM 예: 192.168.1.0/24를 16개로 분할", columns: ["계산", "결과"], rows: [["필요 서브넷 비트", "2ⁿ ≥ 16을 만족하는 n=4"], ["새 프리픽스", "/24 + 4 = /28"], ["새 마스크", "255.255.255.240"], ["서브넷 증가 간격", "마지막 옥텟 16씩 증가"], ["서브넷 개수", "2⁴ = 16"]] },
                { type: "bullets", title: "계산 절차", items: ["서브넷 개수에 맞는 비트 n을 정하고 호스트 ID 상위 n비트를 서브넷 ID로 빌립니다.", "서브넷 마스크의 네트워크 비트를 1로 채우고 나머지 호스트 비트는 0으로 둡니다.", "IP와 마스크를 AND해 네트워크 주소를 계산하고 서브넷 ID를 증가시켜 각 블록을 나눕니다."] }
              ],
              memoryPoints: ["A/B/C 클래스 기본 프리픽스는 /8·/16·/24, D는 멀티캐스트, E는 연구·예약입니다.", "192.168.1.0/24를 16개 FLSM 서브넷으로 나누면 /28, 255.255.255.240, 블록 간격 16입니다."]
            },
            {
              id: "ip-types-nat",
              title: "IP 통신·주소 유형과 NAT",
              summary: "유니·멀티·브로드·애니캐스트와 공인/사설·정적/동적 주소, NAT 변환 유형을 정리합니다.",
              sourcePdfPages: [292, 293, 294],
              keywords: ["Unicast", "Multicast", "Broadcast", "Anycast", "Public IP", "Private IP", "NAT", "PAT", "Policy NAT", "Bypass NAT"],
              questionKeywords: ["유니캐스트", "Unicast", "멀티캐스트", "Multicast", "브로드캐스트", "Broadcast", "애니캐스트", "Anycast", "공인 주소", "사설 주소", "Static Address", "Dynamic Address", "NAT", "Network Address Translation", "Static NAT", "Dynamic NAT", "PAT", "Policy NAT", "Bypass NAT"],
              blocks: [
                { type: "table", title: "IP 전달 방식", columns: ["방식", "대상"], rows: [["Unicast", "하나의 송신자가 하나의 목적지로 전송(1:1)"], ["Multicast", "그룹으로 지정된 여러 수신자에게 동시에 전송"], ["Broadcast", "같은 네트워크의 모든 수신자에게 전달. IPv4에서 Host ID가 모두 1인 브로드캐스트 주소를 사용"], ["Anycast", "하나의 주소로 식별되는 여러 노드 중 네트워크상 가까운 수신 지점으로 전달"]] },
                { type: "table", title: "주소 성격", columns: ["기준", "유형", "의미"], rows: [["공개 범위", "공인 / 사설", "인터넷에서 라우팅되는 공개 주소 / 내부 네트워크에서 사용하는 주소"], ["할당 방식", "정적 / 동적", "고정 배정 / DHCP 등으로 유동 할당"]] },
                { type: "table", title: "NAT 유형", columns: ["유형", "변환 방식"], rows: [["Static NAT", "공인 IP 1개와 사설 IP 1개를 고정 매핑"], ["Dynamic NAT", "공인 IP 여러 개와 사설 IP 여러 개를 동적으로 매핑"], ["PAT", "공인 IP 하나를 여러 사설 IP가 포트 번호를 이용해 공유"], ["Policy NAT", "출발지·목적지 주소 등 정책 기준으로 변환 대상을 선택하며 매핑 정책을 ACL로 관리"], ["Bypass NAT", "규칙에서 제외된 주소는 NAT를 적용하지 않음"]] },
                { type: "text", title: "NAT의 역할", paragraphs: ["NAT는 IP 패킷의 출발지·목적지 IP 주소 또는 Port를 변환합니다. IPv4 주소 부족을 보완하고 내부 사설 주소를 외부에 직접 노출하지 않는 데 사용됩니다."] }
              ],
              memoryPoints: ["IPv4는 브로드캐스트를 사용하고 교재는 IPv6에서 브로드캐스트 대신 유니캐스트를 사용한다고 대비합니다.", "Static=1:1 고정, Dynamic=여러 공인·사설 주소 풀, PAT=공인 IP 1개를 여러 내부 호스트가 공유합니다."]
            }
          ]
        },
        {
          id: "network-devices-tools",
          title: "스위치·라우터와 네트워크 도구",
          chapter: "네트워크 일반",
          summary: "브리지·스위치·VLAN, 라우터 필터링과 ACL, 주소 해석·진단 명령을 실무 관점에서 정리합니다.",
          status: "published",
          sourcePdfPages: Array.from({ length: 13 }, (_, index) => index + 316),
          concepts: [
            {
              id: "switch-vlan",
              title: "스위치 전달 방식과 VLAN",
              summary: "MAC 주소 기반 프레임 전달, 세 가지 스위칭 방식, VLAN 종류·Access/Trunk 모드와 오남용 대응을 익힙니다.",
              sourcePdfPages: [316, 317, 318],
              keywords: ["스위치", "Cut Through", "Store and Forward", "Fragment Free", "VLAN", "Access Mode", "Trunk Mode", "DTP", "Native VLAN"],
              questionKeywords: ["스위치", "Switch", "Cut Through", "Store and Forward", "Fragment Free", "VLAN", "Port 기반", "MAC 기반", "IP 기반", "프로토콜 기반", "Access Mode", "Trunk Mode", "Native VLAN", "DTP", "Port Mirroring"],
              blocks: [
                { type: "text", title: "스위치와 프레임 전달", paragraphs: ["브리지와 스위치는 OSI 2계층 장비입니다. 스위치는 들어온 프레임의 목적지 MAC 주소를 바탕으로 전달하며 출발지 MAC을 학습해 MAC 주소 테이블을 구성합니다."] },
                { type: "table", title: "스위치 전송 방식", columns: ["방식", "처리"], rows: [["Cut Through", "목적지 주소를 확인한 뒤 바로 전송"], ["Store and Forward", "프레임 전체를 받은 뒤 오류를 검사하고 전달"], ["Fragment Free", "교재는 프레임 앞 64바이트를 확인해 오류를 처리한 뒤 전달한다고 설명"]] },
                { type: "table", title: "VLAN 구성·포트 모드", columns: ["유형", "기준·특징"], rows: [["Port 기반", "물리 계층 포트 단위. 가장 널리 쓰이며 정적·동적 할당 가능"], ["MAC 기반", "데이터링크 계층 MAC 주소 기준"], ["IP 기반", "네트워크 계층 IP 주소 기준"], ["프로토콜 기반", "같은 프로토콜끼리 통신하도록 구성"], ["Access Mode", "하나의 포트가 하나의 VLAN 소속. 단말 연결에 사용하며 나갈 때 태그를 제거"], ["Trunk Mode", "한 포트로 여러 VLAN 트래픽을 전달"]] },
                { type: "bullets", title: "VLAN 보안", items: ["VLAN은 브로드캐스트 도메인을 분리해 불필요한 트래픽을 줄이고 보안을 높입니다.", "신뢰하지 않는 네트워크의 Native VLAN 연결을 차단하고 관리용 Native VLAN 접근을 제한합니다.", "DTP를 비활성화해 의도하지 않은 Trunk 설정을 막고, Port Mirroring은 지정 포트의 트래픽을 복제해 점검합니다."] }
              ],
              memoryPoints: ["스위치는 MAC 주소 기반으로 프레임을 전달하고 MAC 테이블을 학습합니다.", "Access=포트당 한 VLAN, Trunk=다중 VLAN, VLAN 보호는 미사용 Native VLAN과 DTP 관리입니다."]
            },
            {
              id: "router-filtering-acl",
              title: "라우터 필터링·ACL·관리 명령",
              summary: "Ingress/Egress·Blackhole·uRPF, Standard/Extended ACL, 라우터 모드와 주요 명령을 익힙니다.",
              sourcePdfPages: [318, 319, 320, 321, 322],
              keywords: ["Ingress Filtering", "Egress Filtering", "Blackhole", "Unicast RPF", "ACL", "Access-List", "Router", "show ip interface brief"],
              questionKeywords: ["Ingress Filtering", "Egress Filtering", "Blackhole Filtering", "Null Routing", "Unicast RPF", "Reverse Path Forwarding", "ACL", "Standard Access-List", "Extended Access-List", "Router>", "Router#", "Router(config)", "show arp", "show ip route", "show ip interface brief", "running-config", "password", "secret"],
              blocks: [
                { type: "table", title: "라우터 패킷 필터링", columns: ["방식", "방향·기준"], rows: [["Ingress Filtering", "외부에서 라우터 내부로 들어오는 패킷을 필터링"], ["Egress Filtering", "내부에서 외부로 나가는 패킷을 필터링"], ["Blackhole / Null Routing", "특정 IP로 가는 트래픽을 버려 공격을 차단. 전체 정상 트래픽을 함께 차단하지 않도록 범위 주의"], ["Unicast RPF", "패킷이 들어온 인터페이스와 역방향 경로를 점검해 비정상 출발지 트래픽을 필터링"]] },
                { type: "table", title: "ACL과 라우터 모드", columns: ["항목", "특징"], rows: [["Standard ACL", "출발지 IP 기준, 번호 1~99"], ["Extended ACL", "출발지·목적지 IP와 Port 기준, 번호 100~199"], ["Router> 사용자 모드", "명령 사용이 제한됨. `enable`로 관리자 모드 전환"], ["Router# 관리자 모드", "상태 조회·관리. `configure terminal`로 전역 설정 진입"], ["Router(config)#", "암호·라인·인터페이스 설정"], ["Router(config-line)# / (config-if)#", "VTY 등 라인 / 인터페이스 설정"]] },
                { type: "table", title: "주요 Cisco식 명령", columns: ["명령", "조회 대상"], rows: [["show arp", "ARP 테이블"], ["show controllers", "인터페이스 컨트롤러·하드웨어 상태"], ["show flash", "플래시 메모리"], ["show interface", "상세 인터페이스 상태·트래픽"], ["show ip interface", "IP 주소·마스크와 ACL 적용 정보"], ["show ip interface brief", "인터페이스 이름·IP·Method·Status·Protocol 요약"], ["show ip route", "라우팅 테이블"], ["show process / show running-config / show version", "CPU 사용률 / 실행 설정 / 장비 사양"]] },
                { type: "text", title: "비밀번호 저장", paragraphs: ["교재의 라우터 설정 예에서 `password`는 평문 저장, `secret`은 MD5 해시를 사용해 저장하는 명령으로 비교합니다. 원격 접속용 VTY 라인은 Telnet·SSH 접속 지점이며, 로컬 계정 인증 등 안전한 관리 설정이 필요합니다."] }
              ],
              memoryPoints: ["Ingress=외부→내부, Egress=내부→외부, Blackhole=지정 트래픽 폐기, uRPF=역경로 점검입니다.", "Standard ACL=출발지 IP(1~99), Extended ACL=출발지·목적지·Port(100~199)입니다.", "`show ip interface brief`는 인터페이스별 IP와 상태를 간단히 확인합니다."]
            },
            {
              id: "arp-address-resolution",
              title: "ARP·RARP 주소 해석",
              summary: "ARP Request 브로드캐스트와 Reply 유니캐스트 흐름, ARP 캐시·RARP를 비교합니다.",
              sourcePdfPages: [326, 327],
              keywords: ["ARP", "ARP Request", "ARP Reply", "RARP", "ARP Cache"],
              questionKeywords: ["ARP", "Address Resolution Protocol", "ARP Request", "ARP Reply", "ARP 테이블", "ARP Cache", "RARP", "MAC 주소를 IP 주소로"],
              blocks: [
                { type: "diagram", title: "ARP 주소 해석", nodes: [{ label: "ARP Table 확인", detail: "IP에 대응하는 MAC이 있는지 조회" }, { label: "Request", detail: "없으면 네트워크에 브로드캐스트" }, { label: "Reply", detail: "대상 노드가 MAC을 유니캐스트 응답" }, { label: "Cache 저장", detail: "IP–MAC 매핑을 ARP 테이블에 기록" }], caption: "ARP는 IPv4 논리 주소를 링크 계층 MAC 주소로 변환합니다." },
                { type: "table", title: "ARP와 RARP", columns: ["프로토콜", "변환 방향"], rows: [["ARP", "IP 주소 → MAC 주소"], ["RARP", "MAC 주소 → IP 주소"]] },
                { type: "bullets", title: "패킷 흐름", items: ["ARP 요청은 대상 IP를 실제 값으로 넣고 대상 MAC을 모를 때 브로드캐스트합니다.", "해당 IP를 가진 장비가 자신의 IP·MAC을 담아 ARP Reply를 요청한 장비에 유니캐스트합니다.", "`arp -a`는 현재 시스템의 ARP 캐시 테이블을 확인하는 명령입니다."] }
              ],
              memoryPoints: ["ARP는 IP→MAC, RARP는 MAC→IP입니다.", "Request는 브로드캐스트, Reply는 요청 장비로 유니캐스트하며 매핑을 캐시에 둡니다."]
            },
            {
              id: "network-diagnostics",
              title: "PING·Traceroute·netstat·tcpdump",
              summary: "연결 상태·경로·소켓·패킷을 조사하는 네트워크 진단 도구와 핵심 옵션을 학습합니다.",
              sourcePdfPages: [323, 324, 325, 327, 328],
              keywords: ["PING", "traceroute", "netstat", "tcpdump", "BPF", "libpcap", "RTT"],
              questionKeywords: ["PING", "Packet Internet Groper", "traceroute", "TTL", "netstat", "Network Statistics", "tcpdump", "BPF", "libpcap", "Recv-Q", "Send-Q", "LISTEN", "ESTABLISHED", "RTT"],
              blocks: [
                { type: "table", title: "진단 도구", columns: ["도구", "용도·관찰 정보"], rows: [["PING", "ICMP로 목적지 도달 여부 확인. 응답 바이트·왕복 시간(RTT)·TTL을 표시"], ["traceroute", "패킷 TTL을 단계적으로 늘려 경로상의 라우터·왕복 시간을 추적"], ["netstat", "연결·대기 포트, 라우팅 테이블, 인터페이스와 프로토콜 통계 확인"], ["tcpdump", "Linux/Unix 인터페이스의 패킷을 캡처·필터링·저장·분석하는 명령줄 도구. libpcap 기반"]] },
                { type: "table", title: "netstat 주요 옵션·출력", columns: ["항목", "기능"], rows: [["-a", "연결 또는 대기 중인 모든 포트"], ["-i / -s", "인터페이스 목록·통계 / IP·ICMP·UDP 프로토콜 통계"], ["-t / -u", "TCP / UDP 소켓"], ["-p", "프로세스 ID 표시"], ["-r", "라우팅 테이블"], ["-n", "호스트명 대신 숫자 IP·Port 표시"], ["Recv-Q / Send-Q", "프로세스가 받거나 보내기를 기다리는 데이터"], ["State", "CLOSED·CLOSE_WAIT·ESTABLISHED·LISTEN 등의 연결 상태"]] },
                { type: "code", title: "tcpdump 기본 형식", language: "bash", code: "tcpdump [option] [BPF]\n-i <interface>\n-nn\n-v | -vv | -vvv" },
                { type: "bullets", title: "도구 사용 시 해석", items: ["PING은 왕복 지연·도달 여부를 보여주지만 물리적 거리를 측정하지 않습니다.", "traceroute는 TTL 만료에 따른 ICMP 응답을 이용하며 ACL에 막히면 응답 시간이 표시되지 않을 수 있습니다.", "netstat은 패킷 내용 자체를 보여주는 도구가 아니고, tcpdump는 지정 인터페이스·BPF 조건의 원시 패킷을 캡처합니다."] }
              ],
              memoryPoints: ["PING=ICMP 연결 확인, traceroute=TTL 기반 경로 추적, netstat=소켓·상태·통계, tcpdump=패킷 캡처입니다.", "`tcpdump -i`는 인터페이스, `-nn`은 이름 해석 없이 숫자로 표시, `-v/-vv/-vvv`는 상세 수준입니다."]
            }
          ]
        },
        {
          id: "network-dos-attacks",
          title: "서비스 거부 공격",
          chapter: "네트워크 기반 공격 기술",
          summary: "단일 공격자가 자원을 고갈시키는 DoS와 랜드·스머프·Ping of Death·단편화 악용 공격의 원리 및 대응을 정리합니다.",
          status: "published",
          sourcePdfPages: [341, 346],
          concepts: [
            {
              id: "dos-land-smurf",
              title: "DoS·랜드·스머프 공격",
              summary: "DoS의 자원 고갈 특성과 출발지 주소를 악용하는 랜드 및 브로드캐스트 증폭형 스머프 공격을 구분합니다.",
              sourcePdfPages: [341, 343],
              keywords: ["DoS", "Land Attack", "Smurf Attack", "ICMP Echo", "Broadcast"],
              questionKeywords: ["DoS", "서비스 거부", "랜드 어택", "Land Attack", "스머프", "Smurf", "브로드캐스트", "ICMP Echo", "hping3"],
              blocks: [
                { type: "table", title: "공격 방식 비교", columns: ["공격", "원리", "주요 대응"], rows: [
                  ["DoS", "한 공격자가 악성 패킷·요청으로 대상 자원을 고갈시켜 정상 서비스를 방해", "출발지 확인·차단이 가능하지만 분산 공격보다 공격 근원을 특정하기 쉬움"],
                  ["Land", "TCP 패킷의 출발지·목적지 IP와 Port를 같게 조작해 대상이 자기 자신과 통신하는 것처럼 루프·부하를 유발", "라우터·IPS에서 출발지와 목적지가 같은 비정상 패킷 차단, 최신 운영체제·소프트웨어 패치"],
                  ["Smurf", "피해자의 IP를 출발지로 위조한 ICMP Echo Request를 브로드캐스트 주소로 보내 다수 호스트의 Echo Reply가 피해자에게 모이게 함", "외부에서 내부로 향하는 IP Broadcast 차단, IPS에서 Echo Reply 폭주 차단, 호스트의 Broadcast 응답 비활성화"]
                ] },
                { type: "diagram", title: "스머프 증폭 흐름", nodes: [
                  { label: "공격자", detail: "출발지 주소를 피해자 IP로 위조" },
                  { label: "브로드캐스트 주소", detail: "ICMP Echo Request 전달" },
                  { label: "다수 호스트", detail: "각각 Echo Reply 응답" },
                  { label: "피해자", detail: "응답이 집중되어 부하 발생" }
                ], caption: "교재의 스머프 공격 흐름을 핵심 패킷 이동으로 옮겼습니다." },
                { type: "code", title: "hping3 예시와 옵션", language: "bash", code: "hping3 [target] [option]\nhping3 192.168.0.255 -a 10.10.10.5 --icmp --flood" },
                { type: "table", title: "교재에 제시된 hping3 옵션", columns: ["옵션", "의미"], rows: [["-a", "출발지 IP 변경"], ["-c", "패킷 수 지정"], ["-i", "패킷 간격 조정"], ["-p", "목적지 포트 지정"], ["-F / -S / -A", "FIN / SYN / ACK 패킷 전송"], ["--icmp", "ICMP 프로토콜 사용"], ["--flood", "대량 패킷 전송"]] }
              ],
              memoryPoints: ["Land는 출발지와 목적지 주소·포트를 같게 조작합니다.", "Smurf는 피해자 주소로 위조한 ICMP 요청을 브로드캐스트해 응답을 증폭합니다.", "hping3 표와 명령 옵션은 PDF 343쪽 이미지에서 대조했습니다."]
            },
            {
              id: "dos-ping-of-death",
              title: "Ping of Death",
              summary: "허용 크기를 초과하는 ICMP Echo 요청을 단편화해 보내고, 수신 측 재조립 과정에 부하를 주는 공격입니다.",
              sourcePdfPages: [344],
              keywords: ["Ping of Death", "죽음의 핑", "65,535", "ICMP", "Fragment"],
              questionKeywords: ["죽음의 핑", "Ping of Death", "65,535", "ICMP Echo", "단편화", "재조립"],
              blocks: [
                { type: "text", title: "공격 원리", paragraphs: ["ICMP Echo 요청을 정상 크기보다 크게 만들어 전송합니다. 경로에서 작은 조각으로 단편화된 패킷을 대상 시스템이 재조립하는 과정에서 과도한 메모리·CPU 부하가 발생해 성능 저하나 시스템 정지를 일으킬 수 있습니다.", "교재는 최대 허용 크기 65,535바이트를 초과하는 Echo 요청을 예로 듭니다."] },
                { type: "table", title: "대응", columns: ["대응", "설명"], rows: [["IDS 탐지", "비정상적인 조각·ICMP 요청을 탐지해 관리자에게 알리고 차단"], ["ICMP 크기 제한·필터링", "라우터에서 ICMP 메시지 최대 크기를 제한하거나 수신 필터링"], ["운영체제 패치", "재조립 취약점을 보완하도록 운영체제를 최신 상태로 유지"], ["접근 제어", "공격에 필요한 시스템·네트워크 자원 접근 제한"]] }
              ],
              memoryPoints: ["교재 기준 수치 65,535바이트와 재조립 부하를 연결해서 기억합니다.", "기준 수치와 대응 항목은 PDF 344쪽 원본에서 확인했습니다."]
            },
            {
              id: "dos-fragment-attacks",
              title: "Teardrop·Bonk·Boink·Targa",
              summary: "비정상 IP 단편화와 조각 재조립 취약점을 이용하는 공격 및 이를 묶은 DoS 도구를 비교합니다.",
              sourcePdfPages: [345, 346],
              keywords: ["Teardrop", "Bonk", "Boink", "Targa", "IP Fragment", "오프셋"],
              questionKeywords: ["티어드롭", "Teardrop", "Bonk", "봉크", "Boink", "보잉크", "Targa", "Fragment 오프셋", "중첩"],
              blocks: [
                { type: "table", title: "단편화 악용 공격 비교", columns: ["공격", "핵심 설명"], rows: [
                  ["Teardrop", "IP 조각의 오프셋을 중첩되거나 일관되지 않게 조작해 재조립 과정에서 오류·장애를 유발"],
                  ["Bonk", "비정상적으로 큰 조각 오프셋 등을 이용하는 Teardrop 계열 변형 공격"],
                  ["Boink", "교재 설명상 Bonk에 UDP 포트를 자유롭게 지정하는 기능을 추가한 공격"],
                  ["Targa", "Bonk·Land·Teardrop 등 여러 DoS 공격 코드를 실행하도록 묶은 통합 도구"]
                ] },
                { type: "bullets", title: "방어 관점", items: ["운영체제의 IP 조각 재조립 코드를 최신 패치로 유지합니다.", "비정상·중첩 조각을 탐지하고 네트워크 경계 장비에서 차단합니다.", "단편화 관련 내용은 교재의 명칭과 특징 범위 안에서 정리했으며, 원문에 없는 추가 변종은 넣지 않았습니다."] }
              ],
              memoryPoints: ["Teardrop은 중첩 오프셋, Boink는 Bonk의 UDP 포트 지정 확장, Targa는 복수 DoS 도구 통합입니다."]
            }
          ]
        },
        {
          id: "network-ddos-attacks",
          title: "분산 서비스 거부와 반사 공격",
          chapter: "네트워크 기반 공격 기술",
          summary: "봇넷 기반 DDoS의 구성·유형, UDP·ICMP Flooding, DRDoS 반사 공격과 TCP SYN Flooding 및 대응을 정리합니다.",
          status: "published",
          sourcePdfPages: [346, 356],
          concepts: [
            {
              id: "ddos-architecture-tools",
              title: "DDoS 구성 요소와 공격 도구",
              summary: "공격자·C&C·봇·봇넷·대상 간 명령 전달 구조와 대표적인 DDoS 도구를 정리합니다.",
              sourcePdfPages: [346, 349],
              keywords: ["DDoS", "C&C", "Botnet", "Zombie", "Trinoo", "TFN", "TFN2K", "Stacheldraht", "Mirai", "Reaper"],
              questionKeywords: ["DDoS", "분산 서비스 거부", "C&C 서버", "봇넷", "좀비 PC", "Trinoo", "TFN2K", "Stacheldraht", "Mirai", "Reaper", "HinataBot"],
              blocks: [
                { type: "diagram", title: "DDoS 명령·트래픽 흐름", nodes: [
                  { label: "공격자 / Master", detail: "공격 대상·포트·트래픽 유형을 지정" },
                  { label: "C&C 서버", detail: "명령과 제어 정보를 봇에 전달" },
                  { label: "봇 / 좀비", detail: "감염된 서버·PC·IoT 단말" },
                  { label: "Botnet", detail: "다수의 봇이 동시에 공격" },
                  { label: "Target", detail: "대량 트래픽·요청으로 서비스 장애" }
                ], caption: "공격자에서 C&C로 전달되는 제어 명령과 봇에서 대상에게 발생하는 공격 트래픽을 구별합니다." },
                { type: "table", title: "대표 도구", columns: ["도구", "교재의 특징"], rows: [
                  ["Trinoo", "UDP Flood 중심이며 TCP를 사용하지 않는 UDP 기반 공격 도구"],
                  ["TFN", "UDP Flood 외에 TCP SYN Flood, ICMP Echo 및 브로드캐스트 공격 등을 수행"],
                  ["TFN2K", "TFN의 발전형으로 통신 암호화와 TCP·UDP·ICMP 공격을 지원"],
                  ["Stacheldraht", "DDoS 공격 도구의 하나로 교재에서 대표 도구로 열거"]
                ] },
                { type: "text", title: "대역폭과 패킷률", paragraphs: ["대역폭 공격은 높은 BPS(Bit Per Second)의 트래픽으로 회선을 포화시킵니다. 자원 소진 공격은 PPS(Packet Per Second)가 높은 요청으로 서버의 연결·처리 자원을 소모시킵니다.", "교재는 Mirai·Reaper 등 IoT 봇넷 사례를 다루며, DDoS는 한 공격자 장비에서 발생하는 DoS보다 출발지를 분산해 차단·추적이 어렵다는 점을 강조합니다."] }
              ],
              memoryPoints: ["공격자→C&C→봇넷은 제어 경로이고, 봇넷→대상은 공격 트래픽 경로입니다.", "BPS는 초당 비트 수, PPS는 초당 패킷 수입니다."]
            },
            {
              id: "ddos-bandwidth-floods",
              title: "UDP·ICMP Flooding",
              summary: "UDP와 ICMP 대량 전송으로 회선 대역폭을 소모하는 공격 및 교재에 제시된 필터링·우회·임계치 대응을 정리합니다.",
              sourcePdfPages: [349, 351],
              keywords: ["UDP Flooding", "ICMP Flooding", "Null Routing", "Anycast", "KISA", "Rate limit"],
              questionKeywords: ["UDP Flooding", "ICMP Flooding", "UDP Flood", "ICMP Flood", "Null Routing", "Null0", "Anycast", "KISA DDoS 대피소", "200개", "대역폭 공격"],
              blocks: [
                { type: "table", title: "공격 특성 비교", columns: ["공격", "특징", "교재의 대응 예"], rows: [
                  ["UDP Flooding", "출발지를 위조한 대량 UDP 데이터로 회선을 포화시킵니다. 대상이 해당 UDP Port를 열지 않아도 공격할 수 있습니다.", "미사용 UDP 차단, Null routing, DDoS 방어 서비스·KISA 대피소, 패킷 크기·발신 IP 임계치, Anycast, 포트·비정상 트래픽 필터링, IPS"],
                  ["ICMP Flooding", "다량의 ICMP Echo Request로 대역폭을 소모합니다. 반사 증폭 공격과 달리 공격 기기의 송신 대역폭이 공격 규모를 좌우합니다.", "불필요한 외부 ICMP 차단, 상단 라우터·방화벽 필터, DDoS 방어 서비스"]
                ] },
                { type: "text", title: "임계치와 Null routing", paragraphs: ["교재는 UDP 패킷에 대해 발신자 IP별 초당 200개 초과를 차단하는 예를 제시합니다. 이는 교재의 정책 예시이지 모든 네트워크에 적용되는 보편 기준은 아닙니다.", "Null routing(Null0)은 지정 트래픽을 라우팅하지 않고 폐기하는 대응입니다. 피해 대상 주소로 가는 트래픽을 우회·폐기할 때 전체 정상 트래픽까지 차단하지 않도록 적용 범위를 확인해야 합니다."] }
              ],
              memoryPoints: ["UDP Flood는 비연결형 프로토콜의 대량 전송, ICMP Flood는 Echo 요청 폭주입니다.", "초당 200개 기준은 원문에 제시된 예시 값으로만 다룹니다."]
            },
            {
              id: "ddos-reflection-attacks",
              title: "DRDoS와 반사·증폭 공격",
              summary: "출발지 IP를 피해자로 위조해 반사 서버의 응답을 피해자에게 보내는 구조와 DNS·NTP·Memcached·SYN/ACK 사례를 설명합니다.",
              sourcePdfPages: [352, 354],
              keywords: ["DRDoS", "Reflection", "Amplification", "DNS ANY", "NTP monlist", "Memcached", "11211/UDP", "SYN/ACK"],
              questionKeywords: ["DRDoS", "Distributed Reflection", "반사 공격", "증폭 공격", "DNS 반사", "ANY", "NTP", "monlist", "600개", "Memcached", "11211/UDP", "SYN/ACK 반사"],
              blocks: [
                { type: "diagram", title: "DRDoS 반사 흐름", nodes: [
                  { label: "공격자", detail: "요청 패킷의 출발지 IP를 피해자 IP로 위조" },
                  { label: "반사 서버", detail: "요청에 응답하며 응답 트래픽을 피해자로 전송" },
                  { label: "피해자", detail: "다수 서버의 응답을 받아 대역폭·자원 고갈" }
                ], caption: "봇넷이 피해자에게 직접 보내는 DDoS와 달리, 공개 반사 서버의 응답이 피해자에게 향합니다." },
                { type: "table", title: "교재의 반사 서비스 사례", columns: ["서비스", "교재에 나온 악용 지점"], rows: [
                  ["DNS", "ANY 질의로 영역의 여러 레코드를 요청해 응답을 증폭"],
                  ["NTP", "구버전의 monlist 명령은 최근 접속한 최대 600개 호스트 정보를 응답할 수 있음"],
                  ["Memcached", "UDP 11211 포트를 이용한 대량 응답 악용 사례"],
                  ["기타", "SNMP·CLDAP·SSDP 등 요청보다 큰 응답을 제공하는 노출 서비스"]
                ] },
                { type: "text", title: "SYN/ACK 반사", paragraphs: ["공격자가 출발지를 피해자 IP로 위조하고 반사 서버로 SYN 패킷을 보내면, 서버의 SYN/ACK 응답이 피해자에게 전달되어 자원을 소모시킬 수 있습니다. 일정 시간 동안 임계치를 넘는 출발지에 대한 제한·차단이 교재의 대응 예입니다."] }
              ],
              memoryPoints: ["DRDoS = 피해자 주소 위조 + 공개 반사 서버 + 응답 집중입니다.", "NTP monlist의 교재 기재 수치는 최대 600개 호스트이며, Memcached 사례의 포트는 UDP 11211입니다."]
            },
            {
              id: "ddos-syn-flooding",
              title: "SYN Flooding과 TCP 백로그",
              summary: "3-Way Handshake의 미완료 연결을 백로그 큐에 누적시켜 서버 자원을 고갈시키는 공격과 교재의 대응을 다룹니다.",
              sourcePdfPages: [354, 356],
              keywords: ["SYN Flooding", "SYN Cookie", "Backlog Queue", "First SYN Drop", "tcp_syncookies"],
              questionKeywords: ["SYN Flooding", "SYN Flood", "SYN Cookie", "Backlog Queue", "백로그 큐", "tcp_syncookies", "120개", "First SYN Drop", "Half Open"],
              blocks: [
                { type: "diagram", title: "미완료 연결의 누적", nodes: [
                  { label: "공격 봇", detail: "위조 출발지에서 SYN 전송" },
                  { label: "피해 서버", detail: "SYN/ACK 응답 후 ACK 대기" },
                  { label: "백로그 큐", detail: "완료되지 않은 세션 정보를 보관" },
                  { label: "정상 사용자", detail: "큐·연결 자원 부족으로 접속 실패" }
                ], caption: "공격자는 최종 ACK를 보내지 않아 Half-Open 상태를 지속시킵니다." },
                { type: "table", title: "대응 방법과 교재 예시", columns: ["대응", "내용"], rows: [
                  ["SYN Cookie", "완료 전 연결 상태를 저장하는 부담을 줄이는 기법. 교재는 CentOS 설정 예로 `sysctl -w net.ipv4.tcp_syncookies=1`을 제시"],
                  ["연결 유지 시간 조정", "Connection Timeout·KeepAlive 관련 설정을 조정"],
                  ["임계치 차단", "교재 예: IP별 초당 120개 이상 SYN이 오면 300초 차단"],
                  ["First SYN Drop", "첫 SYN을 폐기해 재전송·정상 연결 요청을 구분하는 방식"],
                  ["백로그 큐 조정", "수용 가능한 미완료 연결 큐 크기를 조정"]
                ] }
              ],
              memoryPoints: ["3-Way Handshake에서 마지막 ACK가 오지 않은 Half-Open 연결이 백로그에 쌓입니다.", "sysctl 명령과 120개/초·300초 수치는 PDF 356쪽의 원본 표에서 확인했습니다."]
            }
          ]
        },
        {
          id: "network-application-dos",
          title: "TCP·DNS·웹 자원 소진 공격",
          chapter: "네트워크 기반 공격 기술",
          summary: "ACK·DNS Flooding, HTTP 요청 및 저속 연결 공격, HTTP 파싱·캐시 악용, DDoS 예방 대책을 정리합니다.",
          status: "published",
          sourcePdfPages: [356, 367],
          concepts: [
            {
              id: "ddos-ack-dns-flooding",
              title: "ACK·DNS Query Flooding",
              summary: "ACK 처리와 DNS 응답 자원을 소모시키는 공격 방식 및 교재에 제시된 IP별 임계치 대응을 비교합니다.",
              sourcePdfPages: [356, 358],
              keywords: ["ACK Flooding", "DNS Query Flooding", "Stateful Inspection"],
              questionKeywords: ["ACK Flooding", "ACK Flood", "DNS Query Flooding", "DNS 질의", "Stateful Inspection", "1,000개", "100개"],
              blocks: [
                { type: "table", title: "공격과 대응", columns: ["공격", "작동 방식", "교재의 대응 예"], rows: [
                  ["ACK Flooding", "대량 ACK가 서버의 응답 연관성·세션 처리를 반복하게 하여 컴퓨팅 자원을 소모", "IP별 초당 1,000개 이상 ACK를 보내면 10초 차단하는 임계치 예, Stateful Inspection으로 비정상 ACK 필터링"],
                  ["DNS Query Flooding", "봇넷에서 피해 DNS 서버가 제공하는 도메인을 대량 질의해 정상 질의의 처리를 방해", "IP별 초당 100개 이상 질의 시 10초 차단하는 임계치 예, 존재하지 않는 호스트명 등 비정상 질의 탐지"]
                ] },
                { type: "text", title: "해석할 때 주의", paragraphs: ["교재의 초당 개수·차단 시간은 공격 대응 정책의 예시입니다. 이를 모든 서버에 적용할 절대 기준으로 일반화하지 않습니다.", "Stateful Inspection은 세션 상태를 저장·추적하여 연결 상태에 맞지 않는 패킷을 검사·차단하는 방화벽 기능입니다."] }
              ],
              memoryPoints: ["ACK Flood는 서버의 ACK 처리 자원, DNS Query Flood는 질의 응답 자원을 소모합니다.", "교재의 예시 임계치는 ACK 1,000개/초·10초, DNS 100개/초·10초입니다."]
            },
            {
              id: "ddos-http-flooding-slow-http",
              title: "GET Flooding과 Slow HTTP 공격",
              summary: "정상처럼 보이는 HTTP GET 과다 요청과 Slowloris·RUDY·Slow Read의 연결 유지 원리 및 대응을 구분합니다.",
              sourcePdfPages: [358, 362],
              keywords: ["GET Flooding", "Slowloris", "RUDY", "Slow Read", "Content-Length", "Window Size", "CRLF"],
              questionKeywords: ["GET Flooding", "Slowloris", "RUDY", "Slow HTTP POST", "Slow Read", "Content-Length", "Window Size", "0D0A", "CRLF", "Session Timeout"],
              blocks: [
                { type: "table", title: "웹 자원 소진 공격 비교", columns: ["공격", "원리", "대응 방향"], rows: [
                  ["GET Flooding", "TCP 연결을 완료한 봇이 HTTP GET 요청을 대량 발생시켜 웹·DB 자원을 소모", "존재하지 않는 URL·동일 URL의 과다 요청 제한, 쿠키 확인 등으로 비정상 요청 판별"],
                  ["Slowloris", "HTTP 헤더 종료 CRLF CRLF(16진수 0D 0A 0D 0A)를 보내지 않고 불완전 헤더 연결을 유지", "Session Timeout 조정, 헤더 종료 개행이 부족한 패킷 시그니처 차단"],
                  ["RUDY", "비정상적으로 큰 Content-Length를 선언하고 POST 본문을 매우 느리게 전송", "Content-Length·실제 수신 크기 임계치와 Session Timeout 적용"],
                  ["Slow Read", "작은 TCP Window Size를 설정해 전송이 끝나지 않은 연결을 장기간 유지", "비정상 Window Size·전송률과 연결 유지 시간 점검"]
                ] },
                { type: "text", title: "HTTP 헤더 종료", paragraphs: ["교재는 정상 헤더가 CRLF 두 번(각각 0D 0A)으로 끝나며, Slowloris는 이 종료 표시를 완성하지 않은 채 연결을 유지한다고 설명합니다.", "웹 서버의 Session Timeout은 일정 시간 동안 완료되지 않는 요청 연결을 정리하는 대응입니다."] }
              ],
              memoryPoints: ["Slowloris=헤더 미완성, RUDY=Content-Length가 큰 느린 POST 본문, Slow Read=작은 TCP Window입니다.", "HTTP 종료 바이트와 숫자는 PDF 360쪽 이미지에서 재확인했습니다."]
            },
            {
              id: "ddos-http-protocol-abuse",
              title: "HTTP 응답 분할·요청 스머글링",
              summary: "CR·LF 삽입으로 응답을 나누는 공격과 프론트엔드·백엔드 서버의 HTTP 파싱 차이를 악용하는 공격을 비교합니다.",
              sourcePdfPages: [363, 364],
              keywords: ["HTTP Response Splitting", "CR", "LF", "HTTP Request Smuggling", "CL.TE", "TE.CL", "TE.TE"],
              questionKeywords: ["HTTP 응답 분할", "Response Splitting", "%0D", "%0A", "CR", "LF", "HTTP Request Smuggling", "CL.TE", "TE.CL", "TE.TE", "Transfer-Encoding"],
              blocks: [
                { type: "table", title: "두 공격 비교", columns: ["공격", "취약점·작동 방식", "핵심 대응"], rows: [
                  ["HTTP 응답 분할", "요청 입력의 CR(%0D)·LF(%0A)로 첫 응답을 종료하고 뒤에 악성 응답을 삽입", "요청 입력값과 응답 헤더 값을 검증하고 CR/LF를 통제"],
                  ["HTTP 요청 스머글링", "프론트엔드와 백엔드가 Content-Length와 Transfer-Encoding을 다르게 우선 처리해 요청 경계를 다르게 해석", "앞·뒤 서버의 HTTP 파싱 규칙을 일치시키고 모호한 중복·충돌 헤더를 거부"]
                ] },
                { type: "table", title: "요청 스머글링 유형", columns: ["유형", "서버 간 처리 차이"], rows: [
                  ["CL.TE", "프론트엔드는 Content-Length, 백엔드는 Transfer-Encoding을 우선 처리"],
                  ["TE.CL", "프론트엔드는 Transfer-Encoding, 백엔드는 Content-Length를 우선 처리"],
                  ["TE.TE", "양쪽 모두 Transfer-Encoding을 지원하지만 변형·모호한 헤더를 서로 다르게 처리"]
                ] }
              ],
              memoryPoints: ["응답 분할은 CR/LF 입력값, 요청 스머글링은 프론트·백엔드 간 메시지 경계 해석 불일치를 기억합니다.", "CL.TE와 TE.CL은 각 서버가 우선하는 헤더 순서를 반대로 읽습니다."]
            },
            {
              id: "ddos-cache-hulk-hash",
              title: "CC·Hulk·Hash DoS",
              summary: "캐시 우회, 변동 URL, 다량의 파라미터로 웹 서버·해시 테이블 자원을 소모하는 공격을 구분합니다.",
              sourcePdfPages: [365],
              keywords: ["CC Attack", "Cache-Control", "Hulk", "Hash DoS", "max-age=0", "no-cache"],
              questionKeywords: ["CC 공격", "Cache-Control", "max-age=0", "no-cache", "no-store", "must-revalidate", "Hulk", "Http Unbearable Load King", "Hash DoS", "해시 충돌"],
              blocks: [
                { type: "table", title: "웹 요청 악용 비교", columns: ["공격", "요청·처리 특성", "주요 자원 영향"], rows: [
                  ["CC(Cache-Control)", "Cache-Control에 no-cache, max-age=0, no-store, must-revalidate 등을 넣어 캐시를 활용하지 못하게 요청", "캐시 서버를 우회해 원 서버에 부하 집중"],
                  ["Hulk", "URL·매개변수를 계속 변경해 동일 임계치·캐시 조건의 우회를 시도하는 GET 요청", "웹 서버·DB에 서로 다른 요청 부하"],
                  ["Hash DoS", "HTTP POST에 많은 파라미터를 보내 해시 테이블 충돌을 유발", "파라미터 처리에 CPU·메모리를 사용"]
                ] }
              ],
              memoryPoints: ["CC는 캐시 무력화, Hulk는 요청 URL 변경, Hash DoS는 해시 충돌을 이용합니다.", "Cache-Control 지시자와 공격 차이는 PDF 365쪽 OCR 본문에서 확인했습니다."]
            },
            {
              id: "ddos-prevention-web-layers",
              title: "DDoS 예방 대책과 웹 영역",
              summary: "외부 방어 서비스·이중화·망 분리·DNS 싱크홀 대책과 표면웹·딥웹·다크웹의 교재상 구분을 정리합니다.",
              sourcePdfPages: [366, 367],
              keywords: ["DDoS 예방", "KISA 사이버 대피소", "ISP", "CDN", "DNS Sinkhole", "Surface Web", "Deep Web", "Dark Web", "Darknet"],
              questionKeywords: ["DDoS 예방 대책", "KISA 사이버 대피소", "백업 서버", "Master Server", "Slave Server", "망 분리", "DNS Sinkhole", "표면웹", "딥웹", "다크웹", "Darknet", "Tor"],
              blocks: [
                { type: "bullets", title: "DDoS 대비", items: ["ISP·클라우드의 DDoS 방어 서비스 또는 교재에 언급된 KISA 사이버 대피소를 활용합니다.", "중요 서버는 서로 다른 회선의 Master/Slave 또는 Cloud·CDN 등으로 이중화합니다.", "내부 서버를 외부에 직접 노출하지 않도록 망을 분리하고, 공개 IP·서비스 노출을 주기적으로 점검합니다.", "외부에서 내부로 접속할 때 방어 설정이 가능한 VPN 등 별도 서비스를 이용합니다.", "악성 봇이 C&C에 연결하지 못하도록 DNS Sinkhole로 명령 서버 통신을 우회합니다."] },
                { type: "table", title: "웹 영역 구분", columns: ["영역", "교재의 설명"], rows: [
                  ["표면웹", "일반 검색 엔진에서 크롤링·인덱싱되는 공개 웹"],
                  ["딥웹", "검색 엔진에 인덱싱되지 않으며 직접 주소 입력·로그인 등으로 접근하는 비공개 정보의 영역. 합법적 이용이 대부분"],
                  ["다크웹", "딥웹의 일부로, Tor 같은 특수 브라우저·설정·인증이 필요한 오버레이 네트워크에 존재. 익명성과 불법 활동 연관성이 교재에 설명됨"]
                ] }
              ],
              memoryPoints: ["대응 서비스·이중화·망 분리·노출 점검·VPN·DNS Sinkhole을 계층적으로 적용합니다.", "다크웹은 딥웹의 일부이며 Darknet은 그 기반이 되는 특수 오버레이 네트워크입니다."]
            }
          ]
        },
        {
          id: "network-port-scanning",
          title: "포트·취약점 스캐닝",
          chapter: "네트워크 기반 공격 기술",
          summary: "호스트 탐색, TCP·UDP 포트 스캔의 응답 차이, 방화벽 확인, 은닉 스캔과 Nmap 문법을 정리합니다.",
          status: "published",
          sourcePdfPages: [385, 393],
          concepts: [
            {
              id: "network-sweep-connect-scan",
              title: "Sweep·TCP Connect·SYN Scan",
              summary: "호스트 존재 확인용 Sweep과 3-Way Handshake를 완료하는 Connect Scan 및 SYN만 보내는 Half-Open Scan을 비교합니다.",
              sourcePdfPages: [385, 388],
              keywords: ["Sweep", "TCP Connect Scan", "Full Open", "SYN Scan", "Half Open"],
              questionKeywords: ["스위프", "Sweep", "TCP Full Open Scan", "TCP Connect Scan", "connect()", "Half Open Scan", "SYN Scan", "SYN+ACK", "RST+ACK"],
              blocks: [
                { type: "table", title: "스캔 유형", columns: ["유형", "동작·결과", "특징"], rows: [
                  ["Sweep", "ICMP·TCP·UDP 방식으로 주소 범위에 응답하는 시스템을 확인", "소유 IP·네트워크 범위를 파악하는 정찰"],
                  ["TCP Full Open / Connect", "connect()를 이용해 SYN→SYN+ACK→ACK의 연결을 완료하고 포트 확인 후 RST+ACK로 종료", "일반 사용자 권한으로 실행 가능하고 결과가 비교적 신뢰성 있지만 느리고 로그가 남음"],
                  ["TCP Half Open / SYN", "SYN에 SYN+ACK가 오면 열린 포트로 판단하고 RST를 보내 연결을 완성하지 않음. 닫힌 포트는 RST+ACK 응답", "원시 TCP 패킷을 다루는 관리자 권한이 필요하며 연결 로그는 줄지만 SYN 전송 흔적은 남을 수 있음"]
                ] },
                { type: "diagram", title: "SYN 스캔 응답", nodes: [
                  { label: "SYN 전송", detail: "대상 포트에 연결 요청" },
                  { label: "SYN+ACK", detail: "열린 포트 응답" },
                  { label: "RST", detail: "연결을 완성하지 않고 중단" },
                  { label: "RST+ACK", detail: "닫힌 포트 응답" }
                ], caption: "교재의 Half-Open TCP 스캔 흐름을 요약했습니다." }
              ],
              memoryPoints: ["Full Open은 3-Way Handshake 완료, Half Open은 SYN 이후 RST로 종료합니다.", "RST+ACK는 Full Open에서 확인 후 종료할 때와 닫힌 포트 응답에 등장합니다."]
            },
            {
              id: "network-udp-stealth-scan",
              title: "UDP·FIN·NULL·Xmas 스캔",
              summary: "UDP 응답의 불확실성과 특수 TCP 플래그 조합을 이용한 스텔스 스캔의 응답 해석을 학습합니다.",
              sourcePdfPages: [388, 390],
              keywords: ["UDP Scan", "FIN Scan", "NULL Scan", "Xmas Scan", "Stealth Scan", "Fragmentation Scan"],
              questionKeywords: ["UDP Scan", "ICMP Port Unreachable", "FIN Scan", "NULL Scan", "Xmas Tree Scan", "스텔스 스캔", "RST", "Windows"],
              blocks: [
                { type: "table", title: "패킷과 응답", columns: ["스캔", "송신·응답", "해석상 주의"], rows: [
                  ["UDP", "UDP 패킷 전송. 열린 포트는 응답이 없을 수 있고, 닫힌 포트는 ICMP Port Unreachable 응답", "응답 없음이 열린 포트라는 확정 증거는 아니므로 정확도가 낮음"],
                  ["FIN", "FIN 플래그만 설정", "교재는 Unix 계열의 응답 차이를 설명하며 Windows 계열 시스템 탐지에 사용할 수 없다고 기술"],
                  ["NULL", "TCP 제어 플래그를 설정하지 않음", "교재의 해당 설명에서 닫힌 포트는 RST 응답, 열린 포트는 무응답"],
                  ["Xmas", "FIN·PSH·URG 플래그 조합", "크리스마스트리처럼 플래그를 켠 형태. NULL·FIN과 함께 스텔스 스캔으로 설명"]
                ] },
                { type: "bullets", title: "스텔스 스캔", items: ["특수한 TCP 패킷으로 포트 활성화를 확인하며 완전한 세션을 맺지 않아 로그에 덜 노출될 수 있습니다.", "교재는 Half-Open과 TCP Fragmentation 스캔도 스텔스 범주에 포함한다고 강조합니다.", "방화벽·운영체제 구현에 따라 응답 차이가 있으므로 무응답만으로 열린 포트라 단정하지 않습니다."] }
              ],
              memoryPoints: ["UDP는 열린 포트 무응답·닫힌 포트 ICMP 오류 때문에 결과가 불확실합니다.", "Xmas=FIN+PSH+URG, NULL=플래그 없음, FIN=FIN만 설정입니다."]
            },
            {
              id: "network-ack-decoy-scan",
              title: "ACK·Decoy·FTP Bounce 스캔",
              summary: "포트의 개방 여부와 방화벽 필터링 상태를 혼동하지 않도록 ACK 스캔 및 출발지 위장형 스캔을 구분합니다.",
              sourcePdfPages: [390, 391],
              keywords: ["ACK Scan", "Decoy Scan", "FTP Bounce", "Stateful Firewall"],
              questionKeywords: ["TCP ACK Scan", "ACK Scan", "Stateful", "방화벽 필터링", "Decoy Scan", "위조 주소", "FTP Bounce"],
              blocks: [
                { type: "table", title: "스캔 기법", columns: ["기법", "목적·작동"], rows: [
                  ["TCP ACK", "ACK 패킷 응답을 이용해 방화벽 필터링 정책·상태 기반 여부를 파악합니다. 포트가 열려 있는지를 직접 판정하는 스캔은 아닙니다."],
                  ["Decoy", "실제 스캐너 외에 여러 위조 출발지 주소를 사용해 스캐너 주소 식별을 어렵게 합니다."],
                  ["FTP Bounce", "FTP 서버의 중계 기능을 악용하는 스캔 유형으로 Nmap의 -b 옵션과 연결해 다룹니다."]
                ] },
                { type: "text", title: "ACK 스캔 결과", paragraphs: ["차단되지 않은 상태에서는 RST 응답을 받을 수 있고, 필터링되는 상태에서는 응답이 없거나 ICMP 오류가 올 수 있습니다. 이 결과는 방화벽의 처리 상태에 관한 것으로 대상 서비스의 포트 개방 여부와 구별해야 합니다."] }
              ],
              memoryPoints: ["ACK Scan은 포트 오픈 판정이 아니라 방화벽 규칙·필터링 상태 확인입니다.", "Decoy는 실제 스캐너 외 위조 IP를 섞습니다."]
            },
            {
              id: "nmap-syntax-options",
              title: "Nmap 문법과 주요 옵션",
              summary: "교재에 수록된 Nmap 스캔 유형·포트 지정·출력 파일·운영체제 탐지 옵션과 사용 예를 확인합니다.",
              sourcePdfPages: [391, 392],
              keywords: ["Nmap", "Network Mapper", "-sS", "-sT", "-sU", "-p", "-O"],
              questionKeywords: ["NMap", "Nmap", "Network Mapper", "-sS", "-sT", "-sU", "-sF", "-sX", "-sN", "-sA", "-sP", "-sD", "-b", "-p", "-oN", "-oX", "-oG", "-O"],
              blocks: [
                { type: "code", title: "기본 문법", language: "bash", code: "nmap [Scan Type] [Option] [Target]\nnmap -v 192.168.1.200\nnmap -sP 192.168.1.200\nnmap -O 192.168.1.200" },
                { type: "table", title: "스캔 옵션", columns: ["옵션", "교재 설명"], rows: [
                  ["-sS / -sT / -sU", "TCP SYN(Half-Open) / TCP Connect(Open) / UDP Scan"],
                  ["-sF / -sX / -sN / -sA", "FIN / Xmas / NULL / ACK Scan"],
                  ["-sP / -sD / -b", "Ping Scan / Decoy Scan / FTP Bounce Scan"],
                  ["-p 80 또는 -p 80,443 또는 -p 1-100", "단일 포트·복수 포트·범위 지정"],
                  ["-v / -d", "상세 출력 / 디버깅"],
                  ["-oN <file> / -oX <file> / -oG <file>", "일반 / XML / Grepable 형식으로 결과 저장"],
                  ["-O", "대상 호스트 운영체제 정보 탐지"]
                ] }
              ],
              memoryPoints: ["문법 순서는 Scan Type, Option, Target입니다.", "옵션 대소문자와 하이픈 표기는 PDF 391–392쪽 이미지에서 재확인했습니다."]
            }
          ]
        },
        {
          id: "network-spoofing-sniffing-session",
          title: "스푸핑·스니핑·세션 하이재킹",
          chapter: "네트워크 기반 공격 기술",
          summary: "ARP·IP·DNS 위장, 스니핑과 스위치 환경 공격, ICMP·ARP Redirect, Sentinel 탐지 및 TCP 세션 하이재킹을 다룹니다.",
          status: "published",
          sourcePdfPages: [401, 410],
          concepts: [
            {
              id: "network-arp-ip-spoofing",
              title: "ARP·IP·DNS 스푸핑",
              summary: "ARP 캐시 위조로 중간 경로를 차지하는 공격, 신뢰 호스트 IP 위장, DNS 응답·이메일 주소 위조를 구분합니다.",
              sourcePdfPages: [401, 404],
              keywords: ["ARP Spoofing", "IP Spoofing", "DNS Spoofing", "Trust", "Ingress Filtering", "arp -s"],
              questionKeywords: ["ARP 스푸핑", "ARP Spoofing", "arp -s", "IP 스푸핑", "IP Spoofing", "Trust", "Ingress Filtering", "DNS Spoofing", "이메일 스푸핑"],
              blocks: [
                { type: "table", title: "스푸핑 기법 비교", columns: ["기법", "위조·영향", "대응"], rows: [
                  ["ARP Spoofing", "위조 ARP Reply로 IP-MAC 매핑을 공격자 MAC으로 바꿔 중간에서 트래픽을 관찰·중계", "중요 호스트의 정적 ARP 설정, 재부팅 시 설정 복구, 비정상 ARP Reply 모니터링"],
                  ["IP Spoofing", "신뢰 관계를 맺은 호스트의 IP 주소로 위장하여 IP 기반 인증을 악용", "Ingress Filtering으로 외부에서 들어오는 내부 출발지 주소 패킷 차단, IP만 신뢰하는 인증 회피, SSH·TCP Wrapper 등 사용"],
                  ["DNS Spoofing", "DNS 응답 IP를 위조하거나 DNS 서버를 장악해 잘못된 주소로 연결 유도", "DNS 응답·서버 무결성 및 신뢰 경로 보호"],
                  ["Email Spoofing", "발신자의 이메일 주소를 위조해 신뢰된 발신자로 오인 유도", "발신 도메인 검증 등 메시지 출처 확인"]
                ] },
                { type: "code", title: "정적 ARP 명령", language: "bash", code: "arp -s [IP 주소] [MAC 주소]" },
                { type: "text", title: "IP 신뢰 관계 악용", paragraphs: ["교재는 rlogin 등에서 등록된 클라이언트 IP를 신뢰하는 관계를 예로 듭니다. 공격자는 신뢰 호스트의 주소를 파악하고 그 호스트를 사용 불능 상태로 만든 뒤 IP를 위장해 접속을 시도합니다. IP 주소만으로 인증하는 정책을 피하고 외부 유입 패킷의 출발지 주소를 필터링해야 합니다."] }
              ],
              memoryPoints: ["ARP Spoofing은 IP-MAC 캐시, IP Spoofing은 출발지 IP·신뢰 관계, DNS Spoofing은 이름 해석 결과를 노립니다.", "정적 ARP 문법은 PDF 402쪽 원본에서 확인했습니다."]
            },
            {
              id: "network-sniffing-switch-attacks",
              title: "스니핑과 스위치 환경 공격",
              summary: "무차별 모드 패킷 도청과 포트 미러링, MAC 테이블을 넘치게 하는 Switch Jamming의 원리와 탐지를 정리합니다.",
              sourcePdfPages: [404, 405],
              keywords: ["Sniffing", "Promiscuous Mode", "Port Mirroring", "Switch Jamming", "MAC Table"],
              questionKeywords: ["스니핑", "Sniffing", "Promiscuous Mode", "무차별 모드", "Port Mirroring", "Switch Jamming", "스위치 재밍", "MAC 주소 테이블"],
              blocks: [
                { type: "table", title: "스니핑 관련 개념", columns: ["개념", "설명"], rows: [
                  ["Sniffing", "대상에게 직접 공격하지 않고 네트워크 패킷을 수집·분석하는 수동적 도청"],
                  ["Promiscuous Mode", "이더넷 인터페이스가 자신의 MAC 주소와 다른 패킷도 수신·관찰하는 모드"],
                  ["Port Mirroring", "스위치의 특정 포트 트래픽을 모니터링 포트로 복제하는 기능"],
                  ["Switch Jamming", "위조 MAC 프레임을 대량 전송해 MAC 주소 테이블을 넘치게 하고 스위치가 허브처럼 동작하도록 유도"]
                ] },
                { type: "bullets", title: "점검", items: ["Port Mirroring은 정상적인 모니터링 기능이지만 미러링 대상 포트와 접근 권한을 통제합니다.", "MAC 테이블 용량·학습 이상을 모니터링하고 포트·MAC 주소 기반 제어로 무작위 프레임의 영향을 줄입니다.", "스니핑은 패킷을 직접 변조하지 않아 일반 통신량만으로 식별하기 어려운 수동 공격입니다."] }
              ],
              memoryPoints: ["Port Mirroring은 포트 트래픽 복제, Switch Jamming은 MAC 테이블 포화입니다.", "스니핑에는 Promiscuous Mode가 사용될 수 있습니다."]
            },
            {
              id: "network-redirect-sniffer-detection",
              title: "ICMP·ARP Redirect와 스니퍼 탐지",
              summary: "위조 Redirect로 라우팅·ARP 경로를 바꾸는 공격과 교재의 Ping·ARP·Sentinel 기반 탐지 예를 정리합니다.",
              sourcePdfPages: [405, 408],
              keywords: ["ICMP Redirect", "Type 5", "ARP Redirect", "Sentinel", "Sniffer Detection"],
              questionKeywords: ["ICMP Redirect", "Type 5", "ARP Redirect", "스니핑 탐지", "Sentinel", "./sentinel", "Etherping", "DNS Test", "ARP Test"],
              blocks: [
                { type: "table", title: "Redirect 공격", columns: ["공격", "원리", "대응"], rows: [
                  ["ICMP Redirect", "위조 ICMP Type 5 메시지로 더 나은 경로를 가장해 피해 시스템의 라우팅 테이블 변경 유도", "ICMP Redirect 필터링, 정적 라우팅, 트래픽 모니터링, 보안 패치"],
                  ["ARP Redirect", "위조 ARP Reply로 게이트웨이 MAC 매핑을 공격자 주소로 바꾸고 트래픽을 중계", "ARP Spoofing 방지, 정적·단기 캐시 정책, IDS·VPN 등 네트워크 보호"]
                ] },
                { type: "code", title: "Sentinel 탐지 명령 예", language: "bash", code: "./sentinel -a -t 211.47.65.4\n./sentinel -d -f 1.1.1.1 -t 211.47.65.4\n./sentinel -e -t 211.47.65.4" },
                { type: "table", title: "Sentinel 옵션", columns: ["옵션", "교재의 의미"], rows: [["-a", "ARP Test"], ["-d", "DNS Test"], ["-f", "존재하지 않는 호스트 추가"], ["-i", "ICMP Ping Latency Test"], ["-e", "ICMP Etherping Test"], ["-t <IP>", "검사 대상 IP 지정"]] }
              ],
              memoryPoints: ["ICMP Redirect는 Type 5이며, ARP Redirect는 IP-MAC 매핑을 바꿉니다.", "Sentinel 명령 옵션·대상 IP 표기는 PDF 408쪽 이미지와 대조했습니다."]
            },
            {
              id: "tcp-session-hijacking",
              title: "TCP 세션 하이재킹",
              summary: "인증 후 생성된 TCP 세션의 순서 번호를 이용해 연결을 탈취·중계하는 절차와 탐지·대응을 정리합니다.",
              sourcePdfPages: [408, 410],
              keywords: ["Session Hijacking", "TCP Sequence Number", "ACK", "RST", "ISN", "ACK Storm"],
              questionKeywords: ["세션 하이재킹", "Session Hijacking", "TCP Session Hijacking", "시퀀스 번호", "SEQ", "ACK", "RST", "ACK Storm", "ISN", "세션 ID"],
              blocks: [
                { type: "table", title: "TCP 세션 탈취 흐름", columns: ["단계", "교재의 절차"], rows: [
                  ["1. 관찰·번호 획득", "ARP Spoofing 등으로 통신을 관찰해 세션 정보와 클라이언트의 시퀀스 번호를 획득"],
                  ["2. 기존 연결 차단", "클라이언트 IP로 위장한 RST를 보내 피해자 연결을 끊음"],
                  ["3. 서버 연결 생성", "클라이언트 주소로 위장해 서버와 새로운 TCP 연결을 시도하고 시퀀스 번호를 맞춤"],
                  ["4. 세션 중계·조작", "공격자와 서버 사이의 통신을 중계하고 피해자 권한으로 요청을 전송한 뒤 세션을 종료"]
                ] },
                { type: "table", title: "탐지와 대응", columns: ["항목", "징후·대응"], rows: [
                  ["비동기화", "SEQ/ACK 번호 불일치, 중복·누락 번호를 점검"],
                  ["ACK Storm", "클라이언트·서버 간 ACK만 반복되는 현상 감지"],
                  ["예상치 못한 RST", "통신 중 갑작스러운 RST 수신 여부 확인"],
                  ["예방", "TLS·IPsec 등 암호화, TCP ISN 무작위화, 로그인 시 세션 ID 재생성·만료, IDS/IPS 이상행위 탐지"]
                ] }
              ],
              memoryPoints: ["세션 하이재킹은 인증 후의 세션 식별정보·TCP 순서 번호를 노립니다.", "SEQ/ACK 비동기화, ACK Storm, 예상치 못한 RST가 교재의 탐지 단서입니다."]
            }
          ]
        },
        {
          id: "network-security-protocols",
          title: "보안 프로토콜의 동작 원리와 특징",
          chapter: "네트워크 보안 기술",
          summary: "IPSec의 보안 서비스·모드·구성요소와 SSL/TLS 레코드·핸드셰이크, S-HTTP의 목적을 학습합니다.",
          status: "published",
          sourcePdfPages: [420, 428],
          concepts: [
            {
              id: "ipsec-services-modes-components",
              title: "IPSec 보안 서비스·모드·구성요소",
              summary: "IP 계층에서 AH·ESP·IKE와 SPD·SAD를 사용해 인증·무결성·기밀성·재전송 방지를 제공합니다.",
              sourcePdfPages: [420, 423],
              keywords: ["IPSec", "AH", "ESP", "IKE", "SPD", "SAD", "SA", "Transport Mode", "Tunnel Mode"],
              questionKeywords: ["IPSec", "AH", "ESP", "IKE", "ISAKMP", "Oakley", "SKEME", "SPD", "SAD", "Security Association", "SPI", "전송 모드", "터널 모드", "Anti-Replay"],
              blocks: [
                { type: "table", title: "서비스와 프로토콜", columns: ["서비스·구성요소", "역할"], rows: [
                  ["기밀성", "ESP 암호화로 제3자에게 데이터가 노출되지 않도록 보호"],
                  ["무결성·인증", "AH 또는 ESP 인증 옵션으로 전송 중 변조 및 출처를 검증"],
                  ["재전송 방지", "시퀀스 번호와 Anti-Replay Window로 중복 패킷을 검사"],
                  ["AH", "IP 패킷의 송신자 인증·무결성 제공. IP 헤더는 보호하지 않음"],
                  ["ESP", "페이로드 기밀성을 제공하며 페이로드와 ESP 트레일러를 암호화하고 인증 옵션을 제공"],
                  ["IKE", "키·알고리즘을 협상해 보안 연결(SA)을 설정. 기반 구성으로 ISAKMP, Oakley, SKEME가 제시됨"]
                ] },
                { type: "table", title: "동작 모드와 정책 데이터베이스", columns: ["항목", "동작"], rows: [
                  ["전송 모드", "호스트 간 종단 통신에 주로 사용. 원래 IP 헤더는 유지되고 IP 페이로드를 보호"],
                  ["터널 모드", "VPN 게이트웨이 간 통신에 주로 사용. 원본 IP 패킷을 보호하고 새 IP 헤더를 추가"],
                  ["SPD", "트래픽에 Protect·Bypass·Discard 중 어떤 보안 정책을 적용할지 결정"],
                  ["SAD / SA", "SAD가 실제 보안 처리 파라미터를 저장하고, SA는 양 통신자가 합의한 알고리즘·키·수명을 나타냄"],
                  ["SPI·Sequence·Lifetime", "SA 식별자, 패킷 순서 추적·재전송 검사, 보안 연결의 유효 기간"]
                ] },
                { type: "diagram", title: "IPSec 패킷 구조 요약", nodes: [
                  { label: "Transport", detail: "기존 IP Header + AH/ESP + Payload" },
                  { label: "Tunnel", detail: "New IP Header + AH/ESP + Original IP Packet" },
                  { label: "SPD", detail: "적용할 정책 결정" },
                  { label: "SAD/SA", detail: "선택된 정책의 키·알고리즘·시퀀스 정보 보관" }
                ], caption: "교재의 AH·ESP 전송/터널 모드 설명을 논리적 패킷 구성으로 요약했습니다." }
              ],
              memoryPoints: ["AH는 인증·무결성, ESP는 기밀성 중심이며 인증 옵션도 가질 수 있습니다.", "전송 모드는 호스트 간, 터널 모드는 게이트웨이 간 VPN에서 주로 사용합니다.", "SPD는 정책, SAD는 SA 실행 파라미터를 저장합니다."]
            },
            {
              id: "ssl-tls-protocol",
              title: "SSL/TLS 구조와 핸드셰이크",
              summary: "브라우저와 서버 간 보안 연결을 위한 SSL/TLS 프로토콜 계층, 레코드 처리, 협상 메시지의 목적을 설명합니다.",
              sourcePdfPages: [424, 427],
              keywords: ["SSL", "TLS", "Handshake", "Record", "Cipher Suite", "MAC", "443/TCP", "SSL Pinning"],
              questionKeywords: ["SSL/TLS", "Secure Sockets Layer", "Transport Layer Security", "Handshake", "Change Cipher Spec", "Alert", "Application Data", "Record", "Cipher Suite", "443/TCP", "SSL Pinning", "Client Hello", "Server Hello"],
              blocks: [
                { type: "table", title: "SSL/TLS 프로토콜 구성", columns: ["구성", "역할"], rows: [
                  ["Handshake", "인증서 교환, 암호 알고리즘·Cipher Suite 협상, 세션 키 생성 등 초기 보안 협상"],
                  ["Change Cipher Spec", "협상된 보안 파라미터를 적용한다는 신호"],
                  ["Alert", "통신의 오류·경고·종료 등 이벤트 전달"],
                  ["Application Data", "협상된 보안 파라미터를 사용해 상위 계층 사용자 데이터를 전달"],
                  ["Record", "상위 계층 데이터를 조각화하고 MAC·암호화·헤더 처리를 수행"]
                ] },
                { type: "table", title: "Record 처리 순서와 주요 필드", columns: ["순서·필드", "설명"], rows: [
                  ["처리", "단편화 → (협상된 경우) 압축 → MAC 추가 → 암호화 → Record Header 추가"],
                  ["Content Type / Version", "상위 프로토콜 메시지 종류 / SSL·TLS 버전"],
                  ["Length", "Record 데이터 길이"],
                  ["MAC", "메시지 무결성 검증 값. 교재는 TLS 1.3에서 MAC 필드 설명이 달라짐을 표시"],
                  ["Cipher Suite", "키 교환·인증·암호화에 사용될 알고리즘 조합"]
                ] },
                { type: "bullets", title: "교재의 핸드셰이크 핵심", items: ["TCP 연결 성립 이후 Client Hello로 협상을 시작하고 Server Hello와 인증서 등 서버 측 정보를 교환합니다.", "필요한 경우 클라이언트 인증서와 키 교환 메시지를 주고받고 Change Cipher Spec·Finished로 협상 완료를 알립니다.", "교재는 기본 HTTPS 포트로 TCP 443을 들며, SSL/TLS는 웹 데이터 전송 구간의 기밀성·인증·무결성을 제공한다고 설명합니다.", "SSL Pinning은 애플리케이션에서 신뢰할 인증서를 고정해 임의 인증서를 이용한 중간자 공격을 막는 방식으로 소개됩니다."] }
              ],
              memoryPoints: ["Handshake는 보안 파라미터 협상, Record는 사용자 데이터 보호·전송입니다.", "기본 HTTPS 포트는 TCP 443이며, TLS가 통신 전후의 모든 데이터를 보호하는 것은 아닙니다."]
            },
            {
              id: "s-http-web-protocol",
              title: "S-HTTP와 웹 전송 보호",
              summary: "웹 메시지 보안에 사용하는 S-HTTP와 통신 채널을 보호하는 SSL/TLS의 보호 단위를 구분합니다.",
              sourcePdfPages: [427, 428],
              keywords: ["S-HTTP", "Secure HTTP", "SSL", "TLS", "HTTP"],
              questionKeywords: ["S-HTTP", "Secure Hypertext Transfer Protocol", "SSL", "TLS", "HTTP 암호화", "전송 구간"],
              blocks: [
                { type: "table", title: "웹 보안 프로토콜 비교", columns: ["프로토콜", "교재에서 설명하는 보호 관점"], rows: [
                  ["SSL/TLS", "전송계층과 응용계층 사이에서 브라우저와 서버의 통신 채널을 보호"],
                  ["S-HTTP", "HTTP 메시지 교환을 보호하기 위한 웹 보안 프로토콜로 교재에서 별도 항목으로 소개"]
                ] },
                { type: "text", title: "구분 기준", paragraphs: ["SSL/TLS 문제는 계층·핸드셰이크·Record·Cipher Suite를, S-HTTP 문제는 웹 트래픽 보호 프로토콜의 명칭과 목적을 중심으로 구분합니다. 교재 본문에 없는 세부 구현 차이는 보태지 않았습니다."] }
              ],
              memoryPoints: ["SSL/TLS는 연결 채널의 보안, S-HTTP는 HTTP 메시지 보호라는 교재상 구분으로 정리합니다."]
            }
          ]
        },
        {
          id: "network-firewall-vpn",
          title: "방화벽 구조와 VPN",
          chapter: "네트워크 보안 기술 및 응용",
          summary: "패킷·상태 기반 방화벽, 게이트웨이 배치 구조, WAF·NGFW와 VPN 터널링 방식을 학습합니다.",
          status: "published",
          sourcePdfPages: [439, 446, 451, 452],
          concepts: [
            {
              id: "firewall-filtering-types",
              title: "패킷 필터링과 상태 기반 검사",
              summary: "IP·Port·방향·프로토콜 조건의 패킷 필터와 TCP 세션 상태를 추적하는 Stateful Inspection의 차이를 설명합니다.",
              sourcePdfPages: [439, 441],
              keywords: ["Firewall", "Packet Filtering", "Stateful Inspection", "Positive Rule", "Negative Rule"],
              questionKeywords: ["방화벽", "Firewall", "패킷 필터링", "negative 규칙", "positive 규칙", "Stateful Packet Inspection", "Stateful Inspection", "상태정보 테이블"],
              blocks: [
                { type: "table", title: "방화벽 기능과 규칙", columns: ["항목", "설명"], rows: [
                  ["기능", "접근 통제·패킷 필터링·사용자 인증·감사 및 로그·프록시·주소 숨김·NAT"],
                  ["Negative", "모두 허용하고 차단할 항목만 거부"],
                  ["Positive", "모두 차단하고 허용할 항목만 통과"],
                  ["패킷 필터링", "출발지·목적지 IP, Port, 방향, 프로토콜, TCP Flag 등 헤더 기준으로 허용·차단"],
                  ["Stateful Inspection", "TCP 연결 상태 테이블을 추적해 패킷이 정상 세션 흐름에 속하는지 검사"]
                ] },
                { type: "bullets", title: "패킷 필터 기준", items: ["IP 주소 패킷 필터링은 주소 기반 흐름 제어, 서비스 필터링은 주소와 포트 등으로 SMTP·HTTP·HTTPS 같은 서비스를 제한합니다.", "Default 규칙을 포함한 정책의 허용 범위와 Inbound/Outbound 방향을 명확히 지정합니다.", "Stateful Inspection은 정상 세션 상태와 연결되지 않는 위조 패킷을 구분하는 데 도움을 줍니다."] }
              ],
              memoryPoints: ["Positive는 기본 차단 후 예외 허용, Negative는 기본 허용 후 예외 차단입니다.", "Stateful 방화벽은 세션 상태 정보를 함께 검사합니다."]
            },
            {
              id: "firewall-architectures",
              title: "방화벽 구성 구조와 DMZ",
              summary: "Bastion Host, Dual-Homed Gateway, Screened Host, Screened Subnet 구조 및 완충 구간의 역할을 비교합니다.",
              sourcePdfPages: [442, 445],
              keywords: ["Bastion Host", "Dual-Homed Gateway", "Screened Host", "Screened Subnet", "DMZ"],
              questionKeywords: ["베스천 호스트", "Bastion Host", "Dual-Homed Gateway", "Screened Host", "Screened Subnet", "스크린드 서브넷", "DMZ", "스크리닝 라우터"],
              blocks: [
                { type: "table", title: "구성 방식", columns: ["구조", "구성·특징"], rows: [
                  ["Bastion Host", "방화벽 기능을 수행하는 호스트를 내부·외부 네트워크의 주요 연결점에 배치"],
                  ["Dual-Homed Gateway", "두 개의 네트워크 인터페이스를 가진 Bastion Host가 외부·내부 네트워크를 구분"],
                  ["Screened Host", "스크리닝 라우터와 Bastion Host를 함께 사용"],
                  ["Screened Subnet", "스크리닝 라우터 2개 사이 별도 서브넷(DMZ)에 Bastion Host를 둬 완충 지대를 형성. 구조가 복잡하고 서비스 속도가 낮아질 수 있음"]
                ] },
                { type: "diagram", title: "Screened Subnet 개념", nodes: [
                  { label: "인터넷", detail: "외부 네트워크" },
                  { label: "외부 Screening Router", detail: "경계 필터" },
                  { label: "DMZ / Bastion Host", detail: "공개 서비스 완충 구역" },
                  { label: "내부 Screening Router", detail: "내부망 보호" },
                  { label: "내부 네트워크", detail: "중요 자산" }
                ], caption: "교재의 Screened Subnet 구조를 경계 장비와 완충 구역 순서로 표현했습니다." }
              ],
              memoryPoints: ["Screened Subnet은 스크리닝 라우터 2개와 DMZ·Bastion Host로 3중 방어를 형성합니다.", "보호 계층은 늘지만 구성·관리 복잡성과 지연이 커질 수 있습니다."]
            },
            {
              id: "ngfw-waf",
              title: "NGFW와 웹 애플리케이션 방화벽",
              summary: "차세대 방화벽의 응용 트래픽 식별·제어와 HTTP 요청·응답을 검사하는 WAF의 기능을 구분합니다.",
              sourcePdfPages: [445, 446],
              keywords: ["NGFW", "Next Generation Firewall", "WAF", "Web Application Firewall", "SQL Injection", "XSS"],
              questionKeywords: ["차세대 방화벽", "NGFW", "SSL Inspection", "URL Filtering", "WAF", "Web Application Firewall", "SQL Injection", "XSS", "CSRF"],
              blocks: [
                { type: "table", title: "기능 비교", columns: ["솔루션", "주요 기능"], rows: [
                  ["NGFW", "응용프로그램 식별·제어, SSL 트래픽 검사, URL 필터링, 알려지지 않은 위협 대응 등 차세대 방화벽 기능"],
                  ["WAF", "HTTP 헤더·URL·파라미터·응답을 검사해 SQL Injection·XSS·명령어 삽입 등 웹 공격을 탐지·차단하고 세션 보안·로그를 지원"]
                ] },
                { type: "text", title: "적용 범위", paragraphs: ["NGFW는 네트워크 경계의 애플리케이션 트래픽을 식별·통제하고, WAF는 웹 서버를 향하는 애플리케이션 계층 요청·응답을 집중 검사합니다."] }
              ],
              memoryPoints: ["NGFW는 애플리케이션 인지형 네트워크 경계 보안, WAF는 웹 요청·응답 보안입니다."]
            },
            {
              id: "vpn-types-protocols",
              title: "VPN 유형과 터널링 프로토콜",
              summary: "LAN-to-LAN·원격 접근 VPN과 계층별 PPTP·L2F·L2TP·IPSec·SSL·SOCKS v5를 교재 분류대로 비교합니다.",
              sourcePdfPages: [450, 452],
              keywords: ["VPN", "PPTP", "L2F", "L2TP", "IPSec", "SSL VPN", "SOCKS v5", "Remote Access"],
              questionKeywords: ["VPN", "LAN to LAN", "LAN to Client", "Remote Access", "PPTP", "L2F", "L2TP", "IPSec VPN", "SSL VPN", "SOCKS v5", "터널링 프로토콜"],
              blocks: [
                { type: "table", title: "접속 형태", columns: ["유형", "용도"], rows: [
                  ["LAN-to-LAN", "두 네트워크를 VPN으로 연결"],
                  ["LAN-to-Client / Remote Access", "출장자·재택근무자 등 원격 사용자와 보호 대상 네트워크를 연결"]
                ] },
                { type: "table", title: "교재의 터널 프로토콜 계층 분류", columns: ["계층", "프로토콜", "요지"], rows: [
                  ["2계층", "PPTP", "Point-to-Point Tunneling Protocol"],
                  ["2계층", "L2F", "Layer 2 Forwarding"],
                  ["2계층", "L2TP", "PPTP와 L2F를 통합한 Layer 2 Tunneling Protocol"],
                  ["3계층", "IPSec", "네트워크 계층에서 IP 패킷을 보호하는 프로토콜군"],
                  ["4계층", "SSL", "SSL 기반 원격 접속 VPN"],
                  ["5계층", "SOCKS v5", "세션 계층 프록시·터널링 방식"]
                ] }
              ],
              memoryPoints: ["지사 간은 LAN-to-LAN, 사용자 원격 접속은 Remote Access 유형입니다.", "계층 분류는 교재 표 기준으로 2계층 PPTP/L2F/L2TP, 3계층 IPSec, 4계층 SSL, 5계층 SOCKS v5입니다."]
            }
          ]
        },
        {
          id: "network-ids-ips-monitoring",
          title: "침입 탐지·방지와 통합 보안 관리",
          chapter: "네트워크 보안 기술 및 응용",
          summary: "IDS 탐지 위치·방법과 IPS·UTM·NAC, ESM·SIEM의 이벤트 수집·분석·대응 구조를 학습합니다.",
          status: "published",
          sourcePdfPages: [446, 455],
          concepts: [
            {
              id: "ids-methods-errors",
              title: "IDS 종류와 탐지 방법",
              summary: "HIDS·NIDS 위치와 오용·이상 탐지의 원리, 오탐·미탐 특성 및 정상 행위 프로파일 기법을 비교합니다.",
              sourcePdfPages: [446, 449],
              keywords: ["IDS", "HIDS", "NIDS", "Misuse Detection", "Anomaly Detection", "False Positive", "False Negative"],
              questionKeywords: ["IDS", "침입 탐지 시스템", "HIDS", "NIDS", "오용탐지", "Misuse Detection", "이상탐지", "Anomaly Detection", "오탐", "미탐", "Threshold Metrics", "Statistical Moments", "Markov Model"],
              blocks: [
                { type: "table", title: "IDS 분류와 오차", columns: ["구분", "특징"], rows: [
                  ["HIDS", "호스트에 설치해 운영체제·애플리케이션·시스템 이벤트를 관찰"],
                  ["NIDS", "네트워크 구간 트래픽을 관찰해 공격·정책 위반을 탐지"],
                  ["오용 탐지", "알려진 공격 시그니처와 일치하는지 확인. 미등록 공격을 놓칠 수 있으나 교재 비교표에서 오탐은 낮게 제시"],
                  ["이상 탐지", "정상 행위 프로파일에서 벗어나는 행동을 탐지. 새로운 공격에 대응할 수 있으나 오탐 가능"],
                  ["오탐 / 미탐", "정상을 공격으로 잘못 판단 / 공격을 정상으로 잘못 판단"]
                ] },
                { type: "bullets", title: "정상 프로파일 생성", items: ["교재는 임계값 메트릭(Threshold Metrics), 통계적 모멘트(Statistical Moments), 마르코프 모델(Markov Model) 등을 열거합니다.", "IDS는 침입 이벤트를 탐지·통보하며, 탐지 결과가 자동 차단과 동일한 것은 아닙니다."] }
              ],
              memoryPoints: ["오용 탐지는 알려진 패턴, 이상 탐지는 정상 프로파일 이탈을 봅니다.", "오탐은 정상의 공격 오인, 미탐은 공격의 정상 오인입니다."]
            },
            {
              id: "ips-utm-nac",
              title: "IPS·UTM·NAC",
              summary: "침입 트래픽을 능동 차단하는 IPS와 통합 보안 장비 UTM, 단말의 접속 상태를 검사하는 NAC를 비교합니다.",
              sourcePdfPages: [448, 451],
              keywords: ["IPS", "NIPS", "HIPS", "UTM", "NAC", "Network Access Control"],
              questionKeywords: ["IPS", "침입 방지 시스템", "NIPS", "HIPS", "UTM", "Unified Threat Management", "NAC", "Network Access Control", "SPOF"],
              blocks: [
                { type: "table", title: "보안 솔루션 비교", columns: ["솔루션", "주요 역할·유의점"], rows: [
                  ["IPS", "IDS 탐지에 차단 기능을 더한 능동형 시스템. NIPS는 네트워크 경계에서, HIPS는 호스트 안에서 침입을 탐지·차단"],
                  ["IPS 설계", "트래픽이 IPS를 통과하도록 구성하고, 신뢰할 수 있는 OS·정상 트래픽 경로·보안 정책 준수를 고려"],
                  ["UTM", "방화벽·IPS·바이러스 월 등 보안 기능을 통합. 관리·정책 일관성과 비용 측면 이점, 단일 장애 지점·성능 저하 가능"],
                  ["NAC", "사용자·단말을 인증하고 MAC 주소 등으로 접속을 통제하며 보안 에이전트·패치·정책 준수 상태를 확인"]
                ] },
                { type: "text", title: "NAC와 IP 관리", paragraphs: ["교재는 NAC가 장치 보안 상태와 사용자 권한을 평가해 접근을 허용·차단하는 시스템인 반면, IP 관리 시스템은 네트워크 주소의 할당·관리를 최적화한다고 구분합니다."] }
              ],
              memoryPoints: ["IDS는 탐지·통보, IPS는 탐지 후 정책에 따른 차단까지 수행합니다.", "UTM은 통합 기능과 함께 SPOF·처리 성능 위험을 고려하고, NAC는 단말 상태·접속 정책을 검사합니다."]
            },
            {
              id: "esm-siem-correlation",
              title: "ESM·SIEM과 로그 상관분석",
              summary: "여러 보안 장비의 이벤트를 중앙 수집·표준화·상관 분석해 경고와 대응으로 연결하는 관리 체계를 정리합니다.",
              sourcePdfPages: [452, 454],
              keywords: ["ESM", "SIEM", "Syslog", "Correlation Analysis", "상관분석"],
              questionKeywords: ["ESM", "Enterprise Security Management", "SIEM", "Security Information Event Management", "로그 수집", "로그 분류", "로그 변환", "로그 분석", "상관분석", "시나리오 기반"],
              blocks: [
                { type: "table", title: "ESM과 SIEM", columns: ["기능", "역할"], rows: [
                  ["ESM Agent", "방화벽·WAF·IPS 등 장비 이벤트와 경고를 수집해 Manager로 전달"],
                  ["ESM Manager / 저장소", "이벤트·패턴·정책을 통합 저장·분석하고 관제·정책 콘솔에 결과 제공"],
                  ["SIEM 로그 수집", "에이전트·SNMP·Syslog 등에서 보안 로그 취합"],
                  ["분류·변환·분석", "유사 이벤트를 그룹화하고 다양한 로그 형식을 표준화한 뒤 시간·IP·이벤트 규칙으로 연관 분석"],
                  ["상관분석", "시간·출처·패턴·행위 또는 특정 사건 순서를 연계해 단일 로그로 보이지 않는 위협을 식별"]
                ] },
                { type: "bullets", title: "상관분석 예", items: ["정책 기반은 평소와 다른 시간대·규모의 트래픽 등 미리 정한 조건을 조합합니다.", "시나리오 기반은 로그인 성공→권한 상승 요청→파일 다운로드처럼 사건 순서를 분석합니다.", "PMS(Patch Management System)는 조직의 서버·PC 운영체제와 애플리케이션 패치·업데이트를 중앙 관리합니다."] }
              ],
              memoryPoints: ["ESM은 보안 장비의 중앙 통합 관리, SIEM은 다양한 로그의 수집·정규화·상관분석과 조기 경고에 초점을 둡니다.", "상관분석은 시간·출처·행위의 관계를 묶어 복합 위협을 식별합니다."]
            }
          ]
        },
        {
          id: "network-security-solution-tools",
          title: "보안 솔루션과 탐지 규칙",
          chapter: "네트워크 보안 기술 및 응용",
          summary: "허니팟·웹 방화벽·Suricata·Snort의 탐지 규칙과 호스트 패킷 필터링 도구를 교재 표기대로 정리합니다.",
          status: "published",
          sourcePdfPages: [455, 465],
          concepts: [
            {
              id: "honeypot-web-waf-tools",
              title: "허니팟과 웹 방화벽 도구",
              summary: "공격자 유인·행위 관찰을 위한 허니팟과 IIS·Apache 기반 웹 방화벽 도구를 설명합니다.",
              sourcePdfPages: [455, 456],
              keywords: ["Honeypot", "Entrapment", "Enticement", "WebKnight", "ModSecurity", "SecRuleEngine"],
              questionKeywords: ["허니팟", "Honeypot", "Enticement", "Entrapment", "WebKnight", "ISAPI", "ModSecurity", "SecRuleEngine", "SecAuditEngine"],
              blocks: [
                { type: "table", title: "도구와 개념", columns: ["대상", "설명"], rows: [
                  ["Honeypot", "실제 서비스를 제공하는 대신 공격자를 유인할 수 있는 것처럼 구성해 공격자의 행위와 패킷을 관찰하고 관리자에게 알림"],
                  ["Enticement / Entrapment", "침입 의도가 있는 행위를 유인·탐지하는 것과 의도 없는 사용자를 함정에 빠뜨리는 것을 교재에서 구분"],
                  ["WebKnight", "Microsoft IIS에서 동작하는 공개 웹 애플리케이션 방화벽으로 ISAPI 필터 기반"],
                  ["ModSecurity", "Apache 등 웹 서버에서 애플리케이션을 보호하는 오픈소스 WAF. SecRuleEngine은 On·Off·DetectionOnly 설정을 가짐"]
                ] },
                { type: "text", title: "ModSecurity 감사 로그", paragraphs: ["SecAuditEngine은 감사 로그 기록 범위를 제어하며, 교재는 전체 트랜잭션 기록 여부와 Error·Warning 등 관련 항목만 기록하는 설정을 비교합니다."] }
              ],
              memoryPoints: ["허니팟은 유인·관찰 시스템이며 실제 서비스와 분리해 운영합니다.", "WebKnight는 IIS·ISAPI, ModSecurity는 오픈소스 웹 방화벽과 설정 지시자로 기억합니다."]
            },
            {
              id: "suricata-snort-rules",
              title: "Suricata·Snort 규칙",
              summary: "네트워크 IDS/IPS 도구의 역할과 Snort Rule 헤더·옵션·액션, 콘텐츠 검사 키워드를 학습합니다.",
              sourcePdfPages: [456, 460],
              keywords: ["Suricata", "Snort", "Rule", "content", "flow", "sid", "offset", "depth", "threshold"],
              questionKeywords: ["Suricata", "수리카타", "Snort", "스노트", "Rule", "alert", "drop", "reject", "content", "nocase", "offset", "depth", "distance", "within", "sid", "flow", "threshold", "msg"],
              blocks: [
                { type: "table", title: "도구 비교", columns: ["도구", "교재의 설명"], rows: [
                  ["Suricata", "OISF가 개발·유지하는 오픈소스 IDS·IPS·NSM 도구로 멀티코어·멀티스레드 네트워크 트래픽 처리 지원"],
                  ["Snort", "libpcap 기반 실시간 네트워크·프로토콜 분석, 콘텐츠 검색과 규칙 매칭으로 침입·스캔 등을 탐지"]
                ] },
                { type: "code", title: "Snort Rule 기본 구조", language: "text", code: "<Action> <Protocol> <SrcIP> <SrcPort> <Direction> <DestIP> <DestPort> (options;)\nalert icmp 8.8.8.8 any -> any any (msg:\"Test ICMP alert\"; sid:100001;)" },
                { type: "table", title: "주요 Rule 필드·옵션", columns: ["요소", "의미"], rows: [
                  ["Action", "alert·log·pass·drop·reject 등 탐지·기록·통과·차단 동작"],
                  ["Protocol·주소·Port·Direction", "검사 대상 프로토콜과 출발지·목적지 및 방향"],
                  ["msg / sid", "경보 메시지 / 규칙 식별자"],
                  ["content / nocase", "페이로드 문자열 검사 / 대소문자를 구분하지 않음"],
                  ["offset / depth", "콘텐츠 탐색 시작 위치 / 검사할 길이"],
                  ["distance / within", "앞선 콘텐츠 일치 지점에서의 상대 거리 / 추가 검색 범위 제한"],
                  ["flow / threshold", "세션 방향·상태 조건 / 일정 시간의 발생 횟수 등 경보 임계치"]
                ] }
              ],
              memoryPoints: ["Snort Rule은 헤더가 패킷 흐름을 지정하고 괄호 안 옵션이 메시지·콘텐츠 탐지 조건을 지정합니다.", "nocase는 대소문자 무시, offset/depth는 탐색 범위 위치·길이입니다."]
            },
            {
              id: "iptables-ufw-tcpwrapper-portsentry",
              title: "iptables·UFW·TCP Wrapper·PortSentry",
              summary: "Linux·Unix 패킷 필터와 서비스 접근 제어, 포트 스캔 탐지 도구의 주요 문법과 규칙 처리 흐름을 정리합니다.",
              sourcePdfPages: [461, 465],
              keywords: ["iptables", "netfilter", "ufw", "TCP Wrapper", "hosts.allow", "hosts.deny", "PortSentry"],
              questionKeywords: ["iptables", "netfilter", "filter table", "INPUT", "FORWARD", "OUTPUT", "ACCEPT", "DROP", "REJECT", "ufw", "TCP Wrapper", "hosts.allow", "hosts.deny", "PortSentry"],
              blocks: [
                { type: "code", title: "iptables 기본 형식·예", language: "bash", code: "iptables [-t table] [action] [chain] [match] [-j target]\niptables -A INPUT -s 192.168.123.128 -p tcp --dport 22 -j ACCEPT\niptables -A INPUT -s 192.168.12.34 -p icmp -j DROP\nufw allow 443/tcp" },
                { type: "table", title: "도구 비교", columns: ["도구", "기능"], rows: [
                  ["iptables / netfilter", "커널의 netfilter 패킷 필터 기능을 사용자 공간에서 제어하며 순차적 Rule Matching을 수행"],
                  ["UFW", "`ufw [allow | deny] <port>/<protocol>` 형식으로 포트·프로토콜 정책을 설정"],
                  ["TCP Wrapper", "xinetd 서비스 요청을 hosts.allow와 hosts.deny 규칙으로 확인해 서비스 접근 통제"],
                  ["PortSentry", "정상·스텔스 포트 스캔을 탐지하고 기록하며 정책에 따라 공격 호스트를 차단"]
                ] },
                { type: "bullets", title: "iptables 구성요소", items: ["표(Table)는 filter·nat·mangle·raw, 체인(Chain)은 INPUT·FORWARD·OUTPUT 등으로 나뉩니다.", "ACCEPT는 허용, DROP은 응답 없이 폐기, REJECT는 거부 응답을 돌려주는 차이가 있습니다.", "TCP Wrapper는 hosts.allow를 먼저 확인하고 일치하지 않으면 hosts.deny 규칙을 확인합니다."] }
              ],
              memoryPoints: ["iptables는 netfilter의 사용자 공간 제어 도구이며 표·체인·매치·타깃 순으로 읽습니다.", "TCP Wrapper는 hosts.allow→hosts.deny 순서, PortSentry는 스캔 탐지·차단 도구입니다."]
            }
          ]
        },
        {
          id: "network-packet-analysis",
          title: "패킷 분석",
          chapter: "네트워크 보안 기술 및 응용",
          summary: "DPI·얕은 패킷 검사·상태 기반 검사의 분석 깊이와 MRTG·Wireshark·tcpdump·NTOP 도구를 구분합니다.",
          status: "published",
          sourcePdfPages: [465, 466],
          concepts: [
            {
              id: "packet-inspection-depth",
              title: "DPI·SPI 패킷 검사",
              summary: "헤더 중심의 얕은 검사, 세션 상태 검사, 페이로드까지 보는 심층 검사의 분석 범위를 비교합니다.",
              sourcePdfPages: [465],
              keywords: ["DPI", "Deep Packet Inspection", "SPI", "Shallow Packet Inspection", "Stateful Packet Inspection"],
              questionKeywords: ["DPI", "Deep Packet Inspection", "SPI", "Shallow Packet Inspection", "Stateful Packet Inspection", "패킷 분석"],
              blocks: [
                { type: "table", title: "검사 유형", columns: ["방식", "검사 관점"], rows: [
                  ["SPI — Shallow Packet Inspection", "패킷의 헤더 등 얕은 범위 정보를 중심으로 검사"],
                  ["SPI — Stateful Packet Inspection", "연결의 상태 정보를 추적하고 세션 맥락과 패킷을 함께 검사"],
                  ["DPI — Deep Packet Inspection", "OSI 7계층과 패킷 내부 콘텐츠까지 분석해 응용 프로토콜·위협을 식별"]
                ] },
                { type: "text", title: "약어 주의", paragraphs: ["교재에서 SPI는 Shallow Packet Inspection과 Stateful Packet Inspection 두 의미로 등장합니다. 문제에서 풀어 쓴 이름과 설명을 확인해 혼동을 피합니다."] }
              ],
              memoryPoints: ["DPI는 페이로드·응용 계층까지, Stateful SPI는 연결 상태, Shallow SPI는 얕은 헤더 정보를 중심으로 봅니다."]
            },
            {
              id: "network-traffic-analysis-tools",
              title: "트래픽 분석 도구",
              summary: "Wireshark·tcpdump의 패킷 상세 분석, MRTG·NTOP의 트래픽 시각화·대역폭 모니터링 역할을 비교합니다.",
              sourcePdfPages: [465, 466],
              keywords: ["MRTG", "Wireshark", "tcpdump", "NTOP", "libpcap", "BPF"],
              questionKeywords: ["MRTG", "Multi Router Traffic Grapher", "Wireshark", "와이어샤크", "tcpdump", "NTOP", "NetFlow", "libpcap", "BPF"],
              blocks: [
                { type: "table", title: "분석 도구", columns: ["도구", "주요 역할"], rows: [
                  ["Wireshark", "네트워크 인터페이스에서 패킷을 캡처해 프로토콜·패킷 내용을 분석"],
                  ["tcpdump", "명령줄에서 인터페이스 패킷을 캡처·필터링·저장·분석하며 BPF·libpcap 계열을 활용"],
                  ["MRTG", "라우터·네트워크 장비의 트래픽을 그래프로 표시해 사용량·최대치를 확인"],
                  ["NTOP", "웹 인터페이스·NetFlow 플러그인 등으로 호스트별 대역폭과 프로토콜 활동을 시각화·모니터링"]
                ] },
                { type: "code", title: "tcpdump 사용 형태", language: "bash", code: "tcpdump [option] [BPF]\ntcpdump -i <interface> -nn -v" }
              ],
              memoryPoints: ["Wireshark/tcpdump는 패킷 분석, MRTG/NTOP은 트래픽 사용량·대역폭의 집계와 모니터링에 초점을 둡니다.", "BPF는 tcpdump 필터 표현에 사용됩니다."]
            }
          ]
        },
        {
          id: "network-traceback",
          title: "IP 역추적 기술",
          chapter: "네트워크 보안 기술 및 응용",
          summary: "공격 경로를 사전에 기록하는 전향적 방식과 사고 뒤 로그·경로를 추적하는 대응적 방식 및 대표 기술을 정리합니다.",
          status: "published",
          sourcePdfPages: [466],
          concepts: [
            {
              id: "ip-traceback-methods",
              title: "전향적·대응적 IP Traceback",
              summary: "IP 주소 위조·비연결형 전달 환경에서 공격 발생 전후로 공격 근원지의 경로를 재구성하는 접근을 비교합니다.",
              sourcePdfPages: [466],
              keywords: ["IP Traceback", "Proactive", "Reactive", "PPM", "iTrace", "SPIE", "StackPi"],
              questionKeywords: ["IP 역추적", "IP Traceback", "전향적 방식", "Proactive", "대응적 방식", "Reactive", "PPM", "Packet Marking", "iTrace", "SPIE", "StackPi", "역추적"],
              blocks: [
                { type: "table", title: "역추적 모델", columns: ["모델·기술", "교재의 설명"], rows: [
                  ["Proactive Traceback", "패킷이 전달되는 중 경로 정보를 미리 생성·삽입하거나 목적지로 보내 추적"],
                  ["Reactive Traceback", "공격 발생 후 피해 시스템의 연결·로그 정보를 이용해 홉 단위 공격 경로를 추적"],
                  ["PPM", "라우터가 패킷에 경로 정보를 확률적으로 마킹"],
                  ["iTrace", "ICMP Traceback 메시지 기반 추적 방식"],
                  ["Hash-based / SPIE", "패킷 요약·해시 기록을 이용해 Source Path를 추적"],
                  ["StackPi", "패킷에 라우터 경로 정보를 누적해 목적지에서 공격 경로를 재구성"]
                ] },
                { type: "text", title: "기술 해석", paragraphs: ["역추적은 공격 패킷의 출발지 주소가 위조될 수 있고 IP 전달이 비연결형이라는 제약 속에서 중계 지점의 정보를 활용해 경로를 찾는 기술입니다. 교재가 제시한 유형명·약어를 기준으로 정리했습니다."] }
              ],
              memoryPoints: ["전향적은 경로 정보를 미리 만들고, 대응적은 사고 후 경로·기록을 분석합니다.", "StackPi는 경로 정보 누적, iTrace는 ICMP 메시지, PPM은 확률적 패킷 마킹입니다."]
            }
          ]
        },
        {
          id: "network-wireless-security",
          title: "무선 네트워크 보안",
          chapter: "보안 프로토콜 이해",
          summary: "무선 AP의 수동·능동 위협, MAC 인증·WEP·WPA 계열, EAP·RADIUS와 WAP 보안 프로토콜을 정리합니다.",
          status: "published",
          sourcePdfPages: [489, 493],
          concepts: [
            {
              id: "wireless-threats-authentication",
              title: "무선 위협과 단말 인증",
              summary: "무선 AP·SSID 노출, 취약 WEP, 불법 AP·Evil Twin·MITM·MAC Spoofing 및 단말 인증 방법을 학습합니다.",
              sourcePdfPages: [489, 490],
              keywords: ["Rogue AP", "Evil Twin", "MITM", "MAC Spoofing", "SSID", "MAC Authentication"],
              questionKeywords: ["무선 네트워크", "불법 AP", "Rogue AP", "Evil Twin", "MITM", "MAC Spoofing", "SSID", "ANY", "default", "MAC 주소 인증"],
              blocks: [
                { type: "table", title: "무선 위협", columns: ["위협", "작동 방식"], rows: [
                  ["MITM", "통신 중인 사용자의 메시지를 가로채 읽거나 조작"],
                  ["Rogue AP", "관리자 허가 없이 설치되어 내부망 침입 경로가 될 수 있는 AP"],
                  ["Evil Twin", "정상 AP와 같은 SSID를 가진 불법 AP를 설치해 사용자가 접속하도록 유도"],
                  ["MAC Spoofing", "스니핑 등으로 얻은 단말 MAC 주소로 공격자의 MAC을 위장"],
                  ["취약 설정", "SSID를 ANY·기본값으로 두거나 약한 비밀번호·취약한 WEP를 사용하면 무단 접속·키 노출 위험"]
                ] },
                { type: "table", title: "기본 단말 인증", columns: ["방식", "설명·한계"], rows: [
                  ["MAC 주소 인증", "허용 단말의 MAC 주소를 미리 등록하고 목록에 포함된 기기만 접속 허용"],
                  ["WEP", "유선 수준 프라이버시를 목표로 RC4 암호화와 인증을 제공했으나 현재 취약해 교재가 미사용을 권고"]
                ] }
              ],
              memoryPoints: ["Rogue AP는 비인가 AP, Evil Twin은 정상 SSID를 흉내 내 접속을 유도하는 AP입니다.", "MAC 인증은 주소 목록 기반이며 MAC 위조를 독립적으로 막아 주는 강한 사용자 인증과는 다릅니다."]
            },
            {
              id: "wireless-wpa-evolution",
              title: "WPA·WPA2·WPA3 보안",
              summary: "무선 보안 표준별 알고리즘·인증 모드와 WPA3의 SAE·OWE 개선을 교재의 비교표 기준으로 학습합니다.",
              sourcePdfPages: [490, 491],
              keywords: ["WPA", "WPA2", "WPA3", "TKIP", "AES-CCMP", "AES-GCM", "SAE", "OWE"],
              questionKeywords: ["WPA1", "WPA2", "WPA3", "RC4", "TKIP", "AES-CCMP", "AES-GCM", "SAE", "OWE", "Enhanced Open", "Personal", "Enterprise", "RADIUS"],
              blocks: [
                { type: "table", title: "표준 비교", columns: ["표준", "암호·인증 특징"], rows: [
                  ["WEP", "RC4 사용. 취약해 미사용 권장"],
                  ["WPA1", "WEP 취약점을 보완한 임시 표준. TKIP 사용, Personal·Enterprise 모드, IEEE 802.1X/EAP 활용"],
                  ["WPA2", "IEEE 802.11i 기반. AES-CCMP, Personal-PSK·Enterprise-RADIUS/EAP 모드"],
                  ["WPA3", "교재 기재 알고리즘은 AES-GCM, SAE 기반 키 합의. 개인·기업용 모드와 개선된 개방 네트워크 암호화 기능을 다룸"]
                ] },
                { type: "table", title: "WPA3 개선 기술", columns: ["기술", "설명"], rows: [
                  ["SAE", "Simultaneous Authentication of Equals 기반의 개인용 인증·키 합의"],
                  ["OWE / Enhanced Open", "개방 Wi-Fi 환경에서도 개별화된 무선 암호화를 제공하는 선택 기능"],
                  ["Easy Connect", "디스플레이가 없는 IoT 단말 등의 페어링 과정을 간소화하는 기능으로 소개"]
                ] }
              ],
              memoryPoints: ["교재 비교표: WEP=RC4, WPA=TKIP, WPA2=AES-CCMP, WPA3=AES-GCM·SAE입니다.", "WPA2 Enterprise는 RADIUS/EAP, WPA3 개선에는 SAE·OWE가 핵심입니다."]
            },
            {
              id: "wireless-eap-wap-security",
              title: "EAP·RADIUS와 WAP 보안 프로토콜",
              summary: "무선 접속 인증 프레임워크와 하위 인증 방식, WAP 환경의 세션·전송·트랜잭션 프로토콜을 구분합니다.",
              sourcePdfPages: [491, 493],
              keywords: ["EAP", "PEAP", "RADIUS", "PAP", "CHAP", "WAP", "WSP", "WTLS", "WTP"],
              questionKeywords: ["EAP", "PEAP", "RADIUS", "PAP", "CHAP", "WAP", "WSP", "WTLS", "WTP", "802.1X", "무선 인증"],
              blocks: [
                { type: "table", title: "접속 인증", columns: ["요소", "기능"], rows: [
                  ["RADIUS", "네트워크 장비와 인증 서버 사이 사용자 인증·접속 승인에 사용되는 중앙 집중형 AAA 서비스"],
                  ["EAP", "IEEE 802.1X에서 여러 하위 인증 방식을 지원하는 확장 프레임워크"],
                  ["PEAP", "TLS 기반 보호 터널 안에서 추가 사용자 인증을 수행하는 방식"],
                  ["PAP / CHAP", "교재의 비교표에서 RADIUS 인증에 사용할 수 있는 하위 사용자 인증 방법으로 소개"]
                ] },
                { type: "table", title: "WAP 프로토콜", columns: ["프로토콜", "계층·역할"], rows: [
                  ["WSP", "세션 유지, Suspend/Resume 및 기능 협상"],
                  ["WTLS", "TLS 기반 무선 보안 프로토콜로 인증·무결성·기밀성 등을 제공"],
                  ["WTP", "무선 환경용 경량 요청-응답 트랜잭션 처리"],
                  ["WAP", "처리 능력·화면·대역폭이 제한된 무선 단말을 고려한 응용 프로토콜"]
                ] }
              ],
              memoryPoints: ["EAP는 인증 프레임워크, RADIUS는 접속 인증을 제공하는 서버 기반 AAA입니다.", "WSP=세션, WTLS=보안, WTP=경량 트랜잭션으로 구분합니다."]
            }
          ]
        },
      ]
    },
    {
      id: "application-security",
      title: "애플리케이션 보안",
      description: "인터넷 응용 서비스, 취약점, 개발 보안 및 전자상거래를 교재 목차에 따라 학습합니다.",
      units: [
        {
          id: "application-ftp-security",
          title: "FTP 보안",
          chapter: "인터넷 응용 보안",
          summary: "FTP 채널과 동작 모드, 명령·로그, FTP/TFTP 공격, 서버 권한 설정과 FTPS·SFTP 보호 방식을 학습합니다.",
          status: "published",
          sourcePdfPages: [505, 518],
          concepts: [
            {
              id: "ftp-architecture-modes",
              title: "FTP 구성과 Active·Passive 모드",
              summary: "FTP의 제어·데이터 채널 및 PI·DTP 구성과 서버·클라이언트가 데이터 연결을 여는 차이를 설명합니다.",
              sourcePdfPages: [505, 507],
              keywords: ["FTP", "PI", "DTP", "Active Mode", "Passive Mode", "TCP 20", "TCP 21"],
              questionKeywords: ["FTP", "File Transfer Protocol", "Protocol Interpreter", "Data Transfer Process", "PI", "DTP", "Active Mode", "Passive Mode", "21번 포트", "20번 포트", "PORT", "PASV"],
              blocks: [
                { type: "diagram", title: "FTP 구성", nodes: [
                  { label: "제어 연결", detail: "클라이언트 PI와 서버 PI가 명령을 교환" },
                  { label: "데이터 연결", detail: "클라이언트·서버의 DTP 사이에 파일 전송 채널 설정" },
                  { label: "PI", detail: "Protocol Interpreter: 명령 해석·교환" },
                  { label: "DTP", detail: "Data Transfer Process: 데이터 채널에서 파일 전송" }
                ], caption: "FTP는 명령 제어 채널과 파일 데이터 채널을 별도로 사용합니다." },
                { type: "table", title: "운영 모드", columns: ["모드", "데이터 연결 설정"], rows: [
                  ["Active", "클라이언트가 제어 채널로 PORT와 클라이언트 데이터 포트를 알리고 서버가 클라이언트 쪽으로 데이터 연결을 시작. 교재 도식은 서버 TCP 20을 사용"],
                  ["Passive", "클라이언트가 PASV를 요청하면 서버가 데이터 포트를 알려 주고 클라이언트가 서버의 해당 포트로 연결"]
                ] },
                { type: "text", title: "방화벽과 연결 방향", paragraphs: ["교재는 Active 모드에서 서버가 클라이언트로 연결을 시도해 클라이언트 방화벽이 막을 수 있고, Passive 모드에서는 서버의 임의 데이터 포트가 차단될 수 있다고 비교합니다. FTP 제어 연결은 세션 동안 유지되고 데이터 연결은 파일 전송 단위로 열렸다 종료됩니다."] }
              ],
              memoryPoints: ["제어 채널은 명령, 데이터 채널은 파일입니다.", "Active는 서버가 데이터 연결을 시작하고, Passive는 클라이언트가 서버가 알려 준 데이터 포트에 접속합니다."]
            },
            {
              id: "ftp-commands-ports-logs",
              title: "FTP 명령·PORT 주소와 xferlog",
              summary: "인증·디렉터리 명령, PORT 6개 숫자의 포트 계산, Linux FTP 전송 로그 필드를 정리합니다.",
              sourcePdfPages: [507, 509],
              keywords: ["USER", "PASS", "PORT", "PASV", "xferlog", "FTP command"],
              questionKeywords: ["USER", "PASS", "ACCT", "PWD", "CWD", "CDUP", "SMNT", "QUIT", "PORT", "PASV", "xferlog", "파일 전송 로그"],
              blocks: [
                { type: "table", title: "주요 FTP 명령", columns: ["명령", "역할"], rows: [
                  ["USER / PASS / ACCT", "사용자명·비밀번호·계정 정보 전달"],
                  ["PWD / CWD / CDUP", "현재 디렉터리 출력 / 작업 디렉터리 변경 / 부모 디렉터리로 이동"],
                  ["PORT / PASV", "Active 모드에서 클라이언트 데이터 주소·포트 알림 / Passive 모드 데이터 연결 요청"],
                  ["RETR / STOR / NLST", "파일 다운로드 / 업로드 / 디렉터리 목록 조회"],
                  ["QUIT", "FTP 세션 종료"]
                ] },
                { type: "code", title: "PORT 명령 포트 계산", language: "text", code: "PORT h1,h2,h3,h4,p1,p2\nPORT 1,12,13,14,9,18\n클라이언트 IP = 1.12.13.14\n데이터 포트 = 9 × 256 + 18 = 2322" },
                { type: "table", title: "xferlog 필드 예", columns: ["필드", "의미"], rows: [
                  ["전송 날짜·시간", "파일 전송 일시와 전송에 걸린 시간"],
                  ["원격 호스트·파일 크기", "접속 클라이언트 IP 주소와 전송 파일의 바이트 크기"],
                  ["파일명·전송 유형", "파일 경로·이름, ASCII(a) 또는 Binary(b)"],
                  ["액션·방향", "FTP 작업 유형·전송 방향을 나타내는 플래그"]
                ] }
              ],
              memoryPoints: ["PORT의 마지막 두 값은 p1×256+p2입니다. 교재 예는 9×256+18=2322입니다.", "xferlog는 FTP 전송 시각·원격 IP·크기·파일명·전송 유형·방향 등을 기록합니다."]
            },
            {
              id: "ftp-tftp-attack-types",
              title: "TFTP 취약점과 FTP 공격 유형",
              summary: "UDP 69번 TFTP의 단순·취약 특성과 FTP Bounce·익명 FTP·무차별 대입 공격을 구별합니다.",
              sourcePdfPages: [512, 515],
              keywords: ["TFTP", "FTP Bounce Attack", "Anonymous FTP", "Brute Force", "UDP 69"],
              questionKeywords: ["TFTP", "Trivial File Transfer Protocol", "69번 포트", "FTP Bounce Attack", "PORT Command", "Anonymous FTP", "익명 FTP", "Brute Force Attack", "무차별 대입", "RETR", "STOR"],
              blocks: [
                { type: "table", title: "프로토콜·공격 비교", columns: ["항목", "원리·특징"], rows: [
                  ["TFTP", "UDP 69번을 기본 사용하고 구조가 단순해 작은 파일 전송에 사용. FTP보다 기능·인증·암호화가 부족해 보안에 취약"],
                  ["FTP Bounce", "FTP PORT 명령과 데이터 전송 목적지 검증 부족을 이용해 FTP 서버를 중계자로 삼아 방화벽 뒤의 다른 호스트·포트를 스캔하거나 접근"],
                  ["Anonymous FTP", "익명 사용자가 자신을 식별하지 않고 서버 파일에 접근. 쓰기 권한이 과도하면 악성 파일 업로드 위험"],
                  ["Brute Force", "사용자 ID·비밀번호 조합을 반복 대입해 계정 인증을 시도"]
                ] },
                { type: "table", title: "FTP Bounce 대응", columns: ["대응", "핵심"], rows: [
                  ["목적지 제한", "제어·데이터 연결이 같은 적법한 호스트에 속하도록 제한"],
                  ["포트·횟수 점검", "1024 이하 데이터 포트 사용이나 비정상 연결 임계 초과를 탐지·차단"],
                  ["서버 관리", "취약하지 않은 최신 FTP 서버를 사용하고 로그·접근 정책 점검"]
                ] }
              ],
              memoryPoints: ["TFTP는 UDP 69, FTP Bounce는 PORT 명령으로 서버를 제3의 대상에 대한 중계자로 악용합니다.", "익명 FTP는 허용 여부·쓰기 권한·디렉터리 소유권을 함께 확인합니다."]
            },
            {
              id: "ftp-security-permissions-config",
              title: "익명 FTP·서버 접근 통제 설정",
              summary: "익명 FTP 권한, ProFTPD·vsftpd 설정, userlist·PAM·TCP Wrapper·로그 정책을 정리합니다.",
              sourcePdfPages: [509, 511, 515, 518],
              keywords: ["ProFTPD", "vsftpd", "Anonymous", "xferlog", "userlist_enable", "TCP Wrapper", "chroot"],
              questionKeywords: ["ProFTPD", "proftpd.conf", "vsftpd", "vsftpd.conf", "anonymous_enable", "userlist_enable", "userlist_deny", "xferlog_enable", "chroot_local_user", "listen_port", "TCP Wrapper", "hosts.allow", "hosts.deny", "555", "111", "777", "incoming"],
              blocks: [
                { type: "table", title: "익명 FTP 권한과 제한", columns: ["대상", "교재의 안전 설정"], rows: [
                  ["계정·서비스", "필요하지 않으면 익명 FTP 서비스를 제거하고, FTP 계정·허용 목록을 점검"],
                  ["루트·bin·etc·pub", "Root 소유로 관리. 루트는 555처럼 쓰기 권한 없이, bin·etc는 111처럼 읽기·쓰기 없이 실행만 가능한 권한으로 설정"],
                  ["incoming 업로드 폴더", "Root 소유를 유지하며 업로드 용도로만 필요한 쓰기 권한을 부여. 교재 예시는 777"],
                  ["운영", "정기적으로 xferlog와 서비스 로그를 검토하고 중요 정보는 익명 접근에 노출되지 않게 처리"]
                ] },
                { type: "table", title: "데몬 설정 예", columns: ["설정", "목적"], rows: [
                  ["ProFTPD", "DefaultAddress·Port·DefaultRoot 등으로 바인딩·포트·루트 제한을 설정"],
                  ["vsftpd: xferlog_enable / xferlog_file", "FTP 업로드·다운로드 로그 사용과 `/var/log/xferlog` 파일 지정"],
                  ["vsftpd: idle_session_timeout=600", "교재 설정 예의 유휴 세션 제한 값"],
                  ["vsftpd: data_connection_timeout=120", "교재 설정 예의 데이터 연결 제한 값"],
                  ["vsftpd: chown_uploads=yes", "익명 업로드 파일 소유권 변경 기능"],
                  ["vsftpd: userlist_enable / userlist_deny", "user_list 사용과 목록에 등록된 사용자의 허용·거부 방식 지정"],
                  ["PAM·TCP Wrapper", "PAM 및 ftpusers를 통한 계정 제한, hosts.allow·hosts.deny를 통한 호스트별 서비스 접근 통제"]
                ] },
                { type: "text", title: "설정 유의", paragraphs: ["교재의 숫자 권한 555·111·777과 vsftpd 설정 값은 원본 페이지에서 대조했습니다. 실제 운영 환경에서는 업로드 디렉터리를 포함해 최소 권한으로 설정하고, 책의 예시 값을 그대로 범용 정책으로 적용하지 않습니다."] }
              ],
              memoryPoints: ["익명 FTP의 기본 디렉터리와 핵심 파일은 Root 소유, incoming만 목적에 맞는 업로드 권한을 줍니다.", "교재 예 권한: 루트 555, bin·etc 111, incoming 777; vsftpd 예: 유휴 600초·데이터 연결 120초입니다."]
            },
            {
              id: "ftps-sftp-secure-transfer",
              title: "FTPS·SFTP 보안 전송",
              summary: "FTP에 SSL/TLS를 더한 FTPS와 SSH 기반 SFTP의 채널 보호, 포트·인증 특성을 비교합니다.",
              sourcePdfPages: [516, 517],
              keywords: ["FTPS", "SFTP", "SSH", "TLS", "TCP 22", "TCP 990"],
              questionKeywords: ["FTPS", "FTP Secure", "SFTP", "SSH FTP", "SSL", "TLS", "21, 990", "22번 포트", "Active", "Passive"],
              blocks: [
                { type: "table", title: "파일 전송 프로토콜 비교", columns: ["항목", "FTP", "FTPS", "SFTP"], rows: [
                  ["기반", "TCP", "TCP over SSL/TLS", "TCP over SSH"],
                  ["교재 포트 표", "21", "21·990", "22"],
                  ["보호", "기본 전송은 평문", "SSL/TLS로 FTP 통신 보호", "SSH 채널을 이용해 인증·암호화된 파일 전송"],
                  ["특성", "구현이 간단하나 기밀성 부족", "FTP 동작과 인증을 보안 연결에 적용", "SFTP는 파일 전송·분할·압축·인증·터널링을 지원"]
                ] },
                { type: "text", title: "FTPS 구성 요소", paragraphs: ["교재는 Record, Change Cipher Spec, Handshake, Alert 프로토콜을 FTPS 보안 구성요소로 열거합니다. FTPS는 익명·서버 인증·상호 인증 모드를 지원한다고 설명합니다."] }
              ],
              memoryPoints: ["FTPS=FTP over SSL/TLS, SFTP=SSH 기반 파일 전송입니다.", "교재 비교표의 포트는 FTP 21, FTPS 21·990, SFTP 22입니다."]
            }
          ]
        },
        {
          id: "application-email-security",
          title: "이메일 보안",
          chapter: "인터넷 응용 보안",
          summary: "메일 시스템과 SMTP·POP3·IMAP, 메일 공격·대응, PGP·S/MIME 및 발신자 인증·스팸 필터를 학습합니다.",
          status: "published",
          sourcePdfPages: [530, 548],
          concepts: [
            {
              id: "email-architecture-smtp",
              title: "메일 시스템과 SMTP",
              summary: "MUA·MTA·MDA·MAA의 역할, SMTP 명령·응답, 인증·봉투·메시지 전송 절차를 설명합니다.",
              sourcePdfPages: [530, 537],
              keywords: ["MUA", "MTA", "MDA", "MAA", "SMTP", "HELO", "EHLO", "MAIL FROM", "RCPT TO", "DATA"],
              questionKeywords: ["전자우편", "이메일", "MUA", "MTA", "MDA", "MAA", "SMTP", "Sendmail", "HELO", "EHLO", "MAIL FROM", "RCPT TO", "DATA", "220", "221", "250", "354", "CRAM-MD5"],
              blocks: [
                { type: "diagram", title: "메일 전달·열람 경로", nodes: [
                  { label: "발신자 MUA", detail: "사용자가 메일 작성·송신" },
                  { label: "MTA", detail: "메일 서버 사이 전달·라우팅" },
                  { label: "수신 MDA", detail: "수신자 메일함에 전달" },
                  { label: "MAA", detail: "POP3·IMAP으로 메일함에 접근" },
                  { label: "수신자 MUA", detail: "메일을 읽는 클라이언트" }
                ], caption: "SMTP는 주로 서버 간·송신 방향 전달에 사용하고 POP3·IMAP은 메일 열람에 사용합니다." },
                { type: "table", title: "SMTP 명령과 응답", columns: ["구분", "명령·코드", "의미"], rows: [
                  ["명령", "HELO / EHLO", "SMTP 세션 시작 / 확장 기능 협상"],
                  ["명령", "MAIL FROM / RCPT TO / DATA / QUIT", "발신자 지정 / 수신자 지정 / 메시지 입력 / 연결 종료"],
                  ["응답 계열", "2XX / 3XX / 4XX / 5XX", "성공 / 추가 정보·임시 응답 / 일시적 오류 / 영구적 오류"],
                  ["주요 코드", "220 / 221 / 250 / 354", "서비스 준비 / 서비스 종료 / 요청 성공 / 메일 입력 시작"]
                ] },
                { type: "table", title: "SMTP 인증과 메시지 순서", columns: ["항목", "설명"], rows: [
                  ["전송 순서", "연결 설정 → 인증 → 봉투(발신·수신 주소) → 메시지(Header·Body) → 연결 종료"],
                  ["PLAIN / LOGIN", "사용자명·비밀번호를 Base64 등으로 인코딩해 전송할 수 있지만 인코딩은 암호화가 아님"],
                  ["CRAM-MD5", "서버 Challenge에 클라이언트가 응답 다이제스트를 계산해 인증"]
                ] },
                { type: "table", title: "메일 헤더", columns: ["필드", "의미"], rows: [
                  ["Received", "메일이 거쳐 온 전달 경로"], ["From / Reply-To", "발신자 / 회신 주소"],
                  ["To / Cc / Bcc", "수신자 / 참조 / 숨은 참조"], ["Subject / Date", "제목 / 발송 시각"],
                  ["Content-Type / Message-ID", "본문 형식·첨부 표현 / 메시지 식별자"]
                ] }
              ],
              memoryPoints: ["MUA 작성, MTA 전달, MDA 메일함 저장, MAA 메일 열람입니다.", "SMTP 성공 코드 250, 메시지 입력 시작 354, CRAM-MD5는 Challenge-Response입니다.", "Base64는 전송 표현 변환이지 암호화가 아닙니다."]
            },
            {
              id: "email-pop3-imap",
              title: "POP3와 IMAP",
              summary: "메일 다운로드·서버 보관·동기화 차이, 기본 포트, POP3 상태와 명령을 비교합니다.",
              sourcePdfPages: [538, 540],
              keywords: ["POP3", "IMAP", "110/TCP", "143/TCP", "Authorization State", "Transaction State", "Update State"],
              questionKeywords: ["POP3", "Post Office Protocol", "IMAP", "Internet Messaging Access Protocol", "110번", "143번", "USER", "PASS", "STAT", "LIST", "RETR", "DELE", "QUIT", "Transaction State", "Update State"],
              blocks: [
                { type: "table", title: "메일 열람 프로토콜 비교", columns: ["항목", "POP3", "IMAP"], rows: [
                  ["포트", "TCP 110", "TCP 143"],
                  ["메일 처리", "클라이언트가 메일을 다운로드하며, 교재 설명상 가져온 메일은 서버 메일함에서 삭제될 수 있음", "메일은 서버에 둔 채 읽고 검색·폴더 관리 가능"],
                  ["동기화·접속", "다운로드 후 연결을 종료하는 Stateless 특성", "여러 클라이언트 간 메일 상태를 서버와 동기화"],
                  ["보안", "별도 보안 연결이 필요", "SSL/TLS 등 보안 프로토콜 지원"]
                ] },
                { type: "table", title: "POP3 명령·상태", columns: ["항목", "기능"], rows: [
                  ["USER / PASS", "사용자명·비밀번호 전송"], ["STAT / LIST", "서버 상태 / 메시지 목록 확인"],
                  ["RETR n / DELE n", "n번 메시지 가져오기 / 삭제 표시"], ["QUIT", "연결 종료 후 갱신 상태 진입"],
                  ["상태", "인증(Authorization) → 트랜잭션(Transaction) → 갱신(Update)"]
                ] }
              ],
              memoryPoints: ["POP3는 다운로드 중심(TCP 110), IMAP은 서버 보관·동기화(TCP 143)입니다.", "POP3에서 QUIT는 트랜잭션 이후 갱신 상태로 이어집니다."]
            },
            {
              id: "email-attacks-and-relay",
              title: "메일 공격과 오픈 릴레이 대응",
              summary: "Sendmail 취약점, 스팸·메일폭탄·피싱·이메일 스푸핑 및 SMTP 릴레이 통제를 구분합니다.",
              sourcePdfPages: [531, 544],
              keywords: ["Sendmail", "Spam", "Mail Bomb", "Phishing", "Email Spoofing", "Open Relay", "SMTP AUTH"],
              questionKeywords: ["Sendmail", "버퍼 오버플로우", "메일 서버 릴레이", "Mail Server Relay", "Spam Mail", "스팸메일", "메일 폭탄", "Mail Bomb", "Phishing", "피싱", "Email Spoofing", "이메일 스푸핑", "Open Relay", "SMTP AUTH", "Opt-In", "Opt-Out"],
              blocks: [
                { type: "table", title: "메일 공격", columns: ["공격", "원리·영향"], rows: [
                  ["Sendmail 취약점", "버퍼 오버플로우 또는 자원 고갈을 통해 메일 서버에 영향을 줌"],
                  ["Spam / Mail Bomb", "불특정 다수에게 광고 메일 발송 / 특정인·시스템에 대량·대용량 메일을 집중해 장애 유발"],
                  ["Phishing", "수신자를 속여 개인정보 입력 또는 악성 파일 다운로드를 유도"],
                  ["Email Spoofing", "메일 헤더의 발신자 정보를 조작해 정상 발신자인 것처럼 위장"],
                  ["Spam Relay / Open Relay", "인증 없이 누구나 메일 서버를 중계 발송에 이용"]
                ] },
                { type: "table", title: "릴레이·스팸 통제", columns: ["통제", "설명"], rows: [
                  ["SMTP AUTH", "메일 전송 전에 사용자 인증을 요구"],
                  ["릴레이 제한", "내부 사용자·허용 호스트만 릴레이를 허용하고 Open Relay를 비활성화"],
                  ["/etc/mail/access", "IP·도메인·주소 단위 릴레이 정책. RELAY·OK 허용, REJECT 거부, DISCARD 폐기"],
                  ["Blacklist·RBL", "스팸 발신 도메인·IP 목록을 이용해 수신·중계를 제한"],
                  ["Opt-In / Opt-Out", "사전 동의한 경우 발송 / 수신 거부를 요청할 수 있도록 허용"]
                ] },
                { type: "bullets", title: "피싱 사용자 대책", items: ["첨부 파일을 열기 전에 발신자와 파일 확장자를 확인합니다.", "의심스러운 메일 링크·첨부를 열지 않고, 계정별로 다른 비밀번호를 사용하며 브라우저와 메일 프로그램을 최신으로 유지합니다.", "공용 PC에서는 보안 점검 후 로그아웃하고 창을 닫습니다.", "활성 콘텐츠의 동적 스크립트 실행은 악성 동작에 악용될 수 있으므로 교재는 관련 기능 제한을 안내합니다."] }
              ],
              memoryPoints: ["피싱은 개인정보 입력·악성 파일 유도, 스푸핑은 발신자 헤더 위조입니다.", "오픈 릴레이 방지는 SMTP AUTH와 릴레이 허용 범위 제한이 핵심입니다."]
            },
            {
              id: "email-pgp-smime",
              title: "PGP·PEM·S/MIME",
              summary: "PGP의 하이브리드 메일 보안 기능·알고리즘, PEM의 중앙 키 관리, S/MIME의 메시지 형식을 정리합니다.",
              sourcePdfPages: [545, 547],
              keywords: ["PGP", "PEM", "S/MIME", "Radix-64", "ZIP", "RSA", "IDEA", "CAST", "Triple-DES", "MD5", "SHA", "X.509"],
              questionKeywords: ["PGP", "Pretty Good Privacy", "Phil Zimmermann", "OpenPGP", "RFC 4880", "PEM", "Privacy Enhanced Mail", "S/MIME", "Radix-64", "ZIP", "Triple-DES", "RIPEMD-160", "X.509", "DSS"],
              blocks: [
                { type: "table", title: "PGP 기능·구성", columns: ["기능·요소", "교재 설명"], rows: [
                  ["전자서명·인증", "RSA와 해시 계열 등을 사용해 발신자 인증·무결성·부인 방지 제공"],
                  ["기밀성", "세션 키를 만들어 메시지를 대칭키로 암호화하고 수신자 공개키로 세션 키를 보호"],
                  ["세션 키·키 쌍", "의사난수 생성기가 세션 키를 만들며 공개키는 공유하고 개인키는 소유자가 보관"],
                  ["호환성", "ASCII 전송을 위해 Radix-64 변환"],
                  ["압축·분할", "ZIP 압축, 최대 메시지 크기 제한에 따른 분할·재조립"]
                ] },
                { type: "table", title: "알고리즘·메일 표준", columns: ["용도", "교재에 열거된 항목"], rows: [
                  ["PGP 서명·해시", "RSA, Diffie-Hellman, SHA, MD5, RIPEMD-160"],
                  ["PGP 대칭 암호", "IDEA, CAST, Triple-DES"],
                  ["PGP 표준", "RFC 4880 OpenPGP Message Format"],
                  ["PEM", "IETF 메일 보안 프로토콜로 중앙 집중식 키 관리를 목표로 했으나 구현 어려움으로 사용이 제한됨"]
                ] },
                { type: "table", title: "S/MIME 메시지 형식과 서비스", columns: ["형식·서비스", "역할"], rows: [
                  ["Enveloped Data", "암호화된 메시지로 기밀성 제공"],
                  ["Signed Data", "송신자가 개인키로 서명해 무결성·부인 방지 제공"],
                  ["Clear-Signed Data", "메시지에 전자서명을 만들고 서명 부분을 Base64로 표현"],
                  ["Signed-and-Enveloped Data", "메시지 암호화와 전자서명을 결합해 기밀성·무결성·부인 방지 제공"],
                  ["보안 서비스", "기밀성(Triple-DES), 무결성(MD5), 부인 방지(DSS·RSA), 송신자 인증(X.509 인증서)로 교재가 대응"]
                ] }
              ],
              memoryPoints: ["PGP는 세션 키 기반 하이브리드 암호화에 서명·Radix-64·ZIP·분할을 결합합니다.", "교재 알고리즘: PGP 대칭키 IDEA/CAST/Triple-DES, S/MIME의 기밀성 Triple-DES·무결성 MD5 예입니다.", "PGP·S/MIME 알고리즘 목록은 PDF 545–547쪽 이미지를 확인했습니다."]
            },
            {
              id: "email-auth-spam-filtering",
              title: "SPF·DKIM·DMARC와 스팸 필터",
              summary: "발신 도메인 검증 레코드와 메일 인증 정책, RBL·SpamAssassin 필터링 방식을 연결합니다.",
              sourcePdfPages: [547, 548],
              keywords: ["SPF", "DKIM", "DMARC", "RBL", "SpamAssassin", "Bayes Filtering"],
              questionKeywords: ["SPF", "Sender Policy Framework", "DKIM", "Domain Keys Identified Mail", "DMARC", "RBL", "Real-time Blackhole List", "SpamAssassin", "Bayes Filtering", "Header Check", "Body Check"],
              blocks: [
                { type: "table", title: "발신자 검증", columns: ["기술", "확인 내용"], rows: [
                  ["SPF", "메일의 발신 IP가 도메인 DNS에 등록된 발송 서버 목록과 일치하는지 검증"],
                  ["DKIM", "발신 도메인이 메일에 전자서명하고 수신자가 DNS 공개키 등으로 서명을 확인"],
                  ["DMARC", "SPF·DKIM 결과를 바탕으로 인증 실패 시 처리 정책과 보고 방식을 선언"],
                  ["RBL", "스팸 발신 IP 주소를 실시간 블랙리스트에 등록해 해당 IP의 메일을 제한"]
                ] },
                { type: "table", title: "SpamAssassin 필터 기준", columns: ["기준", "설명"], rows: [
                  ["Header Check", "헤더·From 도메인을 분석"],
                  ["Body Check", "본문 내용·Content-Type·하이퍼링크 등을 검사"],
                  ["Bayes Filtering", "본문에 특정 단어가 스팸·정상 메일에 나타날 확률을 계산"],
                  ["Collaborative Filtering", "다수 사용자로부터 얻은 스팸 평가 정보를 활용"],
                  ["IP Filtering", "발신 IP의 스팸 발송 여부 확인"]
                ] }
              ],
              memoryPoints: ["SPF는 발송 IP, DKIM은 도메인 서명, DMARC는 SPF·DKIM 결과에 따른 정책·보고를 다룹니다.", "SpamAssassin은 헤더·본문·Bayes·협업·IP 필터를 함께 활용합니다."]
            }
          ]
        },
        {
          id: "application-web-sql-basics",
          title: "웹 애플리케이션과 SQL 삽입",
          chapter: "웹 애플리케이션 보안",
          summary: "웹 서비스 구성·보안 솔루션과 SQL 삽입의 대표 유형, 안전한 질의·입력 처리 원칙을 연결합니다.",
          status: "published",
          sourcePdfPages: [561, 565],
          concepts: [
            {
              id: "web-application-crawler-solutions",
              title: "웹 애플리케이션·크롤러·보안 솔루션",
              summary: "웹 애플리케이션의 입력·DB 경로, robots.txt의 크롤러 안내 기능, WAF와 FDS의 역할을 구분합니다.",
              sourcePdfPages: [561, 563],
              keywords: ["웹 애플리케이션", "Crawler", "robots.txt", "WAF", "FDS", "Fraud Detection System"],
              questionKeywords: ["웹 애플리케이션", "크롤러", "Crawler", "robots.txt", "웹 방화벽", "WAF", "이상 행위 탐지", "FDS"],
              blocks: [
                { type: "text", title: "웹 요청과 수집", paragraphs: ["웹 애플리케이션은 브라우저 등의 요청을 받아 웹 기능과 데이터를 제공하는 소프트웨어다. 입력값이 애플리케이션 로직과 데이터베이스 질의에 쓰이므로 검증과 무결성 보호가 중요하다.", "검색엔진 크롤러는 웹 페이지를 자동 방문·수집·색인한다. robots.txt는 사이트 루트에 두고 크롤러가 수집할 경로와 제외할 경로를 안내한다."] },
                { type: "table", title: "교재의 웹 보안 솔루션", columns: ["솔루션", "관찰 지점·역할"], rows: [["WAF (Web Application Firewall)", "웹 요청을 검사해 SQL 삽입·XSS 등 애플리케이션 공격과 비인가 접근을 탐지·차단"], ["FDS (Fraud Detection System)", "사용·거래 패턴을 바탕으로 이상 거래를 식별하고 결제 경로를 제한"]] },
                { type: "text", title: "보호 범위 비교", paragraphs: ["네트워크 트래픽 필터링과 애플리케이션 요청 검사는 보호 대상과 분석 기준이 다릅니다."] }
              ],
              memoryPoints: ["robots.txt는 크롤러에게 수집 경로를 안내하는 파일입니다.", "WAF는 웹 요청 공격을, FDS는 거래·사용 패턴의 이상 행위를 다룹니다."]
            },
            {
              id: "sql-injection-types",
              title: "SQL 삽입 유형과 공격 결과",
              summary: "입력값이 SQL 구문으로 해석될 때 인증 우회·데이터 결합·오류 기반 정보 수집 등이 생기는 원리를 구분합니다.",
              sourcePdfPages: [563, 564],
              keywords: ["SQL Injection", "Form SQL Injection", "Union SQL Injection", "Stored Procedure", "Mass SQL Injection", "Error-Based", "Blind SQL Injection"],
              questionKeywords: ["SQL 삽입", "SQL Injection", "Form SQL Injection", "Union SQL Injection", "Stored Procedure SQL Injection", "Mass SQL Injection", "Error-Based SQL Injection", "Blind SQL Injection", "UNION"],
              blocks: [
                { type: "table", title: "SQL 삽입 유형", columns: ["유형", "핵심 원리·영향"], rows: [
                  ["Form SQL Injection", "인증 폼 입력으로 질의 조건을 조작해 로그인 검사를 우회"],
                  ["Union SQL Injection", "UNION으로 기존 질의와 공격자가 만든 조회 결과를 결합해 다른 데이터 열을 반환"],
                  ["Stored Procedure SQL Injection", "저장 프로시저의 매개변수·동작을 악용"],
                  ["Mass SQL Injection", "다수 DB 값에 영향을 주어 여러 페이지·레코드를 변조"],
                  ["Error-Based SQL Injection", "오류 응답을 관찰해 테이블·열 등 DB 구조와 값을 알아냄"],
                  ["Blind SQL Injection", "결과 본문 대신 참·거짓 응답, 시간 또는 페이지 차이를 반복 관찰해 정보를 추론"]
                ] },
                { type: "table", title: "공격 목적에 따른 분류", columns: ["목적", "설명"], rows: [["인증 우회", "논리 조건을 조작해 로그인 질의가 항상 참이 되도록 유도"], ["데이터 노출", "UNION 또는 오류 차이를 이용해 의도하지 않은 조회 결과를 얻음"], ["원격 명령·변조", "확장 저장 프로시저나 취약한 DB 기능을 통해 명령 실행·데이터 변경을 시도"]] }
              ],
              memoryPoints: ["UNION은 결과 결합, Error-Based는 오류 차이, Blind는 참·거짓·시간 차이를 관찰합니다.", "SQL 삽입은 입력값이 데이터가 아니라 질의 구문으로 해석될 때 발생합니다."]
            },
            {
              id: "sql-injection-defenses",
              title: "SQL 삽입 대응과 매개변수 바인딩",
              summary: "최소 권한, Prepared Statement, 입력 검증, 오류 억제와 교재의 과거 PHP 설정 사례를 정리합니다.",
              sourcePdfPages: [565],
              keywords: ["Prepared Statement", "매개변수 바인딩", "최소 권한", "화이트리스트", "magic_quotes_gpc"],
              questionKeywords: ["SQL 삽입 대응", "SQL Injection 대응", "매개변수 바인딩", "Prepared Statement", "동적 SQL", "최소 권한", "magic_quotes_gpc"],
              blocks: [
                { type: "table", title: "대응 원칙", columns: ["대응", "이유·적용"], rows: [
                  ["최소 권한", "애플리케이션 DB 계정의 권한을 필요한 범위로 제한해 침해 영향을 줄임"],
                  ["동적 SQL 회피", "문자열 결합으로 질의를 만들지 않고 Prepared Statement와 매개변수 바인딩 사용"],
                  ["입력 검증", "허용된 입력 형식·값을 기준으로 검증하고 가능한 경우 화이트리스트 적용"],
                  ["오류·구조 정보 보호", "상세 DB 오류와 스키마·테이블 정보를 사용자 응답에 노출하지 않음"],
                  ["위험 기능 제한", "불필요한 확장 저장 프로시저 등 공격에 악용될 수 있는 기능을 제거·비활성화"]
                ] },
                { type: "code", title: "교재의 과거 PHP 설정 사례", language: "text", code: "magic_quotes_gpc = On", caption: "교재는 PHP 5.3 이전에 쓰인 과거 설정과 GET·POST·COOKIE 입력의 이스케이프 사례로 소개합니다. 현재의 안전한 질의 작성법을 대신하지 않으며 매개변수 바인딩을 우선합니다." }
              ],
              memoryPoints: ["질의 구조와 입력 데이터를 분리하는 Prepared Statement가 핵심입니다.", "magic_quotes_gpc는 교재의 과거 설정 사례이며 이를 현재 SQL 삽입 방어의 대체재로 보지 않습니다."]
            }
          ]
        },
        {
          id: "application-xss-csrf",
          title: "XSS와 CSRF",
          chapter: "웹 애플리케이션 보안",
          summary: "브라우저에서 실행되는 XSS와 인증된 사용자의 권한을 악용하는 CSRF의 흐름·대응을 비교합니다.",
          status: "published",
          sourcePdfPages: [566, 570],
          concepts: [
            {
              id: "xss-types",
              title: "저장형·반사형·DOM 기반 XSS",
              summary: "악성 스크립트가 저장되거나 응답에 반사되거나 브라우저 DOM에서 처리되는 경로를 비교합니다.",
              sourcePdfPages: [566, 568],
              keywords: ["XSS", "Cross-Site Scripting", "Stored XSS", "Reflected XSS", "DOM-based XSS"],
              questionKeywords: ["XSS", "Cross-Site Scripting", "저장형 XSS", "반사형 XSS", "DOM 기반 XSS", "DOM based"],
              blocks: [
                { type: "table", title: "XSS 유형과 실행 위치", columns: ["유형", "스크립트가 전달되는 경로", "핵심 특징"], rows: [
                  ["저장형", "입력된 스크립트가 서버 측 저장소에 남고 이후 사용자 응답에 포함", "방문한 여러 사용자에게 반복 실행될 수 있음"],
                  ["반사형", "조작된 URL·요청값이 서버 응답에 포함", "피해자가 악성 링크를 열어야 실행되는 일회성 요청 흐름"],
                  ["DOM 기반", "클라이언트 측 스크립트가 안전하지 않은 DOM 값을 사용", "서버 응답에 악성 코드가 직접 실리지 않아 서버 측 탐지가 어려울 수 있음"]
                ] },
                { type: "diagram", title: "반사형 XSS의 응답 흐름", nodes: [
                  { label: "공격자", detail: "악성 스크립트가 포함된 URL 생성" },
                  { label: "사용자 브라우저", detail: "URL 요청, 서버 응답 수신 후 응답 안의 스크립트 실행" },
                  { label: "웹 애플리케이션", detail: "검증되지 않은 요청값을 응답에 반사" }
                ], caption: "악성 코드는 피해자 브라우저에서 실행되어 정보 탈취나 리다이렉션을 일으킬 수 있습니다." }
              ],
              memoryPoints: ["저장형은 서버에 저장, 반사형은 응답에 반사, DOM 기반은 브라우저 DOM 처리 과정이 핵심입니다.", "XSS의 스크립트 실행 주체는 피해자 브라우저입니다."]
            },
            {
              id: "xss-defenses",
              title: "XSS 대응과 안전한 출력",
              summary: "입력 검증만으로 끝내지 않고 출력 시 이스케이프와 검증된 방어 라이브러리를 적용합니다.",
              sourcePdfPages: [569],
              keywords: ["XSS 대응", "출력 이스케이프", "c:out", "화이트리스트", "WAF"],
              questionKeywords: ["XSS 대응 방안", "출력값 검증", "이스케이프", "c:out", "웹 방화벽"],
              blocks: [
                { type: "bullets", title: "교재의 대응 방안", items: [
                  "입력값을 검증하고 가능한 경우 허용 목록 방식으로 필요한 값만 받아들입니다.",
                  "사용자 입력이나 동적 값을 HTML에 출력할 때 문맥에 맞게 이스케이프해 브라우저가 코드로 실행하지 못하게 합니다.",
                  "공개된 XSS 예방 라이브러리와 웹 방화벽(WAF)을 활용합니다.",
                  "교재 예시의 JSP <c:out> 태그는 출력값을 안전하게 표시하는 용도로 소개됩니다."
                ] }
              ],
              memoryPoints: ["저장 단계의 검증과 출력 단계의 인코딩은 서로 보완합니다.", "사용자 데이터를 HTML·스크립트로 해석되지 않게 출력합니다."]
            },
            {
              id: "csrf-and-defenses",
              title: "CSRF와 요청 위조 방어",
              summary: "로그인된 브라우저가 공격자 의도대로 상태 변경 요청을 보내는 흐름과 Referer·토큰 대응을 익힙니다.",
              sourcePdfPages: [569, 570],
              keywords: ["CSRF", "Cross-Site Request Forgery", "Referer", "Security Token", "CSRF Token"],
              questionKeywords: ["CSRF", "Cross-Site Request Forgery", "Referer 검증", "Security Token", "CSRF Token", "중요 기능 재인증"],
              blocks: [
                { type: "diagram", title: "CSRF 요청 흐름", nodes: [
                  { label: "사용자", detail: "웹 서비스에 로그인해 유효한 세션 보유" },
                  { label: "공격자 페이지", detail: "사용자가 열면 숨겨진 상태 변경 요청을 유도" },
                  { label: "웹 서비스", detail: "브라우저가 함께 보낸 인증 정보와 요청을 처리" }
                ], caption: "요청의 권한은 사용자 세션에서 오지만, 동작은 공격자 페이지가 유도합니다." },
                { type: "table", title: "CSRF 대응", columns: ["대응", "적용"], rows: [
                  ["Referer 검증", "요청 출처를 확인하고 허용된 도메인에서 온 요청만 처리"],
                  ["CSRF 토큰", "세션과 연결된 예측하기 어려운 난수를 발급하고 상태 변경 요청마다 포함시켜 서버 값과 비교"],
                  ["중요 기능 재인증", "중요한 동작은 비밀번호 등 추가 확인을 거친 뒤 수행"]
                ] }
              ],
              memoryPoints: ["XSS는 브라우저에서 스크립트가 실행되는 취약점이고, CSRF는 인증된 사용자의 권한으로 요청을 위조합니다.", "요청마다 검증하는 CSRF 토큰은 세션과 연결되어야 합니다."]
            }
          ]
        },
        {
          id: "application-directory-upload",
          title: "디렉터리·경로 조작과 파일 업로드",
          chapter: "웹 애플리케이션 보안",
          summary: "디렉터리 목록 노출, 상위 경로 이동, 서버 실행 파일 업로드의 원인과 설정·입력 방어를 정리합니다.",
          status: "published",
          sourcePdfPages: [571, 573],
          concepts: [
            {
              id: "directory-indexing-path-traversal",
              title: "디렉터리 인덱싱과 경로 조작",
              summary: "인덱싱 설정으로 파일 목록이 노출되는 경우와 URL·파일 경로의 /, \\, .. 조작을 구분합니다.",
              sourcePdfPages: [571, 572],
              keywords: ["Directory Indexing", "Directory Listing", "Path Traversal", "Directory Traversal", "Options -Indexes"],
              questionKeywords: ["디렉터리 인덱싱", "Directory Indexing", "Directory Listing", "Options -Indexes", "경로 조작", "Path Traversal", "Directory Traversal", "Dot Dot"],
              blocks: [
                { type: "table", title: "두 취약점의 차이", columns: ["취약점", "원인·영향"], rows: [
                  ["디렉터리 인덱싱", "웹 서버의 인덱싱 기능이 켜져 있으면 브라우저에서 디렉터리·파일 목록을 열람할 수 있음"],
                  ["경로 조작", "입력값에 상위 경로나 경로 구분 문자를 넣어 허용되지 않은 디렉터리·파일에 접근"]
                ] },
                { type: "code", title: "교재의 Apache 인덱싱 제한 예", language: "apache", code: "Options -Indexes -FollowSymLinks", caption: "교재는 httpd.conf에서 Indexes와 FollowSymLinks 옵션을 제거해 인덱싱과 심볼릭 링크 사용을 제한하는 예를 제시합니다." },
                { type: "bullets", title: "경로 입력 검증", items: ["파일명·경로 입력에서 슬래시(/), 역슬래시(\\), 상위 이동 표기(..)를 검증·차단합니다.", "경로가 허용된 저장 위치 안에 있는지 확인하고 파일·디렉터리 권한도 최소화합니다."] }
              ],
              memoryPoints: ["Indexes 제한은 목록 노출을 줄이고, 경로 검증은 요청이 허용 경계 밖으로 이동하지 못하게 합니다.", "교재의 제한 대상 문자: /, \\, .."]
            },
            {
              id: "unsafe-upload-webshell",
              title: "위험한 파일 업로드와 웹셸",
              summary: "서버에서 실행될 수 있는 스크립트 업로드가 웹셸로 이어지는 과정과 파일 제한·분리·권한 방어를 학습합니다.",
              sourcePdfPages: [572, 573],
              keywords: ["위험한 파일 업로드", "Web Shell", "웹셸", "파일 확장자", "업로드 디렉터리"],
              questionKeywords: ["위험한 형식의 파일 업로드", "웹셸", "Web Shell", "파일 업로드 대응", "확장자 화이트리스트", "실행 권한 제거"],
              blocks: [
                { type: "diagram", title: "웹셸 업로드 흐름", nodes: [
                  { label: "공격자", detail: "서버 실행 가능 스크립트 업로드" },
                  { label: "웹 서버", detail: "업로드 파일을 실행 가능한 경로에 저장" },
                  { label: "공격자 요청", detail: "웹셸을 호출해 명령 실행·파일 접근 시도" }
                ], caption: "웹셸은 웹 서버 환경에서 실행되는 악성 스크립트로 서버 명령이나 파일 조작에 악용될 수 있습니다." },
                { type: "table", title: "교재의 업로드 대응", columns: ["대응", "목적"], rows: [
                  ["허용 목록·크기 제한", "업로드 파일 형식과 용량을 제한"],
                  ["위치 분리", "웹 루트와 분리된 저장 위치에 보관하고 직접 실행·접근을 제한"],
                  ["실행 권한 제거", "업로드 파일이 서버에서 프로그램으로 실행되지 못하게 함"],
                  ["추측하기 어려운 이름", "사용자가 파일명·확장자를 쉽게 예측하지 못하게 변경"]
                ] }
              ],
              memoryPoints: ["확장자만 믿지 말고 업로드 위치와 서버 실행 권한을 함께 제한합니다.", "웹셸은 업로드된 스크립트를 통해 서버에서 명령·파일 작업을 수행하려는 위협입니다."]
            }
          ]
        },
        {
          id: "application-command-injection",
          title: "명령어 삽입과 리버스 셸",
          chapter: "웹 애플리케이션 보안",
          summary: "명령 구분자·파이프를 이용한 OS 명령어 삽입, HTTP CRLF 주입, 리버스 셸의 연결 방향과 대응을 학습합니다.",
          status: "published",
          sourcePdfPages: [574, 578],
          concepts: [
            {
              id: "os-command-injection",
              title: "OS 명령어 삽입",
              summary: "입력 문자열이 셸 명령으로 해석되어 서버 명령 실행·정보 노출·시스템 손상으로 이어지는 원리를 알아봅니다.",
              sourcePdfPages: [574, 575],
              keywords: ["OS Command Injection", "명령어 삽입", "쉘 메타문자", "allowlist", "allowedCommands"],
              questionKeywords: ["OS 명령어 주입", "OS Command Injection", "pwd ; ls -al", "허용 명령어 목록", "명령어 화이트리스트"],
              blocks: [
                { type: "table", title: "셸 연산자 예", columns: ["입력 예", "의미"], rows: [
                  ["pwd ; ls -al", "앞 명령의 성공 여부와 무관하게 순차 실행"],
                  ["pwd || ls -al", "앞 명령이 실패하면 다음 명령 실행"],
                  ["ls -al | more", "앞 명령의 출력을 다음 명령의 입력으로 전달"],
                  ["ls && pwd", "앞 명령이 성공한 경우 다음 명령 실행"]
                ] },
                { type: "diagram", title: "웹 입력에서 서버 명령까지", nodes: [
                  { label: "사용자 입력", detail: "명령문·구분자가 포함된 값" },
                  { label: "웹 애플리케이션", detail: "검증 없이 시스템 명령에 연결" },
                  { label: "운영체제", detail: "조작된 명령 실행·결과 노출" }
                ], caption: "교재는 입력값을 명령에 직접 결합하지 않고, 허용 명령 목록을 확인하는 방식을 예시로 듭니다." },
                { type: "text", title: "허용 목록 조건의 함정", paragraphs: ["교재의 코드 해설은 조건식이 반대로 작성되면 허용된 명령은 거부하고 허용되지 않은 명령은 실행될 수 있음을 지적합니다. 허용 목록에 없는 명령을 거부하도록 조건의 부정 여부를 확인해야 합니다."] },
                { type: "bullets", title: "대응 원칙", items: ["가능하면 애플리케이션에서 운영체제 명령을 직접 실행하지 않습니다.", "명령 실행이 꼭 필요하면 명령과 각 인자를 분리하고 허용 목록으로 검증합니다.", "입력값에서 셸 메타문자를 검증하며, 명령 해석기에 그대로 전달하지 않습니다."] }
              ],
              memoryPoints: ["세미콜론은 순차 실행, ||는 앞 명령 실패 때, &&는 성공 때 다음 명령을 실행합니다.", "화이트리스트의 거부 조건이 뒤집히지 않았는지 확인합니다."]
            },
            {
              id: "http-header-injection",
              title: "HTTP 헤더 삽입과 CRLF",
              summary: "헤더 값에 줄바꿈 문자를 넣어 응답 헤더를 추가하는 공격과 정확한 CR·LF 표현을 기억합니다.",
              sourcePdfPages: [576],
              keywords: ["HTTP Header Injection", "CRLF", "Carriage Return", "Line Feed", "%0D", "%0A"],
              questionKeywords: ["HTTP 헤더 삽입", "HTTP Header Injection", "CR", "LF", "%0D", "%0A", "개행 문자"],
              blocks: [
                { type: "table", title: "HTTP 헤더 개행 문자", columns: ["문자", "표기", "URL 인코딩"], rows: [
                  ["CR (Carriage Return)", "\\r", "%0D"],
                  ["LF (Line Feed)", "\\n", "%0A"]
                ] },
                { type: "text", title: "대응", paragraphs: ["입력값이 HTTP 헤더에 들어가기 전에 CR과 LF 및 그 인코딩 값을 검증·필터링해 공격자가 헤더를 추가하지 못하게 합니다."] }
              ],
              memoryPoints: ["CR은 %0D, LF는 %0A입니다.", "헤더에 삽입되는 개행 문자를 입력 단계에서 제한합니다."]
            },
            {
              id: "reverse-shell-netcat",
              title: "리버스 셸과 netcat",
              summary: "피해 시스템이 외부 공격자에게 연결하는 리버스 셸과 교재의 nc 형식·옵션을 정리합니다.",
              sourcePdfPages: [576, 578],
              keywords: ["Reverse Shell", "Bind Shell", "netcat", "nc", "Inbound", "Outbound"],
              questionKeywords: ["리버스 셸", "Reverse Shell", "netcat", "nc [options] host port", "Listen Mode", "Execution"],
              blocks: [
                { type: "text", title: "연결 방향", paragraphs: ["리버스 셸은 공격자가 목표 시스템에서 악성 파일이나 웹셸을 실행하게 한 뒤, 목표 시스템이 공격자 시스템으로 연결하도록 만드는 방식입니다. 방화벽이 외부에서 내부로 들어오는 요청만 제한하면 내부에서 외부로 나가는 연결은 놓칠 수 있습니다."] },
                { type: "code", title: "교재의 netcat 기본 형식", language: "bash", code: "nc [options] host port" },
                { type: "table", title: "교재의 nc 옵션", columns: ["옵션", "의미"], rows: [
                  ["-l", "수신 연결을 기다리는 Listen Mode"],
                  ["-v", "상세 정보를 표시하는 Verbose"],
                  ["-p", "연결 포트 지정"],
                  ["-e", "연결될 때 실행할 파일 지정"]
                ] },
                { type: "bullets", title: "방어 관점", items: ["불필요한 인바운드·아웃바운드 통신을 방화벽 정책으로 제한합니다.", "IDS/IPS로 비정상 연결 패턴을 탐지하고 차단합니다.", "시스템과 계정의 권한을 최소화하고 의심스러운 목적지 IP·도메인 통신을 확인합니다."] }
              ],
              memoryPoints: ["리버스 셸은 목표 시스템에서 공격자 방향으로 연결을 시작합니다.", "nc에서 -l은 대기, -v는 상세 출력, -p는 포트, -e는 실행 파일 옵션입니다."]
            }
          ]
        },
        {
          id: "application-session-xml",
          title: "쿠키·세션과 XML 삽입",
          chapter: "웹 애플리케이션 보안",
          summary: "클라이언트 쿠키와 서버 세션의 저장 차이, XPath 질의 문자열 조작을 통한 XML 삽입을 학습합니다.",
          status: "published",
          sourcePdfPages: [579, 580],
          concepts: [
            {
              id: "cookie-session-security",
              title: "쿠키와 세션",
              summary: "저장 위치·전달 방식·다중 값 표현을 비교하고 인증 정보가 담긴 쿠키의 보호 필요성을 이해합니다.",
              sourcePdfPages: [578, 579],
              keywords: ["Cookie", "Session", "Set-Cookie", "session ID", "클라이언트", "서버"],
              questionKeywords: ["쿠키와 세션", "Cookie", "Session", "Set-Cookie", "sessionid", "세션 ID"],
              blocks: [
                { type: "table", title: "쿠키와 세션 비교", columns: ["항목", "쿠키", "세션"], rows: [
                  ["저장 위치", "클라이언트", "서버"],
                  ["설정·식별", "Set-Cookie 헤더로 설정", "Set-Cookie 등으로 세션 ID 전달"],
                  ["여러 값", "쿠키 값으로 여러 항목 저장 가능", "세션 객체에 상태를 저장하고 클라이언트에는 식별자 전달"],
                  ["저장 형식", "텍스트 파일", "서버 측 객체·저장소"]
                ] },
                { type: "text", title: "보안상 의미", paragraphs: ["쿠키에 사용자 인증 정보나 세션 식별자가 들어가면 탈취·변조 위험이 생길 수 있습니다. 교재는 클라이언트에 상태를 두는 쿠키와 서버에 저장하는 세션의 차이를 강조합니다."] }
              ],
              memoryPoints: ["쿠키는 Client Side, 세션은 Server Side에 저장합니다.", "세션 방식에서도 브라우저는 세션 ID를 전달하므로 세션 식별자 보호가 필요합니다."]
            },
            {
              id: "xml-xpath-injection",
              title: "XML·XPath 삽입",
              summary: "검증하지 않은 ID·비밀번호를 XPath 질의 문자열에 결합해 논리 조건을 바꾸는 취약점을 이해합니다.",
              sourcePdfPages: [579, 580],
              keywords: ["XML Injection", "XPath Injection", "XPathFactory", "XPath", "NodeList"],
              questionKeywords: ["XML 삽입", "XML Injection", "XPath 삽입", "XPath Injection", "XPathFactory", "NodeList"],
              blocks: [
                { type: "text", title: "발생 원리", paragraphs: ["애플리케이션이 입력값을 검증하지 않은 채 XPath 질의 문자열에 이어 붙이면 입력이 데이터가 아니라 질의 조건으로 해석될 수 있습니다. 그 결과 인증 조건이 변하거나 의도하지 않은 XML 노드가 선택될 수 있습니다.", "교재 예시는 ID·비밀번호를 XPath 조건에 문자열 결합한 뒤 결과 NodeList를 순회합니다. 입력값 검증 없이 조합하는 부분이 취약점의 핵심입니다."] },
                { type: "table", title: "코드 흐름과 점검 지점", columns: ["흐름", "보안 점검"], rows: [
                  ["입력값 수신", "ID·비밀번호 등 외부 입력의 허용 형식을 검증"],
                  ["XPath 작성", "외부 값을 질의 문자열에 직접 이어 붙이지 않음"],
                  ["질의 실행·결과 순회", "선택된 노드와 반환 데이터가 요청 권한 범위에 맞는지 확인"]
                ] }
              ],
              memoryPoints: ["XPath 문자열 결합에 검증되지 않은 외부 입력을 넣지 않습니다.", "XML 문서에 대한 XPath 질의 조작은 SQL 삽입과 유사하게 조건을 바꾸는 입력 취약점입니다."]
            }
          ]
        },
        {
          id: "application-browser-access",
          title: "관리자 노출·파일 삽입·브라우저 공격",
          chapter: "웹 애플리케이션 보안",
          summary: "관리자 페이지 탐색, LFI·RFI, 탭내빙, MITB와 IDOR의 접근 경계 및 대응을 정리합니다.",
          status: "published",
          sourcePdfPages: [581, 583],
          concepts: [
            {
              id: "admin-page-exposure",
              title: "관리자 페이지 노출",
              summary: "추측하기 쉬운 관리 포트·경로와 로그인 후 하위 페이지 직접 접근 점검, 접근통제를 학습합니다.",
              sourcePdfPages: [580, 581],
              keywords: ["관리자 페이지", "Admin Page Exposure", "7001", "8080", "8443", "8888", "/admin", "/manager", "/system"],
              questionKeywords: ["관리자 페이지 노출", "7001", "8080", "8443", "8888", "/admin", "/manager", "/system", "접근 제어"],
              blocks: [
                { type: "table", title: "교재의 노출 점검 예", columns: ["점검 대상", "예시"], rows: [
                  ["포트", "7001, 8080, 8443, 8888 등 추측하기 쉬운 포트"],
                  ["관리 경로", "/admin, /manager, /system 등 예측 가능한 URL"],
                  ["하위 페이지", "로그인 뒤 식별한 하위 페이지 URL을 새 세션에서 직접 요청해 인증·권한 검사를 확인"]
                ] },
                { type: "bullets", title: "대응 방안", items: ["관리자 경로에 ACL과 IP 기반 접근 제한을 적용합니다.", "관리 기능을 일반 서비스와 분리하고 관리자 접근에 추가 인증을 요구합니다.", "로그인 여부뿐 아니라 페이지별 사용자 권한을 서버에서 확인합니다."] }
              ],
              memoryPoints: ["숨겨진 URL만으로 보호하지 않고 매 요청에 인증·인가를 적용합니다.", "교재 점검 숫자: 7001·8080·8443·8888 포트와 /admin·/manager·/system 경로."]
            },
            {
              id: "lfi-rfi",
              title: "LFI와 RFI 파일 삽입",
              summary: "로컬 경로의 파일을 불러오는 LFI와 원격 파일 로드를 유도하는 RFI를 구분합니다.",
              sourcePdfPages: [581, 582],
              keywords: ["LFI", "Local File Inclusion", "RFI", "Remote File Inclusion", "include", "require", "allow_url_fopen"],
              questionKeywords: ["파일 삽입", "LFI", "Local File Inclusion", "RFI", "Remote File Inclusion", "allow_url_fopen", "include", "require"],
              blocks: [
                { type: "table", title: "파일 삽입 유형", columns: ["유형", "읽거나 실행하도록 유도하는 대상"], rows: [
                  ["LFI", "서버의 로컬 파일. 경로 조작으로 상위 디렉터리의 민감 파일에 접근할 수 있음"],
                  ["RFI", "외부 URL의 파일. 원격 스크립트가 애플리케이션에 포함되어 실행될 수 있음"]
                ] },
                { type: "bullets", title: "교재의 대응 방안", items: ["include·require 등 파일 포함 구문과 함수의 입력을 점검합니다.", "파일 경로나 URL을 직접 사용하기 전에 입력값을 검증하고 허용된 대상만 선택합니다.", "파일 경로를 설정 파일 등으로 분리하고 확장자·접근 가능한 저장 위치를 제한합니다.", "교재는 PHP의 allow_url_fopen을 Off로 설정하는 사례를 소개합니다."] }
              ],
              memoryPoints: ["LFI는 서버의 로컬 파일, RFI는 원격 URL의 파일을 대상으로 합니다.", "파일명·경로·URL을 외부 입력 그대로 include/require에 전달하지 않습니다."]
            },
            {
              id: "tabnabbing",
              title: "탭내빙과 target=_blank",
              summary: "새 탭을 연 페이지가 원래 탭의 참조 정보를 악용하는 탭내빙과 rel 속성 방어를 정리합니다.",
              sourcePdfPages: [582],
              keywords: ["Tabnabbing", "target=_blank", "noopener", "noreferrer", "nofollow", "window.opener"],
              questionKeywords: ["탭내빙", "Tabnabbing", "target=_blank", "noopener", "noreferrer", "nofollow"],
              blocks: [
                { type: "text", title: "공격 원리", paragraphs: ["target=\"_blank\" 링크가 새 탭을 열 때 새 페이지가 원래 창을 참조할 수 있습니다. 악성 페이지가 이 참조를 이용해 원래 탭의 위치를 바꾸면 사용자는 신뢰하던 페이지로 착각할 수 있습니다."] },
                { type: "table", title: "교재의 링크 속성 대응", columns: ["속성", "교재 설명"], rows: [
                  ["rel=\"noopener\"", "새 페이지가 원래 창을 조작하는 연결을 제한"],
                  ["rel=\"noreferrer\"", "링크 접근 시 참조 정보가 전달되지 않게 제한"],
                  ["rel=\"nofollow\"", "사용 중인 브라우저에서 링크를 따라가지 않도록 설정하는 예로 수록"]
                ] }
              ],
              memoryPoints: ["새 탭을 여는 외부 링크에는 교재가 제시한 noopener·noreferrer 속성을 검토합니다.", "탭내빙은 새 페이지에서 원래 탭을 조작하는 브라우저 간 참조 문제입니다."]
            },
            {
              id: "mitb",
              title: "MITB와 거래 보호",
              summary: "브라우저 내부를 감염시켜 입력값·거래 내용을 바꾸는 Man-In-The-Browser 공격과 교재의 대응을 익힙니다.",
              sourcePdfPages: [583],
              keywords: ["MITB", "Man-In-The-Browser", "Transaction Signing", "브라우저"],
              questionKeywords: ["MITB", "Man-In-The-Browser", "Transaction Signing", "트랜잭션 서명"],
              blocks: [
                { type: "text", title: "공격과 대응", paragraphs: ["MITB는 브라우저에 설치된 악성 프로그램이 웹 브라우저와 서비스 사이 통신 내용을 중간에서 조작하는 공격입니다. 입력값을 바꾸거나 거래 내용을 변경해도 사용자에게 정상처럼 보일 수 있습니다."] },
                { type: "table", title: "교재의 대응 방안", columns: ["대응", "목적"], rows: [
                  ["브라우저 최신 업데이트", "취약점을 줄이도록 브라우저를 최신 상태로 유지"],
                  ["안티바이러스 사용", "브라우저 내부에서 동작하는 악성코드 탐지·차단"],
                  ["트랜잭션 서명", "거래 시 전자서명 등으로 사용자의 거래 내용 변경 여부 확인"]
                ] }
              ],
              memoryPoints: ["MITB는 네트워크 경로가 아니라 감염된 브라우저 내부에서 거래를 조작합니다.", "거래 내용 자체를 확인하는 Transaction Signing이 교재의 핵심 대응입니다."]
            },
            {
              id: "idor",
              title: "IDOR와 객체 단위 권한 검사",
              summary: "참조 ID를 바꾸어 다른 사용자의 객체에 직접 접근하는 문제와 사용자별 인가 검사를 학습합니다.",
              sourcePdfPages: [583],
              keywords: ["IDOR", "Insecure Direct Object Reference", "Broken Access Control", "ACL", "최소 권한"],
              questionKeywords: ["IDOR", "Insecure Direct Object Reference", "Broken Access Control", "참조 ID", "객체 권한", "ACL"],
              blocks: [
                { type: "text", title: "발생 원리", paragraphs: ["IDOR는 요청의 파일·데이터베이스 레코드 등 객체 식별자를 바꿔 다른 정보에 직접 접근할 수 있는 취약점입니다. 인증된 사용자라는 사실만 확인하고 해당 객체에 대한 권한을 확인하지 않을 때 발생합니다."] },
                { type: "table", title: "교재의 대응 방안", columns: ["대응", "적용"], rows: [
                  ["사용자별 ACL", "요청한 객체마다 사용자의 접근 권한을 검사"],
                  ["참조값 예측 방지", "순차 ID 대신 UUID·암호화 토큰 등 예측하기 어려운 참조값을 사용"],
                  ["최소 권한", "필요한 범위만 권한을 부여하고 모든 요청에서 인가를 확인"]
                ] }
              ],
              memoryPoints: ["IDOR는 로그인 우회가 아니라 객체 참조를 바꿔 인가 검사를 우회하는 Broken Access Control 유형입니다.", "복잡한 ID를 쓰더라도 서버의 사용자별 객체 권한 검사는 반드시 수행해야 합니다."]
            }
          ]
        },
        {
          id: "application-dns-foundations",
          chapter: "DNS 보안",
          status: "published",
          title: "DNS 계층 구조와 구성 요소",
          summary: "도메인 이름 공간, DNS 구성 요소와 네임 서버 역할을 구분하고 재귀·반복 질의를 설명합니다.",
          sourcePdfPages: [605, 608],
          concepts: [
            {
              id: "dns-namespace-components",
              title: "도메인 이름 공간과 DNS 구성 요소",
              summary: "계층형 도메인 이름 공간과 클라이언트·리졸버·네임 서버가 이름을 주소로 변환하는 흐름을 학습합니다.",
              sourcePdfPages: [605, 606],
              keywords: ["DNS", "도메인 이름 공간", "Root", "TLD", "SLD", "FQDN", "53번 포트"],
              questionKeywords: ["DNS", "도메인 이름", "Root", "TLD", "SLD", "53번 포트"],
              blocks: [
                { type: "text", title: "이름 공간", paragraphs: ["DNS는 사람이 쓰는 도메인 이름을 IP 주소 등 자원 정보로 변환하는 분산 계층형 시스템입니다. 최상위에는 루트(.)가 있고 그 아래 최상위 도메인(TLD), 2단계 도메인(SLD), 하위 도메인이 이어집니다. 국가 코드 최상위 도메인의 예로 .kr이 있습니다.", "도메인 이름은 오른쪽에서 왼쪽으로 상위 계층에서 하위 계층으로 읽으며, 마지막 루트 점까지 포함한 이름을 절대 도메인 이름(FQDN)으로 표현할 수 있습니다."] },
                { type: "table", title: "요청 처리 요소", columns: ["요소", "역할"], rows: [
                  ["DNS 클라이언트", "이름 해석을 요청하는 사용자 단말 또는 프로그램"],
                  ["리졸버", "질의를 받아 캐시를 확인하고 필요한 네임 서버를 찾아가는 질의 처리 기능"],
                  ["네임 서버", "도메인 영역의 레코드에 응답하거나 다른 서버를 안내"],
                  ["도메인 이름 공간", "루트부터 하위 도메인까지 이름과 위임 관계를 구성하는 계층"]
                ] },
                { type: "text", title: "전송", paragraphs: ["DNS 질의는 일반적으로 UDP 53번 포트를 사용합니다. 교재는 응답 데이터가 512바이트를 초과하는 경우나 영역 전송과 같은 경우 TCP 53번 사용을 함께 제시합니다."] }
              ],
              memoryPoints: ["도메인 이름은 루트에서 하위 도메인으로 위임되는 계층 구조입니다.", "기본 포트는 UDP 53이며 큰 응답과 영역 전송 등에는 TCP 53을 사용할 수 있습니다."]
            },
            {
              id: "dns-name-server-roles",
              title: "네임 서버의 종류와 권한",
              summary: "루트·TLD·권한·캐시 DNS의 역할과 주·보조 네임 서버 관계를 구분합니다.",
              sourcePdfPages: [607],
              keywords: ["권한 네임 서버", "주 네임 서버", "보조 네임 서버", "캐시 DNS", "Root DNS", "TLD DNS"],
              questionKeywords: ["네임 서버", "주 네임 서버", "보조 네임 서버", "캐시 DNS", "권한 DNS"],
              blocks: [
                { type: "table", title: "네임 서버 구분", columns: ["종류", "역할"], rows: [
                  ["루트·TLD 네임 서버", "다음 하위 계층 또는 해당 최상위 도메인의 권한 서버 정보를 안내"],
                  ["권한 네임 서버", "위임받은 영역의 레코드에 대해 최종 권한 응답"],
                  ["주 네임 서버", "영역 원본 데이터를 관리하는 서버로 마스터라고도 함"],
                  ["보조 네임 서버", "주 서버에서 영역 데이터를 복제·동기화해 서비스하며 슬레이브라고도 함"],
                  ["캐시 DNS", "질의 결과를 TTL 동안 저장해 재사용"]
                ] },
                { type: "text", title: "권한 서버 운영 점검", paragraphs: ["교재는 권한 DNS를 다른 기능과 분리해 운영하고, TCP·UDP 53번 인바운드 통신을 허용하며, 주·보조 네임 서버를 분산 구성하는 방안을 제시합니다."] }
              ],
              memoryPoints: ["주 서버는 영역 원본을 관리하고 보조 서버는 영역 전송으로 사본을 유지합니다.", "권한 응답은 해당 영역의 최종 레코드 정보를 제공하는 응답입니다."]
            },
            {
              id: "dns-query-response-types",
              title: "재귀·반복 질의와 DNS 응답",
              summary: "리졸버가 질의를 처리하는 방식과 권한 응답 여부를 구별합니다.",
              sourcePdfPages: [608],
              keywords: ["재귀 질의", "반복 질의", "Recursive", "Iterative", "권한 응답"],
              questionKeywords: ["재귀 질의", "반복 질의", "Recursive", "Iterative", "권한 응답"],
              blocks: [
                { type: "table", title: "질의 방식", columns: ["방식", "동작"], rows: [
                  ["재귀 질의", "요청받은 서버가 최종 답을 얻을 때까지 다른 서버에 질의하고 결과를 요청자에게 반환"],
                  ["반복 질의", "서버가 자신이 아는 정보 또는 다음에 질의할 서버를 안내하고 질의자가 다음 서버를 찾아감"]
                ] },
                { type: "text", title: "응답의 권한 여부", paragraphs: ["권한 응답은 해당 도메인 영역을 관리하는 권한 서버가 제공한 응답입니다. 캐시나 다른 경로에서 얻은 비권한 응답은 유효 기간과 출처를 고려해 사용해야 합니다."] }
              ],
              memoryPoints: ["재귀는 요청받은 서버가 최종 답을 찾아 반환하고, 반복은 다음 질의 대상을 안내합니다.", "권한 응답과 캐시에 기반한 비권한 응답을 구분합니다."]
            }
          ]
        },
        {
          id: "application-dns-zones-records",
          chapter: "DNS 보안",
          status: "published",
          title: "DNS 영역과 자원 레코드",
          summary: "영역 파일·영역 전송·자원 레코드와 역방향 조회를 학습합니다.",
          sourcePdfPages: [609, 611],
          concepts: [
            {
              id: "dns-zone-transfer",
              title: "영역 파일과 영역 전송",
              summary: "DNS 영역 데이터를 저장하고 주·보조 서버 사이에서 동기화하는 방식을 정리합니다.",
              sourcePdfPages: [609],
              keywords: ["Zone", "영역 파일", "Zone Transfer", "AXFR", "IXFR", "TCP 53"],
              questionKeywords: ["영역 전송", "Zone Transfer", "Zone 파일", "TCP 53"],
              blocks: [
                { type: "text", title: "영역 데이터", paragraphs: ["영역 파일은 도메인 영역의 호스트·메일 서버 등 자원 레코드를 보관합니다. 영역 전송은 주 서버의 영역 데이터를 보조 서버에 복제하거나 변경분을 동기화하는 절차입니다.", "영역 전송은 데이터량과 신뢰성 요구 때문에 TCP를 사용합니다. 외부에 불필요하게 허용된 영역 전송은 내부 호스트와 서비스 정보를 노출할 수 있으므로 허용 대상을 제한해야 합니다."] }
              ],
              memoryPoints: ["영역 전송은 권한 서버 간 영역 데이터 복제이며 TCP를 사용합니다.", "영역 전송 허용 대상을 신뢰할 수 있는 보조 서버로 제한합니다."]
            },
            {
              id: "dns-resource-records",
              title: "주요 DNS 자원 레코드",
              summary: "교재에 수록된 레코드 이름, 용도와 숫자형 타입 값을 구별합니다.",
              sourcePdfPages: [609, 610],
              keywords: ["Resource Record", "A", "NS", "CNAME", "SOA", "PTR", "MX", "TXT", "AAAA", "ANY"],
              questionKeywords: ["DNS 레코드", "Resource Record", "A 레코드", "SOA", "PTR", "MX", "ANY"],
              blocks: [
                { type: "table", title: "레코드 타입", columns: ["타입 값", "레코드", "용도"], rows: [
                  ["1", "A", "호스트 이름에 IPv4 주소를 연결"],
                  ["2", "NS", "영역의 권한 네임 서버를 지정"],
                  ["5", "CNAME", "별칭 이름을 정규 이름에 연결"],
                  ["6", "SOA", "영역의 시작과 관리 정보를 저장"],
                  ["12", "PTR", "주소에서 이름을 찾는 역방향 조회에 사용"],
                  ["15", "MX", "도메인의 메일 교환 서버를 지정"],
                  ["16", "TXT", "도메인에 텍스트 정보를 저장"],
                  ["28", "AAAA", "호스트 이름에 IPv6 주소를 연결"]
                ] },
                { type: "text", title: "SOA와 ANY", paragraphs: ["SOA에는 일련번호(Serial), 갱신 간격(Refresh), 재시도 간격(Retry), 만료 시간(Expire) 등이 포함됩니다. 일련번호는 영역 변경 여부를 보조 서버가 판단할 때 사용합니다.", "ANY의 타입 값은 255로 표시되지만 교재의 레코드 표에서 일반 저장 레코드와 구분되는 질의 타입입니다. ANY 질의는 여러 레코드 정보를 요구해 응답 증폭에 악용될 수 있습니다."] }
              ],
              memoryPoints: ["A는 IPv4, AAAA는 IPv6, PTR은 역방향 조회입니다.", "ANY(255)는 일반 자원 레코드와 구별되는 질의 타입으로 다룹니다."]
            },
            {
              id: "dns-reverse-lookup",
              title: "역방향 도메인 조회와 PTR",
              summary: "IP 주소에 대응하는 도메인 이름을 in-addr.arpa 영역의 PTR 레코드로 찾습니다.",
              sourcePdfPages: [610, 611],
              keywords: ["역방향 조회", "Reverse DNS", "PTR", "in-addr.arpa"],
              questionKeywords: ["역방향 조회", "Reverse DNS", "PTR", "in-addr.arpa"],
              blocks: [
                { type: "text", title: "조회 원리", paragraphs: ["정방향 조회가 이름에서 주소를 찾는다면 역방향 조회는 주소에서 이름을 찾습니다. IPv4 주소의 옥텟 순서를 뒤집어 in-addr.arpa 영역에 질의하고 PTR 레코드로 이름을 반환합니다.", "교재 예시에서는 192.168.0.1을 1.0.168.192.in-addr.arpa 이름으로 조회합니다. PTR 결과는 등록된 역방향 영역 정보에 의존하므로 주소의 실제 소유자를 암호학적으로 증명하지는 않습니다."] }
              ],
              memoryPoints: ["역방향 DNS는 IPv4 옥텟 순서를 뒤집은 in-addr.arpa 이름에 PTR을 조회합니다.", "PTR 등록은 이름 연결 정보이며 사용자 신원을 보증하는 인증 수단은 아닙니다."]
            }
          ]
        },
        {
          id: "application-dns-cache-bind",
          chapter: "DNS 보안",
          status: "published",
          title: "DNS 캐시와 BIND 설정",
          summary: "TTL 캐시와 DNS 헤더 플래그, BIND 설정 파일의 역할을 학습합니다.",
          sourcePdfPages: [612, 613],
          concepts: [
            {
              id: "dns-cache-flags",
              title: "DNS 캐시와 헤더 플래그",
              summary: "TTL 기반 캐시의 장단점과 질의·응답 메시지에서 쓰이는 플래그를 구분합니다.",
              sourcePdfPages: [612],
              keywords: ["DNS Cache", "TTL", "QR", "AA", "TC", "RD", "RA"],
              questionKeywords: ["DNS 캐시", "TTL", "QR", "AA", "TC", "RD", "RA"],
              blocks: [
                { type: "text", title: "캐시 동작", paragraphs: ["캐시 DNS는 질의 결과를 TTL 동안 저장해 반복 조회의 응답 시간과 권한 서버 부하를 줄입니다. 양성 캐시는 존재하는 레코드 결과를, 음성 캐시는 이름이 없다는 결과를 보관합니다. 잘못된 결과가 캐시에 들어가면 TTL이 끝날 때까지 영향이 지속될 수 있습니다."] },
                { type: "table", title: "DNS 메시지 플래그", columns: ["플래그", "의미"], rows: [
                  ["QR", "0은 질의, 1은 응답"],
                  ["AA", "응답이 권한 서버의 권한 응답임을 표시"],
                  ["TC", "응답이 잘려 추가 처리가 필요함을 표시"],
                  ["RD", "요청자가 재귀 질의를 원함을 표시"],
                  ["RA", "서버가 재귀 질의를 지원함을 표시"]
                ] }
              ],
              memoryPoints: ["TTL은 캐시 결과를 유지하는 시간입니다.", "RD는 재귀 요청, RA는 재귀 지원 여부를 나타냅니다."]
            },
            {
              id: "dns-bind-config-files",
              title: "BIND 설정 파일",
              summary: "교재에 제시된 BIND 설정 경로와 시스템의 DNS 관련 파일을 구분합니다.",
              sourcePdfPages: [613],
              keywords: ["BIND", "named.conf", "named.rfc1912.zones", "rndc.key", "resolv.conf"],
              questionKeywords: ["BIND", "named.conf", "named.rfc1912.zones", "rndc.key", "resolv.conf"],
              blocks: [
                { type: "table", title: "파일과 역할", columns: ["경로", "교재에 제시된 용도"], rows: [
                  ["/etc/named.conf", "BIND 네임 서버의 주 설정 파일"],
                  ["/etc/named.iscdlv.key", "DNSSEC 관련 키 설정 파일"],
                  ["/etc/named.rfc1912.zones", "표준 로컬 영역 설정 파일"],
                  ["/etc/rndc.key", "원격 네임 서버 제어(RNDC) 인증 키"],
                  ["/etc/resolv.conf", "시스템이 사용할 DNS 리졸버 지정"],
                  ["/etc/host.conf", "호스트 이름 해석 순서 등 관련 설정"]
                ] }
              ],
              memoryPoints: ["named.conf는 BIND 서버 설정, resolv.conf는 시스템 리졸버 설정 파일입니다.", "파일명과 경로는 유사하므로 named 설정과 클라이언트 해석 설정을 구별합니다."]
            }
          ]
        },
        {
          id: "application-dns-spoofing-poisoning",
          chapter: "DNS 보안",
          status: "published",
          title: "DNS 스푸핑과 캐시 포이즈닝",
          summary: "질의 응답 위조와 캐시 오염의 차이 및 교재의 대응 방법을 정리합니다.",
          sourcePdfPages: [614, 616],
          concepts: [
            {
              id: "dns-spoofing",
              title: "DNS 스푸핑",
              summary: "공격자가 정상 응답보다 먼저 위조 응답을 전달해 사용자를 공격자 지정 주소로 유도하는 공격입니다.",
              sourcePdfPages: [614, 615],
              keywords: ["DNS Spoofing", "위조 응답", "hosts.ics", "hosts 파일", "ARP Spoofing"],
              questionKeywords: ["DNS 스푸핑", "위조 DNS 응답", "hosts.ics", "hosts 파일"],
              blocks: [
                { type: "text", title: "공격 흐름", paragraphs: ["공격자는 DNS 질의를 관찰할 수 있는 경로에서 정상 서버보다 먼저 위조 응답을 보내 사용자를 가짜 IP 주소로 연결합니다. 교재는 질의 감시와 응답 선점이 이루어지는 네트워크 상황을 설명합니다."] },
                { type: "table", title: "교재의 대응 항목", columns: ["대응", "목적"], rows: [
                  ["hosts.ics 등 로컬 호스트 매핑 관리", "주요 도메인의 비정상적인 주소 매핑 여부를 확인"],
                  ["무차별 모드 탐지", "불필요한 패킷을 수집하는 단말·도구를 점검"],
                  ["ARP 스푸핑 탐지", "로컬 네트워크에서 질의 경로가 변조되는 상황을 점검"]
                ] },
                { type: "text", title: "로컬 hosts 파일", paragraphs: ["hosts 파일은 로컬 IP 주소와 도메인 이름의 대응을 지정하며 DNS보다 우선 적용될 수 있습니다. 교재는 주요 사이트 주소 점검과 로컬 이름 매핑 사례를 함께 제시하므로 임의로 추가된 항목을 확인해야 합니다."] }
              ],
              memoryPoints: ["DNS 스푸핑은 위조 응답을 질의자에게 먼저 전달해 접속 주소를 바꾸는 공격입니다.", "hosts 파일은 로컬 이름 해석에 영향을 주므로 비정상 매핑을 점검합니다."]
            },
            {
              id: "dns-cache-poisoning",
              title: "DNS 캐시 포이즈닝",
              summary: "위조 응답으로 캐시 서버의 도메인 레코드를 오염시키는 공격과 방어를 학습합니다.",
              sourcePdfPages: [615, 616],
              keywords: ["DNS Cache Poisoning", "TXID", "transaction ID", "source port", "재귀 질의"],
              questionKeywords: ["DNS 캐시 포이즈닝", "TXID", "DNS 응답 위조", "재귀 질의 제한"],
              blocks: [
                { type: "text", title: "공격 원리", paragraphs: ["공격자는 질의에 대응하는 응답보다 먼저 위조 응답을 캐시 서버에 받아들이게 해 도메인과 공격자 주소의 잘못된 대응을 저장시킵니다. 교재는 질의 스니핑에 의존하지 않고 트랜잭션 ID와 출발지 포트를 추측해 다수의 위조 응답을 보내는 방식을 설명합니다."] },
                { type: "table", title: "대응 방안", columns: ["대응", "설명"], rows: [
                  ["재귀 질의 제한", "필요한 클라이언트와 네트워크에만 재귀 서비스를 제공"],
                  ["DNSSEC 검증", "서명 검증을 통해 레코드의 출처와 무결성을 확인"],
                  ["최신 버전 유지", "구현 취약점과 알려진 우회 기법에 대한 패치를 적용"],
                  ["캐시 관리", "오염이 의심되면 신뢰할 수 있는 서버 확인 후 캐시를 정리"],
                  ["암호화된 DNS 사용", "DoH 또는 DoT로 전송 구간에서 질의 내용을 보호"]
                ] }
              ],
              memoryPoints: ["캐시 포이즈닝은 캐시 서버가 잘못된 이름-주소 대응을 저장하게 합니다.", "질의 ID와 포트 무작위화, 재귀 제한, DNSSEC 검증 등 다층 방어가 필요합니다."]
            }
          ]
        },
        {
          id: "application-dns-dos-dnssec",
          chapter: "DNS 보안",
          status: "published",
          title: "DNS 서비스 거부와 DNSSEC",
          summary: "DNS 증폭·Water Torture 공격과 DNSSEC이 제공하는 보안 속성을 비교합니다.",
          sourcePdfPages: [617, 618],
          concepts: [
            {
              id: "dns-amplification",
              title: "DNS 증폭 공격",
              summary: "작은 위조 질의에 큰 DNS 응답을 발생시켜 피해자에게 반사시키는 공격입니다.",
              sourcePdfPages: [617, 618],
              keywords: ["DNS Amplification", "ANY", "open resolver", "반사 공격", "IP Spoofing"],
              questionKeywords: ["DNS 증폭", "DNS Amplification", "ANY", "반사 공격", "개방형 리졸버"],
              blocks: [
                { type: "text", title: "공격 흐름", paragraphs: ["공격자는 피해자 IP를 출발지로 위조해 개방형 리졸버에 DNS 질의를 보냅니다. 작은 요청보다 큰 응답이 피해자에게 반사되면 트래픽이 증폭됩니다. ANY 질의처럼 여러 정보를 요구하는 질의가 악용될 수 있습니다."] },
                { type: "table", title: "완화", columns: ["통제", "효과"], rows: [
                  ["ANY 응답 제한", "불필요하게 큰 응답을 만드는 질의 악용을 줄임"],
                  ["재귀 서비스 제한", "허용된 내부 클라이언트에만 재귀 질의를 제공"],
                  ["DNS 서버 최신화", "알려진 취약점과 오용 가능성을 줄임"],
                  ["출발지 주소 검증", "위조된 출발지 주소의 패킷이 네트워크 밖으로 나가지 않도록 차단"]
                ] }
              ],
              memoryPoints: ["증폭 공격은 출발지 IP 위조와 큰 DNS 응답의 반사를 이용합니다.", "개방형 재귀 서버를 제한하고 출발지 주소 위조를 차단합니다."]
            },
            {
              id: "dns-water-torture",
              title: "DNS Water Torture 공격",
              summary: "존재하지 않는 하위 도메인에 다량 질의해 권한 DNS의 처리 자원을 소진시키는 공격입니다.",
              sourcePdfPages: [618],
              keywords: ["DNS Water Torture", "random subdomain", "NXDOMAIN", "권한 DNS"],
              questionKeywords: ["Water Torture", "랜덤 서브도메인", "NXDOMAIN", "DNS 서비스 거부"],
              blocks: [
                { type: "text", title: "공격 흐름", paragraphs: ["감염된 다수의 봇이 무작위로 생성한 존재하지 않는 하위 도메인을 반복 질의합니다. 질의가 캐시 적중하지 않고 권한 서버까지 전달되어 NXDOMAIN 응답과 처리 부하를 유발합니다. 교재는 이 방식이 반사 증폭 공격처럼 피해자 출발지 주소를 위조하는 데 의존하지 않는다고 구분합니다."] }
              ],
              memoryPoints: ["Water Torture는 무작위 하위 도메인으로 캐시를 우회해 권한 서버에 부하를 줍니다.", "DNS 증폭의 반사 트래픽과 달리 출발지 주소 위조가 핵심 요건은 아닙니다."]
            },
            {
              id: "dnssec",
              title: "DNSSEC의 보안 속성",
              summary: "DNS 레코드에 대한 전자서명 검증으로 DNS 응답의 출처와 무결성을 보강합니다.",
              sourcePdfPages: [618],
              keywords: ["DNSSEC", "전자서명", "무결성", "인증", "기밀성"],
              questionKeywords: ["DNSSEC", "전자서명", "DNS 인증", "DNS 무결성"],
              blocks: [
                { type: "text", title: "제공하는 보안", paragraphs: ["DNSSEC은 DNS 데이터에 서명을 연결하고 검증해 응답 데이터의 출처 인증과 무결성을 확인하도록 합니다. 이는 위조·캐시 오염 방어에 도움을 줍니다.", "DNSSEC 자체는 DNS 질의 내용을 암호화하지 않으므로 기밀성을 제공하지 않습니다. 또한 정상 응답의 진위를 확인하는 기능이므로 트래픽을 고갈시키는 서비스 거부 공격의 가용성을 보장하지 않습니다."] },
                { type: "table", title: "보안 속성 구분", columns: ["속성", "DNSSEC 제공 여부"], rows: [
                  ["출처 인증", "서명 검증으로 제공"],
                  ["무결성", "변조 여부 검증으로 제공"],
                  ["기밀성", "제공하지 않음"],
                  ["서비스 가용성 보장", "제공하지 않음"]
                ] }
              ],
              memoryPoints: ["DNSSEC은 DNS 데이터의 인증과 무결성을 제공하며 암호화나 가용성 보장 기능은 아닙니다.", "DNSSEC 서명 검증을 실제로 수행하는 검증 체인이 구성되어야 합니다."]
            }
          ]
        },
        {
          id: "application-dns-sinkhole-tools",
          chapter: "DNS 보안",
          status: "published",
          title: "DNS 싱크홀과 진단 명령",
          summary: "악성 C&C 도메인의 연결을 차단하는 싱크홀과 교재의 DNS 점검 명령을 익힙니다.",
          sourcePdfPages: [619, 621],
          concepts: [
            {
              id: "dns-sinkhole-irc",
              title: "DNS 싱크홀과 C&C 통신",
              summary: "감염 단말이 악성 명령제어 도메인을 조회할 때 싱크홀 주소로 유도해 통신을 차단합니다.",
              sourcePdfPages: [619, 620],
              keywords: ["DNS Sinkhole", "KISA", "C&C", "IRC", "봇넷"],
              questionKeywords: ["DNS 싱크홀", "Sinkhole", "C&C", "IRC", "KISA"],
              blocks: [
                { type: "text", title: "동작", paragraphs: ["DNS 싱크홀은 알려진 악성 C&C 도메인의 조회 결과를 관찰·통제 가능한 싱크홀 IP로 돌려 감염 단말이 공격자의 명령 서버에 연결하지 못하게 합니다. 교재는 KISA의 C&C 목록과 싱크홀 적용 사업자 사례를 설명합니다.", "IRC는 봇넷의 명령·제어 채널로 악용되어 왔습니다. 감염 단말의 DNS 질의와 싱크홀 응답을 분석하면 C&C 연결 시도와 감염 규모 파악에 도움을 줄 수 있습니다."] }
              ],
              memoryPoints: ["싱크홀은 악성 도메인의 해석 결과를 통제된 주소로 돌려 C&C 접속을 막습니다.", "IRC는 봇의 명령·제어 통신에 악용될 수 있는 채널입니다."]
            },
            {
              id: "dns-diagnostic-utilities",
              title: "DNS 조회·캐시 점검 명령",
              summary: "nslookup, dig, ipconfig 명령으로 레코드 조회와 로컬 DNS 캐시를 점검합니다.",
              sourcePdfPages: [620, 621],
              keywords: ["nslookup", "dig", "ipconfig", "flushdns", "displaydns", "registerdns"],
              questionKeywords: ["nslookup", "dig", "ipconfig /flushdns", "DNS 캐시"],
              blocks: [
                { type: "table", title: "명령과 기능", columns: ["명령", "기능"], rows: [
                  ["nslookup [도메인 또는 IP]", "도메인 정방향 또는 IP 역방향 DNS 조회"],
                  ["nslookup set type=[레코드]", "조회할 DNS 레코드 유형 설정"],
                  ["dig [도메인] [질의 유형]", "DNS 레코드 질의와 응답 상세 확인"],
                  ["ipconfig /all", "네트워크 어댑터와 DNS 설정 확인"],
                  ["ipconfig /flushdns", "로컬 DNS 리졸버 캐시 삭제"],
                  ["ipconfig /displaydns", "로컬 DNS 캐시 내용 표시"],
                  ["ipconfig /registerdns", "DNS 이름 등록·갱신을 요청"]
                ] },
                { type: "text", title: "조회 유형", paragraphs: ["nslookup과 dig에서는 A, CNAME, MX, NS 등 필요한 레코드 유형을 지정해 조회할 수 있습니다. 시스템의 DNS 설정과 캐시를 확인한 뒤 조회 결과가 권한 서버 응답인지 캐시 응답인지 함께 판단합니다."] }
              ],
              memoryPoints: ["nslookup·dig는 DNS 질의에, ipconfig는 Windows 네트워크 설정과 로컬 캐시에 사용합니다.", "flushdns는 캐시를 비우고 displaydns는 캐시 내용을 표시합니다."]
            }
          ]
        },
        {
          id: "application-db-foundations",
          chapter: "데이터베이스 보안",
          status: "published",
          title: "데이터베이스와 관계형 모델",
          summary: "DB·DBMS의 역할, 관계형 모델의 구성 요소, SQL 분류와 데이터베이스 보안 목표를 학습합니다.",
          sourcePdfPages: [633, 635],
          concepts: [
            {
              id: "db-and-rdbms-model",
              title: "데이터베이스·DBMS와 관계형 모델",
              summary: "데이터베이스와 관리 시스템의 차이, 관계형 데이터의 구성 단위를 구분합니다.",
              sourcePdfPages: [633],
              keywords: ["Database", "DBMS", "RDBMS", "Relation", "Attribute", "Tuple", "Domain", "Schema"],
              questionKeywords: ["데이터베이스", "DBMS", "관계형 데이터베이스", "릴레이션", "튜플", "도메인", "스키마"],
              blocks: [
                { type: "text", title: "DB와 DBMS", paragraphs: ["데이터베이스(DB)는 여러 사용자가 필요한 정보를 효율적으로 접근하고 관리할 수 있도록 구조화해 모아 둔 데이터 집합입니다. 데이터베이스 관리 시스템(DBMS)은 데이터베이스를 만들고 저장·관리하는 기능을 제공하는 응용 프로그램입니다.", "관계형 DBMS는 데이터를 테이블 형태로 저장하고 SQL로 관리하며 정형 데이터에 적합합니다. 비관계형(NoSQL) 데이터베이스는 다양한 구조로 비정형 데이터를 다룰 수 있습니다."] },
                { type: "table", title: "관계형 모델의 구성 요소", columns: ["요소", "의미"], rows: [
                  ["릴레이션(Relation)", "행과 열로 이루어진 테이블"],
                  ["속성(Attribute)", "데이터의 특성을 나타내는 테이블의 열"],
                  ["튜플(Tuple)", "릴레이션의 한 행"],
                  ["도메인(Domain)", "속성이 가질 수 있는 값의 형식·범위"],
                  ["키(Key)", "튜플을 식별하거나 릴레이션 사이의 관계를 표현하는 속성"],
                  ["스키마(Schema)", "데이터 구조와 제약을 정의한 명세"],
                  ["무결성 제약조건", "유효하고 일관된 데이터가 유지되도록 하는 규칙"]
                ] }
              ],
              memoryPoints: ["데이터베이스는 데이터의 집합, DBMS는 이를 생성·저장·관리하는 소프트웨어입니다.", "릴레이션은 테이블, 속성은 열, 튜플은 행입니다."]
            },
            {
              id: "db-sql-categories",
              title: "SQL 명령의 분류",
              summary: "DDL·DML·DCL의 목적과 대표 명령을 구별하고 트랜잭션 명령을 함께 정리합니다.",
              sourcePdfPages: [634],
              keywords: ["SQL", "DDL", "DML", "DCL", "CREATE", "SELECT", "GRANT", "COMMIT"],
              questionKeywords: ["SQL 유형", "DDL", "DML", "DCL", "GRANT", "REVOKE", "COMMIT", "ROLLBACK"],
              blocks: [
                { type: "table", title: "SQL 유형과 예", columns: ["분류", "목적", "대표 구문"], rows: [
                  ["DDL (Data Definition Language)", "데이터베이스·테이블 등 구조 정의", "CREATE, ALTER, ADD, DROP, MODIFY"],
                  ["DML (Data Manipulation Language)", "데이터 검색·삽입·수정·삭제", "SELECT, INSERT, UPDATE, DELETE"],
                  ["DCL (Data Control Language)", "사용자·역할 권한의 부여와 회수", "GRANT, REVOKE, DENY"],
                  ["트랜잭션 제어", "변경의 확정 또는 취소", "COMMIT, ROLLBACK"]
                ] },
                { type: "text", title: "분류에 유의", paragraphs: ["교재의 SQL 유형 표에는 DCL 예로 COMMIT·ROLLBACK도 함께 표시되어 있지만, 같은 절의 허가 규칙 설명에서는 두 명령을 트랜잭션 저장·복구 명령으로 별도 설명합니다. 문제에서는 구문의 기능과 교재가 묻는 분류 기준을 함께 확인합니다."] }
              ],
              memoryPoints: ["DDL은 구조, DML은 데이터, DCL은 권한을 다룹니다.", "COMMIT은 트랜잭션 확정, ROLLBACK은 이전 상태 복원입니다."]
            },
            {
              id: "db-security-goals",
              title: "데이터베이스 보안의 개념과 목표",
              summary: "DB에 저장된 정보의 기밀성·무결성·가용성을 침해로부터 보호합니다.",
              sourcePdfPages: [634, 635],
              keywords: ["DB Security", "기밀성", "무결성", "가용성", "데이터베이스 보안"],
              questionKeywords: ["데이터베이스 보안", "기밀성", "무결성", "가용성"],
              blocks: [
                { type: "text", title: "보호 대상", paragraphs: ["데이터베이스 보안은 허가받지 않은 사용·변경·파괴·유출로부터 저장 데이터를 보호해 기밀성, 무결성, 가용성이 침해되지 않도록 하는 활동입니다."] },
                { type: "table", title: "보안 목표", columns: ["목표", "데이터베이스에서의 의미"], rows: [
                  ["기밀성", "허가받은 사용자에게만 데이터가 공개되도록 보호"],
                  ["무결성", "데이터와 처리 결과가 부당하게 변경·손상되지 않도록 보장"],
                  ["가용성", "정당한 사용자가 필요한 때 DB 자원과 서비스를 이용하도록 보장"]
                ] }
              ],
              memoryPoints: ["데이터베이스 보안 목표는 기밀성·무결성·가용성입니다.", "유출은 기밀성, 부당한 변경은 무결성, 자원 고갈은 가용성 위협입니다."]
            }
          ]
        },
        {
          id: "application-db-threats-controls",
          chapter: "데이터베이스 보안",
          status: "published",
          title: "데이터베이스 위협과 보안 요구사항",
          summary: "DB 위협 유형과 요구사항별 보안 통제 수단을 연결합니다.",
          sourcePdfPages: [636, 637],
          concepts: [
            {
              id: "db-threat-types",
              title: "데이터베이스 위협 유형",
              summary: "정보 노출·변경·서비스 거부와 집합성·추론·데이터 디들링 공격을 구분합니다.",
              sourcePdfPages: [636],
              keywords: ["Disclosure", "Modification", "DoS", "Aggregation", "Inference", "Data Diddling"],
              questionKeywords: ["데이터베이스 위협", "집합성 공격", "추론 공격", "데이터 디들링", "Data Diddling"],
              blocks: [
                { type: "table", title: "대표 위협", columns: ["위협", "설명과 예"], rows: [
                  ["정보 노출(Disclosure)", "정보 일부 또는 전체가 고의·과실로 허가 없이 공유되거나 공개되는 행위"],
                  ["데이터 부적절한 변경(Modification)", "권한 없는 사용자·애플리케이션·프로세스가 데이터를 부당하게 바꾸는 행위"],
                  ["서비스 거부(DoS)", "정당한 사용자가 필요한 시간에 DB 자원을 쓰지 못하게 하는 행위"],
                  ["집합성(Aggregation) 공격", "낮은 등급 정보 조각을 결합해 높은 등급 정보를 알아내는 공격"],
                  ["추론(Inference) 공격", "비밀로 분류되지 않은 정보에서 기밀 정보를 유추하는 공격"],
                  ["데이터 디들링(Data Diddling)", "처리할 자료를 다른 자료로 바꾸어 결과를 왜곡하는 공격"]
                ] }
              ],
              memoryPoints: ["집합성은 여러 정보 조각의 결합, 추론은 공개·저등급 정보에서 비밀을 유도합니다.", "Data Diddling은 처리 입력 데이터를 바꾸어 결과를 왜곡합니다."]
            },
            {
              id: "db-security-requirements",
              title: "보안 요구사항과 통제 기술",
              summary: "정당한 접근, 추론 방지, 데이터 무결성, 감사, 기밀 관리와 다단계 보호를 연결합니다.",
              sourcePdfPages: [636, 637],
              keywords: ["접근 통제", "추론 통제", "흐름 통제", "작업 결재", "감사", "다단계 보호"],
              questionKeywords: ["데이터베이스 보안 요구사항", "접근 통제", "추론 통제", "흐름 통제", "작업 결재"],
              blocks: [
                { type: "table", title: "요구사항과 적용 통제", columns: ["요구사항", "보호 방법"], rows: [
                  ["정당한 사용자의 데이터 접근 보장", "접근 제어로 사용자·레코드·속성·값 단위 권한을 적용"],
                  ["추론 방지", "암호화 또는 질의 제한으로 집계 결과에서 개별 정보를 유추하기 어렵게 함"],
                  ["데이터 무결성 유지", "접근 제어와 작업 결재로 비인가 변경을 막고 장애에 대비"],
                  ["데이터 의미 무결성 유지", "기본키·외래키·UNIQUE·CHECK·NOT NULL 제약조건 적용"],
                  ["시스템 감사 지원", "접근 기록을 남기고 중요 정보의 감사·모니터링 수행"],
                  ["기밀 데이터 관리·보호", "접근 제어와 암호화로 허가된 사용자만 취급"],
                  ["다단계 보호", "정보 등급에 따라 접근 수준을 배정하고 인증·환경을 분리"]
                ] },
                { type: "text", title: "교재의 보안 통제", paragraphs: ["교재는 데이터베이스 보안 기술로 접근 제어, 암호화, 작업 결재, 취약점 분석, 허가 규칙, 가상 테이블(View), 인증 등을 제시합니다. 통제는 DB에 로그인했다는 사실만으로 모든 데이터 접근을 허용하지 않고, 필요한 대상과 작업의 범위를 구분합니다."] }
              ],
              memoryPoints: ["키·UNIQUE·CHECK·NOT NULL은 데이터의 의미상 무결성을 유지하는 제약조건입니다.", "감사·모니터링은 접근 이력을 남기고 사후 검증할 수 있게 합니다."]
            }
          ]
        },
        {
          id: "application-db-access-control",
          chapter: "데이터베이스 보안",
          status: "published",
          title: "데이터베이스 접근 제어",
          summary: "View·인증 모드와 프록시·인라인·스니핑·에이전트 방식의 접근 통제를 비교합니다.",
          sourcePdfPages: [638, 639],
          concepts: [
            {
              id: "db-view-authentication",
              title: "View와 데이터베이스 인증",
              summary: "가상 테이블로 데이터 범위를 제한하고 Windows 인증과 SQL Server 혼합 인증을 구분합니다.",
              sourcePdfPages: [638],
              keywords: ["View", "가상 테이블", "Windows Authentication", "혼합 모드", "SID"],
              questionKeywords: ["데이터베이스 View", "가상 테이블", "윈도우 인증", "혼합 모드", "SID"],
              blocks: [
                { type: "text", title: "View", paragraphs: ["View는 하나 이상의 물리 테이블에서 유도되는 가상 테이블입니다. 기본 테이블을 직접 노출하지 않고 필요한 행·열만 질의 결과로 제공해 데이터 접근 범위를 줄이는 데 활용할 수 있습니다."] },
                { type: "table", title: "MS-SQL 인증 모드", columns: ["모드", "특징"], rows: [
                  ["Windows 인증", "Windows 계정과 보안 체계를 이용하며 별도의 SQL 계정 비밀번호 입력 없이 사용자 권한을 관리"],
                  ["혼합 모드(SQL Server 인증)", "Windows 인증에 더해 SQL Server의 별도 계정과 비밀번호로 인증"]
                ] },
                { type: "text", title: "SID와 감사", paragraphs: ["교재는 로그온 추적에서 SID(Security Identifier)를 이용해 사용자·그룹·컴퓨터를 식별하는 사례를 제시합니다. SID는 Windows 보안 주체 식별자이며 감사 로그에서 계정 식별에 활용됩니다."] }
              ],
              memoryPoints: ["View는 기본 테이블에서 필요한 정보만 제공하는 가상 테이블입니다.", "Windows 인증은 Windows 계정을, 혼합 모드는 SQL Server 계정 인증도 허용합니다."]
            },
            {
              id: "db-access-control-types",
              title: "DB 접근 제어 시스템 유형",
              summary: "접근 경로에 배치되는 프록시·인라인 게이트웨이·스니핑·에이전트·하이브리드 방식을 비교합니다.",
              sourcePdfPages: [638, 639],
              keywords: ["Proxy Gateway", "Inline Gateway", "TAP", "Packet Mirroring", "Agent", "Hybrid"],
              questionKeywords: ["데이터베이스 접근 제어 유형", "Proxy Gateway", "Inline Gateway", "스니핑", "Agent", "TAP"],
              blocks: [
                { type: "table", title: "방식별 동작", columns: ["방식", "구성·통제 특성"], rows: [
                  ["프록시 게이트웨이", "별도 프록시 서버에 독립 IP·포트를 부여하고 해당 경로를 거쳐서만 DB에 접속"],
                  ["인라인 게이트웨이", "DB와 사용자 네트워크 사이에 인라인 장비를 두고 통과 패킷을 실시간 통제"],
                  ["스니핑", "TAP 또는 스위치·라우터의 패킷 미러링으로 트래픽을 복제해 분석·기록하고 사후 검증"],
                  ["에이전트", "DB 서버에 접근 제어 에이전트를 설치해 전용 프로그램을 통한 접속만 허용"],
                  ["하이브리드", "스니핑·게이트웨이·에이전트 등 둘 이상의 방식을 결합"]
                ] },
                { type: "text", title: "TAP과 미러링", paragraphs: ["TAP은 네트워크 구간에 직접 연결해 트래픽을 복제하여 모니터링 장비로 전달합니다. 패킷 미러링은 스위치나 라우터가 선택한 트래픽을 복제해 분석 시스템에 보냅니다. 두 방식은 관찰·사후 분석에 쓰이며 인라인 통제와 목적이 다릅니다."] }
              ],
              memoryPoints: ["인라인 게이트웨이는 통과 트래픽을 실시간 통제하고 스니핑은 복제 트래픽을 기록·분석합니다.", "에이전트 방식은 DB 서버에 설치한 전용 구성요소를 통한 접근을 통제합니다."]
            }
          ]
        },
        {
          id: "application-db-encryption",
          chapter: "데이터베이스 보안",
          status: "published",
          title: "데이터베이스 암호화 방식",
          summary: "컬럼 암호화와 디스크·운영체제 계층의 암호화 방식 및 데이터 흐름을 비교합니다.",
          sourcePdfPages: [640, 641],
          concepts: [
            {
              id: "db-column-encryption",
              title: "컬럼 암호화: API·Plug-in·Hybrid",
              summary: "애플리케이션 계층이나 DBMS 내부 모듈을 이용해 특정 데이터 컬럼을 암·복호화합니다.",
              sourcePdfPages: [640, 641],
              keywords: ["DB Encryption", "컬럼 암호화", "API", "Plug-in", "Hybrid", "암·복호화 모듈"],
              questionKeywords: ["데이터베이스 암호화", "API 방식", "Plug-in 방식", "Hybrid 방식", "컬럼 암호화"],
              blocks: [
                { type: "table", title: "컬럼 암호화 유형", columns: ["방식", "동작·배치"], rows: [
                  ["API", "암·복호화 라이브러리를 애플리케이션 서버에 설치하고 응용 프로그램이 모듈을 호출"],
                  ["Plug-in", "암·복호화 모듈을 DB 서버에 설치하고 DBMS 내부에서 플러그인으로 처리"],
                  ["Hybrid", "API와 Plug-in 방식을 함께 사용"]
                ] },
                { type: "text", title: "적용 특성", paragraphs: ["컬럼 암호화는 민감 컬럼 등 선택한 데이터의 저장과 조회 과정에 암·복호화를 적용합니다. 교재는 API·Plug-in·Hybrid 구현 방식이 DBMS 제조사와 구성에 따라 달라질 수 있음을 주의점으로 제시합니다."] }
              ],
              memoryPoints: ["API는 애플리케이션 서버, Plug-in은 DB 서버에 암·복호화 모듈을 둡니다.", "Hybrid는 API와 Plug-in을 결합합니다."]
            },
            {
              id: "db-tde-os-encryption",
              title: "TDE와 디스크·운영체제 암호화",
              summary: "DBMS 저장 계층의 TDE와 운영체제 파일 계층 암호화의 적용 범위를 구별합니다.",
              sourcePdfPages: [641],
              keywords: ["TDE", "Transparent Data Encryption", "OS Encryption", "디스크 암호화", "평문 데이터"],
              questionKeywords: ["TDE", "Transparent Data Encryption", "운영체제 암호화", "디스크 암호화"],
              blocks: [
                { type: "table", title: "저장 계층 암호화", columns: ["방식", "처리 계층과 특징"], rows: [
                  ["TDE", "DBMS가 저장 데이터의 암·복호화를 수행하며 DBMS 기능으로 투명하게 적용"],
                  ["운영체제(OS) 방식", "운영체제 파일 처리 계층에서 DB 파일 또는 저장 장치를 암호화"]
                ] },
                { type: "text", title: "적용 시 고려", paragraphs: ["TDE 구현은 DBMS 제조사별 기능 차이가 있습니다. 운영체제 방식은 파일·디스크 계층을 보호하므로 애플리케이션이 데이터 처리 시 사용하는 논리적 접근 권한과 별도로 관리해야 합니다."] }
              ],
              memoryPoints: ["TDE는 DBMS 계층, OS 방식은 운영체제·파일 계층의 암호화입니다.", "암호화 계층과 적용 대상에 따라 운영·복구 및 키 관리 방식을 확인합니다."]
            }
          ]
        },
        {
          id: "application-db-vulnerability",
          chapter: "데이터베이스 보안",
          status: "published",
          title: "데이터베이스 취약점 분석",
          summary: "취약점 분석 절차, 대표 위협과 교재에 제시된 기본 계정 사례를 학습합니다.",
          sourcePdfPages: [642],
          concepts: [
            {
              id: "db-vulnerability-analysis",
              title: "취약점 분석 절차와 유형",
              summary: "정보 자산을 파악하고 보안성을 검토해 취약점 수정과 결과 보고까지 수행합니다.",
              sourcePdfPages: [642],
              keywords: ["취약점 분석", "Security Audit", "Admin", "Default Password", "최소 권한"],
              questionKeywords: ["데이터베이스 취약점 분석", "기본 계정", "기본 비밀번호", "Admin 권한", "타 소유주 Table"],
              blocks: [
                { type: "text", title: "분석 절차", paragraphs: ["데이터베이스 취약점 분석은 정보 자산을 파악하고 보안성을 검토한 뒤 검출된 취약점과 스크립트를 수정하고 보고서를 작성해 취약점을 제거하는 절차입니다. 교재는 모의 해킹(Penetration Test)이나 내부 보안 감사(Security Audit)를 통해 전체 보안 수준을 향상하는 과정으로 설명합니다."] },
                { type: "table", title: "취약점 유형", columns: ["유형", "위험"], rows: [
                  ["Admin 권한 노출", "일반 권한 계정이 관리자 권한을 획득"],
                  ["DB 중지·손상", "DoS 공격이나 DBMS 내부 함수 악용으로 서비스 또는 데이터 손상"],
                  ["타 소유주 테이블 접근", "다른 소유자의 테이블을 무단 열람·변조"],
                  ["비밀번호 부적절", "기본값 또는 안전하지 않은 비밀번호 사용"],
                  ["권한 남용", "최소 권한 원칙 미준수로 불필요한 권한을 보유"],
                  ["형식 취약점", "버퍼 오버플로우·포맷 스트링 등"],
                  ["불법 정보 유출", "불법 파일 열람 또는 변조"],
                  ["취약점 미조치", "알려진 취약점에 대한 보안 패치·권고를 적용하지 않음"]
                ] }
              ],
              memoryPoints: ["취약점 분석은 자산 식별·보안 검토·조치·보고를 포함합니다.", "기본 계정, 과도한 권한, 패치 누락과 데이터 노출을 함께 점검합니다."]
            },
            {
              id: "db-default-accounts",
              title: "DBMS 기본 계정 점검",
              summary: "교재에 제시된 Oracle 기본 계정·비밀번호 예시를 식별하고 운영 환경에서 기본 자격 증명을 점검합니다.",
              sourcePdfPages: [642],
              keywords: ["Default Account", "sys", "system", "dbsnmp", "scott", "기본 비밀번호"],
              questionKeywords: ["데이터베이스 기본 계정", "sys", "system", "dbsnmp", "scott", "change_on_install", "tiger"],
              blocks: [
                { type: "table", title: "교재의 Oracle 기본 계정 예", columns: ["기본 계정", "교재에 나온 기본 비밀번호", "용도"], rows: [
                  ["sys", "change_on_install", "메타 데이터 스키마"],
                  ["system", "manager", "관리 정보"],
                  ["dbsnmp", "dbsnmp", "SNMP 사용"],
                  ["scott", "tiger", "샘플 데이터 활용"]
                ] },
                { type: "text", title: "점검", paragraphs: ["위 문자열은 교재가 기본 계정 사례로 든 값입니다. 운영 시스템에서는 제품·버전에 따른 기본 계정과 비밀번호의 존재 여부를 확인하고, 미사용 계정을 비활성화하거나 제거하며 기본 비밀번호를 변경해야 합니다."] }
              ],
              memoryPoints: ["교재의 기본 계정·비밀번호 표는 취약한 기본 자격 증명 점검 예시입니다.", "운영 DB에서는 계정별 사용 목적과 필요 권한을 확인하고 미사용·기본 계정을 정리합니다."]
            }
          ]
        },
        {
          id: "application-db-authorization",
          chapter: "데이터베이스 보안",
          status: "published",
          title: "권한·보안 프로파일과 설정 명령",
          summary: "GRANT·REVOKE·DENY, 계정 보안 파라미터와 MS-SQL 설정 명령을 정리합니다.",
          sourcePdfPages: [642, 643],
          concepts: [
            {
              id: "db-privilege-control",
              title: "허가 규칙과 권한 관리",
              summary: "SQL 기반 권한 부여·회수와 트랜잭션 확정·복구 명령의 차이를 학습합니다.",
              sourcePdfPages: [642, 643],
              keywords: ["GRANT", "REVOKE", "DENY", "COMMIT", "ROLLBACK", "권한"],
              questionKeywords: ["허가 규칙", "GRANT", "REVOKE", "DENY", "COMMIT", "ROLLBACK"],
              blocks: [
                { type: "table", title: "권한·트랜잭션 명령", columns: ["명령", "기능"], rows: [
                  ["GRANT", "사용자에게 접속·객체 생성·관리자 등 권한 부여"],
                  ["REVOKE", "사용자에게 부여한 권한 회수"],
                  ["DENY", "사용자나 역할의 특정 권한을 명시적으로 거부"],
                  ["COMMIT", "트랜잭션 변경을 확정"],
                  ["ROLLBACK", "오류가 발생한 경우 이전 상태로 되돌림"]
                ] },
                { type: "text", title: "권한 원칙", paragraphs: ["허가 규칙으로 권한을 부여할 때는 업무에 필요한 권한만 최소 범위로 부여하고, 사용자·역할 변경 시 불필요해진 권한을 회수합니다. COMMIT과 ROLLBACK은 권한 관리 명령이 아니라 트랜잭션 변경을 확정하거나 복원하는 명령입니다."] }
              ],
              memoryPoints: ["GRANT는 권한 부여, REVOKE는 회수, DENY는 명시적 거부입니다.", "COMMIT·ROLLBACK은 트랜잭션의 확정·복구 명령입니다."]
            },
            {
              id: "db-security-profile",
              title: "계정 보안 Profile 파라미터",
              summary: "로그인 실패·비밀번호 수명·재사용·복잡도와 유휴 세션 제한을 설정합니다.",
              sourcePdfPages: [643],
              keywords: ["Profile", "FAILED_LOGIN_ATTEMPTS", "PASSWORD_LIFE_TIME", "PASSWORD_VERIFY_FUNCTION", "IDLE_TIME"],
              questionKeywords: ["데이터베이스 Profile", "FAILED_LOGIN_ATTEMPTS", "PASSWORD_LOCK_TIME", "PASSWORD_REUSE_MAX", "IDLE_TIME"],
              blocks: [
                { type: "table", title: "Profile 파라미터", columns: ["파라미터", "제한 내용"], rows: [
                  ["FAILED_LOGIN_ATTEMPTS", "로그인 실패 허용 횟수"],
                  ["PASSWORD_LOCK_TIME", "계정 잠금 유지 시간(일)"],
                  ["PASSWORD_LIFE_TIME", "비밀번호 유효 기간(일)"],
                  ["PASSWORD_GRACE_TIME", "만료 전 경고 기간(일)"],
                  ["PASSWORD_REUSE_TIME", "비밀번호 재사용 제한 기간(일)"],
                  ["PASSWORD_REUSE_MAX", "이전 비밀번호 사용 횟수 제한"],
                  ["PASSWORD_VERIFY_FUNCTION", "비밀번호 복잡도 검증 함수"],
                  ["IDLE_TIME", "유휴 세션 종료 시간(분)"]
                ] }
              ],
              memoryPoints: ["FAILED_LOGIN_ATTEMPTS와 PASSWORD_LOCK_TIME은 로그인 실패·계정 잠금 정책입니다.", "PASSWORD_LIFE_TIME·REUSE·VERIFY 계열은 비밀번호 수명과 재사용·복잡도를, IDLE_TIME은 유휴 세션을 제한합니다."]
            },
            {
              id: "db-security-configuration-commands",
              title: "계정·역할 보안 설정 명령",
              summary: "교재에 수록된 MS-SQL 계정 비밀번호 변경, 역할 부여·제거, 로그인 비활성화 명령을 확인합니다.",
              sourcePdfPages: [643],
              keywords: ["ALTER LOGIN", "sp_addrolemember", "sp_dropsrvrolemember", "DROP USER", "SQL Server"],
              questionKeywords: ["데이터베이스 보안 설정 명령어", "ALTER LOGIN", "sp_addrolemember", "DROP USER"],
              blocks: [
                { type: "table", title: "명령과 목적", columns: ["교재 명령", "목적"], rows: [
                  ["ALTER LOGIN [계정] WITH PASSWORD", "계정 비밀번호 변경"],
                  ["EXEC sp_addrolemember", "사용자에게 역할 부여"],
                  ["EXEC sp_dropsrvrolemember", "서버 역할에서 사용자 제거"],
                  ["ALTER LOGIN [계정] DISABLE", "미사용 로그인 계정 비활성화"],
                  ["DROP USER [계정]", "불필요한 사용자 제거"]
                ] },
                { type: "code", title: "교재의 명령 표기", language: "sql", code: "ALTER LOGIN [계정] WITH PASSWORD\nEXEC sp_addrolemember\nEXEC sp_dropsrvrolemember\nALTER LOGIN [계정] DISABLE\nDROP USER [계정]" }
              ],
              memoryPoints: ["계정 비밀번호를 바꾸고 불필요한 로그인은 비활성화하거나 제거합니다.", "역할 구성원 추가·제거 명령은 DBMS와 제품 버전에 따라 문법이 다를 수 있습니다."]
            }
          ]
        },
        {
          id: "application-cve-cwe-catalog",
          chapter: "애플리케이션 보안 취약점",
          status: "published",
          title: "CVE와 CWE 취약점 분류",
          summary: "공개 취약점 식별자 CVE와 소프트웨어 약점 분류 체계 CWE의 차이를 학습합니다.",
          sourcePdfPages: [653],
          concepts: [
            {
              id: "cve-cwe",
              title: "CVE 식별자와 CWE 분류",
              summary: "CVE는 알려진 취약점을 식별하고 CWE는 소프트웨어 취약점·약점의 유형을 분류합니다.",
              sourcePdfPages: [653],
              keywords: ["CVE", "CWE", "MITRE", "OWASP Top 10", "CWE/SANS Top 25"],
              questionKeywords: ["CVE", "CWE", "취약점 번호", "OWASP Top 10", "Seven Pernicious Kingdoms"],
              blocks: [
                { type: "table", title: "식별자와 분류", columns: ["체계", "용도·형식"], rows: [
                  ["CVE", "공개된 보안 취약점을 식별하는 번호 체계. 형식은 CVE-YYYY-NNNN…이며 연도와 일련번호를 포함"],
                  ["CWE", "소프트웨어 보안 약점의 유형과 공통 특성을 분류하는 카탈로그"],
                  ["CWE-699", "개발 과정에서 자주 사용되거나 나타나는 약점 분류 뷰"],
                  ["CWE-700", "Seven Pernicious Kingdoms(7PK)로 묶은 주요 소프트웨어 약점 분류"],
                  ["CWE-900", "CWE/SANS Top 25 관련 분류"],
                  ["CWE-928", "OWASP Top 10 관련 웹 약점 분류"]
                ] },
                { type: "text", title: "구분", paragraphs: ["CVE는 특정 공개 취약점 사례를 가리키고 CWE는 취약점을 낳는 공통 소프트웨어 약점 종류를 표현합니다. 교재는 CVE 번호 예로 CVE-2024-0001과 CVE-2024-123456을 제시합니다."] }
              ],
              memoryPoints: ["CVE는 취약점 식별 번호, CWE는 취약점·약점 유형 분류입니다.", "CVE-YYYY-NNNN…에서 YYYY는 연도, 뒤의 숫자는 취약점 번호입니다."]
            }
          ]
        },
        {
          id: "application-known-vulnerability-cases",
          chapter: "애플리케이션 보안 취약점",
          status: "published",
          title: "주요 공개 취약점 사례",
          summary: "교재가 다루는 Heartbleed·Shellshock·Log4Shell·Stuxnet·POODLE·DROWN의 원리와 대응을 비교합니다.",
          sourcePdfPages: [654, 659],
          concepts: [
            {
              id: "heartbleed",
              title: "Heartbleed (CVE-2014-0160)",
              summary: "OpenSSL Heartbeat 처리에서 길이 검증이 누락되어 프로세스 메모리 일부가 노출될 수 있었던 취약점입니다.",
              sourcePdfPages: [654],
              keywords: ["Heartbleed", "CVE-2014-0160", "OpenSSL", "Heartbeat", "64 KB"],
              questionKeywords: ["Heartbleed", "하트 블리드", "CVE-2014-0160", "Heartbeat"],
              blocks: [
                { type: "text", title: "취약점 원리", paragraphs: ["Heartbeat 요청에 선언된 길이와 실제 전송 데이터 길이를 충분히 검증하지 않아, 서버가 요청 페이로드보다 큰 메모리 영역을 응답에 포함할 수 있었습니다. 교재는 최대 64KB의 데이터가 노출될 수 있다고 설명합니다.", "교재에 표시된 영향 버전은 OpenSSL 1.0.1~1.0.1f와 1.0.2-beta 계열이며, 완화 버전 예로 1.0.1g 및 1.0.0·0.9.8을 구분합니다. 이는 교재의 역사적 버전 표기이므로 현재 배포판의 지원 상태를 나타내는 목록으로 사용하지 않습니다."] },
                { type: "table", title: "점검·대응", columns: ["항목", "교재에 제시된 대응"], rows: [
                  ["탐지", "IDS·IPS에서 Heartbeat 요청의 선언 길이와 실제 페이로드 길이 불일치를 확인"],
                  ["소스 점검", "ssl/d1_both.c 등 관련 코드를 확인하고 취약한 부분 수정"],
                  ["서비스 설정", "필요하지 않은 Heartbeat 서비스를 비활성화"],
                  ["인증서", "서버 비밀키 유출이 의심되면 인증서를 재발급"]
                ] }
              ],
              memoryPoints: ["Heartbleed는 OpenSSL Heartbeat 길이 검증 누락으로 프로세스 메모리를 읽을 수 있게 한 취약점입니다.", "탐지 핵심은 요청 길이와 실제 페이로드 길이의 불일치입니다."]
            },
            {
              id: "shellshock",
              title: "Shellshock (CVE-2014-6271)",
              summary: "Bash 환경 변수의 함수 정의를 처리하는 취약점을 이용해 후속 명령을 실행하는 공격입니다.",
              sourcePdfPages: [655, 656],
              keywords: ["Shellshock", "CVE-2014-6271", "Bash", "환경 변수", "CGI", "원격 코드 실행"],
              questionKeywords: ["Shellshock", "쉘쇼크", "CVE-2014-6271", "Bash 환경 변수"],
              blocks: [
                { type: "text", title: "공격 원리와 확인", paragraphs: ["Bash가 환경 변수에 전달된 함수 정의 뒤의 추가 문자열을 명령으로 처리할 수 있어 원격 코드 실행으로 이어질 수 있었습니다. CGI가 Bash를 호출하는 웹 서버 등에서 외부 입력이 환경 변수로 전달되는 경로가 위험해질 수 있습니다.", "교재가 제시하는 취약 버전 확인 범위는 Bash 3.0-27부터 Bash 4.2.45까지입니다. 이 버전 표기는 교재의 예시이며 설치된 운영체제 배포판의 패치 상태와 별도로 확인해야 합니다."] },
                { type: "table", title: "대응", columns: ["대응 항목", "설명"], rows: [
                  ["패치 적용", "영향받는 Bash 패키지를 보안 수정 버전으로 갱신"],
                  ["불필요 CGI 제거", "사용하지 않는 CGI 페이지와 서비스 중지"],
                  ["서버 보안 정책", "Secure OS 명령 제한, 네트워크 탐지·필터 규칙 적용"],
                  ["로그인 셸 제한", "불필요한 Bash 사용을 줄이고 필요한 경우 제한된 셸 적용"]
                ] }
              ],
              memoryPoints: ["Shellshock는 Bash 환경 변수 함수 정의의 후행 문자열이 명령으로 실행되는 취약점입니다.", "외부 요청이 Bash 환경 변수에 들어가는 CGI 경로와 미패치 Bash를 점검합니다."]
            },
            {
              id: "log4shell",
              title: "Log4Shell (CVE-2021-44228)",
              summary: "Log4j의 JNDI 조회 처리로 원격 코드 실행이 가능했던 취약점과 교재의 완화 항목을 정리합니다.",
              sourcePdfPages: [656, 657],
              keywords: ["Log4Shell", "Log4j", "CVE-2021-44228", "JNDI", "LDAP", "JndiLookup"],
              questionKeywords: ["Log4Shell", "Log4j 취약점", "JNDI", "LDAP", "CVE-2021-44228"],
              blocks: [
                { type: "text", title: "공격 흐름", paragraphs: ["취약한 Log4j 설정에서 로그에 기록된 외부 문자열의 JNDI lookup이 처리되면 LDAP 등 외부 이름 서비스와 통신하고 원격 코드 실행으로 이어질 수 있었습니다. 사용자 입력, HTTP 헤더, URL 매개변수, 로그 메시지처럼 로그에 포함되는 값이 공격 경로가 될 수 있습니다.", "교재는 로그 입력 경로, JNDI 이름 조회, 공격자 제어 원격 클래스의 실행을 주요 단계로 설명합니다."] },
                { type: "table", title: "교재의 대응 항목", columns: ["대응", "목적"], rows: [
                  ["영향 버전 패치", "교재가 제시한 분기별 수정 버전(2.17.0 이상, 2.12.3 이상, 2.3.1 이상 등)을 적용"],
                  ["JNDI 접근 차단", "LDAP 등 불필요한 외부 JNDI 통신을 제한"],
                  ["JndiLookup 제거·비활성화", "설정 또는 라이브러리에서 취약한 lookup 경로를 비활성화"],
                  ["입력 검증·로그 최소화", "검증되지 않은 입력의 로그 처리와 불필요한 헤더 기록을 줄임"],
                  ["IPS·WAF 점검", "외부에서 유입되는 공격 문자열 탐지·차단"]
                ] }
              ],
              memoryPoints: ["Log4Shell은 Log4j의 JNDI lookup과 LDAP 등 외부 조회 경로가 악용된 취약점입니다.", "패치와 JNDI 차단·비활성화, 입력·로그 통제가 함께 필요합니다."]
            },
            {
              id: "stuxnet",
              title: "Stuxnet (CVE-2010-2568)",
              summary: "Windows 바로가기 처리 취약점 등으로 산업 제어 환경에 침투해 PLC 동작을 겨냥한 악성코드 사례입니다.",
              sourcePdfPages: [657, 659],
              keywords: ["Stuxnet", "CVE-2010-2568", "SCADA", "PLC", "산업 제어 시스템"],
              questionKeywords: ["스턱스넷", "Stuxnet", "CVE-2010-2568", "SCADA", "PLC"],
              blocks: [
                { type: "text", title: "공격 대상과 취약점", paragraphs: ["Stuxnet은 PLC와 SCADA 기반 산업 제어 시스템을 겨냥한 악성코드 사례입니다. 교재는 CVE-2010-2568 Windows 바로가기 처리 취약점을 이용해 DLL을 로드시키는 경로를 설명합니다. PLC는 산업 장비의 동작과 순서를 제어하는 장치입니다."] },
                { type: "table", title: "산업 제어 환경의 대응", columns: ["대응", "목적"], rows: [
                  ["Windows·SCADA 보안 패치", "바로가기 처리 등 알려진 취약점 악용 차단"],
                  ["전용 백신과 매체 통제", "악성코드 탐지와 USB 등 이동식 저장 매체 반입 절차 강화"],
                  ["네트워크 분리·공유 제한", "산업망과 사무망의 불필요한 연결 및 파일 공유 차단"],
                  ["산업 특화 통제", "산업용 방화벽, 단방향 게이트웨이 등으로 제어망 경계 보호"]
                ] }
              ],
              memoryPoints: ["Stuxnet은 산업 제어 환경의 PLC·SCADA를 겨냥했고 CVE-2010-2568이 연관됩니다.", "일반 IT 패치뿐 아니라 산업망 분리와 이동식 매체 통제도 필요합니다."]
            },
            {
              id: "poodle",
              title: "POODLE (CVE-2014-3566)",
              summary: "SSL 3.0의 CBC 패딩 처리 취약성을 악용해 암호화된 통신의 일부를 복구할 수 있었던 다운그레이드 공격입니다.",
              sourcePdfPages: [659],
              keywords: ["POODLE", "CVE-2014-3566", "SSL 3.0", "CBC", "TLS_FALLBACK_SCSV"],
              questionKeywords: ["POODLE", "CVE-2014-3566", "SSL 3.0", "CBC 패딩"],
              blocks: [
                { type: "text", title: "공격 원리", paragraphs: ["POODLE은 TLS 협상 실패 뒤 취약한 SSL 3.0으로 연결이 낮아지는 상황과 CBC 패딩 오라클을 이용합니다. 공격자는 반복 요청과 패딩 오류 응답을 관찰해 암호화된 통신의 일부를 추측할 수 있습니다."] },
                { type: "table", title: "교재의 대응", columns: ["대응", "설명"], rows: [
                  ["SSL 3.0 비활성화", "취약한 프로토콜로 협상되지 않도록 설정"],
                  ["TLS_FALLBACK_SCSV", "강제적인 프로토콜 다운그레이드 시도를 탐지·거부"]
                ] }
              ],
              memoryPoints: ["POODLE은 SSL 3.0 다운그레이드와 CBC 패딩 오라클을 이용합니다.", "SSL 3.0을 끄고 TLS_FALLBACK_SCSV로 강제 하향 협상을 방지합니다."]
            },
            {
              id: "drown",
              title: "DROWN (CVE-2016-0800)",
              summary: "SSLv2와 약한 RSA 내보내기 암호 구성을 악용해 TLS 연결 정보를 복호화할 수 있었던 공격입니다.",
              sourcePdfPages: [659],
              keywords: ["DROWN", "CVE-2016-0800", "SSLv2", "RSA", "TLS"],
              questionKeywords: ["DROWN", "CVE-2016-0800", "SSLv2", "RSA"],
              blocks: [
                { type: "text", title: "공격 개요와 방어", paragraphs: ["교재는 DROWN을 오래되었거나 약화된 RSA 암호화를 이용해 TLS 연결의 비밀 정보를 추측·복호화하고 통신 내용을 읽을 수 있는 공격으로 설명합니다. SSLv2 서비스가 켜져 있거나 동일 키를 취약한 서비스에서 재사용하는 환경이 위험 요인이 됩니다.", "SSLv2와 수출용 RSA 암호군을 비활성화하고 서버 간 동일 개인키 공유 여부를 점검합니다."] }
              ],
              memoryPoints: ["DROWN은 구형 SSLv2·약한 RSA 설정을 통해 TLS 암호문을 복호화하는 공격입니다.", "SSLv2와 수출용 RSA 암호군을 끄고 개인키 재사용을 점검합니다."]
            }
          ]
        },
        {
          id: "application-secure-development",
          chapter: "애플리케이션 보안 취약점",
          status: "published",
          title: "안전한 소프트웨어 개발",
          summary: "개발 단계의 입력 검증·보안 기능·오류 처리 약점을 점검하고 서버 측 방어 원칙을 학습합니다.",
          sourcePdfPages: [663, 665],
          concepts: [
            {
              id: "secure-development-input-validation",
              title: "입력 데이터 검증과 표현",
              summary: "외부 입력이 질의·경로·명령·템플릿으로 해석되지 않도록 검증·인코딩합니다.",
              sourcePdfPages: [663, 664],
              keywords: ["입력값 검증", "SQL Injection", "Path Traversal", "SSRF", "SSTI", "XML Injection"],
              questionKeywords: ["입력데이터 검증", "경로조작", "파일 업로드", "SSRF", "SSTI", "XML 삽입"],
              blocks: [
                { type: "text", title: "보안 약점 유형", paragraphs: ["교재의 입력 데이터 검증·표현 분류에는 SQL 삽입, 경로 조작 및 자원 삽입, 위험한 형식 파일 업로드, XSS, CSRF, 운영체제 명령어 삽입, SSRF, XML 삽입, 서버·클라이언트 측 템플릿 삽입(SSTI·CSTI)이 포함됩니다."] },
                { type: "table", title: "안전한 입력 처리", columns: ["원칙", "적용"], rows: [
                  ["특수문자 필터링", "HTML·JavaScript·SQL·운영체제 명령에서 쓰이는 <, >, 따옴표, 세미콜론, 앰퍼샌드 등의 입력을 필터링"],
                  ["서버 측 검증", "쿠키·환경 변수·매개변수 등 외부 입력값은 보안 기능에 사용하기 전 제한적으로 검증"],
                  ["검증 위치", "입력값 검증은 반드시 서버에서 수행하고 클라이언트 측 검증은 보조 수단으로 사용"]
                ] }
              ],
              memoryPoints: ["입력 검증은 반드시 서버 측에서 수행하며 클라이언트 검증은 보조 수단입니다.", "입력값이 SQL·명령·경로·템플릿으로 해석되지 않게 문맥별로 검증·인코딩합니다."]
            },
            {
              id: "secure-development-security-functions",
              title: "보안 기능 구현의 약점",
              summary: "인증·인가·암호화·권한 관리 구현 오류와 민감정보 노출을 예방합니다.",
              sourcePdfPages: [664, 665],
              keywords: ["부적절한 인가", "평문 전송", "하드코딩", "주석문", "접근제어"],
              questionKeywords: ["보안 기능 보안약점", "하드코딩된 중요정보", "암호화되지 않은 중요정보", "부적절한 인가"],
              blocks: [
                { type: "table", title: "보안 기능 약점", columns: ["약점", "점검·대응"], rows: [
                  ["부적절한 인가", "중요 자원 접근마다 서버에서 사용자 역할과 객체 권한을 확인"],
                  ["암호화되지 않은 중요정보", "비밀번호·개인정보를 저장하거나 전송할 때 안전한 암호화와 통신 채널 사용"],
                  ["하드코딩된 중요정보", "소스에 비밀번호·암호화 키를 직접 기록하지 않고 보호된 비밀 관리 수단 이용"],
                  ["주석문 속 시스템 정보", "배포 전 주석과 HTML 소스에서 인증 정보·개인정보 제거"]
                ] },
                { type: "text", title: "민감정보 처리", paragraphs: ["권한 결정에 쓰이는 정보는 서버에서 관리합니다. 중요 상태·인증 정보가 쿠키로 전달되어야 한다면 변조와 노출을 막고, 화면에는 주민등록번호·비밀번호 등 민감 값을 마스킹합니다."] }
              ],
              memoryPoints: ["인가와 권한 판단은 클라이언트가 아니라 서버에서 수행합니다.", "비밀번호·키를 코드나 주석에 두지 않고 중요정보를 평문으로 저장·전송하지 않습니다."]
            },
            {
              id: "secure-development-error-handling",
              title: "오류 처리와 예외 처리",
              summary: "상세 오류 정보 노출, 오류 상황 방치와 부적절한 예외 처리를 예방합니다.",
              sourcePdfPages: [665],
              keywords: ["오류 메시지", "디버깅 정보", "예외 처리", "정보 노출", "일반화된 오류"],
              questionKeywords: ["에러 처리 보안약점", "오류 메시지 정보 노출", "부적절한 예외 처리"],
              blocks: [
                { type: "table", title: "오류 처리 약점과 대책", columns: ["약점", "대응"], rows: [
                  ["오류 메시지 정보 노출", "내부 경로·스택·계정 존재 여부 등은 숨기고 일반화된 사용자 메시지 제공"],
                  ["오류 상황 대응 부재", "실패와 자원 오류를 명시적으로 처리해 비정상 종료 방지"],
                  ["부적절한 예외 처리", "예상 예외를 구체적으로 처리하고 안전하게 실패하도록 설계"],
                  ["개발자 디버그 정보 노출", "운영 배포물에서 디버그 메시지를 제거하고 상세 정보는 보호된 로그에 기록"]
                ] }
              ],
              memoryPoints: ["사용자에게는 일반화된 오류를 보여 주고 상세 디버그 정보는 노출하지 않습니다.", "오류를 방치하지 말고 예외 상황을 안전하게 처리합니다."]
            }
          ]
        },
        {
          id: "application-ecommerce-electronic-cash",
          chapter: "전자상거래 보안",
          status: "published",
          title: "전자지불 시스템과 전자화폐",
          summary: "전자화폐의 안전성 요건, 분류와 IC 카드·네트워크형 사례 및 거래 프로토콜을 학습합니다.",
          sourcePdfPages: [670, 673],
          concepts: [
            {
              id: "electronic-payment-system",
              title: "전자지불 시스템의 분류",
              summary: "네트워크상에서 상품·서비스 대금을 전자적으로 지불하는 시스템의 두 구조를 구분합니다.",
              sourcePdfPages: [670],
              keywords: ["Electronic Payment System", "전자화폐 시스템", "Digital Currency System", "Payment Broker System"],
              questionKeywords: ["전자지불 시스템", "전자화폐 시스템", "지불 브로커 시스템"],
              blocks: [
                { type: "text", title: "정의", paragraphs: ["전자지불 시스템은 현금·수표·신용카드와 같은 지불 수단을 네트워크 환경에서 디지털 형태로 이용해 상품 구매와 서비스 이용 대금을 전자적으로 처리하는 시스템입니다."] },
                { type: "table", title: "큰 분류", columns: ["시스템", "특징"], rows: [
                  ["전자화폐 시스템", "지불 브로커 없이 독립적인 신용 구조를 가지며 현금과 유사한 전자적 지불 수단"],
                  ["지불 브로커 시스템", "사용자·상점 사이 거래에 지불 브로커가 등록·중개 역할을 수행하는 전자 지불 구조"]
                ] }
              ],
              memoryPoints: ["전자지불 시스템은 전자화폐 시스템과 지불 브로커 시스템으로 나뉩니다.", "전자화폐는 독립적인 가치 수단이고 지불 브로커는 거래 중개자가 있습니다."]
            },
            {
              id: "electronic-cash-security",
              title: "전자화폐의 안전성 요구사항",
              summary: "전자화폐의 재사용·위조 방지, 독립성, 양도·오프라인·분할 사용과 익명성을 정리합니다.",
              sourcePdfPages: [670, 671],
              keywords: ["N-Spendability", "이중 사용 방지", "Transferability", "Divisibility", "익명성", "익명성 취소"],
              questionKeywords: ["전자화폐 안전성", "N회 사용가능성", "이중 사용 방지", "분할성", "익명성 취소 가능"],
              blocks: [
                { type: "table", title: "안전성 요구사항", columns: ["요구사항", "의미"], rows: [
                  ["N회 사용 가능성", "전자화폐를 여러 번 나누어 사용할 수 있음"],
                  ["이중 사용 방지", "화폐 복사·위조로 같은 가치를 중복 사용하는 행위를 방지"],
                  ["독립성", "물리적 매체에 의존하지 않고 디지털 데이터 자체가 가치를 보유"],
                  ["양도성", "다른 상점·제3자에서 사용할 수 있고 다른 사람에게 가치를 이전"],
                  ["오프라인성", "은행에 접속하지 않고 사용자와 상점 사이에서 거래 가능"],
                  ["분할성", "합계가 액면 금액이 될 때까지 가치를 나누어 사용"],
                  ["익명성", "구매 정보 등 이용자의 거래 프라이버시를 보호"],
                  ["익명성 취소 가능성", "불법 사용이 의심되는 경우 공정한 기관의 명령으로 사용자를 식별"]
                ] }
              ],
              memoryPoints: ["복사·위조에 의한 이중 사용을 막으면서 양도·분할·오프라인 사용을 지원해야 합니다.", "익명성은 프라이버시를 보호하고 익명성 취소 가능성은 부정 사용 조사와 연결됩니다."]
            },
            {
              id: "electronic-cash-classification",
              title: "전자화폐의 분류와 시스템 사례",
              summary: "지불 시점·거래 매체·유통 형태·온라인 여부와 대표 전자화폐 시스템을 비교합니다.",
              sourcePdfPages: [671, 672],
              keywords: ["Mondex", "Visa Cash", "PC Pay", "E-Cash", "NetCash", "Payme", "Millicent"],
              questionKeywords: ["전자화폐 분류", "Mondex", "Visa Cash", "PC Pay", "E-Cash", "NetCash", "Millicent"],
              blocks: [
                { type: "table", title: "분류 기준", columns: ["기준", "분류"], rows: [
                  ["지불 시점", "선불형 / 후불형"],
                  ["거래 매체", "IC 카드(가치 저장형) / 네트워크형"],
                  ["유통 형태", "폐쇄형 / 개방형"],
                  ["지불 방식", "온라인 / 오프라인"]
                ] },
                { type: "table", title: "교재의 시스템 사례", columns: ["형태", "시스템", "설명"], rows: [
                  ["IC 카드", "Mondex", "IC 카드에 가치를 저장하고 오프라인 거래와 잔액 이전을 지원하는 사례"],
                  ["IC 카드", "Visa Cash", "Visa에서 만든 선불형 IC 카드 전자화폐"],
                  ["IC 카드", "PC Pay", "소프트웨어 지갑과 카드 리더를 이용하는 전자화폐"],
                  ["네트워크", "E-Cash", "DigiCash 계열의 전자화폐로 온라인에서 익명성 보호에 blind signature 활용"],
                  ["네트워크", "NetCash", "전자수표 교환이 가능한 Currency Server 기반 전자화폐"],
                  ["네트워크", "Payme", "대칭·비대칭키 암호를 사용하는 네트워크형 전자화폐"],
                  ["네트워크", "Millicent", "1997년 Digital Equipment Corporation에서 개발한 스크립 기반 전자화폐"]
                ] }
              ],
              memoryPoints: ["IC 카드형은 가치를 카드에 저장하고 네트워크형은 인터넷으로 가치를 주고받습니다.", "E-Cash는 blind signature를 이용한 익명성, NetCash는 Currency Server 사례로 기억합니다."]
            },
            {
              id: "electronic-cash-protocols",
              title: "전자화폐의 인출·지불·예치",
              summary: "사용자·상점·금융기관 사이에서 전자화폐가 발급되고 사용된 뒤 정산되는 흐름을 설명합니다.",
              sourcePdfPages: [672, 673],
              keywords: ["Withdrawal Protocol", "Payment Protocol", "Deposit Protocol", "전자화폐 프로토콜"],
              questionKeywords: ["전자화폐 프로토콜", "인출 프로토콜", "예치 프로토콜", "지불 프로토콜"],
              blocks: [
                { type: "table", title: "프로토콜 흐름", columns: ["단계", "참여자·동작"], rows: [
                  ["인출(Withdrawal)", "사용자가 금융기관에 요청하고 전자화폐를 발급받음"],
                  ["지불(Payment)", "사용자가 구매 대금으로 전자화폐를 상점에 전달"],
                  ["예치(Deposit)", "상점이 받은 전자화폐를 금융기관에 보내 결제·정산"]
                ] },
                { type: "text", title: "역할 구분", paragraphs: ["인출과 지불은 사용자와 금융기관 또는 사용자와 상점 사이에서 처리되며, 예치는 상점과 금융기관 사이의 정산 절차입니다."] }
              ],
              memoryPoints: ["사용자가 돈을 받아 쓰는 단계가 인출, 상점에 지급하는 단계가 지불, 상점의 정산 단계가 예치입니다."]
            }
          ]
        },
        {
          id: "application-ecommerce-payment-broker-set",
          chapter: "전자상거래 보안",
          status: "published",
          title: "지불 브로커와 SET",
          summary: "전자지불 요구사항, SET의 보안 기술·참여자와 카드 승인 흐름을 익힙니다.",
          sourcePdfPages: [673, 676],
          concepts: [
            {
              id: "payment-broker-systems",
              title: "지불 브로커 시스템과 유형",
              summary: "브로커가 거래 정보를 중개하는 카드·전자수표 시스템의 특징을 비교합니다.",
              sourcePdfPages: [673],
              keywords: ["Payment Broker", "SET", "First Virtual", "NetCheque", "Echeck", "PG"],
              questionKeywords: ["지불 브로커 시스템", "First Virtual", "NetCheque", "Echeck", "PG"],
              blocks: [
                { type: "text", title: "특징", paragraphs: ["지불 브로커 시스템은 사용자와 판매자 사이에서 지불 등록·중계와 카드 결제 처리를 돕습니다. 실물 화폐를 완전히 대체하지 않으며 결제 정보가 브로커를 거치므로 프라이버시와 기밀정보 노출에 주의해야 합니다."] },
                { type: "table", title: "교재의 유형", columns: ["종류", "시스템", "교재의 설명"], rows: [
                  ["신용카드", "SET", "공개 네트워크에서 신용카드 거래를 안전하게 하는 VISA·MasterCard 공동 개발 프로토콜"],
                  ["신용카드", "First Virtual", "카드번호를 인터넷으로 보내지 않고 전자우편으로 구매 의사를 확인"],
                  ["전자수표", "NetCheque", "캘리포니아 대학에서 개발하고 Kerberos 기반으로 수표를 결제"],
                  ["전자수표", "Echeck", "FSTC 프로젝트로 개발된 전자수표 시스템"]
                ] }
              ],
              memoryPoints: ["지불 브로커 시스템은 중개자와 결제망이 거래를 처리합니다.", "SET·First Virtual은 카드 결제, NetCheque·Echeck는 전자수표 사례입니다."]
            },
            {
              id: "electronic-payment-requirements",
              title: "전자지불 시스템의 보안 요구사항",
              summary: "거래 상대 확인, 전송 정보 보호, 문서 무결성·부인 방지와 접근 통제를 요구합니다.",
              sourcePdfPages: [674],
              keywords: ["전자지불 보안", "신원 확인", "비밀유지", "무결성", "부인방지", "접근통제"],
              questionKeywords: ["전자지불 시스템 기술 요건", "거래 상대방 신원 확인", "전자문서 위변조", "부인 방지"],
              blocks: [
                { type: "table", title: "보안 요구사항", columns: ["요구사항", "목적"], rows: [
                  ["거래 상대방의 신원 확인", "상대가 실제로 주장하는 회사·사용자인지 확인"],
                  ["전송 내용의 비밀 유지", "카드번호·계좌·주문 정보 등 중요 내용의 외부 노출 방지"],
                  ["전자문서 위·변조 확인과 부인 방지", "거래 문서가 조작되지 않았는지 확인하고 거래 사실 부인 방지"],
                  ["거래 정보 접근 통제", "허가받은 사람에게만 거래 정보 접근 허용"]
                ] }
              ],
              memoryPoints: ["전자지불은 신원 확인·비밀 유지·무결성·부인 방지·접근 통제를 요구합니다.", "온라인 결제의 카드·계좌 정보가 전송 과정에서 노출되지 않도록 보호합니다."]
            },
            {
              id: "set-security-features",
              title: "SET의 전자봉투와 이중서명",
              summary: "SET이 결제 정보의 기밀성과 주문·결제 문서의 결합을 보호하는 방식을 학습합니다.",
              sourcePdfPages: [674],
              keywords: ["SET", "Secure Electronic Transaction", "Digital Envelope", "Dual Signature", "RSA"],
              questionKeywords: ["SET", "전자봉투", "이중서명", "Dual Signature", "디지털 서명"],
              blocks: [
                { type: "text", title: "프로토콜", paragraphs: ["SET(Secure Electronic Transaction)은 VISA와 MasterCard가 신용카드 기반 인터넷 결제를 안전하게 하기 위해 마련한 전자 결제 보안 프로토콜입니다. 전자봉투와 이중서명 기술을 사용해 거래 사기를 줄이고 상점에 지불 정보를 직접 노출하는 문제를 완화합니다."] },
                { type: "table", title: "장점과 단점", columns: ["장점", "단점"], rows: [
                  ["전자 거래 사기 방지", "암호 프로토콜이 복잡"],
                  ["기존 신용카드 기반 활용", "RSA 연산으로 처리 속도가 저하"],
                  ["상점에 지불 정보 노출 완화", "카드소지자 전자지갑과 상점·지불 게이트웨이 소프트웨어 필요"]
                ] },
                { type: "text", title: "두 보안 기술", paragraphs: ["전자봉투는 문서 내용을 암호화해 지정된 수신자만 열 수 있게 하고, 발신자의 전자서명과 별도로 문서의 비밀성을 보호합니다. 이중서명은 주문 정보와 결제 정보를 함께 확인하되 각 당사자에게 필요한 부분만 보이게 하는 방식입니다."] }
              ],
              memoryPoints: ["SET은 전자봉투와 이중서명을 사용합니다.", "전자봉투는 기밀성, 이중서명은 주문·결제 정보의 결합과 노출 범위 통제에 연결됩니다."]
            },
            {
              id: "set-participants-and-flow",
              title: "SET 참여자와 거래 절차",
              summary: "카드소지자·가맹점·PG·매입사·발행자·인증기관의 역할과 8단계 결제를 연결합니다.",
              sourcePdfPages: [675, 676],
              keywords: ["Merchant", "Acquirer", "Payment Gateway", "Certification Authority", "Cardholder", "Issuer", "SET"],
              questionKeywords: ["SET 구성 요소", "SET 동작 절차", "매입사", "발행자", "인증기관", "Payment Gateway"],
              blocks: [
                { type: "table", title: "SET 구성 요소", columns: ["참여자", "역할"], rows: [
                  ["판매자·가맹점(Merchant)", "상품·서비스를 판매하고 고객 주문을 처리"],
                  ["매입사(Acquirer)", "가맹점 계약을 맺고 판매자의 카드 승인·지불 처리를 지원"],
                  ["지급정보 중계기관(PG)", "판매자 요청을 금융기관에 전달하고 승인·결제 정보를 중계"],
                  ["인증기관(CA)", "SET 참여자에게 공개키 인증서를 발급"],
                  ["고객·카드소지자(Cardholder)", "발급받은 카드로 인터넷에서 상품을 구매"],
                  ["발행자(Issuer)", "고객에게 카드를 발급하고 계정을 관리하며 고객의 적법성을 확인"]
                ] },
                { type: "table", title: "SET 거래 절차", columns: ["순서", "단계", "요약"], rows: [
                  ["1", "인증서 수신", "고객이 쇼핑몰에 접속해 판매자·PG 인증서를 받음"],
                  ["2", "구매 요청", "판매자 인증서를 확인하고 주문·결제 정보와 고객 인증서를 전달"],
                  ["3", "응답 수신", "판매자가 고객 인증서를 확인하고 구매 응답을 전달"],
                  ["4", "승인 요청", "PG가 인증서를 확인한 뒤 금융기관에 내부 형식으로 승인 요청"],
                  ["5", "승인 전송", "금융기관이 신용한도를 고려해 승인 결과를 전달"],
                  ["6", "SET 변환", "PG가 결제 전문을 SET 형식으로 변환해 판매자에게 전달"],
                  ["7", "물품 인도", "판매자가 승인 응답을 확인하고 영수증과 상품을 제공"],
                  ["8", "결제 처리", "PG가 판매자와 고객 은행 사이의 정상 거래를 정산"]
                ] }
              ],
              memoryPoints: ["CA는 인증서를 발급하고 Issuer는 고객 계정·카드를 관리하며 PG는 승인·결제를 중계합니다.", "SET 흐름은 인증서 확인, 구매·승인 요청과 응답, SET 변환, 물품 인도, 결제 처리로 이어집니다."]
            }
          ]
        },
        {
          id: "application-ecommerce-documents",
          chapter: "전자상거래 보안",
          status: "published",
          title: "전자문서와 ebXML",
          summary: "EDI·XML·ebXML 문서 교환과 기업 간 전자거래 프레임워크 구성 요소를 익힙니다.",
          sourcePdfPages: [676, 678],
          concepts: [
            {
              id: "electronic-documents-edi-xml",
              title: "전자문서·EDI와 XML",
              summary: "전자문서의 정의와 기업 간 업무 문서를 표준 형식으로 교환하는 기술을 구분합니다.",
              sourcePdfPages: [676, 677],
              keywords: ["전자문서", "EDI", "UN/EDIFACT", "XML/EDI", "XML"],
              questionKeywords: ["전자문서", "EDI", "XML/EDI", "XML", "UN/EDIFACT"],
              blocks: [
                { type: "text", title: "전자문서", paragraphs: ["전자문서는 정보처리시스템에 의해 전자적 형태로 작성·송신·수신 또는 저장된 정보입니다."] },
                { type: "table", title: "문서 교환 유형", columns: ["유형", "특징"], rows: [
                  ["EDI (Electronic Data Interchange)", "주문서·납품서·청구서 등 거래 문서를 표준화해 컴퓨터 통신으로 기업 간 직접 교환"],
                  ["XML/EDI", "EDI로 교환한 데이터를 XML 기반 업무 프로세스에 적용할 수 있게 연결"],
                  ["XML", "구조화된 문서를 웹에서 전송·저장·교환하는 표준으로, SGML의 확장성과 HTML의 사용성을 결합"],
                  ["UN/EDIFACT", "UN 주도로 만든 국제 전자문서 교환 통신 표준"]
                ] }
              ],
              memoryPoints: ["EDI는 기업 간 표준 거래 문서의 전자 교환입니다.", "전자문서는 거래 데이터의 위조·변조와 부인 방지 요구를 함께 고려합니다."]
            },
            {
              id: "electronic-transaction-and-ebxml",
              title: "전자거래와 ebXML",
              summary: "전자문서를 통해 전부 또는 일부가 처리되는 거래와 기업 간 상호운용 프레임워크를 학습합니다.",
              sourcePdfPages: [677],
              keywords: ["전자거래", "ebXML", "UN/CEFACT", "OASIS"],
              questionKeywords: ["전자거래", "ebXML", "UN/CEFACT", "OASIS"],
              blocks: [
                { type: "text", title: "전자거래", paragraphs: ["전자거래는 재화나 용역을 거래할 때 거래의 전부 또는 일부가 전자문서에 의해 처리되는 거래입니다."] },
                { type: "text", title: "ebXML", paragraphs: ["ebXML(e-business XML)은 UN/CEFACT와 OASIS가 표준화한 기업 간 전자상거래 프레임워크입니다. 기업의 규모나 지역에 관계없이 인터넷으로 거래할 수 있도록 메시지 교환과 비즈니스 프로세스 정의·등록 등 규약을 제공합니다."] }
              ],
              memoryPoints: ["ebXML은 특정 XML 문서 하나가 아니라 기업 간 전자상거래를 위한 규약·프레임워크입니다.", "UN/CEFACT와 OASIS가 표준화를 주도했습니다."]
            },
            {
              id: "ebxml-components",
              title: "ebXML 구성 요소",
              summary: "비즈니스 프로세스·핵심 컴포넌트·등록저장소·거래 파트너 프로파일과 협약을 구별합니다.",
              sourcePdfPages: [678],
              keywords: ["ebXML", "BP", "CC", "RR", "CPP", "CPA", "Registry", "Repository"],
              questionKeywords: ["ebXML 구성 요소", "BP", "CC", "RR", "CPP", "CPA", "등록저장소"],
              blocks: [
                { type: "table", title: "구성 요소", columns: ["구성 요소", "역할"], rows: [
                  ["BP (Business Process)", "시스템이 인식할 수 있도록 표준화해 명세한 비즈니스 거래 절차"],
                  ["CC (Core Components)", "전자 메시지를 이루는 재사용 가능한 표준 데이터 항목"],
                  ["RR (Registry/Repository)", "거래 당사자가 제출한 정보와 비즈니스 메타데이터를 저장·검색"],
                  ["Registry", "서비스·메타데이터 등 색인 정보를 보관"],
                  ["Repository", "거래 당사자가 제출한 정보와 문서를 안전하게 저장"],
                  ["CPP (Collaboration Protocol Profile)", "거래 당사자의 비즈니스 프로세스와 제안 프로토콜을 기술하는 프로파일"],
                  ["CPA (Collaboration Protocol Agreement)", "거래 파트너 간 CPP 내용을 바탕으로 만든 협업 프로토콜 합의"]
                ] },
                { type: "text", title: "거래 연결", paragraphs: ["기업 시스템은 BP·CPP·CPA 등 거래 정보를 등록저장소와 교환하고, 메시징 서비스(CC·TR 등)를 통해 제조사와 공급사 시스템 사이에서 표준 메시지를 교환합니다."] }
              ],
              memoryPoints: ["CPP는 거래 파트너의 프로파일, CPA는 파트너 사이의 협약입니다.", "Registry는 검색을 위한 등록·색인, Repository는 제출된 문서·정보의 저장소입니다."]
            }
          ]
        }
      ]
    },
    {
      id: "information-security-general",
      title: "정보보안 일반",
      description: "암호학, 인증, 접근통제와 전자서명 등 정보보안 일반 과목을 교재 순서로 학습합니다.",
      units: [
        {
          id: "general-cryptography-foundations",
          chapter: "암호학",
          status: "published",
          title: "암호학과 암호 시스템",
          summary: "암호학의 목적, 암호 시스템 구성 요소·관계자와 안전성·통신 채널을 이해합니다.",
          sourcePdfPages: [696, 698],
          concepts: [
            {
              id: "cryptography-and-cryptosystem",
              title: "암호학과 암호 시스템 구성 요소",
              summary: "평문을 키와 알고리즘으로 암호문으로 변환하고 복호화하는 기본 표기와 요소를 학습합니다.",
              sourcePdfPages: [696, 697],
              keywords: ["Cryptography", "Cryptosystem", "Plaintext", "Ciphertext", "Encryption", "Decryption"],
              questionKeywords: ["암호 시스템 구성 요소", "평문", "암호문", "암호화 키", "복호화 키"],
              blocks: [
                { type: "text", title: "암호학", paragraphs: ["암호학은 정보를 보호하기 위한 언어학적·수학적 방법론을 다루는 학문입니다. 암호 시스템은 데이터의 기밀성·무결성·인증 등을 보호하도록 설계된 암호화 기술과 관련된 시스템입니다."] },
                { type: "table", title: "기호와 의미", columns: ["요소", "기호", "설명"], rows: [
                  ["평문(Plaintext)", "P", "암호화 전의 원본 데이터이며 보호할 대상"],
                  ["암호문(Ciphertext)", "C", "평문을 암호화해 얻은 데이터"],
                  ["암호화 알고리즘", "E", "키를 사용해 평문을 암호문으로 변환"],
                  ["복호화 알고리즘", "D", "키를 사용해 암호문에서 평문을 복원"],
                  ["암호화 키", "e", "암호화 연산에 사용하는 키"],
                  ["복호화 키", "d", "복호화 연산에 사용하는 키"]
                ] },
                { type: "text", title: "키 관계", paragraphs: ["대칭키 암호 시스템은 암호화 키와 복호화 키가 같고, 공개키 암호 시스템은 두 키가 다릅니다. 송신자는 암호화를 수행하고 수신자는 복호화를 수행합니다."] }
              ],
              memoryPoints: ["P는 평문, C는 암호문, E와 D는 암호화·복호화 알고리즘입니다.", "대칭키는 같은 키를, 공개키 방식은 서로 다른 키를 암·복호화에 사용합니다."]
            },
            {
              id: "cryptosystem-parties-security",
              title: "암호 시스템 관계자와 안전성",
              summary: "도청자·공격자·신뢰 중재자와 절대 안전성·계산상 안전성의 차이를 정리합니다.",
              sourcePdfPages: [697],
              keywords: ["Eavesdropper", "Attacker", "Trusted Arbitrator", "Unconditionally Secure", "Computationally Secure"],
              questionKeywords: ["암호 시스템 관계자", "도청자", "공격자", "신뢰할 수 있는 중재자", "계산상 안전성"],
              blocks: [
                { type: "table", title: "관계자", columns: ["관계자", "역할"], rows: [
                  ["도청자(Eavesdropper)", "암호문이나 통신을 엿듣는 제3자"],
                  ["공격자(Attacker)", "암호 시스템의 약점을 찾아 분석·해독을 시도하는 주체"],
                  ["악의적 공격자(Malicious Attacker)", "악의적인 목적을 가진 공격자"],
                  ["신뢰할 수 있는 중재자(Trusted Arbitrator)", "참여자 사이에서 신뢰가 필요한 절차를 중재하는 제3자"]
                ] },
                { type: "table", title: "안전성 기준", columns: ["종류", "설명"], rows: [
                  ["절대 안전성(Unconditionally Secure)", "정보이론적 관점에서 암호문만으로 평문 정보를 얻을 수 없는 안전성"],
                  ["계산상 안전성(Computationally Secure)", "해독에 필요한 계산 시간이 정보의 유효 기간을 넘거나 현실적인 자원으로 해독하기 어려운 안전성"]
                ] }
              ],
              memoryPoints: ["절대 안전성은 이론적 정보 보호, 계산상 안전성은 현실적인 계산 자원·시간을 기준으로 합니다.", "공격자와 도청자는 암호 시스템을 위협하는 제3자이며 역할의 범위가 다릅니다."]
            },
            {
              id: "cryptosystem-channel-forward-secrecy",
              title: "암호 통신 채널과 완전 순방향 비밀성",
              summary: "안전·비안전 채널을 구분하고 세션 키 노출이 과거 통신에 미치지 않도록 하는 PFS를 설명합니다.",
              sourcePdfPages: [698],
              keywords: ["Secure Channel", "Insecure Channel", "PFS", "Perfect Forward Secrecy", "Session Key"],
              questionKeywords: ["암호 시스템 채널", "안전한 채널", "완전 순방향 비밀성", "PFS"],
              blocks: [
                { type: "table", title: "채널 종류", columns: ["종류", "설명"], rows: [
                  ["안전한 채널(Secure Channel)", "외부 도청·변조로부터 보호되고 인증된 참여자 사이에 안전하게 데이터를 교환"],
                  ["안전하지 않은 채널(Insecure Channel)", "보안 조치가 적용되지 않은 통신 경로"]
                ] },
                { type: "text", title: "PFS", paragraphs: ["완전 순방향 비밀성(PFS)은 장기 비밀키가 나중에 노출되어도 과거 통신에서 사용한 세션 키를 역으로 계산할 수 없도록 하는 성질입니다. 교재는 SSL/TLS 세션에서 새 키가 과거 키 정보와 수학적으로 연결되지 않는 특성을 설명합니다."] }
              ],
              memoryPoints: ["Secure Channel은 도청·변조를 막고 인증된 통신을 지원하는 채널입니다.", "PFS는 장기 키가 노출되어도 과거 세션 키와 통신 기밀성을 보호합니다."]
            }
          ]
        },
        {
          id: "general-cryptographic-attacks",
          chapter: "암호학",
          status: "published",
          title: "암호 공격과 암호 해독",
          summary: "공격자가 이용할 수 있는 평문·암호문 정보에 따른 공격 유형과 암호 분석 방법을 구분합니다.",
          sourcePdfPages: [698, 701],
          concepts: [
            {
              id: "cryptogram-attack-models",
              title: "암호 공격 모델",
              summary: "암호문 단독·알려진 평문·선택 평문·선택 암호문 공격의 공격자 능력을 비교합니다.",
              sourcePdfPages: [698, 700],
              keywords: ["COA", "KPA", "CPA", "CCA", "Ciphertext Only", "Chosen Plaintext", "Chosen Ciphertext"],
              questionKeywords: ["암호 공격 유형", "암호문 단독 공격", "알려진 평문 공격", "선택 평문 공격", "선택 암호문 공격"],
              blocks: [
                { type: "table", title: "공격자가 얻는 정보", columns: ["공격", "공격자 능력"], rows: [
                  ["암호문 단독 공격(COA)", "암호문만 가지고 평문이나 키를 추측"],
                  ["알려진 평문 공격(KPA)", "일부 평문과 이에 대응하는 암호문 쌍을 알고 암호 시스템을 분석"],
                  ["선택 평문 공격(CPA)", "선택한 평문을 암호화한 결과를 얻고 암호화 방식을 분석"],
                  ["선택 암호문 공격(CCA)", "선택한 암호문에 대응하는 복호문을 얻을 수 있는 조건에서 시스템을 분석"]
                ] },
                { type: "text", title: "공격 능력의 차이", paragraphs: ["COA에서 CCA로 갈수록 공격자가 이용할 수 있는 평문·암호문 정보가 늘어납니다. 공격 모델은 암호 시스템을 검증할 때 공격자에게 허용된 능력과 관찰 정보를 기준으로 구분합니다."] }
              ],
              memoryPoints: ["COA는 암호문만, KPA는 평문-암호문 쌍, CPA는 선택 평문, CCA는 선택 암호문의 복호 결과를 이용합니다.", "공격 유형을 구분하는 핵심은 공격자가 미리 얻거나 선택할 수 있는 데이터입니다."]
            },
            {
              id: "cryptanalysis-methods",
              title: "암호 해독 방법과 분석 기법",
              summary: "평문 복원·키 추출·안전성 평가 목적과 전수·수학·통계·차분·선형 분석을 정리합니다.",
              sourcePdfPages: [700, 701],
              keywords: ["Cryptanalysis", "Brute Force", "Exhaustive Key Search", "Differential Cryptanalysis", "Linear Cryptanalysis"],
              questionKeywords: ["암호 해독 방법", "전수 공격", "무차별 대입", "차분 암호 분석", "선형 암호 분석"],
              blocks: [
                { type: "table", title: "해독 목표와 방법", columns: ["항목", "설명"], rows: [
                  ["평문 복원 시도", "암호문에 대응하는 원래 평문을 얻으려는 시도"],
                  ["키 추출 시도", "암호 시스템의 암호화·복호화 키를 알아내려는 시도"],
                  ["안전성 평가 시도", "시스템의 약점과 실제 해독 가능성을 평가"],
                  ["전수·무차별 공격", "가능한 키 후보를 모두 시도하는 Exhaustive Key Search"],
                  ["수학적·통계적 분석", "알고리즘의 수학적 구조나 입력·출력 통계 특성을 이용"],
                  ["차분 암호 분석", "선택 평문 공격 계열로 입력 차이가 암호문 차이에 미치는 영향을 분석"],
                  ["선형 암호 분석", "알려진 평문 공격 계열로 알고리즘의 선형 근사 관계를 이용"]
                ] }
              ],
              memoryPoints: ["전수 공격은 키 후보를 차례로 대입하고, 차분·선형 분석은 알고리즘 구조를 이용합니다.", "암호 해독은 평문 복원뿐 아니라 키 추출과 안전성 평가를 포함합니다."]
            }
          ]
        },
        {
          id: "general-cryptography-classification",
          chapter: "암호학",
          status: "published",
          title: "고전 암호와 현대 합성 암호",
          summary: "대치·전치에서 S-박스·P-박스와 확산·혼돈을 결합하는 암호 구조까지 학습합니다.",
          sourcePdfPages: [701, 704],
          concepts: [
            {
              id: "classical-substitution-transposition",
              title: "대치 암호와 전치 암호",
              summary: "문자나 비트를 다른 값으로 바꾸는 대치와 평문 순서를 바꾸는 전치를 구분합니다.",
              sourcePdfPages: [701],
              keywords: ["Substitution Cipher", "Transposition Cipher", "Caesar Cipher"],
              questionKeywords: ["대치 암호", "치환 암호", "전치 암호", "카이사르 암호"],
              blocks: [
                { type: "table", title: "고전 암호 방식", columns: ["방식", "변환"], rows: [
                  ["대치(Substitution)", "비트·문자·문자 블록을 다른 기호나 값으로 대체"],
                  ["전치(Transposition)", "평문의 문자 위치를 재배열해 암호문 생성"]
                ] },
                { type: "text", title: "카이사르 암호", paragraphs: ["카이사르 암호는 알파벳의 각 문자를 일정한 거리만큼 이동해 다른 문자로 치환하는 대치 암호의 예입니다."] }
              ],
              memoryPoints: ["대치는 기호를 바꾸고 전치는 기호의 위치를 바꿉니다.", "카이사르 암호는 일정한 알파벳 이동을 쓰는 대치 방식입니다."]
            },
            {
              id: "modern-s-p-boxes",
              title: "S-박스·P-박스와 확산·혼돈",
              summary: "치환·순열 계층과 확산·혼돈을 반복 적용해 평문·키의 통계적 관계를 감춥니다.",
              sourcePdfPages: [701, 703],
              keywords: ["S-box", "P-box", "Diffusion", "Confusion", "Round"],
              questionKeywords: ["S-박스", "P-박스", "확산", "혼돈", "라운드"],
              blocks: [
                { type: "table", title: "현대 암호 구성", columns: ["요소", "기능"], rows: [
                  ["S-박스(Substitution Box)", "입력 비트열을 치환 등 비선형 변환으로 다른 비트열에 대응"],
                  ["P-박스(Permutation Box)", "비트의 위치와 배열을 바꾸는 순열 변환"],
                  ["확산(Diffusion)", "평문의 작은 변화가 암호문 여러 위치에 퍼지도록 통계 구조를 약화"],
                  ["혼돈(Confusion)", "암호문과 키 사이의 관계를 복잡하고 예측하기 어렵게 만듦"],
                  ["라운드(Round)", "암·복호화 핵심 함수를 반복 적용하는 단위"]
                ] },
                { type: "text", title: "라운드 수", paragraphs: ["라운드 수가 많아지면 반복 연산이 늘어나지만 암·복호화 시간도 증가합니다."] }
              ],
              memoryPoints: ["확산은 평문 구조를 암호문에 퍼뜨리고, 혼돈은 키와 암호문 관계를 복잡하게 만듭니다.", "S-박스는 대치 변환, P-박스는 비트 위치 순열에 대응합니다."]
            },
            {
              id: "product-feistel-cipher",
              title: "합성 암호와 Feistel 구조",
              summary: "여러 연산을 연속 적용하는 합성 암호와 Feistel 라운드 변환식을 이해합니다.",
              sourcePdfPages: [703, 704],
              keywords: ["Product Cipher", "Feistel", "Round Function", "XOR"],
              questionKeywords: ["합성 암호", "Feistel 암호", "페이스텔", "라운드 함수"],
              blocks: [
                { type: "text", title: "합성 암호", paragraphs: ["합성 암호(Product Cipher)는 S-박스·P-박스 등 여러 암호 연산을 연속 적용해 암호화합니다. Feistel 구조는 데이터를 왼쪽과 오른쪽 절반으로 나누고 라운드 함수와 라운드 키를 이용해 두 절반을 교환·결합합니다."] },
                { type: "table", title: "Feistel 암호화 식", columns: ["식", "동작"], rows: [
                  ["L(i+1) = R(i)", "현재 라운드의 오른쪽 절반을 다음 라운드의 왼쪽으로 이동"],
                  ["R(i+1) = L(i) XOR F(R(i), K(i))", "현재 왼쪽 절반과 오른쪽 절반·라운드 키에 대한 함수 결과를 XOR해 다음 오른쪽 절반 생성"]
                ] },
                { type: "text", title: "기호", paragraphs: ["i는 라운드 번호, L(i)·R(i)는 i번째 라운드의 왼쪽·오른쪽 데이터, F는 라운드 함수, K(i)는 라운드 키, XOR는 배타적 논리합을 나타냅니다."] }
              ],
              memoryPoints: ["Feistel은 데이터를 절반으로 나누고 라운드마다 한쪽을 함수 처리해 다른 쪽과 XOR합니다.", "L(i+1)은 R(i), R(i+1)은 L(i) XOR F(R(i), K(i))입니다."]
            }
          ]
        },
        {
          id: "general-symmetric-cipher-basics",
          chapter: "암호학",
          status: "published",
          title: "대칭키 암호와 블록·스트림 암호",
          summary: "같은 비밀키를 사용하는 암호 시스템의 기본 흐름과 블록 암호·스트림 암호의 처리 단위를 비교합니다.",
          sourcePdfPages: [706, 707],
          concepts: [
            {
              id: "symmetric-key-system-flow",
              title: "대칭키 암호 시스템의 구성",
              summary: "키를 생성하고 평문을 암호화해 전달한 뒤 같은 비밀키로 복호화하는 흐름을 학습합니다.",
              sourcePdfPages: [706],
              keywords: ["Symmetric-key Cryptography", "Secret Key", "Encryption", "Decryption"],
              questionKeywords: ["대칭키 암호 시스템", "비밀키 암호", "대칭키 암호 구조"],
              blocks: [
                { type: "table", title: "대칭키 암호 시스템 흐름", columns: ["단계", "설명"], rows: [
                  ["키 생성", "암호화와 복호화에 사용할 비밀키를 생성"],
                  ["암호화", "비밀키를 사용해 평문을 암호문으로 변환"],
                  ["전송", "암호화된 데이터를 통신 채널로 전달"],
                  ["복호화", "같은 비밀키로 암호문을 평문으로 복원"]
                ] },
                { type: "text", title: "핵심", paragraphs: ["대칭키 방식에서는 암호화와 복호화에 같은 비밀키를 사용하므로 키의 비밀 유지가 중요합니다."] }
              ],
              memoryPoints: ["대칭키 암호는 암호화와 복호화에 같은 비밀키를 사용합니다.", "기본 흐름은 키 생성 → 암호화 → 암호문 전달 → 복호화입니다."]
            },
            {
              id: "block-cipher-structure",
              title: "블록 암호의 처리 방식",
              summary: "입력을 고정된 크기의 블록으로 나누고 라운드 변환을 반복해 암호화합니다.",
              sourcePdfPages: [706],
              keywords: ["Block Cipher", "Block", "Round"],
              questionKeywords: ["블록 암호", "블록 단위 암호화", "라운드 기반 암호화"],
              blocks: [
                { type: "bullets", title: "블록 암호 특징", items: [
                  "입력 데이터를 미리 정한 고정 크기의 블록으로 나누어 암·복호화합니다.",
                  "각 라운드에서 입력 블록과 키를 이용한 변환을 적용하고, 여러 라운드의 처리를 반복합니다.",
                  "교재는 블록 크기가 커질수록 일반적으로 안전성이 커질 수 있지만 암·복호화 시간이 더 걸린다고 설명합니다."
                ] }
              ],
              memoryPoints: ["블록 암호는 고정 크기 블록을 라운드 기반으로 처리합니다.", "블록 크기를 키우면 처리 시간도 늘 수 있습니다."]
            },
            {
              id: "stream-cipher-comparison",
              title: "스트림 암호와 블록 암호 비교",
              summary: "스트림 암호는 평문 길이의 키 스트림을 만들고 비트 단위 XOR로 처리합니다.",
              sourcePdfPages: [706, 707],
              keywords: ["Stream Cipher", "Keystream", "XOR", "Error Propagation"],
              questionKeywords: ["스트림 암호", "키 스트림", "블록 암호와 스트림 암호 비교", "에러 전파"],
              blocks: [
                { type: "text", title: "스트림 암호", paragraphs: ["평문과 같은 길이의 키 스트림을 연속 생성한 뒤, 평문과 키 스트림을 비트 단위 XOR 연산해 암호문을 만듭니다."] },
                { type: "table", title: "두 방식 비교", columns: ["항목", "블록 암호", "스트림 암호"], rows: [
                  ["처리 단위", "고정 크기 블록", "비트 단위"],
                  ["교재에 제시된 장점", "높은 확산과 기밀성", "빠른 암호 속도, 오류 전파 현상 없음"],
                  ["교재에 제시된 단점", "느린 암호 속도, 오류 전파 현상 있음", "낮은 확산"]
                ] }
              ],
              memoryPoints: ["스트림 암호는 키 스트림과 평문을 XOR합니다.", "교재 비교표 기준으로 블록 암호는 확산, 스트림 암호는 빠른 속도와 오류 비전파가 특징입니다."]
            }
          ]
        },
        {
          id: "general-mode-ecb-cbc",
          chapter: "암호학",
          status: "published",
          title: "블록 암호 운영 모드: ECB와 CBC",
          summary: "블록을 독립 처리하는 ECB와 앞 블록의 암호문을 연결하는 CBC의 절차와 주의점을 비교합니다.",
          sourcePdfPages: [707, 710],
          concepts: [
            {
              id: "ecb-mode",
              title: "ECB 모드",
              summary: "각 평문 블록을 같은 키로 독립 암호화하므로 병렬 처리가 가능하지만 반복 패턴이 드러날 수 있습니다.",
              sourcePdfPages: [707, 708],
              keywords: ["ECB", "Electronic Codebook", "Block Cipher Mode"],
              questionKeywords: ["ECB", "전자 코드북", "블록 암호 운영 모드"],
              blocks: [
                { type: "bullets", title: "절차와 특징", items: [
                  "평문을 블록으로 나누고 각 블록을 같은 키로 독립 암호화한 뒤 결과를 연결합니다.",
                  "블록이 독립적이므로 병렬 처리가 가능합니다.",
                  "같은 평문 블록은 같은 암호문 블록이 되므로 암호문에서 패턴이 드러날 수 있어 교재는 권장하지 않는 방식으로 제시합니다."
                ] }
              ],
              memoryPoints: ["ECB는 블록별 독립 처리와 병렬화가 가능하지만, 같은 평문 블록이 같은 암호문 블록으로 나타납니다."]
            },
            {
              id: "cbc-mode",
              title: "CBC 모드와 초기 벡터",
              summary: "현재 평문 블록과 앞 암호문 블록을 XOR한 결과를 암호화하며 첫 블록에는 초기 벡터를 사용합니다.",
              sourcePdfPages: [708, 710],
              keywords: ["CBC", "Cipher Block Chaining", "IV", "Padding Oracle"],
              questionKeywords: ["CBC", "암호 블록 체인", "초기 벡터", "패딩 오라클"],
              blocks: [
                { type: "text", title: "암호화와 복호화", paragraphs: [
                  "첫 블록은 평문과 초기 벡터(IV)를 XOR한 뒤 블록 암호로 암호화합니다. 이후 블록은 현재 평문과 이전 암호문을 XOR한 뒤 암호화합니다.",
                  "복호화에서는 블록을 복호화한 결과와 앞 암호문(첫 블록은 IV)을 XOR해 평문을 복구합니다."
                ] },
                { type: "table", title: "운영 특성 및 주의점", columns: ["항목", "내용"], rows: [
                  ["병렬 처리", "암호화는 앞 결과에 의존해 병렬화할 수 없고, 복호화는 병렬 처리할 수 있습니다."],
                  ["블록 손상", "암호문 블록이 파손되면 대응하는 평문 블록과 다음 평문 블록에 영향을 줍니다."],
                  ["패딩", "마지막 평문 블록이 블록 크기보다 짧으면 패딩이 필요합니다."],
                  ["패딩 오라클", "서버가 패딩 검사 결과에 따라 서로 다른 오류를 노출하면 공격자가 평문 정보를 추론할 수 있습니다."]
                ] }
              ],
              memoryPoints: ["CBC의 첫 블록에는 IV가 필요하고 이후에는 이전 암호문이 연결됩니다.", "CBC 암호화는 순차적이고 복호화는 병렬화할 수 있습니다.", "패딩 검사 오류를 구별해 노출하면 패딩 오라클 취약점이 생길 수 있습니다."]
            }
          ]
        },
        {
          id: "general-mode-cfb-ofb",
          chapter: "암호학",
          status: "published",
          title: "블록 암호 운영 모드: CFB와 OFB",
          summary: "피드백을 사용하는 CFB와 암호 알고리즘 출력을 되먹임하는 OFB의 흐름을 학습합니다.",
          sourcePdfPages: [710, 712],
          concepts: [
            {
              id: "cfb-mode",
              title: "CFB 모드",
              summary: "IV 또는 이전 암호문을 블록 암호에 입력해 얻은 출력과 현재 평문을 XOR합니다.",
              sourcePdfPages: [710, 711],
              keywords: ["CFB", "Cipher Feedback", "Feedback", "IV"],
              questionKeywords: ["CFB", "암호 피드백", "CFB 병렬 처리"],
              blocks: [
                { type: "text", title: "동작 흐름", paragraphs: [
                  "첫 블록에서는 IV를 블록 암호에 입력하고, 다음 블록부터는 이전 암호문을 입력합니다. 블록 암호의 출력과 현재 평문을 XOR해 암호문을 만듭니다.",
                  "복호화할 때도 IV 또는 이전 암호문을 블록 암호에 입력한 출력과 현재 암호문을 XOR해 평문을 얻습니다."
                ] },
                { type: "table", title: "특징", columns: ["항목", "내용"], rows: [
                  ["암호화·복호화", "암호화는 병렬 처리할 수 없고 복호화는 병렬 처리할 수 있습니다."],
                  ["패딩", "블록보다 작은 단위로 처리할 수 있어 별도 패딩이 필요하지 않습니다."],
                  ["주의점", "교재는 재전송 공격이 가능하다고 제시합니다."]
                ] }
              ],
              memoryPoints: ["CFB는 이전 암호문을 피드백 입력으로 사용합니다.", "교재 기준 암호화는 순차 처리, 복호화는 병렬 처리가 가능합니다."]
            },
            {
              id: "ofb-mode",
              title: "OFB 모드",
              summary: "블록 암호의 이전 출력값을 다음 입력으로 되먹임하고, 출력값과 평문을 XOR합니다.",
              sourcePdfPages: [711, 712],
              keywords: ["OFB", "Output Feedback", "Keystream", "IV"],
              questionKeywords: ["OFB", "출력 피드백", "OFB 병렬 처리"],
              blocks: [
                { type: "text", title: "동작 흐름", paragraphs: [
                  "첫 블록에서는 IV를 암호화하고, 다음부터는 직전 블록 암호 알고리즘의 출력값을 다시 입력합니다. 생성된 출력값과 평문을 XOR해 암호문을 만듭니다.",
                  "복호화도 같은 출력열을 생성해 암호문과 XOR합니다. 암호화·복호화 모두 병렬 처리할 수 없으며 별도 패딩은 필요하지 않습니다."
                ] },
                { type: "table", title: "CFB와의 핵심 구분", columns: ["모드", "피드백 입력"], rows: [
                  ["CFB", "이전 암호문"],
                  ["OFB", "이전 블록 암호 알고리즘 출력값"]
                ] }
              ],
              memoryPoints: ["CFB는 이전 암호문을, OFB는 이전 암호 알고리즘 출력을 되먹임합니다.", "교재는 OFB 암·복호화를 모두 병렬 처리할 수 없는 것으로 설명합니다."]
            }
          ]
        },
        {
          id: "general-mode-ctr",
          chapter: "암호학",
          status: "published",
          title: "블록 암호 운영 모드: CTR",
          summary: "Nonce와 증가 카운터를 암호화해 키 스트림을 만들고 평문 또는 암호문과 XOR합니다.",
          sourcePdfPages: [713, 714],
          concepts: [
            {
              id: "ctr-mode",
              title: "CTR 모드",
              summary: "Nonce에 카운터를 결합한 값을 암호화하고 그 결과를 데이터 블록과 XOR합니다.",
              sourcePdfPages: [713, 714],
              keywords: ["CTR", "Counter Mode", "Nonce", "Counter"],
              questionKeywords: ["CTR", "카운터 모드", "Nonce", "CTR 병렬 처리"],
              blocks: [
                { type: "table", title: "암호화·복호화 절차", columns: ["단계", "내용"], rows: [
                  ["카운터 초기화", "첫 블록에는 Nonce와 0, 다음 블록에는 Nonce와 1을 결합한 값을 사용합니다."],
                  ["카운터 암호화", "각 카운터 값을 블록 암호로 처리해 출력 블록을 만듭니다."],
                  ["XOR", "암호화는 출력 블록과 평문을, 복호화는 출력 블록과 암호문을 XOR합니다."]
                ] },
                { type: "bullets", title: "특징", items: [
                  "Nonce를 기초로 카운터 초깃값을 구성하며, 교재는 Nonce를 임의로 생성되는 값으로 설명합니다.",
                  "블록 사이에 피드백이 없고 각 카운터가 독립적이므로 암호화와 복호화를 병렬 처리할 수 있습니다."
                ] }
              ],
              memoryPoints: ["CTR은 Nonce+카운터를 암호화해 XOR용 출력을 만듭니다.", "복호화도 같은 출력과 암호문을 XOR하며 두 방향 모두 병렬 처리가 가능합니다."]
            }
          ]
        },
        {
          id: "general-des-3des",
          chapter: "암호학",
          status: "published",
          title: "Feistel 블록 암호: DES와 3DES",
          summary: "DES의 64비트 블록·56비트 유효 키·16라운드 구조와 이를 세 번 적용하는 3DES를 학습합니다.",
          sourcePdfPages: [715, 718],
          concepts: [
            {
              id: "des-structure-and-weakness",
              title: "DES 구조와 한계",
              summary: "초기 순열 뒤 16라운드 Feistel 연산을 하고 역초기 순열을 적용하는 블록 암호입니다.",
              sourcePdfPages: [715, 717],
              keywords: ["DES", "Data Encryption Standard", "Feistel", "Linear Cryptanalysis"],
              questionKeywords: ["DES", "데이터 암호 표준", "DES 구조", "DES 취약점"],
              blocks: [
                { type: "table", title: "DES 기본 구조", columns: ["항목", "내용"], rows: [
                  ["블록 크기", "평문을 64비트 블록으로 나누어 처리"],
                  ["키", "입력 키는 64비트이며 8비트마다 패리티 비트가 있어 유효 키는 56비트"],
                  ["라운드", "64비트를 32비트씩 나누어 Feistel 구조를 16회 적용"],
                  ["절차", "초기 순열 → Feistel 라운드 → 역초기 순열"]
                ] },
                { type: "bullets", title: "교재에 제시된 한계", items: [
                  "56비트 키 공간은 2⁵⁶개이므로 무차별 대입 공격에 취약하다고 설명합니다.",
                  "선형 암호 분석 공격에 취약해 국내에서 권고하지 않는 알고리즘으로 소개합니다."
                ] }
              ],
              memoryPoints: ["DES는 64비트 블록, 56비트 유효 키, 16라운드 Feistel 구조입니다.", "64비트 입력 키에서 패리티 비트를 제외한 56비트가 라운드 키 생성에 사용됩니다."]
            },
            {
              id: "triple-des",
              title: "3DES(TDEA)",
              summary: "DES를 세 차례 적용해 키 길이와 라운드 수를 늘린 방식이며, 처리 속도가 느려집니다.",
              sourcePdfPages: [717, 718],
              keywords: ["3DES", "Triple DES", "TDEA", "EDE"],
              questionKeywords: ["3DES", "Triple DES", "TDEA", "3DES 키 길이"],
              blocks: [
                { type: "text", title: "암호화 순서", paragraphs: [
                  "3DES는 DES의 안전성 문제를 보완하기 위해 고안되었으며, 암호화는 DES 암호화 → DES 복호화 → DES 암호화 순서(EDE)로 처리합니다.",
                  "복호화는 이 연산 순서를 반대로 적용합니다. 한 키 방식은 단일 DES와의 호환을 위한 형태로 제시됩니다."
                ] },
                { type: "table", title: "키 수에 따른 특징", columns: ["키 구성", "유효 키 길이", "교재에 제시된 처리 특성"], rows: [
                  ["2개 키", "112비트(56×2)", "DES를 세 번 처리하므로 총 48라운드이며 약 3배 느림"],
                  ["3개 키", "168비트(56×3)", "DES를 세 번 처리하므로 총 48라운드이며 약 3배 느림"]
                ] }
              ],
              memoryPoints: ["3DES 암호화는 E-D-E 순서이며 복호화는 그 역순입니다.", "교재 기준 2키는 112비트, 3키는 168비트이고 총 48라운드입니다."]
            }
          ]
        },
        {
          id: "general-block-cipher-variants",
          chapter: "암호학",
          status: "published",
          title: "블록 암호 알고리즘: Blowfish·RC5/RC6·SEED·HIGHT·LEA",
          summary: "교재에 수록된 가변 키 블록 암호와 국내 블록 암호의 규격 및 사용 환경을 비교합니다.",
          sourcePdfPages: [719, 720],
          concepts: [
            {
              id: "blowfish-rc5-rc6",
              title: "Blowfish와 RC5·RC6",
              summary: "각 알고리즘의 블록 크기, 키 길이 및 라운드 규격을 구분합니다.",
              sourcePdfPages: [719],
              keywords: ["Blowfish", "RC5", "RC6", "Variable Key"],
              questionKeywords: ["Blowfish", "RC5", "RC6", "가변 키 블록 암호"],
              blocks: [
                { type: "table", title: "교재 수록 규격", columns: ["알고리즘", "블록 크기", "키 크기", "라운드"], rows: [
                  ["Blowfish", "64비트", "32~448비트", "16회"],
                  ["RC5", "32·64·128비트", "최대 2,040비트", "최대 255회"],
                  ["RC6", "128비트", "128·192·256비트(최대 2,040비트)", "20회"]
                ] },
                { type: "text", title: "알고리즘 개요", paragraphs: [
                  "Blowfish는 가변 키 길이를 지원하고 구현이 간단한 대칭키 블록 암호로 소개됩니다.",
                  "RC6는 RC5를 개선해 성능과 보안 요구를 충족하도록 개발한 블록 암호입니다."
                ] }
              ],
              memoryPoints: ["Blowfish는 64비트 블록·32~448비트 키·16라운드입니다.", "RC5는 블록 크기와 라운드 수를 다양하게 설정하고, RC6은 128비트 블록·20라운드입니다."]
            },
            {
              id: "seed-cipher",
              title: "SEED",
              summary: "국내에서 개발된 128비트 블록·128비트 키·16라운드 대칭키 블록 암호입니다.",
              sourcePdfPages: [719, 720],
              keywords: ["SEED", "KISA", "TTAS.KO-12.0004", "Block Cipher"],
              questionKeywords: ["SEED", "시드 암호", "SEED 스펙"],
              blocks: [
                { type: "text", title: "개발 배경과 규격", paragraphs: [
                  "교재는 전자상거래·금융·무선통신 등에서 전달되는 중요 정보를 보호하기 위해 KISA와 국내 암호 전문가들이 개발한 알고리즘으로 설명합니다.",
                  "수록 규격은 블록 크기 128비트, 키 크기 128비트, 16라운드입니다. 운영 모드 표준도 별도로 제시되어 있습니다."
                ] },
                { type: "table", title: "교재에 수록된 표준", columns: ["표준", "대상"], rows: [
                  ["TTAS.KO-12.0004/R1", "SEED 알고리즘"],
                  ["TTAS.KO-12.0025", "SEED 블록 암호 운영 모드"]
                ] }
              ],
              memoryPoints: ["SEED는 128비트 블록, 128비트 키, 16라운드입니다.", "SEED와 SEED 운영 모드의 표준 번호를 구분합니다."]
            },
            {
              id: "hight-cipher",
              title: "HIGHT",
              summary: "RFID·USN 등 자원 제약 환경을 위해 개발된 64비트 블록 경량 암호입니다.",
              sourcePdfPages: [720],
              keywords: ["HIGHT", "RFID", "USN", "Lightweight Cipher"],
              questionKeywords: ["HIGHT", "경량 블록 암호", "RFID 암호"],
              blocks: [
                { type: "table", title: "HIGHT 규격", columns: ["항목", "규격"], rows: [
                  ["블록 크기", "64비트"],
                  ["키 크기", "128비트"],
                  ["라운드", "32회"],
                  ["표준", "TTAS.KO-12.0040/R1"]
                ] },
                { type: "text", title: "적용 환경", paragraphs: ["교재는 RFID·USN처럼 제한된 자원으로 경량화를 요구하는 컴퓨팅 환경을 위해 개발된 알고리즘으로 소개합니다."] }
              ],
              memoryPoints: ["HIGHT는 64비트 블록·128비트 키·32라운드입니다.", "자원 제약 환경의 경량 암호로 수록되어 있습니다."]
            },
            {
              id: "lea-cipher",
              title: "LEA",
              summary: "다양한 소프트웨어 환경의 경량화를 위해 개발된 128비트 블록 암호와 키별 라운드 수를 비교합니다.",
              sourcePdfPages: [720],
              keywords: ["LEA", "Lightweight Encryption Algorithm", "TTAS.KO-12.0223"],
              questionKeywords: ["LEA", "경량 암호 알고리즘", "LEA 라운드"],
              blocks: [
                { type: "table", title: "LEA 규격", columns: ["변형", "블록 크기", "키 크기", "라운드"], rows: [
                  ["LEA-128", "128비트", "128비트", "24회"],
                  ["LEA-192", "128비트", "192비트", "28회"],
                  ["LEA-256", "128비트", "256비트", "32회"]
                ] },
                { type: "text", title: "개발 목적", paragraphs: [
                  "교재는 LEA를 국가보안기술연구소가 개발한 블록 암호로 소개하며, 다양한 소프트웨어 환경에서 AES보다 1.5~2배 빠르다고 기술합니다.",
                  "수록 표준에는 LEA 알고리즘과 LEA 운영 모드가 구분되어 있습니다."
                ] }
              ],
              memoryPoints: ["LEA 블록 크기는 128비트입니다.", "키 크기 128·192·256비트에 따라 24·28·32라운드를 수행합니다."]
            }
          ]
        },
        {
          id: "general-aes-aria-idea",
          chapter: "암호학",
          status: "published",
          title: "SPN 블록 암호: AES·ARIA·IDEA",
          summary: "AES의 라운드 변환, 국내 표준 ARIA의 규격, IDEA의 블록·키 구조를 학습합니다.",
          sourcePdfPages: [721, 723],
          concepts: [
            {
              id: "aes-round-structure",
              title: "AES 라운드 구조와 규격",
              summary: "128비트 상태 행렬에 SubBytes·ShiftRows·MixColumns·AddRoundKey를 적용하는 SPN 암호입니다.",
              sourcePdfPages: [721, 722],
              keywords: ["AES", "Advanced Encryption Standard", "Rijndael", "SubBytes", "ShiftRows", "MixColumns", "AddRoundKey"],
              questionKeywords: ["AES", "고급 암호화 표준", "AES 라운드", "SPN", "SPN 구조", "SubBytes"],
              blocks: [
                { type: "table", title: "키 길이별 AES 규격", columns: ["키 길이", "블록 크기", "라운드 수"], rows: [
                  ["128비트", "128비트", "10회"],
                  ["192비트", "128비트", "12회"],
                  ["256비트", "128비트", "14회"]
                ] },
                { type: "table", title: "라운드 변환", columns: ["변환", "역할"], rows: [
                  ["SubBytes", "상태 행렬의 바이트를 S-박스 대응값으로 치환"],
                  ["ShiftRows", "상태 행렬의 행을 행 인덱스만큼 왼쪽으로 순환 이동"],
                  ["MixColumns", "열 단위 선형 변환"],
                  ["AddRoundKey", "상태 행렬과 라운드 키를 XOR"]
                ] },
                { type: "text", title: "라운드 순서", paragraphs: [
                  "초기 단계에서 라운드 키를 XOR하고, 중간 라운드는 SubBytes → ShiftRows → MixColumns → AddRoundKey 순서로 처리합니다.",
                  "마지막 라운드에는 MixColumns를 적용하지 않습니다. 교재는 128·192·256비트 키의 라운드 수를 각각 10·12·14회로 제시합니다."
                ] }
              ],
              memoryPoints: ["AES 블록은 128비트이며 키 길이에 따라 라운드 수가 10·12·14회입니다.", "마지막 라운드는 MixColumns를 생략합니다."]
            },
            {
              id: "aria-cipher",
              title: "ARIA",
              summary: "국내에서 개발된 Involutional SPN 구조의 블록 암호로 키 길이에 따라 라운드 수가 달라집니다.",
              sourcePdfPages: [722, 723],
              keywords: ["ARIA", "Involutional SPN", "KS X 1213-1"],
              questionKeywords: ["ARIA", "국내 표준 블록 암호", "ARIA 라운드"],
              blocks: [
                { type: "table", title: "ARIA 규격", columns: ["블록 크기", "키 크기", "라운드 수"], rows: [
                  ["128비트", "128비트", "12회"],
                  ["128비트", "192비트", "14회"],
                  ["128비트", "256비트", "16회"]
                ] },
                { type: "text", title: "구조와 표준", paragraphs: [
                  "ARIA는 우리나라 국가보안기술연구소에서 개발한 블록 암호이며, 교재는 Involutional SPN 구조를 사용한다고 설명합니다.",
                  "교재에 수록된 표준 번호는 KATS KS X 1213-1입니다."
                ] }
              ],
              memoryPoints: ["ARIA 블록 크기는 128비트이며 128·192·256비트 키에 각각 12·14·16라운드를 적용합니다.", "ARIA는 Involutional SPN 구조로 소개됩니다."]
            },
            {
              id: "idea-cipher",
              title: "IDEA",
              summary: "DES 대체를 목적으로 개발된 64비트 블록·128비트 키·8라운드 암호입니다.",
              sourcePdfPages: [723],
              keywords: ["IDEA", "International Data Encryption Algorithm"],
              questionKeywords: ["IDEA", "국제 데이터 암호화 알고리즘"],
              blocks: [
                { type: "table", title: "IDEA 규격", columns: ["항목", "내용"], rows: [
                  ["블록 크기", "64비트"],
                  ["키 크기", "128비트"],
                  ["라운드", "8회"]
                ] },
                { type: "text", title: "개발 배경", paragraphs: ["교재는 IDEA를 DES를 대체하기 위해 스위스 연방 기술 기관에서 개발한 알고리즘으로 설명합니다."] }
              ],
              memoryPoints: ["IDEA는 64비트 블록, 128비트 키, 8라운드입니다."]
            }
          ]
        },
        {
          id: "general-one-time-pad",
          chapter: "암호학",
          status: "published",
          title: "일회용 패드(OTP)",
          summary: "평문과 같은 길이의 무작위 키 스트림을 한 번만 사용하는 암호 방식의 안전성 조건과 운용상 어려움을 학습합니다.",
          sourcePdfPages: [724],
          concepts: [
            {
              id: "otp-perfect-secrecy",
              title: "OTP의 원리와 조건",
              summary: "평문 또는 암호문과 같은 길이의 일회용 패드를 XOR해 암·복호화합니다.",
              sourcePdfPages: [724],
              keywords: ["OTP", "One-Time Pad", "Vernam Cipher", "Shannon"],
              questionKeywords: ["일회용 패드", "OTP", "Vernam 암호", "완벽한 안전성"],
              blocks: [
                { type: "table", title: "암·복호화", columns: ["동작", "연산"], rows: [
                  ["암호화", "평문 XOR 일회용 패드 = 암호문"],
                  ["복호화", "암호문 XOR 같은 일회용 패드 = 평문"]
                ] },
                { type: "bullets", title: "안전성 조건과 현실적 제약", items: [
                  "암호화를 수행할 때마다 무작위 키 스트림을 선택하고, 키 길이는 최소한 평문 길이와 같아야 합니다.",
                  "키를 한 번만 사용하고 중복 사용을 방지해야 하며, 안전하게 사전 배포해야 합니다.",
                  "교재는 Shannon에 의해 완벽한 안전성이 수학적으로 증명되었다고 설명합니다.",
                  "현실적으로 안전한 키 분배가 어렵기 때문에 적용 분야가 제한됩니다."
                ] }
              ],
              memoryPoints: ["OTP는 평문과 같은 길이의 무작위 패드를 한 번만 사용합니다.", "안전성의 전제는 키 재사용 금지와 안전한 사전 배포이며, 실제 운용의 큰 어려움은 키 분배입니다."]
            }
          ]
        },
        {
          id: "general-feedback-shift-registers",
          chapter: "암호학",
          status: "published",
          title: "되먹임 시프트 레지스터와 LFSR",
          summary: "피드백과 시프트로 키 스트림을 만드는 FSR, 선형·비선형 방식의 차이와 LFSR 처리 절차를 정리합니다.",
          sourcePdfPages: [724, 727],
          concepts: [
            {
              id: "fsr-lfsr-nlfsr",
              title: "FSR·LFSR·NLFSR 구분",
              summary: "FSR는 피드백 시프트 레지스터의 총칭이며 피드백 연산이 선형인지 비선형인지에 따라 나뉩니다.",
              sourcePdfPages: [724, 725, 727],
              keywords: ["FSR", "Feedback Shift Register", "LFSR", "NLFSR"],
              questionKeywords: ["FSR", "LFSR", "NLFSR", "되먹임 시프트 레지스터"],
              blocks: [
                { type: "text", title: "FSR", paragraphs: ["FSR는 구현이 간단하고 하드웨어에서 효율적으로 구현할 수 있으며 선형·비선형 방식 모두를 지원하는 암호 방식으로 소개됩니다."] },
                { type: "table", title: "종류", columns: ["종류", "피드백 연산"], rows: [
                  ["LFSR", "특정 비트들을 선형으로 연산해 피드백하고 키 스트림을 생성"],
                  ["NLFSR", "특정 비트들을 비선형으로 연산해 피드백하고 키 스트림을 생성"]
                ] }
              ],
              memoryPoints: ["LFSR은 선형 피드백, NLFSR은 비선형 피드백을 사용합니다.", "FSR는 키 스트림 생성을 하드웨어에서 효율적으로 구현할 수 있는 구조입니다."]
            },
            {
              id: "lfsr-keystream-process",
              title: "LFSR의 키 스트림 생성",
              summary: "시드로 레지스터를 초기화하고 탭 비트 XOR, 시프트, 출력 비트 추출을 반복합니다.",
              sourcePdfPages: [725, 726],
              keywords: ["LFSR", "Seed", "Feedback", "Shift Register", "XOR"],
              questionKeywords: ["LFSR 암호화", "LFSR 키 스트림", "피드백 연산", "시드값"],
              blocks: [
                { type: "table", title: "생성 절차", columns: ["순서", "처리"], rows: [
                  ["1. 초기화", "레지스터 비트에 주어진 시드값을 설정"],
                  ["2. 피드백", "특정 탭 비트들을 XOR해 새 피드백 비트를 계산"],
                  ["3. 시프트", "레지스터를 한 칸 이동하고 새 비트를 삽입; 밀려난 비트는 키 스트림 비트로 사용"],
                  ["4. 반복·암호화", "필요한 길이만큼 반복해 키 스트림을 만들고 평문과 XOR"]
                ] },
                { type: "bullets", title: "특징과 주의점", items: [
                  "주기는 초기 상태와 피드백 연산에 의해 결정되고, 교재는 주기가 클수록 추측하기 어렵다고 설명합니다.",
                  "비트들을 XOR하는 선형 구조 자체가 암호 강도 측면의 약점으로 제시됩니다.",
                  "복호화는 같은 키 스트림을 생성한 뒤 암호문과 XOR합니다."
                ] }
              ],
              memoryPoints: ["LFSR: 시드 설정 → 탭 비트 XOR → 시프트·출력 → 원하는 길이까지 반복합니다.", "LFSR의 선형성은 키 스트림을 분석할 때 약점이 될 수 있습니다."]
            }
          ]
        },
        {
          id: "general-public-key-foundations",
          chapter: "공개키 암호 시스템",
          status: "published",
          title: "공개키 암호 시스템의 원리와 목적",
          summary: "공개키와 개인키 쌍의 역할, 기밀성·인증·부인방지 등 공개키 시스템이 제공하는 기능을 구분합니다.",
          sourcePdfPages: [728, 729],
          concepts: [
            {
              id: "public-private-key-roles",
              title: "공개키와 개인키의 역할",
              summary: "서로 수학적으로 대응하는 키 쌍을 사용하며, 공개키는 공개하고 개인키는 소유자만 보관합니다.",
              sourcePdfPages: [728, 729],
              keywords: ["Public Key", "Private Key", "Asymmetric Cryptography", "Confidentiality", "Digital Signature"],
              questionKeywords: ["공개키 암호", "비대칭키 암호", "공개키와 개인키", "공개키 암호의 필요성"],
              blocks: [
                { type: "table", title: "키 사용 목적에 따른 처리", columns: ["목적", "처리"], rows: [
                  ["기밀성", "수신자의 공개키로 암호화하고 대응하는 수신자의 개인키로 복호화"],
                  ["전자서명·인증", "서명자의 개인키로 서명하고 공개키로 검증"]
                ] },
                { type: "bullets", title: "시스템의 필요성", items: [
                  "사전에 개인키를 공유하지 않은 사용자 사이에서도 공개키를 이용해 통신할 수 있습니다.",
                  "교재는 공개키 암호 시스템의 필요성을 기밀성, 키 관리, 인증, 부인 방지 측면에서 정리합니다.",
                  "공개키는 누구나 알 수 있지만 대응 개인키는 소유자만 알아야 합니다."
                ] }
              ],
              memoryPoints: ["기밀성은 수신자 공개키로 암호화하고 수신자 개인키로 복호화합니다.", "서명은 서명자 개인키로 만들고 대응 공개키로 검증합니다."]
            }
          ]
        },
        {
          id: "general-rsa",
          chapter: "공개키 암호 시스템",
          status: "published",
          title: "RSA 공개키 암호",
          summary: "소인수분해의 어려움에 기반한 RSA의 키 생성, 공개키·개인키 구분 및 암·복호화 식을 학습합니다.",
          sourcePdfPages: [730, 732],
          concepts: [
            {
              id: "rsa-key-generation",
              title: "RSA 키 생성",
              summary: "서로 다른 소수 p와 q로 N과 φ(N)을 만들고, e와 d를 모듈러 역원 관계로 정합니다.",
              sourcePdfPages: [730],
              keywords: ["RSA", "Prime Factorization", "Euler Totient", "Public Key", "Private Key"],
              questionKeywords: ["RSA 키 생성", "RSA 공개키", "오일러 파이 함수", "RSA 개인키"],
              blocks: [
                { type: "table", title: "키 생성 절차", columns: ["단계", "계산·선택"], rows: [
                  ["1. 소수 선택", "서로 다른 큰 소수 p, q를 선택"],
                  ["2. 모듈러스", "N = p × q"],
                  ["3. 오일러 함수", "φ(N) = (p − 1)(q − 1)"],
                  ["4. 공개 지수", "φ(N)과 서로소인 e를 선택"],
                  ["5. 개인 지수", "e × d ≡ 1 (mod φ(N))을 만족하는 d를 계산"],
                  ["6. 키 구성", "공개키는 (N, e), 개인키의 비밀 지수는 d"]
                ] }
              ],
              memoryPoints: ["RSA 공개키는 (N,e), 개인키의 핵심 지수는 d입니다.", "ed ≡ 1 (mod φ(N))을 만족하도록 d를 구합니다."]
            },
            {
              id: "rsa-encryption-decryption",
              title: "RSA 암호화와 복호화",
              summary: "공개 지수 e로 암호문을 만들고 개인 지수 d로 원문을 복구합니다.",
              sourcePdfPages: [731, 732],
              keywords: ["RSA Encryption", "RSA Decryption", "Modular Exponentiation"],
              questionKeywords: ["RSA 암호화", "RSA 복호화", "C = M^e mod N", "M = C^d mod N"],
              blocks: [
                { type: "table", title: "암·복호화 식", columns: ["처리", "식", "키"], rows: [
                  ["암호화", "C = Mᵉ mod N", "공개키 (N,e)"],
                  ["복호화", "M = Cᵈ mod N", "개인키 d와 N"]
                ] },
                { type: "text", title: "처리 흐름", paragraphs: ["송신자는 공개키 (N,e)를 받고 메시지 M을 거듭제곱해 N으로 나눈 나머지 C를 전달합니다. 수신자는 개인 지수 d로 C를 복호화합니다."] }
              ],
              memoryPoints: ["RSA 암호화는 공개 지수 e, 복호화는 개인 지수 d를 사용합니다.", "암호화와 복호화 모두 N을 법(modulus)으로 한 거듭제곱 나머지를 계산합니다."]
            }
          ]
        },
        {
          id: "general-rabin",
          chapter: "공개키 암호 시스템",
          status: "published",
          title: "Rabin 공개키 암호",
          summary: "소인수분해 기반인 Rabin의 제곱 암호화와 복호화 시 여러 평문 후보가 생기는 특성을 정리합니다.",
          sourcePdfPages: [733, 736],
          concepts: [
            {
              id: "rabin-encryption-decryption",
              title: "Rabin 암·복호화와 비결정성",
              summary: "N=pq를 공개하고 C=M² mod N으로 암호화하며, 복호화에서는 일반적으로 네 개의 평문 후보가 나옵니다.",
              sourcePdfPages: [733, 736],
              keywords: ["Rabin", "Factorization", "Chinese Remainder Theorem", "Nondeterministic Algorithm"],
              questionKeywords: ["Rabin 암호", "Rabin 복호화", "비결정적 알고리즘", "중국인의 나머지 정리"],
              blocks: [
                { type: "table", title: "기본 절차", columns: ["단계", "내용"], rows: [
                  ["키 생성", "서로 다른 소수 p, q를 선택하고 N=pq를 계산; 교재 예시는 p와 q를 4k+3 형태로 선택"],
                  ["암호화", "공개키 N과 평문 M으로 C=M² mod N 계산"],
                  ["복호화", "소인수 p, q에 대한 제곱근을 구하고 중국인의 나머지 정리로 후보를 결합"]
                ] },
                { type: "text", title: "복호화 결과", paragraphs: ["Rabin 복호화에서는 일반적으로 네 개의 평문 후보가 생성되므로 교재는 이를 비결정적 알고리즘으로 설명합니다. 수신자는 후보 중 원래 메시지를 식별해야 합니다."] }
              ],
              memoryPoints: ["Rabin은 소인수분해 기반 공개키 암호이며 암호문은 C=M² mod N으로 계산합니다.", "복호화에서 평문 후보가 여러 개(교재 설명 기준 4개) 생성되는 점이 RSA와 구별됩니다."]
            }
          ]
        },
        {
          id: "general-dh-elgamal",
          chapter: "공개키 암호 시스템",
          status: "published",
          title: "Diffie–Hellman 키 교환과 ElGamal 암호",
          summary: "이산로그 문제에 기반한 키 교환과 공개키 암호의 공통점·기능 차이를 비교합니다.",
          sourcePdfPages: [737, 740],
          concepts: [
            {
              id: "diffie-hellman-key-exchange",
              title: "Diffie–Hellman 키 교환",
              summary: "공개된 p와 생성자 g를 이용해 서로 비밀키를 보내지 않고 공통 비밀값을 계산합니다.",
              sourcePdfPages: [737, 738],
              keywords: ["Diffie–Hellman", "Discrete Logarithm", "Key Exchange", "Man-in-the-Middle"],
              questionKeywords: ["Diffie-Hellman", "디피-헬만", "키 교환", "중간자 공격"],
              blocks: [
                { type: "table", title: "키 교환 절차", columns: ["단계", "Alice", "Bob"], rows: [
                  ["공개값", "소수 p와 원시근 g를 공유", "같은 p와 g를 공유"],
                  ["개인값", "비밀 지수 xₐ 선택", "비밀 지수 xᵦ 선택"],
                  ["공개값 계산", "A = gˣₐ mod p", "B = gˣᵦ mod p"],
                  ["공통 비밀 계산", "Bˣₐ mod p", "Aˣᵦ mod p"]
                ] },
                { type: "text", title: "보안상 주의", paragraphs: ["양쪽은 같은 값 gˣₐˣᵦ mod p를 얻습니다. 다만 교재는 상대방 인증이 보장되지 않아 중간자 공격에 취약할 수 있다고 설명합니다."] }
              ],
              memoryPoints: ["Diffie–Hellman은 메시지 암호화가 아니라 공통 키 교환 방식입니다.", "상대 공개값을 개인 지수로 계산해 같은 공유값을 얻으며, 상대 인증이 없으면 중간자 공격에 노출될 수 있습니다."]
            },
            {
              id: "elgamal-public-key-encryption",
              title: "ElGamal 공개키 암호",
              summary: "Diffie–Hellman을 참고해 개발된 이산로그 기반 암호로, 매 암호화에 임의 지수를 사용합니다.",
              sourcePdfPages: [739, 740],
              keywords: ["ElGamal", "Discrete Logarithm", "Primitive Root", "Public Key Encryption"],
              questionKeywords: ["ElGamal", "엘가말", "이산로그", "ElGamal 암호화"],
              blocks: [
                { type: "table", title: "키와 암호문 구성", columns: ["항목", "계산"], rows: [
                  ["공개 파라미터", "소수 p와 원시근 g"],
                  ["키 쌍", "개인키 x, 공개키 y=gˣ mod p"],
                  ["임시 지수 r 사용", "c₁=gʳ mod p, c₂=M·yʳ mod p"],
                  ["복호화", "K=c₁ˣ mod p를 계산하고 M=c₂·K⁻¹ mod p로 복구"]
                ] },
                { type: "text", title: "구분", paragraphs: ["ElGamal은 암호문을 (c₁,c₂) 두 값으로 구성합니다. 매 암호화에서 임의 지수 r을 사용하므로 같은 공개키로 같은 메시지를 암호화해도 결과가 달라질 수 있습니다."] }
              ],
              memoryPoints: ["ElGamal 공개키는 y=gˣ mod p입니다.", "암호문은 c₁과 c₂ 두 값으로 구성되고 복호화용 공유값은 c₁ˣ mod p입니다."]
            }
          ]
        },
        {
          id: "general-ecc-ecdh",
          chapter: "공개키 암호 시스템",
          status: "published",
          title: "타원 곡선 암호와 ECDH",
          summary: "타원 곡선 위의 점 연산과 이산로그 문제를 이용하는 ECC 키 쌍 및 타원 곡선 기반 키 교환을 학습합니다.",
          sourcePdfPages: [741, 743],
          concepts: [
            {
              id: "ecc-curve-and-keypair",
              title: "ECC 곡선과 키 쌍",
              summary: "타원 곡선 점 연산의 이산로그 문제를 이용하며, 개인 스칼라와 생성자 점의 곱으로 공개키를 구성합니다.",
              sourcePdfPages: [741, 743],
              keywords: ["ECC", "Elliptic Curve Cryptography", "Elliptic Curve Discrete Logarithm", "Point Addition"],
              questionKeywords: ["ECC", "타원 곡선 암호", "타원곡선 방정식", "ECC 키 생성"],
              blocks: [
                { type: "text", title: "기본 곡선", paragraphs: ["교재는 y²=x³+ax+b 형태의 타원 곡선을 소개하고, 4a³+27b²≠0 조건을 제시합니다. 곡선 위의 점 덧셈·배점 연산을 이용합니다."] },
                { type: "table", title: "키 쌍 생성", columns: ["값", "역할"], rows: [
                  ["G", "타원 곡선 위에서 정한 생성자 점"],
                  ["k", "소유자가 비밀로 보관하는 개인키 스칼라"],
                  ["kG", "개인키 k와 생성자 G로 계산해 공개하는 공개키"]
                ] },
                { type: "text", title: "보안 기반", paragraphs: ["공개된 G와 kG로부터 k를 구하기 어려운 타원 곡선 이산로그 문제에 기반합니다."] }
              ],
              memoryPoints: ["ECC 개인키는 스칼라 k, 공개키는 점 kG입니다.", "공개키 kG로부터 개인키 k를 구하는 타원 곡선 이산로그 문제가 보안 기반입니다."]
            },
            {
              id: "ecdh-key-exchange",
              title: "ECDH 키 교환",
              summary: "ECC 공개키를 교환하고 상대 공개점에 자신의 개인 스칼라를 곱해 같은 공유점을 구합니다.",
              sourcePdfPages: [743],
              keywords: ["ECDH", "Elliptic Curve Diffie–Hellman", "Key Exchange"],
              questionKeywords: ["ECDH", "타원 곡선 디피-헬만", "ECC 키 교환"],
              blocks: [
                { type: "table", title: "공유점 계산", columns: ["참여자", "개인키", "공개키", "계산한 공유점"], rows: [
                  ["Alice", "kₐ", "kₐG", "kₐ(kᵦG)"],
                  ["Bob", "kᵦ", "kᵦG", "kᵦ(kₐG)"]
                ] },
                { type: "text", title: "핵심 관계", paragraphs: ["점 연산의 결합 관계에 따라 kₐ(kᵦG)=kᵦ(kₐG)이므로 양쪽이 같은 공유점을 얻습니다. ECDH는 ECC를 이용한 Diffie–Hellman 키 교환입니다."] }
              ],
              memoryPoints: ["ECDH는 ECC 기반 키 교환입니다.", "각자 자신의 개인 스칼라와 상대방 공개점을 사용해 같은 공유점을 계산합니다."]
            }
          ]
        },
        {
          id: "general-hybrid-key-distribution",
          chapter: "암호학",
          status: "published",
          title: "하이브리드 암호와 키 분배",
          summary: "대칭키의 효율과 공개키의 키 교환 이점을 결합하고, 사전 공유·KDC·키 교환 방식으로 키 배송 문제를 해결합니다.",
          sourcePdfPages: [744, 749],
          concepts: [
            {
              id: "hybrid-cryptosystem",
              title: "하이브리드 암호 시스템",
              summary: "데이터는 빠른 대칭키로 처리하고 대칭키 자체는 공개키 암호로 보호합니다.",
              sourcePdfPages: [744],
              keywords: ["하이브리드 암호", "Hybrid Cryptosystem", "세션키", "대칭키", "공개키"],
              questionKeywords: ["하이브리드 암호 시스템", "대칭키 공개키 암호 방식 비교", "대칭키 암호", "공개키 암호", "세션키를 공개키로 암호화"],
              blocks: [
                { type: "text", title: "두 방식의 결합", paragraphs: ["하이브리드 암호 시스템은 대칭키 암호와 공개키 암호를 결합합니다. 데이터를 대칭키로 빠르게 암호화하고, 그 대칭키를 메시지로 간주해 공개키 암호로 보호하여 상대방에게 전달합니다.", "공개키 암호는 대칭키 암호보다 계산이 느리므로 전체 데이터를 공개키로 처리하지 않고 키 교환에 사용합니다."] },
                { type: "table", title: "교재의 대칭키·공개키 비교", columns: ["항목", "대칭키", "공개키"], rows: [["키 관계", "암호화 키와 복호화 키가 같음", "암호화 키와 복호화 키가 다름"], ["키 개수", "n명이 서로 통신하면 n(n−1)/2개", "사용자별 공개키·개인키로 2n개"], ["키 길이", "상대적으로 짧음", "상대적으로 김"], ["속도", "빠른 계산", "느린 계산"], ["대표", "DES, AES 등", "RSA, Rabin, Diffie–Hellman, ElGamal, ECC 등"], ["주요 부담", "키 분배와 관리", "공개키 변조 시 인증 체계 위험"]] },
                { type: "table", title: "하이브리드 처리 역할", columns: ["단계", "암호 방식", "목적"], rows: [["데이터 보호", "대칭키 암호", "데이터를 빠르고 효율적으로 암호화"], ["키 교환", "공개키 암호", "대칭키를 안전하게 교환"]] }
              ],
              memoryPoints: ["데이터는 대칭키로, 대칭키 교환은 공개키로 처리합니다.", "공개키 암호의 느린 속도 때문에 하이브리드 방식이 효율적입니다.", "전자서명 검증에는 공개키를 사용하지만 대칭키 암호에는 사용하지 않습니다."]
            },
            {
              id: "key-distribution-problem",
              title: "키 배송 문제와 해결 방식",
              summary: "암호화 통신을 시작하기 전에 통신 당사자들이 비밀키를 안전하게 공유해야 하는 문제와 네 가지 해결법을 정리합니다.",
              sourcePdfPages: [745, 749],
              keywords: ["키 배송 문제", "Key Distribution Problem", "KDC", "키 분배", "세션키"],
              questionKeywords: ["키 배송 문제", "키분배", "사전에 키를 공유", "KDC", "Diffie-Hellman 키 교환", "키 분배 방법"],
              blocks: [
                { type: "text", title: "왜 키를 먼저 나눠야 할까", paragraphs: ["키 배송 문제는 암호화 통신에서 당사자들이 사용할 비밀키를 안전하게 공유하는 문제입니다. 암호키를 평문으로 보내면 노출될 수 있고, 암호화해 보내려 해도 수신자가 복호화에 쓸 키를 먼저 가져야 합니다."] },
                { type: "table", title: "교재에 제시된 네 가지 해결 방법", columns: ["방법", "핵심 방식", "특징"], rows: [["사전 키 공유", "통신할 사용자 조합마다 공유 비밀키를 미리 전달", "안전한 별도 경로가 필요하며 사용자 수가 커질수록 키가 많아짐"], ["KDC 이용", "신뢰된 중앙 키 분배 센터가 세션키를 만들어 당사자에게 전달", "사용자는 KDC와 마스터키를 공유하고 KDC를 신뢰해야 함"], ["Diffie–Hellman 키 교환", "공개 통신망에서 공개값을 교환해 양측이 공통 비밀을 계산", "키를 직접 보내지 않고 공통 키를 수립"], ["공개키 암호", "공개키로 암호화하고 대응 개인키로 복호화", "개인키를 전송하지 않아도 됨"]] },
                { type: "text", title: "사전 공유의 키 개수", paragraphs: ["n명의 사용자가 모든 사용자 쌍마다 별도 키를 공유한다면 필요한 키 수는 n(n−1)/2입니다. 사용자 쌍이 늘어날수록 키 보관·배포 부담이 빠르게 커집니다."] }
              ],
              memoryPoints: ["키 배송 문제는 통신에 쓸 비밀키를 안전하게 공유하는 문제입니다.", "사전 공유·KDC·Diffie–Hellman·공개키 암호가 교재의 네 해결 방법입니다.", "모든 쌍이 사전 공유하면 키 수는 n(n−1)/2입니다."]
            },
            {
              id: "kdc-session-key-distribution",
              title: "KDC와 세션키 분배",
              summary: "각 사용자가 KDC와 마스터키를 공유하고, KDC가 통신 쌍마다 일회용 세션키를 중계합니다.",
              sourcePdfPages: [745, 747],
              keywords: ["KDC", "Key Distribution Center", "마스터키", "세션키", "Nonce", "Kerberos"],
              questionKeywords: ["KDC 키 분배 절차", "키 분배 센터", "마스터키", "세션키", "일회용 세션키", "KDC를 이용한 방식의 특징"],
              blocks: [
                { type: "text", title: "신뢰된 제3자", paragraphs: ["KDC(Key Distribution Center)는 중앙의 신뢰된 제3자로서 대칭키 통신을 원하는 사용자에게 세션키를 배포합니다. 각 사용자는 KDC와 마스터키를 미리 공유하고, 사용자는 KDC를 신뢰해야 합니다.", "KDC는 사용자 조합별 키를 모두 장기간 보관하는 대신, 통신 세션마다 임시 세션키를 만들고 각 사용자의 마스터키로 보호해 전달합니다. 교재는 Blom 방식과 Kerberos 방식을 KDC 이용 방식의 예로 듭니다."] },
                { type: "table", title: "KDC 키 분배 절차의 큰 흐름", columns: ["순서", "동작"], rows: [["사전", "A와 KDC는 Kₐ, B와 KDC는 Kᵦ를 공유"], ["요청", "A가 상대 B와 통신하려고 자신의 ID와 B의 ID를 KDC에 요청"], ["키 생성", "KDC가 세션키 Kₐᵦ와 임의값(Nonce)을 생성"], ["전달", "KDC가 A의 마스터키로 A 몫을 보호해 A에게, B의 마스터키로 B 몫을 보호해 B에게 전달"], ["상호 확인", "A와 B가 세션키를 사용해 Nonce에 응답하여 세션키 보유를 확인"]] },
                { type: "text", title: "장점과 신뢰 가정", paragraphs: ["사용자끼리 미리 별도 비밀키를 공유할 필요가 없고 중앙에서 세션키 배포를 관리할 수 있습니다. 반면 모든 사용자가 KDC를 신뢰해야 하며, KDC는 세션마다 키를 생성·관리하므로 이용 규모가 커지면 관리 부담이 증가합니다."] }
              ],
              memoryPoints: ["KDC는 마스터키로 보호한 일회용 세션키를 배포합니다.", "사용자는 KDC를 신뢰해야 하고, 사용자는 KDC와 마스터키를 사전 공유합니다.", "Nonce는 임의로 생성해 재사용·재전송을 구별하는 데 쓰입니다."]
            },
            {
              id: "kdc-key-distribution-protocols",
              title: "Needham–Schroeder와 Otway–Rees",
              summary: "KDC 기반 키 배포에서 티켓과 Nonce를 사용해 세션키 전달 및 상대 확인을 수행하는 두 프로토콜을 구분합니다.",
              sourcePdfPages: [747, 749],
              keywords: ["Needham–Schroeder", "Otway–Rees", "Kerberos", "티켓", "Nonce", "재전송 공격"],
              questionKeywords: ["Needham-Schroeder 프로토콜", "Otway-Rees 프로토콜", "Kerberos 키 분배", "KDC 프로토콜", "Nonce 재전송 공격"],
              blocks: [
                { type: "table", title: "프로토콜 구분", columns: ["프로토콜", "교재의 설명", "학습 포인트"], rows: [["Needham–Schroeder", "네트워크에서 안전한 통신과 키 배포를 위해 KDC·티켓·세션키·Nonce를 사용", "Kerberos 키 분배 프로토콜의 기반 기술"], ["Otway–Rees", "컴퓨터 네트워크에서 인증과 키 교환을 위해 KDC와 양측 Nonce를 사용", "A와 B가 각각 만든 Nonce가 KDC를 거쳐 검증됨"]] },
                { type: "text", title: "Nonce를 쓰는 이유", paragraphs: ["당사자가 새 임의값을 보내고 상대가 그 값을 올바르게 복호화했다는 응답을 돌려주면, 상대가 같은 세션키를 보유했는지 확인할 수 있습니다. 교재는 Needham–Schroeder 설명에서 이전 세션키가 노출된 상태로 관련 전송값까지 수집되면 재전송 공격에 취약할 수 있다고 경고합니다."] }
              ],
              memoryPoints: ["Needham–Schroeder는 Kerberos 키 분배 프로토콜의 기반입니다.", "두 프로토콜 모두 KDC 기반 키 분배이며 Nonce를 사용합니다.", "이전 세션키 노출과 수집된 값의 조합은 재전송 위험을 높일 수 있습니다."]
            },
            {
              id: "key-agreement-and-public-key-distribution",
              title: "Diffie–Hellman과 공개키를 이용한 키 수립",
              summary: "Diffie–Hellman은 공개 통신망에서도 공통 비밀을 계산하고, 공개키 암호는 공개키·개인키 쌍으로 키 배송 부담을 해결합니다.",
              sourcePdfPages: [749],
              keywords: ["Diffie–Hellman", "키 교환", "키 합의", "공개키 암호", "키 배송"],
              questionKeywords: ["디피-헬만 키 교환", "Diffie-Hellman 키 배송", "공개키 암호를 이용한 키 분배", "키 분배 방법"],
              blocks: [
                { type: "table", title: "두 방식의 핵심", columns: ["방식", "핵심", "주의점"], rows: [["Diffie–Hellman", "암호화되지 않은 통신망에서 공개값을 교환해 공통 비밀키를 계산", "상대 인증이 별도로 없으면 중간자 공격에 노출될 수 있음"], ["공개키 암호", "수신자의 공개키로 키를 암호화하고 수신자는 개인키로 복호화", "공개키의 진위와 무결성을 확인해야 함"]] },
                { type: "text", title: "키 수립과 데이터 암호화", paragraphs: ["키 교환·키 합의는 사용할 공통 키를 마련하는 절차이고, 실제 데이터는 마련된 대칭 세션키로 암호화할 수 있습니다. 공개키 암호의 공개키를 인증 없이 신뢰하면 공격자가 자신의 공개키로 바꿔치기할 위험이 있으므로 공개키 신뢰 체계가 필요합니다."] }
              ],
              memoryPoints: ["Diffie–Hellman은 비밀키를 통신망으로 직접 전송하지 않고 공통 비밀을 만듭니다.", "키 합의 자체가 상대방 신원을 인증해 주는 것은 아닙니다.", "공개키 방식은 키 배송 부담을 줄이지만 공개키 진위 확인이 필요합니다."]
            }
          ]
        },
        {
          id: "general-hash-properties-collisions",
          chapter: "해시 함수",
          status: "published",
          title: "해시 함수의 성질과 충돌",
          summary: "고정 길이 출력과 역상·제2역상·충돌 저항성, 생일 공격의 계산량을 이해합니다.",
          sourcePdfPages: [785, 788],
          concepts: [
            {
              id: "hash-function-properties",
              title: "해시 함수와 암호학적 성질",
              summary: "임의 길이 입력을 고정 길이 해시값으로 바꾸는 단방향 함수의 주요 보안 성질을 구분합니다.",
              sourcePdfPages: [785, 786],
              keywords: ["해시 함수", "Hash Function", "해시값", "역상 저항성", "충돌 저항성", "Avalanche Effect"],
              questionKeywords: ["해시 함수 특징", "해시 함수 조건", "해시 함수의 특징", "역상 저항성", "제2역상 저항성", "충돌 저항성", "쇄도 효과"],
              blocks: [
                { type: "text", title: "임의 길이를 고정 길이로", paragraphs: ["해시 함수는 임의의 길이 데이터를 고정 길이 데이터로 매핑하는 단방향 함수입니다. 입력을 해시값으로 바꾸기는 쉽지만 해시값만으로 원래 입력을 복원할 수 없어야 합니다."] },
                { type: "table", title: "암호학적 해시의 핵심 성질", columns: ["성질", "뜻"], rows: [["압축성", "입력 길이와 무관하게 고정 크기의 해시값을 출력"], ["역상 저항성", "해시값이 주어졌을 때 그 값을 만든 입력을 찾기 어려움"], ["제2역상 저항성", "입력 X가 주어졌을 때 H(X)=H(X′)인 다른 입력 X′를 찾기 어려움"], ["충돌 저항성", "같은 해시값을 내는 서로 다른 두 입력을 찾기 어려움"], ["계산 용이성", "주어진 입력의 해시를 효율적으로 계산"], ["쇄도 효과", "입력의 작은 변화가 출력의 큰 변화를 일으킴"]] },
                { type: "text", title: "해시 함수와 암호화는 다르다", paragraphs: ["해시는 복호화 키를 이용해 원래 메시지로 되돌리는 암호화가 아닙니다. 해시 알고리즘은 공개되어도 되며, 입력과 해시값의 관계에서 역상·제2역상·충돌을 찾기 어려운지가 보안의 핵심입니다."] }
              ],
              memoryPoints: ["제1역상은 해시값에서 입력 찾기, 제2역상은 주어진 입력과 같은 해시를 내는 다른 입력 찾기입니다.", "충돌 저항성은 같은 해시를 내는 임의의 두 입력을 찾기 어렵다는 성질입니다.", "암호화와 달리 해시값은 복호화해 원문을 얻는 값이 아닙니다."]
            },
            {
              id: "hash-collision-birthday-attack",
              title: "해시 충돌과 생일 공격",
              summary: "비둘기집 원리와 생일 역설을 이용해 충돌 탐색 비용이 해시 출력 길이의 절반 규모로 증가함을 계산합니다.",
              sourcePdfPages: [787],
              keywords: ["해시 충돌", "비둘기집 원리", "생일 공격", "Birthday Attack", "충돌 계산량"],
              questionKeywords: ["해시 충돌 원리", "생일 공격", "Birthday Attack", "충돌 저항성 계산", "최소 비트 해시값"],
              blocks: [
                { type: "table", title: "충돌이 생기는 원리", columns: ["원리", "해시와의 관계"], rows: [["비둘기집 원리", "가능한 출력값 수보다 입력이 많으면 적어도 두 입력은 같은 출력값을 가짐"], ["생일 공격", "입력 표본이 늘수록 같은 해시값을 갖는 두 입력을 발견할 확률이 빠르게 증가"]] },
                { type: "text", title: "출력 n비트의 충돌 탐색", paragraphs: ["n비트 해시의 가능한 출력은 2ⁿ개입니다. 생일 공격에서는 충돌을 찾는 데 대략 2ⁿᐟ² 규모의 시도가 필요하므로, 충돌 저항성은 출력 길이 n의 절반 수준으로 평가합니다."] },
                { type: "code", title: "교재의 계산 예", language: "text", code: "초당 계산량: 2^32 해시\n시간: 1,024초 = 2^10초\n총 시도량: 2^32 × 2^10 = 2^42\n충돌 방어 조건: 2^(n/2) ≥ 2^42\nn/2 ≥ 42\nn ≥ 84", caption: "교재 예의 조건에서는 최소 84비트 출력이 필요합니다." }
              ],
              memoryPoints: ["출력 n비트의 충돌 저항성 수준은 대략 2ⁿᐟ² 연산입니다.", "교재 계산 예: 초당 2³²회 × 2¹⁰초 = 2⁴²회, 따라서 n≥84입니다.", "생일 공격은 역상 탐색과 달리 충돌 쌍을 찾는 공격입니다."]
            },
            {
              id: "hash-applications-and-attacks",
              title: "해시 활용, 비밀번호 보호와 공격",
              summary: "무결성 확인과 비밀번호 검증에 쓰이는 해시의 운용법 및 사전 계산 공격 방어 기법을 학습합니다.",
              sourcePdfPages: [788, 789],
              keywords: ["해시 활용", "비밀번호 해시", "Rainbow Table", "Salt", "Key Stretching", "Bloom Filter"],
              questionKeywords: ["해시 함수 활용 분야", "레인보우 테이블 공격", "솔트 키", "키 스트레칭", "블룸 필터", "해시 함수 공격"],
              blocks: [
                { type: "table", title: "대표 활용", columns: ["활용", "방법"], rows: [["무결성 검증", "원본과 수신 데이터의 해시값을 비교해 변조 여부를 확인"], ["비밀번호 확인", "입력 비밀번호를 해시해 저장값과 비교"], ["중복 탐지", "같은 해시값을 갖는 데이터를 중복 후보로 식별"]] },
                { type: "table", title: "레인보우 테이블 방어", columns: ["기법", "역할"], rows: [["Salt", "비밀번호마다 임의값을 더해 같은 비밀번호도 서로 다른 해시를 내게 함"], ["Key Stretching", "해시를 반복 계산해 대량 후보 검증을 느리게 함"], ["Bloom Filter", "집합 포함 여부를 효율적으로 검사해 알려진 취약 비밀번호 차단에 활용"]] },
                { type: "text", title: "공격 관점", paragraphs: ["레인보우 테이블 공격은 미리 계산해 둔 후보 대응표를 이용해 해시 입력을 찾으려는 공격입니다. 그 밖에 무차별 대입, 충돌을 이용한 공격, 해시 중간 상태나 블록 처리의 성질을 이용한 공격이 소개됩니다. 공격 유형의 공통 목표는 원하는 입력·충돌을 찾거나 메시지를 바꾸고도 검증을 통과하는 것입니다."] }
              ],
              memoryPoints: ["파일 무결성은 해시 비교로 검사할 수 있지만, 일반 해시만으로 송신자 인증을 제공하지 않습니다.", "Salt는 비밀번호별 해시를 다르게 하고, Key Stretching은 추측 검증 비용을 높입니다.", "해시 결과를 신뢰 가능한 경로로 비교해야 합니다."]
            }
          ]
        },
        {
          id: "general-hash-mdc-sha",
          chapter: "해시 함수",
          status: "published",
          title: "MDC와 해시 알고리즘",
          summary: "키 없는 변경 감지 코드와 MD·SHA 계열 해시의 용도·출력 구조를 비교합니다.",
          sourcePdfPages: [789, 791],
          concepts: [
            {
              id: "mdc-and-hash-families",
              title: "MDC와 대표 해시 계열",
              summary: "MDC는 송수신 데이터의 변경 여부를 해시값 비교로 확인하지만 송신자 인증까지 제공하지 않습니다.",
              sourcePdfPages: [789, 790],
              keywords: ["MDC", "Modification Detection Code", "MD5", "SHA", "LSH", "RIPEMD", "HAS", "HAVAL"],
              questionKeywords: ["MDC", "변경 감지 코드", "MD5", "SHA 종류", "LSH", "RIPEMD", "HAVAL"],
              blocks: [
                { type: "text", title: "MDC의 검증 흐름", paragraphs: ["MDC(Modification Detection Code)는 비밀키를 사용하지 않는 변경 감지 코드입니다. 송신자는 데이터에서 코드를 만들고 수신자는 받은 데이터로 다시 계산해 전달받은 코드와 비교합니다. 값이 같으면 전송 중 변경되지 않았음을 확인하는 데 쓸 수 있습니다.", "MDC는 무결성 검사용이며, 키 기반의 메시지 인증이나 송신자 신원 확인과는 구별해야 합니다. 코드 자체를 공격자가 바꾸지 못하도록 안전하게 전달하는 조건도 중요합니다."] },
                { type: "table", title: "교재에 소개된 MDC 계열", columns: ["계열", "교재의 요점"], rows: [["MD5", "512비트 메시지 블록을 처리해 128비트 해시값을 출력"], ["SHA", "SHA-0·SHA-1·SHA-2·SHA-3 및 SHAKE 계열"], ["LSH", "국내 표준으로 제정된 경량 해시 함수"], ["RIPEMD-160", "임의 길이 입력을 160비트로 압축"], ["HAS", "국내 KCDSA를 위해 개발된 해시 함수"], ["HAVAL", "MD5와 SHA-1의 장점을 취해 개발된 해시 함수"]] },
                { type: "text", title: "용어 구분", paragraphs: ["디지털 서명 알고리즘(DSA)은 서명을 생성·검증하는 공개키 알고리즘이고, 해시 함수와 같은 개념이 아닙니다. 서명·인증 응용에서 해시값이 함께 사용될 수 있다는 점과 알고리즘 역할을 나누어 기억합니다."] }
              ],
              memoryPoints: ["MDC는 비밀키 없는 변경 감지 코드이며 목적은 무결성 확인입니다.", "MD5는 512비트 블록 처리와 128비트 출력을 갖습니다.", "해시 함수와 DSA(전자서명 알고리즘)는 역할이 다릅니다."]
            },
            {
              id: "sha-family-specifications",
              title: "SHA 계열의 출력과 구조",
              summary: "SHA-0/1, SHA-2, SHA-3와 SHAKE의 해시값 크기·블록 구조·운용상 차이를 비교합니다.",
              sourcePdfPages: [790, 791],
              keywords: ["SHA-1", "SHA-2", "SHA-3", "SHA-224", "SHA-256", "SHA-384", "SHA-512", "SHAKE"],
              questionKeywords: ["SHA 함수 특징", "SHA 함수 스펙", "SHA-1 해시값", "SHA-2", "SHA-3", "SHAKE128", "SHA-512/256"],
              blocks: [
                { type: "table", title: "교재에 제시된 SHA 출력 사양", columns: ["계열·종류", "해시값 크기", "블록 크기", "연산수"], rows: [["SHA-0", "160비트", "512비트", "80"], ["SHA-1", "160비트", "512비트", "80(20×4)"], ["SHA-224", "224비트", "512비트", "64"], ["SHA-256", "256비트", "512비트", "64"], ["SHA-384", "384비트", "1,024비트", "80"], ["SHA-512", "512비트", "1,024비트", "80"], ["SHA-512/224", "224비트", "1,024비트", "80"], ["SHA-512/256", "256비트", "1,024비트", "80"]] },
                { type: "table", title: "SHA-3 및 SHAKE", columns: ["종류", "교재에서 강조하는 점"], rows: [["SHA3-224/256/384/512", "각 이름에 해당하는 길이의 해시값을 출력하는 SHA-3 계열"], ["SHAKE128·SHAKE256", "출력 길이를 선택할 수 있는 확장 출력 함수"]] },
                { type: "text", title: "구형 계열에 관한 교재 설명", paragraphs: ["교재는 SHA-0과 SHA-1에서 충돌 공격이 발견되었다고 설명합니다. SHA-2와 SHA-1은 구조가 유사하므로 SHA-1 계열의 공격 가능성이 SHA-2 평가에도 고려되어야 한다고 덧붙입니다. 이 내용은 교재의 설명 범위로 읽고 실제 운영 정책은 별도의 최신 기준을 확인해야 합니다."] }
              ],
              memoryPoints: ["SHA-1: 최대 2⁶⁴비트 미만 입력, 160비트 해시, 512비트 블록, 80단계(20×4).", "SHA-2에는 224·256비트(512비트 블록)와 384·512비트(1,024비트 블록) 변형이 있습니다.", "SHAKE는 출력 길이를 선택하는 확장 출력 계열입니다."]
            }
          ]
        },
        {
          id: "general-mac-authentication",
          chapter: "해시 함수",
          status: "published",
          title: "MAC과 메시지 인증",
          summary: "비밀키 기반 MAC이 메시지 무결성과 출처 인증을 함께 제공하는 원리 및 해시·블록암호 기반 종류를 정리합니다.",
          sourcePdfPages: [791, 792],
          concepts: [
            {
              id: "mac-properties-and-keyed-hash",
              title: "MAC의 목적과 성질",
              summary: "송수신자가 공유한 비밀키와 메시지로 인증 코드를 만들어 메시지 변조 및 출처를 검증합니다.",
              sourcePdfPages: [791, 792],
              keywords: ["MAC", "Message Authentication Code", "메시지 인증 코드", "메시지 출처 인증", "무결성"],
              questionKeywords: ["MAC 특징", "메시지 인증 코드", "MAC 무결성", "메시지 출처 인증", "키드 해시"],
              blocks: [
                { type: "text", title: "공유 비밀키를 이용한 검증", paragraphs: ["MAC(Message Authentication Code)은 메시지 M과 송수신자가 공유한 비밀키 K를 이용해 고정 길이 인증 코드를 생성하는 방식입니다. 수신자는 같은 키로 계산한 MAC과 전달받은 MAC을 비교해 메시지의 변조 여부와 공유키 보유자의 출처를 확인합니다.", "생성·검증 시 송수신자가 안전한 방법으로 공유한 비밀키가 필요합니다. MAC은 해시값만 전달하는 MDC와 달리 키를 사용하므로 무결성과 메시지 출처 인증을 제공합니다."] },
                { type: "table", title: "MAC이 제공하는 보장", columns: ["보장", "의미"], rows: [["무결성", "전송 중 메시지가 변조되지 않았는지 확인"], ["메시지 출처 인증", "공유 비밀키를 가진 상대가 생성한 코드인지 확인"], ["비밀성", "MAC 자체는 메시지를 암호화하지 않으므로 별도 암호화가 필요"]] },
                { type: "text", title: "재전송 위험", paragraphs: ["MAC이 메시지의 변조를 검출하더라도 오래된 메시지와 그 MAC을 그대로 다시 보내는 재전송을 자동으로 막지는 않습니다. 교재는 중간자가 메시지와 MAC을 가로채 재전송하면 수신자가 정상 송신으로 오인할 수 있는 취약점을 보여 줍니다. 새로움·순서를 별도로 확인하는 프로토콜 설계가 필요합니다."] }
              ],
              memoryPoints: ["MAC은 공유 비밀키를 사용하여 무결성과 메시지 출처 인증을 제공합니다.", "MAC은 메시지 암호화나 비밀성 자체를 제공하지 않습니다.", "기존 메시지와 MAC의 재전송은 별도 대응이 필요합니다."]
            },
            {
              id: "mac-constructions-and-families",
              title: "MAC 생성 기법과 종류",
              summary: "해시 함수·블록암호와 비밀키를 결합하는 메시지 인증 기법을 분류합니다.",
              sourcePdfPages: [792],
              keywords: ["HMAC", "CMAC", "CBC-MAC", "CCM", "GCM", "Keyed Hash"],
              questionKeywords: ["MAC 종류", "H-MAC", "HMAC", "CMAC", "CBC-MAC", "CCM", "GCM", "메시지 인증 방식 해시 함수 사용 기법"],
              blocks: [
                { type: "table", title: "교재의 MAC 종류", columns: ["종류", "기반"], rows: [["HMAC", "해시 함수 기반 MAC"], ["CMAC", "블록 암호 기반 MAC"], ["CBC-MAC", "CBC 블록 암호 모드 기반 MAC"], ["CCM", "Counter with CBC-MAC"], ["GCM", "Galois/Counter Mode"]] },
                { type: "table", title: "메시지 인증에 해시를 쓰는 방식", columns: ["기법", "동작"], rows: [["키 공유 + 해시", "송신자와 수신자가 공유한 키와 메시지로 인증 해시를 생성"], ["암호화된 해시", "해시값을 만든 뒤 대칭키로 보호해 전송"], ["송신자 개인키 + 해시", "송신자가 해시값에 전자서명하고 수신자가 공개키로 검증"]] },
                { type: "text", title: "키 없는 해시와 구분", paragraphs: ["일반 해시 함수는 비밀키를 입력으로 사용하지 않습니다. MAC에서는 메시지와 비밀키를 결합해 인증용 값을 만들므로 같은 해시 함수 계열을 사용하더라도 보안 목적과 입력 구성이 다릅니다."] }
              ],
              memoryPoints: ["HMAC은 해시 기반, CMAC은 블록 암호 기반 MAC입니다.", "CBC-MAC은 CBC 기반이며 CCM은 Counter와 CBC-MAC을 결합합니다.", "MAC 입력에는 공유 비밀키가 관여하지만 단순 해시 입력에는 비밀키가 없습니다."]
            }
          ]
        },
        {
          id: "general-authentication",
          chapter: "보안 요소 기술",
          status: "published",
          title: "사용자·시스템·디바이스 인증",
          summary: "인증 요소와 OTP·스마트카드·생체인식부터 Kerberos, 통합 계정 관리, 기기 인증까지 연결합니다.",
          sourcePdfPages: [806, 818],
          concepts: [
            {
              id: "authentication-factors-and-otp",
              title: "인증 요소와 일회용 비밀번호",
              summary: "지식·소유·생체·행위 요소를 구분하고 OTP 생성·검증 방식을 비교합니다.",
              sourcePdfPages: [806, 809],
              keywords: ["Authentication", "인증", "MFA", "OTP", "Challenge-Response", "S/KEY"],
              questionKeywords: ["인증 방식", "인증 요소", "2단계 인증", "OTP 방식", "시간 동기화", "이벤트 동기화", "S/KEY", "해시 체인"],
              blocks: [
                { type: "table", title: "인증 요소와 예시", columns: ["요소", "확인 대상", "예시"], rows: [["지식", "당신이 알고 있는 것", "비밀번호, PIN"], ["소유", "당신이 가진 것", "인증서, OTP, 스마트카드, USB 토큰"], ["생체·존재", "당신 자체의 고유 특성", "홍채, 정맥, 얼굴, 지문"], ["행위", "당신이 하는 것", "음성, 서명, 발걸음, 몸짓"]] },
                { type: "text", title: "단일·이중·다중 요소", paragraphs: ["단일 요소 인증은 한 종류, 2FA는 서로 다른 두 인증 요소 유형, MFA는 여러 요소 유형을 사용합니다. 같은 유형의 인증 방식을 두 개 쓰는 것만으로 서로 다른 요소를 결합한 다중 요소 인증이 되지는 않습니다."] },
                { type: "table", title: "OTP 방식", columns: ["방식", "생성 기준", "검증"], rows: [["질의-응답", "서버가 만든 난수 질의를 클라이언트가 사전 공유키로 처리", "서버가 응답값의 정상 여부 확인"], ["시간 동기화", "클라이언트와 서버가 동기화된 시간값 사용", "같은 시간 구간의 OTP를 비교"], ["이벤트 동기화", "인증 횟수·카운터 사용", "양측 카운터 기반 OTP 비교"], ["시간-이벤트 동기화", "시간값과 카운터를 함께 사용", "양쪽 시간·횟수 상태를 함께 검증"], ["S/KEY", "비밀 초기값에 반복 해시해 체인 생성", "서버가 저장한 다음 체인값과 해시 결과 비교"]] },
                { type: "text", title: "OTP 운용과 변형", paragraphs: ["OTP는 매 사용마다 바뀌어 비밀번호 재사용 공격을 줄입니다. 의미 있는 숫자나 추측 가능한 값으로 만들지 않고, 한 번 사용한 값을 재사용하지 않도록 관리합니다. 교재는 거래 정보와 연결한 거래 연동 OTP, USIM·스마트카드·MicroSD에 주요 모듈을 둔 OTP를 소개합니다."] }
              ],
              memoryPoints: ["인증 요소: 지식·소유·생체(존재)·행위.", "2FA/MFA는 요소의 개수가 아니라 서로 다른 요소 유형을 조합하는지가 중요합니다.", "S/KEY는 해시 함수의 일방향성과 해시 체인을 이용합니다."]
            },
            {
              id: "smartcards-and-biometrics",
              title: "스마트카드와 생체인증",
              summary: "접촉식·비접촉식 카드와 정적·동적 인증, 생체인식 오류율 및 설계 지표를 비교합니다.",
              sourcePdfPages: [810, 812],
              keywords: ["Smart Card", "SDA", "DDA", "Biometrics", "FAR", "FRR", "CER", "생체인증"],
              questionKeywords: ["스마트카드 종류", "정적 데이터 인증", "동적 데이터 인증", "FAR", "FRR", "CER", "생체인식 특성", "생체인증 지표"],
              blocks: [
                { type: "table", title: "스마트카드 분류와 인증", columns: ["구분", "특징"], rows: [["접촉식", "카드 칩과 단말 접촉부의 물리적 접촉으로 동작"], ["비접촉식", "카드 내 코일 안테나와 전자기 유도로 단말과 통신"], ["SIM 카드", "가입자 인증·과금·보안 정보를 저장"], ["SDA", "인증 때마다 같은 정적 데이터를 사용"], ["DDA", "인증 때마다 다른 동적 데이터를 사용하고 카드 안에서 암호 계산"]] },
                { type: "table", title: "생체인증 오류율", columns: ["지표", "뜻", "보안·편의 영향"], rows: [["FRR", "권한 있는 사용자를 거부하는 비율", "낮을수록 편의성이 높지만 보안성을 높이면 증가할 수 있음"], ["FAR", "권한 없는 사용자를 허용하는 비율", "낮을수록 보안성이 높으며 편의성을 지나치게 높이면 증가할 수 있음"], ["CER/EER", "FRR과 FAR이 만나는 교차 오류율", "낮을수록 균형이 좋은 시스템"]] },
                { type: "table", title: "생체인식 시스템의 고려 특성", columns: ["일반적으로 필요한 특성", "설계에서 함께 볼 특성"], rows: [["보편성: 모든 사람이 보유", "정확성·성능: 올바른 인증과 처리량"], ["유일성: 사람마다 구별 가능", "저항성: 모방·해킹 등 공격 방어"], ["영구성: 쉽게 변하지 않음", "수용성: 사용자가 거부감 없이 사용"], ["획득성: 센서로 측정 가능", "지속성: 손실·변화 없이 관리"]] },
                { type: "text", title: "생체 방식 예시", paragraphs: ["지문 센서는 광학식·정전용량식·초음파식이 소개됩니다. 홍채·얼굴·정맥 인식도 사용되며, 정확도뿐 아니라 기만 용이도와 사용자 수용성도 함께 평가합니다."] }
              ],
              memoryPoints: ["CA 개인키와 같은 발급자 비밀키를 스마트카드 단말에 저장하지 않습니다.", "SDA는 정적 데이터, DDA는 인증마다 달라지는 데이터를 사용합니다.", "FAR은 무권한 허용, FRR은 권한 있는 사용자 거부이며 CER/EER은 두 오류율의 교차점입니다."]
            },
            {
              id: "kerberos-authentication-protocol",
              title: "Kerberos 중앙 집중형 인증",
              summary: "KDC 안의 AS와 TGS가 TGT·서비스 티켓을 발급하고 세션 키와 인증자로 서비스 접속을 허가합니다.",
              sourcePdfPages: [813, 815],
              keywords: ["Kerberos", "KDC", "AS", "TGS", "TGT", "SGT", "Authenticator", "Timestamp"],
              questionKeywords: ["Kerberos 구성요소", "Kerberos 절차", "TGT", "SGT", "티켓 유효기간", "Kerberos V4", "Kerberos V5"],
              blocks: [
                { type: "table", title: "Kerberos 구성요소", columns: ["구성요소", "역할"], rows: [["Client", "Kerberos 영역의 서비스를 이용하는 사용자"], ["KDC", "신뢰되는 제3자 기관으로 AS와 TGS를 포함"], ["AS", "사용자 신원을 확인하고 TGT와 TGS 세션 키를 발급"], ["TGS", "서비스 티켓을 발급"], ["SS", "클라이언트가 요청한 실제 서비스를 제공"]] },
                { type: "table", title: "인증·서비스 접근 순서", columns: ["순서", "메시지", "처리"], rows: [["1", "Client → AS", "사용자 ID를 전송"], ["2", "AS → Client", "TGT와 암호화된 TGS 세션키를 전달"], ["3", "Client → TGS", "복호화한 TGS 세션키로 만든 Authenticator와 받은 TGT를 전달"], ["4", "TGS → Client", "ID가 일치하면 SGT와 암호화된 SS 세션키를 전달"], ["5", "Client → SS", "Authenticator와 SGT를 전달"], ["6", "SS → Client", "사용자 정보가 일치하면 서비스를 제공"]] },
                { type: "table", title: "Kerberos V4와 V5 비교(교재 표)", columns: ["항목", "V4", "V5"], rows: [["암호화", "DES만 지원", "다양한 알고리즘 지원"], ["네트워크 주소", "IPv4만", "IPv4와 IPv6"], ["티켓 유효기간", "고정·갱신 불가", "갱신 가능"], ["데이터 형식", "자체 정의 단순 형식", "ASN.1 사용"], ["비밀번호 공격", "취약으로 표시", "교재 표에 별도 비교 설명 없음"]] },
                { type: "text", title: "티켓과 재전송 방지", paragraphs: ["TGT와 SGT에는 대상 서버, 클라이언트 정보, 주소 및 티켓 유효기간 등이 담깁니다. 인증자는 세션키로 보호된 사용자 정보와 타임스탬프를 사용하며, 티켓 유효기간과 시간 정보를 이용해 재전송 공격 위험을 줄입니다.", "Kerberos는 대칭키 기반의 중앙 집중형 클라이언트-서버 인증이며 Single Sign-On(SSO)에도 활용됩니다. 교재는 비밀번호 추측 및 비밀키 유출 가능성을 주의점으로 듭니다."] }
              ],
              memoryPoints: ["KDC의 AS가 TGT를, TGS가 서비스용 SGT를 발급합니다.", "TGT/SGT 티켓과 Authenticator는 서로 다른 역할입니다.", "타임스탬프와 티켓 유효기간은 재전송 위험을 줄이는 요소입니다."]
            },
            {
              id: "sso-fim-eam-iam",
              title: "SSO와 통합 ID·접근 관리",
              summary: "SSO 로그인 통합, FIM 연합 ID, EAM 권한관리, IAM 계정 프로비저닝의 범위를 구분합니다.",
              sourcePdfPages: [815, 817],
              keywords: ["SSO", "FIM", "Federated Identity Management", "EAM", "IAM", "SAML", "OAuth", "LDAP"],
              questionKeywords: ["SSO 구현 모델", "Single Sign On", "FIM", "EAM", "IAM", "프로비저닝", "SAML", "OAuth"],
              blocks: [
                { type: "text", title: "한 번의 인증에서 연합 ID까지", paragraphs: ["SSO(Single Sign-On)는 한 번의 인증으로 여러 정보 시스템에 다시 로그인하지 않고 접근하게 하는 통합 로그인 솔루션입니다. 로그인 편의와 인증 관리 비용을 줄이지만 통합 인증의 보호가 중요합니다.", "FIM(Federated Identity Management)은 서로 독립적으로 관리되는 조직·서비스의 사용자 신원을 연합해 기존 ID를 유지하면서 다른 서비스와 연결합니다."] },
                { type: "table", title: "SSO 구현 모델", columns: ["모델", "동작"], rows: [["위임", "로그인 에이전트가 자격증명을 관리하고 사용자를 대신해 대상 서비스에 로그인"], ["전파", "통합 인증 지점이 발급한 토큰을 서비스에 전달하고 서비스가 이를 검증"], ["위임+전파", "애플리케이션 특성에 따라 두 모델을 혼용"], ["웹 쿠키 도메인", "같은 도메인은 공유 쿠키로 상태 유지; 여러 도메인은 각 도메인별 인증·토큰 에이전트를 둠"]] },
                { type: "table", title: "관련 표준·관리 솔루션", columns: ["기술", "교재가 설명하는 범위"], rows: [["SAML", "서비스 간 사용자 신원 정보를 전달하는 XML 기반 표준"], ["OAuth", "비밀번호를 공유하지 않고 다른 웹사이트·앱에 접근 권한을 부여하는 개방형 표준"], ["EAM", "SSO에 사용자·서비스·역할별 권한 관리와 정책 제어를 더함"], ["IAM", "Identity Management와 Access Management를 통합하고 계정·권한 수명주기를 자동 관리"], ["Provisioning", "사용자에게 시스템 로그인 ID를 발급하는 계정 관리 절차"]] }
              ],
              memoryPoints: ["SSO는 여러 시스템에 대한 인증 재사용, FIM은 조직 간 ID 연계입니다.", "EAM은 권한관리·정책을 포함하고 IAM은 계정 프로비저닝까지 관리합니다.", "SAML은 신원 정보 전달, OAuth는 비밀번호를 넘기지 않고 접근 권한을 부여합니다."]
            },
            {
              id: "device-authentication-and-hsm",
              title: "디바이스 인증과 HSM",
              summary: "네트워크 기기 식별·인증 방식과 하드웨어 보안 모듈의 암호키 보호 역할을 정리합니다.",
              sourcePdfPages: [817, 818],
              keywords: ["Device Authentication", "MAC address", "SSID", "WPA", "RFID", "Challenge-Response", "HSM", "FIPS 140-2"],
              questionKeywords: ["디바이스 인증", "MAC 주소 인증", "SSID 인증", "RFID 인증", "HSM", "Hardware Security Module"],
              blocks: [
                { type: "table", title: "디바이스 인증 방식", columns: ["방식", "동작·용도"], rows: [["아이디·비밀번호", "기기 또는 접속 계정의 지식 요소로 확인"], ["MAC 주소", "등록된 단말 주소를 AP나 인증 서버와 비교해 접속 허용"], ["무선 보안 프로토콜", "AP와 단말 사이 WEP·802.1X·EAP·WPA 계열을 이용해 무선 접속을 확인"], ["시도-응답", "새 난수에 대한 일회성 응답을 확인해 재전송·추측 공격을 줄임"], ["SSID", "AP와 단말이 무선 네트워크 식별자를 공유해 네트워크를 구분"], ["RFID", "태그 ID 또는 태그별 고유 키를 리더와 확인"]] },
                { type: "text", title: "HSM", paragraphs: ["HSM(Hardware Security Module)은 암호화·복호화·전자서명 연산을 빠르게 수행하고 암호키를 생성·안전하게 보관하는 하드웨어 장치입니다. 교재는 FIPS 140-2를 보안성 인증 적용 표준으로 제시합니다."] },
                { type: "text", title: "적용 시 유의", paragraphs: ["디바이스 인증은 네트워크에 참여하는 기기를 식별하고 진위를 판단해 일관된 보안 정책과 상호운용성을 지원합니다. 교재의 MAC·SSID 같은 식별정보 기반 방식은 접속 정책의 한 요소이며, 암호 프로토콜 기반 상호 인증과 구분해 이해합니다."] }
              ],
              memoryPoints: ["MAC 주소는 지정 단말 식별에, 시도-응답은 새 난수 기반 상호 확인에 쓰입니다.", "HSM은 키를 생성·보관하고 암호 연산을 수행하는 하드웨어 장치입니다.", "SSID는 무선 네트워크 식별자이며 단독으로 강한 사용자 인증을 뜻하지는 않습니다."]
            }
          ]
        },
        {
          id: "general-access-control-foundations",
          chapter: "보안 요소 기술",
          status: "published",
          title: "접근통제의 기본 구조와 원칙",
          summary: "주체·객체·권한과 식별·인증·인가 흐름, 접근통제 정책·모델·메커니즘을 학습합니다.",
          sourcePdfPages: [838, 840],
          concepts: [
            {
              id: "access-control-actors-and-process",
              title: "접근통제의 주체·객체와 과정",
              summary: "능동적으로 자원 접근을 요청하는 주체와 보호 대상 객체, 허용 작업을 연결합니다.",
              sourcePdfPages: [838, 839],
              keywords: ["Access Control", "Subject", "Object", "Access", "식별", "인증", "인가"],
              questionKeywords: ["접근통제 개념", "주체 객체 접근", "식별 인증 인가", "접근통제 과정", "책임추적성"],
              blocks: [
                { type: "table", title: "접근통제의 기본 요소", columns: ["요소", "역할", "예"], rows: [["주체(Subject)", "객체·데이터 접근을 요청하는 능동적 개체", "사람, 프로그램, 프로세스"], ["객체(Object)", "접근 대상인 수동적 자원", "파일, 데이터, 프로그램, 프로세스"], ["접근(Access)", "주체가 객체에 수행하려는 작업", "읽기, 생성, 수정, 삭제, 실행"]] },
                { type: "table", title: "접근통제 판단 순서", columns: ["단계", "질문", "예"], rows: [["식별", "누구라고 주장하는가?", "사용자명, ID, 계정 번호"], ["인증", "그 주장이 사실인가?", "비밀번호, 스마트카드, 생체요소"], ["인가", "인증된 주체가 이 작업을 해도 되는가?", "파일 읽기·쓰기·실행 권한"]] },
                { type: "text", title: "책임추적성", paragraphs: ["접근통제는 식별·인증·인가로 구성되며, 시스템에서 주체가 어떤 행위를 했는지 기록하는 책임추적성까지 포함할 수 있습니다. 계정을 여러 사람이 공유하면 행위의 실제 주체를 특정하기 어려워 책임추적성이 약해집니다."] }
              ],
              memoryPoints: ["주체는 요청자, 객체는 보호 대상, 접근은 주체가 수행하려는 작업입니다.", "순서: 식별(누구인가) → 인증(정말 그 사람인가) → 인가(무엇을 할 수 있나).", "책임추적성은 주체의 행위를 기록해 사후에 추적합니다."]
            },
            {
              id: "access-control-principles-and-controls",
              title: "최소권한·직무분리와 통제 유형",
              summary: "필요한 자원만 부여하는 원칙과 상호 견제, 억제부터 회복까지 통제 기능을 구분합니다.",
              sourcePdfPages: [839, 840],
              keywords: ["Least Privilege", "Separation of Duty", "최소권한", "직무분리", "Deterrent", "Preventive", "Detective", "Corrective", "Recovery"],
              questionKeywords: ["최소 권한의 원칙", "직무 분리의 원칙", "접근통제 요구사항", "억제 통제", "예방 통제", "탐지 통제", "회복 통제"],
              blocks: [
                { type: "table", title: "두 가지 접근통제 원칙", columns: ["원칙", "적용"], rows: [["최소권한(Least Privilege)", "업무에 필요한 최소 자원과 권한만 부여해 의도적·실수로 생길 피해를 줄임"], ["직무분리(Separation of Duty)", "한 사람이 전체 업무를 단독 수행하지 못하도록 서로 견제되는 단계를 나눔"]] },
                { type: "text", title: "직무분리 예시", paragraphs: ["교재는 개발과 운영, 보안과 감사, 암호키 변경과 암호키 운영을 분리하는 예를 듭니다. 업무 사이의 상호 견제 기능이 약해지지 않도록 역할을 나눕니다."] },
                { type: "table", title: "통제 기능의 구분", columns: ["유형", "목적", "예"], rows: [["억제(Deterrent)", "사고·침해를 심리적으로 억제", "경고 배너, CCTV, 출입금지 표시"], ["예방(Preventive)", "위해를 사전에 막음", "비밀번호 정책"], ["탐지(Detective)", "침해 시도를 발견", "로그, 키 입력 모니터링"], ["교정(Corrective)", "발생한 피해를 시정", "교정 절차, 연속성 계획"], ["회복(Recovery)", "사고 시스템을 원상태로 복구", "복구 도구, 백업 시스템"]] }
              ],
              memoryPoints: ["최소권한은 권한을 줄여 위험을 제한하고, 직무분리는 한 사람의 독단을 막습니다.", "억제·예방·탐지·교정·회복은 통제 목적이 서로 다릅니다.", "기록은 탐지와 책임추적에, 백업은 회복에 해당합니다."]
            }
          ]
        },
        {
          id: "general-access-control-policies",
          chapter: "보안 요소 기술",
          status: "published",
          title: "접근통제 정책과 구현 방식",
          summary: "MAC·DAC·RBAC 정책과 보안 라벨, 소유자·중앙 관리자 역할, 접근행렬·CL·ACL을 비교합니다.",
          sourcePdfPages: [841, 846],
          concepts: [
            {
              id: "mac-dac-rbac-policy-models",
              title: "MAC·DAC·RBAC 정책 비교",
              summary: "등급, 신원, 역할 가운데 무엇을 기준으로 권한을 부여하는지 구분합니다.",
              sourcePdfPages: [841, 846],
              keywords: ["MAC", "Mandatory Access Control", "DAC", "Discretionary Access Control", "RBAC", "Security Label"],
              questionKeywords: ["MAC DAC RBAC 비교", "강제적 접근통제", "임의적 접근통제", "역할기반 접근통제", "보안 라벨", "접근통제 정책"],
              blocks: [
                { type: "table", title: "세 접근통제 방식", columns: ["방식", "권한 기준·관리자", "핵심"], rows: [["MAC", "주체·객체의 보안 등급·라벨; 시스템이 통제", "중앙 관리자가 정한 엄격한 규칙"], ["DAC", "주체의 신원·ID; 객체 소유자", "소유자가 객체 권한을 분산 설정"], ["RBAC", "조직 내 직무 역할; 중앙 관리자", "권한을 역할에 부여하고 사용자에게 역할을 배정"]] },
                { type: "text", title: "강제적 접근통제(MAC)", paragraphs: ["MAC은 주체의 보안 취급 등급과 객체 보안 라벨을 비교해 접근을 자동으로 결정합니다. 보안 라벨은 민감도 레벨과 카테고리를 포함할 수 있고, 다중 단계 보안(MLS) 환경처럼 강한 중앙 집중 관리가 필요한 경우에 적합합니다.", "장점은 중앙집중 관리와 일관된 강한 보안입니다. 단점은 사용자 기능이 제한되고 운영 관리 부담과 비용이 크며 상업 환경에 맞지 않을 수 있다는 점입니다."] },
                { type: "text", title: "임의적 접근통제(DAC)", paragraphs: ["DAC은 주체 또는 그룹의 신원과 객체 접근 권한에 따라 통제하며 객체 소유자가 권한을 설정·변경할 수 있습니다. Windows·Linux·Unix 등 일반 운영체제에서 널리 쓰이고 세분화와 유연성이 장점입니다.", "사용자가 다른 사용자에게 권한을 넘길 수 있어 시스템 전체의 일관된 통제가 부족해지거나, 권한이 큰 사용자가 자료를 임의 공유할 수 있습니다."] },
                { type: "text", title: "역할기반 접근통제(RBAC)", paragraphs: ["RBAC은 권한을 개인 계정에 직접 주는 대신 직무 역할에 부여하고 사용자에게 역할을 배정합니다. 중앙 관리자가 정책을 정하므로 인사 이동이 잦은 조직에서 관리 효율을 높이며, 최소권한·직무분리·데이터 추상화 정책을 적용하기 쉽습니다.", "DAC보다 관리자 중심의 일관된 통제가 가능하지만, 사용자의 구체적 상황을 세밀하게 반영하기 어렵고 역할 설계가 복잡해질 수 있습니다."] }
              ],
              memoryPoints: ["MAC 기준은 보안 라벨, DAC 기준은 신원, RBAC 기준은 역할입니다.", "MAC 권한은 시스템, DAC는 객체 소유자, RBAC는 중앙 관리자가 정합니다.", "RBAC는 사람에게 권한을 직접 주지 않고 역할에 권한을 주어 사용자에게 연결합니다."]
            },
            {
              id: "access-control-matrix-acl-capability-list",
              title: "접근통제 행렬·ACL·Capability List",
              summary: "주체와 객체 및 권한을 행렬로 표현하고 주체 중심 목록과 객체 중심 목록으로 구현합니다.",
              sourcePdfPages: [844],
              keywords: ["Access Control Matrix", "ACL", "Access Control List", "Capability List", "CL"],
              questionKeywords: ["접근통제 행렬", "ACL", "CL", "접근 가능 자격 목록", "Capability List", "행은 CL"],
              blocks: [
                { type: "table", title: "행렬과 두 목록", columns: ["구조", "관점", "내용"], rows: [["접근통제 행렬", "주체와 객체 관계 전체", "주체를 행, 객체를 열로 두고 교차 셀에 읽기·쓰기 등 권한 기록"], ["CL(Capability List)", "주체 중심", "한 주체가 접근할 수 있는 객체와 각 권한을 나열; 행렬의 행에 해당"], ["ACL(Access Control List)", "객체 중심", "한 객체에 접근할 수 있는 주체와 권한을 나열; 행렬의 열에 해당"]] },
                { type: "text", title: "표현과 관리", paragraphs: ["접근통제 행렬은 이론적인 전체 구조입니다. 실제 구현에서 CL은 사용자에게 어떤 객체를 허용할지를 기록하고 ACL은 각 객체의 권한 목록을 기록합니다. 행렬은 관계를 직접 표현하기 쉽지만 주체와 객체 수가 많으면 관리가 어려워집니다."] }
              ],
              memoryPoints: ["행렬의 행은 주체, 열은 객체입니다.", "CL은 주체 중심의 행, ACL은 객체 중심의 열을 표현합니다.", "'이 사용자가 어디에 접근할 수 있나'는 CL, '이 파일에 누가 접근할 수 있나'는 ACL입니다."]
            }
          ]
        },
        {
          id: "general-access-control-security-models",
          chapter: "보안 요소 기술",
          status: "published",
          title: "접근통제 보안 모델",
          summary: "기밀성 중심 BLP와 무결성 중심 Biba, 상업용 무결성 모델, 이해충돌 차단과 정보 흐름을 비교합니다.",
          sourcePdfPages: [847, 849],
          concepts: [
            {
              id: "blp-biba-security-models",
              title: "Bell–LaPadula와 Biba",
              summary: "BLP는 기밀성, Biba는 무결성을 보호하며 읽기·쓰기 방향 규칙이 서로 반대입니다.",
              sourcePdfPages: [847, 848],
              keywords: ["Bell-LaPadula", "BLP", "Biba", "No Read Up", "No Write Down", "No Read Down", "No Write Up"],
              questionKeywords: ["벨-라파둘라 모델", "Bell-LaPadula", "비바 모델", "Biba", "No Read Up", "No Write Down", "No Read Down", "No Write Up"],
              blocks: [
                { type: "table", title: "보호 목표와 기본 규칙", columns: ["모델", "목표", "읽기 규칙", "쓰기 규칙"], rows: [["Bell–LaPadula (BLP)", "기밀성", "No Read Up: 낮은 등급 주체는 높은 등급 객체를 읽지 못함", "No Write Down: 높은 등급 주체는 낮은 등급 객체에 쓰지 못함"], ["Biba", "무결성", "No Read Down: 높은 무결성 주체는 낮은 무결성 객체를 읽지 못함", "No Write Up: 낮은 무결성 주체는 높은 무결성 객체를 수정하지 못함"]] },
                { type: "text", title: "강한 스타 규칙과 호출 규칙", paragraphs: ["BLP의 특수 스타 속성은 같은 레벨에서 읽기와 쓰기만 허용합니다. 교재는 BLP에서 낮은 등급 주체가 상위 객체를 보지 않고 수정할 수 있는 Blind Write가 가능해 무결성이 보장되지 않을 수 있다고 설명합니다.", "Biba는 무결성 수준을 보호하는 상태 머신 모델입니다. 교재는 No Read Down·No Write Up 외에 높은 무결성 주체에 서비스를 요청할 수 없는 호출 속성을 제시합니다."] },
                { type: "text", title: "방향을 빠르게 구분", paragraphs: ["기밀성 BLP는 정보가 높은 등급에서 낮은 등급으로 새지 않도록 '위로 읽지 않고 아래로 쓰지 않음'을 기억합니다. 무결성 Biba는 낮은 신뢰 정보가 높은 무결성 영역을 오염시키지 않도록 '아래로 읽지 않고 위로 쓰지 않음'을 적용합니다."] }
              ],
              memoryPoints: ["BLP는 기밀성: No Read Up, No Write Down; 강한 스타는 동일 등급 읽기·쓰기입니다.", "Biba는 무결성: No Read Down, No Write Up입니다.", "BLP는 기밀성은 다루지만 무결성까지 보장하지 않습니다."]
            },
            {
              id: "commercial-integrity-and-chinese-wall",
              title: "Clark–Wilson과 Chinese Wall 모델",
              summary: "상업 환경의 데이터 무결성·일관성 보호와 사용자의 과거 접근에 따른 이해충돌 차단을 설명합니다.",
              sourcePdfPages: [848, 849],
              keywords: ["Clark-Wilson", "Chinese Wall Model", "무결성", "이해충돌", "직무분리"],
              questionKeywords: ["클락-월슨 무결성 모델", "Clark-Wilson", "만리장성 모델", "Chinese Wall", "이해충돌 방지"],
              blocks: [
                { type: "table", title: "두 모델의 목표", columns: ["모델", "환경·목표", "핵심"], rows: [["Clark–Wilson", "상업용 애플리케이션의 데이터 무결성과 일관성", "비인가자의 부적절한 변경, 내부·외부 객체 일관성 훼손, 합법적 사용자의 불법 수정 방지; 사용자는 프로그램을 통해서만 객체에 접근"], ["Chinese Wall", "직무분리와 이해충돌 방지", "사용자의 이전 동작에 따라 접근 허용을 바꾸어 충돌 관계가 있는 자원 간 정보 흐름을 차단"]] },
                { type: "text", title: "Chinese Wall의 동적 권한", paragraphs: ["Chinese Wall 모델은 사용자별 과거 접근 이력을 바탕으로 충돌을 일으킬 수 있는 다른 자원의 접근을 제한합니다. 이전 접근에 따라 접근 가능 범위가 달라집니다."] }
              ],
              memoryPoints: ["Clark–Wilson은 상업 환경의 데이터 무결성·일관성을 다룹니다.", "Clark–Wilson에서는 사용자가 프로그램을 통해서만 객체에 접근합니다.", "Chinese Wall은 이전 접근 이력에 따라 이해충돌이 생기는 자원 접근을 막습니다."]
            },
            {
              id: "information-flow-and-covert-channels",
              title: "정보 흐름 모델과 은닉 채널",
              summary: "보안 수준 사이 정보 이동을 통제하는 모델과 보안 메커니즘을 우회해 정보를 몰래 전달하는 경로를 알아봅니다.",
              sourcePdfPages: [849],
              keywords: ["Information Flow Model", "정보 흐름", "Covert Channel", "은닉 채널", "비밀 채널"],
              questionKeywords: ["정보 흐름 모델", "은닉 채널", "비밀 채널", "BLP Biba 정보 흐름"],
              blocks: [
                { type: "text", title: "정보 수준 간 흐름", paragraphs: ["정보 흐름 모델은 기밀성 또는 무결성 수준이 다른 영역 사이의 이동을 포함해 시스템 내 정보 흐름을 다룹니다. BLP와 Biba 같은 모델이 정보 흐름 정책의 사례입니다.", "정책이 정상적으로 적용되더라도 메커니즘을 우회하는 은닉 채널(Covert Channel)을 통해 정보가 비밀리에 전달될 수 있습니다. 보호 정책은 은닉 채널이 생기는 경로와 이를 제한하는 규칙도 고려해야 합니다."] },
                { type: "table", title: "은닉 채널 관점", columns: ["정상 경로", "은닉 채널"], rows: [["정책이 정한 주체·객체·권한으로 데이터 전달", "정상 보안 메커니즘을 우회해 보호 정보를 몰래 송수신"], ["접근통제 규칙이 흐름을 검사", "정책을 지켜 보이면서 별도의 신호 경로를 숨길 수 있음"]] }
              ],
              memoryPoints: ["정보 흐름은 서로 다른 보안 수준 사이의 데이터 이동을 통제합니다.", "은닉 채널은 보안 메커니즘을 우회해 보호 정보를 비밀리에 전달하는 경로입니다.", "BLP는 기밀성, Biba는 무결성을 중심으로 정보 흐름을 제한합니다."]
            }
          ]
        },
        {
          id: "general-digital-signatures-certificates",
          chapter: "보안 요소 기술",
          status: "published",
          title: "전자서명과 인증서",
          summary: "전자서명이 제공하는 보안 속성, 서명 생성·검증 흐름, X.509 인증서와 서명 방식의 차이를 학습합니다.",
          sourcePdfPages: [866, 873],
          concepts: [
            {
              id: "x509-certificate-structure",
              title: "X.509 공개키 인증서",
              summary: "인증기관이 서명한 인증서는 공개키와 주체의 신원을 결합하고 유효기간과 용도를 확인할 근거를 제공합니다.",
              sourcePdfPages: [866, 868],
              keywords: ["X.509", "인증서", "Certificate", "공개키", "Issuer", "Subject", "Extensions", "Device Certificate"],
              questionKeywords: ["X.509 인증서 구조", "X.509 인증서", "인증서 구성 요소", "인증서 특징", "디바이스 인증서"],
              blocks: [
                { type: "text", title: "공개키와 신원의 연결", paragraphs: ["공개키 인증서는 공개키가 특정 사용자·서버·기관의 것임을 확인할 수 있도록 신원 정보와 공개키를 결합하고 발급자의 전자서명을 붙인 데이터입니다. 상대방은 신뢰하는 발급자의 공개키로 인증서 서명을 검증해 내용의 무결성과 발급자를 확인합니다.", "인증서는 공개키의 소유자를 확인하는 수단이지 통신 내용을 암호화하는 기능 그 자체는 아닙니다. 전자서명만으로 기밀성이 생기지 않으므로 기밀성이 필요하면 별도 암호화가 필요합니다."] },
                { type: "table", title: "X.509 인증서의 주요 필드", columns: ["필드", "역할"], rows: [["Version", "인증서 형식의 버전; v3는 확장(Extensions) 필드를 지원"], ["Serial Number", "발급기관이 인증서를 구분하기 위해 부여하는 번호"], ["Signature Algorithm Identifier", "발급기관 서명에 사용한 알고리즘 식별"], ["Issuer Name / Validity Period", "발급자 이름 / 시작·종료 유효기간"], ["Subject Name / Public Key Information", "인증서 대상 주체 / 주체의 공개키와 알고리즘"], ["Issuer·Subject Unique ID", "발급자 또는 주체를 구별하는 선택 필드"], ["Extensions", "키 용도, 정책, CRL 정보, 제약조건 등 추가 정보; v3에서 사용"], ["Signature", "발급자가 인증서 내용에 대해 생성한 서명"]] },
                { type: "text", title: "인증서의 범위", paragraphs: ["인증서는 유효기간, 키 용도와 정책, 폐지 여부를 함께 확인해야 합니다. 교재는 RSA·ECC 공개키를 사용하는 IoT 기기·서버·모바일 단말용 디바이스 인증서도 다룹니다. 기기 폐기 시 인증서 폐지와 유효기간 도래 시 갱신이 관리 항목입니다."] }
              ],
              memoryPoints: ["인증서는 공개키와 주체의 신원을 발급기관 서명으로 묶습니다.", "X.509 v3의 Extensions에는 키 용도·정책·폐지 정보 등이 들어갈 수 있습니다.", "인증서나 전자서명만으로 기밀성이 보장되지는 않습니다."]
            },
            {
              id: "digital-signature-properties-and-process",
              title: "전자서명의 보안 속성과 생성·검증",
              summary: "서명은 메시지 다이제스트를 서명자 개인키로 서명하고 공개키로 확인해 출처와 무결성을 검증합니다.",
              sourcePdfPages: [868, 872],
              keywords: ["Digital Signature", "전자서명", "무결성", "부인방지", "전자봉투", "개인키", "공개키"],
              questionKeywords: ["전자서명의 특징", "전자서명 생성 절차", "전자서명 검증", "전자봉투", "전자서명 기밀성"],
              blocks: [
                { type: "table", title: "전자서명이 제공하는 속성", columns: ["속성", "의미"], rows: [["위조 불가", "서명 생성키를 가진 서명자만 유효한 서명을 생성"], ["서명자 인증", "검증자가 서명자의 공개키로 서명자를 확인"], ["부인방지", "서명자가 유효하게 서명한 사실을 부인하기 어렵게 함"], ["무결성", "서명 이후 문서가 변경되면 검증 결과로 변경을 탐지"], ["재사용 방지", "서명은 해당 문서와 결합되어 다른 문서에 그대로 재사용할 수 없음"]] },
                { type: "diagram", title: "메시지 서명과 검증", nodes: [{ label: "송신자", detail: "메시지 해시 → 다이제스트를 개인키로 서명" }, { label: "전송", detail: "메시지와 전자서명을 전달" }, { label: "수신자", detail: "메시지 해시 후 서명을 공개키로 검증" }], caption: "수신자는 직접 계산한 다이제스트와 서명에서 검증한 다이제스트를 비교합니다. 이 서명 절차만으로 메시지가 암호화되지는 않습니다." },
                { type: "text", title: "전자봉투와 결합", paragraphs: ["전자봉투는 메시지와 전자서명을 대칭키로 암호화하고, 그 대칭키를 수신자의 공개키로 암호화해 수신자만 복호화할 수 있게 합니다. 서명은 송신자 인증·무결성·부인방지를, 전자봉투는 전송 데이터의 기밀성을 보완합니다."] }
              ],
              memoryPoints: ["송신자는 메시지 다이제스트를 자신의 개인키로 서명하고, 수신자는 송신자 공개키로 검증합니다.", "서명은 기밀성을 제공하지 않으므로 필요하면 전자봉투 등 별도 암호화를 사용합니다.", "전자봉투는 데이터용 대칭키를 수신자 공개키로 보호합니다."]
            },
            {
              id: "digital-signature-scheme-types",
              title: "메시지 복원형과 부가형 서명",
              summary: "서명 검증 결과에서 원문을 복원하는 방식과 원문에 서명을 덧붙이는 방식을 구별합니다.",
              sourcePdfPages: [872, 873],
              keywords: ["Message Recovery", "Signature with Appendix", "RSA", "ElGamal", "DSS", "DSA", "KCDSA", "Schnorr"],
              questionKeywords: ["메시지 복원형 전자서명", "메시지 부가형 전자서명", "RSA 전자서명", "ElGamal", "DSS", "KCDSA"],
              blocks: [
                { type: "table", title: "두 서명 방식", columns: ["구분", "메시지 복원형", "메시지 부가형"], rows: [["검증", "서명 검증 과정에서 원문 메시지를 복원", "원문 메시지와 별도로 전달된 서명을 검증"], ["프로토콜", "별도의 서명 프로토콜이 필요하지 않을 수 있음", "원문과 서명을 함께 다루는 서명 프로토콜 사용"], ["교재의 대표 예", "RSA", "ElGamal, DSS/DSA, KCDSA, Schnorr 등"]] },
                { type: "text", title: "선택 시 주의", paragraphs: ["교재는 메시지 복원형이 메시지 전체를 다뤄 서명 생성·검증 시간이 커질 수 있다고 비교합니다. 실제 선택에서는 메시지 크기, 전송 형식과 표준 프로토콜 요구를 함께 고려해야 합니다."] }
              ],
              memoryPoints: ["메시지 복원형은 검증 과정에서 원문을 복원하고, 부가형은 원문과 서명을 분리해 전달합니다.", "교재 비교표의 메시지 복원형 대표는 RSA입니다."]
            }
          ]
        },
        {
          id: "general-pki-and-certificate-status",
          chapter: "보안 요소 기술",
          status: "published",
          title: "PKI와 인증서 상태 관리",
          summary: "공개키 기반 구조의 기관 역할과 신뢰 구조, 인증서 폐지 목록·온라인 상태 확인, 무선 PKI를 정리합니다.",
          sourcePdfPages: [873, 880],
          concepts: [
            {
              id: "pki-components-and-roles",
              title: "PKI 구성요소와 기관 역할",
              summary: "정책·발급·등록·검증·저장과 폐지 확인을 여러 PKI 구성요소가 분담합니다.",
              sourcePdfPages: [873, 875],
              keywords: ["PKI", "PAA", "PCA", "CA", "RA", "VA", "CRL", "Repository", "OCSP", "Root CA"],
              questionKeywords: ["PKI 구성요소", "PAA PCA CA RA VA", "인증기관", "등록기관", "검증기관", "PKI 특징"],
              blocks: [
                { type: "table", title: "PKI 구성요소", columns: ["구성요소", "주요 역할"], rows: [["PAA (Policy Approving Authority)", "PKI 정책과 절차를 승인"], ["PCA (Policy Certification Authority)", "정책 도메인에서 인증기관 정책을 정하거나 관리"], ["CA (Certification Authority)", "인증서를 발급·서명하고 관리"], ["RA (Registration Authority)", "신청자 신원 확인과 인증서 발급 요청을 중계"], ["VA (Validation Authority)", "인증서의 유효성 검증 서비스 제공"], ["CRL·OCSP", "폐지된 인증서 목록 또는 온라인 상태 응답 제공"], ["Repository", "인증서와 관련 정보를 저장·배포"]] },
                { type: "text", title: "신뢰와 상호운용", paragraphs: ["PKI는 공개키와 인증서를 이용해 통신 당사자를 인증하고 무결성·기밀성·부인방지와 같은 서비스를 지원하는 기반 구조입니다. 인증서를 신뢰하려면 인증서 서명뿐 아니라 신뢰할 수 있는 CA까지 이어지는 발급 경로와 유효기간·폐지 상태를 확인해야 합니다.", "최상위 신뢰점인 Root CA는 자신의 인증서를 자체 서명하는 방식으로 신뢰 체계의 시작점이 됩니다. 교재는 PAA가 최상위 정책 승인 역할을 수행하는 경우도 설명합니다."] },
                { type: "table", title: "PKI 신뢰 구조", columns: ["구조", "구성", "장점과 고려점"], rows: [["계층형", "Root CA 아래에 하위 CA를 두고 상위가 하위 인증서를 발급", "경로 검증이 비교적 쉽고 계층 조직에 적합; 루트 키와 최상위 기관에 신뢰가 집중"], ["네트워크형", "독립 CA들이 상호 인증으로 신뢰 연결", "분산된 도메인 간 연결에 적합; 상호 인증 관계와 경로 관리가 복잡"], ["혼합형", "계층형과 네트워크형 구조를 함께 사용", "조직별 운영과 도메인 간 신뢰를 절충"]] }
              ],
              memoryPoints: ["CA는 인증서 발급·서명, RA는 신청자 확인·중계, VA는 유효성 검증을 담당합니다.", "Root CA는 PKI 계층 구조에서 최상위 신뢰점입니다.", "계층형은 경로가 명료하고 네트워크형은 독립 CA 간 상호 인증을 사용합니다."]
            },
            {
              id: "crl-ocsp-certificate-revocation",
              title: "CRL과 OCSP 인증서 폐지 확인",
              summary: "CRL의 배치형 폐지목록과 OCSP의 온라인 상태 응답을 비교하고 폐지 상태를 판독합니다.",
              sourcePdfPages: [877, 879],
              keywords: ["CRL", "Certificate Revocation List", "OCSP", "Good", "Revoked", "Unknown", "Hold", "RFC 2560", "RFC 3280"],
              questionKeywords: ["CRL과 OCSP 비교", "인증서 폐지 목록", "OCSP 응답", "인증서 효력 중지", "인증서 해지"],
              blocks: [
                { type: "table", title: "폐지 상태", columns: ["상태", "의미"], rows: [["Revoked", "인증서가 영구적으로 해지됨. 키 유출이나 잘못된 발급 등이 원인일 수 있음"], ["Hold", "인증서 효력이 임시 중지되어 이후 복구 여부를 판단할 수 있음"], ["유효기간 만료", "인증서의 종료 시각이 지남; 폐지와는 별개의 상태"]] },
                { type: "table", title: "CRL과 OCSP 비교", columns: ["항목", "CRL", "OCSP"], rows: [["확인 방식", "CA가 발행한 폐지목록을 클라이언트가 내려받아 조회", "클라이언트가 서버에 특정 인증서 상태를 온라인 질의"], ["정보와 시점", "목록 갱신 주기 사이 정보가 늦을 수 있음; 목록에 없는 인증서는 목록 관점에서 판단", "질의 시점의 Good·Revoked·Unknown 상태 응답"], ["운영 특성", "배치형이며 목록 크기와 배포 주기를 고려", "실시간성이 높지만 질의량에 따른 서버 부하·비용 고려"], ["교재 표의 RFC", "RFC 3280", "RFC 2560"]] },
                { type: "text", title: "OCSP 응답", paragraphs: ["OCSP의 Good은 조회 시점에 서버가 폐지 사실을 확인하지 못한 유효 상태, Revoked는 영구 폐지 또는 일시 정지, Unknown은 서버가 해당 인증서에 관한 정보를 알지 못하는 상태입니다. OCSP 응답이 있다는 사실만으로 인증서 경로 전체가 자동으로 신뢰되는 것은 아니므로 인증서 체인과 정책 검증은 별도로 고려합니다.", "교재의 표에는 OCSP RFC 2560, CRL RFC 3280로 제시되어 있습니다. 이는 교재에 인쇄된 표준 번호를 기록한 것으로, 현재 표준 상태를 갱신해 설명하는 항목은 아닙니다."] }
              ],
              memoryPoints: ["CRL은 폐지 목록을 배포하는 방식, OCSP는 개별 인증서 상태를 온라인으로 묻는 방식입니다.", "OCSP 응답은 Good·Revoked·Unknown으로 구분합니다.", "Hold는 영구 해지가 아니라 임시 효력 중지입니다."]
            },
            {
              id: "wpki-wireless-pki",
              title: "무선 공개키 기반 구조 WPKI",
              summary: "WAP 기반 무선 환경에 맞춰 인증서를 발급·운영·관리하는 공개키 기반 구조입니다.",
              sourcePdfPages: [880],
              keywords: ["WPKI", "Wireless PKI", "WAP", "CA", "RA", "OCSP", "무선 인증서"],
              questionKeywords: ["WPKI", "무선 PKI", "WAP 기반 공개키 기반 구조"],
              blocks: [
                { type: "text", title: "무선 환경의 인증 기반", paragraphs: ["WPKI는 WAP 기반 서버와 클라이언트의 인증을 위해 무선 환경에 적합한 인증서를 발급하고 운영·관리하는 무선망 공개키 기반 구조입니다. 구성에는 CA·RA 서버, 클라이언트, 디렉터리 서버, OCSP 서버와 전자서명 응용이 포함됩니다.", "RA는 신청자의 신원을 확인해 CA로 요청을 전달하고, CA는 인증서를 발급·관리합니다. 디렉터리는 인증서 정보를 저장하며 OCSP는 인증서 상태 확인에 쓰입니다."] }
              ],
              memoryPoints: ["WPKI는 WAP 기반 무선 환경에 적합하도록 인증서를 발급·관리하는 PKI입니다.", "주요 구성은 CA, RA, 클라이언트, 디렉터리, OCSP와 전자서명 응용입니다."]
            }
          ]
        },
        {
          id: "general-digital-signature-applications",
          chapter: "보안 요소 기술",
          status: "published",
          title: "전자서명 응용과 특수 서명",
          summary: "전자입찰·투표, XML 전자서명, 은닉서명과 SET 이중서명, 특수 전자서명 유형을 정리합니다.",
          sourcePdfPages: [880, 886],
          concepts: [
            {
              id: "electronic-tender-voting-signature",
              title: "전자입찰과 전자투표",
              summary: "전자서명과 해시를 사용해 입찰의 무결성·비밀성을 지키고 투표의 정당성과 익명성을 확보합니다.",
              sourcePdfPages: [880, 882],
              keywords: ["전자입찰", "LKR", "PL", "전자투표", "PSEV", "Kiosk", "REV", "익명성", "완전성"],
              questionKeywords: ["전자입찰 요구사항", "전자투표 방식", "PSEV Kiosk REV", "전자투표시스템 요구조건"],
              blocks: [
                { type: "table", title: "전자입찰과 전자투표의 고려사항", columns: ["응용", "핵심 처리·요구"], rows: [["전자입찰", "입찰 내용의 해시와 전자서명으로 무결성과 부인방지를 확인하고 입찰 정보의 기밀성과 공정성 유지"], ["전자투표", "검증가능성, 정당성, 완전성, 자격 제한, 이중투표 방지, 익명성, 건전성을 갖추도록 설계"]] },
                { type: "table", title: "전자투표 방식", columns: ["방식", "투표 환경"], rows: [["PSEV (Poll Site E-Voting)", "지정된 투표소의 전자투표 장치 사용"], ["Kiosk", "유동 인구가 있는 곳 등에 키오스크 설치"], ["REV (Remote Internet E-Voting)", "원격 인터넷을 통해 투표"]] },
                { type: "text", title: "요구조건의 균형", paragraphs: ["전자투표는 투표 자격이 있는 사람만 참여하고 한 사람이 중복 투표하지 못하게 하면서, 투표 내용이 누구에게도 식별되지 않도록 해야 합니다. 동시에 투표가 빠짐없이 반영되고 결과를 검증할 수 있어야 합니다. 익명성만 강화해 정당성 검증을 잃거나, 검증을 위해 신원을 투표 내용과 연결하지 않도록 설계해야 합니다."] }
              ],
              memoryPoints: ["PSEV는 지정 투표소 장치, Kiosk는 키오스크, REV는 원격 인터넷 투표입니다.", "전자투표 요구조건에는 검증가능성·정당성·완전성·자격제한·중복방지·익명성·건전성이 포함됩니다.", "전자입찰은 입찰 내용의 기밀성과 서명을 통한 무결성·부인방지를 함께 고려합니다."]
            },
            {
              id: "xml-signature-and-blind-signature",
              title: "XML 전자서명과 은닉서명",
              summary: "XML 문서 내 서명 배치 형태와 서명자가 메시지를 보지 않고 서명하는 은닉서명의 목적·한계를 구별합니다.",
              sourcePdfPages: [882, 884],
              keywords: ["XML Signature", "SignedInfo", "SignatureValue", "KeyInfo", "Object", "Enveloped", "Enveloping", "Detached", "Blind Signature", "Chaum"],
              questionKeywords: ["XML 전자서명", "Enveloped Enveloping Detached", "은닉서명", "블라인드 서명"],
              blocks: [
                { type: "table", title: "XML Signature 주요 요소", columns: ["요소", "역할"], rows: [["Signature", "XML 전자서명 전체 구조"], ["SignedInfo", "서명 대상 참조와 정규화·다이제스트·서명 알고리즘 정보"], ["SignatureValue", "SignedInfo에 대한 서명값"], ["KeyInfo", "검증에 사용할 키 또는 인증서 정보"], ["Object", "서명과 함께 전달할 임의의 데이터"]] },
                { type: "table", title: "서명과 데이터의 배치", columns: ["형태", "배치"], rows: [["Enveloped", "서명 요소가 서명 대상 XML 문서 안에 들어감"], ["Enveloping", "서명 대상 데이터가 Signature 요소 안에 들어감"], ["Detached", "서명과 대상 데이터가 분리되어 별도로 참조됨"]] },
                { type: "text", title: "은닉서명", paragraphs: ["은닉서명(Blind Signature)은 이용자가 메시지를 가린 형태로 서명을 요청해 서명자가 원문을 알지 못한 채 서명하게 하는 기법입니다. 전자현금 등에서 서명자와 이용 내역을 분리해 프라이버시를 높이는 데 활용됩니다.", "익명성은 자금세탁 등 악용 추적을 어렵게 할 수 있습니다. 교재는 필요할 때 추적 가능한 공정 은닉서명(Fair Blind Signature)을 역기능 대응 방안으로 설명합니다."] }
              ],
              memoryPoints: ["Enveloped는 서명이 문서 안에, Enveloping은 데이터가 Signature 안에, Detached는 서로 분리됩니다.", "은닉서명은 서명자가 메시지 원문을 보지 않고 서명하게 합니다.", "은닉서명의 익명성과 악용 추적 가능성 사이 균형을 고려합니다."]
            },
            {
              id: "set-dual-signature-and-special-signatures",
              title: "SET 이중서명과 특수 전자서명",
              summary: "구매자 정보와 지불 정보를 분리해 각 당사자의 정보 노출을 제한하는 이중서명과 기타 특수 서명 유형을 살펴봅니다.",
              sourcePdfPages: [884, 886],
              keywords: ["Dual Signature", "SET", "구매정보", "지불정보", "Payment Gateway", "확인 서명", "지정 검증자", "위임 서명", "다중 서명"],
              questionKeywords: ["이중서명 생성 절차", "SET 이중서명", "구매정보 지불정보", "특수 전자서명", "위임서명", "다중서명"],
              blocks: [
                { type: "diagram", title: "SET 이중서명의 분리 검증", nodes: [{ label: "구매자", detail: "구매정보 M1·지불정보 M2를 각각 해시하고 결합 다이제스트에 서명" }, { label: "판매자", detail: "구매정보 M1과 결합값으로 서명을 검증; 지불정보는 보지 않음" }, { label: "PG", detail: "복호화한 지불정보 M2와 결합값으로 검증; 구매정보는 보지 않음" }], caption: "SET 이중서명은 판매자와 결제 게이트웨이가 각자 필요한 정보만 확인하면서 동일 주문의 연결성을 검증하게 합니다." },
                { type: "text", title: "생성과 검증의 핵심", paragraphs: ["구매자는 구매정보 M1과 지불정보 M2를 각각 해시하고 두 다이제스트를 결합해 다시 해시한 값에 개인키로 서명합니다. 지불정보는 대칭키로 암호화하고 대칭키는 PG의 공개키로 암호화해 전자봉투로 전달합니다.", "판매자는 평문 구매정보로 M1을 다시 계산하고 전달된 결합 정보와 서명을 검증하지만 지불정보를 볼 수 없습니다. PG는 전자봉투를 열어 지불정보에서 M2를 계산하고 서명을 검증하지만 구매정보를 알 수 없습니다. 두 검증은 같은 거래의 구매·지불 정보가 함께 서명되었음을 확인합니다."] },
                { type: "table", title: "그 밖의 특수 서명", columns: ["유형", "구별점"], rows: [["확인 서명(undeniable/confirmation)", "서명 검증을 위해 서명자의 확인 절차가 필요"], ["지정 검증자 서명", "지정된 검증자만 서명을 확인할 수 있도록 제한"], ["위임 서명", "서명 권한을 위임받은 사람이 위임자를 대신해 서명"], ["다중 서명", "한 문서에 여러 서명자의 서명을 결합"]] }
              ],
              memoryPoints: ["SET 이중서명은 구매정보와 지불정보를 각각 해시한 뒤 결합값에 서명합니다.", "판매자는 구매정보만, PG는 지불정보만 확인할 수 있도록 정보 공개를 분리합니다.", "이중서명은 SET 결제 거래의 연결성·무결성을 확인하면서 각 당사자의 정보 노출을 제한합니다."]
            }
          ]
        }
      ]
    },
    {
      id: "information-security-management-law",
      title: "정보보안 관리 및 법규",
      description: "정보보호 거버넌스와 위험관리부터 보안 운영, 인증제도, 정보보호 법규까지 교재 순서로 학습합니다.",
      units: [
        {
          id: "management-security-governance",
          chapter: "정보보호 관리",
          status: "published",
          title: "정보보호 관리와 거버넌스",
          summary: "정보보호의 목표와 통제, 거버넌스 프레임워크, 조직별 책임과 상위 보안 문서를 연결합니다.",
          sourcePdfPages: [914, 920],
          concepts: [
            {
              id: "management-information-security-goals",
              title: "정보보호의 목적과 보안 속성",
              summary: "정보의 생애주기 전반에서 CIA를 보호하고 책임추적성과 인증으로 보완합니다.",
              sourcePdfPages: [914, 915],
              keywords: ["Information Security", "기밀성", "무결성", "가용성", "책임추적성", "인증", "CIA"],
              questionKeywords: ["정보보호의 목적", "기밀성 무결성 가용성", "정보보안 속성", "책임추적성", "가용성 특징"],
              blocks: [
                { type: "text", title: "보호 범위와 균형", paragraphs: ["정보보호는 정보의 수집·저장·송수신 등 처리 전 과정에서 발생할 수 있는 위조·변조·훼손·유출·사용 방해를 막고 정보자산을 안전하게 관리하는 활동입니다. 조직은 정보의 흐름 전체를 대상으로 보호 목표와 통제를 정합니다.", "정보보호의 기본 목표는 기밀성·무결성·가용성입니다. 어느 하나를 무조건 높이는 대신 업무와 위험에 맞는 균형을 잡아야 합니다. 예를 들어 암호화와 접근 제한을 과도하게 적용하면 이용성이 낮아져 가용성이 떨어질 수 있습니다."] },
                { type: "table", title: "정보보호의 기본 속성", columns: ["속성", "의미", "교재 예시"], rows: [["기밀성 (Confidentiality)", "정보가 비인가자에게 노출되지 않게 보호", "암호화, 접근제어, 비밀번호"], ["무결성 (Integrity)", "비인가 변경·삭제를 막아 정보의 정확성과 완전성을 보장", "체크섬, 해시, 전자서명"], ["가용성 (Availability)", "권한 있는 사용자가 필요할 때 정보와 서비스를 지속 이용", "백업, RAID, 재해복구"], ["책임추적성 (Accountability)", "사용자·프로세스 행위를 추적하고 책임을 연결", "로그 관리와 감사"], ["인증 (Authentication)", "요청 주체가 주장한 신원과 권한을 확인", "사용자·시스템 인증"]] },
                { type: "text", title: "속성 간 trade-off", paragraphs: ["기밀성을 위해 암호화를 강화하거나 접근을 엄격히 제한하면 정보 이용이 불편해질 수 있습니다. 가용성을 높이려 접근 제한을 완화하면 기밀성이 훼손될 수 있습니다. 정책은 업무 요구와 위험을 함께 고려해 통제 강도를 정해야 합니다."] }
              ],
              memoryPoints: ["기본 목표 CIA는 기밀성·무결성·가용성입니다.", "로그는 행위 추적과 책임추적성(Accountability)에 연결됩니다.", "정보보호 정책은 CIA 간 균형과 업무상 가용성을 함께 고려합니다."]
            },
            {
              id: "security-controls-and-constraints",
              title: "정보보호 대책과 제약조건",
              summary: "관리적·물리적·기술적 대책을 조합하고 실행 제약을 고려합니다.",
              sourcePdfPages: [915, 917],
              keywords: ["관리적 대책", "물리적 대책", "기술적 대책", "Temporal Constraints", "Financial Constraints", "Legal Constraints"],
              questionKeywords: ["정보보호 대책 유형", "관리적 물리적 기술적 대책", "정보보호 제약", "예방대책"],
              blocks: [
                { type: "table", title: "예방 대책의 유형", columns: ["유형", "목적과 예시"], rows: [["관리적", "정책·법제·교육·절차·위험분석·감사로 보안 운영을 통제; 문서 처리 순서 표준화"], ["물리적", "시설과 장비에 대한 무단 접근·침입을 제한; 출입통제와 잠금장치"], ["환경적", "화재·수해·지진·태풍 등 환경 사고에 대비해 처리시설을 보호"], ["기술적", "접근통제·암호·백업·보안 소프트웨어·침입차단 등 정보시스템과 데이터를 보호"]] },
                { type: "table", title: "대책 수립 시 제약", columns: ["제약", "고려 사항"], rows: [["시간적", "보호 대책을 정해진 일정과 기간 안에 구축·운영할 수 있는지"], ["재정적", "제한된 예산 안에서 필요한 위험수용 수준과 보안 효과를 달성할 수 있는지"], ["기술적", "필요한 기술 역량·인력·자원이 확보되어 있는지"], ["사회적", "사용자와 조직 구성원의 문화·행동 요인이 구현과 준수에 미치는 영향"], ["환경적", "자연환경·도시구조·기후 등 물리적 조건이 시설과 운영에 미치는 영향"], ["법적", "관할 국가·지역의 법률과 규제가 정보 처리와 보호에 미치는 영향"]] },
                { type: "text", title: "비용과 운영 가능성", paragraphs: ["대책은 위험분석 결과에 맞추되 초기 구축비용뿐 아니라 지속적인 운영비용, 조직의 환경과 문화, 구현 가능성도 고려합니다. 한 가지 대책에만 의존하기보다 관리적·물리적·기술적 통제를 함께 적용할 수 있습니다."] }
              ],
              memoryPoints: ["기본 예방 대책은 관리적·물리적·기술적이며 환경 보호도 별도로 고려합니다.", "대책 선택에는 구축비용뿐 아니라 운영 비용, 조직 문화, 시간·기술·법적 제약이 영향을 줍니다.", "위험분석 결과와 업무 운영 가능성을 함께 보고 통제를 조합합니다."]
            },
            {
              id: "security-governance-and-frameworks",
              title: "정보보호 거버넌스와 프레임워크",
              summary: "경영 목표와 보안 책임을 연결하는 거버넌스의 구성요소와 대표 프레임워크를 구분합니다.",
              sourcePdfPages: [917, 919],
              keywords: ["ISO/IEC 27014", "정보보호 거버넌스", "COBIT", "ISO/IEC 27001", "NIST CSF", "ITIL", "KPI", "KRI"],
              questionKeywords: ["정보보호 거버넌스", "ISO 27014", "COBIT", "ISO 27001", "NIST 사이버보안 프레임워크", "ITIL"],
              blocks: [
                { type: "text", title: "거버넌스의 목적", paragraphs: ["정보보호 거버넌스는 조직의 정보보호 방향과 책임을 정하고 보안 활동이 경영 목표를 효과적으로 지원하도록 보장하는 체계입니다. 경영 목표와 보안 목표를 일치시키고, 위험관리와 법적 요구사항 준수를 통해 조직의 보안을 관리합니다. 교재는 ISO/IEC 27014를 정보보호 거버넌스 국제 표준으로 제시합니다."] },
                { type: "table", title: "거버넌스 구성요소", columns: ["요소", "역할"], rows: [["리더십", "최고경영진과 이사회가 목표를 정하고 정보보호 정책·예산·책임 할당을 지원"], ["전략", "보안 활동이 사업 목표와 위험 허용 범위에 맞도록 방향 설정"], ["정책·절차", "정책 원칙을 실제 절차와 가이드라인으로 구체화"], ["위험관리", "위협·취약점을 식별하고 평가·대응 계획을 수립하며 보안 통제를 적용"], ["성과관리", "활동 효과를 측정하고 지속 개선; KPI·KRI 등 지표 활용"], ["컴플라이언스", "법적 요구·규제를 준수하고 감사·보고 수행"]] },
                { type: "table", title: "대표 프레임워크", columns: ["프레임워크", "초점"], rows: [["COBIT", "IT 관리·거버넌스 지침과 조직 목표에 대한 IT·보안 연계"], ["ISO/IEC 27001", "정보보안경영시스템(ISMS)의 수립·운영·감사·검토·개선을 위한 요구사항; PDCA 적용"], ["NIST Cybersecurity Framework", "위험관리·보안통제 가이드; Identify, Protect, Detect, Respond, Recover"], ["ITIL", "IT 서비스 관리의 모범 실무 지침과 서비스 운영 프레임워크"]] },
                { type: "text", title: "성과 지표", paragraphs: ["KPI(Key Performance Indicator)는 목표 달성 정도를 측정하는 핵심 성과지표입니다. KRI(Key Risk Indicator)는 잠재 위험이 커지기 전에 위험 수준이나 변화를 관찰하는 지표입니다. 지표는 보안 활동이 조직 목표를 지원하는지 검토하고 개선에 활용합니다."] }
              ],
              memoryPoints: ["교재에서 ISO/IEC 27014는 정보보호 거버넌스, ISO/IEC 27001은 ISMS 국제 표준입니다.", "NIST CSF의 다섯 기능은 Identify → Protect → Detect → Respond → Recover입니다.", "KPI는 성과 달성, KRI는 잠재 위험 신호를 관찰합니다."]
            },
            {
              id: "security-organization-roles-documents",
              title: "정보보호 조직과 문서",
              summary: "경영진·CISO·자산 및 프로세스 책임자·사용자·감사자의 역할과 정책 문서의 위계를 파악합니다.",
              sourcePdfPages: [920],
              keywords: ["CEO", "CISO", "Data Owner", "Process Owner", "User", "IT Support Staff", "IS Auditor", "Security Policy"],
              questionKeywords: ["정보보호 조직 구성원 역할", "CISO 역할", "Data Owner", "Process Owner", "정보보호정책", "정보보호 표준"],
              blocks: [
                { type: "table", title: "조직 구성원의 책임", columns: ["구성원", "주요 책임"], rows: [["최고경영자 (CEO)", "조직의 경영활동 최종 책임자이며 정보보호 총괄 책임을 지원"], ["정보보호 관리자 (CISO)", "정보보호 정책을 수립·관리하고 기술적·관리적 보안 대책을 총괄"], ["데이터 관리자 (Data Owner)", "정보시스템에 저장된 데이터 관리와 보호의 최종 책임"], ["프로세스 관리자 (Process Owner)", "담당 정보시스템에서 조직 정책에 따른 적절한 보안을 보증"], ["사용자 (User)", "보안정책·절차를 준수하며 정보시스템과 데이터를 직접 사용"], ["기술 지원 인력", "기술 문제를 해결하고 시스템 운영·유지보수 담당"], ["정보시스템 감사자", "보안관리 체계의 효과적 운영을 점검하고 개선사항을 도출"]] },
                { type: "text", title: "정책과 하위 문서", paragraphs: ["정보보호 전략은 정보자산을 보호하고 보안 목표를 달성하기 위한 장기적이고 체계적인 계획이며, 조직의 사업 목표와 위험에 대응하도록 설계합니다. 정보보호 정책은 조직의 정보보호에 관한 최상위 방향과 목표를 정하고 일관된 원칙을 제공합니다.", "교재는 정책(Policy)을 조직의 미션·비전과 상위 보안 방향을 제시하는 문서로 설명하고, 표준(Standard)은 정책 목적을 달성하기 위한 구체적 사항이나 특별 요구사항으로 구분합니다. 정책은 세부 기술 구성보다 ‘무엇을 보호하고 어떤 원칙을 따를지’를 정합니다."] }
              ],
              memoryPoints: ["CEO는 조직 최종 책임, CISO는 보안 정책·대책 총괄, Data Owner는 데이터 보호 책임자입니다.", "Process Owner는 담당 시스템의 정책상 보안을 보증하고 사용자는 정책과 절차를 준수합니다.", "정책은 상위 방향·원칙, 표준은 이를 구현하는 구체적 요구사항입니다."]
            }
          ]
        },
        {
          id: "management-risk-assessment",
          chapter: "정보보호 위험 평가",
          status: "published",
          title: "정보보호 위험 분석과 처리",
          summary: "자산·위협·취약점·대책을 식별하고 정량·정성 분석으로 위험을 평가한 뒤 네 가지 대응을 선택합니다.",
          sourcePdfPages: [927, 937],
          concepts: [
            {
              id: "risk-components-and-formulas",
              title: "위험 구성요소와 기본 공식",
              summary: "위험은 발생 가능성과 손실 크기를 고려하며, 보호대책 적용 후에도 잔여 위험이 남습니다.",
              sourcePdfPages: [927, 929],
              keywords: ["Risk", "Assets", "Threat", "Vulnerability", "Safeguard", "Total Risk", "Residual Risk"],
              questionKeywords: ["위험 구성요소", "자산 위협 취약점 보호대책", "전체 위험 공식", "잔여 위험 공식"],
              blocks: [
                { type: "table", title: "위험 구성요소", columns: ["요소", "의미"], rows: [["자산 (Asset)", "조직이 보호할 정보·하드웨어·소프트웨어·시설뿐 아니라 인력·이미지 등 유형·무형의 대상"], ["위협 (Threat)", "취약점을 이용해 자산 손실을 일으킬 수 있는 잠재 원인이나 행위자"], ["취약점 (Vulnerability)", "위협에 노출될 수 있게 하는 시스템의 약점 또는 대책의 미비"], ["정보보호 대책 (Safeguard)", "위험을 줄이는 정책·교육·기술·물리적 통제"]] },
                { type: "text", title: "위험 공식", paragraphs: ["위험은 원치 않는 사건의 발생 가능성과 그때의 손실 정도를 함께 고려합니다. 교재 공식은 전체 위험을 자산·취약점·위협의 곱으로, 대책을 적용한 뒤 남는 잔여 위험을 그 곱에서 정보보호 대책을 반영한 값으로 표현합니다."] },
                { type: "code", title: "교재의 위험 산식", language: "text", code: "전체 위험 = 자산 × 취약점 × 위협\n잔여 위험 = (자산 × 취약점 × 위협) − 정보보호 대책" },
                { type: "text", title: "자산 식별에서 대책까지", paragraphs: ["자산 식별은 보호할 가치가 있는 항목과 형태·소유자·관리자·특성을 찾아 목록화하는 과정입니다. 자산 가치는 금전 기준 또는 업무 중요도·영향 같은 정성적 기준으로 평가할 수 있습니다.", "위협은 취약점을 이용해 자산을 노출시키고 위험을 높입니다. 조직은 위험 분석으로 보안 요구사항을 정하고 이에 맞는 대책을 선택·구현해 위험을 낮춥니다. 대책을 적용해도 완전히 안전해지지는 않으므로 잔여 위험을 관리해야 합니다."] }
              ],
              memoryPoints: ["전체 위험 = 자산 × 취약점 × 위협; 잔여 위험은 여기에 대책을 반영한 뒤 남은 값입니다.", "위협은 취약점을 이용하고 자산의 가치·위협·취약점은 위험 수준에 영향을 줍니다.", "대책을 적용해도 위험이 0이 되지 않으므로 잔여 위험을 관리합니다."]
            },
            {
              id: "risk-management-approaches",
              title: "위험관리 절차와 분석 접근법",
              summary: "전략 수립부터 위험분석·평가·대책 선정까지 진행하고 네 가지 접근법을 선택합니다.",
              sourcePdfPages: [929, 932],
              keywords: ["Risk Management", "Baseline Approach", "Informal Approach", "Detailed Risk Analysis", "Combined Approach"],
              questionKeywords: ["위험관리 절차", "기준선 접근법", "비정형 접근법", "상세 위험분석", "통합 접근법"],
              blocks: [
                { type: "diagram", title: "위험관리의 흐름", nodes: [{ label: "전략·계획", detail: "사업 목표와 보안 목표 연결" }, { label: "위험분석", detail: "자산가치·위협·취약점 파악" }, { label: "위험평가", detail: "수준과 허용 범위 비교" }, { label: "대책 선정", detail: "비용효과와 적절성 검토" }, { label: "보호 계획", detail: "대책 실행·관리 계획 수립" }], caption: "위험관리 계획은 일회성이 아니라 자산·위협·업무 변화에 맞춰 반복 갱신합니다." },
                { type: "table", title: "위험분석 접근법", columns: ["접근법", "방법과 적합성", "장단점"], rows: [["기준선 (Baseline)", "체크리스트의 기본 보호수준을 정하고 각 시스템의 구현 여부를 확인", "빠르고 저비용으로 다수 시스템에 적용하기 쉽지만 개별 환경 차이를 반영하기 어려움"], ["비정형 (Informal)", "구조화된 모델 대신 전문가 경험과 판단으로 중요 위험을 분석", "신속하고 소규모 조직에 적합하지만 주관성과 분석자 의존성이 큼"], ["상세 (Detailed)", "중요 자산별 자산·위협·취약점을 체계적으로 분석", "정밀한 투자·규제 대응에 근거를 주지만 시간·비용·분석 노력이 큼"], ["통합 (Combined)", "초기에 기준선·비정형 분석을 적용하고 고위험 영역은 상세 분석", "위험 수준과 비용에 맞게 분석 깊이를 조절"]] },
                { type: "text", title: "분석과 평가", paragraphs: ["위험분석은 자산의 취약점과 위협을 살펴 발생 가능성·영향을 판단해 위험의 내용과 정도를 파악합니다. 위험평가는 분석 결과를 조직의 기준·목표 위험수준과 비교해 우선순위와 수용 여부를 정하는 과정입니다.", "접근법은 조직 규모, 자산 중요도, 규제 요구, 시간과 전문성에 맞게 선택합니다. 통합 접근은 전체 시스템에 기본 보호수준을 적용하고 고위험 영역에 분석 자원을 집중합니다."] }
              ],
              memoryPoints: ["위험관리 흐름은 전략·계획 → 위험분석 → 위험평가 → 대책 선정 → 보호 계획입니다.", "기준선은 공통 수준, 비정형은 전문가 경험, 상세는 자산별 정밀분석입니다.", "통합 접근은 위험에 맞춰 분석 깊이와 비용을 배분합니다."]
            },
            {
              id: "quantitative-risk-analysis",
              title: "정량적 위험분석과 손실 계산",
              summary: "자산가치와 노출계수로 단일 손실·연간 발생률·연간 예상 손실을 계산합니다.",
              sourcePdfPages: [933, 935],
              keywords: ["Quantitative Risk Analysis", "AV", "EF", "SLE", "ARO", "ALE", "Historical Data", "Probability Distribution"],
              questionKeywords: ["정량적 위험분석", "SLE 공식", "ARO 공식", "ALE 공식", "연간 예상 손실액", "수학공식 접근법", "확률분포법"],
              blocks: [
                { type: "text", title: "금액과 빈도로 위험 표현", paragraphs: ["정량적 위험분석은 분석 요소에 금전적 가치와 숫자를 부여해 손실과 발생빈도로 위험을 표현합니다. 비용·편익 비교와 성능 측정에 유용하지만 자료 수집과 계산에 시간·노력이 들 수 있습니다."] },
                { type: "table", title: "정량 분석 계산식", columns: ["지표", "정의·공식"], rows: [["AV (Asset Value)", "분석 대상 자산의 금전적 가치"], ["EF (Exposure Factor)", "위협 한 번으로 자산가치 중 손실되는 비율"], ["SLE (Single Loss Expectancy)", "한 번의 위협으로 예상되는 손실; SLE = AV × EF"], ["ARO (Annual Rate of Occurrence)", "연간 발생률; ARO = 발생 횟수 ÷ 기간(년)"], ["ALE (Annual Loss Expectancy)", "위협으로 인한 연간 예상 손실; ALE = SLE × ARO"]] },
                { type: "code", title: "교재 예제 계산", language: "text", code: "AV = 432,000원, EF = 20%\nSLE = AV × EF = 432,000 × 0.2 = 86,400원\n5년에 1회 발생 → ARO = 1 ÷ 5 = 0.2\nALE = SLE × ARO = 86,400 × 0.2 = 17,280원/년" },
                { type: "table", title: "정량적 기법", columns: ["기법", "핵심"], rows: [["과거 자료 분석", "기존 발생 자료로 미래 발생 가능성을 추정"], ["수학공식 접근", "발생 빈도를 계산하는 식으로 위험을 계량"], ["확률분포법", "확률분포와 통계적 편차를 이용해 결과 범위를 추정"], ["점수법", "요소별 가중치·점수를 부여; 간단하지만 정확도가 낮을 수 있음"]] }
              ],
              memoryPoints: ["SLE = AV × EF; ARO = 발생 횟수 ÷ 기간; ALE = SLE × ARO입니다.", "교재 예제는 SLE 86,400원, ARO 0.2, ALE 17,280원/년입니다.", "과거자료·수학공식·확률분포·점수법은 정량 분석 기법입니다."]
            },
            {
              id: "qualitative-risk-analysis",
              title: "정성적 위험분석과 정량 분석 비교",
              summary: "금액 대신 서열·척도·전문가 판단으로 위험을 비교하고 대표 정성 분석 기법을 구분합니다.",
              sourcePdfPages: [935, 936],
              keywords: ["Qualitative Risk Analysis", "Delphi", "Scenario Analysis", "Ranking", "Fuzzy Matrix"],
              questionKeywords: ["정성적 위험분석", "델파이법", "시나리오법", "순위결정법", "퍼지행렬법", "정량적 정성적 비교"],
              blocks: [
                { type: "text", title: "정성적 분석의 특징", paragraphs: ["정성적 분석은 손실에 금액이나 숫자를 직접 부여하기보다 위험 가능성과 영향의 서열·척도, 전문가 판단과 경험을 이용해 위험 우선순위를 정합니다. 계산과 자산 금액 자료가 덜 필요하지만 평가자에 따라 결과가 달라질 수 있고 비용 대비 편익을 수치로 설명하기 어렵습니다."] },
                { type: "table", title: "정성 분석 기법", columns: ["기법", "판별 기준"], rows: [["델파이법", "전문가 집단이 위협·취약점을 검토하고 의견을 모아 분석"], ["시나리오법", "예상과 다르게 사건이 전개될 수 있다는 전제에서 조건별 결과를 추정"], ["순위결정법", "중요도·발생 가능성·영향을 비교해 상대적 위험 순위를 도출"], ["퍼지행렬법", "위험 요소를 언어적 척도로 표현해 기대 손실을 평가"]] },
                { type: "table", title: "정량과 정성의 비교", columns: ["정량 분석", "정성 분석"], rows: [["금전·수치·확률로 표현하고 비용편익 비교에 유리", "서열·언어 척도와 전문가 판단으로 우선순위 설정"], ["객관적 비교와 성과 측정에 도움", "자산 가치 산정과 복잡한 수치 계산 부담이 적음"], ["자료·계산·도구가 필요해 시간·비용이 큼", "평가자 주관과 결과 재현성의 한계가 있음"]] }
              ],
              memoryPoints: ["델파이는 전문가 집단, 시나리오는 조건별 결과, 순위결정은 상대 우선순위입니다.", "퍼지행렬은 위험 요소를 정성 언어 척도로 표현합니다.", "정량은 금액·수치와 비용편익, 정성은 상대평가와 전문가 판단에 강점이 있습니다."]
            },
            {
              id: "risk-treatment-options",
              title: "위험처리와 대응 선택",
              summary: "목표 위험수준과 대책 비용효과·보험 가능성을 검토해 네 가지 대응을 선택합니다.",
              sourcePdfPages: [936, 937],
              keywords: ["Risk Acceptance", "Risk Reduction", "Risk Transfer", "Risk Avoidance", "위험수용", "위험완화", "위험전가", "위험회피"],
              questionKeywords: ["위험처리 방식", "위험 수용 완화 전가 회피", "위험회피", "위험전가", "위험완화"],
              blocks: [
                { type: "diagram", title: "위험처리 의사결정", nodes: [{ label: "위험 식별", detail: "현재 위험수준과 목표수준 비교" }, { label: "수용", detail: "위험이 목표 이하이면 승인·감시" }, { label: "완화", detail: "비용효과적 통제를 적용해 위험 감소" }, { label: "전가", detail: "보험·외주 등으로 잠재 손실 배분" }, { label: "회피", detail: "위험 원인이 되는 업무를 중단" }], caption: "대응 선택 후에도 잔여 위험을 확인하고 관리합니다." },
                { type: "table", title: "네 가지 위험처리 방식", columns: ["방식", "대응", "예·유의점"], rows: [["위험수용 (Acceptance)", "현재 위험을 받아들이고 잠재 손실을 감수", "목표 이하의 잔여 위험을 승인"], ["위험완화 (Reduction/Mitigation)", "통제를 적용해 발생 가능성 또는 손실 영향을 줄임", "비용효과 분석으로 통제 비용과 위험 감소량 비교"], ["위험전가 (Transfer/Transition)", "보험·외주 등으로 잠재 비용을 제3자에게 배분", "비용이 발생하며 모든 의무·책임이 자동 소멸하지는 않음"], ["위험회피 (Avoidance)", "위험이 있는 프로세스나 사업을 수행하지 않음", "위험의 근원이 되는 업무·자산을 중단하거나 변경"]] },
                { type: "text", title: "처리 후 재평가", paragraphs: ["정보보호 대책은 위험을 완전히 제거하지 못하므로 대응을 실행한 후 남은 위험이 조직의 목표수준 안에 들어오는지 재평가하고 계획을 갱신합니다."] }
              ],
              memoryPoints: ["수용은 감수, 완화는 통제 적용, 전가는 비용 배분, 회피는 위험 업무를 하지 않는 것입니다.", "완화는 비용효과를 비교하고 전가는 비용을 옮기되 책임 전부가 없어지는 것은 아닙니다.", "처리 후에도 잔여 위험을 평가·승인·모니터링합니다."]
            }
          ]
        },
        {
          id: "management-safeguards-implementation",
          chapter: "정보보호 대책 구현 및 운영",
          status: "published",
          title: "관리적·인적·물리적 보안대책",
          summary: "보안정책과 인력·외부자·계정 통제, 재택근무 및 시설 보호를 운영 절차로 연결합니다.",
          sourcePdfPages: [950, 958],
          concepts: [
            {
              id: "security-policy-assets-and-responsibilities",
              title: "정책·자산관리와 개인정보 책임자",
              summary: "정책 이력을 관리하고 정보보호 책임자와 개인정보보호 책임자의 역할을 구분합니다.",
              sourcePdfPages: [950, 951],
              keywords: ["CISO", "CPO", "Chief Privacy Officer", "정보보호정책", "정보자산관리", "개인정보"],
              questionKeywords: ["정보보호 관리자", "개인정보보호책임자", "CISO CPO 업무", "정책 유지관리", "정보자산관리"],
              blocks: [
                { type: "table", title: "보안·개인정보 책임자", columns: ["역할", "주요 책임"], rows: [["정보보호 관리자 / CISO", "보안정책·표준·대책·절차의 설계·구현·관리, 보안계획과 위험관리, 사고 대응·복구"], ["개인정보보호 책임자 / CPO", "개인정보 보호계획과 처리방침, 처리 실태 점검, 개인정보 파일·자료 관리, 내부통제·보안, 교육, 불만·피해구제와 파기 감독"]] },
                { type: "text", title: "정책과 자산의 운영", paragraphs: ["정보보호 정책과 시행 문서를 제정·개정·폐기할 때 변경 이력을 관리하고 승인·배포·검토 절차를 둡니다. 정보자산은 소유자·관리자와 보호 필요성을 식별해 목록을 최신 상태로 유지하고 위험평가와 접근통제의 근거로 사용합니다.", "CISO는 조직의 정보보호 활동과 기술적·관리적 통제를 총괄합니다. CPO는 개인정보 처리방침·처리 관행, 정보주체 관련 민원과 피해구제, 개인정보의 안전한 파기 등 개인정보 보호 의무를 담당합니다. 두 역할을 문제에서 혼동하지 않도록 책임 범위를 구분합니다."] }
              ],
              memoryPoints: ["CISO는 조직의 정보보호 정책과 대책을 총괄합니다.", "CPO는 개인정보 처리방침·처리 실태·정보주체 권리·파기 등을 관리합니다.", "보안 정책 문서의 제정·개정·폐기 이력을 관리하고 자산 목록을 최신화합니다."]
            },
            {
              id: "personnel-security-training-and-exit",
              title: "인적 보안·직무분리·교육",
              summary: "주요 직무자와 개인정보 취급자를 지정하고 직무분리, 교육, 보안서약, 퇴직·직무변경 절차를 적용합니다.",
              sourcePdfPages: [952, 954],
              keywords: ["직무분리", "주요 직무자", "개인정보 취급자", "보안서약", "Security Awareness", "Accountability"],
              questionKeywords: ["인적 보안 보호대책", "직무분리", "보완통제", "정보보호 교육", "퇴직 및 직무 변경", "책임추적성"],
              blocks: [
                { type: "table", title: "인적 보안 절차", columns: ["통제", "실행 내용"], rows: [["주요 직무자 지정", "중요 정보·시스템 접근 등 핵심 직무를 정의하고 담당 임직원·외부자와 개인정보 취급자 목록을 최신화"], ["직무분리", "개발과 운영, 승인과 집행, 접근과 감사 등 이해충돌·권한 오남용 가능 업무를 분리"], ["보안서약", "임직원·임시직·외부자가 내부정책, 법규와 비밀유지 의무를 지키도록 서약"], ["교육·인식제고", "직무별 연간 교육계획을 운영하고 효과를 평가; 관리체계 범위의 임직원과 외부자를 정기적으로 교육"], ["퇴직·직무변경", "부서 간 인사변경을 공유하고 자산반납, 계정 비활성화·삭제, 권한 회수·조정과 이행 확인"], ["위반조치", "법령·규제·내부정책 위반 시 적용할 조치 절차를 수립·이행"]] },
                { type: "text", title: "직무분리와 보완통제", paragraphs: ["직무분리는 한 사람이 민감한 업무 전 과정을 단독 수행해 부정·오류를 숨길 수 없도록 역할과 권한을 나누는 통제입니다. 조직 규모나 인력 부족으로 분리가 불가피하게 어렵다면 상호검토, 상위관리자 승인, 개인 계정 사용, 로그 기록과 감사 모니터링 등 보완통제로 책임추적성을 확보합니다.", "교육은 연간 계획에 따라 정기적으로 실시하고, 정책·법규의 중대한 변경이나 보안사고 발생 시 추가 교육을 시행합니다. 퇴직·이동 시에는 출입증과 자산을 회수하고 공유 계정과 관련 권한도 검토해 남은 접근을 차단합니다."] },
                { type: "text", title: "교육 내용과 대상", paragraphs: ["교육은 일반 임직원·관리자·IT 및 정보보호 담당자 등 직무별로 수준을 나누고 보안정책·절차, 관리체계, 관련 법률, 사고사례·대응, 위반 시 책임을 포함합니다. 외부 수탁자와 파견 인력의 교육도 관리·감독하고 결과와 개선점을 다음 계획에 반영합니다."] }
              ],
              memoryPoints: ["주요 직무와 개인정보 취급자는 최소화해 지정하고 목록을 최신 상태로 유지합니다.", "직무분리가 어렵다면 상호검토·승인·개별계정·로그·감사 등 보완통제를 적용합니다.", "정기교육 외에도 정책·법규 변경이나 사고 발생 시 추가 교육이 필요합니다.", "퇴직·이동 시 계정·권한·자산 회수와 결과 확인까지 수행합니다."]
            },
            {
              id: "external-party-and-access-security",
              title: "외부자·계정·접근권한 관리",
              summary: "위탁·외부서비스 위험을 계약에 반영하고 최소권한·고유 계정·인증·정기 권한 검토를 수행합니다.",
              sourcePdfPages: [955, 957],
              keywords: ["외부자 보안", "Vendor Security", "User Account", "Least Privilege", "인증실패 횟수", "재택근무", "원격접속"],
              questionKeywords: ["외부자 보안 보호대책", "사용자 계정 관리", "특수 계정 권한 관리", "접근권한 검토", "원격근무 정보보호"],
              blocks: [
                { type: "table", title: "외부자 관리 생애주기", columns: ["시점", "통제"], rows: [["선정·위탁", "외부자와 서비스 현황 및 법적 요구를 식별하고 위험에 맞는 요구사항을 정함"], ["계약", "비밀유지, 개인정보 보호, 접근·권한 승인, 기술·물리 보호, 사고 통지, 점검·감사와 책임을 계약·협정에 명시"], ["수행 중", "보호대책 이행을 주기적으로 점검하고 필요 계정·정보에만 접근을 허용"], ["변경·종료", "계정·접근권한 회수, 정보자산 반납·파기, 자료 유출 방지와 비밀유지 확약을 확인"]] },
                { type: "table", title: "계정과 접근권한", columns: ["통제", "운영 원칙"], rows: [["사용자 식별", "사용자별 고유 식별자를 부여하고 계정 공유를 제한; 예외는 사유·승인·추적 보완책을 기록"], ["인증", "안전한 인증 절차를 적용하고 필요에 따라 강화 인증, 실패횟수 제한과 불법 로그인 경고를 운영"], ["권한", "업무 목적에 필요한 최소권한만 부여하고 특수 계정·권한은 별도로 식별해 통제"], ["정기 검토", "계정 생성·이용·삭제와 권한 변경 이력을 남기고 주기적으로 적정성을 확인"], ["세션 보호", "유휴 시간 종료, 동시접속 제한, 로그인 시도 감시 등 위험에 맞는 통제를 적용"]] },
                { type: "text", title: "재택·원격근무", paragraphs: ["원격근무자는 운영체제·백신을 최신화하고 가정용 공유기 비밀번호와 펌웨어를 관리하며 공용 PC·공용 무선망을 피하고 회사가 승인한 VPN과 업무용 메일을 사용합니다. 조직은 원격근무 지침, 계정·접근권한 관리, 원격접속 모니터링과 부재 시 접속 통제, 개인정보·기업정보 보호를 마련합니다.", "외부 용역자 권한은 외부 업체의 요청만으로 부여하지 않고 조직 내부 시스템 책임자의 승인을 받습니다. 위탁업체에 계정 생성·삭제 권한을 넓게 주기보다 필요한 최소 범위로 분리하고 점검합니다."] }
              ],
              memoryPoints: ["외부자 보안은 계약 전 위험 식별부터 수행 중 점검, 계약 종료 후 계정·자료 회수까지 이어집니다.", "개인별 고유 계정과 최소권한을 사용하고 특수 계정은 별도 식별·통제합니다.", "계정과 권한의 생성·변경·삭제 기록을 남기고 정기적으로 검토합니다.", "원격접속은 승인된 VPN, 최신 단말, 권한관리와 모니터링으로 통제합니다."]
            },
            {
              id: "physical-security-and-public-servers",
              title: "물리적 보호와 공개 서버",
              summary: "보호구역과 시설·장비의 물리 접근을 통제하고 공개 서버의 중요정보 게시·노출을 점검합니다.",
              sourcePdfPages: [958, 959],
              keywords: ["물리적 보안", "보호구역", "출입통제", "공개 서버", "중요정보 노출"],
              questionKeywords: ["물리적 보호대책", "보호구역 지정", "공개 서버 보안 확인", "중요정보 노출 대응"],
              blocks: [
                { type: "table", title: "물리적 보호대책", columns: ["영역", "운영 예"], rows: [["보호구역 지정", "정보처리시설·중요 장비와 기록 매체에 등급별 구역과 출입 권한 설정"], ["출입 통제", "신원 확인, 방문자 승인·동행, 출입기록 검토"], ["시설·설비", "전원·화재·환경 위험과 장비 반출입을 통제하고 보호 설비를 운영"], ["보호구역 내 작업", "작업 승인과 감독, 장비·매체 반입·반출 확인"], ["업무환경", "화면·문서·단말의 노출을 줄이고 안전한 작업환경 유지"]] },
                { type: "text", title: "공개 서버의 정보 노출", paragraphs: ["웹사이트나 공개 서버에 개인정보·중요정보를 게시하거나 저장할 때는 책임자의 승인과 게시 절차를 적용합니다. 공개된 정보가 업무상 필요한지 확인하고, 웹사이트·웹서버를 주기적으로 점검해 중요정보 노출이 발견되면 즉시 차단·삭제와 후속 조사를 수행합니다."] }
              ],
              memoryPoints: ["물리적 보안은 기술·관리 통제가 작동할 기반이며 보호구역·출입·설비·장비 반출입을 함께 다룹니다.", "공개 서버의 중요정보는 승인된 게시 절차와 정기 노출 점검으로 보호합니다."]
            }
          ]
        },
        {
          id: "management-continuity-incident-forensics-privacy",
          chapter: "정보보호 대책 구현 및 운영",
          status: "published",
          title: "업무연속성·사고대응·디지털 포렌식",
          summary: "BCM·BCP·BIA·DRP로 복구를 준비하고 침해사고에 대응하며 증거를 보전하고 개인정보를 설계 단계부터 보호합니다.",
          sourcePdfPages: [959, 970],
          concepts: [
            {
              id: "business-continuity-and-disaster-recovery",
              title: "BCM·BCP·BIA·DRP와 복구사이트",
              summary: "업무 중단의 영향과 허용시간을 분석하고 업무연속성 계획과 IT 재해복구를 구분합니다.",
              sourcePdfPages: [959, 963],
              keywords: ["BCM", "BCP", "BIA", "DRP", "DRS", "RTO", "RPO", "MTD", "WRT", "Mirror Site", "Hot Site", "Warm Site", "Cold Site"],
              questionKeywords: ["BCM BCP 차이", "업무영향분석 BIA", "RTO RPO MTD WRT", "DRP DRS", "재해복구 사이트", "미러 핫 웜 콜드 사이트"],
              blocks: [
                { type: "table", title: "연속성·복구 용어", columns: ["용어", "범위와 역할"], rows: [["BCM (Business Continuity Management)", "BCP 수립·시험·보수와 연속성 관리를 포함하는 지속적 관리 체계"], ["BCP (Business Continuity Plan)", "IT뿐 아니라 인력·시설·자금 등 자원을 포함해 재해·장애 중 조직 업무를 지속·복구하는 광범위한 계획"], ["BIA (Business Impact Analysis)", "업무 중단이 시간에 따라 조직에 미치는 영향과 허용 한계를 분석"], ["DRP (Disaster Recovery Plan)", "재해로 중단된 정보기술 서비스를 재개해 업무 영향을 최소화하는 계획"], ["DRS (Disaster Recovery System)", "DRP 실행을 위해 평상시 확보하고 지속 관리하는 인적·물적 자원과 체계"]] },
                { type: "table", title: "BIA와 복구시간 지표", columns: ["지표·활동", "의미"], rows: [["RTO", "서비스·업무를 복구해야 하는 목표 시간"], ["RPO", "복구 시 허용할 수 있는 데이터 손실 시점·범위"], ["MTD", "업무 중단을 견딜 수 있는 최대 허용 시간"], ["WRT", "시스템 복구 이후 업무를 실제 재개하기까지 필요한 작업 복구 시간"], ["BIA 활동", "프로세스 식별·상호연관성 분석, 자원과 요구사항 식별, MTD 산정, 중단 손실 평가, 복구 우선순위·범위 설정"]] },
                { type: "table", title: "재해복구 사이트 비교", columns: ["유형", "운영 상태와 복구", "비용·복구 수준"], rows: [["미러 (Mirror)", "주센터와 원격 사이트가 실시간 데이터를 복제하며 Active–Active로 동시 운영", "가장 빠른 복구(이론상 RTO 0에 가까움); 구축·운영비가 매우 큼"], ["핫 (Hot)", "원격지에 최신 데이터와 시스템을 준비; 주센터 장애 때 예비 시스템으로 빠르게 전환", "교재 표의 목표는 수시간(약 4시간 이내); 비용과 상시 보안운영 부담이 큼"], ["웜 (Warm)", "주요 인프라와 일부 자원을 보유하지만 실시간 미러링은 하지 않음", "복구는 수일~수주 수준; 비용과 복구 속도가 중간"], ["콜드 (Cold)", "장소와 최소 시설만 확보하고 재해 후 장비·자원을 조달해 복구", "수주~수개월이 걸릴 수 있지만 구축·유지비가 가장 낮음"]] },
                { type: "text", title: "업무연속성 계획 순서", paragraphs: ["업무에 큰 영향을 미치는 핵심 프로세스를 식별하고 자원 중요도와 중단 영향을 평가한 뒤 재해 시나리오와 대응전략을 정합니다. 이후 복구계획을 수립·실행하고 시험·검토·유지보수를 반복합니다. BCM은 정책·맥락·리더십·기획·지원·운영·성과평가·개선을 계속 관리합니다."] }
              ],
              memoryPoints: ["BCP는 조직 전체의 업무 지속, DRP는 정보기술 서비스 복구에 초점을 둡니다.", "BIA는 프로세스·자원·중단 영향·MTD·복구 우선순위를 분석합니다.", "RTO는 복구 목표 시간, RPO는 허용 데이터 손실 시점, MTD는 최대 허용 중단, WRT는 복구 뒤 업무 재개에 필요한 시간입니다.", "사이트 복구 속도·비용은 대체로 미러 → 핫 → 웜 → 콜드 순으로 빠르고 비싸집니다."]
            },
            {
              id: "incident-response-process",
              title: "침해사고 조직과 대응 절차",
              summary: "CERT·ISAC의 협력 역할을 이해하고 사고 전 준비부터 탐지·조사·해결까지 순서대로 대응합니다.",
              sourcePdfPages: [964, 966],
              keywords: ["Incident Response", "CERT", "ISAC", "침해사고", "초기대응", "사고조사"],
              questionKeywords: ["침해사고 대응 절차", "CERT", "ISAC", "침해사고 유형", "사고 탐지 초기대응"],
              blocks: [
                { type: "table", title: "사고 유형과 지원 조직", columns: ["항목", "역할·예"], rows: [["기밀성 침해", "비인가 접근·도청·사회공학·정보유출"], ["무결성 침해", "정보나 시스템을 승인 없이 변경·조작"], ["가용성 침해", "DDoS·재해·사고 등으로 서비스 제공을 방해"], ["CERT", "전산망 침해사고 대응을 지원하고 운영기관 간 협조와 국제 대응 창구를 제공"], ["ISAC", "분야별 기반시설이 취약점·위협 정보를 공유하고 경보·분석·대응을 협력"]] },
                { type: "diagram", title: "침해사고 대응 순서", nodes: [{ label: "사전 준비", detail: "역할·연락망·대응계획·도구 준비" }, { label: "사고 탐지", detail: "장비·사용자 신고·로그에서 이상징후 확인" }, { label: "초기 대응", detail: "영향 확인, 기록, 보고·확산 방지" }, { label: "대응전략 수립", detail: "조사 범위와 보존·격리·복구 결정" }, { label: "사고 조사", detail: "무슨 일이 언제 어디서 어떻게 발생했는지 분석" }, { label: "보고서 작성", detail: "사실·영향·대응을 객관적으로 기록" }, { label: "해결·개선", detail: "복구, 재발방지 정책·절차·기술 개선" }], caption: "증거 보존과 업무 안전을 고려해 초기부터 기록과 보고를 병행합니다." },
                { type: "text", title: "사고의 범위와 조사", paragraphs: ["침해사고는 취약점, 사람의 실수와 관리통제 미비 등 여러 원인으로 발생할 수 있습니다. 탐지 후에는 사고 정황·시간·영향과 조치를 기록하고, 필요하면 관리자 승인과 관계기관 협조를 거쳐 조사·복구·재발방지 계획을 수립합니다."] }
              ],
              memoryPoints: ["순서는 사전 준비 → 탐지 → 초기 대응 → 대응전략 수립 → 조사 → 보고서 → 해결입니다.", "CERT는 사고대응 협력, ISAC은 분야별 위협정보 공유·분석과 경보를 지원합니다.", "초기 대응부터 사실·조치 기록과 영향 확산 방지를 함께 수행합니다."]
            },
            {
              id: "digital-forensics-principles-and-process",
              title: "디지털 포렌식 원칙과 증거 절차",
              summary: "정당성·재현성·신속성·연계보관성·무결성을 지키며 증거를 획득·보관·분석·보고합니다.",
              sourcePdfPages: [966, 969],
              keywords: ["Digital Forensics", "정당성", "재현성", "신속성", "연계보관성", "무결성", "Imaging", "Hash"],
              questionKeywords: ["디지털 포렌식 5원칙", "연계보관성", "디지털 포렌식 절차", "해시값 증거", "안티 포렌식"],
              blocks: [
                { type: "table", title: "디지털 포렌식 5원칙", columns: ["원칙", "의미"], rows: [["정당성", "증거 획득·분석이 적법하고 정당한 절차를 따름"], ["재현성", "동일한 조건과 방법에서 같은 분석 결과를 재현할 수 있음"], ["신속성", "증거가 사라지거나 변경되기 전에 신속히 확보·처리"], ["연계보관성", "수집·이송·보관·분석·제출의 인수인계와 처리 과정을 기록·추적"], ["무결성", "전 과정에서 증거의 변조·손상이 없었음을 입증"]] },
                { type: "diagram", title: "포렌식 증거 처리", nodes: [{ label: "준비", detail: "인력·영장·도구·협조 준비" }, { label: "획득", detail: "원본 보존, 복제 이미징, 해시로 동일성 확인" }, { label: "보관·이송", detail: "봉인·접근기록·인수인계로 연계성 유지" }, { label: "검증·분석", detail: "절차를 재현하고 사건 관련 사실을 분석" }, { label: "보고서", detail: "객관적 근거와 방법·결과 문서화" }], caption: "증거 획득부터 법정 제출까지 도구·시간·담당자·해시·인수인계를 일관되게 기록합니다." },
                { type: "table", title: "포렌식 도구와 안티 포렌식", columns: ["구분", "내용"], rows: [["분석 도구", "교재 예: FTK, ProDiscover Forensic, EnCase"], ["와이핑·덮어쓰기", "저장 데이터를 덮어써 복구를 어렵게 함"], ["디가우징·물리 파괴", "매체 데이터를 파괴하거나 저장매체를 파손"], ["로그 삭제", "기록을 지우거나 생성 직후 자동 삭제해 흔적을 감춤"]] },
                { type: "text", title: "증거의 연속성과 무결성", paragraphs: ["원본 매체를 직접 분석해 변경시키지 않도록 쓰기방지를 적용하고 디지털 이미지를 만들어 해시값으로 복제본 동일성을 확인합니다. 증거 목록, 봉인, 입수·이송 담당자, 시간, 도구와 분석 절차를 기록하면 적법성·연계보관성·재현성을 설명할 수 있습니다."] }
              ],
              memoryPoints: ["5원칙은 정당성·재현성·신속성·연계보관성·무결성입니다.", "절차는 준비 → 증거 획득 → 보관·이송 → 검증·분석 → 보고서 제출입니다.", "복제 이미지는 해시로 동일성을 확인하고 인수인계 기록·봉인으로 연계보관성을 유지합니다."]
            },
            {
              id: "privacy-by-design-principles",
              title: "Privacy by Design 7대 원칙",
              summary: "개인정보 보호를 사후 대응이 아닌 서비스·시스템 설계와 전 생애주기에 내재화합니다.",
              sourcePdfPages: [969, 970],
              keywords: ["Privacy by Design", "PbD", "Positive-Sum", "Privacy Lifecycle", "프라이버시"],
              questionKeywords: ["Privacy by Design 7대 원칙", "프라이버시 사전 예방", "초기 설정", "포지티브섬"],
              blocks: [
                { type: "table", title: "7대 기본 원칙", columns: ["원칙", "설명"], rows: [["사후조치가 아닌 사전 예방", "사고가 난 뒤 대응하기보다 침해를 예상하고 미리 예방"], ["초기 설정부터 프라이버시 보호", "기본 설정에서 개인정보 보호가 최대한 적용되도록 함"], ["프라이버시 보호를 내재한 설계", "서비스·시스템·처리 절차에 보호를 기본 설계로 통합"], ["포지티브섬(제로섬이 아님)", "사업 기능·편의성과 개인정보 보호를 함께 달성하도록 설계"], ["개인정보 생애주기 전체 보호", "수집·이용·저장·제공·파기 전 과정에서 보호"], ["가시성과 투명성", "정보주체가 처리 과정과 보호 방식을 명확히 이해할 수 있게 함"], ["이용자 프라이버시 존중", "명시적 보호체계가 없는 상황에서도 이용자 프라이버시를 고려"]] },
                { type: "text", title: "설계 원칙의 적용", paragraphs: ["Privacy by Design은 개인정보 침해가 발생한 뒤 보완하는 방식에서 벗어나 초기 요구사항과 기본 설정부터 보호를 반영합니다. 보안과 편의성을 서로 상쇄하는 제로섬으로 보지 않고 기능과 프라이버시 보호를 함께 높이는 포지티브섬을 지향합니다."] }
              ],
              memoryPoints: ["PbD는 사전 예방·기본값 보호·설계 내재화를 강조합니다.", "프라이버시와 사업 기능을 함께 높이는 포지티브섬을 목표로 합니다.", "개인정보 수집부터 파기까지 전 생애주기에서 보호하고 투명성과 이용자 존중을 유지합니다."]
            }
          ]
        },
        {
          id: "management-security-certifications",
          chapter: "정보보호 인증제도",
          status: "published",
          title: "ISMS·ISMS-P와 보안제품 인증",
          summary: "조직의 관리체계 인증과 정보보호제품 평가를 구분하고 국내 ISMS-P 및 CC 평가 기준을 익힙니다.",
          sourcePdfPages: [990, 1001],
          concepts: [
            {
              id: "isms-isms-p-management-system",
              title: "ISMS·ISMS-P 관리체계 인증",
              summary: "조직·인력·예산과 정책·위험관리·보호대책을 지속 운영하고 개인정보 처리 요구사항까지 관리합니다.",
              sourcePdfPages: [990, 996],
              keywords: ["ISMS", "ISMS-P", "정보보호 관리체계", "개인정보보호 관리체계", "DoA", "인증 범위", "ISO 27701"],
              questionKeywords: ["ISMS-P 인증", "ISMS-P 의무 대상", "ISMS-P 인증범위", "12개 분야 64개 인증기준", "개인정보 처리단계별 21개 인증기준", "ISO 27701"],
              blocks: [
                { type: "table", title: "관리체계 인증의 범위", columns: ["인증", "보호 대상과 평가"], rows: [["ISMS", "조직의 정보보호 관리체계와 정보자산의 기밀성·무결성·가용성을 위한 관리적·기술적·물리적 보호조치 평가"], ["ISMS-P", "ISMS에 개인정보 보호 요구사항을 통합해 개인정보의 수집·이용부터 파기까지 보호 관리체계를 함께 평가"]] },
                { type: "text", title: "관리체계의 기반", paragraphs: ["교재는 정보보호 관리체계의 기반 요소로 조직과 인력, 사업 추진과 예산 배정, 규정에 기반한 전사적 정보보호 활동을 제시합니다. 인증은 문서 보유 여부만이 아니라 경영진 참여, 정책 승인, 자산 식별, 위험평가, 통제의 운영과 점검이 지속되는지 확인합니다.", "책에 정리된 ISMS-P 요구사항은 관리체계 수립·운영 분야 12개 영역 64개 인증기준과 개인정보 처리단계별 5개 영역 21개 기준으로 구성됩니다. 처리 생애주기의 각 단계에 맞춰 위험을 식별하고 보호대책을 이행합니다."] },
                { type: "table", title: "ISMS-P 인증 범위", columns: ["범위", "포함·제외 예"], rows: [["서비스·응용프로그램", "이용자와 직접 접점인 서비스 및 제공·운영에 직접 필요한 응용·관리 시스템 포함"], ["데이터베이스", "인증 서비스 데이터가 저장·관리되는 회원·운영·백업 DB 포함"], ["서버·네트워크", "운영·연계·개발·시험·로그·백업·보안관리 서버와 서비스 운영에 직접 관련된 네트워크 장비 포함"], ["운영 지배", "임대 장비라도 조직이 데이터·서비스를 실질 운영하거나 지배하면 범위에 포함될 수 있음"], ["책의 제외 예", "서비스 DB를 직접 쓰지 않는 별도 DW·CRM, 이용자 상담 콜센터 시스템, 서비스와 무관한 내부 ERP·그룹웨어 등은 조건에 따라 제외"]] },
                { type: "table", title: "교재에 제시된 의무대상 요약", columns: ["범주", "교재의 기준"], rows: [["정보통신망 서비스", "ISP 제공자와 IDC 사업자"], ["대규모 기관", "전년도 매출·세입 등이 1,500억 원 이상인 대상 중 상급종합병원 및 재학생 1만 명 이상 학교 등 교재에 열거된 기관"], ["정보통신서비스 사업자", "전년도 정보통신서비스 부문 매출액 100억 원 이상 또는 전년도 일일 평균 이용자 100만 명 이상으로 교재가 제시한 범주"]] },
                { type: "text", title: "인증 운영과 위험수용", paragraphs: ["조직은 서비스·자산의 위험을 정기적으로 평가하고, 목표 위험수준을 넘는 위험에 대응계획을 세웁니다. 수용 가능한 위험수준(교재 표기 DoA)은 경영진 의사결정으로 정하고, 그 범위 안에서 수용할 위험도 승인·관리합니다.", "ISMS-P 인증범위는 응용시스템·DB·서버·네트워크·보호시스템과 개인정보 처리 위치·운영 책임을 함께 살펴 정합니다. 인증 여부 자체가 사고가 일어나지 않는다는 보장은 아니며, 관리체계의 지속적인 이행과 개선이 핵심입니다."] },
                { type: "text", title: "ISO/IEC 27701", paragraphs: ["ISO/IEC 27701은 ISO/IEC 27001 계열의 정보보안 관리체계를 개인정보 보호 관리체계로 확장하는 국제 개인정보보호 경영시스템 표준입니다. 개인정보를 처리하는 조직의 역할과 통제를 다루며, 교재는 2019년 발표된 표준으로 소개합니다."] }
              ],
              memoryPoints: ["ISMS는 조직의 정보보호, ISMS-P는 정보보호와 개인정보 보호 관리체계를 통합해 인증합니다.", "교재 표기 기준은 관리체계 12개 영역·64개 인증기준, 개인정보 처리단계 5개 영역·21개 기준입니다.", "ISMS-P 범위는 서비스 접점뿐 아니라 연계 DB·서버·네트워크·운영·위탁 관계까지 검토합니다.", "책의 의무대상 문턱값은 교재 판본 기준으로 확인하고 법령 개정 시 별도 재검토해야 합니다."]
            },
            {
              id: "information-security-product-evaluation",
              title: "정보보호제품 평가기관과 인증제도",
              summary: "제품 인증의 정책·인증·인정·평가기관 역할을 구분하고 TCSEC·ITSEC·CTCPEC의 기준을 비교합니다.",
              sourcePdfPages: [997, 999],
              keywords: ["정보보호제품 평가", "TCSEC", "Orange Book", "ITSEC", "CTCPEC", "CCRA", "ITSCC", "평가기관"],
              questionKeywords: ["정보보호제품 평가 인증기관", "TCSEC 등급", "ITSEC 특징", "CTCPEC", "인증기관 평가기관"],
              blocks: [
                { type: "table", title: "제품 평가·인증 기관의 역할", columns: ["기관", "교재의 역할"], rows: [["정책기관", "평가·인증 관련 법령·제도·정책과 예산을 마련"], ["인증기관", "평가 결과 승인, 인증서 발급·효력 연장, 인증제품 목록 관리"], ["인정기관", "평가기관의 역량·품질체계를 승인하고 인정"], ["평가기관", "제품 제출물을 조사하고 기능 시험·취약점 분석·평가 수행"], ["신청기관", "제품과 평가 자료를 준비하고 개발환경 보안 요구를 충족"]] },
                { type: "table", title: "제품 보안평가 기준 비교", columns: ["기준", "범위·평가 관점"], rows: [["TCSEC (Orange Book)", "미국 국방부가 제시한 컴퓨터 시스템 평가기준; 기밀성 중심의 보안정책과 등급을 평가"], ["ITSEC", "유럽 기준; 보안 기능과 보증 수준을 분리해 평가하며 기밀성 외 무결성·가용성도 다룸"], ["CTCPEC", "캐나다 기준으로 기능성과 보증성을 다루며 공통평가기준(CC)의 전신 가운데 하나"], ["CC / Common Criteria", "서로 다른 국가 기준을 조화한 국제 IT 제품·시스템 보안 평가 표준 ISO/IEC 15408"]] },
                { type: "table", title: "TCSEC 등급", columns: ["등급", "교재의 핵심 설명"], rows: [["A", "검증된 보호(Verified Protection); A1이 제시 등급에서 더 높은 신뢰 수준"], ["B", "강제적 보호(Mandatory Protection)"], ["C", "임의적 보호(Discretionary Protection)"], ["D", "최소 보호(Minimal Protection)"]] },
                { type: "text", title: "평가기준의 발전", paragraphs: ["TCSEC는 기밀성·군사 시스템 중심의 미국 평가기준입니다. ITSEC는 기능적 요구와 보증 수준을 분리해 군사·상업 요구를 유연하게 다루려 했고, CTCPEC는 캐나다 제품 기준입니다. CC는 여러 기준을 통합한 공통 국제 평가체계이며 CCRA 상호인정 협정으로 회원국 간 인증 결과 상호 신뢰를 지원합니다."] }
              ],
              memoryPoints: ["정책기관은 제도·정책, 인증기관은 결과 승인·인증서, 평가기관은 시험·취약점 분석을 담당합니다.", "TCSEC는 미국·기밀성 중심, ITSEC는 유럽·기능과 보증 분리, CC는 국제 공통평가기준입니다.", "TCSEC 등급은 A 검증, B 강제적, C 임의적, D 최소 보호 순으로 구분합니다."]
            },
            {
              id: "common-criteria-and-eal",
              title: "CC 구성요소와 EAL 평가 보증등급",
              summary: "평가대상 TOE의 보안목표를 PP·ST로 정하고 PP→ST→TOE 순으로 평가한 뒤 EAL 1–7 보증수준을 확인합니다.",
              sourcePdfPages: [999, 1001],
              keywords: ["Common Criteria", "ISO/IEC 15408", "TOE", "PP", "ST", "Package", "EAL", "CCRA"],
              questionKeywords: ["CC 인증 구성요소", "Protection Profile", "Security Target", "Target of Evaluation", "EAL 등급", "CC 인증 절차"],
              blocks: [
                { type: "table", title: "CC 주요 구성요소", columns: ["요소", "의미"], rows: [["TOE (Target of Evaluation)", "평가 대상이 되는 제품 또는 시스템"], ["PP (Protection Profile)", "제품 유형이 공통으로 만족해야 할 제품 독립적 보안 요구사항과 목표"], ["ST (Security Target)", "특정 TOE의 보안목표·기능·보증 요구를 제품 단위로 기술한 문서"], ["Package", "재사용할 수 있도록 미리 정의하고 논리적으로 묶은 보안 요구사항 집합"], ["EAL (Evaluation Assurance Level)", "평가 보증 요구 컴포넌트를 조합한 1~7단계 보증수준"]] },
                { type: "table", title: "EAL 1–7", columns: ["등급", "교재 표의 보증 단계"], rows: [["EAL1", "Functionally Tested — 기능적 시험"], ["EAL2", "Structurally Tested — 구조적 시험"], ["EAL3", "Methodically Tested and Checked — 방법론적 시험·검사"], ["EAL4", "Methodically Designed, Tested and Reviewed — 방법론적 설계·시험·검토"], ["EAL5", "Semi-Formally Designed and Tested — 준정형 설계·시험"], ["EAL6", "Semi-Formally Verified Design and Tested — 준정형 검증 설계·시험"], ["EAL7", "Formally Verified Design and Tested — 정형 검증 설계·시험"]] },
                { type: "diagram", title: "CC 문서·제품 평가 순서", nodes: [{ label: "PP 평가", detail: "보호 프로파일 요구의 완전성·일치성 검토" }, { label: "ST 평가", detail: "특정 제품의 보안목표·요구가 PP를 충족하는지 평가" }, { label: "TOE 평가", detail: "제품이 ST에 적힌 요구사항을 구현하는지 시험" }], caption: "PP는 제품 유형의 공통 요구, ST는 개별 TOE가 충족할 구체 요구, TOE는 실제 평가 대상 제품입니다." },
                { type: "text", title: "보증 수준 해석", paragraphs: ["EAL은 제품의 보안 기능 자체가 더 많은지 단순히 세는 점수가 아니라, 보안 요구가 구현되고 제대로 동작한다는 신뢰를 뒷받침하는 평가 보증의 깊이를 나타냅니다. 등급이 높아질수록 교재 표에서 더 엄격하고 포괄적인 설계 검증·시험·검토가 요구됩니다."] }
              ],
              memoryPoints: ["PP는 제품군의 공통 요구, ST는 특정 제품의 구체 보안목표, TOE는 실제 평가 대상입니다.", "CC의 평가 순서는 PP → ST → TOE입니다.", "EAL은 1~7단계 평가 보증수준이며 높은 등급일수록 설계 검증과 시험이 엄격해집니다."]
            }
          ]
        },
        {
          id: "management-cyber-ethics",
          chapter: "정보보호 윤리 및 법규",
          status: "published",
          title: "사이버 윤리와 사이버 폭력",
          summary: "사이버 윤리의 범위와 컴퓨터 윤리와의 관계를 이해하고 사이버 공간에서 발생하는 폭력 유형을 구분합니다.",
          sourcePdfPages: [1009, 1009],
          concepts: [
            {
              id: "cyber-ethics-and-cyber-violence",
              title: "사이버 윤리의 개념과 사이버 폭력 유형",
              summary: "사이버 세계의 책임·의무와 온라인 공간에서 타인에게 가하는 괴롭힘·추적·명예훼손·성적 침해를 정리합니다.",
              sourcePdfPages: [1009, 1009],
              keywords: ["사이버 윤리", "컴퓨터 윤리", "사이버 폭력", "Cyberbullying", "Cyberstalking", "Cyber Defamation", "Cyber Sexual Assault"],
              questionKeywords: ["사이버 윤리 개념", "사이버 폭력 종류", "사이버 괴롭힘", "사이버 스토킹", "사이버 명예 훼손"],
              blocks: [
                { type: "text", title: "사이버 윤리", paragraphs: ["교재는 사이버 윤리를 사이버 세계에 거주하는 모든 사람의 책임과 의무를 규정하는 것으로 설명합니다. 사이버 공간에서 인간 사이의 도덕적 관계를 다루고, 온라인 일탈 상황에서 필요한 구체적 행동 지침을 연구합니다.", "컴퓨터 윤리는 컴퓨터 기술과 관련된 도덕 문제를 다루며, 사이버 윤리는 그 범위를 사이버 공간으로 확장해 포함합니다."] },
                { type: "table", title: "사이버 폭력 유형", columns: ["유형", "교재의 설명"], rows: [["사이버 괴롭힘 (Cyberbullying)", "인터넷을 통해 다른 사람을 괴롭히거나 공격하는 행위"], ["사이버 스토킹 (Cyberstalking)", "온라인에서 타인을 지속적으로 추적하거나 몰래 정보·위치를 수집하고 위협하는 행위"], ["사이버 명예훼손 (Cyber Defamation)", "사이버 공간에서 상대방의 명예를 훼손하는 행위"], ["사이버 성폭력 (Cyber Sexual Assault)", "피해자의 성적 자기결정권을 침해하는 행위"]] }
              ],
              memoryPoints: ["사이버 윤리는 컴퓨터 윤리를 포함하며, 온라인 공간의 도덕적 관계와 책임·의무를 다룹니다.", "사이버 폭력은 괴롭힘·지속적 추적·명예훼손·성적 자기결정권 침해 유형을 구분합니다."]
            }
          ]
        },
        {
          id: "management-critical-infrastructure-law",
          chapter: "정보보호 윤리 및 법규",
          status: "published",
          title: "정보통신기반 보호법과 주요정보통신기반시설",
          summary: "주요정보통신기반시설의 지정 기준, 보호계획, 취약점 분석·평가와 정보공유·분석센터의 역할을 연결합니다.",
          sourcePdfPages: [1011, 1015],
          concepts: [
            {
              id: "critical-infrastructure-protection-framework",
              title: "기반시설 보호체계와 지정 기준",
              summary: "전자적 침해로부터 중요 기반시설을 보호하는 법의 목적과 지정·계획·심의 체계를 정리합니다.",
              sourcePdfPages: [1011, 1014],
              keywords: ["정보통신기반 보호법", "주요정보통신기반시설", "전자적 침해행위", "정보통신기반보호위원회", "보호계획"],
              questionKeywords: ["정보통신기반 보호법 목적", "정보통신기반보호위원회 구성", "주요정보통신기반시설 보호계획", "기반시설 지정 기준"],
              blocks: [
                { type: "text", title: "법의 목적과 용어", paragraphs: ["정보통신기반 보호법은 전자적 침해행위에 대비해 주요정보통신기반시설 보호대책을 수립·시행하고 시설을 안정적으로 운용해 국가 안전과 국민 생활의 안정을 보장하는 것을 목적으로 합니다.", "교재는 정보통신기반시설을 국가안전보장·행정·국방·치안·금융·통신·운송·에너지 등 업무와 관련된 전자적 제어·관리 시스템으로 설명합니다. 전자적 침해행위에는 해킹, 악성코드, 논리폭탄·메일폭탄, 서비스 거부, 고출력 전자기파 등이 포함되고, 침해사고는 그 결과 발생한 사태입니다."] },
                { type: "table", title: "주요정보통신기반시설 지정 고려사항", columns: ["기준", "검토 내용"], rows: [["업무 중요성", "관리기관이 수행하는 업무의 국가·사회적 중요성"], ["의존도", "해당 업무가 정보통신기반시설에 의존하는 정도"], ["상호연계성", "다른 정보통신기반시설과의 연결 관계"], ["피해 규모·범위", "침해사고가 국가안전보장과 경제·사회에 미칠 영향"], ["발생·복구 가능성", "침해사고 발생 가능성과 복구의 용이성"]] },
                { type: "text", title: "보호계획과 심의", paragraphs: ["교재에 따르면 주요정보통신기반보호위원회는 국무총리 소속으로 두며, 관계 중앙행정기관은 전년도 추진 실적과 다음 연도 보호계획을 제출해 심의를 받습니다. 보호계획에는 취약점 분석·평가, 침해사고 예방·백업·복구 등 보호 사항이 포함됩니다.", "관계 중앙행정기관의 장은 지정 여부를 심의·결정하고 지정 또는 취소를 고시합니다. 지방자치단체가 관리·감독하는 시설은 행정안전부장관이 해당 지방자치단체장과 협의하는 절차가 교재에 제시되어 있습니다."] }
              ],
              memoryPoints: ["지정 판단은 업무 중요성, 기반시설 의존도, 상호연계성, 예상 피해 규모·범위, 발생 가능성과 복구 용이성을 함께 봅니다.", "보호계획은 취약점 평가뿐 아니라 침해사고 예방·백업·복구 대책을 포함합니다."]
            },
            {
              id: "critical-infrastructure-assessment-and-isac",
              title: "취약점 분석·평가와 ISAC",
              summary: "관리기관의 취약점 분석·평가와 전문기관 지원, 분야별 정보공유·분석센터의 두 가지 핵심 기능을 학습합니다.",
              sourcePdfPages: [1014, 1015],
              keywords: ["취약점 분석·평가", "한국인터넷진흥원", "정보보호 전문서비스 기업", "ETRI", "ISAC", "정보공유·분석센터"],
              questionKeywords: ["주요정보통신기반시설 취약점 분석 평가 기관", "정보공유 분석센터 업무", "ISAC 기능", "취약점 분석·평가"],
              blocks: [
                { type: "text", title: "취약점 분석·평가", paragraphs: ["주요정보통신기반시설 관리기관은 취약점을 분석·평가하고, 교재는 한국인터넷진흥원, 정보보호 전문서비스 기업, 한국전자통신연구원 등 분석·평가를 수행할 수 있는 기관을 열거합니다. 구체적인 대상·방법은 법령과 시행령의 지정 요건에 따릅니다.", "관계 중앙행정기관은 평가 기준을 정해 관계 기관에 통보하고, 세부 방법과 절차는 대통령령으로 정하도록 교재가 정리합니다."] },
                { type: "table", title: "정보공유·분석센터 (ISAC)", columns: ["기능", "설명"], rows: [["취약점·위협 정보 공유", "취약점, 침해요인과 대응방안에 관한 정보를 제공"], ["실시간 경보·분석", "침해사고 발생 시 실시간 경보·분석 체계를 운영"]] },
                { type: "text", title: "기관 간 지원", paragraphs: ["정보공유·분석센터는 금융·통신 등 분야별 기반시설을 보호하기 위해 구축·운영할 수 있습니다. 정부는 센터 구축을 장려하고 필요한 재정적·기술적 지원을 할 수 있습니다."] }
              ],
              memoryPoints: ["취약점 평가 수행기관은 한국인터넷진흥원·정보보호 전문서비스 기업·한국전자통신연구원 등 교재에 제시된 전문기관과 지정 요건을 확인합니다.", "ISAC의 중심 기능은 위협·취약점 정보 제공과 침해 발생 시 실시간 경보·분석입니다."]
            }
          ]
        },
        {
          id: "management-network-act-security",
          chapter: "정보보호 윤리 및 법규",
          status: "published",
          title: "정보통신망법의 목적·용어와 안전성 확보",
          summary: "정보통신망법의 적용 용어와 안전한 이용환경 조성 체계, 침해사고 신고 및 광고성 정보 관련 학습 범위를 정리합니다.",
          sourcePdfPages: [1015, 1018],
          concepts: [
            {
              id: "network-act-scope-and-incident-reporting",
              title: "정보통신망법의 기본 용어와 침해사고 대응",
              summary: "법의 목적과 정보통신망·서비스·침해사고 등 용어를 구분하고 사업자의 신고·대응 흐름을 이해합니다.",
              sourcePdfPages: [1015, 1017],
              keywords: ["정보통신망 이용촉진 및 정보보호 등에 관한 법률", "정보통신망법", "정보통신서비스 제공자", "이용자", "침해사고 신고", "KISA"],
              questionKeywords: ["정보통신망법 목적", "정보통신망법 용어", "침해사고 신고 정보통신서비스 제공자", "한국인터넷진흥원 신고"],
              blocks: [
                { type: "text", title: "법의 목적과 구성", paragraphs: ["정보통신망법은 정보통신망 이용을 촉진하고 정보통신서비스 이용자를 보호하며, 망을 건전하고 안전하게 이용할 환경을 조성해 국민 생활의 향상과 공공복리 증진에 이바지하는 것을 목적으로 합니다.", "교재의 구성표는 총칙, 이용촉진, 정보통신서비스의 안전한 이용환경, 이용자 보호, 안전성 확보, 통신과금서비스, 국제협력, 보칙·벌칙 등으로 구분합니다. 개인정보 보호 관련 규정이 개인정보 보호법으로 이관된 점도 교재의 판본 설명으로 제시합니다."] },
                { type: "table", title: "핵심 용어", columns: ["용어", "교재의 의미"], rows: [["정보통신망", "정보를 수집·가공·저장·검색·송신·수신하는 전기통신 기반의 정보통신체제"], ["정보통신서비스", "전기통신역무를 이용해 정보를 제공하거나 정보 제공을 매개하는 것"], ["정보통신서비스 제공자", "전기통신사업자의 역무를 이용해 영리 목적으로 정보를 제공하거나 매개하는 자"], ["이용자", "정보통신서비스 제공자가 제공하는 서비스를 이용하는 자"], ["침해사고", "정보통신망 또는 관련 정보시스템에 대한 공격으로 발생한 사태"]] },
                { type: "text", title: "침해사고 신고 흐름", paragraphs: ["교재 수록 조문은 정보통신서비스 제공자가 침해사고 발생 사실을 알게 되면 과학기술정보통신부장관 또는 한국인터넷진흥원에 즉시 신고하도록 정리합니다. 이미 다른 법률에 따라 해당 사고를 신고·통지한 경우의 처리와 신고를 받은 기관의 후속 조치도 함께 확인합니다.", "실무 학습에서는 신고 대상·시점·수신 기관을 구분하고, 법률 간 신고 중복 처리 조항을 교재의 조문 및 최신 법령과 함께 확인합니다."] }
              ],
              memoryPoints: ["정보통신망법의 목적은 망 이용 촉진, 이용자 보호, 안전한 이용환경 조성입니다.", "침해사고 신고는 교재 기준으로 정보통신서비스 제공자가 과학기술정보통신부장관 또는 KISA에 즉시 합니다."]
            },
            {
              id: "network-act-advertising-and-user-protection",
              title: "정보통신망의 이용자 보호와 광고성 정보",
              summary: "교재에 수록된 이용자 보호·영리목적 광고성 정보 규정을 절차와 통제 목적 중심으로 읽습니다.",
              sourcePdfPages: [1017, 1018],
              keywords: ["이용자 보호", "영리목적 광고성 정보", "정보통신망법 제50조", "광고성 정보 전송", "수신자 동의"],
              questionKeywords: ["정보통신망법 광고성 정보", "영리목적 광고성 정보 전송", "광고 수신동의", "정보통신망 이용자 보호"],
              blocks: [
                { type: "text", title: "광고성 정보 통제의 핵심", paragraphs: ["교재는 영리목적 광고성 정보의 전송과 이용자 보호 조항을 다루며, 수신자의 의사와 정보통신서비스 제공자의 조치가 핵심임을 강조합니다. 광고 전송·수신동의·거부와 관련된 세부 요건은 교재에 실린 법 조문을 기준으로 학습하고, 조문 개정 여부가 중요한 내용은 최신 법령을 별도로 확인해야 합니다.", "정보통신망법은 정보통신서비스의 안전한 이용환경 조성을 독립된 장으로 두며, 침해사고 신고와 보호조치 규정을 포함합니다."] },
                { type: "table", title: "시험에서 구분할 관점", columns: ["확인 항목", "학습 포인트"], rows: [["전송 주체", "광고성 정보를 보내는 자와 정보통신서비스 제공자의 역할을 구분"], ["수신자 권리", "수신 의사·동의와 거부 의사에 관한 절차를 조문에서 확인"], ["기술·운영 조치", "차단·신고 소프트웨어 등 이용자 보호 지원 조항과 전송 의무를 구분"], ["법령 판본", "책의 요약을 시험 범위로 학습하되 실제 적용에는 현행 조문을 확인"]] }
              ],
              memoryPoints: ["광고성 정보 규정은 전송 주체, 수신자의 의사, 제공자의 조치·지원 항목을 나누어 읽습니다.", "세부 동의·거부 절차와 제재 내용은 교재 판본에 고정하지 말고 현행 조문을 확인합니다."]
            }
          ]
        },
        {
          id: "management-personal-information-principles-rights",
          chapter: "정보보호 윤리 및 법규",
          status: "published",
          title: "개인정보의 개념·처리 원칙과 정보주체 권리",
          summary: "개인정보·가명정보와 처리자의 개념을 구분하고 처리 원칙 및 정보주체의 권리를 정리합니다.",
          sourcePdfPages: [1018, 1023],
          concepts: [
            {
              id: "personal-information-and-processing-principles",
              title: "개인정보의 범위와 처리 원칙",
              summary: "개인을 알아볼 수 있는 정보, 다른 정보와 쉽게 결합해 식별되는 정보, 가명정보와 처리 행위를 구분합니다.",
              sourcePdfPages: [1019, 1022],
              keywords: ["개인정보 보호법", "개인정보", "가명정보", "익명정보", "개인정보처리자", "정보주체", "개인정보 처리 원칙"],
              questionKeywords: ["개인정보 보호법 정의", "개인정보 보호법 제35조", "개인정보와 가명정보", "개인정보처리자", "개인정보 처리 원칙", "익명 가명 처리"],
              blocks: [
                { type: "table", title: "기본 용어", columns: ["용어", "핵심 의미"], rows: [["개인정보", "살아 있는 개인에 관한 정보로, 단독 또는 다른 정보와 쉽게 결합해 개인을 알아볼 수 있는 정보"], ["가명정보", "추가정보를 사용·결합하지 않으면 특정 개인을 알아볼 수 없게 처리한 개인정보"], ["처리", "수집·생성·연계·기록·저장·보유·가공·검색·이용·제공·공개·파기 등 개인정보에 하는 행위"], ["정보주체", "처리되는 정보로 알아볼 수 있는 사람으로 해당 정보의 주체"], ["개인정보처리자", "업무 목적으로 개인정보파일을 운용하며 개인정보를 처리하는 공공기관·법인·단체·개인"]] },
                { type: "text", title: "개인정보 처리 원칙", paragraphs: ["교재가 정리한 원칙은 처리 목적을 명확히 하고 필요한 최소한만 적법·정당하게 수집하는 것, 목적에 맞게 처리하고 목적 외 이용을 제한하는 것, 정확성·완전성·최신성을 유지하는 것입니다.", "처리 위험을 고려해 안전하게 관리하고 처리 관련 사항을 공개하며 정보주체 권리를 보장합니다. 사생활 침해를 최소화하고 익명·가명 처리로 목적을 달성할 수 있으면 식별성을 낮추며, 법적 책임과 의무를 실천합니다."] },
                { type: "text", title: "비식별 처리", paragraphs: ["교재는 가명화·암호화·교환, 표본추출, 테이블 분리, 합성데이터, 집계, 범주화·라운딩 등 여러 기법을 소개합니다. 각 기법은 분석 유용성과 재식별 위험을 함께 고려해야 하며, 가명정보는 익명정보와 달리 개인정보 보호 규율의 대상입니다."] }
              ],
              memoryPoints: ["가명정보는 추가정보와 결합하지 않으면 식별되지 않는 개인정보이며 익명정보와 다릅니다.", "수집 최소성·목적 제한·정확성·안전성·투명성과 정보주체 권리를 함께 봅니다."]
            },
            {
              id: "data-subject-rights",
              title: "정보주체의 권리",
              summary: "정보 제공·동의 결정·열람 및 전송·정지·정정·삭제·파기·피해구제와 자동화 결정 관련 권리를 정리합니다.",
              sourcePdfPages: [1023, 1023],
              keywords: ["정보주체 권리", "열람", "전송 요구", "처리정지", "정정·삭제·파기", "자동화된 결정"],
              questionKeywords: ["개인정보 정보주체 권리", "개인정보 처리 정지", "자동화된 개인정보 결정", "개인정보 열람 전송"],
              blocks: [
                { type: "bullets", title: "교재에 정리된 권리", items: ["개인정보 처리에 관한 정보를 제공받을 권리", "처리에 대한 동의 여부와 범위 등을 선택·결정할 권리", "처리 여부 확인, 열람·사본 발급 및 전송을 요구할 권리", "처리 정지, 정정·삭제 및 파기를 요구할 권리", "처리로 인한 피해를 신속하고 공정한 절차로 구제받을 권리", "완전히 자동화된 처리에 따른 결정을 거부하거나 설명 등을 요구할 권리"] },
                { type: "text", title: "권리 보장", paragraphs: ["개인정보처리자는 정보주체가 권리를 행사할 수 있도록 처리방침과 연락 창구를 알리고, 법령상 제한 사유가 없는 범위에서 요구를 처리해야 합니다. 열람 제한·거절은 법적 요건과 절차에 따르며 임의로 권리를 축소할 수 없습니다."] }
              ],
              memoryPoints: ["권리 묶음은 정보 제공, 동의 결정, 열람·전송, 정지·정정·삭제·파기, 피해구제, 자동화 결정 거부·설명입니다."]
            }
          ]
        },
        {
          id: "management-personal-information-collection-use",
          chapter: "정보보호 윤리 및 법규",
          status: "published",
          title: "개인정보 수집·이용·제공과 목적 제한",
          summary: "수집·이용 근거와 고지·동의, 최소수집, 제3자 제공 및 목적 외 이용 제한을 절차별로 살펴봅니다.",
          sourcePdfPages: [1023, 1028],
          concepts: [
            {
              id: "personal-information-collection-and-use",
              title: "수집·이용 근거와 최소수집",
              summary: "동의 외 법적 수집 근거를 구분하고 목적에 필요한 최소 정보만 처리한다는 원칙을 확인합니다.",
              sourcePdfPages: [1023, 1024],
              keywords: ["개인정보 수집·이용", "동의", "최소수집", "법령상 의무", "공공기관", "정당한 이익"],
              questionKeywords: ["개인정보 수집 이용 근거", "개인정보 최소수집 원칙", "개인정보 동의 고지사항", "동의 없는 개인정보 수집"],
              blocks: [
                { type: "table", title: "교재에 정리된 수집·이용 근거", columns: ["근거", "요건의 요지"], rows: [["정보주체 동의", "처리 목적과 법정 고지사항을 알리고 동의를 받음"], ["법률상 근거·의무", "법률의 특별한 규정 또는 법령상 의무 준수에 불가피함"], ["공공기관 업무", "법령 등에서 정한 공공기관 소관 업무 수행에 불가피함"], ["계약 이행·요청 조치", "계약 이행 또는 정보주체 요청에 따른 조치에 필요함"], ["급박한 이익", "정보주체나 제3자의 급박한 생명·신체·재산상 이익을 위해 필요함"], ["정당한 이익", "처리자의 이익이 정보주체 권리보다 명백히 우선하고 합리적 범위 안에 있음"], ["공공의 안전·안녕", "공중위생 등 공공의 안전과 안녕을 위해 긴급히 필요함"]] },
                { type: "text", title: "동의 고지와 최소수집", paragraphs: ["동의를 받을 때에는 수집·이용 목적, 수집 항목, 보유·이용 기간, 동의 거부권과 거부에 따른 불이익을 알립니다. 중요한 사항을 변경하는 경우에도 알리고 동의를 받습니다.", "목적에 필요한 최소한의 개인정보만 수집해야 하며, 최소 수집이라는 점의 입증 책임은 처리자에게 있습니다. 최소 정보 외 수집에 동의하지 않았다는 이유만으로 재화·서비스 제공을 거부할 수 없다는 점도 확인합니다."] }
              ],
              memoryPoints: ["동의 외 수집 근거도 법정 요건에 맞아야 합니다.", "목적에 필요한 최소 정보만 수집하고, 최소성 입증 책임은 처리자에게 있습니다."]
            },
            {
              id: "personal-information-third-party-and-purpose-limitation",
              title: "제3자 제공과 목적 외 이용 제한",
              summary: "제3자 제공의 동의 고지 항목과 목적 외 이용·제공 제한 및 예외를 구분합니다.",
              sourcePdfPages: [1024, 1026],
              keywords: ["개인정보 제3자 제공", "목적 외 이용", "제공받는 자", "제공 목적", "보유·이용 기간"],
              questionKeywords: ["개인정보 제3자 제공 동의사항", "개인정보 목적 외 이용 제공", "정보주체 동의 제공"],
              blocks: [
                { type: "text", title: "제3자 제공과 고지", paragraphs: ["교재가 제시하는 제공 근거에는 정보주체 동의, 법률의 특별한 규정, 급박한 생명·신체·재산상 이익 등 법정 사유가 있습니다. 동의를 받는 경우 제공받는 자, 이용 목적, 제공 항목, 보유·이용 기간, 동의 거부권 및 불이익을 알립니다.", "제공 동의와 수집·이용 동의는 목적·수신자·범위가 다를 수 있으므로 필요한 동의를 구분하여 확인합니다."] },
                { type: "text", title: "목적 외 이용·제공", paragraphs: ["개인정보는 수집 당시 목적과 법정 범위를 넘어서 이용하거나 제공하지 않는 것이 원칙입니다. 교재에는 별도 동의, 법률의 특별한 규정, 급박한 이익, 공공기관의 법정 업무 등 예외 사유가 제시되며 일부 사유는 공공기관에 한정됩니다.", "공공기관의 목적 외 이용·제공은 법적 근거·목적·범위를 공개하고, 제3자 제공 시 이용 목적·방법 제한이나 안전조치를 요청하는 규정도 함께 확인합니다."] },
                { type: "table", title: "동의 시 구분해 알릴 항목", columns: ["수집·이용", "제3자 제공"], rows: [["수집·이용 목적", "제공받는 자"], ["수집 항목", "제공받는 자의 이용 목적"], ["보유·이용 기간", "제공 항목과 보유·이용 기간"], ["동의 거부권 및 불이익", "동의 거부권 및 불이익"]] }
              ],
              memoryPoints: ["제3자 제공 동의에는 수신자와 수신 목적이 별도로 포함됩니다.", "목적 외 이용·제공은 금지가 원칙이며 법정 예외와 적용 주체 범위를 확인합니다."]
            }
          ]
        },
        {
          id: "management-personal-information-restricted-processing",
          chapter: "정보보호 윤리 및 법규",
          status: "published",
          title: "민감·고유식별정보, 영상정보와 처리위탁",
          summary: "강화된 제한이 적용되는 정보와 영상정보처리기기 규칙, 수탁자 공개·감독 책임을 정리합니다.",
          sourcePdfPages: [1029, 1032],
          concepts: [
            {
              id: "sensitive-unique-identifiers-and-cctv",
              title: "민감정보·고유식별정보와 영상정보처리기기",
              summary: "민감정보·고유식별정보의 별도 제한과 CCTV 설치·안내·촬영·녹음 규칙을 구분합니다.",
              sourcePdfPages: [1029, 1031],
              keywords: ["민감정보", "고유식별정보", "주민등록번호", "고정형 영상정보처리기기", "CCTV", "녹음 금지"],
              questionKeywords: ["민감정보 처리 제한", "고유식별정보 처리", "주민등록번호 처리 제한", "CCTV 설치 안내판", "영상정보처리기기 녹음"],
              blocks: [
                { type: "table", title: "강화된 처리 제한", columns: ["대상", "교재의 처리 원칙"], rows: [["민감정보", "사상·신념, 정치적 견해, 건강·성생활 등 사생활을 현저히 침해할 우려가 있는 정보; 별도 동의 또는 법령상 근거 등 예외를 확인"], ["고유식별정보", "개인을 고유하게 구별하기 위해 부여된 식별정보; 별도 동의나 법령상 구체적 근거 등 예외를 확인"], ["주민등록번호", "일반 고유식별정보 조항과 별도로 처리 제한 조항이 있음을 구분"]] },
                { type: "text", title: "영상정보처리기기 운영", paragraphs: ["교재는 법령상 허용, 범죄 예방·수사, 시설 안전·관리와 화재 예방, 교통단속·정보 수집 등 정해진 경우에 설치·운영할 수 있는 체계를 설명합니다. 사생활을 현저히 침해할 장소 내부를 촬영하는 설치는 제한되며 설치 목적·장소·촬영 범위·시간·관리책임자 연락처 등을 안내해야 합니다.", "설치 목적과 다른 임의 조작·촬영을 하지 않고 녹음 기능을 사용하지 않으며 영상정보의 안전성을 확보합니다. 공공기관 설치의 의견 수렴 절차도 확인합니다."] }
              ],
              memoryPoints: ["민감정보·고유식별정보는 일반 개인정보보다 강화된 별도 요건을 확인합니다.", "영상기기는 허용 목적·안내판·안전조치를 갖추고 녹음 기능을 사용하지 않습니다."]
            },
            {
              id: "personal-information-outsourcing",
              title: "개인정보 처리업무 위탁과 수탁자 감독",
              summary: "위탁 계약·공개·통지, 수탁자의 목적 외 처리 금지와 위탁자의 교육·점검 의무를 정리합니다.",
              sourcePdfPages: [1032, 1032],
              keywords: ["개인정보 처리 위탁", "위탁자", "수탁자", "재위탁", "수탁자 감독", "처리업무 계약"],
              questionKeywords: ["개인정보 처리위탁 의무", "위탁자 수탁자 개인정보", "수탁자 공개 감독", "개인정보 재위탁"],
              blocks: [
                { type: "text", title: "위탁자의 관리 의무", paragraphs: ["개인정보 처리업무를 위탁할 때에는 위탁업무 목적 외 처리 금지와 안전한 관리에 필요한 사항을 문서에 포함합니다. 위탁업무 내용과 수탁자를 공개하고, 홍보·판매 권유 업무의 위탁은 정해진 방법으로 정보주체에게 알립니다.", "위탁자는 수탁자를 교육하고 처리 현황을 점검하는 등 안전한 처리를 감독합니다. 재위탁 요건과 수탁자의 위반에 따른 책임 관계도 계약과 법령에 따라 관리합니다."] },
                { type: "table", title: "위탁 관계의 역할", columns: ["주체", "핵심 사항"], rows: [["위탁자", "처리 목적·범위를 정하고 계약·공개·교육·점검 등 관리·감독 수행"], ["수탁자", "위탁받은 업무 범위 안에서 처리하고 안전조치·재위탁 제한 준수"], ["정보주체", "위탁업무 내용과 수탁자를 확인할 수 있도록 공개·통지받음"]] }
              ],
              memoryPoints: ["위탁자는 계약·공개·교육·점검으로 수탁자를 관리하고, 수탁자는 위탁 목적과 범위를 넘지 않습니다."]
            }
          ]
        },
        {
          id: "management-personal-information-overseas-transfer",
          chapter: "정보보호 윤리 및 법규",
          status: "published",
          title: "가명정보 처리와 개인정보 국외 이전",
          summary: "통계·연구 목적의 가명정보 처리 조건과 국외 이전의 허용 근거·고지 항목을 정리합니다.",
          sourcePdfPages: [1033, 1033],
          concepts: [
            {
              id: "pseudonymous-data-and-overseas-transfer",
              title: "가명정보 활용과 국외 이전 조건",
              summary: "동의 없이 가명정보를 활용할 수 있는 목적, 재식별 방지, 국외 이전 허용 조건을 구분합니다.",
              sourcePdfPages: [1033, 1033],
              keywords: ["가명정보", "통계작성", "과학적 연구", "공익적 기록보존", "개인정보 국외 이전", "개인정보 보호 인증"],
              questionKeywords: ["가명정보 처리 목적", "가명정보 제3자 제공", "개인정보 국외 이전", "국외 이전 동의"],
              blocks: [
                { type: "text", title: "가명정보 처리", paragraphs: ["교재에 수록된 개인정보 보호법은 통계작성, 과학적 연구, 공익적 기록보존 등을 위해 정보주체 동의 없이 가명정보를 처리할 수 있도록 정리합니다. 제3자 제공 시에는 특정 개인을 알아보기 위해 사용될 수 있는 정보를 포함하지 않습니다.", "가명정보 처리도 목적·범위·안전조치를 관리해야 하며, 다른 정보와 결합해 개인을 알아보려는 시도는 금지되는 것으로 교재가 설명합니다."] },
                { type: "table", title: "교재에 정리된 국외 이전 근거", columns: ["근거", "핵심 조건"], rows: [["별도 동의", "정보주체로부터 국외 이전에 관한 별도 동의를 받음"], ["법률·조약", "법률 또는 대한민국이 당사자인 조약·국제협정에 특별 규정이 있음"], ["계약 이행상 위탁·보관", "계약 체결·이행에 필요하고 처리방침 공개 또는 정해진 방법으로 정보주체에게 알림"], ["보호 인증", "이전받는 자가 보호 인증을 받고 필요한 안전조치와 현지 이행조치를 수행"], ["동등한 보호수준", "보호위원회가 해당 국가·국제기구의 보호체계와 권리구제 등이 실질적으로 동등하다고 인정"]] },
                { type: "text", title: "이전 전 확인", paragraphs: ["교재는 이전되는 개인정보 항목, 이전 국가·시기·방법, 이전받는 자의 명칭과 연락처, 이용 목적과 보유·이용 기간, 이전 거부 방법과 절차·효과 등을 정보주체에게 알리는 항목으로 제시합니다. 실제 적용 전에는 교재 판본이 아닌 현행 법령과 하위 규정을 확인해야 합니다."] }
              ],
              memoryPoints: ["가명정보의 교재상 주요 목적은 통계작성·과학적 연구·공익적 기록보존입니다.", "국외 이전은 별도 동의만 있는 것이 아니라 법률·계약·인증·동등성 인정 등 교재에 나온 근거와 고지 요건을 구분합니다."]
            }
          ]
        },
        {
          id: "management-personal-information-security-and-breach",
          chapter: "정보보호 윤리 및 법규",
          status: "published",
          title: "개인정보의 안전한 관리와 유출 대응",
          summary: "처리방침·개인정보파일 관리와 영향평가, 유출 통지·신고의 정보 항목과 교재에 제시된 조건을 학습합니다.",
          sourcePdfPages: [1034, 1038],
          concepts: [
            {
              id: "privacy-policy-and-impact-assessment",
              title: "처리방침·개인정보파일·영향평가",
              summary: "처리 투명성을 위한 처리방침·파일 등록 항목과 공공기관 개인정보 영향평가 의무대상을 파악합니다.",
              sourcePdfPages: [1034, 1037],
              keywords: ["개인정보 처리방침", "개인정보파일", "개인정보 보호위원회 등록", "개인정보 영향평가", "PIA"],
              questionKeywords: ["개인정보 처리방침 포함사항", "개인정보파일 등록 항목", "개인정보 영향평가 의무대상", "개인정보 영향평가 5만 50만 100만"],
              blocks: [
                { type: "text", title: "처리방침과 개인정보파일", paragraphs: ["개인정보 처리방침은 처리 목적과 보유 기간, 제3자 제공, 파기 절차, 처리 위탁, 가명정보 처리, 정보주체 권리 행사, 보호책임자 연락처 등 처리 현황을 알리는 문서입니다.", "공공기관이 개인정보파일을 운용하는 경우 교재는 파일 명칭, 운영 근거·목적, 기록 항목, 처리 방법, 보유 기간, 제공받는 자 등을 등록·공개할 사항으로 제시합니다. 보호위원회는 필요하면 등록 내용을 검토하고 개선을 권고할 수 있습니다."] },
                { type: "table", title: "교재에 제시된 개인정보 영향평가 대상 기준", columns: ["유형", "기준 요약"], rows: [["민감·고유식별정보 파일", "해당 개인정보가 포함된 파일에 정보주체 5만 명 이상"], ["다른 파일과 연계", "연계 결과 정보주체 50만 명 이상"], ["일반 개인정보파일", "정보주체 100만 명 이상"], ["운용 체계 변경", "영향평가 후 검색체계 등 운용체계를 변경하는 경우 변경된 부분을 평가"]] },
                { type: "text", title: "영향평가", paragraphs: ["개인정보 영향평가는 공공기관 개인정보파일 운용으로 정보주체 개인정보 침해 우려가 있을 때 위험을 분석하고 개선사항을 도출하는 평가입니다. 개인정보 항목·제3자 제공·정보주체 권리 침해 가능성·위험 정도 등을 검토하고 결과를 보호위원회에 제출하는 흐름을 교재에서 확인합니다.", "위 기준과 수치는 교재의 시행령 요약이므로 실제 업무에는 현행 시행령을 확인해야 합니다."] }
              ],
              memoryPoints: ["교재 표의 영향평가 인원 기준은 민감·고유식별 5만, 연계 50만, 일반 파일 100만 명입니다.", "처리방침 공개는 처리 투명성과 정보주체 권리 보장을 위한 것이고, 영향평가는 공공기관 개인정보파일의 위험을 사전 분석합니다."]
            },
            {
              id: "personal-information-breach-notice-and-reporting",
              title: "개인정보 유출 통지와 신고",
              summary: "유출 통지에 포함할 다섯 항목, 피해 최소화 조치와 교재에 수록된 72시간 신고 조건을 구분합니다.",
              sourcePdfPages: [1037, 1038],
              keywords: ["개인정보 유출", "유출 통지", "72시간", "1천 명", "민감정보", "고유식별정보", "KISA"],
              questionKeywords: ["개인정보 유출 통지 사항", "개인정보 유출 신고 72시간", "개인정보 유출 1천 명", "민감정보 유출 신고"],
              blocks: [
                { type: "bullets", title: "정보주체에게 알릴 사항", items: ["유출된 개인정보 항목", "유출 시점과 경위", "피해를 줄이기 위해 정보주체가 할 수 있는 방법", "처리자의 대응조치와 피해구제 절차", "피해 신고를 접수할 담당부서와 연락처"] },
                { type: "text", title: "신고·대응 흐름", paragraphs: ["개인정보처리자는 유출을 알게 되면 정보주체에게 지체 없이 통지하고 피해 최소화 대책과 필요한 조치를 합니다. 교재에 수록된 시행령 요약은 정보주체 1천 명 이상 유출, 민감정보·고유식별정보 유출, 또는 처리시스템·기기에 대한 외부의 불법 접근으로 인한 유출 등의 경우를 신고 대상으로 제시합니다.", "교재 판본 기준 요약은 원칙적으로 72시간 이내 보호위원회 또는 전문기관에 신고하며, 본문 이미지에서 수치와 적용 사유를 확인했습니다. 실제 사고 대응에는 현행 법령의 신고 대상·기한·예외를 재확인해야 합니다."] }
              ],
              memoryPoints: ["통지에는 유출 항목·시점과 경위·피해 최소화 방법·대응 및 구제절차·담당부서 연락처를 포함합니다.", "교재의 신고 요약은 1천 명 이상, 민감·고유식별정보, 외부의 불법 접근 유출 조건과 72시간을 연결합니다."]
            }
          ]
        },
        {
          id: "management-personal-information-remedies",
          chapter: "정보보호 윤리 및 법규",
          status: "published",
          title: "개인정보 열람과 단체소송·금지행위",
          summary: "정보주체의 열람 요구 및 제한 사유, 개인정보 집단 권리구제와 금지행위를 정리합니다.",
          sourcePdfPages: [1038, 1040],
          concepts: [
            {
              id: "personal-information-access-and-collective-action",
              title: "열람권·단체소송과 위법 처리 금지",
              summary: "열람 요청·예외, 소비자단체·비영리단체의 단체소송 요건, 개인정보 취득·누설·훼손 금지행위를 구분합니다.",
              sourcePdfPages: [1038, 1040],
              keywords: ["개인정보 열람", "열람 제한", "개인정보 단체소송", "소비자단체", "비영리민간단체", "금지행위"],
              questionKeywords: ["개인정보 열람 요구", "개인정보 단체소송 자격", "소비자단체 단체소송", "개인정보 금지행위"],
              blocks: [
                { type: "text", title: "열람 요구와 제한", paragraphs: ["정보주체는 자신의 개인정보 열람을 요구할 수 있으며, 교재는 법령에 따른 열람 금지·제한, 타인의 생명·신체나 재산상 이익 침해 우려, 공공기관의 일부 업무에 중대한 지장을 주는 경우 등 제한 사유를 정리합니다. 제한·거절 시에는 사유와 법정 절차를 확인합니다."] },
                { type: "table", title: "교재에 정리된 단체소송 제기 자격", columns: ["단체 유형", "교재의 요건 요약"], rows: [["등록 소비자단체", "정보주체 권익 증진을 주된 목적으로 하고 정회원 1천 명 이상, 등록 후 3년 경과 등 요건"], ["비영리민간단체", "동일한 침해를 입은 정보주체 100명 이상의 요청, 최근 3년 활동, 상시 구성원 5천 명 이상, 중앙행정기관 등록 등 요건"]] },
                { type: "text", title: "금지행위", paragraphs: ["교재는 거짓·부정한 수단으로 개인정보를 취득하거나 동의를 받는 행위, 업무상 알게 된 개인정보를 누설하거나 권한 없이 이용하게 하는 행위, 정당한 권한 없이 개인정보를 훼손·멸실·변경·위조·유출하는 행위 등을 금지행위로 정리합니다.", "단체소송은 개인정보처리자의 권리 침해 행위를 금지·중지하도록 청구하는 집단적 구제 수단으로, 손해배상 청구와 목적을 구분합니다."] }
              ],
              memoryPoints: ["열람 제한은 법령·타인의 권리·공공기관 업무 등 정해진 사유와 절차에 따릅니다.", "단체소송의 소비자단체와 비영리민간단체 요건은 서로 다르므로 인원·활동기간·등록 조건을 구분합니다."]
            }
          ]
        },
        {
          id: "management-electronic-signature-law",
          chapter: "정보보호 윤리 및 법규",
          status: "published",
          title: "전자서명법의 기본 용어와 인증",
          summary: "전자문서·전자서명·생성정보와 인증서의 관계를 구분하고 현행 법 체계에서 용어를 읽는 기준을 익힙니다.",
          sourcePdfPages: [1041, 1041],
          concepts: [
            {
              id: "electronic-signature-law-terms",
              title: "전자서명·생성정보·인증서",
              summary: "전자서명이 제공하는 서명자 신원·서명 사실의 확인과 인증서·전자서명인증의 의미를 연결합니다.",
              sourcePdfPages: [1041, 1041],
              keywords: ["전자서명법", "전자문서", "전자서명", "전자서명생성정보", "전자서명수단", "전자서명인증", "인증서"],
              questionKeywords: ["전자서명법 용어", "전자서명생성정보", "전자서명 인증서", "전자문서 전자서명"],
              blocks: [
                { type: "text", title: "법의 목적", paragraphs: ["전자서명법은 전자문서의 안전성과 신뢰성을 확보하고 이용을 활성화하기 위해 전자서명에 관한 기본 사항을 정하며, 국가·사회의 정보화와 국민 생활의 편익을 촉진하는 것을 목적으로 합니다."] },
                { type: "table", title: "전자서명법 용어", columns: ["용어", "교재의 정의 요지"], rows: [["전자문서", "정보처리시스템을 통해 전자적 형태로 작성·송신·수신·저장된 정보"], ["전자서명", "전자문서에 첨부·논리적으로 결합된 정보로 서명자의 신원과 해당 문서에 서명한 사실을 확인하는 기능"], ["전자서명생성정보", "전자서명을 생성하기 위해 이용하는 전자적 정보"], ["전자서명수단", "전자서명을 하기 위해 이용하는 전자적 수단"], ["전자서명인증", "생성정보가 가입자에게 유일하게 속한다는 사실 등을 확인·증명하는 행위"], ["인증서", "생성정보가 가입자에게 유일하게 속한다는 사실 등을 확인·증명하는 전자적 정보"]] },
                { type: "text", title: "용어 학습의 기준", paragraphs: ["교재는 과거 공인인증서 중심 조항이 개정으로 정리된 배경을 설명합니다. 시험에서는 특정 과거 인증서 명칭을 현재의 유일한 수단처럼 일반화하지 말고, 전자서명·인증 관련 법률 용어와 소관 체계를 구분합니다. 교재 판본의 제도 설명은 현행 조문과 혼동하지 않도록 합니다."] }
              ],
              memoryPoints: ["전자서명은 서명자 신원과 해당 전자문서에 서명했다는 사실을 확인하는 전자적 정보입니다.", "전자서명생성정보·전자서명수단·전자서명인증·인증서는 서로 다른 개념입니다."]
            }
          ]
        },
        {
          id: "management-personal-information-security-standard",
          chapter: "정보보호 윤리 및 법규",
          status: "published",
          title: "개인정보 안전성 확보조치 기준",
          summary: "내부관리계획부터 권한·접근통제·암호화·접속기록·파기까지 개인정보처리자의 최소 보호조치를 익힙니다.",
          sourcePdfPages: [1042, 1047],
          concepts: [
            {
              id: "privacy-security-management-and-access-control",
              title: "내부관리계획·접근권한·접근통제",
              summary: "보호조직과 책임·교육·위험관리 계획을 수립하고 최소 권한, 개별 계정, 접속제어를 적용합니다.",
              sourcePdfPages: [1042, 1045],
              keywords: ["개인정보 안전성 확보조치 기준", "내부관리계획", "최소 권한", "개인별 계정", "접근통제", "인터넷망 차단", "1만 명", "100만 명"],
              questionKeywords: ["개인정보 내부관리계획 항목", "개인정보 접근권한 관리", "개인정보 접근통제", "개인정보취급자 계정", "개인정보 인터넷망 차단"],
              blocks: [
                { type: "text", title: "기준의 성격과 내부관리계획", paragraphs: ["개인정보 안전성 확보조치 기준은 개인정보의 분실·도난·유출·위조·변조·훼손을 막기 위한 기술적·관리적·물리적 최소 기준입니다. 교재는 개인정보 보호법의 위임에 따른 행정규칙으로 소개합니다.", "내부관리계획에는 보호조직과 책임자, 취급자 역할·교육, 권한·접근통제, 암호화, 접속기록, 악성프로그램 방지, 취약점 점검, 물리적 조치, 유출 대응, 위험관리, 위탁자 관리·감독과 계획 승인·변경 등을 포함합니다. 교재 판본은 1만 명 미만 개인정보를 처리하는 소상공인·개인·단체의 예외를 함께 제시하므로 실제 적용 전 현행 기준을 확인합니다."] },
                { type: "bullets", title: "접근권한과 접속 통제", items: ["업무 수행에 필요한 최소 범위의 권한만 개인별로 차등 부여합니다.", "전보·퇴직 등 담당자 변경 시 권한을 지체 없이 변경·말소하고, 조치 이력을 보관합니다.", "개인정보취급자별 계정을 발급하고 계정을 공유하지 않습니다.", "일정 시간 미사용 시 자동 접속 차단, 비인가 접근 탐지·차단, 모바일 기기 분실·도난 대비를 적용합니다.", "교재 수록 기준은 직전 3개월 일평균 이용자가 100만 명 이상인 처리자에 대해 관리용 컴퓨터 등의 인터넷망 차단 조치를 제시합니다. 클라우드 사용 시 예외·대체조치 조건은 현행 기준을 확인합니다."] }
              ],
              memoryPoints: ["내부관리계획은 조직·책임·교육·권한·접근통제·암호화·기록·사고대응·위탁감독을 포함하는 관리 기반입니다.", "권한은 최소·개별 부여하고 인사변동 시 지체 없이 회수·변경하며 공유계정을 금지합니다."]
            },
            {
              id: "privacy-encryption-logs-and-destruction",
              title: "개인정보 암호화·접속기록·파기",
              summary: "인증정보와 주요 식별자의 암호화, 로그 보관·점검, 복구 불가능한 개인정보 파기 방법을 구분합니다.",
              sourcePdfPages: [1045, 1047],
              keywords: ["개인정보 암호화", "비밀번호 일방향", "고유식별정보", "접속기록", "로그 보관", "개인정보 파기", "완전파괴", "덮어쓰기"],
              questionKeywords: ["개인정보 암호화 대상", "비밀번호 일방향 암호화", "접속기록 보관기간", "개인정보 파기 방법", "고유식별정보 저장"],
              blocks: [
                { type: "table", title: "암호화와 접속기록", columns: ["보호 대상·상황", "교재 기준의 조치"], rows: [["비밀번호", "안전한 알고리즘으로 일방향 암호화해 저장"], ["인증정보·고유식별정보 등", "교재에 열거된 주민등록번호·여권번호·운전면허번호·외국인등록번호·신용카드번호·계좌번호·생체인식정보 등을 안전한 알고리즘으로 보호"], ["전송·저장 위치", "인터넷망 전송과 DMZ 구간, 취급자 단말·모바일·보조저장매체 저장 등 교재 기준에 따른 암호화 적용"], ["접속기록", "기본 1년 이상 보관·관리; 교재에 든 일정 규모·정보유형 등 해당 조건에서는 2년 이상 보관"]] },
                { type: "text", title: "키·로그 관리", paragraphs: ["암호화된 개인정보를 보호하기 위한 암호키 생성·이용·보관·배포·파기 절차를 수립합니다. 접속기록에는 식별자, 접속 일시, 접속지, 처리한 정보주체와 수행업무 등이 남으며 위·변조나 도난·분실되지 않도록 안전하게 보관하고 정기적으로 점검합니다.", "교재 표에는 접속기록 보관기간의 일반 기준과 2년 이상 보관이 필요한 특정 기준이 별도로 제시됩니다. 정보주체 규모·민감정보·고유식별정보 처리 여부 등 세부 적용대상과 점검 주기는 해당 페이지와 현행 고시를 확인합니다."] },
                { type: "table", title: "개인정보 파기 방법", columns: ["매체·상황", "교재에 제시된 방법"], rows: [["전자적 저장매체 전체", "소각·파쇄 등 완전 파괴, 전용 소자장비를 이용한 삭제, 복원되지 않도록 초기화·덮어쓰기"], ["일부 전자파일", "해당 개인정보를 삭제하고 복구·재생되지 않도록 관리·감독"], ["종이·인쇄물·기타 기록매체 일부", "마스킹·구멍 뚫기 등 해당 부분을 알아볼 수 없도록 삭제"], ["기술상 즉시 파기가 곤란한 경우", "복원이 불가능한 형태로 처리하는 대체 조치"]] }
              ],
              memoryPoints: ["비밀번호는 복호화할 수 없는 일방향 암호화로 저장합니다.", "접속기록은 기본 1년 이상이며 교재가 든 예외 기준에서는 2년 이상 보관합니다.", "파기는 복원 불가능성이 핵심이며 저장매체·전자파일·종이기록에 맞는 방법을 선택합니다."]
            }
          ]
        },
        {
          id: "management-domestic-representative-and-electronic-finance",
          chapter: "정보보호 윤리 및 법규",
          status: "published",
          title: "국내대리인 지정과 전자금융 정보보호 거버넌스",
          summary: "일정 요건의 국외 사업자 국내대리인 제도와 금융회사 정보보호위원회의 역할·구성을 구분합니다.",
          sourcePdfPages: [1047, 1048],
          concepts: [
            {
              id: "domestic-representative-designation",
              title: "국내대리인 지정 요건과 자격",
              summary: "국내 주소·영업소가 없는 정보통신서비스 제공자의 교재상 규모 기준, 국내대리인 자격 및 지정 절차를 확인합니다.",
              sourcePdfPages: [1047, 1048],
              keywords: ["국내대리인", "국외 사업자", "1조 원", "100억 원", "100만 명", "개인정보 보호책임자"],
              questionKeywords: ["국내대리인 지정 대상", "국내대리인 자격", "국내대리인 지정 절차", "국외 사업자 개인정보"],
              blocks: [
                { type: "table", title: "교재에 정리된 지정 적용 기준", columns: ["대상 조건", "교재의 문턱값 요약"], rows: [["사업자 위치", "국내에 주소 또는 영업소가 없는 정보통신서비스 제공자 등"], ["전체 매출액", "전년도 매출액 1조 원 이상"], ["정보통신서비스 부문 매출", "전년도 부문 매출액 100억 원 이상"], ["이용자 규모", "직전 3개월 개인정보 저장·관리 이용자의 일일 평균 100만 명 이상"], ["사고 관련 요구", "개인정보 침해사건·사고와 관련해 방송통신위원회가 자료 제출 등을 요구한 경우"]] },
                { type: "text", title: "자격·지정·공개", paragraphs: ["국내대리인은 국내 주소 또는 영업소를 둔 자연인이나 법인이어야 합니다. 한국 국적일 필요는 없으나 국내 이용자 고충을 처리하고 규제기관에 자료를 제출할 수 있도록 한국어 의사소통이 가능해야 한다고 교재가 설명합니다.", "하나 또는 복수의 대리인을 둘 수 있고 교재는 여러 국외 사업자를 한 국내대리인이 대리하거나 개인정보 보호책임자와 동일인이 맡는 경우를 소개합니다. 서면으로 지정하고 성명·주소·전화번호·전자우편주소 등을 개인정보 처리방침에 공개하는 흐름을 확인합니다.", "매출·이용자 문턱값은 교재 판본에 실린 기준입니다. 실제 의무 여부는 적용 시점의 법률·시행령과 규제기관 기준을 확인해야 합니다."] }
              ],
              memoryPoints: ["교재의 국외 사업자 문턱값은 매출 1조 원, 정보통신서비스 부문 100억 원, 일평균 이용자 100만 명 등으로 정리되어 있습니다.", "국내대리인은 한국 국적일 필요는 없지만 국내 주소·영업소와 원활한 한국어 소통 요건을 확인합니다."]
            },
            {
              id: "electronic-finance-security-governance",
              title: "전자금융감독규정과 정보보호위원회",
              summary: "금융회사의 IT 안전성 규정 목적과 정보보호 중요사항을 심의·의결하는 위원회의 구성 기준을 이해합니다.",
              sourcePdfPages: [1048, 1048],
              keywords: ["전자금융감독규정", "금융회사", "전자금융업자", "정보보호위원회", "정보보호최고책임자", "CISO"],
              questionKeywords: ["전자금융감독규정 정보보호위원회", "금융회사 정보보호위원회 구성", "정보보호위원회 위원장"],
              blocks: [
                { type: "text", title: "규정의 목적과 적용 맥락", paragraphs: ["교재는 전자금융감독규정을 전자금융거래법·시행령에서 금융위원회에 위임한 사항과 검사 대상 기관의 정보기술 부문 안전성 확보에 필요한 사항을 정하는 규정으로 설명합니다."] },
                { type: "table", title: "정보보호위원회", columns: ["항목", "교재에 정리된 내용"], rows: [["설치 주체", "금융회사 또는 전자금융업자"], ["기능", "중요 정보보호 사항을 심의·의결"], ["위원장", "정보보호최고책임자(CISO)"], ["위원 구성", "정보보호, 전산 운영·개발, 준법 관련 부서의 장 등"]] },
                { type: "text", title: "거버넌스 연결", paragraphs: ["금융 정보보호는 보안부서만의 기술 업무가 아니라 정보보호 책임자와 IT 운영·개발, 준법 부서가 참여하는 심의·의결 구조로 운영합니다. 구체적인 위원회 운영 요건과 금융회사별 의무는 교재의 해당 규정과 현행 감독규정에서 확인합니다."] }
              ],
              memoryPoints: ["교재에서 정보보호위원회는 금융회사·전자금융업자가 중요 보안 사항을 심의·의결하는 기구이며 CISO가 위원장입니다.", "IT 운영·개발과 준법 부서가 함께 참여하는 책임 구조를 기억합니다."]
            }
          ]
        },
        {
          id: "management-cloud-computing-law",
          chapter: "정보보호 윤리 및 법규",
          status: "published",
          title: "클라우드컴퓨팅법과 이용자 통지",
          summary: "클라우드컴퓨팅·서비스·이용자 정보 정의, 전담기관 역할, 침해·유출·중단 사고의 통지 조건을 학습합니다.",
          sourcePdfPages: [1088, 1090],
          concepts: [
            {
              id: "cloud-law-definitions-and-agencies",
              title: "클라우드컴퓨팅법의 용어와 전담기관",
              summary: "수요에 맞춰 자원을 신축적으로 제공하는 클라우드 구조와 법정 용어·전담기관을 정리합니다.",
              sourcePdfPages: [1088, 1089],
              keywords: ["클라우드컴퓨팅법", "클라우드컴퓨팅", "클라우드컴퓨팅기술", "클라우드컴퓨팅서비스", "이용자 정보", "가상화", "분산처리", "NIA", "KLID", "KISA", "NIPA"],
              questionKeywords: ["클라우드컴퓨팅법 목적", "클라우드컴퓨팅 용어", "이용자 정보 정의", "클라우드 전담기관"],
              blocks: [
                { type: "text", title: "법의 목적과 정의", paragraphs: ["클라우드컴퓨팅법은 클라우드컴퓨팅의 발전과 이용을 촉진하고 안전한 이용환경을 조성해 국민 생활과 국민경제 발전에 이바지하는 것을 목적으로 합니다.", "클라우드컴퓨팅은 집적·공유된 정보통신 자원을 수요 변화에 맞춰 망을 통해 신축적으로 이용하는 정보처리체계입니다. 가상화·분산처리 등이 관련 기술이며, 클라우드컴퓨팅서비스는 이를 활용해 상용으로 타인에게 자원을 제공하는 서비스입니다. 이용자 정보는 서비스 제공자의 자원에 저장되며 이용자가 소유·관리하는 정보입니다."] },
                { type: "table", title: "교재에 제시된 전담기관", columns: ["기관", "교재에 정리된 역할·근거"], rows: [["한국지능정보사회진흥원 (NIA)", "클라우드컴퓨팅 산업·이용 촉진을 위한 연구·지원"], ["한국지역정보개발원 (KLID)", "전자정부·지역정보 관련 도입·이용 지원"], ["한국인터넷진흥원 (KISA)", "클라우드 이용자 보호·안전한 이용환경 지원"], ["정보통신산업진흥원 (NIPA)", "클라우드 산업 진흥·이용 촉진 사업 지원"]] },
                { type: "text", title: "전담기관 지정", paragraphs: ["교재 수록 조문은 과학기술정보통신부장관이 산업 진흥과 이용 촉진에 필요하면 전담기관을 지정하고 사업 수행 경비를 전부 또는 일부 지원할 수 있도록 설명합니다. 지정·운영과 연도별 사업계획·실적 보고 흐름을 법 조문과 시행령에서 확인합니다."] }
              ],
              memoryPoints: ["클라우드컴퓨팅은 집적·공유 자원을 수요에 따라 정보통신망으로 신축적으로 이용하는 체계입니다.", "전담기관 약어는 NIA·KLID·KISA·NIPA로 교재에 정리되어 있습니다."]
            },
            {
              id: "cloud-incident-notification",
              title: "클라우드 사고·이용자 정보 유출·서비스 중단 통지",
              summary: "이용자 통지와 정부 신고를 구분하고, 교재에 실린 예고 없는 서비스 중단 수치와 통지 항목을 확인합니다.",
              sourcePdfPages: [1090, 1090],
              keywords: ["클라우드 침해사고", "이용자 정보 유출", "서비스 중단", "10분", "24시간", "15분", "과학기술정보통신부"],
              questionKeywords: ["클라우드 침해사고 통지", "클라우드 이용자 정보 유출", "클라우드 서비스 중단 10분 15분", "클라우드 사고 통지 항목"],
              blocks: [
                { type: "table", title: "교재에 수록된 이용자 통지 사유", columns: ["사유", "요건 요약"], rows: [["침해사고", "정보통신망법상 침해사고가 발생한 경우"], ["이용자 정보 유출", "클라우드 이용자 정보가 유출된 경우"], ["예고 없는 서비스 중단", "계약에 정한 기간 이상 중단; 기간을 정하지 않은 경우 연속 10분 이상 또는 24시간 이내 2회 이상 중단되고 누적 15분 이상"]] },
                { type: "bullets", title: "통지와 대응", items: ["제공자는 해당 사유를 이용자에게 지체 없이 알립니다.", "이용자 정보 유출 시에는 교재 수록 조문에 따라 과학기술정보통신부장관에게 즉시 알립니다.", "통지에는 발생 내용·원인, 피해 확산 방지 조치 현황, 이용자의 피해 예방·확산 방지 방법, 담당부서·연락처를 포함합니다.", "원인이 즉시 확인되지 않으면 확인된 내용을 먼저 알리고, 원인을 확인한 후 지체 없이 추가 통지합니다."] },
                { type: "text", title: "수치 읽기", paragraphs: ["10분·24시간·15분은 교재에서 계약상 기간을 따로 정하지 않은 서비스 중단 통지 기준으로 제시한 수치입니다. 법령·계약 개정 가능성이 있으므로 실제 운영에는 현행 조문과 계약상 SLA를 확인합니다."] }
              ],
              memoryPoints: ["교재상 이용자 통지 사유는 침해사고·이용자 정보 유출·정해진 조건 이상의 예고 없는 서비스 중단입니다.", "기간 미정 계약에서 교재 수치는 연속 10분 또는 24시간 내 2회 이상·누적 15분 이상입니다."]
            }
          ]
        },
        {
          id: "management-cloud-security-certification",
          chapter: "정보보호 윤리 및 법규",
          status: "published",
          title: "클라우드 보안인증제",
          summary: "정책·인증·평가기관의 역할을 구분하고 교재 판본의 인증 대상·통제항목·유효기간을 비교합니다.",
          sourcePdfPages: [1091, 1092],
          concepts: [
            {
              id: "cloud-security-certification-framework",
              title: "인증체계와 클라우드 보안인증 기준",
              summary: "클라우드 제공자 신청부터 평가·인증 심의까지의 역할과 기존 유형별·등급별 인증 기준을 살펴봅니다.",
              sourcePdfPages: [1091, 1092],
              keywords: ["클라우드 보안인증제", "IaaS", "SaaS", "DaaS", "KISA", "NSR", "인증위원회", "통제항목", "하등급"],
              questionKeywords: ["클라우드 보안인증 기관 역할", "클라우드 보안인증 등급", "IaaS SaaS DaaS 인증", "클라우드 인증 유효기간"],
              blocks: [
                { type: "text", title: "제도와 기관의 역할", paragraphs: ["클라우드 보안인증제는 관련 법률에 따라 서비스 제공자의 보안 수준을 인증기준으로 평가·인증하는 제도입니다. 교재의 역할표에서 과학기술정보통신부는 정책·제도, 한국인터넷진흥원(KISA)은 인증 신청·기준·인증서와 인증 서비스 관리, 국가보안기술연구소(NSR)는 공공부문 기술자문을 담당합니다.", "평가기관은 기준에 따른 평가를 수행하고, 인증위원회는 결과를 심의·의결하며 인증취소 타당성도 심의합니다. 인증신청인은 클라우드서비스 제공자로서 자체 보안활동을 수행합니다."] },
                { type: "table", title: "교재 판본에 수록된 인증 유형", columns: ["유형", "통제항목", "유효기간", "점검기간(교재 표)"], rows: [["IaaS 보안인증", "116개", "5년", "총 10일: 본점검 5일 + 이행점검 5일"], ["SaaS 표준등급", "79개", "5년", "총 9일: 본점검 5일 + 이행점검 4일"], ["SaaS 간편등급", "31개", "3년", "총 7일: 본점검 4일 + 이행점검 3일"], ["DaaS", "110개", "5년", "총 10일: 본점검 5일 + 이행점검 5일"], ["등급제 하등급", "64개", "5년", "총 9일: 본점검 5일 + 이행점검 4일"], ["등급제 하등급 SaaS", "30개", "5년", "총 7일: 본점검 4일 + 이행점검 3일"]] },
                { type: "text", title: "등급제 표기 주의", paragraphs: ["교재는 상·중·하 등급 체계를 소개하면서 수록 시점에는 하등급만 평가 가능하고 상·중 등급은 도입 예정이라고 설명합니다. 이는 교재 판본의 제도 설명이므로 현재 인증 대상·통제항목·유효기간으로 단정하지 말고 최신 공식 기준을 별도로 확인합니다."] }
              ],
              memoryPoints: ["정책기관은 과학기술정보통신부, 인증기관은 KISA, 공공부문 기술자문은 NSR로 교재에 제시됩니다.", "교재 표에는 기존 유형별 인증과 등급제 인증의 항목 수·점검일·유효기간이 따로 제시되므로 서로 섞지 않습니다.", "등급제의 상·중 도입 여부는 교재 발행 시점에 고정된 설명임을 표시합니다."]
            }
          ]
        }
      ]
    }
  ]
};
