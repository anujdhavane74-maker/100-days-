# QA and acceptance checklist

## Core
- [ ] Challenge has exactly 100 date-stable days, verified against workbook.
- [ ] Day 1, Day 100, and timezone boundaries are correct.
- [ ] Check-in can be saved with zero minutes and incomplete habits.
- [ ] Closing a day updates streak and check-in counts exactly once.
- [ ] Editing a past day does not duplicate records or change its date.
- [ ] Future days are never marked missed.
- [ ] Missed day breaks current streak but preserves longest streak.
- [ ] Reload/reopen preserves all entries.

## Analytics
- [ ] Hand-calculated fixture matches dashboard counts and rates.
- [ ] Habit denominator excludes skipped values and reports them separately.
- [ ] Skill and academic time are not double-counted.
- [ ] Weekly rates use only eligible dates.
- [ ] Empty states are understandable and do not show misleading zero trends.

## Data
- [ ] Import validates date range, duplicates, and invalid minute values.
- [ ] Export includes challenge setup, days, habits, work logs, skills, tasks, and reviews.
- [ ] Import preview appears before overwrite/merge.
- [ ] No destructive action happens without confirmation.

## UX
- [ ] Mobile layout works at 320px and desktop has no overflow.
- [ ] Keyboard navigation and visible focus work.
- [ ] Controls have labels; status is not color-only.
- [ ] Reduced-motion preference is respected.
- [ ] Saving, saved, and error states are visible.
- [ ] Original motivation lines are not attributed to Max Verstappen.
- [ ] Verified quote has source and attribution; otherwise it is excluded.
