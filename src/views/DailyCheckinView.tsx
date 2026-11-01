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
  RotateCcw,
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

  // Sync state whenever activeDay changes
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

  const handleHabitNoteChange = (habitId: string, note: string) => {
    setHabitEntries((prev) => ({
      ...prev,
      [habitId]: {
        status: prev[habitId]?.status || 'not_done',
        note,
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
    setSavingStatus('Draft saved locally.');
    setTimeout(() => setSavingStatus(null), 2500);
  };

  const handleCompleteCheckin = async () => {
    setSavingStatus('Recording telemetry debrief...');
    const updated = buildUpdatedDay(true);
    await onSaveDay(updated, true);
    setSavingStatus('Telemetry closed! Check-in recorded.');
    
    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#EE2737', '#38BDF8', '#10B981', '#F59E0B'],
      });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }

    setTimeout(() => setSavingStatus(null), 3000);
  };

  const modes: { mode: DayMode; label: string; desc: string }[] = [
    { mode: 'Normal', label: 'Normal (Full Capacity)', desc: '180 min technical + routine' },
    { mode: 'Light', label: 'Light (Adjusted)', desc: '45–90 min technical' },
    { mode: 'Recovery', label: 'Recovery / Rest', desc: '0–30 min + mental recharge' },
    { mode: 'Exam flex', label: 'Exam Flex', desc: 'College academics priority' },
    { mode: 'Rest', label: 'Rest Day', desc: 'Mandatory maintenance' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fadeIn">
      {/* Top Navigation & Day Selector */}
      <div className="racing-card p-4 sm:p-6 bg-gradient-to-r from-racing-card via-racing-surface to-racing-darker">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onSelectDayNumber(Math.max(1, activeDay.dayNumber - 1))}
              disabled={activeDay.dayNumber <= 1}
              aria-label="Previous Day"
              className="p-2 rounded-lg bg-racing-surface border border-racing-border text-slate-300 hover:text-white hover:border-slate-500 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <span className="telemetry-tag bg-racing-red/20 text-racing-red border border-racing-red/40">
                  DAY {activeDay.dayNumber} OF 100
                </span>
                <span className="text-xs font-mono text-racing-textSubtle">
                  WEEK {activeDay.weekNumber}
                </span>
                {isToday && (
                  <span className="telemetry-tag bg-racing-amber/20 text-racing-amber border border-racing-amber/40">
                    TODAY
                  </span>
                )}
                {isFuture && (
                  <span className="telemetry-tag bg-slate-800 text-slate-400 border border-slate-700">
                    FUTURE DATE
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                {activeDay.date} Check-in Telemetry
              </h1>
            </div>

            <button
              onClick={() => onSelectDayNumber(Math.min(100, activeDay.dayNumber + 1))}
              disabled={activeDay.dayNumber >= 100}
              aria-label="Next Day"
              className="p-2 rounded-lg bg-racing-surface border border-racing-border text-slate-300 hover:text-white hover:border-slate-500 disabled:opacity-30 disabled:pointer-events-none"
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
                  <span>CHECK-IN COMPLETE</span>
                </div>
                {activeDay.checkedInAt && (
                  <div className="text-[10px] text-racing-textSubtle font-mono">
                    Logged: {new Date(activeDay.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-racing-amber font-mono text-xs font-bold uppercase bg-racing-amber/10 px-3 py-1.5 rounded-lg border border-racing-amber/30">
                <Clock className="w-4 h-4" />
                <span>UNLOGGED</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Day Picker Dropdown */}
        <div className="mt-4 pt-3 border-t border-racing-border/60 flex items-center justify-between text-xs font-mono">
          <span className="text-racing-textMuted">SWITCH TO ANY DAY:</span>
          <select
            aria-label="Switch Challenge Day"
            value={activeDay.dayNumber}
            onChange={(e) => onSelectDayNumber(Number(e.target.value))}
            className="bg-racing-darker border border-racing-border rounded px-3 py-1 text-slate-200 focus:outline-none focus:border-racing-red"
          >
            {days.map((d) => (
              <option key={d.dayNumber} value={d.dayNumber}>
                Day {d.dayNumber} ({d.date}) — {d.checkedIn ? '✓ Done' : d.date > currentDate ? 'Future' : 'Pending'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form Sections */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Step 1: Day Mode Selector */}
        <div className="racing-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-racing-red text-white flex items-center justify-center text-xs font-mono">
                1
              </span>
              <span>RACE STRATEGY & DAY MODE</span>
            </h2>
            <span className="text-xs font-mono text-racing-textSubtle">ADAPTABLE CADENCE</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
            {modes.map((m) => (
              <button
                key={m.mode}
                type="button"
                onClick={() => setDayMode(m.mode)}
                className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                  dayMode === m.mode
                    ? 'bg-racing-red/20 border-racing-red text-white shadow-red-glow font-bold'
                    : 'bg-racing-surface border-racing-border text-slate-300 hover:border-slate-500'
                }`}
              >
                <span className="text-xs font-mono uppercase">{m.mode}</span>
                <span className="text-[10px] text-racing-textSubtle mt-1">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Main Focus & Concrete Expected Output */}
        <div className="racing-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-racing-red text-white flex items-center justify-center text-xs font-mono">
                2
              </span>
              <span>PRIMARY MISSION & CONCRETE DELIVERABLE</span>
            </h2>
            <span className="text-xs font-mono text-racing-textSubtle">FROM 100-DAY PLAN</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-racing-textMuted mb-1">
                MAIN TECHNICAL FOCUS
              </label>
              <input
                type="text"
                value={mainFocus}
                onChange={(e) => setMainFocus(e.target.value)}
                placeholder="e.g. MERN, n8n, DaVinci, Gen AI..."
                className="w-full bg-racing-darker border border-racing-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-racing-red"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-racing-textMuted mb-1">
                ONE CONCRETE EXPECTED OUTPUT
              </label>
              <input
                type="text"
                value={concreteOutput}
                onChange={(e) => setConcreteOutput(e.target.value)}
                placeholder="e.g. Build personal introduction page..."
                className="w-full bg-racing-darker border border-racing-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-racing-red"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Habits Checklist */}
        <div className="racing-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-racing-red text-white flex items-center justify-center text-xs font-mono">
                3
              </span>
              <span>DAILY HABITS & PERSONAL ROUTINE</span>
            </h2>
            <span className="text-xs font-mono text-racing-textSubtle">CHECK-IN ≠ 100% HABITS</span>
          </div>

          <p className="text-xs text-racing-textMuted">
            Consistency is measured by checking in. Even if some habits were missed, document them honestly.
          </p>

          <div className="space-y-3">
            {habits.map((habit) => {
              const currentStatus = habitEntries[habit.id]?.status || 'not_done';
              const currentNote = habitEntries[habit.id]?.note || '';

              return (
                <div
                  key={habit.id}
                  className="p-3 rounded-lg bg-racing-surface border border-racing-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-white">{habit.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {habit.category}
                      </span>
                    </div>
                    <div className="text-xs text-racing-textSubtle">{habit.targetDescription}</div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleHabitToggle(habit.id, 'done')}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                        currentStatus === 'done'
                          ? 'bg-emerald-500 text-white shadow-emerald-glow'
                          : 'bg-racing-darker text-slate-400 border border-racing-border hover:border-emerald-500/50'
                      }`}
                    >
                      ✓ DONE
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHabitToggle(habit.id, 'not_done')}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                        currentStatus === 'not_done'
                          ? 'bg-racing-border text-slate-200'
                          : 'bg-racing-darker text-slate-400 border border-racing-border hover:border-slate-500'
                      }`}
                    >
                      ✕ MISSED
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHabitToggle(habit.id, 'skipped')}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                        currentStatus === 'skipped'
                          ? 'bg-amber-500 text-white shadow-amber-glow'
                          : 'bg-racing-darker text-slate-400 border border-racing-border hover:border-amber-500/50'
                      }`}
                      title="Skipped habits are excluded from the completion rate denominator"
                    >
                      SKIPPED
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Speaking, Sleep & Energy Telemetry inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-racing-border">
            <div>
              <label className="block text-xs font-mono uppercase text-racing-textMuted mb-1">
                SPEAKING PRACTICE (MIN)
              </label>
              <input
                type="number"
                min="0"
                value={speakingMinutes}
                onChange={(e) => setSpeakingMinutes(Math.max(0, Number(e.target.value)))}
                className="w-full bg-racing-darker border border-racing-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-racing-red"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-racing-textMuted mb-1">
                SLEEP (HOURS)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                placeholder="e.g. 7.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-racing-darker border border-racing-border rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-racing-red"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-racing-textMuted mb-1">
                ENERGY LEVEL (1–5)
              </label>
              <div className="flex items-center space-x-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnergy(energy === lvl ? '' : lvl)}
                    className={`flex-1 py-1.5 rounded text-xs font-mono font-bold border transition-all ${
                      energy === lvl
                        ? 'bg-racing-cyan text-racing-darker border-racing-cyan font-black'
                        : 'bg-racing-darker text-slate-400 border-racing-border hover:border-slate-500'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Work Logs & Time Accounting */}
        <div className="racing-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-racing-red text-white flex items-center justify-center text-xs font-mono">
                4
              </span>
              <span>WORK LOGS & TIME ACCOUNTING (MINUTES)</span>
            </h2>
            <div className="text-xs font-mono text-racing-cyan">
              LOGGED: {totalSkillMinutes} MIN ({Number((totalSkillMinutes / 60).toFixed(1))} HRS)
            </div>
          </div>

          <p className="text-xs text-racing-textMuted">
            Actual minutes include video and hands-on practice. Count each minute once; zero minutes is fully allowed.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-mono text-racing-textSubtle mb-1">MERN (MIN)</label>
              <input
                type="number"
                min="0"
                value={workLogs.mernActual || ''}
                placeholder="0"
                onChange={(e) =>
                  setWorkLogs({ ...workLogs, mernActual: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full bg-racing-darker border border-racing-border rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-racing-red"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-racing-textSubtle mb-1">N8N (MIN)</label>
              <input
                type="number"
                min="0"
                value={workLogs.n8nActual || ''}
                placeholder="0"
                onChange={(e) =>
                  setWorkLogs({ ...workLogs, n8nActual: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full bg-racing-darker border border-racing-border rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-racing-red"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-racing-textSubtle mb-1">GEN AI (MIN)</label>
              <input
                type="number"
                min="0"
                value={workLogs.genAiActual || ''}
                placeholder="0"
                onChange={(e) =>
                  setWorkLogs({ ...workLogs, genAiActual: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full bg-racing-darker border border-racing-border rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-racing-red"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-racing-textSubtle mb-1">AI AGENTS (MIN)</label>
              <input
                type="number"
                min="0"
                value={workLogs.agentsActual || ''}
                placeholder="0"
                onChange={(e) =>
                  setWorkLogs({ ...workLogs, agentsActual: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full bg-racing-darker border border-racing-border rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-racing-red"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-racing-textSubtle mb-1">DAVINCI (MIN)</label>
              <input
                type="number"
                min="0"
                value={workLogs.davinciActual || ''}
                placeholder="0"
                onChange={(e) =>
                  setWorkLogs({ ...workLogs, davinciActual: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full bg-racing-darker border border-racing-border rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-racing-red"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-blue-400 mb-1">ACADEMICS (MIN)</label>
              <input
                type="number"
                min="0"
                value={workLogs.academicActual || ''}
                placeholder="0"
                onChange={(e) =>
                  setWorkLogs({ ...workLogs, academicActual: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full bg-racing-darker border border-blue-900/60 rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-racing-textSubtle mb-1">OTHER (MIN)</label>
              <input
                type="number"
                min="0"
                value={workLogs.otherActual || ''}
                placeholder="0"
                onChange={(e) =>
                  setWorkLogs({ ...workLogs, otherActual: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full bg-racing-darker border border-racing-border rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-racing-red"
              />
            </div>
          </div>
        </div>

        {/* Step 5: Reflection & Debrief */}
        <div className="racing-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-racing-red text-white flex items-center justify-center text-xs font-mono">
                5
              </span>
              <span>POST-SESSION TELEMETRY DEBRIEF</span>
            </h2>
            <span className="text-xs font-mono text-racing-textSubtle">INSIGHTS & ADJUSTMENTS</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-emerald-400 mb-1">
                ONE PERSONAL WIN / BREAKTHROUGH
              </label>
              <input
                type="text"
                value={win}
                onChange={(e) => setWin(e.target.value)}
                placeholder="e.g. Mastered React state lifting, resolved API defect cleanly..."
                className="w-full bg-racing-darker border border-racing-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-racing-amber mb-1">
                ONE OBSTACLE OR LESSON LEARNED
              </label>
              <input
                type="text"
                value={obstacle}
                onChange={(e) => setObstacle(e.target.value)}
                placeholder="e.g. Lost 45 minutes to unfocused browsing; need strict timer..."
                className="w-full bg-racing-darker border border-racing-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-racing-amber"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-racing-cyan mb-1">
                ONE IMMEDIATE NEXT STEP
              </label>
              <input
                type="text"
                value={nextStep}
                onChange={(e) => setNextStep(e.target.value)}
                placeholder="e.g. Connect MongoDB schema on Day 51..."
                className="w-full bg-racing-darker border border-racing-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-racing-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-racing-textSubtle mb-1">
                ADDITIONAL NOTES / RESCHEDULE LOG
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special notes from the workbook or personal reflections..."
                className="w-full bg-racing-darker border border-racing-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-racing-red"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons & Feedback */}
        <div className="sticky bottom-14 md:bottom-4 z-30 p-4 bg-racing-darker/95 backdrop-blur-md rounded-xl border border-racing-border shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-racing-textMuted flex items-center space-x-2">
            {savingStatus ? (
              <span className="text-racing-cyan flex items-center space-x-1.5 font-bold">
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
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-mono text-xs font-bold uppercase bg-racing-surface border border-racing-border text-slate-300 hover:text-white hover:border-slate-500 transition-all"
            >
              <span className="flex items-center justify-center space-x-1.5">
                <Save className="w-3.5 h-3.5" />
                <span>SAVE DRAFT</span>
              </span>
            </button>

            <button
              type="button"
              onClick={handleCompleteCheckin}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-mono text-xs font-bold uppercase bg-racing-red hover:bg-racing-redHover text-white shadow-red-glow transition-all flex items-center justify-center space-x-1.5 active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{activeDay.checkedIn ? 'UPDATE CHECK-IN' : 'COMPLETE & CLOSE LAP'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
