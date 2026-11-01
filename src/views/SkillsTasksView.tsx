import React, { useState } from 'react';
import {
  ExternalLink,
  Search,
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
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/15">
                Technical Mastery
              </span>
              <span className="text-xs font-mono text-slate-400">
                5 Courses • 94 Tasks
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Skills, Courses & Tasks</h1>
            <p className="text-xs text-slate-300 max-w-xl mt-1">
              Curriculum progression and all 94 workbook tasks with evidence links and review notes.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-center font-mono text-xs">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 rounded-xl font-bold uppercase transition-all ${
                activeTab === 'courses'
                  ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              Courses ({courses.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-xl font-bold uppercase transition-all ${
                activeTab === 'tasks'
                  ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              Tasks ({tasks.length})
            </button>
          </div>
        </div>
      </div>

      {/* Courses Tab View */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {courseProgressList.map((cp) => (
              <button
                key={cp.courseId}
                onClick={() => setExpandedCourseId(cp.courseId)}
                className={`p-4 rounded-2xl glass-card text-left transition-all flex flex-col justify-between ${
                  expandedCourseId === cp.courseId
                    ? 'border-red-400/60 bg-white/10 ring-1 ring-red-400/40'
                    : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white uppercase">{cp.name}</span>
                    <span className="text-[10px] font-mono text-cyan-400">{cp.videoCompletionRate}%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    {cp.watchedMinutes} / {cp.targetMinutes} min
                  </div>
                </div>

                <div className="mt-3.5">
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-red-500 h-full rounded-full transition-all"
                      style={{ width: `${cp.videoCompletionRate}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1.5">
                    Tasks: {cp.tasksDone} / {cp.taskTarget} done
                  </div>
                </div>
              </button>
            ))}
          </div>

          {courses.map((course) => {
            if (course.id !== expandedCourseId) return null;

            return (
              <div key={course.id} className="glass-panel p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {course.name} Curriculum
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {course.modules.length} Modules
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white mt-1">Modules & Hands-on Video Time</h2>
                  </div>

                  <div className="text-xs font-mono text-right text-slate-400">
                    Target: <strong className="text-white">{(course.videoTargetMinutes / 60).toFixed(1)} hrs</strong> ({course.videoTargetMinutes} min)
                  </div>
                </div>

                <div className="divide-y divide-white/5">
                  {course.modules.map((mod, idx) => (
                    <div
                      key={mod.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-slate-400 text-[11px]">#{idx + 1}</span>
                          <span className="font-semibold text-slate-100">{mod.title}</span>
                          {mod.completed && (
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Completed
                            </span>
                          )}
                        </div>
                        {mod.sourceNote && (
                          <div className="text-[11px] text-slate-400 italic">
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
                            className="w-16 glass-input px-2 py-1 text-right text-white text-xs"
                          />
                          <span className="text-slate-400">/ {mod.targetMinutes}m</span>
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
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase transition-all ${
                            mod.completed
                              ? 'bg-emerald-500 text-white shadow-lg'
                              : 'bg-white/5 text-slate-400 border border-white/10 hover:border-emerald-500/40'
                          }`}
                        >
                          {mod.completed ? '✓ Done' : 'Mark Done'}
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
          <div className="glass-panel p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
                <span className="text-slate-400">Course:</span>
                <select
                  aria-label="Filter Tasks by Course"
                  value={selectedCourseFilter}
                  onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900">All Courses</option>
                  <option value="mern" className="bg-slate-900">MERN</option>
                  <option value="n8n" className="bg-slate-900">n8n</option>
                  <option value="davinci" className="bg-slate-900">DaVinci</option>
                  <option value="gen ai" className="bg-slate-900">Gen AI</option>
                  <option value="ai agents" className="bg-slate-900">AI agents</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
                <span className="text-slate-400">Status:</span>
                <select
                  aria-label="Filter Tasks by Status"
                  value={selectedTaskStatus}
                  onChange={(e) => setSelectedTaskStatus(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900">All Statuses</option>
                  <option value="not_started" className="bg-slate-900">Not Started</option>
                  <option value="in_progress" className="bg-slate-900">In Progress</option>
                  <option value="blocked" className="bg-slate-900">Blocked</option>
                  <option value="done" className="bg-slate-900">Done</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search task ID or title..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                className="glass-input pl-8 pr-3 py-1 text-slate-200 placeholder-slate-500 text-xs w-full md:w-64"
              />
            </div>
          </div>

          <div className="glass-panel p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-slate-400">
              <span>Showing {filteredTasks.length} of {tasks.length} tasks</span>
              <span>Click to edit evidence</span>
            </div>

            <div className="divide-y divide-white/5">
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
                      <span className="font-mono text-xs font-bold text-red-400">
                        {t.id}
                      </span>
                      <span className="font-semibold text-slate-200">{t.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/10 text-slate-300">
                        {t.course}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-mono">
                      <span>Target: {t.targetDate}</span>
                      {t.evidenceLink && (
                        <span className="text-cyan-400 flex items-center space-x-0.5">
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

                  <div className="flex items-center space-x-2 shrink-0 font-mono">
                    <select
                      aria-label={`Status for task ${t.id}`}
                      value={t.status}
                      onChange={(e) => handleTaskStatusToggle(t, e.target.value as TaskStatus)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold uppercase border focus:outline-none cursor-pointer ${
                        t.status === 'done'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : t.status === 'in_progress'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          : t.status === 'blocked'
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : 'bg-white/5 text-slate-400 border-white/10'
                      }`}
                    >
                      <option value="not_started" className="bg-slate-900">Not Started</option>
                      <option value="in_progress" className="bg-slate-900">In Progress</option>
                      <option value="blocked" className="bg-slate-900">Blocked</option>
                      <option value="done" className="bg-slate-900">Done</option>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 max-w-lg w-full bg-slate-900/95 border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-xs font-mono text-red-400 font-bold">
                  {editingTask.id} • {editingTask.course}
                </span>
                <h2 className="text-base font-bold text-white uppercase tracking-wider mt-0.5">
                  Edit Task Details
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
                <label className="block text-slate-400 mb-1 uppercase">Task Title</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full glass-input px-3 py-2 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 uppercase">Target Due Date</label>
                  <input
                    type="date"
                    value={editingTask.targetDate}
                    onChange={(e) => setEditingTask({ ...editingTask, targetDate: e.target.value })}
                    className="w-full glass-input px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 uppercase">Status</label>
                  <select
                    aria-label="Edit Task Status"
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as TaskStatus })}
                    className="w-full glass-input px-3 py-2 text-white"
                  >
                    <option value="not_started" className="bg-slate-900">Not Started</option>
                    <option value="in_progress" className="bg-slate-900">In Progress</option>
                    <option value="blocked" className="bg-slate-900">Blocked</option>
                    <option value="done" className="bg-slate-900">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 uppercase">
                  Evidence Link / GitHub URL / File Reference
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/... or project link"
                  value={editingTask.evidenceLink}
                  onChange={(e) => setEditingTask({ ...editingTask, evidenceLink: e.target.value })}
                  className="w-full glass-input px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 uppercase">
                  Review Note / Retrospective
                </label>
                <textarea
                  rows={3}
                  placeholder="Notes on lessons learned, edge cases resolved, or next steps..."
                  value={editingTask.reviewNote}
                  onChange={(e) => setEditingTask({ ...editingTask, reviewNote: e.target.value })}
                  className="w-full glass-input px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:text-white border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600/90 hover:bg-red-500 text-white font-bold shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
