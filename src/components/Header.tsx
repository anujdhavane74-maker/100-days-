import React from 'react';
import { Flame, ShieldCheck, Calendar, Clock, Trophy, RefreshCw } from 'lucide-react';
import { ChallengeDay, StreakInfo } from '../types';

interface HeaderProps {
  currentDate: string;
  days: ChallengeDay[];
  streakInfo: StreakInfo;
  isSaving: boolean;
  activeTab: string;
  simulatedDate: string;
  onSetSimulatedDate: (d: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  days,
  streakInfo,
  isSaving,
  simulatedDate,
  onSetSimulatedDate,
}) => {
  const currentDay = days.find((d) => d.date === currentDate);
  const dayNum = currentDay ? currentDay.dayNumber : 1;

  return (
    <header className="sticky top-0 z-40 bg-racing-darker/95 backdrop-blur-md border-b border-racing-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-racing-red to-racing-redDark flex items-center justify-center shadow-red-glow">
              <span className="text-white font-mono font-black text-xl tracking-tighter">100</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-wider uppercase text-white">
                  GROWTH TRACKER
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-racing-red/20 text-racing-red border border-racing-red/40 rounded">
                  RACING MINDSET
                </span>
              </div>
              <div className="text-xs text-racing-textSubtle flex items-center space-x-2 font-mono">
                <span>02 NOV 2026 – 09 FEB 2027</span>
                <span className="text-racing-border">•</span>
                <span className="text-racing-cyan">100-DAY TELEMETRY</span>
              </div>
            </div>
          </div>

          {/* Center / Right Telemetry Badges */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Day Number Badge */}
            <div className="flex items-center space-x-2 bg-racing-card border border-racing-border px-3 py-1.5 rounded-lg">
              <Calendar className="w-4 h-4 text-racing-red" />
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase text-racing-textSubtle leading-none">
                  DAY ON TRACK
                </div>
                <div className="text-sm font-mono font-bold text-white">
                  {dayNum} <span className="text-racing-textSubtle font-normal text-xs">/ 100</span>
                </div>
              </div>
            </div>

            {/* Streak Badge */}
            <div
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
                streakInfo.currentStreak > 0
                  ? 'bg-racing-red/10 border-racing-red/40 text-racing-red shadow-red-glow'
                  : 'bg-racing-card border-racing-border text-slate-300'
              }`}
              title={
                streakInfo.streakThroughYesterday
                  ? 'Streak through yesterday! Complete today to maintain it.'
                  : `Current consecutive check-in streak: ${streakInfo.currentStreak} days`
              }
            >
              <Flame
                className={`w-4 h-4 ${
                  streakInfo.currentStreak > 0 ? 'text-racing-red animate-pulse' : 'text-slate-500'
                }`}
              />
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase text-racing-textSubtle leading-none">
                  {streakInfo.streakThroughYesterday ? 'THROUGH YESTERDAY' : 'STREAK'}
                </div>
                <div className="text-sm font-mono font-bold text-white flex items-center space-x-1">
                  <span>{streakInfo.currentStreak}</span>
                  <span className="text-xs font-normal text-racing-textSubtle">
                    (MAX: {streakInfo.longestStreak})
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Date / Track Day Selector */}
            <div className="hidden lg:flex items-center space-x-1.5 bg-racing-surface border border-racing-border px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-racing-cyan" />
              <span className="text-[11px] font-mono text-racing-textMuted">SIMULATE DATE:</span>
              <select
                aria-label="Simulate Date"
                value={simulatedDate}
                onChange={(e) => onSetSimulatedDate(e.target.value)}
                className="bg-transparent text-xs font-mono text-racing-cyan focus:outline-none cursor-pointer border-b border-racing-cyan/40 py-0.5"
              >
                {days.map((d) => (
                  <option key={d.date} value={d.date} className="bg-racing-card text-white">
                    Day {d.dayNumber} ({d.date})
                  </option>
                ))}
              </select>
            </div>

            {/* Persistence Indicator */}
            <div className="flex items-center space-x-1 text-xs font-mono text-racing-textSubtle">
              {isSaving ? (
                <span className="flex items-center text-racing-amber space-x-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span className="hidden sm:inline">SAVING</span>
                </span>
              ) : (
                <span className="flex items-center text-emerald-400 space-x-1" title="Stored locally in IndexedDB">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">SYNCED</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
