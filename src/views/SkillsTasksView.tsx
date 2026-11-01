import React, { useState } from 'react';
import {
  Code2,
  CheckCircle2,
  Clock,
  Play,
  CheckSquare,
  ExternalLink,
  Filter,
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import { Course, TaskItem, TaskStatus } from '../types';
import { calculateCourseProgress } from '../utils/analytics';

interface SkillsTasksViewProps {
  courses: Course[];
  tasks: TaskItem[];
  onUpdateTask: (task: TaskItem) => Promise<void>;
  onUpdateModule: (courseId: string, moduleId: string, watchedMinutes: number, completed: boolean) => Promise<void>;
}

export const SkillsTasksView: React.FC<SkillsTasksViewProps> = ({
  courses,
  tasks,
  onUpdateTask,
  onUpdateModule,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'tasks'>('courses');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedTaskStatus, setSelectedTaskStatus] = useState<string>('all');
  const [taskSearch, setTaskSearch] = useState<string>('');
  const [expandedCourseId, setExpandedCourseId] = useState<string>(courses[0]?.id || '');
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  const courseProgressList = calculateCourseProgress(courses, tasks);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedCourseFilter !== 'all' && t.course.toLowerCase() !== selectedCourseFilter.toLowerCase()) {
      return false;
    }
    if (selectedTaskStatus !== 'all' && t.status !== selectedTaskStatus) {
      return false;
    }
    if (taskSearch.trim()) {
      const q = taskSearch.toLowerCase();
      const matchId = t.id.toLowerCase().includes(q);
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchCourse = t.course.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchCourse) return false;
    }
    return true;
  });

  const handleTaskStatusToggle = async (task: TaskItem, newStatus: TaskStatus) => {
    const updated: TaskItem = {
      ...task,
      status: newStatus,
      completedAt: newStatus === 'done' ? new Date().toISOString() : null,
    };
    await onUpdateTask(updated);
  };

  const handleSaveEditedTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    await onUpdateTask(editingTask);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & Sub-Navigation */}
      <div className="racing-card p-6 bg-gradient-to-r from-racing-card via-racing-surface to-racing-darker border-l-4 border-l-racing-red">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="telemetry-tag bg-racing-red/20 text-racing-red border border-racing-red/40">
                TECHNICAL ENGINEERING
              </span>
              <span className="text-xs font-mono text-racing-textSubtle">
                5 COURSES • 94 TASKS
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">Skills, Courses & Tasks</h1>
            <p className="text-xs text-racing-textMuted max-w-xl mt-1">
              Track course modules, video watched times, and all 94 workbook tasks with evidence links and review notes.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-center font-mono text-xs">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 rounded-lg font-bold uppercase transition-all ${
                activeTab === 'courses'
                  ? 'bg-racing-red text-white shadow-red-glow'
                  : 'bg-racing-darker text-slate-300 border border-racing-border hover:text-white'
              }`}
            >
              COURSES ({courses.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-lg font-bold uppercase transition-all ${
                activeTab === 'tasks'
                  ? 'bg-racing-red text-white shadow-red-glow'
                  : 'bg-racing-darker text-slate-300 border border-racing-border hover:text-white'
              }`}
            >
              TASKS ({tasks.length})
            </button>
          </div>
        </div>
      </div>

      {/* Courses Tab View */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Courses Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {courseProgressList.map((cp) => (
              <button
                key={cp.courseId}
                onClick={() => setExpandedCourseId(cp.courseId)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  expandedCourseId === cp.courseId
                    ? 'bg-racing-surface border-racing-red shadow-red-glow ring-1 ring-racing-red'
                    : 'bg-racing-card border-racing-border hover:border-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white uppercase">{cp.name}</span>
                    <span className="text-[10px] font-mono text-racing-cyan">{cp.videoCompletionRate}%</span>
                  </div>
                  <div className="text-[11px] text-racing-textSubtle mt-1 font-mono">
                    {cp.watchedMinutes} / {cp.targetMinutes} min
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-racing-darker rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-racing-red h-full rounded-full transition-all"
                      style={{ width: `${cp.videoCompletionRate}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-racing-textMuted mt-1">
                    Tasks: {cp.tasksDone} / {cp.taskTarget} done
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Expanded Course Modules List */}
          {courses.map((course) => {
            if (course.id !== expandedCourseId) return null;
            const progress = courseProgressList.find((c) => c.courseId === course.id);

            return (
              <div key={course.id} className="racing-card p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-racing-border gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="telemetry-tag bg-racing-cyan/20 text-racing-cyan border border-racing-cyan/40">
                        {course.name} MODULES
                      </span>
                      <span className="text-xs font-mono text-racing-textSubtle">
                        {course.modules.length} MODULES
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white mt-1">Course Curriculum & Telemetry</h2>
                  </div>

                  <div className="text-xs font-mono text-right text-racing-textMuted">
                    Target: <strong className="text-white">{(course.videoTargetMinutes / 60).toFixed(1)} hrs</strong> ({course.videoTargetMinutes} min)
                  </div>
                </div>

                <div className="divide-y divide-racing-border/40">
                  {course.modules.map((mod, idx) => (
                    <div
                      key={mod.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-racing-textSubtle text-[11px]">#{idx + 1}</span>
                          <span className="font-semibold text-slate-100">{mod.title}</span>
                          {mod.completed && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              COMPLETED
                            </span>
                          )}
                        </div>
                        {mod.sourceNote && (
                          <div className="text-[11px] text-racing-textSubtle italic">
                            {mod.sourceNote}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 shrink-0 font-mono">
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="number"
                            min="0"
                            max={mod.targetMinutes * 2}
                            value={mod.watchedMinutes || ''}
                            placeholder="0"
                            onChange={(e) =>
                              onUpdateModule(
                                course.id,
                                mod.id,
                                Math.max(0, Number(e.target.value) || 0),
                                mod.completed
                              )
                            }
                            className="w-16 bg-racing-darker border border-racing-border rounded px-2 py-1 text-right text-white text-xs focus:outline-none focus:border-racing-red"
                          />
                          <span className="text-racing-textSubtle">/ {mod.targetMinutes}m</span>
                        </div>

                        <button
                          onClick={() =>
                            onUpdateModule(
                              course.id,
                              mod.id,
                              mod.watchedMinutes,
                              !mod.completed
                            )
                          }
                          className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition-all ${
                            mod.completed
                              ? 'bg-emerald-500 text-white shadow-emerald-glow'
                              : 'bg-racing-darker text-slate-400 border border-racing-border hover:border-emerald-500/50'
                          }`}
                        >
                          {mod.completed ? '✓ DONE' : 'MARK DONE'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tasks Tab View */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="racing-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1 bg-racing-darker border border-racing-border rounded px-2 py-1">
                <span className="text-racing-textSubtle">COURSE:</span>
                <select
                  aria-label="Filter Tasks by Course"
                  value={selectedCourseFilter}
                  onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-racing-card">All Courses</option>
                  <option value="mern" className="bg-racing-card">MERN</option>
                  <option value="n8n" className="bg-racing-card">n8n</option>
                  <option value="davinci" className="bg-racing-card">DaVinci</option>
                  <option value="gen ai" className="bg-racing-card">Gen AI</option>
                  <option value="ai agents" className="bg-racing-card">AI agents</option>
                </select>
              </div>

              <div className="flex items-center space-x-1 bg-racing-darker border border-racing-border rounded px-2 py-1">
                <span className="text-racing-textSubtle">STATUS:</span>
                <select
                  aria-label="Filter Tasks by Status"
                  value={selectedTaskStatus}
                  onChange={(e) => setSelectedTaskStatus(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-racing-card">All Statuses</option>
                  <option value="not_started" className="bg-racing-card">Not Started</option>
                  <option value="in_progress" className="bg-racing-card">In Progress</option>
                  <option value="blocked" className="bg-racing-card">Blocked</option>
                  <option value="done" className="bg-racing-card">Done</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-racing-textSubtle absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search task ID or title..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                className="bg-racing-darker border border-racing-border rounded pl-8 pr-3 py-1 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-racing-red text-xs w-full md:w-64"
              />
            </div>
          </div>

          {/* Tasks List Table / Cards */}
          <div className="racing-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-racing-border text-xs font-mono text-racing-textSubtle">
              <span>SHOWING {filteredTasks.length} OF {tasks.length} TASKS</span>
              <span>CLICK TO EDIT EVIDENCE & DETAILS</span>
            </div>

            <div className="divide-y divide-racing-border/40">
              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div
                    onClick={() => setEditingTask(t)}
                    className="cursor-pointer hover:text-white flex-1 space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-racing-red">
                        {t.id}
                      </span>
                      <span className="font-semibold text-slate-200">{t.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {t.course}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-racing-textSubtle font-mono">
                      <span>Target: {t.targetDate}</span>
                      {t.evidenceLink && (
                        <span className="text-racing-cyan flex items-center space-x-0.5">
                          <ExternalLink className="w-3 h-3" />
                          <span>Has Evidence</span>
                        </span>
                      )}
                      {t.reviewNote && (
                        <span className="text-slate-400 italic truncate max-w-xs">
                          "{t.reviewNote}"
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center space-x-2 shrink-0 font-mono">
                    <select
                      aria-label={`Status for task ${t.id}`}
                      value={t.status}
                      onChange={(e) => handleTaskStatusToggle(t, e.target.value as TaskStatus)}
                      className={`text-xs px-2.5 py-1 rounded font-bold uppercase border focus:outline-none cursor-pointer ${
                        t.status === 'done'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : t.status === 'in_progress'
                          ? 'bg-racing-cyan/20 text-racing-cyan border-racing-cyan/40'
                          : t.status === 'blocked'
                          ? 'bg-racing-red/20 text-racing-red border-racing-red/40'
                          : 'bg-racing-darker text-slate-400 border-racing-border'
                      }`}
                    >
                      <option value="not_started" className="bg-racing-card">Not Started</option>
                      <option value="in_progress" className="bg-racing-card">In Progress</option>
                      <option value="blocked" className="bg-racing-card">Blocked</option>
                      <option value="done" className="bg-racing-card">Done</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="racing-card p-6 max-w-lg w-full bg-racing-card border-racing-red/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-racing-border">
              <div>
                <span className="text-xs font-mono text-racing-red font-bold">
                  {editingTask.id} • {editingTask.course}
                </span>
                <h2 className="text-base font-bold text-white uppercase tracking-wider mt-0.5">
                  EDIT TASK EVIDENCE & DETAILS
                </h2>
              </div>
              <button
                onClick={() => setEditingTask(null)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedTask} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-racing-textSubtle mb-1 uppercase">TASK TITLE</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full bg-racing-darker border border-racing-border rounded px-3 py-2 text-white focus:outline-none focus:border-racing-red text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-racing-textSubtle mb-1 uppercase">TARGET DUE DATE</label>
                  <input
                    type="date"
                    value={editingTask.targetDate}
                    onChange={(e) => setEditingTask({ ...editingTask, targetDate: e.target.value })}
                    className="w-full bg-racing-darker border border-racing-border rounded px-3 py-2 text-white focus:outline-none focus:border-racing-red"
                  />
                </div>

                <div>
                  <label className="block text-racing-textSubtle mb-1 uppercase">STATUS</label>
                  <select
                    aria-label="Edit Task Status"
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as TaskStatus })}
                    className="w-full bg-racing-darker border border-racing-border rounded px-3 py-2 text-white focus:outline-none focus:border-racing-red"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-racing-textSubtle mb-1 uppercase">
                  EVIDENCE LINK / GITHUB REPO / FILE
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/... or file reference"
                  value={editingTask.evidenceLink}
                  onChange={(e) => setEditingTask({ ...editingTask, evidenceLink: e.target.value })}
                  className="w-full bg-racing-darker border border-racing-border rounded px-3 py-2 text-white focus:outline-none focus:border-racing-red"
                />
              </div>

              <div>
                <label className="block text-racing-textSubtle mb-1 uppercase">
                  REVIEW NOTE / NEXT IMPROVEMENT
                </label>
                <textarea
                  rows={3}
                  placeholder="Notes on what was learned, edge cases fixed, or future refactoring..."
                  value={editingTask.reviewNote}
                  onChange={(e) => setEditingTask({ ...editingTask, reviewNote: e.target.value })}
                  className="w-full bg-racing-darker border border-racing-border rounded px-3 py-2 text-white focus:outline-none focus:border-racing-red"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-racing-border">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 rounded bg-racing-surface text-slate-300 hover:text-white border border-racing-border"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-racing-red hover:bg-racing-redHover text-white font-bold shadow-red-glow"
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
