import { ChallengeDay, StreakInfo } from '../types';

/**
 * Normalizes a Date or date string to YYYY-MM-DD
 */
export function toDateString(d: Date | string = new Date()): string {
  if (typeof d === 'string') {
    // If it's already YYYY-MM-DD, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    return new Date(d).toISOString().split('T')[0];
  }
  return d.toISOString().split('T')[0];
}

/**
 * Returns the effective date for the challenge.
 * Default fallback is Day 1 date (2026-11-02) if system date is earlier than challenge start.
 */
export function getChallengeCurrentDate(days: ChallengeDay[], simulatedToday?: string): string {
  if (simulatedToday) return simulatedToday;
  
  // Use user's local date
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const localDateStr = `${year}-${month}-${day}`;

  const firstDay = days[0]?.date || '2026-11-02';
  const lastDay = days[days.length - 1]?.date || '2027-02-09';

  // If local date is within challenge or past end, use local date
  if (localDateStr >= firstDay) {
    return localDateStr <= lastDay ? localDateStr : lastDay;
  }
  // If local date is before Day 1, default to Day 1
  return firstDay;
}

/**
 * Calculates current streak and longest streak according to exact rules:
 * - A day counts when explicitly checked in (checkedIn === true).
 * - Habit completion is not required. Zero minutes still counts.
 * - Missing a check-in breaks the current streak.
 * - Future dates are never counted and never marked missed.
 * - Current streak:
 *     - If today is checked in, consecutive run ending today.
 *     - If today is not checked in, consecutive run ending yesterday (if yesterday is eligible),
 *       labeled "streak through yesterday".
 * - Longest streak is the maximum consecutive run in elapsed days.
 */
export function calculateStreak(
  days: ChallengeDay[],
  currentDateStr: string,
  persistedLongestStreak: number = 0
): StreakInfo {
  if (!days || days.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      streakThroughYesterday: false,
      isTodayCheckedIn: false,
      totalCheckedIn: 0,
      completionPercentage: 0,
    };
  }

  // Sort days chronologically
  const sortedDays = [...days].sort((a, b) => a.dayNumber - b.dayNumber);

  // Find index of today in challenge
  const todayIndex = sortedDays.findIndex((d) => d.date === currentDateStr);
  const totalCheckedIn = sortedDays.filter((d) => d.checkedIn).length;
  const completionPercentage = Math.round((totalCheckedIn / 100) * 100);

  if (todayIndex === -1) {
    // Current date is outside challenge range
    if (currentDateStr < sortedDays[0].date) {
      // Challenge hasn't started
      return {
        currentStreak: 0,
        longestStreak: persistedLongestStreak,
        streakThroughYesterday: false,
        isTodayCheckedIn: false,
        totalCheckedIn,
        completionPercentage,
      };
    }
    // Challenge already completed (date is after Day 100)
    let maxRun = 0;
    let currentRun = 0;
    for (const day of sortedDays) {
      if (day.checkedIn) {
        currentRun++;
        if (currentRun > maxRun) maxRun = currentRun;
      } else {
        currentRun = 0;
      }
    }
    return {
      currentStreak: currentRun,
      longestStreak: Math.max(persistedLongestStreak, maxRun),
      streakThroughYesterday: false,
      isTodayCheckedIn: false,
      totalCheckedIn,
      completionPercentage,
    };
  }

  const todayDay = sortedDays[todayIndex];
  const isTodayCheckedIn = todayDay.checkedIn;

  // Calculate current streak
  let currentStreak = 0;
  let streakThroughYesterday = false;

  if (isTodayCheckedIn) {
    // Walk backwards from today
    for (let i = todayIndex; i >= 0; i--) {
      if (sortedDays[i].checkedIn) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
    // Today is not checked in. Check streak through yesterday
    if (todayIndex > 0) {
      for (let i = todayIndex - 1; i >= 0; i--) {
        if (sortedDays[i].checkedIn) {
          currentStreak++;
        } else {
          break;
        }
      }
      if (currentStreak > 0) {
        streakThroughYesterday = true;
      }
    }
  }

  // Calculate longest streak across all elapsed days (up to todayIndex)
  let maxRun = 0;
  let run = 0;
  for (let i = 0; i <= todayIndex; i++) {
    if (sortedDays[i].checkedIn) {
      run++;
      if (run > maxRun) maxRun = run;
    } else {
      run = 0;
    }
  }

  const longestStreak = Math.max(persistedLongestStreak, maxRun, currentStreak);

  return {
    currentStreak,
    longestStreak,
    streakThroughYesterday,
    isTodayCheckedIn,
    totalCheckedIn,
    completionPercentage,
  };
}

/**
 * Returns updated days with computed status:
 * - date > today: 'future'
 * - date === today: checkedIn ? 'checked_in' : 'open'
 * - date < today: checkedIn ? 'checked_in' : 'missed'
 */
export function computeDayStatuses(days: ChallengeDay[], currentDateStr: string): ChallengeDay[] {
  return days.map((day) => {
    let status: ChallengeDay['status'];
    if (day.date > currentDateStr) {
      status = 'future';
    } else if (day.date === currentDateStr) {
      status = day.checkedIn ? 'checked_in' : 'open';
    } else {
      status = day.checkedIn ? 'checked_in' : 'missed';
    }
    return { ...day, status };
  });
}
