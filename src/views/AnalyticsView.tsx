import React, { useState } from 'react';
import {
  Calendar,
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
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header & Sub-Tab Switcher */}
      <div className="glass-panel p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/15">
                Data & Insights
              </span>
              <span className="text-xs font-mono text-slate-400">
                100-Day Performance Ratios
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Analytics Board</h1>
            <p className="text-xs text-slate-300 max-w-xl mt-1">
              Objective calculations. Skipped habits are excluded from denominators; future dates are never counted as missed.
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
                className={`px-3 py-1.5 rounded-xl transition-all font-semibold ${
                  analyticsSubTab === tab.id
                    ? 'bg-white/20 text-white border border-white/30 shadow-lg font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. OVERVIEW & HEATMAP */}
      {analyticsSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="glass-card p-4">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                CHECK-IN COMPLETION
              </span>
              <div className="text-2xl font-mono font-black text-white mt-1">
                {metrics.totalCheckedIn} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
              <span className="text-[11px] text-cyan-400 font-mono block mt-1">
                {metrics.totalCheckedIn}% of challenge
              </span>
            </div>

            <div className="glass-card p-4">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                ELAPSED ADHERENCE
              </span>
              <div className="text-2xl font-mono font-black text-emerald-400 mt-1">
                {metrics.checkInRate}%
              </div>
              <span className="text-[11px] text-slate-400 font-mono block mt-1">
                {metrics.totalCheckedIn} of {metrics.elapsedEligibleDays} elapsed
              </span>
            </div>

            <div className="glass-card p-4">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                HABIT RATIO
              </span>
              <div className="text-2xl font-mono font-black text-amber-300 mt-1">
                {metrics.overallHabitRate}%
              </div>
              <span className="text-[11px] text-slate-400 font-mono block mt-1">
                {metrics.totalHabitsDone} done, {metrics.totalHabitsSkipped} skipped
              </span>
            </div>

            <div className="glass-card p-4">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                AVG PLAN ACHIEVED
              </span>
              <div className="text-2xl font-mono font-black text-purple-300 mt-1">
                {metrics.averagePlanAchieved !== null ? `${metrics.averagePlanAchieved}%` : 'N/A'}
              </div>
              <span className="text-[11px] text-slate-400 font-mono block mt-1">
                On target days
              </span>
            </div>
          </div>

          {/* 100-Day Heatmap */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-red-400" />
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  100-Day Check-in Heatmap
                </h2>
              </div>
              <div className="flex items-center space-x-3 text-[11px] font-mono">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-slate-300">Checked In</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span className="text-slate-300">Today</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/50 inline-block" />
                  <span className="text-slate-300">Missed</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/15 inline-block" />
                  <span className="text-slate-400">Future</span>
                </span>
              </div>
            </div>

            {/* Grid of 100 Days */}
            <div className="grid grid-cols-10 gap-1.5 sm:gap-2 pt-2">
              {days.map((d) => {
                const isToday = d.date === currentDate;
                const isMissed = !d.checkedIn && d.date < currentDate;

                let cellClass = 'bg-white/5 text-slate-400 border border-white/10';
                if (d.checkedIn) {
                  cellClass = 'bg-emerald-500/80 text-white font-bold shadow-lg shadow-emerald-950/40 border border-emerald-400/50';
                } else if (isToday) {
                  cellClass = 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-400/50';
                } else if (isMissed) {
                  cellClass = 'bg-red-500/25 text-red-300 border border-red-500/30';
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
                    className={`aspect-square rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-mono transition-all hover:scale-110 cursor-default ${cellClass}`}
                  >
                    {d.dayNumber}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-xs font-mono text-slate-400 flex items-center space-x-2">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
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
          <div className="glass-panel p-6 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
              Completion Rate by Individual Habit
            </h2>

            <div className="space-y-4">
              {habitStats.map((h) => (
                <div key={h.habitId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-slate-200">{h.name}</span>
                    <span className="text-cyan-400 font-bold">
                      {h.completionRate}% ({h.doneCount} done / {h.doneCount + h.notDoneCount} eligible)
                    </span>
                  </div>

                  <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden border border-white/5 flex">
                    <div
                      className="bg-emerald-500 h-full transition-all"
                      style={{ width: `${Math.min(100, h.completionRate)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
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
            <div className="glass-panel p-6 space-y-4">
              <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
                Hours by Technical Domain
              </h2>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { name: 'MERN Stack', min: skillBreakdown.mernMinutes, color: 'text-red-400' },
                  { name: 'n8n Workflows', min: skillBreakdown.n8nMinutes, color: 'text-amber-400' },
                  { name: 'Gen AI & Prompting', min: skillBreakdown.genAiMinutes, color: 'text-cyan-400' },
                  { name: 'AI Autonomous Agents', min: skillBreakdown.agentsMinutes, color: 'text-purple-400' },
                  { name: 'DaVinci Video Editing', min: skillBreakdown.davinciMinutes, color: 'text-pink-400' },
                  { name: 'Other Technical', min: skillBreakdown.otherMinutes, color: 'text-slate-400' },
                  { name: 'College Academics', min: skillBreakdown.academicMinutes, color: 'text-blue-400' },
                ].map((item) => {
                  const hrs = (item.min / 60).toFixed(1);
                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10"
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

            <div className="glass-panel p-6 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
                  Total Learning Investment
                </h2>

                <div className="grid grid-cols-2 gap-4 mt-4 font-mono">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="text-xs text-slate-400 uppercase block">TOTAL SKILL HOURS</span>
                    <span className="text-3xl font-black text-red-400 mt-1 block">
                      {skillBreakdown.totalSkillHours}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {skillBreakdown.totalSkillMinutes} minutes logged
                    </span>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl border border-blue-500/20">
                    <span className="text-xs text-blue-400 uppercase block">ACADEMIC HOURS</span>
                    <span className="text-3xl font-black text-blue-400 mt-1 block">
                      {skillBreakdown.totalAcademicHours}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Zeal AI & DS maintenance
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                <strong>Accounting Rule:</strong> Minutes include video watching, hands-on coding, and bug troubleshooting. No time is double counted.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TASKS & PROJECTS */}
      {analyticsSubTab === 'tasks' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
              Task Status Breakdown (All 94 Tasks)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400 uppercase block">NOT STARTED</span>
                <span className="text-2xl font-bold text-slate-300 mt-1 block">
                  {tasks.filter((t) => t.status === 'not_started').length}
                </span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-cyan-500/20">
                <span className="text-xs text-cyan-400 uppercase block">IN PROGRESS</span>
                <span className="text-2xl font-bold text-cyan-400 mt-1 block">
                  {tasks.filter((t) => t.status === 'in_progress').length}
                </span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-red-500/20">
                <span className="text-xs text-red-400 uppercase block">BLOCKED</span>
                <span className="text-2xl font-bold text-red-400 mt-1 block">
                  {tasks.filter((t) => t.status === 'blocked').length}
                </span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-emerald-500/20">
                <span className="text-xs text-emerald-400 uppercase block">COMPLETED</span>
                <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                  {tasks.filter((t) => t.status === 'done').length}
                </span>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase font-mono">Completion by Course</h3>
              {courseProgressList.map((cp) => (
                <div key={cp.courseId} className="space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200">{cp.name}</span>
                    <span className="text-cyan-400 font-bold">
                      {cp.tasksDone} / {cp.taskTarget} tasks ({cp.taskCompletionRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/5">
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
          <div className="glass-panel p-6">
            <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
              15-Week Roadmap Progression & Reviews
            </h2>

            <div className="space-y-3.5 mt-4">
              {weeklyMetrics.map((w) => (
                <div
                  key={w.weekNumber}
                  className="p-4 rounded-2xl glass-card space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/10 gap-1 font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/15">
                        Week {w.weekNumber}
                      </span>
                      <span className="text-white font-bold">{w.technicalFocus}</span>
                    </div>
                    <span className="text-slate-400">
                      {w.startDate.slice(5)} to {w.endDate.slice(5)} ({w.totalDaysInWeek} days)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                    <div>
                      <span className="text-slate-400 block uppercase text-[10px]">
                        Check-in Consistency
                      </span>
                      <span className="text-sm font-bold text-emerald-400">
                        {w.checkedInDays} / {w.elapsedDaysInWeek} days ({w.consistencyRate}%)
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block uppercase text-[10px]">
                        Skill Hours (Actual / Plan)
                      </span>
                      <span className="text-sm font-bold text-white">
                        {(w.actualSkillMinutes / 60).toFixed(1)}h / {(w.plannedSkillMinutes / 60).toFixed(1)}h
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block uppercase text-[10px]">
                        Habit Adherence
                      </span>
                      <span className="text-sm font-bold text-cyan-400">
                        {w.habitRate}% ({w.habitsDone} done)
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 text-slate-300">
                    <span className="font-mono text-slate-400 uppercase text-[10px] block">
                      Demonstration Milestone
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
