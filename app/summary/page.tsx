"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SubjectKey = "computer" | "embedded";

type SummarySubject = {
  label: string;
  title: string;
  description: string;
  concepts: Array<{ title: string; body: string; points: string[] }>;
  frequent: Array<{ title: string; body: string; answer: string }>;
  comparisons: Array<{ left: string; right: string; point: string }>;
  questions: Array<{ question: string; keywords: string }>;
  finalPrep: Array<{ title: string; body: string; points: string[] }>;
  memorize: string[];
};

type ExtraNote = {
  title: string;
  lead: string;
  bullets: string[];
};

const subjects: Record<SubjectKey, SummarySubject> = {
  computer: {
    label: "컴퓨터 시스템",
    title: "컴시기",
    description: "객관식 필기 기준으로 CPU, 메모리, 운영체제, 프로세스, 스케줄링, 가상 메모리, 네트워크를 헷갈리는 선택지까지 정리했습니다.",
    concepts: [
      { title: "컴퓨터 시스템 구성", body: "컴퓨터 시스템은 하드웨어, 소프트웨어, 데이터, 사용자로 구성된다. 하드웨어는 물리 장치, 소프트웨어는 하드웨어를 제어하거나 문제를 해결하는 프로그램이다.", points: ["하드웨어: CPU, 메모리, 저장장치, 입출력장치", "시스템 소프트웨어: 운영체제, 컴파일러, 드라이버", "응용 소프트웨어: 문서 작성, 웹 브라우저, 게임"] },
      { title: "CPU", body: "CPU는 명령어를 해석하고 실행하는 중앙처리장치다. 제어장치가 명령어 흐름을 관리하고, ALU가 산술/논리 연산을 수행하며, 레지스터가 임시 데이터를 저장한다.", points: ["제어장치: 명령어 해석, 제어 신호 생성", "ALU: 덧셈, 뺄셈, AND, OR 같은 연산", "레지스터: PC, IR, MAR, MBR 등"] },
      { title: "명령어 실행 사이클", body: "CPU는 명령어를 가져오고 해석한 뒤 실행한다. 이 과정이 프로그램이 끝날 때까지 반복된다.", points: ["Fetch: 메모리에서 명령어 인출", "Decode: 명령어 해석", "Execute: 연산, 분기, 데이터 이동 수행", "Write Back: 결과를 레지스터나 메모리에 저장"] },
      { title: "레지스터", body: "레지스터는 CPU 내부의 가장 빠른 저장 공간이다. 용량은 작지만 명령어 실행에 직접 사용된다.", points: ["PC: 다음 실행할 명령어 주소", "IR: 현재 실행 중인 명령어", "MAR: 접근할 메모리 주소", "MBR/MDR: 메모리에서 읽거나 쓸 데이터"] },
      { title: "메모리 계층 구조", body: "속도가 빠른 저장장치는 비싸고 용량이 작다. 따라서 자주 쓰는 데이터는 CPU 가까이에 두고, 큰 데이터는 느린 저장장치에 둔다.", points: ["속도: 레지스터 > 캐시 > RAM > SSD/HDD", "용량: SSD/HDD > RAM > 캐시 > 레지스터", "목적: 속도와 비용의 균형"] },
      { title: "캐시와 지역성", body: "캐시는 CPU와 RAM 사이의 속도 차이를 줄인다. 프로그램은 최근 사용한 데이터나 그 주변 데이터를 다시 사용할 가능성이 높다는 지역성을 가진다.", points: ["시간 지역성: 최근 사용한 데이터를 다시 사용", "공간 지역성: 접근한 주소 근처를 사용", "캐시 히트: 캐시에 데이터 있음", "캐시 미스: RAM에서 가져와야 함"] },
      { title: "운영체제", body: "운영체제는 컴퓨터 자원을 관리하고 사용자 프로그램이 하드웨어를 편리하고 안전하게 사용할 수 있게 해준다.", points: ["프로세스 관리", "메모리 관리", "파일 시스템 관리", "입출력 장치 관리", "보안과 권한 관리"] },
      { title: "커널과 사용자 모드", body: "커널은 운영체제의 핵심 부분으로 하드웨어 자원을 직접 제어한다. 일반 프로그램은 사용자 모드에서 실행되어 시스템을 보호한다.", points: ["커널 모드: 하드웨어 직접 접근 가능", "사용자 모드: 제한된 권한", "시스템 콜: 사용자 모드에서 커널 기능 요청"] },
      { title: "프로세스", body: "프로세스는 실행 중인 프로그램이다. 코드, 데이터, 힙, 스택 같은 독립적인 메모리 공간과 실행 상태를 가진다.", points: ["New: 생성", "Ready: CPU 대기", "Running: 실행", "Waiting: 입출력 등 대기", "Terminated: 종료"] },
      { title: "스레드", body: "스레드는 프로세스 내부의 실행 흐름이다. 같은 프로세스의 코드, 데이터, 힙을 공유하고 각자 스택과 레지스터 상태를 가진다.", points: ["생성/전환 비용이 프로세스보다 작음", "데이터 공유가 쉬움", "하나의 오류가 프로세스 전체에 영향을 줄 수 있음"] },
      { title: "CPU 스케줄링", body: "스케줄링은 여러 프로세스 중 어떤 것에 CPU를 줄지 결정하는 작업이다. 목적은 CPU 이용률, 처리량, 응답 시간, 대기 시간의 균형이다.", points: ["FCFS: 먼저 온 순서", "SJF: 짧은 작업 우선", "Round Robin: 시간 할당량 기준 순환", "Priority: 우선순위 기준"] },
      { title: "동기화와 임계구역", body: "여러 스레드나 프로세스가 공유 자원에 동시에 접근하면 경쟁 상태가 발생할 수 있다. 이를 막기 위해 임계구역과 동기화 기법을 사용한다.", points: ["뮤텍스: 하나만 접근", "세마포어: 정해진 개수만 접근", "데드락: 서로 자원을 기다리며 멈춤", "기아: 특정 작업이 계속 밀림"] },
      { title: "인터럽트", body: "인터럽트는 CPU가 현재 작업을 중단하고 먼저 처리해야 할 사건을 처리하도록 하는 신호다.", points: ["현재 상태 저장", "인터럽트 서비스 루틴 실행", "상태 복구", "원래 작업 재개"] },
      { title: "시스템 콜", body: "시스템 콜은 사용자 프로그램이 운영체제 커널의 기능을 사용하기 위한 공식 인터페이스다.", points: ["파일 열기/읽기/쓰기", "프로세스 생성/종료", "메모리 할당", "네트워크 송수신"] },
      { title: "가상 메모리", body: "가상 메모리는 프로그램마다 독립적인 주소 공간을 제공하고, 필요한 부분만 물리 메모리에 올려 RAM을 효율적으로 쓰게 한다.", points: ["페이지: 가상 메모리 단위", "프레임: 물리 메모리 단위", "페이지 테이블: 주소 변환 정보", "페이지 폴트: 필요한 페이지가 RAM에 없음"] },
      { title: "파일 시스템", body: "파일 시스템은 데이터를 파일과 디렉터리 형태로 저장하고 관리한다. 이름, 위치, 크기, 권한 같은 메타데이터도 함께 관리한다.", points: ["파일 생성/삭제/읽기/쓰기", "디렉터리 구조", "접근 권한", "저장 공간 할당"] },
      { title: "네트워크 기초", body: "네트워크는 여러 장치가 데이터를 주고받는 구조다. IP는 주소, TCP/UDP는 전송 방식, DNS는 도메인 변환, HTTP/HTTPS는 웹 통신에 사용된다.", points: ["IP: 장치 주소", "TCP: 신뢰성 있는 연결 지향", "UDP: 빠른 비연결", "DNS: 도메인 → IP", "HTTPS: 암호화된 HTTP"] }
    ],
    frequent: [
      { title: "프로세스와 스레드 차이", body: "프로세스는 독립적인 실행 단위이고 스레드는 프로세스 내부 실행 흐름이다.", answer: "프로세스는 독립 메모리를 가지며 생성 비용이 크다. 스레드는 같은 프로세스 메모리를 공유하고 생성/전환 비용이 작다." },
      { title: "캐시를 사용하는 이유", body: "CPU가 RAM보다 훨씬 빠르기 때문에 둘 사이 속도 차이를 줄여야 한다.", answer: "캐시는 지역성을 이용해 자주 쓰는 데이터를 CPU 가까이에 저장하여 평균 메모리 접근 시간을 줄인다." },
      { title: "인터럽트 처리 순서", body: "인터럽트는 현재 작업을 깨고 먼저 처리해야 하는 사건을 알린다.", answer: "인터럽트 발생 → 현재 상태 저장 → ISR 실행 → 상태 복구 → 원래 작업 재개." },
      { title: "시스템 콜이 필요한 이유", body: "사용자 프로그램이 하드웨어나 커널 자원에 직접 접근하면 안정성과 보안 문제가 생긴다.", answer: "시스템 콜은 제한된 통로를 통해 커널 기능을 요청하게 하여 보호와 제어를 가능하게 한다." },
      { title: "페이지 폴트", body: "프로그램이 접근한 가상 페이지가 물리 메모리에 없을 때 발생한다.", answer: "운영체제는 필요한 페이지를 디스크에서 RAM으로 적재하고 페이지 테이블을 갱신한 뒤 명령을 재실행한다." },
      { title: "데드락 조건", body: "데드락은 프로세스들이 서로 필요한 자원을 기다리며 영원히 진행하지 못하는 상태다.", answer: "상호 배제, 점유와 대기, 비선점, 순환 대기 네 조건이 동시에 성립하면 발생할 수 있다." },
      { title: "TCP와 UDP", body: "둘 다 전송 계층 프로토콜이지만 보장하는 성질이 다르다.", answer: "TCP는 연결 지향, 순서 보장, 재전송을 제공한다. UDP는 비연결 방식으로 빠르지만 신뢰성을 보장하지 않는다." }
    ],
    comparisons: [
      { left: "캐시", right: "버퍼", point: "캐시는 재사용될 데이터를 저장해 속도를 높이고, 버퍼는 전송 중인 데이터를 임시 저장해 속도 차이를 흡수한다." },
      { left: "RAM", right: "Flash", point: "RAM은 휘발성 실행 공간이고, Flash는 전원이 꺼져도 유지되는 저장 공간이다." },
      { left: "동시성", right: "병렬성", point: "동시성은 여러 작업을 번갈아 처리하는 구조이고, 병렬성은 실제로 동시에 처리하는 구조다." },
      { left: "커널 모드", right: "사용자 모드", point: "커널 모드는 모든 자원 접근 권한이 있고, 사용자 모드는 제한된 권한으로 실행된다." },
      { left: "선점형", right: "비선점형", point: "선점형은 OS가 CPU를 빼앗을 수 있고, 비선점형은 작업이 자발적으로 CPU를 내놓는다." }
    ],
    questions: [
      { question: "운영체제의 역할을 설명하시오.", keywords: "자원 관리, 프로세스, 메모리, 파일, 입출력, 보안" },
      { question: "CPU의 구성 요소와 역할을 설명하시오.", keywords: "제어장치, ALU, 레지스터, 캐시" },
      { question: "명령어 실행 과정을 설명하시오.", keywords: "Fetch, Decode, Execute, Write Back" },
      { question: "프로세스 상태 전이를 설명하시오.", keywords: "Ready, Running, Waiting, 종료" },
      { question: "가상 메모리의 장점을 설명하시오.", keywords: "독립 주소 공간, 메모리 효율, 보호, 페이지" },
      { question: "스케줄링 알고리즘 3가지를 설명하시오.", keywords: "FCFS, SJF, RR, Priority" },
      { question: "데드락의 발생 조건을 쓰시오.", keywords: "상호 배제, 점유와 대기, 비선점, 순환 대기" },
      { question: "TCP와 UDP의 차이와 사용 예를 쓰시오.", keywords: "신뢰성, 연결, 속도, 스트리밍" }
    ],
    finalPrep: [
      { title: "필기 객관식에서 먼저 볼 키워드", body: "문제에서 묻는 대상이 CPU인지, 운영체제인지, 메모리인지 먼저 잡으면 선택지를 빠르게 지울 수 있다.", points: ["CPU: 명령어 실행, 레지스터, ALU, 제어장치", "운영체제: 자원 관리, 프로세스, 메모리, 파일, 입출력", "메모리: 캐시, RAM, 가상 메모리, 페이지", "네트워크: TCP/UDP, IP, DNS, HTTP"] },
      { title: "선택지 제거 기준", body: "객관식은 완벽히 설명하지 못해도 틀린 말을 제거하면 맞출 확률이 크게 올라간다.", points: ["항상/절대/무조건 같은 표현은 의심한다.", "TCP를 빠르다고만 설명하거나 UDP를 신뢰성 보장이라고 하면 틀릴 가능성이 높다.", "스레드를 독립 메모리라고 하면 틀린 설명이다.", "캐시의 목적을 용량 증가라고 하면 틀린 설명이다.", "가상 메모리를 RAM을 물리적으로 늘리는 장치라고 하면 틀린 설명이다."] },
      { title: "운영체제 빈출 한 줄", body: "운영체제는 컴퓨터 자원을 효율적이고 안전하게 관리하는 시스템 소프트웨어다.", points: ["프로세스 관리: 실행 흐름 관리", "메모리 관리: 할당, 회수, 보호", "파일 관리: 저장, 디렉터리, 권한", "입출력 관리: 장치 드라이버, 버퍼, 인터럽트", "보안 관리: 인증, 인가, 접근 제어"] },
      { title: "프로세스/스레드 함정", body: "객관식에서 가장 자주 꼬는 부분은 메모리 공유 여부와 생성 비용이다.", points: ["프로세스는 독립 주소 공간을 가진다.", "스레드는 같은 프로세스의 메모리를 공유한다.", "스레드는 문맥 교환 비용이 상대적으로 작다.", "스레드는 하나의 오류가 같은 프로세스 전체에 영향을 줄 수 있다.", "프로그램은 파일, 프로세스는 실행 중인 프로그램이다."] },
      { title: "스케줄링 빠른 판별", body: "스케줄링은 이름보다 기준을 외우는 것이 중요하다.", points: ["FCFS: 먼저 온 순서, 단순하지만 긴 작업이 앞을 막음", "SJF: 짧은 작업 우선, 평균 대기 시간 감소", "Round Robin: 시간 할당량, 시분할 시스템", "Priority: 우선순위, 기아 가능", "Aging: 기아 방지를 위해 오래 기다린 작업의 우선순위 상승"] },
      { title: "메모리/캐시 함정", body: "캐시, 버퍼, 가상 메모리, 페이지 폴트의 목적을 구분해야 한다.", points: ["캐시: 자주 쓰는 데이터를 가까이 두어 속도 향상", "버퍼: 속도 차이를 완화하기 위한 임시 저장", "가상 메모리: 독립 주소 공간과 메모리 효율 제공", "페이지 폴트: 필요한 페이지가 RAM에 없는 상황", "TLB: 페이지 테이블 접근을 빠르게 하는 캐시"] },
      { title: "네트워크 객관식 핵심", body: "TCP/UDP, DNS, IP, HTTP/HTTPS는 정의형으로 자주 나온다.", points: ["TCP: 연결 지향, 신뢰성, 순서 보장, 재전송", "UDP: 비연결, 빠름, 신뢰성 보장 없음", "IP: 장치 주소와 패킷 전달", "DNS: 도메인 이름을 IP 주소로 변환", "HTTPS: HTTP에 암호화가 더해진 웹 통신"] },
      { title: "시험 직전 5분 루틴", body: "처음부터 깊게 읽지 말고, 빈출 비교를 머릿속에 먼저 올린다.", points: ["프로세스 vs 스레드", "캐시 vs 버퍼", "RAM vs Flash", "TCP vs UDP", "커널 모드 vs 사용자 모드", "선점형 vs 비선점형", "페이지 vs 프레임"] }
    ],
    memorize: [
      "CPU 구성: 제어장치, ALU, 레지스터",
      "명령어 실행: Fetch → Decode → Execute → Write Back",
      "메모리 속도: 레지스터 > 캐시 > RAM > SSD/HDD",
      "지역성: 시간 지역성 + 공간 지역성",
      "프로세스 상태: New, Ready, Running, Waiting, Terminated",
      "스케줄링: FCFS, SJF, Round Robin, Priority",
      "데드락 조건: 상호 배제, 점유와 대기, 비선점, 순환 대기",
      "시스템 콜은 사용자 프로그램이 커널 기능을 요청하는 통로다.",
      "페이지 폴트는 필요한 페이지가 RAM에 없을 때 발생한다.",
      "TCP는 신뢰성, UDP는 속도."
    ]
  },
  embedded: {
    label: "임베디드 시스템",
    title: "임베기",
    description: "객관식 필기 기준으로 MCU, GPIO, 타이머, PWM, ADC/DAC, 통신, 인터럽트, RTOS, 부트 과정을 선택지 함정 중심으로 정리했습니다.",
    concepts: [
      { title: "임베디드 시스템", body: "특정 기능을 수행하기 위해 장치 내부에 내장된 컴퓨터 시스템이다. 일반 PC처럼 범용 작업보다 정해진 제어 기능을 안정적으로 수행하는 것이 중요하다.", points: ["전용성", "실시간성", "제한된 자원", "저전력", "높은 신뢰성"] },
      { title: "MCU", body: "MCU는 마이크로컨트롤러로 CPU, 메모리, GPIO, 타이머, 통신 모듈 같은 주변장치를 하나의 칩에 통합한 제어용 장치다.", points: ["작고 저전력", "외부 부품 적음", "센서/모터/가전 제어에 적합"] },
      { title: "MPU", body: "MPU는 CPU 중심의 처리 장치다. 고성능 처리가 가능하지만 메모리와 주변장치를 외부에 따로 연결하는 경우가 많다.", points: ["고성능", "운영체제 구동에 적합", "회로 구성이 MCU보다 복잡"] },
      { title: "Flash와 SRAM", body: "Flash는 프로그램을 저장하는 비휘발성 메모리이고, SRAM은 실행 중 변수와 스택을 저장하는 휘발성 메모리다.", points: ["Flash: 전원 꺼져도 유지", "SRAM: 빠르지만 전원 차단 시 사라짐", "임베디드는 SRAM 용량 제한을 특히 조심"] },
      { title: "GPIO", body: "GPIO는 범용 디지털 입출력 핀이다. 입력 모드로 버튼이나 센서 값을 읽고, 출력 모드로 LED나 릴레이를 제어한다.", points: ["Input/Output 설정", "Pull-up/Pull-down", "High/Low 디지털 신호"] },
      { title: "Pull-up과 Pull-down", body: "입력 핀이 연결되지 않아 값이 떠 있는 floating 상태를 막기 위해 기본 전압을 정해주는 회로 또는 설정이다.", points: ["Pull-up: 기본값 High", "Pull-down: 기본값 Low", "버튼 입력에서 자주 사용"] },
      { title: "Timer", body: "타이머는 클럭을 기준으로 시간을 세는 주변장치다. 지연, 주기 이벤트, 입력 캡처, PWM 출력 등에 사용된다.", points: ["주기적 인터럽트", "시간 측정", "PWM 생성", "타임아웃 처리"] },
      { title: "PWM", body: "PWM은 디지털 신호의 High 비율인 듀티비를 조절해 평균 출력을 바꾸는 방식이다.", points: ["듀티비 증가: 평균 출력 증가", "LED 밝기 조절", "DC 모터 속도 제어", "서보 모터 제어"] },
      { title: "ADC", body: "ADC는 온도, 조도, 전압처럼 연속적인 아날로그 값을 디지털 값으로 바꾼다.", points: ["10비트: 0~1023", "12비트: 0~4095", "기준 전압과 해상도가 중요"] },
      { title: "DAC", body: "DAC는 디지털 값을 아날로그 전압이나 전류로 바꾼다. 오디오 출력이나 아날로그 제어 신호 생성에 사용된다.", points: ["디지털 → 아날로그", "파형 출력", "오디오/제어 신호"] },
      { title: "UART", body: "UART는 클럭 선 없이 TX/RX 두 선으로 데이터를 주고받는 비동기 직렬 통신이다.", points: ["Baud rate 일치 필요", "TX/RX 교차 연결", "PC-보드 디버깅에 자주 사용"] },
      { title: "SPI", body: "SPI는 마스터가 클럭을 제공하는 고속 동기식 직렬 통신이다. 장치마다 CS 핀으로 선택한다.", points: ["MOSI, MISO, SCLK, CS", "속도가 빠름", "선 개수가 많아질 수 있음"] },
      { title: "I2C", body: "I2C는 SDA와 SCL 두 선으로 여러 장치를 연결하는 동기식 통신이다. 각 장치는 주소를 가진다.", points: ["SDA: 데이터", "SCL: 클럭", "주소 기반 다중 장치", "Pull-up 저항 필요"] },
      { title: "폴링", body: "폴링은 CPU가 장치 상태를 반복해서 확인하는 방식이다. 구현은 쉽지만 CPU 시간이 낭비될 수 있다.", points: ["단순한 구현", "반응 주기가 루프 속도에 의존", "CPU 사용량 증가"] },
      { title: "인터럽트", body: "인터럽트는 이벤트가 발생했을 때 CPU에게 알려주는 방식이다. CPU가 계속 확인하지 않아도 되어 효율적이다.", points: ["빠른 반응", "ISR은 짧게 작성", "공유 데이터 동기화 주의"] },
      { title: "실시간 시스템", body: "실시간 시스템은 결과가 맞는 것뿐 아니라 정해진 시간 안에 처리되는 것이 중요하다.", points: ["Hard real-time: 시간 초과가 치명적", "Soft real-time: 시간 초과 시 품질 저하", "Firm real-time: 늦은 결과는 가치가 거의 없음"] },
      { title: "RTOS", body: "RTOS는 실시간 처리를 지원하는 운영체제다. 태스크 우선순위, 스케줄링, 큐, 세마포어, 뮤텍스 등을 제공한다.", points: ["태스크 관리", "우선순위 기반 스케줄링", "동기화 객체", "타이머"] },
      { title: "Watchdog Timer", body: "Watchdog Timer는 프로그램이 멈추거나 무한 루프에 빠졌을 때 시스템을 자동으로 리셋하는 안전장치다.", points: ["정상 동작 중 주기적 갱신", "갱신 실패 시 타이머 만료", "시스템 리셋"] },
      { title: "부트 과정", body: "전원이 들어오면 CPU는 정해진 시작 주소에서 실행을 시작한다. 이후 부트로더나 초기화 코드가 메모리와 주변장치를 설정하고 main 또는 OS를 실행한다.", points: ["Reset vector", "Startup code", "하드웨어 초기화", "펌웨어/OS 실행"] },
      { title: "크로스 컴파일", body: "개발 PC와 실행 대상 보드의 CPU 구조가 다를 때, PC에서 타깃 보드용 실행 파일을 만드는 방식이다.", points: ["Host: 개발 PC", "Target: 실행 보드", "Toolchain: 타깃용 컴파일러"] }
    ],
    frequent: [
      { title: "MCU와 MPU 차이", body: "둘 다 처리 장치지만 통합 정도와 용도가 다르다.", answer: "MCU는 CPU, 메모리, 주변장치를 포함한 저전력 제어용 칩이다. MPU는 CPU 중심의 고성능 처리 장치로 외부 메모리와 주변장치가 필요하다." },
      { title: "임베디드 시스템 특징", body: "일반 컴퓨터보다 목적이 분명하고 자원이 제한된다.", answer: "전용성, 실시간성, 제한된 자원, 저전력, 높은 신뢰성이 핵심이다." },
      { title: "GPIO 입력이 흔들리는 이유", body: "입력 핀이 High도 Low도 아닌 floating 상태가 되면 값이 불안정하다.", answer: "Pull-up 또는 Pull-down을 설정해 기본 입력값을 정해야 한다." },
      { title: "PWM 원리", body: "디지털 출력은 High/Low뿐이지만 빠르게 반복하면 평균값처럼 제어할 수 있다.", answer: "듀티비를 조절해 평균 출력을 바꾸며 LED 밝기, 모터 속도, 부저 제어에 사용한다." },
      { title: "ADC 해상도", body: "ADC 비트 수가 클수록 아날로그 값을 더 촘촘히 표현한다.", answer: "10비트는 0~1023, 12비트는 0~4095 범위로 변환한다." },
      { title: "UART/SPI/I2C 비교", body: "통신 방식은 선 개수, 속도, 다중 장치 연결 방식이 빈출이다.", answer: "UART는 비동기 TX/RX, SPI는 고속 동기식 4선, I2C는 주소 기반 2선 통신이다." },
      { title: "폴링과 인터럽트", body: "이벤트를 확인하는 주체가 다르다.", answer: "폴링은 CPU가 반복 확인하고, 인터럽트는 이벤트가 발생했을 때 CPU에 알려준다." },
      { title: "RTOS가 필요한 이유", body: "여러 작업을 정해진 시간 안에 예측 가능하게 처리해야 할 때 필요하다.", answer: "우선순위 기반 스케줄링, 태스크 관리, 동기화 기능으로 실시간 처리를 지원한다." },
      { title: "Watchdog Timer", body: "임베디드 장치는 사람이 직접 재부팅하기 어려운 경우가 많다.", answer: "시스템이 멈춰 watchdog 갱신을 못 하면 자동 리셋하여 복구한다." }
    ],
    comparisons: [
      { left: "MCU", right: "MPU", point: "MCU는 주변장치까지 포함한 제어용 칩이고, MPU는 고성능 CPU 중심 장치다." },
      { left: "Flash", right: "SRAM", point: "Flash는 비휘발성 프로그램 저장, SRAM은 휘발성 실행 데이터 저장이다." },
      { left: "UART", right: "SPI", point: "UART는 클럭 없는 비동기 2선 통신, SPI는 클럭 기반 고속 동기 통신이다." },
      { left: "SPI", right: "I2C", point: "SPI는 빠르지만 선이 많고, I2C는 느리지만 두 선으로 여러 장치를 연결하기 좋다." },
      { left: "폴링", right: "인터럽트", point: "폴링은 CPU가 계속 확인하고, 인터럽트는 이벤트 발생 시 알림을 받는다." },
      { left: "Hard RT", right: "Soft RT", point: "Hard real-time은 시간 초과가 치명적이고, Soft real-time은 품질 저하로 이어진다." }
    ],
    questions: [
      { question: "임베디드 시스템의 특징을 설명하시오.", keywords: "전용성, 실시간성, 제한된 자원, 저전력, 신뢰성" },
      { question: "MCU와 MPU의 차이를 설명하시오.", keywords: "통합 주변장치, 외부 메모리, 제어용, 고성능" },
      { question: "GPIO의 역할과 Pull-up/Pull-down을 설명하시오.", keywords: "디지털 입출력, floating 방지, 기본 High/Low" },
      { question: "PWM의 원리와 사용 예를 쓰시오.", keywords: "듀티비, 평균 출력, LED, 모터" },
      { question: "ADC와 DAC의 차이를 설명하시오.", keywords: "아날로그-디지털, 디지털-아날로그, 해상도" },
      { question: "UART, SPI, I2C를 비교하시오.", keywords: "비동기, 동기, TX/RX, MOSI/MISO/SCLK/CS, SDA/SCL" },
      { question: "폴링과 인터럽트의 차이를 설명하시오.", keywords: "반복 확인, 이벤트 알림, CPU 사용량, 반응성" },
      { question: "RTOS의 기능을 설명하시오.", keywords: "태스크, 우선순위, 스케줄링, 세마포어, 뮤텍스, 큐" },
      { question: "Watchdog Timer의 목적과 동작을 설명하시오.", keywords: "주기적 갱신, 타이머 만료, 자동 리셋" },
      { question: "임베디드 시스템의 부트 과정을 설명하시오.", keywords: "전원, Reset vector, 부트로더, 초기화, main/OS" }
    ],
    finalPrep: [
      { title: "필기 객관식에서 먼저 볼 키워드", body: "임베디드는 장치 제어 관점으로 보면 대부분 풀린다. 입력, 처리, 출력, 통신 중 어디를 묻는지 먼저 잡는다.", points: ["입력: GPIO, ADC, 센서, Pull-up/down", "처리: MCU, 타이머, 인터럽트, RTOS", "출력: PWM, DAC, LED, 모터", "통신: UART, SPI, I2C", "안전: Watchdog, Fail-safe, Brown-out Reset"] },
      { title: "선택지 제거 기준", body: "임베디드 객관식은 용어의 방향을 반대로 적는 선택지가 많다.", points: ["ADC를 디지털에서 아날로그 변환이라고 하면 틀림", "DAC를 아날로그에서 디지털 변환이라고 하면 틀림", "UART를 동기식 클럭 통신이라고 하면 틀림", "I2C가 장치마다 CS 핀이 필요하다고 하면 SPI 설명에 가까움", "Watchdog이 성능 향상 장치라고 하면 틀림"] },
      { title: "임베디드 시스템 특징 한 줄", body: "임베디드 시스템은 특정 기능을 수행하기 위해 장치에 내장된 전용 컴퓨터 시스템이다.", points: ["전용성: 특정 목적", "실시간성: 정해진 시간 안에 반응", "제한된 자원: CPU, 메모리, 전력 제한", "저전력: 배터리 기반 장치 많음", "신뢰성: 오작동 시 물리적 위험 가능"] },
      { title: "MCU/MPU 함정", body: "MCU와 MPU는 통합 정도와 용도를 기준으로 구분한다.", points: ["MCU: CPU, 메모리, 주변장치가 한 칩에 통합", "MPU: CPU 중심, 외부 메모리/주변장치 필요", "MCU는 저전력 제어에 적합", "MPU는 고성능 처리와 OS 구동에 적합", "센서 제어, 가전, 간단한 IoT는 MCU 쪽이 자연스럽다."] },
      { title: "GPIO/PWM/ADC 빠른 구분", body: "핀 제어와 신호 변환 문제는 용도를 기준으로 외우면 선택지가 잘 지워진다.", points: ["GPIO: 디지털 High/Low 입력 또는 출력", "Pull-up/down: floating 방지", "PWM: 듀티비로 평균 출력 제어", "ADC: 센서 전압 같은 아날로그 값을 디지털 값으로 변환", "DAC: 디지털 값을 아날로그 출력으로 변환"] },
      { title: "통신 방식 빠른 판별", body: "UART, SPI, I2C는 선 개수와 동기/비동기를 외우면 대부분 해결된다.", points: ["UART: TX/RX, 비동기, Baud rate", "SPI: MOSI/MISO/SCLK/CS, 동기식, 빠름", "I2C: SDA/SCL, 동기식, 주소 기반", "SPI는 장치 선택에 CS 사용", "I2C는 여러 장치를 두 선에 연결하기 좋음"] },
      { title: "인터럽트/폴링 함정", body: "CPU가 계속 확인하면 폴링, 사건이 CPU에 알리면 인터럽트다.", points: ["폴링: 단순하지만 CPU 낭비 가능", "인터럽트: 효율적이고 반응 빠름", "ISR은 짧게 작성", "오래 걸리는 작업은 태스크나 메인 루프로 넘김", "공유 데이터 접근 시 동기화 주의"] },
      { title: "RTOS/Watchdog 객관식 핵심", body: "RTOS는 실시간 태스크 관리, Watchdog은 비정상 상태 복구가 핵심이다.", points: ["RTOS: 태스크, 우선순위, 스케줄링, 큐, 세마포어, 뮤텍스", "Hard real-time: 시간 초과가 치명적", "Soft real-time: 시간 초과 시 품질 저하", "Watchdog: 주기적 갱신 실패 시 리셋", "Watchdog은 오류를 고치는 장치가 아니라 멈춘 시스템을 재시작시키는 장치다."] },
      { title: "시험 직전 5분 루틴", body: "임베디드는 비교표를 먼저 보고, 변환 방향과 통신 선 이름을 마지막에 확인한다.", points: ["MCU vs MPU", "Flash vs SRAM", "ADC vs DAC", "UART vs SPI vs I2C", "폴링 vs 인터럽트", "Hard RT vs Soft RT", "Watchdog 동작 순서"] }
    ],
    memorize: [
      "임베디드 특징: 전용성, 실시간성, 제한된 자원, 신뢰성, 저전력",
      "MCU = CPU + 메모리 + 주변장치",
      "MPU = CPU 중심 고성능 처리 장치",
      "Flash = 프로그램 저장, SRAM = 실행 중 데이터 저장",
      "GPIO = 디지털 입출력, Pull-up/down = floating 방지",
      "PWM = 듀티비로 평균 출력 제어",
      "ADC = 아날로그 → 디지털, DAC = 디지털 → 아날로그",
      "UART = TX/RX, SPI = MOSI/MISO/SCLK/CS, I2C = SDA/SCL",
      "ISR은 짧게 작성하고 오래 걸리는 작업은 태스크로 넘긴다.",
      "Watchdog은 갱신 실패 시 시스템을 리셋한다.",
      "RTOS는 우선순위 기반 태스크 스케줄링을 지원한다."
    ]
  }
};

const extraNotes: Record<SubjectKey, ExtraNote[]> = {
  computer: [
    { title: "컴퓨터 구조 큰 그림", lead: "입력장치가 데이터를 넣고, CPU가 명령어를 실행하며, 메모리와 저장장치가 데이터를 보관하고, 출력장치가 결과를 보여준다.", bullets: ["CPU는 계산 자체보다 명령어 흐름 제어가 중요하다.", "RAM은 실행 중인 프로그램과 데이터를 올려두는 공간이다.", "저장장치는 전원이 꺼져도 데이터가 남는 공간이다.", "입출력장치는 CPU 입장에서 속도가 느리기 때문에 인터럽트와 버퍼가 자주 함께 나온다."] },
    { title: "버스", lead: "버스는 컴퓨터 내부 장치들이 데이터를 주고받는 통로다.", bullets: ["주소 버스: 접근할 메모리나 장치의 위치를 전달한다.", "데이터 버스: 실제 데이터를 주고받는다.", "제어 버스: 읽기/쓰기, 인터럽트, 클럭 같은 제어 신호를 전달한다.", "버스 폭이 넓을수록 한 번에 옮길 수 있는 데이터가 많다."] },
    { title: "주소 지정 방식", lead: "명령어가 피연산자를 어디서 가져올지 정하는 방식이다.", bullets: ["즉시 주소 지정: 명령어 안에 값이 직접 들어 있다.", "직접 주소 지정: 명령어 안에 메모리 주소가 들어 있다.", "간접 주소 지정: 명령어가 가리키는 주소에 실제 주소가 들어 있다.", "레지스터 주소 지정: 피연산자가 레지스터에 있다."] },
    { title: "문맥 교환", lead: "CPU가 실행 중인 프로세스를 바꿀 때 이전 프로세스 상태를 저장하고 다음 프로세스 상태를 복구하는 작업이다.", bullets: ["저장 대상은 PC, 레지스터, 프로세스 상태 등이다.", "문맥 교환이 너무 잦으면 오버헤드가 커진다.", "Round Robin의 시간 할당량이 너무 작으면 문맥 교환 비용이 커진다.", "프로세스보다 스레드 문맥 교환이 일반적으로 가볍다."] },
    { title: "스케줄링 알고리즘 감 잡기", lead: "스케줄링 문제는 평균 대기 시간, 응답성, 기아 가능성을 함께 본다.", bullets: ["FCFS는 단순하지만 긴 작업이 앞에 있으면 뒤 작업이 오래 기다린다.", "SJF는 평균 대기 시간이 짧지만 실행 시간을 미리 알아야 한다.", "Priority는 중요 작업을 먼저 처리하지만 낮은 우선순위 작업이 굶을 수 있다.", "Round Robin은 사용자 응답성이 좋아 시분할 시스템에 적합하다."] },
    { title: "메모리 관리", lead: "운영체제는 여러 프로그램이 메모리를 안전하게 나누어 쓰도록 관리한다.", bullets: ["연속 할당은 단순하지만 외부 단편화가 생길 수 있다.", "페이징은 고정 크기 페이지로 나누어 외부 단편화를 줄인다.", "세그먼테이션은 코드, 데이터, 스택 같은 논리 단위로 나눈다.", "TLB는 페이지 테이블 접근을 빠르게 하기 위한 캐시다."] },
    { title: "파일 시스템 심화", lead: "파일 시스템은 파일 내용뿐 아니라 파일 이름, 크기, 위치, 권한 같은 메타데이터를 관리한다.", bullets: ["디렉터리는 파일 이름과 위치 정보를 관리하는 구조다.", "파일 할당 방식에는 연속 할당, 연결 할당, 색인 할당이 있다.", "권한 관리는 읽기, 쓰기, 실행 권한을 제어한다.", "저널링 파일 시스템은 장애 복구를 쉽게 하기 위해 변경 기록을 남긴다."] },
    { title: "네트워크 계층 감 잡기", lead: "네트워크 문제는 계층별 역할을 묻는 경우가 많다.", bullets: ["응용 계층: HTTP, DNS처럼 사용자가 접하는 서비스", "전송 계층: TCP/UDP로 프로세스 간 통신 담당", "네트워크 계층: IP로 목적지까지 경로 전달", "데이터 링크 계층: 같은 네트워크 안에서 프레임 전달"] },
    { title: "보안 기초", lead: "컴퓨터 시스템 보안은 기밀성, 무결성, 가용성을 지키는 것이 핵심이다.", bullets: ["기밀성: 허가되지 않은 사용자가 정보를 보지 못하게 함", "무결성: 데이터가 허가 없이 변경되지 않게 함", "가용성: 필요한 순간 서비스를 사용할 수 있게 함", "인증은 신원 확인, 인가는 권한 확인이다."] },
    { title: "시험에서 문장 길게 쓰는 법", lead: "단답형도 정의 한 줄보다 원리와 이유를 붙이면 점수를 받기 좋다.", bullets: ["정의 → 목적 → 예시 순서로 쓴다.", "비교 문제는 기준을 먼저 세운다.", "장단점 문제는 성능, 비용, 안정성, 구현 복잡도로 나눈다.", "키워드는 반드시 포함하되 문장으로 자연스럽게 연결한다."] }
  ],
  embedded: [
    { title: "임베디드 시스템 큰 그림", lead: "임베디드 시스템은 센서 입력을 읽고, MCU가 판단한 뒤, 액추에이터나 통신 장치로 결과를 내보내는 구조다.", bullets: ["센서: 온도, 조도, 거리, 압력 같은 물리량 입력", "MCU: 입력 해석, 제어 알고리즘 실행", "액추에이터: 모터, LED, 릴레이, 밸브 같은 출력 장치", "통신: UART, SPI, I2C, CAN, BLE, Wi-Fi 등"] },
    { title: "펌웨어 구조", lead: "펌웨어는 하드웨어를 직접 제어하는 소프트웨어다.", bullets: ["초기화 코드에서 클럭, GPIO, 통신, 타이머를 설정한다.", "메인 루프 방식은 while 루프에서 작업을 반복한다.", "인터럽트 방식은 이벤트가 발생했을 때 ISR을 실행한다.", "RTOS 방식은 여러 태스크를 우선순위에 따라 스케줄링한다."] },
    { title: "클럭과 전력", lead: "임베디드에서는 성능뿐 아니라 전력 소모가 중요하다.", bullets: ["클럭이 높으면 처리 속도는 빨라지지만 전력 소모가 증가한다.", "Sleep/Stop 모드는 사용하지 않는 동안 전력 소모를 줄인다.", "배터리 장치는 센서 샘플링 주기와 통신 빈도가 전력에 큰 영향을 준다.", "필요 없는 주변장치 클럭은 끄는 것이 좋다."] },
    { title: "GPIO 실전 포인트", lead: "GPIO 문제는 입력/출력 설정, Pull-up/down, 채터링이 자주 나온다.", bullets: ["버튼 입력은 floating 방지를 위해 Pull-up 또는 Pull-down을 쓴다.", "기계식 버튼은 채터링 때문에 짧은 시간 여러 번 눌린 것처럼 보일 수 있다.", "디바운싱은 일정 시간 안정된 입력만 인정하는 방식이다.", "출력 핀은 전류 한계를 넘기면 MCU가 손상될 수 있다."] },
    { title: "센서 읽기 흐름", lead: "센서 값은 디지털 통신으로 읽거나 ADC로 변환해서 읽는다.", bullets: ["아날로그 센서는 ADC 채널로 전압을 읽는다.", "디지털 센서는 I2C/SPI/UART로 레지스터 값을 읽는 경우가 많다.", "노이즈가 있으면 평균 필터나 이동 평균을 사용할 수 있다.", "센서 보정은 오프셋과 스케일을 맞추는 과정이다."] },
    { title: "모터 제어", lead: "모터 제어는 PWM, 드라이버, 피드백이 핵심이다.", bullets: ["DC 모터 속도는 PWM 듀티비로 조절한다.", "모터는 MCU 핀으로 직접 구동하지 않고 드라이버 회로를 사용한다.", "서보 모터는 특정 PWM 펄스 폭으로 각도를 제어한다.", "정밀 제어에는 엔코더 같은 피드백 센서를 사용한다."] },
    { title: "통신 오류와 디버깅", lead: "통신 문제는 배선, 속도 설정, 주소, 신호 레벨을 순서대로 확인한다.", bullets: ["UART는 Baud rate와 TX/RX 교차 연결을 확인한다.", "I2C는 주소, Pull-up 저항, SDA/SCL 연결을 확인한다.", "SPI는 CPOL/CPHA, CS 제어, 클럭 속도를 확인한다.", "로직 분석기는 디지털 통신 파형 확인에 유용하다."] },
    { title: "RTOS 태스크 설계", lead: "RTOS에서는 작업을 태스크로 나누고 우선순위를 설계한다.", bullets: ["긴 작업을 높은 우선순위에 두면 낮은 우선순위가 굶을 수 있다.", "공유 자원은 뮤텍스로 보호한다.", "이벤트 알림에는 세마포어나 큐를 사용한다.", "ISR에서 오래 처리하지 말고 태스크에 넘기는 구조가 좋다."] },
    { title: "신뢰성과 안전", lead: "임베디드는 장치 오작동이 물리적 문제로 이어질 수 있어 신뢰성이 중요하다.", bullets: ["Watchdog으로 시스템 멈춤을 복구한다.", "Brown-out Reset은 전압이 낮을 때 오동작을 막는다.", "Fail-safe는 오류가 났을 때 안전한 상태로 가는 설계다.", "펌웨어 업데이트 중 전원 차단에 대비한 복구 전략이 필요하다."] },
    { title: "시험에서 문장 길게 쓰는 법", lead: "임베디드 답안은 구성요소, 동작 방식, 사용 예를 함께 쓰면 안정적이다.", bullets: ["정의 → 구성 → 동작 → 예시 순서로 쓴다.", "통신 비교는 선 개수, 동기/비동기, 속도, 다중 장치 기준으로 쓴다.", "실시간 시스템은 시간 제약을 반드시 언급한다.", "Watchdog, 인터럽트, RTOS는 목적과 동작 순서를 함께 쓴다."] }
  ]
};

export default function SummaryPage() {
  const [subjectKey, setSubjectKey] = useState<SubjectKey>("computer");
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const subject = subjects[subjectKey];
  const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const totalMemoryItems = subjects.computer.memorize.length + subjects.embedded.memorize.length;
  const filtered = useMemo(() => filterSubject(subject, normalizedQuery), [normalizedQuery, subject]);
  const filteredExtraNotes = useMemo(() => filterExtraNotes(extraNotes[subjectKey], normalizedQuery), [normalizedQuery, subjectKey]);

  return (
    <div className="summaryPage">
      <header className="summaryHeader">
        <Link href="/" className="summaryBack">← 홈</Link>
        <div>
          <p>노션식 개념 정리</p>
          <h1>컴시기 · 임베기</h1>
          <span>과목을 고른 뒤 아래로 쭉 내리면서 개념, 빈출, 비교, 예상문제, 암기를 한 번에 보세요.</span>
        </div>
      </header>

      <main className="summaryLayout">
        <aside className="summarySide">
          <div className="summarySubjectButtons">
            {Object.entries(subjects).map(([key, value]) => (
              <button key={key} className={subjectKey === key ? "active" : ""} onClick={() => setSubjectKey(key as SubjectKey)}>
                <strong>{value.title}</strong>
                <span>{value.label}</span>
              </button>
            ))}
          </div>
          <nav className="summaryOutline" aria-label="문서 목차">
            <strong>목차</strong>
            <a href="#concepts">개념</a>
            <a href="#deep">상세</a>
            <a href="#frequent">빈출</a>
            <a href="#comparisons">비교</a>
            <a href="#questions">예상문제</a>
            <a href="#final-prep">시험전</a>
            <a href="#memorize">암기</a>
          </nav>
          <div className="summaryProgress">
            <span>암기 체크</span>
            <strong>{checkedCount} / {totalMemoryItems}</strong>
          </div>
        </aside>

        <section className="summaryMain">
          <div className="summaryIntro">
            <div>
              <p>{subject.label}</p>
              <h2>{subject.title} 정리</h2>
              <span>{subject.description}</span>
            </div>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="검색" aria-label="정리 검색" />
          </div>

          <SummaryBlock id="concepts" title="개념">
            <ConceptList rows={filtered.concepts} />
          </SummaryBlock>
          <SummaryBlock id="deep" title="단원별 상세 정리">
            <ExtraNoteList rows={filteredExtraNotes} />
          </SummaryBlock>
          <SummaryBlock id="frequent" title="빈출 답안">
            <FrequentList rows={filtered.frequent} />
          </SummaryBlock>
          <SummaryBlock id="comparisons" title="헷갈리는 비교">
            <ComparisonTable rows={filtered.comparisons} />
          </SummaryBlock>
          <SummaryBlock id="questions" title="예상 문제">
            <QuestionList rows={filtered.questions} />
          </SummaryBlock>
          <SummaryBlock id="final-prep" title="시험 전 정리">
            <FinalPrepList rows={filtered.finalPrep} />
          </SummaryBlock>
          <SummaryBlock id="memorize" title="빠른 암기">
            <MemoryList subjectKey={subjectKey} rows={filtered.memorize} checked={checked} setChecked={setChecked} />
          </SummaryBlock>
        </section>
      </main>
    </div>
  );
}

function filterSubject(subject: SummarySubject, query: string) {
  if (!query) return subject;
  return {
    ...subject,
    concepts: subject.concepts.filter((item) => `${item.title} ${item.body} ${item.points.join(" ")}`.toLocaleLowerCase("ko-KR").includes(query)),
    frequent: subject.frequent.filter((item) => `${item.title} ${item.body} ${item.answer}`.toLocaleLowerCase("ko-KR").includes(query)),
    comparisons: subject.comparisons.filter((item) => `${item.left} ${item.right} ${item.point}`.toLocaleLowerCase("ko-KR").includes(query)),
    questions: subject.questions.filter((item) => `${item.question} ${item.keywords}`.toLocaleLowerCase("ko-KR").includes(query)),
    finalPrep: subject.finalPrep.filter((item) => `${item.title} ${item.body} ${item.points.join(" ")}`.toLocaleLowerCase("ko-KR").includes(query)),
    memorize: subject.memorize.filter((item) => item.toLocaleLowerCase("ko-KR").includes(query))
  };
}

function filterExtraNotes(rows: ExtraNote[], query: string) {
  if (!query) return rows;
  return rows.filter((item) => `${item.title} ${item.lead} ${item.bullets.join(" ")}`.toLocaleLowerCase("ko-KR").includes(query));
}

function SummaryBlock({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <article className="summaryPanel" id={id}>
      <div className="summaryBlockTitle">
        <h3>{title}</h3>
      </div>
      {children}
    </article>
  );
}

function ConceptList({ rows }: { rows: SummarySubject["concepts"] }) {
  if (!rows.length) return <p className="summaryEmpty">검색 결과가 없습니다.</p>;
  return <div className="summaryDocList">{rows.map((item) => (
    <details key={item.title} className="summaryDocItem" open>
      <summary>{item.title}</summary>
      <p>{item.body}</p>
      <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
    </details>
  ))}</div>;
}

function FrequentList({ rows }: { rows: SummarySubject["frequent"] }) {
  if (!rows.length) return <p className="summaryEmpty">검색 결과가 없습니다.</p>;
  return <div className="summaryDocList">{rows.map((item) => (
    <section key={item.title} className="summaryDocItem important">
      <h4>{item.title}</h4>
      <p>{item.body}</p>
      <div className="answerBox">{item.answer}</div>
    </section>
  ))}</div>;
}

function ExtraNoteList({ rows }: { rows: ExtraNote[] }) {
  if (!rows.length) return <p className="summaryEmpty">검색 결과가 없습니다.</p>;
  return <div className="summaryDocList">{rows.map((item) => (
    <section key={item.title} className="summaryDocItem deep">
      <h4>{item.title}</h4>
      <p>{item.lead}</p>
      <ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
    </section>
  ))}</div>;
}

function FinalPrepList({ rows }: { rows: SummarySubject["finalPrep"] }) {
  if (!rows.length) return <p className="summaryEmpty">검색 결과가 없습니다.</p>;
  return <div className="summaryDocList">{rows.map((item) => (
    <section key={item.title} className="summaryDocItem finalPrep">
      <h4>{item.title}</h4>
      <p>{item.body}</p>
      <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
    </section>
  ))}</div>;
}

function ComparisonTable({ rows }: { rows: SummarySubject["comparisons"] }) {
  if (!rows.length) return <p className="summaryEmpty">검색 결과가 없습니다.</p>;
  return <div className="summaryTableWrap"><table className="summaryTable"><thead><tr><th>왼쪽</th><th>오른쪽</th><th>구분 포인트</th></tr></thead><tbody>{rows.map((row) => <tr key={`${row.left}-${row.right}`}><td>{row.left}</td><td>{row.right}</td><td>{row.point}</td></tr>)}</tbody></table></div>;
}

function QuestionList({ rows }: { rows: SummarySubject["questions"] }) {
  if (!rows.length) return <p className="summaryEmpty">검색 결과가 없습니다.</p>;
  return <ol className="summaryQuestionList">{rows.map((item) => <li key={item.question}><span>{item.question}</span><small>{item.keywords}</small></li>)}</ol>;
}

function MemoryList({ subjectKey, rows, checked, setChecked }: {
  subjectKey: SubjectKey;
  rows: string[];
  checked: Record<string, boolean>;
  setChecked: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  if (!rows.length) return <p className="summaryEmpty">검색 결과가 없습니다.</p>;
  return <div className="summaryMemoryList">{rows.map((item) => {
    const id = `${subjectKey}:${item}`;
    return <label key={id}><input type="checkbox" checked={Boolean(checked[id])} onChange={(event) => setChecked((current) => ({ ...current, [id]: event.target.checked }))} /><span>{item}</span></label>;
  })}</div>;
}
