import React, { useState } from 'react';
import {
  Info,
} from 'lucide-react';
import { TimetableDay, GuideRule } from '../types';

interface TimetableGuideViewProps {
  timetable: TimetableDay[];
  guide: GuideRule[];
}

export const TimetableGuideView: React.FC<TimetableGuideViewProps> = ({
  timetable,
  guide,
}) => {
  const [activeTab, setActiveTab] = useState<'timetable' | 'guide'>('timetable');

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/15">
                Reference Repository
              </span>
              <span className="text-xs font-mono text-slate-400">
                Zeal FY B.Tech AI & DS • Planning Rules
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Timetable & Guide</h1>
            <p className="text-xs text-slate-300 max-w-xl mt-1">
              Directly imported from your workbook's Timetable and Guide sheets.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-center font-mono text-xs">
            <button
              onClick={() => setActiveTab('timetable')}
              className={`px-4 py-2 rounded-xl font-bold uppercase transition-all ${
                activeTab === 'timetable'
                  ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              Timetable (A2 & A11)
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 rounded-xl font-bold uppercase transition-all ${
                activeTab === 'guide'
                  ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              Guide & Assumptions
            </button>
          </div>
        </div>
      </div>

      {/* 1. TIMETABLE TAB */}
      {activeTab === 'timetable' && (
        <div className="space-y-6">
          <div className="glass-panel p-5">
            <div className="flex items-start space-x-3 text-xs">
              <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-mono uppercase">
                  Source: Zeal FY B.Tech AI & DS, Div A Timetable (Batches A2 & A11)
                </strong>
                <p className="text-slate-300 mt-1">
                  Default: 180 skill minutes on college days. Normal home arrival around 17:00.
                  Sunday reserves 120 academic minutes + 240 skill minutes.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timetable.map((dayItem) => (
              <div
                key={dayItem.day}
                className="glass-card p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10 font-mono">
                    <span className="text-base font-bold text-white uppercase">{dayItem.day}</span>
                    <span className="text-[11px] text-cyan-400">
                      Last Class: {dayItem.lastScheduledClass}
                    </span>
                  </div>

                  <div className="space-y-2 mt-3 font-mono text-xs">
                    {dayItem.slots.map((slot, sIdx) => {
                      const isNoClass = slot.subject.toLowerCase().includes('no class');
                      return (
                        <div
                          key={sIdx}
                          className={`p-2 rounded-lg flex items-center justify-between ${
                            slot.isLab
                              ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30'
                              : isNoClass
                              ? 'bg-white/5 text-slate-500'
                              : 'bg-white/10 text-slate-200 border border-white/10'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400">{slot.time}</span>
                          <span className="font-semibold text-right truncate max-w-[170px]">
                            {slot.subject}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {dayItem.planningNote && (
                  <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-amber-300">
                    <strong>Note:</strong> {dayItem.planningNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. GUIDE & RULES TAB */}
      {activeTab === 'guide' && (
        <div className="space-y-4">
          <div className="glass-panel p-6">
            <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10 font-mono">
              Workbook Rules & Planning Assumptions ({guide.length} Guidelines)
            </h2>

            <div className="divide-y divide-white/10 mt-4 text-xs">
              {guide.map((rule, idx) => (
                <div key={idx} className="py-3.5 space-y-1">
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-red-400 border border-white/10">
                      {rule.topic}
                    </span>
                  </div>
                  <p className="text-slate-200 leading-relaxed pl-1 pt-1">
                    {rule.rule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
