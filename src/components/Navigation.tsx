import React from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  CalendarDays,
  Flame,
  Code2,
  BarChart3,
  BookOpen,
  Settings,
} from 'lucide-react';

export type NavTabId =
  | 'dashboard'
  | 'checkin'
  | 'board'
  | 'habits'
  | 'skills-tasks'
  | 'analytics'
  | 'timetable-guide'
  | 'settings';

interface NavigationProps {
  activeTab: NavTabId;
  onChangeTab: (tab: NavTabId) => void;
  isTodayCheckedIn: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  isTodayCheckedIn,
}) => {
  const navItems: { id: NavTabId; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'checkin',
      label: 'Daily Check-in',
      icon: CheckCircle2,
      badge: isTodayCheckedIn ? 'DONE' : 'PENDING',
    },
    { id: 'board', label: '100-Day Board', icon: CalendarDays },
    { id: 'habits', label: 'Habits', icon: Flame },
    { id: 'skills-tasks', label: 'Skills & Tasks', icon: Code2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'timetable-guide', label: 'Timetable & Guide', icon: BookOpen },
    { id: 'settings', label: 'Data / Backup', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Frosted Glass Nav */}
      <nav className="hidden md:block sticky top-16 sm:top-20 z-30 bg-slate-950/40 backdrop-blur-md border-b border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 overflow-x-auto py-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap focus:outline-none ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/25 shadow-lg backdrop-blur-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        item.badge === 'DONE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Glass Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex justify-around items-center">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-medium transition-all focus:outline-none ${
                isActive ? 'text-red-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
              <span className="mt-0.5 truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
        <button
          onClick={() => onChangeTab(activeTab === 'analytics' ? 'timetable-guide' : 'analytics')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-medium transition-all focus:outline-none ${
            ['analytics', 'timetable-guide', 'settings'].includes(activeTab)
              ? 'text-red-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
};
