import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Calendar,
  Save,
  Clock,
  Sparkles,
  Flame,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Code2,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChallengeDay, HabitItem, DayMode, HabitStatus, WorkLogs } from '../types';

interface DailyCheckinViewProps {
  currentDate: string;
  selectedDayNumber: number;
  days: ChallengeDay[];
  habits: HabitItem[];
  onSaveDay: (updatedDay: ChallengeDay, shouldClose: boolean) => Promise<void>;
  onSelectDayNumber: (dayNum: number) => void;
}

export const DailyCheckinView: React.FC<DailyCheckinViewProps> = ({
  currentDate,
  selectedDayNumber,
  days,
  habits,
  onSaveDay,
  onSelectDayNumber,
}) => {
  const activeDay =
    days.find((d) => d.dayNumber === selectedDayNumber) ||
    days.find((d) => d.date === currentDate) ||
    days[0];

  // Local form state
  const [dayMode, setDayMode] = useState<DayMode>(activeDay.dayMode || 'Normal');
  const [mainFocus, setMainFocus] = useState<string>(activeDay.mainFocus || '');
  const [concreteOutput, setConcreteOutput] = useState<string>(activeDay.concreteOutput || '');
  const [skillPlan, setSkillPlan] = useState<number>(activeDay.skillPlanMinutes || 0);
  const [academicPlan, setAcademicPlan] = useState<number>(activeDay.academicPlanMinutes || 0);

  // Habits local state
  const [habitEntries, setHabitEntries] = useState<Record<string, { status: HabitStatus; note?: string }>>(
    activeDay.habits || {}
  );
  const [speakingMinutes, setSpeakingMinutes] = useState<number>(activeDay.speakingMinutes || 0);
  const [sleepHours, setSleepHours] = useState<number | ''>(
    activeDay.sleepHours !== null && activeDay.sleepHours !== undefined ? activeDay.sleepHours : ''
  );
  const [energy, setEnergy] = useState<number | ''>(
    activeDay.energy !== null && activeDay.energy !== undefined ? activeDay.energy : ''
  );

  // Work logs local state
  const [workLogs, setWorkLogs] = useState<WorkLogs>(
    activeDay.workLogs || {
      mernActual: 0,
      n8nActual: 0,
      genAiActual: 0,
      agentsActual: 0,
      davinciActual: 0,
      academicActual: 0,
      otherActual: 0,
    }
  );

  // Reflection
  const [win, setWin] = useState<string>(activeDay.win || '');
  const [obstacle, setObstacle] = useState<string>(activeDay.obstacle || '');
  const [nextStep, setNextStep] = useState<string>(activeDay.nextStep || '');
  const [notes, setNotes] = useState<string>(activeDay.notes || '');

  const [savingStatus, setSavingStatus] = useState<string | null>(null);

  useEffect(() => {
    setDayMode(activeDay.dayMode || 'Normal');
    setMainFocus(activeDay.mainFocus || '');
    setConcreteOutput(activeDay.concreteOutput || '');
    setSkillPlan(activeDay.skillPlanMinutes || 0);
    setAcademicPlan(activeDay.academicPlanMinutes || 0);
    setHabitEntries(activeDay.habits || {});
    setSpeakingMinutes(activeDay.speakingMinutes || 0);
    setSleepHours(activeDay.sleepHours !== null && activeDay.sleepHours !== undefined ? activeDay.sleepHours : '');
    setEnergy(activeDay.energy !== null && activeDay.energy !== undefined ? activeDay.energy : '');
    setWorkLogs(
      activeDay.workLogs || {
        mernActual: 0,
        n8nActual: 0,
        genAiActual: 0,
        agentsActual: 0,
        davinciActual: 0,
        academicActual: 0,
        otherActual: 0,
      }
    );
    setWin(activeDay.win || '');
    setObstacle(activeDay.obstacle || '');
    setNextStep(activeDay.nextStep || '');
    setNotes(activeDay.notes || '');
  }, [activeDay]);

  const totalSkillMinutes =
    (workLogs.mernActual || 0) +
    (workLogs.n8nActual || 0) +
    (workLogs.genAiActual || 0) +
    (workLogs.agentsActual || 0) +
    (workLogs.davinciActual || 0) +
    (workLogs.otherActual || 0);

  const isToday = activeDay.date === currentDate;
  const isFuture = activeDay.date > currentDate;

  const handleHabitToggle = (habitId: string, targetStatus: HabitStatus) => {
    setHabitEntries((prev) => ({
      ...prev,
      [habitId]: {
        status: prev[habitId]?.status === targetStatus ? 'not_done' : targetStatus,
        note: prev[habitId]?.note || '',
      },
    }));
  };

  const buildUpdatedDay = (shouldClose: boolean): ChallengeDay => {
    const nowIso = new Date().toISOString();
    return {
      ...activeDay,
      dayMode,
      mainFocus,
      concreteOutput,
      skillPlanMinutes: Number(skillPlan) || 0,
      academicPlanMinutes: Number(academicPlan) || 0,
      habits: habitEntries,
      speakingMinutes: Number(speakingMinutes) || 0,
      sleepHours: sleepHours === '' ? null : Number(sleepHours),
      energy: energy === '' ? null : Number(energy),
      workLogs,
      win,
      obstacle,
      nextStep,
      notes,
      checkedIn: shouldClose ? true : activeDay.checkedIn,
      checkedInAt: shouldClose ? (activeDay.checkedInAt || nowIso) : activeDay.checkedInAt,
      lastEditedAt: nowIso,
    };
  };

  const handleSaveDraft = async () => {
    setSavingStatus('Saving draft...');
    const updated = buildUpdatedDay(false);
    await onSaveDay(updated, false);
    setSavingStatus('Draft saved.');
    setTimeout(() => setSavingStatus(null), 2500);
  };

  const handleCompleteCheckin = async () => {
    setSavingStatus('Closing check-in...');
    const updated = buildUpdatedDay(true);
    await onSaveDay(updated, true);
    setSavingStatus('Check-in completed!');
    
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#EF4444', '#38BDF8', '#10B981', '#F59E0B'],
      });
    } catch {
      // Ignored if confetti unavailable
    }

    setTimeout(() => setSavingStatus(null), 3000);
  };

  const modes: { mode: DayMode; label: string; desc: string }[] = [
    { mode: 'Normal', label: 'Normal', desc: '180 min technical + habits' },
    { mode: 'Light', label: 'Light', desc: '45–90 min technical' },
    { mode: 'Recovery', label: 'Recovery', desc: 'Rest & mental reset' },
    { mode: 'Exam flex', label: 'Exam Flex', desc: 'Academics priority' },
    { mode: 'Rest', label: 'Rest Day', desc: 'Recharge & recovery' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-fadeIn">
      {/* Top Glass Card & Day Stepper */}
      <div className="glass-panel p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onSelectDayNumber(Math.max(1, activeDay.dayNumber - 1))}
              disabled={activeDay.dayNumber <= 1}
              aria-label="Previous Day"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/15">
                  Day {activeDay.dayNumber} of 100
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Week {activeDay.weekNumber}
                </span>
                {isToday && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Today
                  </span>
                )}
                {isFuture && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-white/5 text-slate-400 border border-white/10">
                    Future
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {activeDay.date} Daily Check-in
              </h1>
            </div>

            <button
              onClick={() => onSelectDayNumber(Math.min(100, activeDay.dayNumber + 1))}
              disabled={activeDay.dayNumber >= 100}
              aria-label="Next Day"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-3">
            {activeDay.checkedIn ? (
              <div className="text-right">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-mono text-xs font-bold uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Check-in Complete</span>
                </div>
                {activeDay.checkedInAt && (
                  <div className="text-[10px] text-slate-400 font-mono">
                    Logged: {new Date(activeDay.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-amber-300 font-mono text-xs font-bold uppercase bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                <Clock className="w-4 h-4" />
                <span>Pending</span>
              </div>
            )}
          </div>
        </div>

        {/* Day Jump Dropdown */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Switch to challenge day:</span>
          <select
            aria-label="Switch Challenge Day"
            value={activeDay.dayNumber}
            onChange={(e) => onSelectDayNumber(Number(e.target.value))}
            className="bg-slate-900/80 border border-white/10 rounded-lg px-3 py-1 text-slate-200 focus:outline-none focus:border-white/30"
          >
            {days.map((d) => (
              <option key={d.dayNumber} value={d.dayNumber} className="bg-slate-900 text-white">
                Day {d.dayNumber} ({d.date}) — {d.checkedIn ? '✓ Done' : d.date > currentDate ? 'Future' : 'Pending'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Step 1: Day Mode */}
        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-white/15 text-white flex items-center justify-center text-xs font-mono font-bold">
                1
              </span>
              <span>Day Mode & Strategy</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">Adaptable capacity</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
            {modes.map((m) => (
              <button
                key={m.mode}
                type="button"
                onClick={() => setDayMode(m.mode)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  dayMode === m.mode
                    ? 'bg-white/20 border-white/30 text-white shadow-lg font-bold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="text-xs font-mono uppercase">{m.mode}</span>
                <span className="text-[10px] text-slate-400 mt-1">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Main Focus & Concrete Deliverable */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-white/15 text-white flex items-center justify-center text-xs font-mono font-bold">
                2
              </span>
              <span>Primary Mission & Concrete Deliverable</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">100-Day schedule</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Main Focus
              </label>
              <input
                type="text"
                value={mainFocus}
                onChange={(e) => setMainFocus(e.target.value)}
                placeholder="e.g. MERN, n8n, DaVinci, Gen AI..."
                className="w-full glass-input px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                One Concrete Expected Output
              </label>
              <input
                type="text"
                value={concreteOutput}
                onChange={(e) => setConcreteOutput(e.target.value)}
                placeholder="e.g. Build personal introduction page..."
                className="w-full glass-input px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Habits Checklist */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-white/15 text-white flex items-center justify-center text-xs font-mono font-bold">
                3
              </span>
              <span>Daily Habits & Practices</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">Honest daily tracking</span>
          </div>

          <p className="text-xs text-slate-400">
            A check-in counts even if some habits were incomplete. Log what you did honestly.
          </p>

          <div className="space-y-2.5">
            {habits.map((habit) => {
              const currentStatus = habitEntries[habit.id]?.status || 'not_done';

              return (
                <div
                  key={habit.id}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-white">{habit.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {habit.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{habit.targetDescription}</div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleHabitToggle(habit.id, 'done')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        currentStatus === 'done'
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:border-emerald-500/40'
                      }`}
                    >
                      ✓ Done
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHabitToggle(habit.id, 'not_done')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        currentStatus === 'not_done'
                          ? 'bg-white/15 text-slate-200 border border-white/20'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                      }`}
                    >
                      ✕ Missed
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHabitToggle(habit.id, 'skipped')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        currentStatus === 'skipped'
                          ? 'bg-amber-500 text-white shadow-lg'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:border-amber-500/40'
                      }`}
                      title="Skipped habits are excluded from the completion denominator"
                    >
                      Skipped
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Speaking, Sleep & Energy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Speaking Practice (min)
              </label>
              <input
                type="number"
                min="0"
                value={speakingMinutes}
                onChange={(e) => setSpeakingMinutes(Math.max(0, Number(e.target.value)))}
                className="w-full glass-input px-3 py-2 text-sm text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Sleep (hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                placeholder="e.g. 7.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full glass-input px-3 py-2 text-sm text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Energy Level (1–5)
              </label>
              <div className="flex items-center space-x-1.5 pt-0.5">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnergy(energy === lvl ? '' : lvl)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                      energy === lvl
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Work Logs */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-white/15 text-white flex items-center justify-center text-xs font-mono font-bold">
                4
              </span>
              <span>Work Logs (Minutes)</span>
            </h2>
            <div className="text-xs font-mono text-cyan-400">
              Total Logged: {totalSkillMinutes}m ({(totalSkillMinutes / 60).toFixed(1)} hrs)
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">MERN (min)</label>
              <input
                type="number"
                min="0"
                value={workLogs.mernActual || ''}
                placeholder="0"
                onChange={(e) =>
                  setWorkLogs({ ...workLogs, mernActual: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full glass-input px-3 py-2 text-sm font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">n8n (min)</label>
              <input
                type="number"
                min="0"
                value={workLogs.n8nActual || ''}
                placeholder="0"
                onChange={(e) =>
                  setWorkLogs({ ...workLogs, n8nActual: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full glass-input px-3 py-2 text-sm font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Gen AI (min)</label>
              <input
                type="number"
                min="0"
                value={workLogs.genAiActual || ''}
                placeholder="0"
                onChange={(e) =>
                  setWorkLogs({ ...workLogs, genAiActual: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full glass-input px-3 py-2 text-sm font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">AI Agents (min)</label>
              <input
                type="number"
                min="0"
                value={workLogs.agentsActual || ''}
                placeholder="0"
                onChange={(e) =>
                  setWorkLogs({ ...workLogs, agentsActual: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full glass-input px-3 py-2 text-sm font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">DaVinci (min)</label>
              <input
                type="number"
                min="0"
                value={workLogs.davinciActual || ''}
                placeholder="0"
                onChange={(e) =>
                  setWorkLogs({ ...workLogs, davinciActual: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full glass-input px-3 py-2 text-sm font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-blue-400 mb-1">Academics (min)</label>
              <input
                type="number"
                min="0"
                value={workLogs.academicActual || ''}
                placeholder="0"
                onChange={(e) =>
                  setWorkLogs({ ...workLogs, academicActual: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full glass-input px-3 py-2 text-sm font-mono text-blue-200 border-blue-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Other (min)</label>
              <input
                type="number"
                min="0"
                value={workLogs.otherActual || ''}
                placeholder="0"
                onChange={(e) =>
                  setWorkLogs({ ...workLogs, otherActual: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full glass-input px-3 py-2 text-sm font-mono text-white"
              />
            </div>
          </div>
        </div>

        {/* Step 5: Reflection */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-white/15 text-white flex items-center justify-center text-xs font-mono font-bold">
                5
              </span>
              <span>Debrief & Reflection</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">Wins, lessons & adjustments</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-emerald-400 mb-1">
                One Personal Win / Breakthrough
              </label>
              <input
                type="text"
                value={win}
                onChange={(e) => setWin(e.target.value)}
                placeholder="What went well today?"
                className="w-full glass-input px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-amber-400 mb-1">
                One Obstacle or Lesson Learned
              </label>
              <input
                type="text"
                value={obstacle}
                onChange={(e) => setObstacle(e.target.value)}
                placeholder="What slowed you down and how will you adjust?"
                className="w-full glass-input px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-400 mb-1">
                One Immediate Next Step
              </label>
              <input
                type="text"
                value={nextStep}
                onChange={(e) => setNextStep(e.target.value)}
                placeholder="Top priority for tomorrow"
                className="w-full glass-input px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Additional Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special notes or rescheduled tasks..."
                className="w-full glass-input px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="sticky bottom-16 md:bottom-4 z-30 p-4 glass-panel bg-slate-950/80 backdrop-blur-2xl border-white/15 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-slate-400 flex items-center space-x-2">
            {savingStatus ? (
              <span className="text-cyan-400 flex items-center space-x-1.5 font-bold">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>{savingStatus}</span>
              </span>
            ) : (
              <span>Last edited: {activeDay.lastEditedAt ? new Date(activeDay.lastEditedAt).toLocaleTimeString() : 'Never'}</span>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 transition-all"
            >
              <span className="flex items-center justify-center space-x-1.5">
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </span>
            </button>

            <button
              type="button"
              onClick={handleCompleteCheckin}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase bg-red-600/90 hover:bg-red-500 text-white shadow-xl shadow-red-950/50 transition-all flex items-center justify-center space-x-1.5 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{activeDay.checkedIn ? 'Update Check-in' : 'Complete & Close Day'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
