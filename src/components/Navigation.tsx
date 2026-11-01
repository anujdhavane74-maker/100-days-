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
      {/* Desktop / Tablet Sub-Header Navigation Bar */}
      <nav className="bg-racing-card/90 border-b border-racing-border hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-racing-red ${
                    isActive
                      ? 'bg-racing-red text-white shadow-red-glow font-semibold'
                      : 'text-racing-textMuted hover:text-white hover:bg-racing-surface'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        item.badge === 'DONE'
                          ? isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-racing-amber/20 text-racing-amber border border-racing-amber/40 animate-pulse'
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

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-racing-darker/95 backdrop-blur-md border-t border-racing-border px-2 py-1.5 flex justify-around items-center">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-medium transition-all focus:outline-none ${
                isActive ? 'text-racing-red' : 'text-racing-textMuted hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-racing-red' : 'text-slate-400'}`} />
              <span className="mt-0.5 truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
        {/* Overflow / More for remaining items */}
        <button
          onClick={() => onChangeTab(activeTab === 'analytics' ? 'timetable-guide' : 'analytics')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-medium transition-all focus:outline-none ${
            ['analytics', 'timetable-guide', 'settings'].includes(activeTab)
              ? 'text-racing-red'
              : 'text-racing-textMuted hover:text-white'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
};
