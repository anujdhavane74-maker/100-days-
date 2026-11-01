import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  FileCheck,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { AppState } from '../types';
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
      const validation = validateImportJson(text);
      setImportResult(validation);
    };
    reader.readAsText(file);
  };

  const handleApplyImport = async () => {
    if (!importResult?.valid || !importResult.parsedState) return;
    await onImportState(importResult.parsedState);
    setImportResult(null);
    setFeedbackMessage('Data imported and restored successfully.');
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleConfirmReset = async () => {
    await onResetState();
    setShowResetConfirm(false);
    setFeedbackMessage('System safely reset to initial workbook state.');
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const quickJumpDates = [
    { label: 'Day 1 (Start)', date: '2026-11-02' },
    { label: 'Day 15 (W2)', date: '2026-11-16' },
    { label: 'Day 50 (Halfway)', date: '2026-12-21' },
    { label: 'Day 90 (Exam Flex)', date: '2027-01-30' },
    { label: 'Day 100 (Final Lap)', date: '2027-02-09' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-16">
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/15">
            System & Storage
          </span>
          <span className="text-xs font-mono text-slate-400">
            Local-First • Export & Import
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1">Data Management & Time Travel</h1>
        <p className="text-xs text-slate-300 max-w-xl mt-1">
          Everything runs local-first in your browser. Download full backups anytime or simulate dates to test your progression.
        </p>
      </div>

      {feedbackMessage && (
        <div className="p-4 rounded-2xl glass-panel bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Date Simulation Controls */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              Date Simulation & Timeline Testing
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            Current Date: {simulatedDate}
          </span>
        </div>

        <p className="text-xs text-slate-300">
          The challenge spans 02 Nov 2026 to 09 Feb 2027. You can jump to any date to verify how streaks and weekly milestones calculate at different stages.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {quickJumpDates.map((jump) => (
            <button
              key={jump.date}
              onClick={() => onSetSimulatedDate(jump.date)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                simulatedDate === jump.date
                  ? 'bg-white/20 text-white border border-white/30 font-bold shadow-lg'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {jump.label} ({jump.date})
            </button>
          ))}
        </div>
      </div>

      {/* Export Complete JSON */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              Export Backup
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">100% Offline</span>
        </div>

        <p className="text-xs text-slate-300">
          Downloads a complete JSON backup containing all 100 days, work logs, habit records, task statuses, and roadmap reviews.
        </p>

        <button
          onClick={handleExportJson}
          className="px-5 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase shadow-lg shadow-emerald-950/40 flex items-center space-x-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Backup (.json)</span>
        </button>
      </div>

      {/* Import & Restore */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              Restore from Backup
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Validated Preview</span>
        </div>

        <p className="text-xs text-slate-300">
          Upload a valid JSON backup file. The system previews record counts before applying.
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
          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 font-mono text-xs font-bold uppercase flex items-center space-x-2 transition-all"
        >
          <Upload className="w-4 h-4 text-cyan-400" />
          <span>Choose Backup File...</span>
        </button>

        {importResult && (
          <div className="mt-4 p-4 rounded-xl border border-white/15 bg-slate-950/60 space-y-3 font-mono text-xs">
            {importResult.valid ? (
              <>
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <FileCheck className="w-4 h-4" />
                  <span>Valid Backup Payload</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                  <div className="p-2.5 rounded-lg bg-white/5">
                    <span className="text-slate-400 block">DAYS</span>
                    <strong className="text-white">{importResult.preview?.daysCount}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5">
                    <span className="text-slate-400 block">CHECKED IN</span>
                    <strong className="text-emerald-400">{importResult.preview?.checkedInCount}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5">
                    <span className="text-slate-400 block">HABITS</span>
                    <strong className="text-white">{importResult.preview?.habitsCount}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5">
                    <span className="text-slate-400 block">TASKS</span>
                    <strong className="text-white">{importResult.preview?.tasksCount}</strong>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={handleApplyImport}
                    className="px-5 py-2 rounded-xl bg-red-600/90 hover:bg-red-500 text-white font-bold shadow-lg"
                  >
                    Confirm & Restore
                  </button>
                  <button
                    onClick={() => setImportResult(null)}
                    className="px-3 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"
                  >
                    Discard
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 text-red-400">
                <div className="flex items-center space-x-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Import Validation Failed</span>
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

      {/* Factory Reset */}
      <div className="glass-panel p-6 space-y-4 border-red-500/20">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-5 h-5 text-red-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              Factory Reset
            </h2>
          </div>
          <span className="text-xs font-mono text-red-400">Destructive Action</span>
        </div>

        <p className="text-xs text-slate-400">
          Resets all 100 days, work logs, and habits back to the initial state defined in the workbook.
        </p>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-mono text-xs font-bold uppercase transition-all"
          >
            Reset to Workbook Defaults...
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-red-500/50 space-y-3 font-mono text-xs">
            <div className="flex items-center space-x-2 text-red-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Are you sure?</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              All logged days and check-in records will be cleared back to Day 1 unlogged status.
            </p>
            <div className="flex items-center space-x-3 pt-1">
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
