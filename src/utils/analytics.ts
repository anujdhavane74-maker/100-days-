import { ChallengeDay, HabitItem, TaskItem, Course, RoadmapWeek } from '../types';

export interface OverviewMetrics {
  totalCheckedIn: number;
  totalDays: number;
  elapsedEligibleDays: number;
  checkInRate: number; // percentage 0-100 of elapsed days
  totalSkillHours: number;
  totalAcademicHours: number;
  totalTasksCompleted: number;
  totalTasks: number;
  taskCompletionRate: number;
  overallHabitRate: number;
  totalHabitsDone: number;
  totalHabitsNotDone: number;
  totalHabitsSkipped: number;
  totalSpeakingMinutes: number;
  averagePlanAchieved: number | null; // percentage of planned skill achieved on closed days
}

export interface HabitAnalytics {
  habitId: string;
  name: string;
  category: string;
  doneCount: number;
  notDoneCount: number;
  skippedCount: number;
  totalOpportunities: number;
  completionRate: number; // done / (done + notDone)
}

export interface SkillTimeBreakdown {
  mernMinutes: number;
  n8nMinutes: number;
  genAiMinutes: number;
  agentsMinutes: number;
  davinciMinutes: number;
  academicMinutes: number;
  otherMinutes: number;
  totalSkillMinutes: number;
  totalSkillHours: number;
  totalAcademicHours: number;
}

export interface WeeklyMetric {
  weekNumber: number;
  startDate: string;
  endDate: string;
  technicalFocus: string;
  demonstrationMilestone: string;
  totalDaysInWeek: number;
  elapsedDaysInWeek: number;
  checkedInDays: number;
  consistencyRate: number; // checkedIn / elapsed
  plannedSkillMinutes: number;
  actualSkillMinutes: number;
  plannedAcademicMinutes: number;
  actualAcademicMinutes: number;
  habitsDone: number;
  habitsTotal: number;
  habitRate: number;
  weeklyWin?: string;
  obstacleLesson?: string;
}

/**
 * Calculates high-level overview metrics
 */
export function calculateOverviewMetrics(
  days: ChallengeDay[],
  tasks: TaskItem[],
  currentDateStr: string
): OverviewMetrics {
  const totalDays = 100;
  const elapsedDays = days.filter((d) => d.date <= currentDateStr);
  const elapsedEligibleDays = elapsedDays.length;

  const checkedInDays = elapsedDays.filter((d) => d.checkedIn);
  const totalCheckedIn = checkedInDays.length;
  const checkInRate = elapsedEligibleDays > 0 ? Math.round((totalCheckedIn / elapsedEligibleDays) * 100) : 0;

  // Minutes & Hours across all checked-in or logged days
  let totalSkillMinutes = 0;
  let totalAcademicMinutes = 0;
  let totalSpeakingMinutes = 0;

  // Habit counts
  let totalHabitsDone = 0;
  let totalHabitsNotDone = 0;
  let totalHabitsSkipped = 0;

  // Plan achievement calculation: closed days with a positive skill plan
  let planAchievedSum = 0;
  let planAchievedCount = 0;

  for (const day of elapsedDays) {
    if (day.checkedIn) {
      const logs = day.workLogs || {
        mernActual: 0,
        n8nActual: 0,
        genAiActual: 0,
        agentsActual: 0,
        davinciActual: 0,
        academicActual: 0,
        otherActual: 0,
      };

      const daySkillMin =
        (logs.mernActual || 0) +
        (logs.n8nActual || 0) +
        (logs.genAiActual || 0) +
        (logs.agentsActual || 0) +
        (logs.davinciActual || 0) +
        (logs.otherActual || 0);

      totalSkillMinutes += daySkillMin;
      totalAcademicMinutes += logs.academicActual || 0;
      totalSpeakingMinutes += day.speakingMinutes || 0;

      if (day.skillPlanMinutes > 0) {
        const cappedRatio = Math.min(1.0, daySkillMin / day.skillPlanMinutes);
        planAchievedSum += cappedRatio;
        planAchievedCount++;
      }

      // Habits
      if (day.habits) {
        for (const entry of Object.values(day.habits)) {
          if (entry.status === 'done') totalHabitsDone++;
          else if (entry.status === 'not_done') totalHabitsNotDone++;
          else if (entry.status === 'skipped') totalHabitsSkipped++;
        }
      }
    }
  }

  const denominator = totalHabitsDone + totalHabitsNotDone;
  const overallHabitRate = denominator > 0 ? Math.round((totalHabitsDone / denominator) * 100) : 0;
  const averagePlanAchieved =
    planAchievedCount > 0 ? Math.round((planAchievedSum / planAchievedCount) * 100) : null;

  // Tasks
  const totalTasks = tasks.length;
  const totalTasksCompleted = tasks.filter((t) => t.status === 'done').length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((totalTasksCompleted / totalTasks) * 100) : 0;

  return {
    totalCheckedIn,
    totalDays,
    elapsedEligibleDays,
    checkInRate,
    totalSkillHours: Number((totalSkillMinutes / 60).toFixed(1)),
    totalAcademicHours: Number((totalAcademicMinutes / 60).toFixed(1)),
    totalTasksCompleted,
    totalTasks,
    taskCompletionRate,
    overallHabitRate,
    totalHabitsDone,
    totalHabitsNotDone,
    totalHabitsSkipped,
    totalSpeakingMinutes,
    averagePlanAchieved,
  };
}

/**
 * Calculates detailed statistics for each habit
 */
export function calculateHabitAnalytics(
  days: ChallengeDay[],
  habits: HabitItem[],
  currentDateStr: string
): HabitAnalytics[] {
  const elapsedDays = days.filter((d) => d.date <= currentDateStr && d.checkedIn);

  return habits.map((habit) => {
    let done = 0;
    let notDone = 0;
    let skipped = 0;

    for (const day of elapsedDays) {
      const entry = day.habits?.[habit.id];
      if (entry) {
        if (entry.status === 'done') done++;
        else if (entry.status === 'not_done') notDone++;
        else if (entry.status === 'skipped') skipped++;
      } else {
        // If checked in but no entry, default to not_done
        notDone++;
      }
    }

    const eligible = done + notDone;
    const rate = eligible > 0 ? Math.round((done / eligible) * 100) : 0;

    return {
      habitId: habit.id,
      name: habit.name,
      category: habit.category,
      doneCount: done,
      notDoneCount: notDone,
      skippedCount: skipped,
      totalOpportunities: eligible + skipped,
      completionRate: rate,
    };
  });
}

/**
 * Calculates breakdown of minutes by skill
 */
export function calculateSkillBreakdown(days: ChallengeDay[]): SkillTimeBreakdown {
  let mern = 0;
  let n8n = 0;
  let genAi = 0;
  let agents = 0;
  let davinci = 0;
  let academic = 0;
  let other = 0;

  for (const day of days) {
    if (day.checkedIn && day.workLogs) {
      mern += day.workLogs.mernActual || 0;
      n8n += day.workLogs.n8nActual || 0;
      genAi += day.workLogs.genAiActual || 0;
      agents += day.workLogs.agentsActual || 0;
      davinci += day.workLogs.davinciActual || 0;
      academic += day.workLogs.academicActual || 0;
      other += day.workLogs.otherActual || 0;
    }
  }

  const totalSkillMinutes = mern + n8n + genAi + agents + davinci + other;

  return {
    mernMinutes: mern,
    n8nMinutes: n8n,
    genAiMinutes: genAi,
    agentsMinutes: agents,
    davinciMinutes: davinci,
    academicMinutes: academic,
    otherMinutes: other,
    totalSkillMinutes,
    totalSkillHours: Number((totalSkillMinutes / 60).toFixed(1)),
    totalAcademicHours: Number((academic / 60).toFixed(1)),
  };
}

/**
 * Calculates weekly progression metrics
 */
export function calculateWeeklyMetrics(
  days: ChallengeDay[],
  roadmap: RoadmapWeek[],
  currentDateStr: string
): WeeklyMetric[] {
  return roadmap.map((week) => {
    const weekDays = days.filter((d) => d.weekNumber === week.weekNumber);
    const totalDaysInWeek = weekDays.length;

    const elapsedDays = weekDays.filter((d) => d.date <= currentDateStr);
    const elapsedDaysInWeek = elapsedDays.length;

    const checkedInDays = elapsedDays.filter((d) => d.checkedIn).length;
    const consistencyRate =
      elapsedDaysInWeek > 0 ? Math.round((checkedInDays / elapsedDaysInWeek) * 100) : 0;

    let plannedSkill = 0;
    let actualSkill = 0;
    let plannedAcad = 0;
    let actualAcad = 0;
    let habitsDone = 0;
    let habitsEligible = 0;

    for (const d of weekDays) {
      plannedSkill += d.skillPlanMinutes || 0;
      plannedAcad += d.academicPlanMinutes || 0;

      if (d.checkedIn) {
        const logs = d.workLogs || {
          mernActual: 0,
          n8nActual: 0,
          genAiActual: 0,
          agentsActual: 0,
          davinciActual: 0,
          academicActual: 0,
          otherActual: 0,
        };
        actualSkill +=
          (logs.mernActual || 0) +
          (logs.n8nActual || 0) +
          (logs.genAiActual || 0) +
          (logs.agentsActual || 0) +
          (logs.davinciActual || 0) +
          (logs.otherActual || 0);

        actualAcad += logs.academicActual || 0;

        if (d.habits) {
          for (const h of Object.values(d.habits)) {
            if (h.status === 'done') {
              habitsDone++;
              habitsEligible++;
            } else if (h.status === 'not_done') {
              habitsEligible++;
            }
          }
        }
      }
    }

    const habitRate = habitsEligible > 0 ? Math.round((habitsDone / habitsEligible) * 100) : 0;

    return {
      weekNumber: week.weekNumber,
      startDate: week.startDate,
      endDate: week.endDate,
      technicalFocus: week.technicalFocus,
      demonstrationMilestone: week.demonstrationMilestone,
      totalDaysInWeek,
      elapsedDaysInWeek,
      checkedInDays,
      consistencyRate,
      plannedSkillMinutes: plannedSkill,
      actualSkillMinutes: actualSkill,
      plannedAcademicMinutes: plannedAcad,
      actualAcademicMinutes: actualAcad,
      habitsDone,
      habitsTotal: habitsEligible,
      habitRate,
      weeklyWin: week.weeklyWin,
      obstacleLesson: week.obstacleLesson,
    };
  });
}

/**
 * Calculates course progress by target minutes and task counts
 */
export function calculateCourseProgress(courses: Course[], tasks: TaskItem[]) {
  return courses.map((course) => {
    let watchedMinutes = 0;
    let targetMinutes = course.videoTargetMinutes;
    let totalModules = course.modules.length;
    let completedModules = 0;

    for (const mod of course.modules) {
      watchedMinutes += mod.watchedMinutes || 0;
      if (mod.completed) completedModules++;
    }

    const courseTasks = tasks.filter((t) => t.course.toLowerCase() === course.name.toLowerCase());
    const tasksDone = courseTasks.filter((t) => t.status === 'done').length;
    const taskTarget = courseTasks.length;

    const videoCompletionRate =
      targetMinutes > 0 ? Math.min(100, Math.round((watchedMinutes / targetMinutes) * 100)) : 0;

    const taskCompletionRate =
      taskTarget > 0 ? Math.round((tasksDone / taskTarget) * 100) : 0;

    return {
      courseId: course.id,
      name: course.name,
      targetMinutes,
      watchedMinutes,
      videoCompletionRate,
      totalModules,
      completedModules,
      tasksDone,
      taskTarget,
      taskCompletionRate,
    };
  });
}

