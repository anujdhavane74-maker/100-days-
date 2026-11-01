import { describe, it, expect } from 'vitest';
import {
  calculateOverviewMetrics,
  calculateHabitAnalytics,
  calculateSkillBreakdown,
  calculateWeeklyMetrics,
} from '../utils/analytics';
import { initialAppState } from '../data/seedData';
import { ChallengeDay, TaskItem } from '../types';

describe('Analytics Calculations and Precision', () => {
  it('excludes future dates from check-in rate denominator', () => {
    const days = JSON.parse(JSON.stringify(initialAppState.days)) as ChallengeDay[];
    const tasks = JSON.parse(JSON.stringify(initialAppState.tasks)) as TaskItem[];

    // Day 1 checked in, Day 2 checked in, Day 3 (today) checked in
    days[0].checkedIn = true;
    days[1].checkedIn = true;
    days[2].checkedIn = true;

    // As of Day 3 (2026-11-04), 3 elapsed days out of 100
    const metrics = calculateOverviewMetrics(days, tasks, '2026-11-04');

    expect(metrics.totalCheckedIn).toBe(3);
    expect(metrics.elapsedEligibleDays).toBe(3);
    expect(metrics.checkInRate).toBe(100); // 3 / 3 = 100%
  });

  it('correctly handles habit completion and excludes skipped habits from denominator', () => {
    const days = JSON.parse(JSON.stringify(initialAppState.days)) as ChallengeDay[];
    days[0].checkedIn = true;
    days[0].habits = {
      speaking: { status: 'done' },
      morning_vision: { status: 'done' },
      mindfulness: { status: 'not_done' },
      evening_vision: { status: 'skipped' }, // Skipped should NOT count in denominator
    };

    const habits = initialAppState.habits;
    const analytics = calculateHabitAnalytics(days, habits, '2026-11-02');

    const speaking = analytics.find((h) => h.habitId === 'speaking');
    expect(speaking?.doneCount).toBe(1);
    expect(speaking?.completionRate).toBe(100);

    const evening = analytics.find((h) => h.habitId === 'evening_vision');
    expect(evening?.skippedCount).toBe(1);
    expect(evening?.doneCount).toBe(0);
    // 0 / (0 + 0) = 0
    expect(evening?.completionRate).toBe(0);

    const mindfulness = analytics.find((h) => h.habitId === 'mindfulness');
    expect(mindfulness?.notDoneCount).toBe(1);
    expect(mindfulness?.completionRate).toBe(0);
  });

  it('accurately sums skill hours and academic hours without double counting', () => {
    const days = JSON.parse(JSON.stringify(initialAppState.days)) as ChallengeDay[];
    days[0].checkedIn = true;
    days[0].workLogs = {
      mernActual: 120,
      n8nActual: 60,
      genAiActual: 0,
      agentsActual: 0,
      davinciActual: 0,
      academicActual: 90,
      otherActual: 0,
    };

    const breakdown = calculateSkillBreakdown(days);

    expect(breakdown.mernMinutes).toBe(120);
    expect(breakdown.n8nMinutes).toBe(60);
    expect(breakdown.totalSkillMinutes).toBe(180);
    expect(breakdown.totalSkillHours).toBe(3.0); // 180 / 60
    expect(breakdown.academicMinutes).toBe(90);
    expect(breakdown.totalAcademicHours).toBe(1.5); // 90 / 60
  });

  it('weekly metrics only count elapsed days in that week', () => {
    const days = JSON.parse(JSON.stringify(initialAppState.days)) as ChallengeDay[];
    const roadmap = initialAppState.roadmap;

    // Week 1 has 7 days (2026-11-02 to 2026-11-08)
    // On Day 2 (2026-11-03), only 2 days have elapsed
    days[0].checkedIn = true;
    days[1].checkedIn = false;

    const weekly = calculateWeeklyMetrics(days, roadmap, '2026-11-03');
    const week1 = weekly.find((w) => w.weekNumber === 1);

    expect(week1?.totalDaysInWeek).toBe(7);
    expect(week1?.elapsedDaysInWeek).toBe(2);
    expect(week1?.checkedInDays).toBe(1);
    expect(week1?.consistencyRate).toBe(50); // 1 / 2 = 50%
  });
});
