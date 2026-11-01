import React from 'react';
import { Quote, Flag, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { MotivationLine } from '../types';

interface MotivationCardProps {
  currentDay: number;
  motivationLines: MotivationLine[];
  onSelectDay?: (day: number) => void;
}

export const MotivationCard: React.FC<MotivationCardProps> = ({
  currentDay,
  motivationLines,
  onSelectDay,
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
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-racing-card via-racing-surface to-racing-darker border border-racing-border shadow-card p-5 sm:p-6">
      {/* Decorative track lines background motif */}
      <div className="absolute top-0 right-0 w-64 h-full opacity-5 pointer-events-none bg-racing-stripes" />
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-racing-red/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Header bar of quote */}
        <div className="flex items-center justify-between pb-3 border-b border-racing-border/60">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-racing-red/15 text-racing-red border border-racing-red/30">
              <Flag className="w-3 h-3" />
              <span>LAP {line.day} MOTIVATION</span>
            </span>
            {isVerified ? (
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-cyan-950/60 text-racing-cyan border border-racing-cyan/40">
                <Sparkles className="w-3 h-3" />
                <span>VERIFIED QUOTE</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                ORIGINAL RACING MINDSET
              </span>
            )}
          </div>

          {/* Quick cycle buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrev}
              disabled={selectedDay <= 1}
              aria-label="Previous day quote"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-racing-border/50 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-racing-textSubtle px-1">
              {selectedDay}/100
            </span>
            <button
              onClick={handleNext}
              disabled={selectedDay >= 100}
              aria-label="Next day quote"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-racing-border/50 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quote body */}
        <div className="py-4 my-auto">
          <div className="flex items-start space-x-3">
            <Quote className="w-6 h-6 text-racing-red shrink-0 rotate-180 opacity-70 mt-1" />
            <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed italic">
              "{line.text}"
            </p>
          </div>
        </div>

        {/* Attribution & Context footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-racing-border/60 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white tracking-wide">
              — {line.author}
            </span>
            <span className="text-racing-textSubtle">•</span>
            <span className="text-racing-textMuted text-[11px] truncate max-w-xs sm:max-w-md">
              {line.context}
            </span>
          </div>

          {selectedDay !== currentDay && (
            <button
              onClick={() => setSelectedDay(currentDay)}
              className="text-[11px] text-racing-red hover:underline"
            >
              Return to today (Lap {currentDay})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
