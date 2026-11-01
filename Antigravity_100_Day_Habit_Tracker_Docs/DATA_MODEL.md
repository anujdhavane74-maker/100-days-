# Data model and integrity

Use a normalized model with stable IDs. Suggested entities:

## Challenge
- id, title, startDate, endDate, timezone, status, createdAt, updatedAt
- start/end dates are date-only values; avoid timezone drift.

## ChallengeDay
- id, challengeId, dayNumber (1–100), date, mode, mainFocus, concreteOutput
- status: `future | open | checked_in | missed`
- checkedInAt, lastEditedAt, win, obstacle, nextStep, notes

## Habit
- id, name, description, active, sortOrder, createdAt
- HabitCompletion: dayId, habitId, status (`done | not_done | skipped`), note
- Do not treat skipped as done. Allow habit list changes without rewriting historical records.

## WorkLog
- id, dayId, category (`skill | academic | project | other`), skillId optional, label, plannedMinutes, actualMinutes, note
- actualMinutes is a nonnegative integer. Count time once; do not add video minutes again if already included in skill practice.

## Skill / Course
- id, name, source, targetMinutes optional, order
- Module: id, skillId, title, targetMinutes, watchedMinutes, complete, applicationEvidence, sourceNote

## Task
- id, title, skillId optional, status (`not_started | in_progress | blocked | done`), dueDate, evidenceUrl, reviewNote, completedAt

## WeeklyReview
- weekNumber, wins, obstacles, lesson, nextWeekAdjustment, reviewedAt

## Quote / MotivationLine
- id, text, attributionType (`verified_quote | original_mindset`), attribution, sourceUrl optional, challengeDay optional
- Do not fabricate source URLs or verified attribution.

## Persistence
- Local database (IndexedDB or equivalent) with schema versioning.
- Atomic save of a check-in and its habit/work-log records.
- Export a complete JSON backup and import with validation/preview.
- Prevent duplicate day records and duplicate habit completion rows.
- Keep a change timestamp; never silently delete completed check-ins.
