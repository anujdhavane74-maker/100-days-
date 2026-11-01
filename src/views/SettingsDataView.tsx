import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { AppState, ChallengeDay } from '../types';
import { exportAppState, validateImportJson, ImportValidationResult } from '../storage/db';

interface SettingsDataViewProps {
  state: AppState;
  onImportState: (newState: AppState) => Promise<void>;
  onResetState: () => Promise<void>;
  simulatedDate: string;
  onSetSimulatedDate: (d: string) => void;
}

export const SettingsDataView: React.FC<SettingsDataViewProps> = ({
  state,
  onImportState,
  onResetState,
  simulatedDate,
  onSetSimulatedDate,
}) => {
  const [importResult, setImportResult] = useState<ImportValidationResult | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    const jsonStr = exportAppState(state);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `100_Day_Growth_Tracker_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFeedbackMessage('Backup exported successfully.');
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportJsonText(text);
      const validation = validateImportJson(text);
      setImportResult(validation);
    };
    reader.readAsText(file);
  };

  const handleApplyImport = async () => {
    if (!importResult?.valid || !importResult.parsedState) return;
    await onImportState(importResult.parsedState);
    setImportResult(null);
    setImportJsonText('');
    setFeedbackMessage('Data imported and restored successfully.');
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleConfirmReset = async () => {
    await onResetState();
    setShowResetConfirm(false);
    setFeedbackMessage('System safely reset to initial workbook state.');
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Quick simulated date jumps
  const quickJumpDates = [
    { label: 'Day 1 (Start)', date: '2026-11-02' },
    { label: 'Day 15 (W2)', date: '2026-11-16' },
    { label: 'Day 50 (Halfway)', date: '2026-12-21' },
    { label: 'Day 90 (Exam Flex)', date: '2027-01-30' },
    { label: 'Day 100 (Final Lap)', date: '2027-02-09' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-12">
      {/* Header */}
      <div className="racing-card p-6 bg-gradient-to-r from-racing-card via-racing-surface to-racing-darker border-l-4 border-l-racing-red">
        <div className="flex items-center space-x-2">
          <span className="telemetry-tag bg-racing-red/20 text-racing-red border border-racing-red/40">
            SYSTEM ARCHITECTURE
          </span>
          <span className="text-xs font-mono text-racing-textSubtle">
            INDEXEDDB PERSISTENCE • EXPORT / IMPORT
          </span>
        </div>
        <h1 className="text-2xl font-black text-white mt-1">Data Management & Time Travel</h1>
        <p className="text-xs text-racing-textMuted max-w-xl mt-1">
          Local-first architecture. Your data is stored on-device with zero cloud lock-in.
          Export verified JSON backups or test any timeline boundary with date simulation.
        </p>
      </div>

      {feedbackMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-mono text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Date Simulation & Boundary Controls */}
      <div className="racing-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-racing-border">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-racing-cyan" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              TIME SIMULATION & DATE BOUNDARIES
            </h2>
          </div>
          <span className="telemetry-tag bg-racing-cyan/10 text-racing-cyan border border-racing-cyan/30">
            CURRENT: {simulatedDate}
          </span>
        </div>

        <p className="text-xs text-racing-textMuted">
          The challenge spans 02 Nov 2026 to 09 Feb 2027. You can simulate any track date to verify how streaks, missed days, and weekly reviews behave at each lap.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {quickJumpDates.map((jump) => (
            <button
              key={jump.date}
              onClick={() => onSetSimulatedDate(jump.date)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                simulatedDate === jump.date
                  ? 'bg-racing-cyan text-racing-darker font-bold'
                  : 'bg-racing-surface border border-racing-border text-slate-300 hover:text-white'
              }`}
            >
              {jump.label} ({jump.date})
            </button>
          ))}
        </div>
      </div>

      {/* Export & Backup */}
      <div className="racing-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-racing-border">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              EXPORT COMPLETE JSON BACKUP
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">100% OFFLINE</span>
        </div>

        <p className="text-xs text-racing-textMuted">
          Downloads a comprehensive backup containing your 100-day logs, habit completions, course progress, tasks register, and roadmap reviews with schema versioning.
        </p>

        <button
          onClick={handleExportJson}
          className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase shadow-emerald-glow flex items-center space-x-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>DOWNLOAD BACKUP (.JSON)</span>
        </button>
      </div>

      {/* Import & Restore */}
      <div className="racing-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-racing-border">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-racing-cyan" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              IMPORT & RESTORE BACKUP
            </h2>
          </div>
          <span className="text-xs font-mono text-racing-textSubtle">PREVIEW BEFORE OVERWRITE</span>
        </div>

        <p className="text-xs text-racing-textMuted">
          Upload a previously exported backup file. The system validates the schema, day continuity, and record counts before asking for confirmation.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 rounded-lg bg-racing-surface hover:bg-racing-cardHover border border-racing-border text-slate-200 font-mono text-xs font-bold uppercase flex items-center space-x-2 transition-all"
        >
          <Upload className="w-4 h-4 text-racing-cyan" />
          <span>CHOOSE BACKUP FILE...</span>
        </button>

        {/* Validation / Preview Box */}
        {importResult && (
          <div className="mt-4 p-4 rounded-xl border bg-racing-darker space-y-3 font-mono text-xs">
            {importResult.valid ? (
              <>
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <FileCheck className="w-4 h-4" />
                  <span>VALID BACKUP PAYLOAD DETECTED</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                  <div className="p-2 rounded bg-racing-surface">
                    <span className="text-racing-textSubtle block">DAYS</span>
                    <strong className="text-white">{importResult.preview?.daysCount}</strong>
                  </div>
                  <div className="p-2 rounded bg-racing-surface">
                    <span className="text-racing-textSubtle block">CHECKED IN</span>
                    <strong className="text-emerald-400">{importResult.preview?.checkedInCount}</strong>
                  </div>
                  <div className="p-2 rounded bg-racing-surface">
                    <span className="text-racing-textSubtle block">HABITS</span>
                    <strong className="text-white">{importResult.preview?.habitsCount}</strong>
                  </div>
                  <div className="p-2 rounded bg-racing-surface">
                    <span className="text-racing-textSubtle block">TASKS</span>
                    <strong className="text-white">{importResult.preview?.tasksCount}</strong>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={handleApplyImport}
                    className="px-5 py-2 rounded bg-racing-red hover:bg-racing-redHover text-white font-bold shadow-red-glow"
                  >
                    CONFIRM & APPLY RESTORE
                  </button>
                  <button
                    onClick={() => {
                      setImportResult(null);
                      setImportJsonText('');
                    }}
                    className="px-3 py-2 rounded bg-racing-surface text-slate-400 hover:text-white"
                  >
                    DISCARD
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 text-racing-red">
                <div className="flex items-center space-x-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>IMPORT VALIDATION FAILED</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  {importResult.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Safe Reset to Default Seed Data */}
      <div className="racing-card p-6 space-y-4 border border-racing-red/30">
        <div className="flex items-center justify-between pb-3 border-b border-racing-border">
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-5 h-5 text-racing-red" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              FACTORY RESET
            </h2>
          </div>
          <span className="text-xs font-mono text-racing-red">DESTRUCTIVE ACTION</span>
        </div>

        <p className="text-xs text-racing-textMuted">
          Resets all 100 days, work logs, and habits back to the initial state defined in <code className="text-slate-300">100_Day_Growth_Planner.xlsx</code>.
          This cannot be undone unless you have a JSON backup.
        </p>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded-lg bg-racing-darker border border-racing-red/50 text-racing-red hover:bg-racing-red hover:text-white font-mono text-xs font-bold uppercase transition-all"
          >
            RESET TO WORKBOOK DEFAULTS...
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-racing-darker border border-racing-red space-y-3 font-mono text-xs">
            <div className="flex items-center space-x-2 text-racing-red font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>ARE YOU ABSOLUTELY SURE?</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              All logged days and check-in records will be cleared back to Day 1 unlogged status.
            </p>
            <div className="flex items-center space-x-3 pt-1">
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded bg-racing-red hover:bg-racing-redHover text-white font-bold"
              >
                YES, RESET EVERYTHING
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded bg-racing-surface text-slate-300 hover:text-white border border-racing-border"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
