import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  ArrowRight,
  Flame,
  Search,
  BookOpen,
} from 'lucide-react';
import { ChallengeDay, DayStatus } from '../types';

interface ChallengeBoardViewProps {
  currentDate: string;
  days: ChallengeDay[];
  onSelectDay: (dayNumber: number) => void;
}

export const ChallengeBoardView: React.FC<ChallengeBoardViewProps> = ({
  currentDate,
  days,
  onSelectDay,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter days
  const filteredDays = days.filter((d) => {
    // Week filter
    if (selectedWeek !== 'all' && d.weekNumber !== selectedWeek) {
      return false;
    }

    // Status filter
    if (selectedStatus === 'checked_in' && !d.checkedIn) return false;
    if (selectedStatus === 'missed' && (d.checkedIn || d.date >= currentDate)) return false;
    if (selectedStatus === 'open' && (d.checkedIn || d.date !== currentDate)) return false;
    if (selectedStatus === 'future' && d.date <= currentDate) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchFocus = d.mainFocus.toLowerCase().includes(q);
      const matchOutput = d.concreteOutput.toLowerCase().includes(q);
      const matchDate = d.date.includes(q);
      const matchDay = `day ${d.dayNumber}`.includes(q);
      if (!matchFocus && !matchOutput && !matchDate && !matchDay) return false;
    }

    return true;
  });

  const totalCheckedIn = days.filter((d) => d.checkedIn).length;
  const elapsedDays = days.filter((d) => d.date <= currentDate);
  const missedDays = elapsedDays.filter((d) => !d.checkedIn && d.date < currentDate).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header & Summary Stats */}
      <div className="racing-card p-6 bg-gradient-to-r from-racing-card via-racing-surface to-racing-darker border-l-4 border-l-racing-red">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="telemetry-tag bg-racing-red/20 text-racing-red border border-racing-red/40">
                100-LAP TELEMETRY MATRIX
              </span>
              <span className="text-xs font-mono text-racing-textSubtle">
                02 NOV 2026 – 09 FEB 2027
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">100-Day Challenge Board</h1>
            <p className="text-xs text-racing-textMuted max-w-xl mt-1">
              Click any lap card to inspect telemetry, review inputs, or update your daily check-in.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="bg-racing-darker px-3 py-2 rounded-lg border border-racing-border">
              <span className="text-racing-textSubtle block">CHECKED IN</span>
              <span className="text-emerald-400 font-bold text-sm">{totalCheckedIn} / 100</span>
            </div>
            <div className="bg-racing-darker px-3 py-2 rounded-lg border border-racing-border">
              <span className="text-racing-textSubtle block">MISSED LAPS</span>
              <span className="text-racing-red font-bold text-sm">{missedDays}</span>
            </div>
            <div className="bg-racing-darker px-3 py-2 rounded-lg border border-racing-border">
              <span className="text-racing-textSubtle block">REMAINING</span>
              <span className="text-racing-cyan font-bold text-sm">{100 - elapsedDays.length}</span>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="mt-6 pt-4 border-t border-racing-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Week Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedWeek('all')}
              className={`px-2.5 py-1.5 rounded font-mono font-semibold transition-all shrink-0 ${
                selectedWeek === 'all'
                  ? 'bg-racing-red text-white'
                  : 'bg-racing-darker text-slate-300 hover:text-white border border-racing-border'
              }`}
            >
              ALL WEEKS
            </button>
            {Array.from({ length: 15 }, (_, i) => i + 1).map((w) => (
              <button
                key={w}
                onClick={() => setSelectedWeek(w)}
                className={`px-2 py-1.5 rounded font-mono text-[11px] transition-all shrink-0 ${
                  selectedWeek === w
                    ? 'bg-racing-red text-white font-bold'
                    : 'bg-racing-darker text-slate-400 hover:text-white border border-racing-border'
                }`}
              >
                W{w}
              </button>
            ))}
          </div>

          {/* Status & Search Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1 bg-racing-darker border border-racing-border rounded px-2 py-1">
              <Filter className="w-3.5 h-3.5 text-racing-textSubtle" />
              <select
                aria-label="Filter by Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-slate-200 font-mono text-xs focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-racing-card">All Statuses</option>
                <option value="checked_in" className="bg-racing-card">Checked In</option>
                <option value="open" className="bg-racing-card">Open Today</option>
                <option value="missed" className="bg-racing-card">Missed</option>
                <option value="future" className="bg-racing-card">Future</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-racing-textSubtle absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search focus or output..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-racing-darker border border-racing-border rounded pl-8 pr-3 py-1 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-racing-red text-xs w-44 sm:w-56"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredDays.map((d) => {
          const isToday = d.date === currentDate;
          const isFuture = d.date > currentDate;
          const isMissed = !d.checkedIn && d.date < currentDate;

          // Habit completion count
          let habitsDone = 0;
          let habitsTotal = 0;
          if (d.habits) {
            for (const h of Object.values(d.habits)) {
              if (h.status === 'done') habitsDone++;
              if (h.status === 'done' || h.status === 'not_done') habitsTotal++;
            }
          }

          // Skill minutes
          const skillMin = d.workLogs
            ? (d.workLogs.mernActual || 0) +
              (d.workLogs.n8nActual || 0) +
              (d.workLogs.genAiActual || 0) +
              (d.workLogs.agentsActual || 0) +
              (d.workLogs.davinciActual || 0) +
              (d.workLogs.otherActual || 0)
            : 0;

          let cardBorder = 'border-racing-border';
          let statusBadge = (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              FUTURE
            </span>
          );

          if (d.checkedIn) {
            cardBorder = 'border-emerald-500/40 bg-gradient-to-br from-racing-card to-emerald-950/20';
            statusBadge = (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>CHECKED IN</span>
              </span>
            );
          } else if (isToday) {
            cardBorder = 'border-racing-amber bg-gradient-to-br from-racing-card to-amber-950/20 ring-1 ring-racing-amber';
            statusBadge = (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-racing-amber/20 text-racing-amber border border-racing-amber/40 font-bold animate-pulse">
                TODAY'S LAP
              </span>
            );
          } else if (isMissed) {
            cardBorder = 'border-racing-red/30 bg-racing-card';
            statusBadge = (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-racing-red/10 text-racing-red border border-racing-red/30">
                UNLOGGED
              </span>
            );
          }

          return (
            <div
              key={d.dayNumber}
              onClick={() => onSelectDay(d.dayNumber)}
              className={`racing-card p-4 flex flex-col justify-between cursor-pointer hover:border-slate-400 hover:scale-[1.01] transition-all ${cardBorder}`}
            >
              <div>
                {/* Header: Lap # & Status */}
                <div className="flex items-center justify-between pb-2 border-b border-racing-border/60">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-xs font-black text-white">
                      LAP {d.dayNumber}
                    </span>
                    <span className="text-[10px] font-mono text-racing-textSubtle">
                      (W{d.weekNumber})
                    </span>
                  </div>
                  {statusBadge}
                </div>

                {/* Date & Mode */}
                <div className="flex items-center justify-between mt-2 text-xs font-mono">
                  <span className="text-racing-textSubtle">{d.date}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-racing-surface text-racing-cyan">
                    {d.dayMode}
                  </span>
                </div>

                {/* Main Focus */}
                <div className="mt-2.5">
                  <span className="text-[10px] font-mono uppercase text-racing-textSubtle block">
                    FOCUS: {d.mainFocus}
                  </span>
                  <p className="text-xs text-slate-200 line-clamp-2 mt-0.5 font-medium leading-relaxed">
                    {d.concreteOutput || 'General study and habit execution.'}
                  </p>
                </div>
              </div>

              {/* Footer Telemetry */}
              <div className="mt-4 pt-3 border-t border-racing-border/60 flex items-center justify-between text-[11px] font-mono">
                <div>
                  {d.checkedIn ? (
                    <span className="text-emerald-400">
                      {habitsDone} habits • {skillMin}m
                    </span>
                  ) : (
                    <span className="text-racing-textSubtle">
                      Plan: {d.skillPlanMinutes}m
                    </span>
                  )}
                </div>

                <span className="text-racing-red font-bold flex items-center space-x-1 text-[10px] hover:underline">
                  <span>EDIT</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDays.length === 0 && (
        <div className="p-8 text-center bg-racing-card rounded-xl border border-racing-border">
          <AlertCircle className="w-8 h-8 text-racing-textSubtle mx-auto mb-2" />
          <p className="text-sm text-slate-300">No challenge days match the selected filters.</p>
          <button
            onClick={() => {
              setSelectedWeek('all');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-mono text-racing-red hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
