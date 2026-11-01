import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Clock,
  Layers,
  Code2,
  BookOpen,
  Compass,
  Sparkles,
  Info,
} from 'lucide-react';
import { ChallengeDay, HabitItem, TaskItem, Course, RoadmapWeek, StreakInfo } from '../types';
import {
  OverviewMetrics,
  calculateHabitAnalytics,
  calculateSkillBreakdown,
  calculateWeeklyMetrics,
  calculateCourseProgress,
} from '../utils/analytics';

interface AnalyticsViewProps {
  currentDate: string;
  days: ChallengeDay[];
  habits: HabitItem[];
  tasks: TaskItem[];
  courses: Course[];
  roadmap: RoadmapWeek[];
  streakInfo: StreakInfo;
  metrics: OverviewMetrics;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  currentDate,
  days,
  habits,
  tasks,
  courses,
  roadmap,
  streakInfo,
  metrics,
}) => {
  const [analyticsSubTab, setAnalyticsSubTab] = useState<
    'overview' | 'habits' | 'skills' | 'tasks' | 'weekly'
  >('overview');

  const habitStats = calculateHabitAnalytics(days, habits, currentDate);
  const skillBreakdown = calculateSkillBreakdown(days);
  const weeklyMetrics = calculateWeeklyMetrics(days, roadmap, currentDate);
  const courseProgressList = calculateCourseProgress(courses, tasks);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & Sub-Tab Switcher */}
      <div className="racing-card p-6 bg-gradient-to-r from-racing-card via-racing-surface to-racing-darker border-l-4 border-l-racing-red">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="telemetry-tag bg-racing-red/20 text-racing-red border border-racing-red/40">
                DATA TELEMETRY
              </span>
              <span className="text-xs font-mono text-racing-textSubtle">
                OBJECTIVE PERFORMANCE METRICS
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">Systematic Analytics Board</h1>
            <p className="text-xs text-racing-textMuted max-w-xl mt-1">
              Pure telemetry with exact formulas. Skipped habits are excluded from denominators; future dates are never counted as missed.
            </p>
          </div>

          {/* Sub-tab pills */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {[
              { id: 'overview', label: '1. Overview' },
              { id: 'habits', label: '2. Habits' },
              { id: 'skills', label: '3. Skills & Learning' },
              { id: 'tasks', label: '4. Tasks & Projects' },
              { id: 'weekly', label: '5. Weekly Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAnalyticsSubTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  analyticsSubTab === tab.id
                    ? 'bg-racing-red text-white shadow-red-glow font-bold'
                    : 'bg-racing-darker text-slate-400 hover:text-white border border-racing-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. OVERVIEW & 100-DAY HEATMAP */}
      {analyticsSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Key KPI Ratios */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="racing-card p-4">
              <span className="text-[10px] font-mono uppercase text-racing-textSubtle block">
                CHECK-IN COMPLETION
              </span>
              <div className="text-2xl font-mono font-black text-white mt-1">
                {metrics.totalCheckedIn} <span className="text-xs text-racing-textSubtle font-normal">/ 100</span>
              </div>
              <span className="text-[11px] text-racing-cyan font-mono block mt-1">
                {metrics.totalCheckedIn}% of whole challenge
              </span>
            </div>

            <div className="racing-card p-4">
              <span className="text-[10px] font-mono uppercase text-racing-textSubtle block">
                ELAPSED ADHERENCE
              </span>
              <div className="text-2xl font-mono font-black text-emerald-400 mt-1">
                {metrics.checkInRate}%
              </div>
              <span className="text-[11px] text-racing-textMuted font-mono block mt-1">
                {metrics.totalCheckedIn} of {metrics.elapsedEligibleDays} elapsed
              </span>
            </div>

            <div className="racing-card p-4">
              <span className="text-[10px] font-mono uppercase text-racing-textSubtle block">
                HABIT RATIO
              </span>
              <div className="text-2xl font-mono font-black text-racing-amber mt-1">
                {metrics.overallHabitRate}%
              </div>
              <span className="text-[11px] text-racing-textMuted font-mono block mt-1">
                {metrics.totalHabitsDone} done, {metrics.totalHabitsSkipped} skipped
              </span>
            </div>

            <div className="racing-card p-4">
              <span className="text-[10px] font-mono uppercase text-racing-textSubtle block">
                AVG PLAN ACHIEVED
              </span>
              <div className="text-2xl font-mono font-black text-purple-400 mt-1">
                {metrics.averagePlanAchieved !== null ? `${metrics.averagePlanAchieved}%` : 'N/A'}
              </div>
              <span className="text-[11px] text-racing-textMuted font-mono block mt-1">
                On logged days with target
              </span>
            </div>
          </div>

          {/* 100-Day Check-in Heatmap */}
          <div className="racing-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-racing-border gap-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-racing-red" />
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  100-DAY CHECK-IN TELEMETRY HEATMAP
                </h2>
              </div>
              <div className="flex items-center space-x-3 text-[11px] font-mono">
                <span className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                  <span className="text-slate-300">Checked In</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded bg-racing-amber inline-block" />
                  <span className="text-slate-300">Today</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded bg-racing-red/60 inline-block" />
                  <span className="text-slate-300">Missed</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded bg-racing-surface inline-block" />
                  <span className="text-slate-400">Future</span>
                </span>
              </div>
            </div>

            {/* Grid of 100 Days (10 rows x 10 cols) */}
            <div className="grid grid-cols-10 gap-1.5 sm:gap-2 pt-2">
              {days.map((d) => {
                const isToday = d.date === currentDate;
                const isFuture = d.date > currentDate;
                const isMissed = !d.checkedIn && d.date < currentDate;

                let cellClass = 'bg-racing-surface text-slate-500 border border-racing-border/40';
                if (d.checkedIn) {
                  cellClass = 'bg-emerald-500 text-white font-bold shadow-emerald-glow';
                } else if (isToday) {
                  cellClass = 'bg-racing-amber text-racing-darker font-black ring-2 ring-racing-amber';
                } else if (isMissed) {
                  cellClass = 'bg-racing-red/30 text-racing-red border border-racing-red/40';
                }

                return (
                  <div
                    key={d.dayNumber}
                    title={`Day ${d.dayNumber} (${d.date}): ${
                      d.checkedIn
                        ? 'Checked In'
                        : isToday
                        ? 'Today (Pending)'
                        : isMissed
                        ? 'Missed'
                        : 'Future'
                    }`}
                    className={`aspect-square rounded flex items-center justify-center text-[10px] sm:text-xs font-mono transition-all hover:scale-110 cursor-default ${cellClass}`}
                  >
                    {d.dayNumber}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-xs font-mono text-racing-textSubtle flex items-center space-x-2">
              <Info className="w-3.5 h-3.5 text-racing-cyan shrink-0" />
              <span>
                Streak represents consecutive daily check-ins. Completing 100% of habits is not required to count a day.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. HABITS ANALYTICS */}
      {analyticsSubTab === 'habits' && (
        <div className="space-y-6">
          <div className="racing-card p-6 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-racing-border">
              COMPLETION RATE BY INDIVIDUAL HABIT
            </h2>

            <div className="space-y-4">
              {habitStats.map((h) => (
                <div key={h.habitId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-slate-200">{h.name}</span>
                    <span className="text-racing-cyan font-bold">
                      {h.completionRate}% ({h.doneCount} done / {h.doneCount + h.notDoneCount} eligible)
                    </span>
                  </div>

                  <div className="w-full bg-racing-darker rounded-full h-3 overflow-hidden border border-racing-border flex">
                    <div
                      className="bg-emerald-500 h-full transition-all"
                      style={{ width: `${Math.min(100, h.completionRate)}%` }}
                      title={`${h.doneCount} completed`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-racing-textSubtle">
                    <span>Missed: {h.notDoneCount}</span>
                    <span>Skipped (excluded): {h.skippedCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SKILLS & LEARNING */}
      {analyticsSubTab === 'skills' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hours Breakdown by Skill */}
            <div className="racing-card p-6 space-y-4">
              <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-racing-border">
                HOURS BY TECHNICAL DOMAIN
              </h2>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { name: 'MERN Stack', min: skillBreakdown.mernMinutes, color: 'text-racing-red' },
                  { name: 'n8n Workflows', min: skillBreakdown.n8nMinutes, color: 'text-racing-amber' },
                  { name: 'Gen AI & Prompting', min: skillBreakdown.genAiMinutes, color: 'text-racing-cyan' },
                  { name: 'AI Autonomous Agents', min: skillBreakdown.agentsMinutes, color: 'text-purple-400' },
                  { name: 'DaVinci Video Editing', min: skillBreakdown.davinciMinutes, color: 'text-pink-400' },
                  { name: 'Other Technical', min: skillBreakdown.otherMinutes, color: 'text-slate-400' },
                  { name: 'College Academics', min: skillBreakdown.academicMinutes, color: 'text-blue-400' },
                ].map((item) => {
                  const hrs = (item.min / 60).toFixed(1);
                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-2.5 rounded bg-racing-surface border border-racing-border"
                    >
                      <span className="font-semibold text-slate-200">{item.name}</span>
                      <span className={`font-bold ${item.color}`}>
                        {hrs} hrs ({item.min} min)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Aggregate Card */}
            <div className="racing-card p-6 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-racing-border">
                  TOTAL LEARNING INVESTMENT
                </h2>

                <div className="grid grid-cols-2 gap-4 mt-4 font-mono">
                  <div className="bg-racing-surface p-4 rounded-xl border border-racing-border">
                    <span className="text-xs text-racing-textSubtle uppercase block">TOTAL SKILL HOURS</span>
                    <span className="text-3xl font-black text-racing-red mt-1 block">
                      {skillBreakdown.totalSkillHours}
                    </span>
                    <span className="text-[11px] text-racing-textMuted mt-1 block">
                      {skillBreakdown.totalSkillMinutes} minutes logged
                    </span>
                  </div>

                  <div className="bg-racing-surface p-4 rounded-xl border border-blue-900/60">
                    <span className="text-xs text-blue-400 uppercase block">ACADEMIC HOURS</span>
                    <span className="text-3xl font-black text-blue-400 mt-1 block">
                      {skillBreakdown.totalAcademicHours}
                    </span>
                    <span className="text-[11px] text-racing-textMuted mt-1 block">
                      Zeal AI & DS maintenance
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded bg-racing-darker border border-racing-border text-xs font-mono text-racing-textSubtle">
                <strong>Accounting Rule:</strong> Minutes include video watching, hands-on coding, and bug troubleshooting. No time is double counted.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TASKS & PROJECTS */}
      {analyticsSubTab === 'tasks' && (
        <div className="space-y-6">
          <div className="racing-card p-6 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-racing-border">
              TASK STATUS BREAKDOWN (ALL 94 WORKBOOK TASKS)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="bg-racing-surface p-4 rounded-xl border border-racing-border">
                <span className="text-xs text-racing-textSubtle uppercase block">NOT STARTED</span>
                <span className="text-2xl font-bold text-slate-300 mt-1 block">
                  {tasks.filter((t) => t.status === 'not_started').length}
                </span>
              </div>
              <div className="bg-racing-surface p-4 rounded-xl border border-racing-cyan/40">
                <span className="text-xs text-racing-cyan uppercase block">IN PROGRESS</span>
                <span className="text-2xl font-bold text-racing-cyan mt-1 block">
                  {tasks.filter((t) => t.status === 'in_progress').length}
                </span>
              </div>
              <div className="bg-racing-surface p-4 rounded-xl border border-racing-red/40">
                <span className="text-xs text-racing-red uppercase block">BLOCKED</span>
                <span className="text-2xl font-bold text-racing-red mt-1 block">
                  {tasks.filter((t) => t.status === 'blocked').length}
                </span>
              </div>
              <div className="bg-racing-surface p-4 rounded-xl border border-emerald-500/40">
                <span className="text-xs text-emerald-400 uppercase block">COMPLETED</span>
                <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                  {tasks.filter((t) => t.status === 'done').length}
                </span>
              </div>
            </div>

            {/* Course Task Progress */}
            <div className="pt-4 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase font-mono">COMPLETION BY COURSE</h3>
              {courseProgressList.map((cp) => (
                <div key={cp.courseId} className="space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200">{cp.name}</span>
                    <span className="text-racing-cyan font-bold">
                      {cp.tasksDone} / {cp.taskTarget} tasks ({cp.taskCompletionRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-racing-darker rounded-full h-2 overflow-hidden border border-racing-border">
                    <div
                      className="bg-emerald-500 h-full transition-all"
                      style={{ width: `${cp.taskCompletionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. WEEKLY REVIEWS */}
      {analyticsSubTab === 'weekly' && (
        <div className="space-y-4">
          <div className="racing-card p-6">
            <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-racing-border">
              15-WEEK ROADMAP TELEMETRY & REVIEWS
            </h2>

            <div className="space-y-4 mt-4">
              {weeklyMetrics.map((w) => (
                <div
                  key={w.weekNumber}
                  className="p-4 rounded-xl bg-racing-surface border border-racing-border space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-racing-border/60 gap-1 font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="telemetry-tag bg-racing-red/20 text-racing-red border border-racing-red/40 font-bold">
                        WEEK {w.weekNumber}
                      </span>
                      <span className="text-white font-bold">{w.technicalFocus}</span>
                    </div>
                    <span className="text-racing-textSubtle">
                      {w.startDate} to {w.endDate} ({w.totalDaysInWeek} days)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                    <div>
                      <span className="text-racing-textSubtle block uppercase text-[10px]">
                        CHECK-IN CONSISTENCY
                      </span>
                      <span className="text-sm font-bold text-emerald-400">
                        {w.checkedInDays} / {w.elapsedDaysInWeek} days ({w.consistencyRate}%)
                      </span>
                    </div>

                    <div>
                      <span className="text-racing-textSubtle block uppercase text-[10px]">
                        SKILL HOURS (ACTUAL / PLAN)
                      </span>
                      <span className="text-sm font-bold text-white">
                        {(w.actualSkillMinutes / 60).toFixed(1)}h / {(w.plannedSkillMinutes / 60).toFixed(1)}h
                      </span>
                    </div>

                    <div>
                      <span className="text-racing-textSubtle block uppercase text-[10px]">
                        HABIT ADHERENCE
                      </span>
                      <span className="text-sm font-bold text-racing-cyan">
                        {w.habitRate}% ({w.habitsDone} done)
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 text-slate-300">
                    <span className="font-mono text-racing-textSubtle uppercase text-[10px] block">
                      DEMONSTRATION MILESTONE
                    </span>
                    <p className="mt-0.5">{w.demonstrationMilestone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
