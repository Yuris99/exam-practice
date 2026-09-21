const HANGUL_RUN = /[가-힣]{10,}/gu;
const SUSPICIOUS_SPLIT = /[가-힣]{2,}\s(?![수것등중후전간내외시때바점곳명개번회년월일](?=[\s,.!?)]|$))[가-힣](?=[\s,.!?)]|$)/gu;
const BROKEN_SYMBOL = /(?:\(©\)|TTLO|\bpen\)|인적션|버페|컴파일레|원도우|모둘|옮지|ㅎ\s*지)/giu;
const JOINED_PUNCTUATION = /[가-힣][,:][가-힣A-Za-z]/gu;
const TABLE_LABELS = /(?:최초 적합|최상 적합|최악 적합|SSTF|SCAN|C-SCAN|FCFS|CAP_[A-Z_]+|ACCESS_[A-Z_]+|LOADER_[A-Z_]+|SET_[A-Z_]+|CHANGE_[A-Z_]+)/gu;

export const SECURITY_TEXT_QUALITY_CODES = Object.freeze({
  HANGUL_SPACING_CANDIDATE: "hangul_spacing_candidate",
  LINE_BREAK_SPLIT_CANDIDATE: "line_break_split_candidate",
  BROKEN_GLYPH_CANDIDATE: "broken_glyph_candidate",
  JOINED_PUNCTUATION_CANDIDATE: "joined_punctuation_candidate",
  FLATTENED_TABLE_CANDIDATE: "flattened_table_candidate"
});

export function inspectSecurityQuestionText(row) {
  const fields = textFields(row);
  const findings = [];

  addFinding(findings, fields, SECURITY_TEXT_QUALITY_CODES.HANGUL_SPACING_CANDIDATE, HANGUL_RUN, "review", false,
    "긴 한글 무공백 문자열은 정상 전문용어도 포함하므로 원본 확인 후보로만 취급합니다.");
  addFinding(findings, fields, SECURITY_TEXT_QUALITY_CODES.LINE_BREAK_SPLIT_CANDIDATE, SUSPICIOUS_SPLIT, "review", false,
    "한 글자가 줄바꿈 뒤에 분리된 형태입니다. 조사·단위 표현은 오탐일 수 있습니다.");
  addFinding(findings, fields, SECURITY_TEXT_QUALITY_CODES.BROKEN_GLYPH_CANDIDATE, BROKEN_SYMBOL, "source_required", true,
    "알려진 OCR 글자·기호 오인식 패턴입니다. 원본 확인 전 자동 치환하지 않습니다.");
  addFinding(findings, fields, SECURITY_TEXT_QUALITY_CODES.JOINED_PUNCTUATION_CANDIDATE, JOINED_PUNCTUATION, "review", false,
    "문장부호 주변 공백 후보입니다. 코드·경로·수식은 자동 교정하지 않습니다.");

  const explanation = String(row.explanation ?? "");
  const labels = explanation.match(TABLE_LABELS) ?? [];
  if (labels.length >= 2 && !/[\n|]/u.test(explanation)) {
    findings.push({
      code: SECURITY_TEXT_QUALITY_CODES.FLATTENED_TABLE_CANDIDATE,
      fields: ["explanation"],
      samples: [...new Set(labels)].slice(0, 5),
      status: "source_required",
      blocksRegistration: true,
      note: "여러 표 항목이 단일 문자열에 평탄화된 후보입니다. 행 대응은 원본 표로 확인해야 합니다."
    });
  }

  return {
    status: findings.some((finding) => finding.blocksRegistration) ? "source_review_required"
      : findings.length ? "candidate_review" : "no_issue_detected",
    findings
  };
}

export function summarizeSecurityTextQuality(rows) {
  const byCode = {};
  let candidateRows = 0;
  let sourceReviewRequiredRows = 0;
  for (const row of rows) {
    const result = inspectSecurityQuestionText(row);
    if (result.findings.length) candidateRows += 1;
    if (result.status === "source_review_required") sourceReviewRequiredRows += 1;
    for (const finding of result.findings) byCode[finding.code] = (byCode[finding.code] ?? 0) + 1;
  }
  return { totalRows: rows.length, candidateRows, sourceReviewRequiredRows, byCode };
}

function textFields(row) {
  return Object.fromEntries([
    "prompt", "choice1", "choice2", "choice3", "choice4", "explanation", "reference_text", "code_snippet"
  ].map((field) => [field, String(row[field] ?? "")]));
}

function addFinding(findings, fields, code, pattern, status, blocksRegistration, note) {
  const matches = [];
  for (const [field, text] of Object.entries(fields)) {
    pattern.lastIndex = 0;
    const samples = [...text.matchAll(pattern)].map((match) => match[0]).slice(0, 3);
    if (samples.length) matches.push({ field, samples });
  }
  if (!matches.length) return;
  findings.push({
    code,
    fields: matches.map((match) => match.field),
    samples: [...new Set(matches.flatMap((match) => match.samples))].slice(0, 5),
    status,
    blocksRegistration,
    note
  });
}
