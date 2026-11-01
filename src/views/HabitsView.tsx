import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { ChallengeDay, HabitItem } from '../types';
import { calculateHabitAnalytics } from '../utils/analytics';

interface HabitsViewProps {
  currentDate: string;
  days: ChallengeDay[];
  habits: HabitItem[];
  onAddHabit: (habit: HabitItem) => Promise<void>;
  onToggleHabitActive: (habitId: string) => Promise<void>;
  onSelectDayNumber: (dayNum: number) => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  currentDate,
  days,
  habits,
  onAddHabit,
  onToggleHabitActive,
  onSelectDayNumber,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDesc, setNewHabitDesc] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<'mindset' | 'health' | 'communication' | 'leadership' | 'custom'>('custom');

  const habitAnalytics = calculateHabitAnalytics(days, habits, currentDate);

  const handleCreateCustomHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const id = `custom_${Date.now()}`;
    const newHabit: HabitItem = {
      id,
      name: newHabitName.trim(),
      category: newHabitCategory,
      targetDescription: newHabitDesc.trim() || 'Custom personal development practice',
      active: true,
      sortOrder: habits.length + 1,
      isCustom: true,
    };

    await onAddHabit(newHabit);
    setNewHabitName('');
    setNewHabitDesc('');
    setShowAddModal(false);
  };

  const elapsedDays = days.filter((d) => d.date <= currentDate);
  const recentDays = elapsedDays.slice(-14).reverse();

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header & Overview */}
      <div className="glass-panel p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/15">
                Daily Disciplines
              </span>
              <span className="text-xs font-mono text-slate-400">
                Habit Tracking & Adherence
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Daily Habits System</h1>
            <p className="text-xs text-slate-300 max-w-xl mt-1">
              Derived from the workbook's 6 core practices plus speaking, sleep, and energy logs.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs font-bold uppercase shadow-lg flex items-center space-x-1.5 self-start sm:self-center transition-all"
          >
            <Plus className="w-4 h-4 text-red-400" />
            <span>Add Custom Habit</span>
          </button>
        </div>
      </div>

      {/* Habit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map((habit) => {
          const stats = habitAnalytics.find((h) => h.habitId === habit.id);
          const rate = stats ? stats.completionRate : 0;
          const done = stats ? stats.doneCount : 0;
          const skipped = stats ? stats.skippedCount : 0;

          return (
            <div
              key={habit.id}
              className={`glass-card p-5 flex flex-col justify-between ${
                !habit.active ? 'opacity-50' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-base font-bold text-white">{habit.name}</h2>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                        {habit.category}
                      </span>
                      {habit.isCustom && (
                        <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {habit.targetDescription}
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleHabitActive(habit.id)}
                    title={habit.active ? 'Deactivate habit' : 'Activate habit'}
                    className="text-slate-400 hover:text-white"
                  >
                    {habit.active ? (
                      <ToggleRight className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-600" />
                    )}
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-400">Adherence Rate</span>
                    <span className="font-bold text-cyan-400">{rate}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/5">
                    <div
                      className="bg-gradient-to-r from-red-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, rate)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Completed: <strong className="text-white">{done}</strong> days
                </span>
                {skipped > 0 && (
                  <span className="text-amber-400">
                    Skipped: {skipped}
                  </span>
                )}
                <span className="text-slate-400 text-[11px]">
                  {habit.active ? 'Active' : 'Archived'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 14-Day Recent Matrix */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              14-Day Recent Completion Log
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Click day to edit</span>
        </div>

        {recentDays.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-2 pr-3">HABIT</th>
                  {recentDays.map((d) => (
                    <th
                      key={d.dayNumber}
                      onClick={() => onSelectDayNumber(d.dayNumber)}
                      className="px-2 py-2 text-center cursor-pointer hover:text-white"
                    >
                      <div>D{d.dayNumber}</div>
                      <div className="text-[9px] text-slate-500">{d.date.slice(5)}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {habits.filter((h) => h.active).map((h) => (
                  <tr key={h.id} className="hover:bg-white/5">
                    <td className="py-2.5 pr-3 text-slate-200 font-medium whitespace-nowrap">
                      {h.name}
                    </td>
                    {recentDays.map((d) => {
                      const status = d.habits?.[h.id]?.status;
                      return (
                        <td key={d.dayNumber} className="px-2 py-2.5 text-center">
                          {status === 'done' ? (
                            <span className="inline-block w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold leading-4 border border-emerald-500/30">
                              ✓
                            </span>
                          ) : status === 'skipped' ? (
                            <span className="inline-block w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 font-bold leading-4 border border-amber-500/30">
                              -
                            </span>
                          ) : d.checkedIn ? (
                            <span className="inline-block w-4 h-4 rounded-full bg-white/5 text-slate-500 font-bold leading-4">
                              ✕
                            </span>
                          ) : (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/20" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4">No elapsed challenge days yet.</p>
        )}
      </div>

      {/* Add Custom Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 max-w-md w-full bg-slate-900/90 border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Add Custom Discipline
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomHabit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1 uppercase">Habit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cold shower, LeetCode problem, 10 pushups..."
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full glass-input px-3 py-2 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 uppercase">Category</label>
                <select
                  aria-label="Habit Category"
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value as any)}
                  className="w-full glass-input px-3 py-2 text-white text-sm"
                >
                  <option value="custom" className="bg-slate-900">Custom</option>
                  <option value="mindset" className="bg-slate-900">Mindset</option>
                  <option value="health" className="bg-slate-900">Health & Fitness</option>
                  <option value="communication" className="bg-slate-900">Communication</option>
                  <option value="leadership" className="bg-slate-900">Leadership</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 uppercase">Target Rule</label>
                <input
                  type="text"
                  placeholder="e.g. 5 minutes every morning before breakfast"
                  value={newHabitDesc}
                  onChange={(e) => setNewHabitDesc(e.target.value)}
                  className="w-full glass-input px-3 py-2 text-white text-sm"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:text-white border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600/90 hover:bg-red-500 text-white font-bold shadow-lg"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
