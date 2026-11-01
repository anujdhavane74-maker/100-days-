# Product specification

## Purpose
A personal 100-day challenge that makes daily action visible, encourages recovery after imperfect days, and connects habits, skills, tasks, and learning into one coherent progress system.

## Source workbook
The uploaded workbook has these sheets: Dashboard, Daily, Habits, Courses, Tasks, Roadmap, Timetable, Guide. Inspect all rows/columns and formulas before implementation. Preserve useful content, including the 100-day dates and current planning assumptions. Workbook preview indicates Day 1 is 02 Nov 2026 and Day 100 is 09 Feb 2027; verify exact date range against the file.

## Primary navigation
- Dashboard
- Daily Check-in
- All Days
- Skills & Tasks
- Habits
- Analytics
- Settings / Data

## Dashboard
Show: current challenge day/date, check-in status, current streak, longest streak, days completed out of 100, completion percentage, weekly consistency, skill hours, academic hours, tasks completed, and next planned focus. Add a clear “Start/Resume today’s check-in” action and a compact quote/mindset card.

## Daily check-in
A short, mobile-friendly flow:
1. Confirm day/date and choose day mode (Normal / Light / Recovery; editable).
2. Set or confirm main focus and one concrete output.
3. Mark each habit done/not done.
4. Log actual minutes for skills, academics, and other relevant work; prevent double counting.
5. Record one win, one obstacle, and one next step (optional).
6. Save/close day; allow edits with an audit timestamp.
A closed day remains closed but editable. Empty actual minutes count as zero. Check-in is independent of perfect habit completion.

## All Days
100-day timeline/calendar with status: not started, checked in, missed, future. Filter by week, status, and section. Open a day to review/edit its details. Clearly distinguish a missed day from a day with missed habits.

## Skills & Tasks
Organize by course/skill and task. Support planned vs actual minutes, course/module progress, task status, evidence link/file reference, due date, and review notes. Use the workbook's course/task names and preserve placeholders where the source itself has placeholders; do not invent course titles.

## Habits
Support the workbook's habit list and editable custom habits. Each habit has a daily completion value and optional note. Keep the distinction between a completed check-in and completed habits.

## Analytics
Provide a systematic analytics board with sections:
- Overview / All days
- Habits
- Skills & learning
- Tasks / projects
- Weekly reviews
Include trends and useful comparisons, not decorative charts without meaning. Definitions and edge cases are in `ANALYTICS_AND_STREAK_RULES.md`.

## Motivation
A Max Verstappen-inspired visual theme: motorsport precision, deep navy/black, racing red, clean white, restrained telemetry/track-line motifs. The app is personal and unofficial; do not use team/driver logos unless licensed. Display a daily motivation line, rotating by challenge day. Use verified short quotes only when source attribution is validated; otherwise use original “Racing mindset” copy, clearly not attributed to Max.

## Persistence and privacy
Local-first persistence with export/import. Do not require an account for the core experience. If cloud sync is added, make it opt-in, explain what is synced, and keep secrets server-side. Avoid collecting unnecessary personal data.

## Accessibility and responsive behavior
Keyboard accessible, visible focus, semantic controls, sufficient contrast, reduced-motion support, responsive from mobile to desktop, useful empty states, and no color-only status indicators.
