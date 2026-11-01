import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  ArrowRight,
  Search,
} from 'lucide-react';
import { ChallengeDay } from '../types';

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

  const filteredDays = days.filter((d) => {
    if (selectedWeek !== 'all' && d.weekNumber !== selectedWeek) {
      return false;
    }
    if (selectedStatus === 'checked_in' && !d.checkedIn) return false;
    if (selectedStatus === 'missed' && (d.checkedIn || d.date >= currentDate)) return false;
    if (selectedStatus === 'open' && (d.checkedIn || d.date !== currentDate)) return false;
    if (selectedStatus === 'future' && d.date <= currentDate) return false;

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
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header & Stats Banner */}
      <div className="glass-panel p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/15">
                100-Day Timeline
              </span>
              <span className="text-xs font-mono text-slate-400">
                02 Nov 2026 – 09 Feb 2027
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Challenge Board</h1>
            <p className="text-xs text-slate-300 max-w-xl mt-1">
              Click any day card to view historical telemetry or update your check-in.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="bg-white/5 px-3 py-2 rounded-xl border border-white/10">
              <span className="text-slate-400 block text-[10px]">CHECKED IN</span>
              <span className="text-emerald-400 font-bold text-sm">{totalCheckedIn} / 100</span>
            </div>
            <div className="bg-white/5 px-3 py-2 rounded-xl border border-white/10">
              <span className="text-slate-400 block text-[10px]">MISSED DAYS</span>
              <span className="text-red-400 font-bold text-sm">{missedDays}</span>
            </div>
            <div className="bg-white/5 px-3 py-2 rounded-xl border border-white/10">
              <span className="text-slate-400 block text-[10px]">REMAINING</span>
              <span className="text-cyan-400 font-bold text-sm">{100 - elapsedDays.length}</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Week Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedWeek('all')}
              className={`px-3 py-1.5 rounded-lg font-mono font-semibold transition-all shrink-0 ${
                selectedWeek === 'all'
                  ? 'bg-white/20 text-white border border-white/30 font-bold'
                  : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              ALL
            </button>
            {Array.from({ length: 15 }, (_, i) => i + 1).map((w) => (
              <button
                key={w}
                onClick={() => setSelectedWeek(w)}
                className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] transition-all shrink-0 ${
                  selectedWeek === w
                    ? 'bg-white/20 text-white border border-white/30 font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                W{w}
              </button>
            ))}
          </div>

          {/* Status & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                aria-label="Filter by Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-slate-200 font-mono text-xs focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All Statuses</option>
                <option value="checked_in" className="bg-slate-900">Checked In</option>
                <option value="open" className="bg-slate-900">Open Today</option>
                <option value="missed" className="bg-slate-900">Missed</option>
                <option value="future" className="bg-slate-900">Future</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search focus or output..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-8 pr-3 py-1 text-slate-200 placeholder-slate-500 text-xs w-44 sm:w-56"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Days */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredDays.map((d) => {
          const isToday = d.date === currentDate;
          const isMissed = !d.checkedIn && d.date < currentDate;

          let habitsDone = 0;
          if (d.habits) {
            for (const h of Object.values(d.habits)) {
              if (h.status === 'done') habitsDone++;
            }
          }

          const skillMin = d.workLogs
            ? (d.workLogs.mernActual || 0) +
              (d.workLogs.n8nActual || 0) +
              (d.workLogs.genAiActual || 0) +
              (d.workLogs.agentsActual || 0) +
              (d.workLogs.davinciActual || 0) +
              (d.workLogs.otherActual || 0)
            : 0;

          let statusBadge = (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
              Future
            </span>
          );

          if (d.checkedIn) {
            statusBadge = (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Checked In</span>
              </span>
            );
          } else if (isToday) {
            statusBadge = (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold animate-pulse">
                Today
              </span>
            );
          } else if (isMissed) {
            statusBadge = (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30">
                Missed
              </span>
            );
          }

          return (
            <div
              key={d.dayNumber}
              onClick={() => onSelectDay(d.dayNumber)}
              className={`glass-card p-4 flex flex-col justify-between cursor-pointer hover:scale-[1.02] ${
                d.checkedIn
                  ? 'border-emerald-500/30'
                  : isToday
                  ? 'border-amber-400/50 ring-1 ring-amber-400/40'
                  : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-xs font-bold text-white">
                      Day {d.dayNumber}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      (W{d.weekNumber})
                    </span>
                  </div>
                  {statusBadge}
                </div>

                <div className="flex items-center justify-between mt-2 text-xs font-mono">
                  <span className="text-slate-400">{d.date}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-cyan-300 border border-white/5">
                    {d.dayMode}
                  </span>
                </div>

                <div className="mt-2.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    {d.mainFocus}
                  </span>
                  <p className="text-xs text-slate-200 line-clamp-2 mt-0.5 leading-relaxed">
                    {d.concreteOutput || 'General study and habit execution.'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <div>
                  {d.checkedIn ? (
                    <span className="text-emerald-400">
                      {habitsDone} habits • {skillMin}m
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      Plan: {d.skillPlanMinutes}m
                    </span>
                  )}
                </div>

                <span className="text-red-400 font-semibold flex items-center space-x-1 text-[10px] hover:underline">
                  <span>Edit</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
