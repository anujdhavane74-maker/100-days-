# Analytics and streak definitions

Definitions must be visible in the UI or help text.

## Check-in streak
- A day counts when the user explicitly closes/checks in that challenge date.
- Habit completion is not required for a check-in to count.
- Current streak = consecutive checked-in dates ending today; if today is not checked in, show the consecutive run ending yesterday only if yesterday is the latest eligible day, and label it “streak through yesterday.” Do not count future dates.
- Longest streak = maximum consecutive checked-in dates in the challenge.
- Missed day breaks the consecutive run. Never erase previous longest streak.
- “100-day streak” means all 100 challenge dates checked in, not 100 perfect habit days.
- Show checked-in days / eligible elapsed days separately from completed habits.
- Handle timezone and date boundaries using the challenge timezone and date-only records.

## Dashboard metrics
- Check-ins: count of checked-in days / 100.
- Check-in rate: checked-in days / elapsed eligible days; exclude future dates.
- Habit completion: done / (done + not_done); report skipped separately and exclude skipped from denominator.
- Skill hours: sum actual minutes in skill category / 60.
- Academic hours: sum actual minutes in academic category / 60.
- Task completion: done tasks / tasks with status not `not_started`? Prefer show both “completed / total” and status breakdown; define total as all active tasks.
- Weekly consistency: checked-in days / eligible days in that week.
- Planned vs actual: compare only rows with a plan and an entered actual value; show difference, not a judgment score.

## Charts
- Daily check-in heatmap / 100-day strip.
- Weekly check-in rate.
- Habit completion by habit and over time.
- Skill/academic minutes by week.
- Task status and completion trend.
- Optional planned-vs-actual chart.
All charts need title, units, date range, accessible text summary, and empty state. Avoid implying causation.

## Edge cases
- A day with zero minutes can still be checked in.
- A closed day with no actual values has zero actual minutes.
- Future dates are not missed.
- A user may edit an earlier day; analytics recalculate from current saved values.
- A user may change timezone; existing challenge dates remain stable.
- Imported data must be validated for duplicate dates, invalid minutes, and out-of-range day numbers.
