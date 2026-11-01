import { describe, it, expect } from 'vitest';
import { calculateStreak, computeDayStatuses } from '../utils/streak';
import { initialAppState } from '../data/seedData';
import { ChallengeDay } from '../types';

describe('Streak and Day Status Calculation Rules', () => {
  it('initial state on Day 1 has 0 streak before check-in', () => {
    const days = JSON.parse(JSON.stringify(initialAppState.days)) as ChallengeDay[];
    const streak = calculateStreak(days, '2026-11-02');
    expect(streak.currentStreak).toBe(0);
    expect(streak.longestStreak).toBe(0);
    expect(streak.isTodayCheckedIn).toBe(false);
    expect(streak.streakThroughYesterday).toBe(false);
  });

  it('checking in Day 1 gives a current streak of 1', () => {
    const days = JSON.parse(JSON.stringify(initialAppState.days)) as ChallengeDay[];
    days[0].checkedIn = true;
    days[0].checkedInAt = '2026-11-02T10:00:00Z';

    const streak = calculateStreak(days, '2026-11-02');
    expect(streak.currentStreak).toBe(1);
    expect(streak.longestStreak).toBe(1);
    expect(streak.isTodayCheckedIn).toBe(true);
    expect(streak.streakThroughYesterday).toBe(false);
  });

  it('a day with zero minutes and incomplete habits still counts as checked in', () => {
    const days = JSON.parse(JSON.stringify(initialAppState.days)) as ChallengeDay[];
    days[0].checkedIn = true;
    days[0].workLogs = {
      mernActual: 0,
      n8nActual: 0,
      genAiActual: 0,
      agentsActual: 0,
      davinciActual: 0,
      academicActual: 0,
      otherActual: 0,
    };
    days[0].habits = {
      morning_vision: { status: 'not_done' },
      gratitude: { status: 'not_done' },
    };

    const streak = calculateStreak(days, '2026-11-02');
    expect(streak.currentStreak).toBe(1);
    expect(streak.isTodayCheckedIn).toBe(true);
  });

  it('shows streak through yesterday if yesterday checked in but today is not yet checked in', () => {
    const days = JSON.parse(JSON.stringify(initialAppState.days)) as ChallengeDay[];
    // Day 1 (2026-11-02) checked in
    days[0].checkedIn = true;
    // Day 2 (2026-11-03) checked in
    days[1].checkedIn = true;
    // Day 3 (2026-11-04) is today, not checked in yet
    days[2].checkedIn = false;

    const streak = calculateStreak(days, '2026-11-04');
    expect(streak.currentStreak).toBe(2);
    expect(streak.isTodayCheckedIn).toBe(false);
    expect(streak.streakThroughYesterday).toBe(true);
    expect(streak.longestStreak).toBe(2);
  });

  it('breaks streak when a previous day was missed', () => {
    const days = JSON.parse(JSON.stringify(initialAppState.days)) as ChallengeDay[];
    // Day 1 checked in
    days[0].checkedIn = true;
    // Day 2 missed (checkedIn = false)
    days[1].checkedIn = false;
    // Day 3 (2026-11-04) checked in
    days[2].checkedIn = true;

    // As of Day 3, current streak should be 1, longest streak should be 1
    const streak = calculateStreak(days, '2026-11-04');
    expect(streak.currentStreak).toBe(1);
    expect(streak.longestStreak).toBe(1);
  });

  it('preserves historical longest streak even after a broken streak', () => {
    const days = JSON.parse(JSON.stringify(initialAppState.days)) as ChallengeDay[];
    // Days 1-5 checked in (streak of 5)
    for (let i = 0; i < 5; i++) days[i].checkedIn = true;
    // Day 6 missed
    days[5].checkedIn = false;
    // Day 7 checked in
    days[6].checkedIn = true;

    const streak = calculateStreak(days, days[6].date);
    expect(streak.currentStreak).toBe(1);
    expect(streak.longestStreak).toBe(5);
  });

  it('preserves explicitly persisted longest streak across resets if passed', () => {
    const days = JSON.parse(JSON.stringify(initialAppState.days)) as ChallengeDay[];
    days[0].checkedIn = true;
    const streak = calculateStreak(days, '2026-11-02', 15);
    expect(streak.currentStreak).toBe(1);
    expect(streak.longestStreak).toBe(15);
  });

  it('future days are NEVER marked as missed', () => {
    const days = JSON.parse(JSON.stringify(initialAppState.days)) as ChallengeDay[];
    const todayStr = '2026-11-04'; // Day 3
    days[0].checkedIn = true; // Day 1 checked in
    days[1].checkedIn = false; // Day 2 missed
    days[2].checkedIn = false; // Day 3 open

    const statusDays = computeDayStatuses(days, todayStr);

    expect(statusDays[0].status).toBe('checked_in'); // Past checked in
    expect(statusDays[1].status).toBe('missed'); // Past missed
    expect(statusDays[2].status).toBe('open'); // Today open
    expect(statusDays[3].status).toBe('future'); // Day 4 future
    expect(statusDays[99].status).toBe('future'); // Day 100 future
  });

  it('handles a perfect 100-day streak fixture', () => {
    const days = JSON.parse(JSON.stringify(initialAppState.days)) as ChallengeDay[];
    for (let i = 0; i < 100; i++) {
      days[i].checkedIn = true;
    }
    const lastDate = days[99].date; // 2027-02-09
    const streak = calculateStreak(days, lastDate);

    expect(streak.currentStreak).toBe(100);
    expect(streak.longestStreak).toBe(100);
    expect(streak.totalCheckedIn).toBe(100);
    expect(streak.completionPercentage).toBe(100);
  });
});
