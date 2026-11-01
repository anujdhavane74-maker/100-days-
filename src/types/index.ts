export type DayMode =
  | 'Normal'
  | 'Light'
  | 'Recovery'
  | 'Exam flex'
  | 'Exam prep'
  | 'Unit test'
  | 'Holiday'
  | 'Rest';

export type DayStatus = 'future' | 'open' | 'checked_in' | 'missed';

export type TaskStatus = 'not_started' | 'in_progress' | 'blocked' | 'done';

export type HabitStatus = 'done' | 'not_done' | 'skipped';

export interface HabitItem {
  id: string;
  name: string;
  category: 'communication' | 'mindset' | 'health' | 'character' | 'leadership' | 'custom';
  targetDescription: string;
  active: boolean;
  sortOrder: number;
  isCustom?: boolean;
}

export interface DayHabitEntry {
  status: HabitStatus;
  note?: string;
}

export interface WorkLogs {
  mernActual: number;
  n8nActual: number;
  genAiActual: number;
  agentsActual: number;
  davinciActual: number;
  academicActual: number;
  otherActual: number;
}

export interface ChallengeDay {
  dayNumber: number; // 1 - 100
  date: string; // YYYY-MM-DD
  weekNumber: number; // 1 - 15
  dayMode: DayMode;
  mainFocus: string;
  concreteOutput: string;
  skillPlanMinutes: number;
  academicPlanMinutes: number;
  status: DayStatus;
  checkedIn: boolean;
  checkedInAt: string | null;
  lastEditedAt: string | null;
  win: string;
  obstacle: string;
  nextStep: string;
  notes: string;
  habits: Record<string, DayHabitEntry>;
  workLogs: WorkLogs;
  speakingMinutes: number;
  sleepHours: number | null;
  energy: number | null; // 1 to 5
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  targetMinutes: number;
  watchedMinutes: number;
  completed: boolean;
  applicationEvidence: string;
  sourceNote: string;
}

export interface Course {
  id: string;
  name: string;
  videoTargetMinutes: number;
  modules: CourseModule[];
}

export interface TaskItem {
  id: string;
  course: string;
  title: string;
  targetDate: string; // YYYY-MM-DD
  status: TaskStatus;
  evidenceLink: string;
  reviewNote: string;
  completedAt: string | null;
}

export interface RoadmapWeek {
  weekNumber: number;
  startDate: string;
  endDate: string;
  technicalFocus: string;
  demonstrationMilestone: string;
  speakingProgression: string;
  weeklyWin: string;
  obstacleLesson: string;
  reviewedAt: string | null;
}

export interface TimetableSlot {
  time: string;
  subject: string;
  isLab: boolean;
}

export interface TimetableDay {
  day: string;
  slots: TimetableSlot[];
  lastScheduledClass: string;
  planningNote: string;
}

export interface GuideRule {
  topic: string;
  rule: string;
}

export interface MotivationLine {
  day: number;
  text: string;
  attributionType: 'verified_quote' | 'original_mindset';
  author: string;
  context: string;
}

export interface ChallengeConfig {
  id: string;
  title: string;
  startDate: string; // 2026-11-02
  endDate: string; // 2027-02-09
  finalReviewDate: string; // 2027-02-10
  totalDays: 100;
  timezone: string;
  status: 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  version: number;
  config: ChallengeConfig;
  days: ChallengeDay[];
  habits: HabitItem[];
  courses: Course[];
  tasks: TaskItem[];
  roadmap: RoadmapWeek[];
  timetable: TimetableDay[];
  guide: GuideRule[];
  motivationLines: MotivationLine[];
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  streakThroughYesterday: boolean;
  isTodayCheckedIn: boolean;
  totalCheckedIn: number;
  completionPercentage: number;
}
