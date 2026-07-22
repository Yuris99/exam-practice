# Certificate Practice Site Plan

## 1. Product goal

Build a mobile-first website for studying certification questions. The site will support a large question bank and two primary learning experiences:

- **Practice mode:** Work through one question at a time and receive immediate feedback.
- **Test mode:** Complete either a predefined mock exam or a configurable random test, then review the result.

The first release should make answering questions fast and comfortable on a phone, while making it easy for an administrator to add and maintain many questions.

All learner-facing and administrator-facing product interfaces will use Korean. AI-generated explanations must also be written in Korean. Development work—including source code, identifiers, code comments, commits, and English documentation—will use English.

## 2. Product principles

- Design for mobile screens first.
- Use a single-page application flow. Normal navigation, answer selection, filtering, scoring, and review must not perform a browser page reload.
- Update the smallest affected interface region for frequent interactions such as selecting an answer.
- Keep each screen focused on one primary action.
- Never lose an active practice or test session when the page refreshes.
- Separate official question content from AI-generated assistance.
- Save historical question snapshots so later edits do not change old scores.
- Build bulk question management early.
- Start with a focused MVP and add advanced features after the core study loop is reliable.

## 3. User roles

### Learner

The site does not require a learner account. A learner can use it immediately and can:

- Practice questions.
- Take mock exams and random tests.
- Resume unfinished sessions.
- Review results and incorrect answers.
- View weekly activity, exam-type performance, and category accuracy statistics.
- Bookmark questions.
- Save private notes.
- Request and revisit short AI explanations.
- Report incorrect or unclear content.

### Administrator

An administrator can:

- Manage certificates and categories.
- Create, edit, duplicate, archive, and publish questions.
- Import questions in bulk.
- Configure mock-exam templates.
- Review question and AI-explanation reports.
- Monitor import errors and question quality.

## 4. Information architecture

### Learner navigation

Use a mobile bottom navigation bar:

- Home
- Practice
- Test
- History
- Bookmarks

### Home screen

The main actions should be immediately visible:

1. Start practice
2. Start mock exam
3. Create random test

The home screen should also show:

- Continue unfinished session
- Recent activity
- Overall and category accuracy
- Incorrect-question review shortcut
- Bookmarked-question shortcut

### Statistics

The learning-history screen should include:

- Questions completed by day for the current week
- Total questions, average accuracy, and consecutive study days
- Separate performance for written CBT and practical written-response questions
- Category accuracy for a recent period
- Recent practice and test sessions

Selecting an answer or changing a filter must update only the affected interface state. It must not reload the page or replay page-entry transitions.

The administration interface should be separate from the learner-facing navigation.

## 5. Practice mode

### Setup

The learner selects:

- Certificate
- Category or all categories
- Optional difficulty
- Optional question filter:
  - All questions
  - Unsolved questions
  - Previously incorrect questions
  - Bookmarked questions

### Question flow

1. Display one question. A written CBT question displays answer choices; a practical written-response question displays a text input.
2. The learner selects a choice, writes an answer, or chooses "I don't know."
3. The learner submits the answer.
4. Display:
   - Correct or incorrect result
   - Correct answer
   - Official explanation
   - AI Explain button
5. Allow the learner to continue to the next question.

### Controls

- Submit answer
- Previous and next question
- Bookmark
- Add a private note
- Report question
- Hide or show explanation

Swiping may be supported, but visible navigation buttons remain the reliable primary controls.

### Session behavior

- Save every answer immediately.
- Remember the current question.
- Restore the session after refresh on the same browser and device.
- Do not change the question order after the session begins.

## 6. Test mode

Correct answers and explanations must remain hidden until the test is submitted.

### Mock exam

A mock exam follows a predefined template containing:

- Certificate
- Number of questions
- Time limit
- Passing score
- Category distribution
- Question and choice shuffle rules
- Attempt rules, if needed

### Random test

The learner can configure:

- Certificate
- Categories
- Number of questions
- Optional time limit
- Difficulty
- Whether previously solved questions are included

The selected question IDs and their order must be saved when the test begins. Refreshing or resuming must not generate a different test.

The random-test setup is part of the same one-page flow and includes exam type, categories, question count, and optional time limit.

### During a test

- Display a persistent timer when a time limit exists.
- Save answers automatically.
- Allow questions to be flagged for review.
- Provide a question navigator showing:
  - Answered
  - Unanswered
  - Flagged
- Warn before submitting when questions remain unanswered.
- Automatically submit when time expires.
- Open the question navigator and move between questions without a page reload or loss of selected answers.

### Test result

After submission, show:

- Score
- Pass or fail
- Time used
- Correct, incorrect, and unanswered counts
- Accuracy by category
- Review of incorrect and flagged questions
- AI Explain button for reviewed questions
- Start-practice session using missed questions

## 7. Persistent AI explanations

### Availability

- In practice mode, show **AI Explain** only after the learner submits an answer.
- In test mode, show it only after the entire test is submitted.
- Clearly label AI content separately from the official explanation.

### Request flow

1. The learner taps **AI Explain**.
2. The server checks for a saved, current explanation.
3. If one exists, return it without making another API request.
4. Otherwise, the server sends a prompt to the AI API.
5. Validate and save the completed response.
6. Display it and reuse it on future visits.

While generating, display a loading state and prevent duplicate requests.

### Explanation format

Keep explanations concise, summarize only the essential points, and include:

1. For a written CBT question, why the correct choice is correct
2. For a written CBT question, why each remaining choice is incorrect
3. For a practical written-response question, the core of the model answer and what is missing from the learner's answer
4. One short memory tip

Do not include long introductions, unrelated background, or repeated question text.

### Prompt outline

```text
You explain Korean certification exam questions to learners.

Requirements:
- Write the entire response in natural Korean.
- Keep the explanation concise and summarize only the essential points.
- Use plain Korean that is easy for a learner to understand, while preserving official technical terms.
- Do not repeat the full question.
- If exam_type is WRITTEN_CBT, briefly explain why the correct choice is correct and why each remaining choice is incorrect.
- If exam_type is PRACTICAL_WRITTEN_RESPONSE, explain the core of the model answer and compare the learner's answer with the required key points. State what was correct and what was missing. Do not claim that wording must match exactly when the meaning is equivalent.
- End with one short line beginning with "암기 팁:".
- Do not add unrelated information.
- Do not invent regulations, figures, or facts that are not present in the supplied material.
- If the supplied answer appears questionable or the evidence is insufficient, say so clearly in Korean.

Exam type: WRITTEN_CBT | PRACTICAL_WRITTEN_RESPONSE
Question: ...
Choices (CBT only): ...
Correct choice or model answer: ...
Required key points (practical exam only): ...
Learner's answer: ...
Official explanation: ...
```

Use structured output, low verbosity, and a small output-token limit so responses remain consistent and concise.

### Persistence and invalidation

An explanation is linked to:

- Anonymous local installation ID
- Question
- Question version
- Selected answer snapshot
- Prompt version
- Model version

If the question, choices, or correct answer changes, mark the old explanation as outdated. Do not display it as current content.

The initial implementation saves explanations for the current anonymous local installation because they can discuss the learner's selected answer. No account is required. A future optimization can save one shared general explanation per question and generate a local answer-specific correction only when needed.

### Security, quality, and cost controls

- Call the AI API only from the server.
- Never expose the API key to the browser.
- Allow only one active generation per user and question.
- Add per-installation daily limits.
- Do not save partial or failed responses.
- Retry transient failures with a strict limit.
- Provide a **Report explanation** action.
- Allow administrators to hide a reported explanation.
- Do not allow unlimited regeneration in the initial release.
- Log model, prompt version, token usage, latency, and failure reason.

## 8. Question content model

The product has two primary exam and question types:

1. **Written exam (`WRITTEN_CBT`):** A CBT question-bank exam. Questions are objective single-choice questions, normally with four choices.
2. **Practical exam (`PRACTICAL_WRITTEN_RESPONSE`):** A written-response exam. Questions are primarily subjective and the learner types an answer.

These two types are foundational domain concepts and must not be collapsed into a generic question type. Both should be represented in the schema even if implementation is delivered in stages.

### Written CBT scoring

- The learner selects one choice.
- The system scores the answer automatically.
- Four choices are the default, not a hard database limit.
- Choices may be shuffled when the exam template permits it.

### Practical written-response scoring

- The learner types a free-form answer.
- Store a model answer and a list of required key points.
- Do not rely on exact string matching as the primary scoring method.
- In practice mode, reveal the model answer and let the learner mark the response as correct, partial, or incorrect.
- In test mode, keep the model answer hidden until submission, then support self-review. Automated or AI-assisted scoring can be added later and must be clearly identified as advisory.

Each question should contain:

- Certificate
- Category and optional subcategory
- Exam type (`WRITTEN_CBT` or `PRACTICAL_WRITTEN_RESPONSE`)
- Question text
- Choices and correct choice for written CBT questions
- Model answer and required key points for practical written-response questions
- Official explanation
- Difficulty
- Images or attachments
- Tags
- Source and source year
- Publication status
- Version number
- Created and updated timestamps

Question content supports multiline prompts and choices, a separate reference or “given” block, syntax-preserving code blocks, and up to six images. Tables, formulas, and richer formatted text remain future extensions.

## 9. Data model

### Core content

| Table | Purpose |
| --- | --- |
| `certificates` | Certificates or qualifications |
| `categories` | Subjects and nested topics |
| `questions` | Question content and metadata |
| `question_choices` | Answer choices and correctness |
| `question_versions` | Historical question snapshots |
| `exam_templates` | Mock-exam rules |
| `exam_template_sections` | Category distribution for templates |

### Learner activity

| Table | Purpose |
| --- | --- |
| `attempts` | Practice and test sessions |
| `attempt_questions` | Frozen question list, order, and snapshot |
| `user_answers` | Selected answers and correctness |
| `bookmarks` | Saved questions |
| `user_notes` | Private notes |
| `question_reports` | Learner reports about question content |

### AI explanations

| Field | Purpose |
| --- | --- |
| `id` | Explanation identifier |
| `installation_id` | Anonymous local installation identifier |
| `question_id` | Related question |
| `question_version` | Version used to generate the explanation |
| `selected_answer_snapshot` | Learner answer used in the prompt |
| `content` | Saved explanation |
| `model` | Model identifier |
| `prompt_version` | Prompt revision identifier |
| `status` | Pending, completed, failed, hidden, or outdated |
| `input_tokens` | Usage monitoring |
| `output_tokens` | Usage monitoring |
| `error_code` | Failure diagnostics |
| `created_at` | Creation time |
| `updated_at` | Last update time |

Add a uniqueness rule covering installation, question version, selected answer, and prompt version to prevent duplicate generations.

### Administration

| Table | Purpose |
| --- | --- |
| `import_jobs` | Bulk-import status and history |
| `import_job_errors` | Row-level validation failures |
| `ai_explanation_reports` | Reported AI responses |

## 10. Adding and maintaining many questions

The administration interface should support:

- Create and edit a single question
- Duplicate a question
- Draft, review, publish, and archive states
- Bulk category and tag changes
- CSV or spreadsheet import
- Image upload
- Preview before publication
- Validation before import
- Duplicate detection
- Import history and downloadable error report

Recommended import flow:

```text
Upload file -> Map columns -> Validate -> Preview errors
-> Import as drafts -> Review -> Publish
```

Begin with a strict CSV template. More complex document parsing can be added after the question structure is stable.

## 11. Mobile UX requirements

- Use touch targets of at least 44–48 pixels.
- Make the full answer row tappable.
- Use readable text size and line spacing.
- Avoid horizontal scrolling.
- Keep the primary submit or continue action near the bottom.
- Preserve selections when navigating.
- Keep question progress visible without taking excessive screen space.
- Make loading, saved, offline, and error states clear.
- Cache the active session locally as temporary protection against connection loss.
- Support installation as a Progressive Web App.
- Use a low-contrast, eye-comfortable dark theme by default.
- Fit both mobile and PC screens. Use bottom navigation on mobile and a persistent side navigation with wider content layouts on PC.

## 12. Suggested technical architecture

### Application

- Next.js with TypeScript
- A project-local responsive CSS design system with no required runtime UI library
- Progressive Web App manifest
- Korean user interface and Korean locale formatting

### Data and storage

- PostgreSQL
- Supabase for hosted PostgreSQL and file storage if a backend is needed
- Browser local storage or IndexedDB for attempts, answers, bookmarks, notes, and saved AI explanations
- No login, registration, profile, or account recovery flow

### AI integration

- OpenAI Responses API called from a server-side endpoint
- Structured response schema
- A cost-oriented text model selected after testing representative questions
- Server-enforced verbosity and output limits
- Server-enforced Korean responses

### Important boundaries

- Scoring happens on the server.
- Test-mode API responses must not expose correct answers before submission.
- API secrets remain server-side.
- Active attempts store frozen question and choice snapshots.
- AI generation is asynchronous from the user's perspective and does not block answering other questions.

## 13. MVP scope

### Include

- One certificate
- Categories
- Written CBT questions, normally with four choices
- Practical written-response questions with model answers and key points
- Mobile-first home screen
- Practice mode with immediate feedback
- One mock-exam template
- Configurable random tests
- Timer, auto-save, and resume
- Results and category statistics
- Incorrect-answer review
- Bookmarks
- Basic history
- Persistent AI explanations
- Question and AI-explanation reporting
- Administrator question editor
- CSV bulk import
- Progressive Web App installation

### Defer

- AI-assisted automatic scoring of practical written responses
- Payments
- Leaderboards
- Community comments
- Push notifications
- Native mobile applications
- AI-generated questions
- Unlimited AI explanation regeneration
- Advanced spaced-repetition scheduling

## 14. Delivery phases

### Phase 1: Foundation

- Confirm the first certificate and its exam rules.
- Define the question format and CSV template.
- Set up the application, content database, anonymous local storage, and server API boundaries.
- Create certificate, category, question, and question-choice management.

### Phase 2: Practice

- Build the mobile question interface.
- Implement practice sessions and immediate feedback.
- Add bookmarks, notes, question reports, and resume behavior.

### Phase 3: Tests

- Implement mock-exam templates.
- Implement random-test configuration.
- Add frozen question sets, timers, auto-save, flags, submission, and scoring.
- Build result and review screens.

### Phase 4: AI explanations

- Add the AI button, server endpoint boundary, short Korean prompt, local persistence, reuse, limits, and reporting.
- Keep live-provider activation, real-question quality evaluation, latency measurement, and cost validation outside the MVP.

### Phase 5: Content operations

- Build CSV import, validation, preview, and error reporting.
- Add bulk editing, draft review, publication, and archiving.

### Phase 6: Quality and launch

- Test on representative small-screen mobile devices.
- Test refresh, connection loss, timeout, and session recovery.
- Verify scoring and session recovery. Answer secrecy is not an MVP requirement because this is a self-study, browser-local product.
- Add accessibility checks, monitoring, backups, and rate limits.
- Deploy the MVP and collect learner feedback.

## 15. MVP success criteria

The MVP is ready when:

- A learner can comfortably complete practice and tests on a phone.
- Refreshing or temporarily losing connectivity does not destroy an attempt.
- A learner can understand and revisit every result.
- The AI explanation UI, server boundary, Korean prompt, local cache, and duplicate-call prevention are implemented. A live AI provider is optional after the MVP.
- Administrators can import and publish a large question set without editing the database directly.
- Historical scores remain stable after question edits.

## 16. Initial implementation decisions

- The first certificate is Information Processing Engineer. The current provisional mock-exam rules are 100 written questions or 20 practical questions, 150 minutes, and a passing score of 60.
- Learner-facing Korean uses concise, plain language while preserving official technical terms.
- AI explanations are answer-specific and saved for the anonymous local installation.
- The daily AI explanation allowance defaults to 20 and can be changed with `AI_DAILY_LIMIT`.
- The strict CSV template supports four CBT choices by default and includes difficulty, images, reference material, code, tags, source, and source year. Practice and random tests can filter by source year and tag. The single-question editor supports a variable number of choices with at least two, multiline prompts and choices, a separate reference box, syntax-preserving code, and up to six local or remote images with each upload limited to 1 MB. AI explanations receive the reference material, code, and supported images.
- Versioned local-data export/import, older-data migration, partial-corruption recovery, and local reset are included for device safety and migration. The initial implementation remains account-free and browser-local.

## 17. Documentation language convention

- Product UI, validation messages, notifications, administrator screens, and AI explanations use Korean.
- Source code, database identifiers, API fields, code comments, tests, commits, and development commands use English.
- Project Markdown documents are maintained as matching pairs.
- The English document uses the base name, such as `plan.md`.
- The Korean counterpart adds `.ko` before the extension, such as `plan.ko.md`.
- Both versions must have the same section structure and represent the same decisions.

## 18. MVP status

The self-study MVP was declared complete on July 22, 2026.

- Accounts and server-side answer secrecy are intentionally excluded.
- The AI experience is implemented as an optional integration shell; activating and evaluating a paid provider is post-MVP work.
- The current product baseline includes responsive practice and tests, local persistence and recovery, statistics, bookmarks, rich question content, CSV content operations, backups, PWA support, and automated regression tests.
- Follow-up priorities are maintained in `roadmap.md` and `roadmap.ko.md`.
