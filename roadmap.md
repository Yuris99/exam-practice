# Post-MVP Roadmap

## 1. Current baseline

The account-free, browser-local self-study MVP is complete. Answer secrecy is not required. The AI button, Korean prompt, API route, persistence, cache, and limits exist as an optional integration shell; a live paid provider is not required for the MVP.

## 2. Immediate next steps

1. Push the local `dev` branch and use it as the integration branch.
2. Create a preview deployment and verify PWA installation over HTTPS.
3. Import 50–100 representative written and practical questions, including code, reference blocks, multiline choices, and images.
4. Test the complete practice and test flow on at least one iPhone-sized device, one Android-sized device, and one desktop browser.
5. Fix only issues found during real content entry and real-device use before adding larger features.

## 3. Content quality

- Define a repeatable review checklist for prompt, choices, answer, explanation, source, year, images, code, and publication state.
- Validate duplicate detection and CSV error messages against real bulk files.
- Expand the built-in or imported Information Processing Engineer question set.
- Add tables, formulas, or richer content blocks only when real questions demonstrate the need.

## 4. Product quality

- Add browser-level tests for refresh recovery, timeout submission, offline reopening, backup restoration, and historical-result stability.
- Run automated accessibility checks and manual keyboard navigation tests.
- Verify mobile safe areas, virtual keyboards, long code, multiple images, and very long choices on real devices.
- Add CI checks for tests, TypeScript, and production builds.

## 5. Optional AI activation

- Connect a production API key only when AI explanations are wanted.
- Evaluate Korean explanation accuracy with a fixed real-question sample.
- Measure response time, failure rate, image-question quality, and per-explanation cost.
- Keep cached explanations visible when the provider is unavailable.
- AI-assisted practical scoring remains optional and advisory.

## 6. Deployment and operations

- Choose a hosting environment and configure server-only environment variables.
- Add lightweight error and API-usage monitoring without collecting learner identity.
- Document backup and restoration before changing storage schemas.
- Tag stable releases after validation on the `dev` branch.

## 7. Explicitly out of scope

- Accounts and login
- Server-side answer secrecy or anti-cheating
- Payments, rankings, comments, or social features
- Native mobile applications
- Mandatory live AI dependency
