const app = document.querySelector("#app");
const toast = document.querySelector(".toast");
const backButton = document.querySelector(".back-button");

const state = {
  route: "home",
  previousRoute: "home",
  examType: "written",
  selectedChoice: null,
  submitted: false,
  bookmarked: false,
  aiVisible: false,
  practicalAnswer: "",
  timerSeconds: 38 * 60 + 24,
  aiSaved: { written: false, practical: false },
  randomCount: 20,
  randomTimed: true,
};

try {
  const savedState = JSON.parse(localStorage.getItem("certificate-practice-mockup") || "null");
  if (savedState) {
    state.bookmarked = Boolean(savedState.bookmarked);
    state.aiSaved = { ...state.aiSaved, ...savedState.aiSaved };
  }
} catch {
  // The mockup remains usable when browser storage is unavailable.
}

function persistLocalState() {
  try {
    localStorage.setItem("certificate-practice-mockup", JSON.stringify({
      bookmarked: state.bookmarked,
      aiSaved: state.aiSaved,
    }));
  } catch {
    // Ignore storage failures in the static mockup.
  }
}

const routesWithBack = new Set(["question", "practical", "result", "random", "navigator"]);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function homeTemplate() {
  return `
    <section class="page">
      <div class="hero">
        <p class="eyebrow">오늘도 한 문제씩</p>
        <h1>오늘도<br><em>합격에 가까워지는</em> 시간이에요.</h1>
        <p class="subcopy">부담 없이 이어서 풀어볼까요?</p>
      </div>

      <article class="continue-card">
        <span class="label">최근 학습 · 정보처리기사 필기</span>
        <h2>소프트웨어 설계<br>11번부터 이어서</h2>
        <div class="progress-line"><span></span></div>
        <div class="progress-meta"><span>10문제 완료</span><span>28문제 남음</span></div>
        <button class="primary-button" type="button" data-route="question">이어서 풀기 →</button>
      </article>

      <div class="section-heading"><h2>어떻게 공부할까요?</h2></div>
      <div class="mode-grid">
        <button class="mode-card" type="button" data-route="practice">
          <span class="mode-icon">✎</span>
          <strong>한 문제 연습</strong>
          <small>바로 채점하고<br>해설까지 확인해요</small>
        </button>
        <button class="mode-card featured" type="button" data-route="question">
          <span class="mode-icon">⌁</span>
          <strong>모의시험</strong>
          <small>실전처럼 시간 맞춰<br>풀어봐요</small>
        </button>
        <button class="mode-card" type="button" data-route="random">
          <span class="mode-icon">⌘</span>
          <strong>랜덤 시험</strong>
          <small>범위와 문제 수를<br>직접 정해요</small>
        </button>
        <button class="mode-card" type="button" data-route="bookmarks">
          <span class="mode-icon">↻</span>
          <strong>오답 다시보기</strong>
          <small>틀린 문제만 모아<br>빈틈을 채워요</small>
        </button>
      </div>

      <div class="section-heading"><h2>이번 주 학습</h2><button class="text-button" data-route="history">자세히</button></div>
      <div class="stats-card">
        <div class="stat"><strong>42</strong><span>푼 문제</span></div>
        <div class="stat"><strong>76%</strong><span>정답률</span></div>
        <div class="stat"><strong>3.2h</strong><span>학습 시간</span></div>
      </div>
    </section>`;
}

function practiceTemplate() {
  const writtenActive = state.examType === "written";
  return `
    <section class="page">
      <div class="hero">
        <p class="eyebrow">맞춤 연습</p>
        <h1>무엇을 연습할까요?</h1>
        <p class="subcopy">시험 유형과 범위를 고르면 바로 시작할 수 있어요.</p>
      </div>
      <div class="panel setup-card">
        <span class="field-label">시험 유형</span>
        <div class="segment">
          <button class="${writtenActive ? "is-active" : ""}" data-exam-type="written">필기 CBT</button>
          <button class="${!writtenActive ? "is-active" : ""}" data-exam-type="practical">실기 필답형</button>
        </div>
        <div class="field">
          <span class="field-label">자격증</span>
          <div class="select-row"><span>정보처리기사</span><span>⌄</span></div>
        </div>
        <div class="field">
          <span class="field-label">학습 범위</span>
          <div class="chip-list">
            <button class="chip is-active">전체</button><button class="chip">소프트웨어 설계</button>
            <button class="chip">데이터베이스</button><button class="chip">정보시스템 구축</button>
          </div>
        </div>
        <div class="field">
          <span class="field-label">문제 필터</span>
          <div class="chip-list">
            <button class="chip is-active">모든 문제</button><button class="chip">안 푼 문제</button>
            <button class="chip">오답</button><button class="chip">북마크</button>
          </div>
        </div>
        <button class="primary-button wide" data-route="${writtenActive ? "question" : "practical"}">연습 시작하기</button>
      </div>
    </section>`;
}

function randomTemplate() {
  return `
    <section class="page">
      <div class="hero">
        <p class="eyebrow">나만의 시험</p>
        <h1>랜덤 시험 만들기</h1>
        <p class="subcopy">원하는 범위와 문제 수를 정하면 바로 시험지가 만들어져요.</p>
      </div>
      <div class="panel setup-card">
        <span class="field-label">시험 유형</span>
        <div class="segment">
          <button class="${state.examType === "written" ? "is-active" : ""}" data-exam-type="written">필기 CBT</button>
          <button class="${state.examType === "practical" ? "is-active" : ""}" data-exam-type="practical">실기 필답형</button>
        </div>
        <div class="field"><span class="field-label">자격증</span><div class="select-row"><span>정보처리기사</span><span>⌄</span></div></div>
        <div class="field">
          <span class="field-label">출제 범위</span>
          <div class="chip-list" data-chip-group="categories"><button class="chip is-active">전체</button><button class="chip">소프트웨어 설계</button><button class="chip">데이터베이스</button><button class="chip">정보시스템 구축</button></div>
        </div>
        <div class="field">
          <span class="field-label">문제 수</span>
          <div class="count-selector">
            ${[10, 20, 30, 40].map((count) => `<button class="${state.randomCount === count ? "is-active" : ""}" data-random-count="${count}">${count}문제</button>`).join("")}
          </div>
        </div>
        <div class="setting-row"><div><strong>제한 시간 사용</strong><span>문제당 1분으로 설정돼요</span></div><button class="switch ${state.randomTimed ? "is-on" : ""}" data-action="toggle-timer" aria-label="제한 시간 사용 전환"><span></span></button></div>
        <div class="test-summary"><span>예상 소요 시간</span><strong>${state.randomTimed ? `${state.randomCount}분` : "제한 없음"}</strong></div>
        <button class="primary-button wide" data-action="start-random">랜덤 시험 시작</button>
      </div>
    </section>`;
}

const choices = [
  "요구사항 분석",
  "아키텍처 설계",
  "인터페이스 설계",
  "프로그램 코딩",
];

function questionTemplate() {
  const choiceMarkup = choices.map((choice, index) => {
    const selected = state.selectedChoice === index;
    const correct = state.submitted && index === 1;
    const wrong = state.submitted && selected && index !== 1;
    const classes = ["choice", selected ? "is-selected" : "", correct ? "is-correct" : "", wrong ? "is-wrong" : ""].join(" ");
    return `<button class="${classes}" type="button" data-choice="${index}" ${state.submitted ? "disabled" : ""}>
      <span class="choice-number">${index + 1}</span><span>${choice}</span>
    </button>`;
  }).join("");

  const answer = state.submitted ? `
    <div class="answer-box ${state.selectedChoice === 1 ? "" : "wrong"}">
      <div class="answer-result">${state.selectedChoice === 1 ? "✓ 정답이에요!" : "✕ 아쉬워요. 정답은 2번이에요."}</div>
      <p><strong>공식 해설</strong><br>아키텍처 설계는 시스템의 전체 구조와 구성 요소 간 관계를 정의하는 단계입니다.</p>
      <button class="ai-button" data-action="ai-explain">✦ ${state.aiVisible ? "저장된 AI 해설 접기" : state.aiSaved.written ? "저장된 AI 해설 보기" : "AI에게 쉽게 설명받기"}</button>
      ${state.aiVisible ? `<div class="ai-response"><strong>✦ AI 해설 · 저장됨</strong><p>2번은 시스템의 큰 구조와 구성 요소의 관계를 정하는 단계라서 정답입니다. 1번은 필요한 기능을 파악하는 단계, 3번은 시스템 간 연결 방법을 정하는 단계, 4번은 설계 후 실제 코드를 작성하는 단계입니다.\n\n암기 팁: 요구사항 → 구조 → 연결 → 코딩 순서로 기억하세요.</p></div>` : ""}
    </div>` : "";

  return `
    <section class="page">
      <div class="question-top"><button class="question-count count-button" data-route="navigator"><span>11</span> / 38 · 문제 목록</button><div class="timer">◷ ${formatTime(state.timerSeconds)}</div></div>
      <div class="question-progress"><span style="width:29%"></span></div>
      <article class="panel question-card">
        <div class="question-tags"><span class="tag">필기 CBT</span><span class="tag gray">소프트웨어 설계</span></div>
        <p class="question-text">소프트웨어 개발 생명주기에서 시스템의 전체적인 구조를 결정하는 단계는?</p>
        <div class="choices">${choiceMarkup}</div>
        ${answer}
      </article>
      <div class="question-actions">
        <button class="bookmark-button" data-action="bookmark" aria-label="북마크">${state.bookmarked ? "♥" : "♡"}</button>
        <button class="primary-button" data-action="submit-choice">${state.submitted ? "다음 문제" : "답안 제출"}</button>
      </div>
    </section>`;
}

function navigatorTemplate() {
  return `
    <section class="page">
      <div class="hero"><p class="eyebrow">모의시험 진행 중</p><h1>문제 목록</h1><p class="subcopy">답하지 않은 문제와 검토할 문제를 확인하세요.</p></div>
      <div class="navigator-legend"><span><i class="answered"></i>답변 완료</span><span><i class="current"></i>현재 문제</span><span><i></i>미답변</span></div>
      <div class="panel navigator-card">
        <div class="question-grid">
          ${Array.from({ length: 38 }, (_, index) => {
            const number = index + 1;
            const status = number < 11 ? "answered" : number === 11 ? "current" : number === 17 || number === 24 ? "flagged" : "";
            return `<button class="${status}" data-action="open-question" data-question-number="${number}">${number}${status === "flagged" ? "<small>⚑</small>" : ""}</button>`;
          }).join("")}
        </div>
      </div>
      <div class="navigator-footer"><div><strong>10 / 38</strong><span>답변 완료</span></div><button class="primary-button" data-route="question">계속 풀기</button></div>
    </section>`;
}

function practicalTemplate() {
  const answer = state.submitted ? `
    <div class="answer-box">
      <div class="answer-result">모범답안과 비교해 보세요</div>
      <p><strong>모범답안</strong><br>트랜잭션의 특성은 원자성, 일관성, 격리성, 지속성이다.</p>
      <div class="chip-list"><button class="chip">정답</button><button class="chip is-active">부분 정답</button><button class="chip">오답</button></div>
      <button class="ai-button" data-action="ai-explain">✦ ${state.aiVisible ? "저장된 AI 해설 접기" : state.aiSaved.practical ? "저장된 AI 해설 보기" : "내 답안 AI 해설 보기"}</button>
      ${state.aiVisible ? `<div class="ai-response"><strong>✦ AI 해설 · 저장됨</strong><p>원자성, 일관성, 지속성은 정확히 작성했습니다. 다만 동시에 실행되는 트랜잭션이 서로 영향을 주지 않아야 한다는 ‘격리성’이 빠졌습니다.\n\n암기 팁: ACID는 원·일·격·지로 기억하세요.</p></div>` : ""}
    </div>` : "";
  return `
    <section class="page">
      <div class="question-top"><div class="question-count"><span>3</span> / 20</div><span class="tag">실기 필답형</span></div>
      <div class="question-progress"><span style="width:15%"></span></div>
      <article class="panel question-card">
        <div class="question-tags"><span class="tag">실기 필답형</span><span class="tag gray">데이터베이스</span></div>
        <p class="question-text">데이터베이스 트랜잭션의 ACID 특성 네 가지를 작성하시오.</p>
        <textarea class="written-answer" placeholder="답안을 입력하세요" ${state.submitted ? "disabled" : ""}>${state.practicalAnswer}</textarea>
        <p class="hint">완벽한 문장보다 핵심 용어 중심으로 작성해도 괜찮아요.</p>
        ${answer}
      </article>
      <div class="question-actions">
        <button class="bookmark-button" data-action="bookmark">${state.bookmarked ? "♥" : "♡"}</button>
        <button class="primary-button" data-action="submit-practical">${state.submitted ? "다음 문제" : "답안 확인"}</button>
      </div>
    </section>`;
}

function resultTemplate() {
  return `
    <section class="page">
      <div class="panel result-hero">
        <p class="eyebrow">모의시험 완료</p>
        <div class="score-ring"><div class="score-inner"><div><strong>76점</strong><span>100점 만점</span></div></div></div>
        <span class="pass-badge">✓ 합격 기준을 넘었어요</span>
        <h2 style="margin:14px 0 4px">좋은 흐름이에요!</h2>
        <p class="subcopy">약한 부분만 조금 더 채우면 충분해요.</p>
      </div>
      <div class="breakdown">
        <div class="breakdown-item"><strong style="color:var(--green)">29</strong><span>정답</span></div>
        <div class="breakdown-item"><strong style="color:var(--red)">7</strong><span>오답</span></div>
        <div class="breakdown-item"><strong>2</strong><span>미답변</span></div>
      </div>
      <div class="section-heading"><h2>과목별 결과</h2></div>
      <div class="list">
        <div class="list-item"><span class="list-icon">A</span><span class="list-copy"><strong>소프트웨어 설계 · 84%</strong><span>10문제 중 8문제 정답</span></span><span class="chevron">›</span></div>
        <div class="list-item"><span class="list-icon">D</span><span class="list-copy"><strong>데이터베이스 · 62%</strong><span>조금 더 연습해 보세요</span></span><span class="chevron">›</span></div>
      </div>
      <div class="question-actions"><button class="secondary-button" data-route="home">홈으로</button><button class="primary-button" data-route="bookmarks">오답 7개 복습</button></div>
    </section>`;
}

function historyTemplate() {
  return `
    <section class="page">
      <div class="hero"><p class="eyebrow">나의 성장</p><h1>학습 기록</h1><p class="subcopy">조금씩 쌓인 기록이 합격을 만들어요.</p></div>
      <div class="stats-card"><div class="stat"><strong>186</strong><span>누적 문제</span></div><div class="stat"><strong>73%</strong><span>평균 정답률</span></div><div class="stat"><strong>7일</strong><span>연속 학습</span></div></div>

      <div class="analytics-grid">
        <article class="panel analytics-card weekly-card">
          <div class="card-heading"><div><span class="field-label">주간 학습량</span><strong>이번 주 42문제</strong></div><span class="trend">지난주보다 +12%</span></div>
          <div class="bar-chart" aria-label="최근 7일 문제 풀이 수">
            ${[["월", 34], ["화", 58], ["수", 42], ["목", 76], ["금", 50], ["토", 92], ["일", 68]].map(([day, height]) => `
              <div class="bar-column"><div class="bar-track"><span style="height:${height}%"></span></div><small>${day}</small></div>
            `).join("")}
          </div>
        </article>

        <article class="panel analytics-card">
          <div class="card-heading"><div><span class="field-label">시험 유형별 성과</span><strong>필기와 실기를 비교해요</strong></div></div>
          <div class="exam-stats">
            <div class="exam-stat"><span class="list-icon">C</span><div><strong>필기 CBT</strong><small>정답률 78% · 142문제</small></div><b>78%</b></div>
            <div class="exam-stat"><span class="list-icon practical">答</span><div><strong>실기 필답형</strong><small>완성도 64% · 44문제</small></div><b>64%</b></div>
          </div>
        </article>
      </div>

      <div class="section-heading"><h2>과목별 정답률</h2><span class="subcopy">최근 30일</span></div>
      <div class="panel category-stats">
        ${[["소프트웨어 설계", 84], ["데이터베이스", 62], ["정보시스템 구축", 71]].map(([label, value]) => `
          <div class="category-row"><div class="category-label"><span>${label}</span><strong>${value}%</strong></div><div class="metric-line"><span style="width:${value}%"></span></div></div>
        `).join("")}
      </div>

      <div class="section-heading"><h2>최근 기록</h2></div>
      <div class="list">
        <button class="list-item" data-route="result"><span class="list-icon">✓</span><span class="list-copy"><strong>정보처리기사 필기 모의시험</strong><span>오늘 · 76점 · 42분</span></span><span class="chevron">›</span></button>
        <button class="list-item"><span class="list-icon">✎</span><span class="list-copy"><strong>실기 필답형 연습</strong><span>어제 · 12문제</span></span><span class="chevron">›</span></button>
        <button class="list-item"><span class="list-icon">↻</span><span class="list-copy"><strong>오답 집중 연습</strong><span>7월 20일 · 정답률 81%</span></span><span class="chevron">›</span></button>
      </div>
    </section>`;
}

function bookmarksTemplate() {
  return `
    <section class="page">
      <div class="hero"><p class="eyebrow">다시 볼 문제</p><h1>북마크와 오답</h1><p class="subcopy">헷갈렸던 문제를 내 것으로 만들어 보세요.</p></div>
      <div class="segment"><button class="is-active">오답 18</button><button>북마크 7</button></div>
      <div class="list">
        <button class="list-item" data-route="question"><span class="list-icon">1</span><span class="list-copy"><strong>소프트웨어 개발 생명주기</strong><span>필기 CBT · 소프트웨어 설계</span></span><span class="chevron">›</span></button>
        <button class="list-item" data-route="practical"><span class="list-icon">2</span><span class="list-copy"><strong>트랜잭션의 ACID 특성</strong><span>실기 필답형 · 데이터베이스</span></span><span class="chevron">›</span></button>
      </div>
      <button class="primary-button wide" style="margin-top:16px" data-route="question">오답 연습 시작</button>
    </section>`;
}

function moreTemplate() {
  return `
    <section class="page">
      <div class="hero"><p class="eyebrow">설정</p><h1>더보기</h1></div>
      <div class="list">
        <button class="list-item"><span class="list-icon">◎</span><span class="list-copy"><strong>학습 데이터</strong><span>이 기기의 기록 관리 및 초기화</span></span><span class="chevron">›</span></button>
        <button class="list-item"><span class="list-icon">☼</span><span class="list-copy"><strong>화면 설정</strong><span>글자 크기 및 화면 모드</span></span><span class="chevron">›</span></button>
        <button class="list-item"><span class="list-icon">?</span><span class="list-copy"><strong>도움말 및 문의</strong><span>자주 묻는 질문과 문제 신고</span></span><span class="chevron">›</span></button>
      </div>
    </section>`;
}

const templates = {
  home: homeTemplate,
  practice: practiceTemplate,
  random: randomTemplate,
  question: questionTemplate,
  navigator: navigatorTemplate,
  practical: practicalTemplate,
  result: resultTemplate,
  history: historyTemplate,
  bookmarks: bookmarksTemplate,
  more: moreTemplate,
};

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remaining = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

function resetQuestionState() {
  state.selectedChoice = null;
  state.submitted = false;
  state.aiVisible = false;
  state.practicalAnswer = "";
}

function navigate(route) {
  if (!templates[route]) return;
  const fromRoute = state.route;
  state.previousRoute = state.route;
  state.route = route;
  if ((route === "question" || route === "practical") && fromRoute !== "navigator") resetQuestionState();
  render();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function render(animate = true) {
  app.innerHTML = templates[state.route]();
  if (!animate) app.querySelector(".page")?.classList.add("is-static");
  backButton.classList.toggle("is-hidden", !routesWithBack.has(state.route));
  document.querySelectorAll(".nav-item").forEach((item) => {
    const route = item.dataset.route;
    const activeRoute = ["question", "practical"].includes(state.route) ? "practice" : state.route;
    item.classList.toggle("is-active", route === activeRoute);
  });
  app.focus({ preventScroll: true });
}

document.addEventListener("click", (event) => {
  const routeTarget = event.target.closest("[data-route]");
  if (routeTarget) {
    event.preventDefault();
    navigate(routeTarget.dataset.route);
    return;
  }

  const examTarget = event.target.closest("[data-exam-type]");
  if (examTarget) {
    state.examType = examTarget.dataset.examType;
    render(false);
    return;
  }

  const choice = event.target.closest("[data-choice]");
  if (choice && !state.submitted) {
    state.selectedChoice = Number(choice.dataset.choice);
    document.querySelectorAll("[data-choice]").forEach((item) => {
      const selected = Number(item.dataset.choice) === state.selectedChoice;
      item.classList.toggle("is-selected", selected);
    });
    return;
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  if (action === "back") navigate(state.previousRoute === state.route ? "home" : state.previousRoute);
  if (action === "toggle-timer") {
    state.randomTimed = !state.randomTimed;
    render(false);
  }
  if (action === "start-random") navigate(state.examType === "written" ? "question" : "practical");
  if (action === "open-question") {
    const number = event.target.closest("[data-question-number]")?.dataset.questionNumber;
    navigate("question");
    showToast(`${number}번 문제로 이동했어요.`);
  }
  if (action === "bookmark") {
    state.bookmarked = !state.bookmarked;
    persistLocalState();
    const bookmarkButton = document.querySelector("[data-action='bookmark']");
    if (bookmarkButton) bookmarkButton.textContent = state.bookmarked ? "♥" : "♡";
    showToast(state.bookmarked ? "북마크에 저장했어요." : "북마크에서 삭제했어요.");
  }
  if (action === "submit-choice") {
    if (state.submitted) return navigate("result");
    if (state.selectedChoice === null) return showToast("답을 먼저 선택해 주세요.");
    state.submitted = true;
    render(false);
  }
  if (action === "submit-practical") {
    if (state.submitted) return navigate("result");
    const textarea = document.querySelector(".written-answer");
    state.practicalAnswer = textarea?.value.trim() || "";
    if (!state.practicalAnswer) return showToast("답안을 먼저 작성해 주세요.");
    state.submitted = true;
    render(false);
  }
  if (action === "ai-explain") {
    const wasVisible = state.aiVisible;
    if (!wasVisible) {
      const explanationType = state.route === "practical" ? "practical" : "written";
      event.target.textContent = "✦ 저장된 해설 불러오는 중…";
      event.target.disabled = true;
      window.setTimeout(() => {
        state.aiVisible = true;
        state.aiSaved[explanationType] = true;
        persistLocalState();
        render(false);
        showToast("저장된 AI 해설을 불러왔어요.");
      }, 650);
    } else {
      state.aiVisible = false;
      render(false);
    }
  }
});

document.addEventListener("click", (event) => {
  const countButton = event.target.closest("[data-random-count]");
  if (countButton) {
    state.randomCount = Number(countButton.dataset.randomCount);
    render(false);
    return;
  }

  const chip = event.target.closest(".chip");
  if (!chip) return;
  const group = chip.closest(".chip-list");
  if (!group) return;
  group.querySelectorAll(".chip").forEach((item) => item.classList.remove("is-active"));
  chip.classList.add("is-active");
});

document.addEventListener("input", (event) => {
  if (event.target.matches(".written-answer")) state.practicalAnswer = event.target.value;
});

window.setInterval(() => {
  if (state.route === "question" && state.timerSeconds > 0) {
    state.timerSeconds -= 1;
    const timer = document.querySelector(".timer");
    if (timer) timer.textContent = `◷ ${formatTime(state.timerSeconds)}`;
  }
}, 1000);

render();
