import React from 'react';
import { Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { MotivationLine } from '../types';

interface MotivationCardProps {
  currentDay: number;
  motivationLines: MotivationLine[];
  onSelectDay?: (day: number) => void;
}

export const MotivationCard: React.FC<MotivationCardProps> = ({
  currentDay,
  motivationLines,
}) => {
  const [selectedDay, setSelectedDay] = React.useState<number>(currentDay);

  React.useEffect(() => {
    setSelectedDay(currentDay);
  }, [currentDay]);

  const line =
    motivationLines.find((m) => m.day === selectedDay) ||
    motivationLines[0] || {
      day: currentDay,
      text: 'Telemetry does not lie. Review your daily inputs with ruthless objectivity.',
      attributionType: 'original_mindset',
      author: 'Racing Mindset',
      context: 'Daily Performance Telemetry Directive',
    };

  const isVerified = line.attributionType === 'verified_quote';

  const handlePrev = () => {
    if (selectedDay > 1) {
      setSelectedDay(selectedDay - 1);
    }
  };

  const handleNext = () => {
    if (selectedDay < 100) {
      setSelectedDay(selectedDay + 1);
    }
  };

  return (
    <div className="relative overflow-hidden glass-panel p-6 sm:p-7 transition-all duration-300">
      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider bg-white/10 text-white border border-white/15">
              DAY {line.day} MOTIVATION
            </span>
            {isVerified ? (
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                <Sparkles className="w-3 h-3" />
                <span>MAX VERSTAPPEN QUOTE</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider bg-white/5 text-slate-300 border border-white/10">
                RACING MINDSET
              </span>
            )}
          </div>

          {/* Quick cycle buttons */}
          <div className="flex items-center space-x-1.5 font-mono text-xs">
            <button
              onClick={handlePrev}
              disabled={selectedDay <= 1}
              aria-label="Previous day quote"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-400 px-1">
              {selectedDay} / 100
            </span>
            <button
              onClick={handleNext}
              disabled={selectedDay >= 100}
              aria-label="Next day quote"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quote text */}
        <div className="py-2">
          <div className="flex items-start space-x-3.5">
            <Quote className="w-6 h-6 text-red-400 shrink-0 rotate-180 opacity-80 mt-1" />
            <p className="text-base sm:text-xl font-medium text-white leading-relaxed italic">
              "{line.text}"
            </p>
          </div>
        </div>

        {/* Attribution & Context */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white tracking-wide">
              — {line.author}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-slate-400 text-[11px] truncate max-w-xs sm:max-w-md">
              {line.context}
            </span>
          </div>

          {selectedDay !== currentDay && (
            <button
              onClick={() => setSelectedDay(currentDay)}
              className="text-[11px] text-red-400 hover:underline"
            >
              Return to today (Day {currentDay})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
