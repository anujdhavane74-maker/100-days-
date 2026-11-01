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

  // Up to 5 upcoming tasks
  const pendingTasks = tasks.filter((t) => t.status !== 'done').slice(0, 3);

  // Quick 7-day strip centered around today
  const startIdx = Math.max(0, dayNumber - 4);
  const endIdx = Math.min(days.length, startIdx + 7);
  const stripDays = days.slice(startIdx, endIdx);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Welcome / Daily Telemetry Control Banner */}
      <div className="racing-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-racing-card via-racing-surface to-racing-darker border-l-4 border-l-racing-red">
        <div className="absolute top-0 right-0 w-80 h-full opacity-5 pointer-events-none bg-racing-stripes" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="telemetry-tag bg-racing-red/20 text-racing-red border border-racing-red/40">
                LAP {dayNumber} / 100
              </span>
              <span className="telemetry-tag bg-slate-800 text-slate-300 border border-slate-700">
                WEEK {currentDay.weekNumber}: {currentRoadmap?.technicalFocus || 'TECHNICAL FOUNDATION'}
              </span>
              <span className="telemetry-tag bg-racing-cyan/10 text-racing-cyan border border-racing-cyan/30">
                MODE: {currentDay.dayMode}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>{currentDate}</span>
              {currentDay.checkedIn ? (
                <span className="inline-flex items-center text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> LAP LOGGED
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-mono px-2.5 py-1 rounded-full bg-racing-amber/20 text-racing-amber border border-racing-amber/30 animate-pulse">
                  <Clock className="w-3.5 h-3.5 mr-1" /> CHECK-IN PENDING
                </span>
              )}
            </h1>

            <p className="text-sm text-racing-textMuted max-w-2xl">
              Target for today:{' '}
              <span className="text-slate-100 font-medium">
                {currentDay.concreteOutput || currentDay.mainFocus}
              </span>
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onNavigate('checkin', dayNumber)}
              className="px-6 py-3.5 rounded-xl font-bold text-white bg-racing-red hover:bg-racing-redHover shadow-red-glow flex items-center justify-center space-x-2 transition-all transform active:scale-98"
            >
              <span>{currentDay.checkedIn ? 'EDIT TODAY’S CHECK-IN' : 'START TODAY’S CHECK-IN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('board')}
              className="px-4 py-3.5 rounded-xl font-semibold text-slate-300 bg-racing-surface hover:bg-racing-cardHover border border-racing-border hover:text-white flex items-center justify-center space-x-2 transition-all"
            >
              <Calendar className="w-4 h-4 text-racing-cyan" />
              <span>100-DAY BOARD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recovery Mindset Alert if yesterday was missed */}
      {yesterdayWasMissed && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-racing-card to-racing-surface border border-racing-amber/40 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-racing-amber shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold text-racing-amber font-mono uppercase tracking-wide">
              PIT STOP & TELEMETRY RESET:
            </span>{' '}
            <span className="text-slate-200">
              Yesterday was unlogged, but in racing, a single missed stint does not define your championship.
              Box for fresh tires, clear your mental telemetry, and lock in on today's concrete output.
            </span>
          </div>
        </div>
      )}

      {/* Daily Motivation Card */}
      <MotivationCard
        currentDay={dayNumber}
        motivationLines={motivationLines}
        onSelectDay={(day) => onNavigate('checkin', day)}
      />

      {/* 8-Card Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Streak */}
        <div className="racing-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-racing-textSubtle mb-2">
            <span className="text-xs font-mono uppercase font-semibold">CURRENT STREAK</span>
            <Flame className="w-4 h-4 text-racing-red" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white flex items-baseline space-x-1">
              <span>{streakInfo.currentStreak}</span>
              <span className="text-xs font-normal text-racing-textSubtle">DAYS</span>
            </div>
            <div className="text-[11px] text-racing-textMuted mt-1">
              {streakInfo.streakThroughYesterday
                ? 'Streak through yesterday'
                : `Longest record: ${streakInfo.longestStreak} days`}
            </div>
          </div>
        </div>

        {/* Metric 2: Completed Days */}
        <div className="racing-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-racing-textSubtle mb-2">
            <span className="text-xs font-mono uppercase font-semibold">100-DAY PROGRESS</span>
            <Trophy className="w-4 h-4 text-racing-amber" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white flex items-baseline space-x-1">
              <span>{metrics.totalCheckedIn}</span>
              <span className="text-xs font-normal text-racing-textSubtle">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-racing-red h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, metrics.totalCheckedIn)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 3: Check-in Adherence */}
        <div className="racing-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-racing-textSubtle mb-2">
            <span className="text-xs font-mono uppercase font-semibold">ELAPSED ADHERENCE</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
              {metrics.checkInRate}%
            </div>
            <div className="text-[11px] text-racing-textMuted mt-1">
              {metrics.totalCheckedIn} of {metrics.elapsedEligibleDays} elapsed days
            </div>
          </div>
        </div>

        {/* Metric 4: Habit Completion */}
        <div className="racing-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-racing-textSubtle mb-2">
            <span className="text-xs font-mono uppercase font-semibold">HABIT COMPLETION</span>
            <Sparkles className="w-4 h-4 text-racing-cyan" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-racing-cyan">
              {metrics.overallHabitRate}%
            </div>
            <div className="text-[11px] text-racing-textMuted mt-1">
              {metrics.totalHabitsDone} actions ({metrics.totalHabitsSkipped} skipped)
            </div>
          </div>
        </div>

        {/* Metric 5: Technical Skill Hours */}
        <div className="racing-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-racing-textSubtle mb-2">
            <span className="text-xs font-mono uppercase font-semibold">SKILL HOURS</span>
            <Code className="w-4 h-4 text-racing-red" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white flex items-baseline space-x-1">
              <span>{metrics.totalSkillHours}</span>
              <span className="text-xs font-normal text-racing-textSubtle">HRS</span>
            </div>
            <div className="text-[11px] text-racing-textMuted mt-1">
              MERN, n8n, Gen AI, DaVinci
            </div>
          </div>
        </div>

        {/* Metric 6: Academic Hours */}
        <div className="racing-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-racing-textSubtle mb-2">
            <span className="text-xs font-mono uppercase font-semibold">ACADEMIC HOURS</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white flex items-baseline space-x-1">
              <span>{metrics.totalAcademicHours}</span>
              <span className="text-xs font-normal text-racing-textSubtle">HRS</span>
            </div>
            <div className="text-[11px] text-racing-textMuted mt-1">
              Zeal AI & DS maintenance
            </div>
          </div>
        </div>

        {/* Metric 7: Tasks Completed */}
        <div className="racing-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-racing-textSubtle mb-2">
            <span className="text-xs font-mono uppercase font-semibold">TASKS DONE</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white flex items-baseline space-x-1">
              <span>{metrics.totalTasksCompleted}</span>
              <span className="text-xs font-normal text-racing-textSubtle">/ {metrics.totalTasks}</span>
            </div>
            <div className="text-[11px] text-racing-textMuted mt-1">
              {metrics.taskCompletionRate}% of task register
            </div>
          </div>
        </div>

        {/* Metric 8: Speaking Practice */}
        <div className="racing-card p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-racing-textSubtle mb-2">
            <span className="text-xs font-mono uppercase font-semibold">SPEAKING TIME</span>
            <Compass className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white flex items-baseline space-x-1">
              <span>{metrics.totalSpeakingMinutes}</span>
              <span className="text-xs font-normal text-racing-textSubtle">MIN</span>
            </div>
            <div className="text-[11px] text-racing-textMuted mt-1">
              Record, listen, iterate
            </div>
          </div>
        </div>
      </div>

      {/* Today's Focus & Current Week Milestone Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Focus Detail */}
        <div className="lg:col-span-2 racing-card p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-racing-border">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-racing-red" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                TODAY'S MISSION & CONCRETE DELIVERABLE
              </h2>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-racing-surface text-slate-300 border border-racing-border">
              DAY {dayNumber}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs font-mono text-racing-textSubtle uppercase">PRIMARY FOCUS</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {currentDay.mainFocus}
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-racing-textSubtle uppercase">EXPECTED OUTPUT</div>
              <div className="text-sm text-slate-200 mt-0.5 bg-racing-surface p-3 rounded-lg border border-racing-border/80">
                {currentDay.concreteOutput || 'No concrete output prefilled.'}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
              <div className="bg-racing-darker p-2.5 rounded border border-racing-border">
                <span className="text-racing-textSubtle block">PLANNED SKILL</span>
                <span className="text-white font-bold text-sm">
                  {currentDay.skillPlanMinutes} min
                </span>
              </div>
              <div className="bg-racing-darker p-2.5 rounded border border-racing-border">
                <span className="text-racing-textSubtle block">PLANNED ACADEMIC</span>
                <span className="text-white font-bold text-sm">
                  {currentDay.academicPlanMinutes} min
                </span>
              </div>
              <div className="bg-racing-darker p-2.5 rounded border border-racing-border col-span-2 sm:col-span-1">
                <span className="text-racing-textSubtle block">STATUS</span>
                <span className={currentDay.checkedIn ? 'text-emerald-400 font-bold' : 'text-racing-amber font-bold'}>
                  {currentDay.checkedIn ? 'CHECKED IN' : 'OPEN / PENDING'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('checkin', dayNumber)}
              className="text-xs font-mono text-racing-red hover:text-white flex items-center space-x-1 uppercase font-semibold"
            >
              <span>Jump to check-in form for Day {dayNumber}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Week Milestone & Upcoming Tasks */}
        <div className="racing-card p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-racing-border">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-racing-cyan" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                WEEK {currentDay.weekNumber} MILESTONE
              </h2>
            </div>
            <span className="text-xs font-mono text-racing-textSubtle">
              {currentRoadmap.startDate} to {currentRoadmap.endDate}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-mono text-racing-textSubtle uppercase block">DEMONSTRATION GOAL</span>
              <p className="text-sm font-medium text-slate-100 mt-1">
                {currentRoadmap.demonstrationMilestone}
              </p>
            </div>

            <div>
              <span className="font-mono text-racing-textSubtle uppercase block">SPEAKING TARGET</span>
              <p className="text-slate-300 mt-1">
                {currentRoadmap.speakingProgression}
              </p>
            </div>

            <div className="pt-2 border-t border-racing-border">
              <span className="font-mono text-racing-textSubtle uppercase block mb-1">UPCOMING TASKS</span>
              {pendingTasks.length > 0 ? (
                <div className="space-y-1.5">
                  {pendingTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-2 rounded bg-racing-surface text-[11px]"
                    >
                      <span className="truncate max-w-[170px] text-slate-200">
                        <strong className="text-racing-cyan">{t.id}:</strong> {t.title}
                      </span>
                      <span className="font-mono text-racing-textSubtle shrink-0">
                        {t.targetDate}
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
            className="text-xs font-mono text-racing-cyan hover:text-white flex items-center space-x-1 uppercase font-semibold pt-1"
          >
            <span>View all courses and tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 7-Day Quick Telemetry Strip */}
      <div className="racing-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-racing-red" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              TELEMETRY STRIP (DAYS {startIdx + 1}–{endIdx})
            </h3>
          </div>
          <button
            onClick={() => onNavigate('board')}
            className="text-xs font-mono text-racing-red hover:underline"
          >
            Expand 100-Day Board →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {stripDays.map((d) => {
            const isToday = d.date === currentDate;
            let statusColor = 'border-slate-800 bg-racing-darker text-slate-500';
            let label = 'FUTURE';

            if (d.checkedIn) {
              statusColor = 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400';
              label = 'LOGGED';
            } else if (d.date < currentDate) {
              statusColor = 'border-racing-red/50 bg-racing-red/10 text-racing-red';
              label = 'MISSED';
            } else if (isToday) {
              statusColor = 'border-racing-amber bg-racing-amber/10 text-racing-amber';
              label = 'TODAY';
            }

            return (
              <button
                key={d.dayNumber}
                onClick={() => onNavigate('checkin', d.dayNumber)}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all hover:border-slate-400 ${statusColor} ${
                  isToday ? 'ring-2 ring-racing-amber ring-offset-2 ring-offset-racing-bg' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white">DAY {d.dayNumber}</span>
                  <span className="text-[10px] font-mono uppercase">{label}</span>
                </div>
                <div className="text-[11px] text-racing-textSubtle mt-1">{d.date.slice(5)}</div>
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
