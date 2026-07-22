import type { Question } from "./types";
import { generatedQuestions } from "./generatedQuestions";

const builtInQuestions: Question[] = [
  {
    id: "written-001",
    certificateId: "information-processing-engineer",
    category: "소프트웨어 설계",
    examType: "WRITTEN_CBT",
    prompt: "소프트웨어 개발 생명주기에서 시스템의 전체적인 구조를 결정하는 단계는?",
    choices: ["요구사항 분석", "아키텍처 설계", "인터페이스 설계", "프로그램 코딩"],
    correctChoiceIndex: 1,
    explanation: "아키텍처 설계는 시스템의 전체 구조와 구성 요소 간 관계를 정의하는 단계입니다.",
    difficulty: "medium",
    version: 1
  },
  {
    id: "written-002",
    certificateId: "information-processing-engineer",
    category: "데이터베이스",
    examType: "WRITTEN_CBT",
    prompt: "관계형 데이터베이스에서 튜플을 유일하게 식별할 수 있는 속성은?",
    choices: ["외래키", "기본키", "대체키", "복합키"],
    correctChoiceIndex: 1,
    explanation: "기본키는 테이블의 각 튜플을 유일하게 식별하며 NULL과 중복 값을 허용하지 않습니다.",
    difficulty: "easy",
    version: 1
  },
  {
    id: "practical-001",
    certificateId: "information-processing-engineer",
    category: "데이터베이스",
    examType: "PRACTICAL_WRITTEN_RESPONSE",
    prompt: "데이터베이스 트랜잭션의 ACID 특성 네 가지를 작성하시오.",
    modelAnswer: "원자성, 일관성, 격리성, 지속성",
    requiredKeyPoints: ["원자성", "일관성", "격리성", "지속성"],
    explanation: "ACID는 트랜잭션이 안전하게 처리되기 위한 네 가지 핵심 특성입니다.",
    difficulty: "medium",
    version: 1
  }
];

export const questions: Question[] = [...builtInQuestions, ...generatedQuestions];
