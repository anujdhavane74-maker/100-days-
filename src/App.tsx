import React, { useState, useEffect } from 'react';
import { AppState, ChallengeDay, HabitItem, TaskItem } from './types';
import { loadAppState, saveAppState, resetAppState } from './storage/db';
import { getChallengeCurrentDate, calculateStreak, computeDayStatuses } from './utils/streak';
import { calculateOverviewMetrics } from './utils/analytics';
import { getWallpaperForDay, verstappenWallpapers } from './data/wallpapers';
import { Header } from './components/Header';
import { Navigation, NavTabId } from './components/Navigation';
import { DashboardView } from './views/DashboardView';
import { DailyCheckinView } from './views/DailyCheckinView';
import { ChallengeBoardView } from './views/ChallengeBoardView';
import { HabitsView } from './views/HabitsView';
import { SkillsTasksView } from './views/SkillsTasksView';
import { AnalyticsView } from './views/AnalyticsView';
import { TimetableGuideView } from './views/TimetableGuideView';
import { SettingsDataView } from './views/SettingsDataView';
import { Flag, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [simulatedDate, setSimulatedDate] = useState<string>('2026-11-02');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Background Wallpaper state
  const [currentWallpaper, setCurrentWallpaper] = useState<string>(
    verstappenWallpapers[0].url
  );
  const [isAutoWallpaper, setIsAutoWallpaper] = useState<boolean>(true);

  // Initialize state from IndexedDB
  useEffect(() => {
    async function init() {
      const state = await loadAppState();
      setAppState(state);
      const effectiveDate = getChallengeCurrentDate(state.days);
      setSimulatedDate(effectiveDate);
      const curDay = state.days.find((d) => d.date === effectiveDate);
      if (curDay) {
        setSelectedDayNumber(curDay.dayNumber);
        setCurrentWallpaper(getWallpaperForDay(curDay.dayNumber).url);
      }
    }
    init();
  }, []);

  // Update dynamic wallpaper when simulated day changes if auto mode is on
  useEffect(() => {
    if (isAutoWallpaper && appState) {
      const curDay = appState.days.find((d) => d.date === simulatedDate);
      if (curDay) {
        setCurrentWallpaper(getWallpaperForDay(curDay.dayNumber).url);
      }
    }
  }, [simulatedDate, isAutoWallpaper, appState]);

  if (!appState) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl mb-4 animate-pulse">
          <Flag className="w-6 h-6 text-white" />
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-slate-400 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 animate-spin text-red-500" />
          <span>Loading 100-Day Tracker...</span>
        </div>
      </div>
    );
  }

  // Calculate computed days with status
  const computedDays = computeDayStatuses(appState.days, simulatedDate);
  const streakInfo = calculateStreak(appState.days, simulatedDate);
  const overviewMetrics = calculateOverviewMetrics(appState.days, appState.tasks, simulatedDate);

  const handleSaveDay = async (updatedDay: ChallengeDay, _shouldClose: boolean) => {
    setIsSaving(true);
    const newDays = appState.days.map((d) =>
      d.dayNumber === updatedDay.dayNumber ? updatedDay : d
    );
    const newState: AppState = {
      ...appState,
      days: newDays,
    };
    setAppState(newState);
    await saveAppState(newState);
    setIsSaving(false);
  };

  const handleAddHabit = async (newHabit: HabitItem) => {
    setIsSaving(true);
    const newState: AppState = {
      ...appState,
      habits: [...appState.habits, newHabit],
    };
    setAppState(newState);
    await saveAppState(newState);
    setIsSaving(false);
  };

  const handleToggleHabitActive = async (habitId: string) => {
    setIsSaving(true);
    const newHabits = appState.habits.map((h) =>
      h.id === habitId ? { ...h, active: !h.active } : h
    );
    const newState: AppState = {
      ...appState,
      habits: newHabits,
    };
    setAppState(newState);
    await saveAppState(newState);
    setIsSaving(false);
  };

  const handleUpdateTask = async (updatedTask: TaskItem) => {
    setIsSaving(true);
    const newTasks = appState.tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );
    const newState: AppState = {
      ...appState,
      tasks: newTasks,
    };
    setAppState(newState);
    await saveAppState(newState);
    setIsSaving(false);
  };

  const handleUpdateModule = async (
    courseId: string,
    moduleId: string,
    watchedMinutes: number,
    completed: boolean
  ) => {
    setIsSaving(true);
    const newCourses = appState.courses.map((course) => {
      if (course.id !== courseId) return course;
      const newModules = course.modules.map((m) =>
        m.id === moduleId ? { ...m, watchedMinutes, completed } : m
      );
      return { ...course, modules: newModules };
    });

    const newState: AppState = {
      ...appState,
      courses: newCourses,
    };
    setAppState(newState);
    await saveAppState(newState);
    setIsSaving(false);
  };

  const handleImportState = async (imported: AppState) => {
    setIsSaving(true);
    setAppState(imported);
    await saveAppState(imported);
    setIsSaving(false);
  };

  const handleResetState = async () => {
    setIsSaving(true);
    const fresh = await resetAppState();
    setAppState(fresh);
    setSelectedDayNumber(1);
    setSimulatedDate('2026-11-02');
    setIsSaving(false);
  };

  const handleNavigate = (tab: NavTabId, dayNumber?: number) => {
    setActiveTab(tab);
    if (dayNumber !== undefined) {
      setSelectedDayNumber(dayNumber);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Dynamic Max Verstappen Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={currentWallpaper}
          alt="Max Verstappen Background"
          className="w-full h-full object-cover object-center transition-all duration-1000 brightness-[0.4] contrast-[1.05] scale-105"
        />
        {/* Sleek Frosted Glass Backdrop Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/75 to-slate-950/85 backdrop-blur-[2px]" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Header
          currentDate={simulatedDate}
          days={appState.days}
          streakInfo={streakInfo}
          isSaving={isSaving}
          activeTab={activeTab}
          simulatedDate={simulatedDate}
          onSetSimulatedDate={(d) => {
            setSimulatedDate(d);
            const found = appState.days.find((day) => day.date === d);
            if (found) setSelectedDayNumber(found.dayNumber);
          }}
          currentWallpaper={currentWallpaper}
          onSelectWallpaper={setCurrentWallpaper}
          isAutoWallpaper={isAutoWallpaper}
          onToggleAutoWallpaper={setIsAutoWallpaper}
        />

        <Navigation
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          isTodayCheckedIn={streakInfo.isTodayCheckedIn}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentDate={simulatedDate}
              days={computedDays}
              habits={appState.habits}
              tasks={appState.tasks}
              roadmap={appState.roadmap}
              streakInfo={streakInfo}
              metrics={overviewMetrics}
              motivationLines={appState.motivationLines}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'checkin' && (
            <DailyCheckinView
              currentDate={simulatedDate}
              selectedDayNumber={selectedDayNumber}
              days={computedDays}
              habits={appState.habits.filter((h) => h.active)}
              onSaveDay={handleSaveDay}
              onSelectDayNumber={setSelectedDayNumber}
            />
          )}

          {activeTab === 'board' && (
            <ChallengeBoardView
              currentDate={simulatedDate}
              days={computedDays}
              onSelectDay={(dayNum) => handleNavigate('checkin', dayNum)}
            />
          )}

          {activeTab === 'habits' && (
            <HabitsView
              currentDate={simulatedDate}
              days={computedDays}
              habits={appState.habits}
              onAddHabit={handleAddHabit}
              onToggleHabitActive={handleToggleHabitActive}
              onSelectDayNumber={(dayNum) => handleNavigate('checkin', dayNum)}
            />
          )}

          {activeTab === 'skills-tasks' && (
            <SkillsTasksView
              courses={appState.courses}
              tasks={appState.tasks}
              onUpdateTask={handleUpdateTask}
              onUpdateModule={handleUpdateModule}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              currentDate={simulatedDate}
              days={computedDays}
              habits={appState.habits}
              tasks={appState.tasks}
              courses={appState.courses}
              roadmap={appState.roadmap}
              streakInfo={streakInfo}
              metrics={overviewMetrics}
            />
          )}

          {activeTab === 'timetable-guide' && (
            <TimetableGuideView
              timetable={appState.timetable}
              guide={appState.guide}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsDataView
              state={appState}
              onImportState={handleImportState}
              onResetState={handleResetState}
              simulatedDate={simulatedDate}
              onSetSimulatedDate={setSimulatedDate}
            />
          )}
        </main>
      </div>
    </div>
  );
};
