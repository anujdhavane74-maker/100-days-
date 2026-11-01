# Implementation plan for Antigravity

## Mandatory preflight
1. Inspect repository structure, package scripts, framework, existing components, and data persistence.
2. Read the workbook's sheets, headers, formulas, and all relevant rows. Build a field map; do not assume preview snippets are complete.
3. Report current stack and propose the smallest compatible implementation path.
4. Create a clean git checkpoint/branch before modifying existing work.
5. Do not overwrite or delete existing user data.

## Phase 1 — Foundation
- Establish app shell, routing/navigation, theme tokens, responsive layout, and schema.
- Add local persistence and schema versioning.
- Verify app builds and reloads without data loss.

## Phase 2 — Workbook mapping
- Map workbook data into the app's challenge, day, habit, course, task, roadmap, timetable, and guide structures.
- Import only confirmed workbook data. Preserve placeholders and source notes as-is.
- Confirm dates, day count, sections, and formulas against the source workbook.

## Phase 3 — Daily workflow
- Implement daily check-in, habit completion, work logs, notes, save/edit, and status feedback.
- Add day calendar/list and historical edit flow.
- Test streak behavior before building analytics.

## Phase 4 — Dashboard and analytics
- Build overview metrics and sectioned analytics.
- Validate each metric against hand-calculated test fixtures.
- Include empty, partial, missed-day, and future-day states.

## Phase 5 — Motivation and polish
- Add daily motivation line rotation and quote-source/provenance safeguards.
- Apply racing-inspired theme, accessibility, responsive behavior, and motion preferences.
- Do not use unverified driver quotes or unlicensed logos.

## Phase 6 — QA and delivery
- Run type checks, lint, unit tests, production build, and manual responsive/accessibility checks.
- Verify export/import and reload persistence.
- Summarize changed files, completed features, tests, known gaps, and exact run command.

## Working protocol
Proceed autonomously through each phase when the repository supports it. If a blocker is real, ask one focused question. Do not spend time redesigning the whole product before the core check-in and data integrity work. Keep the app runnable after every phase.
