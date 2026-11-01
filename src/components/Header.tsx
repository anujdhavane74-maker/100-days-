import React, { useState } from 'react';
import {
  Flame,
  ShieldCheck,
  Calendar,
  Clock,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { ChallengeDay, StreakInfo } from '../types';
import { verstappenWallpapers, WallpaperItem } from '../data/wallpapers';

interface HeaderProps {
  currentDate: string;
  days: ChallengeDay[];
  streakInfo: StreakInfo;
  isSaving: boolean;
  activeTab: string;
  simulatedDate: string;
  onSetSimulatedDate: (d: string) => void;
  currentWallpaper: string;
  onSelectWallpaper: (url: string) => void;
  isAutoWallpaper: boolean;
  onToggleAutoWallpaper: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  days,
  streakInfo,
  isSaving,
  simulatedDate,
  onSetSimulatedDate,
  currentWallpaper,
  onSelectWallpaper,
  isAutoWallpaper,
  onToggleAutoWallpaper,
}) => {
  const [showWallpaperMenu, setShowWallpaperMenu] = useState(false);
  const currentDay = days.find((d) => d.date === currentDate);
  const dayNum = currentDay ? currentDay.dayNumber : 1;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center shadow-lg">
              <span className="font-mono font-black text-lg text-white">100</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-wide text-white">
                  100-Day Growth Tracker
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono tracking-wider bg-white/10 text-slate-300 border border-white/15 rounded-full">
                  Max Verstappen Edition
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center space-x-2 font-mono">
                <span>02 Nov 2026 – 09 Feb 2027</span>
                <span className="text-white/20">•</span>
                <span className="text-red-400">Day {dayNum} of 100</span>
              </div>
            </div>
          </div>

          {/* Center & Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Streak Glass Pill */}
            <div
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all ${
                streakInfo.currentStreak > 0
                  ? 'bg-red-500/15 border-red-500/30 text-red-400 shadow-lg shadow-red-950/30'
                  : 'bg-white/5 border-white/10 text-slate-300'
              }`}
              title={
                streakInfo.streakThroughYesterday
                  ? 'Streak through yesterday! Complete today to maintain it.'
                  : `Current check-in streak: ${streakInfo.currentStreak} days`
              }
            >
              <Flame
                className={`w-4 h-4 ${
                  streakInfo.currentStreak > 0 ? 'text-red-500 animate-pulse' : 'text-slate-500'
                }`}
              />
              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-400 leading-none">
                  {streakInfo.streakThroughYesterday ? 'YESTERDAY' : 'STREAK'}
                </div>
                <div className="text-sm font-mono font-bold text-white flex items-center space-x-1">
                  <span>{streakInfo.currentStreak}</span>
                  <span className="text-xs font-normal text-slate-400">
                    / {streakInfo.longestStreak} max
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Wallpaper Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setShowWallpaperMenu(!showWallpaperMenu)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-xs font-mono text-slate-300 transition-all"
                title="Change background photo"
              >
                <ImageIcon className="w-4 h-4 text-slate-300" />
                <span className="hidden md:inline">Photo</span>
              </button>

              {/* Wallpaper Menu Dropdown */}
              {showWallpaperMenu && (
                <div className="absolute right-0 mt-2 w-72 p-3 rounded-2xl glass-panel bg-slate-900/90 border border-white/15 shadow-2xl z-50 animate-fadeIn space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono">
                    <span className="font-bold text-white uppercase">Background Photo</span>
                    <button
                      onClick={() => setShowWallpaperMenu(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono bg-white/5 p-2 rounded-lg">
                    <span className="text-slate-300">Daily Auto-Rotate</span>
                    <button
                      onClick={() => onToggleAutoWallpaper(!isAutoWallpaper)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                        isAutoWallpaper
                          ? 'bg-red-500 text-white'
                          : 'bg-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isAutoWallpaper ? 'ON (Day ' + dayNum + ')' : 'MANUAL'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {verstappenWallpapers.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => {
                          onSelectWallpaper(w.url);
                          onToggleAutoWallpaper(false);
                          setShowWallpaperMenu(false);
                        }}
                        className={`relative rounded-lg overflow-hidden border aspect-video group text-left transition-all ${
                          currentWallpaper === w.url
                            ? 'border-red-500 ring-2 ring-red-500/50'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img
                          src={w.url}
                          alt={w.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                          <span className="text-[10px] font-mono text-white truncate leading-tight">
                            {w.title.split('—')[0]}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Simulate Date Picker */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <select
                aria-label="Simulate Track Date"
                value={simulatedDate}
                onChange={(e) => onSetSimulatedDate(e.target.value)}
                className="bg-transparent text-xs font-mono text-slate-200 focus:outline-none cursor-pointer"
              >
                {days.map((d) => (
                  <option key={d.date} value={d.date} className="bg-slate-900 text-white">
                    Day {d.dayNumber} ({d.date})
                  </option>
                ))}
              </select>
            </div>

            {/* Sync State */}
            <div className="flex items-center text-xs font-mono text-slate-400 pl-1" title="Saved locally in browser">
              {isSaving ? (
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
