import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Info,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
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
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & Sub-Tab Switcher */}
      <div className="racing-card p-6 bg-gradient-to-r from-racing-card via-racing-surface to-racing-darker border-l-4 border-l-racing-red">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="telemetry-tag bg-racing-red/20 text-racing-red border border-racing-red/40">
                COLLEGE & SYSTEM REPOSITORY
              </span>
              <span className="text-xs font-mono text-racing-textSubtle">
                ZEAL FY B.TECH AI & DS • PLANNING RULES
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">Timetable & Guide</h1>
            <p className="text-xs text-racing-textMuted max-w-xl mt-1">
              Directly imported from your workbook's Timetable and Guide sheets.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-center font-mono text-xs">
            <button
              onClick={() => setActiveTab('timetable')}
              className={`px-4 py-2 rounded-lg font-bold uppercase transition-all ${
                activeTab === 'timetable'
                  ? 'bg-racing-red text-white shadow-red-glow'
                  : 'bg-racing-darker text-slate-300 border border-racing-border hover:text-white'
              }`}
            >
              TIMETABLE (A2 & A11)
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 rounded-lg font-bold uppercase transition-all ${
                activeTab === 'guide'
                  ? 'bg-racing-red text-white shadow-red-glow'
                  : 'bg-racing-darker text-slate-300 border border-racing-border hover:text-white'
              }`}
            >
              GUIDE & ASSUMPTIONS
            </button>
          </div>
        </div>
      </div>

      {/* 1. TIMETABLE TAB */}
      {activeTab === 'timetable' && (
        <div className="space-y-6">
          <div className="racing-card p-5 bg-racing-surface/80 border-l-4 border-l-racing-cyan">
            <div className="flex items-start space-x-3 text-xs">
              <Info className="w-5 h-5 text-racing-cyan shrink-0 mt-0.5" />
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

          {/* Timetable Cards by Day */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timetable.map((dayItem) => (
              <div
                key={dayItem.day}
                className="racing-card p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-racing-border font-mono">
                    <span className="text-base font-black text-white uppercase">{dayItem.day}</span>
                    <span className="text-[11px] text-racing-cyan">
                      Last Class: {dayItem.lastScheduledClass}
                    </span>
                  </div>

                  <div className="space-y-2 mt-3 font-mono text-xs">
                    {dayItem.slots.map((slot, sIdx) => {
                      const isNoClass = slot.subject.toLowerCase().includes('no class');
                      return (
                        <div
                          key={sIdx}
                          className={`p-2 rounded flex items-center justify-between ${
                            slot.isLab
                              ? 'bg-purple-950/40 text-purple-200 border border-purple-800/40'
                              : isNoClass
                              ? 'bg-racing-darker text-slate-600'
                              : 'bg-racing-surface text-slate-200 border border-racing-border/50'
                          }`}
                        >
                          <span className="text-[10px] text-racing-textSubtle">{slot.time}</span>
                          <span className="font-semibold text-right truncate max-w-[170px]">
                            {slot.subject}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {dayItem.planningNote && (
                  <div className="pt-2 border-t border-racing-border text-[11px] font-mono text-racing-amber">
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
          <div className="racing-card p-6">
            <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-racing-border font-mono">
              WORKBOOK RULES & PLANNING ASSUMPTIONS (ALL {guide.length} ENTRIES)
            </h2>

            <div className="divide-y divide-racing-border/50 mt-4 text-xs">
              {guide.map((rule, idx) => (
                <div key={idx} className="py-3.5 space-y-1">
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="telemetry-tag bg-slate-800 text-racing-red font-bold">
                      {rule.topic}
                    </span>
                  </div>
                  <p className="text-slate-200 leading-relaxed pl-1 pt-0.5">
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
