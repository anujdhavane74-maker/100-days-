import React from 'react';
import {
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  Target,
  Trophy,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Sparkles,
  BookOpen,
  Code,
  Compass,
} from 'lucide-react';
import { ChallengeDay, HabitItem, TaskItem, StreakInfo, MotivationLine, RoadmapWeek } from '../types';
import { OverviewMetrics } from '../utils/analytics';
import { MotivationCard } from '../components/MotivationCard';
import { NavTabId } from '../components/Navigation';

interface DashboardViewProps {
  currentDate: string;
  days: ChallengeDay[];
  habits: HabitItem[];
  tasks: TaskItem[];
  roadmap: RoadmapWeek[];
  streakInfo: StreakInfo;
  metrics: OverviewMetrics;
  motivationLines: MotivationLine[];
  onNavigate: (tab: NavTabId, selectedDayNumber?: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentDate,
  days,
  tasks,
  roadmap,
  streakInfo,
  metrics,
  motivationLines,
  onNavigate,
}) => {
  const currentDay = days.find((d) => d.date === currentDate) || days[0];
  const dayNumber = currentDay.dayNumber;

  // Check if yesterday was missed to show recovery experience
  const yesterdayIndex = days.findIndex((d) => d.date === currentDate) - 1;
  const yesterdayWasMissed =
    yesterdayIndex >= 0 && !days[yesterdayIndex].checkedIn;

  // Current week's roadmap milestone
  const currentRoadmap =
    roadmap.find((r) => r.weekNumber === currentDay.weekNumber) || roadmap[0];

  // Up to 3 upcoming tasks
  const pendingTasks = tasks.filter((t) => t.status !== 'done').slice(0, 3);

  // Quick 7-day strip centered around today
  const startIdx = Math.max(0, dayNumber - 4);
  const endIdx = Math.min(days.length, startIdx + 7);
  const stripDays = days.slice(startIdx, endIdx);

  return (
    <div className="space-y-6 sm:space-y-7 animate-fadeIn">
      {/* Top Welcome Glass Card */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/15">
                Day {dayNumber} of 100
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-white/5 text-slate-300 border border-white/10">
                Week {currentDay.weekNumber}: {currentRoadmap?.technicalFocus || 'Technical Focus'}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Mode: {currentDay.dayMode}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>{currentDate}</span>
              {currentDay.checkedIn ? (
                <span className="inline-flex items-center text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Checked In
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-mono px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                  <Clock className="w-3.5 h-3.5 mr-1.5" /> Pending Check-in
                </span>
              )}
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Target for today:{' '}
              <span className="text-white font-medium">
                {currentDay.concreteOutput || currentDay.mainFocus}
              </span>
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onNavigate('checkin', dayNumber)}
              className="px-6 py-3.5 rounded-xl font-bold text-white bg-red-600/90 hover:bg-red-500 shadow-xl shadow-red-950/40 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
            >
              <span>{currentDay.checkedIn ? 'Edit Today’s Check-in' : 'Start Today’s Check-in'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('board')}
              className="px-4 py-3.5 rounded-xl font-medium text-slate-200 bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md flex items-center justify-center space-x-2 transition-all"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>100-Day Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recovery Notice if yesterday was missed */}
      {yesterdayWasMissed && (
        <div className="p-4 rounded-2xl glass-panel bg-amber-950/30 border-amber-500/30 flex items-start space-x-3.5">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold text-amber-300 font-mono tracking-wide">
              Reset & Refocus:
            </span>{' '}
            <span className="text-slate-200">
              Yesterday was unlogged, but in consistency tracking, an imperfect stint doesn't define the challenge.
              Reset your mindset, lock in on today's output, and keep your momentum moving forward.
            </span>
          </div>
        </div>
      )}

      {/* Dynamic Motivation Card */}
      <MotivationCard
        currentDay={dayNumber}
        motivationLines={motivationLines}
        onSelectDay={(day) => onNavigate('checkin', day)}
      />

      {/* 8 Glassmorphic Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Streak */}
        <div className="glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase font-semibold">Current Streak</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white flex items-baseline space-x-1">
              <span>{streakInfo.currentStreak}</span>
              <span className="text-xs font-normal text-slate-400">days</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {streakInfo.streakThroughYesterday
                ? 'Streak through yesterday'
                : `Longest streak: ${streakInfo.longestStreak} days`}
            </div>
          </div>
        </div>

        {/* Metric 2: Completed Days */}
        <div className="glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase font-semibold">100-Day Progress</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white flex items-baseline space-x-1">
              <span>{metrics.totalCheckedIn}</span>
              <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-red-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, metrics.totalCheckedIn)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 3: Check-in Adherence */}
        <div className="glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase font-semibold">Elapsed Adherence</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
              {metrics.checkInRate}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {metrics.totalCheckedIn} of {metrics.elapsedEligibleDays} elapsed days
            </div>
          </div>
        </div>

        {/* Metric 4: Habit Completion */}
        <div className="glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase font-semibold">Habit Completion</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-cyan-400">
              {metrics.overallHabitRate}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {metrics.totalHabitsDone} done ({metrics.totalHabitsSkipped} skipped)
            </div>
          </div>
        </div>

        {/* Metric 5: Technical Skill Hours */}
        <div className="glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase font-semibold">Skill Hours</span>
            <Code className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white flex items-baseline space-x-1">
              <span>{metrics.totalSkillHours}</span>
              <span className="text-xs font-normal text-slate-400">hrs</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              MERN, n8n, Gen AI, DaVinci
            </div>
          </div>
        </div>

        {/* Metric 6: Academic Hours */}
        <div className="glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase font-semibold">Academic Hours</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white flex items-baseline space-x-1">
              <span>{metrics.totalAcademicHours}</span>
              <span className="text-xs font-normal text-slate-400">hrs</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Zeal AI & DS maintenance
            </div>
          </div>
        </div>

        {/* Metric 7: Tasks Completed */}
        <div className="glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase font-semibold">Tasks Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white flex items-baseline space-x-1">
              <span>{metrics.totalTasksCompleted}</span>
              <span className="text-xs font-normal text-slate-400">/ {metrics.totalTasks}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {metrics.taskCompletionRate}% of task register
            </div>
          </div>
        </div>

        {/* Metric 8: Speaking Practice */}
        <div className="glass-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase font-semibold">Speaking Time</span>
            <Compass className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white flex items-baseline space-x-1">
              <span>{metrics.totalSpeakingMinutes}</span>
              <span className="text-xs font-normal text-slate-400">min</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Record, listen, iterate
            </div>
          </div>
        </div>
      </div>

      {/* Today's Focus & Current Week Milestone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Focus */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-red-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Today's Concrete Deliverable
              </h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
              Day {dayNumber}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase">Primary Focus</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {currentDay.mainFocus}
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-slate-400 uppercase">Expected Output</div>
              <div className="text-sm text-slate-200 mt-1 bg-white/5 p-3.5 rounded-xl border border-white/10 leading-relaxed">
                {currentDay.concreteOutput || 'No concrete output prefilled.'}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block">PLANNED SKILL</span>
                <span className="text-white font-bold text-sm">
                  {currentDay.skillPlanMinutes} min
                </span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block">PLANNED ACADEMIC</span>
                <span className="text-white font-bold text-sm">
                  {currentDay.academicPlanMinutes} min
                </span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block">STATUS</span>
                <span className={currentDay.checkedIn ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {currentDay.checkedIn ? 'Checked In' : 'Open / Pending'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('checkin', dayNumber)}
              className="text-xs font-mono text-red-400 hover:text-white flex items-center space-x-1.5 uppercase font-semibold transition-colors"
            >
              <span>Go to check-in form for Day {dayNumber}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Week Milestone & Upcoming Tasks */}
        <div className="glass-panel p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Week {currentDay.weekNumber} Milestone
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {currentRoadmap.startDate.slice(5)} to {currentRoadmap.endDate.slice(5)}
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="font-mono text-slate-400 uppercase block">Demonstration Goal</span>
              <p className="text-sm font-medium text-slate-100 mt-1 leading-relaxed">
                {currentRoadmap.demonstrationMilestone}
              </p>
            </div>

            <div>
              <span className="font-mono text-slate-400 uppercase block">Speaking Target</span>
              <p className="text-slate-300 mt-1">
                {currentRoadmap.speakingProgression}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10">
              <span className="font-mono text-slate-400 uppercase block mb-1.5">Upcoming Tasks</span>
              {pendingTasks.length > 0 ? (
                <div className="space-y-1.5">
                  {pendingTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-[11px] border border-white/5"
                    >
                      <span className="truncate max-w-[170px] text-slate-200">
                        <strong className="text-cyan-400 font-mono">{t.id}:</strong> {t.title}
                      </span>
                      <span className="font-mono text-slate-400 shrink-0">
                        {t.targetDate.slice(5)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">All planned tasks up to date.</p>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('skills-tasks')}
            className="text-xs font-mono text-cyan-400 hover:text-white flex items-center space-x-1 uppercase font-semibold pt-1 transition-colors"
          >
            <span>View all courses and tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 7-Day Quick Strip */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              7-Day Quick Strip (Days {startIdx + 1}–{endIdx})
            </h3>
          </div>
          <button
            onClick={() => onNavigate('board')}
            className="text-xs font-mono text-red-400 hover:underline"
          >
            Open 100-Day Board →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {stripDays.map((d) => {
            const isToday = d.date === currentDate;
            let statusColor = 'bg-white/5 border-white/10 text-slate-400';
            let label = 'FUTURE';

            if (d.checkedIn) {
              statusColor = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
              label = 'LOGGED';
            } else if (d.date < currentDate) {
              statusColor = 'bg-red-500/15 border-red-500/30 text-red-300';
              label = 'MISSED';
            } else if (isToday) {
              statusColor = 'bg-amber-500/15 border-amber-500/40 text-amber-300 ring-2 ring-amber-400/40';
              label = 'TODAY';
            }

            return (
              <button
                key={d.dayNumber}
                onClick={() => onNavigate('checkin', d.dayNumber)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all hover:bg-white/10 ${statusColor}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white">Day {d.dayNumber}</span>
                  <span className="text-[10px] font-mono">{label}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{d.date.slice(5)}</div>
                <div className="text-[10px] truncate text-slate-300 mt-2 font-mono">
                  {d.mainFocus || d.dayMode}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
