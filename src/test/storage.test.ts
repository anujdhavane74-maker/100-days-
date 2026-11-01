import { describe, it, expect } from 'vitest';
import { exportAppState, validateImportJson } from '../storage/db';
import { initialAppState } from '../data/seedData';

describe('Storage, Validation, and Export/Import Rules', () => {
  it('exports valid JSON containing 100 days and challenge config', () => {
    const jsonStr = exportAppState(initialAppState);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.app).toBe('100-Day Growth Tracker');
    expect(parsed.data.days.length).toBe(100);
    expect(parsed.data.config.totalDays).toBe(100);
  });

  it('validates a correct import payload and produces a preview', () => {
    const jsonStr = exportAppState(initialAppState);
    const result = validateImportJson(jsonStr);

    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
    expect(result.preview?.daysCount).toBe(100);
    expect(result.preview?.checkedInCount).toBe(0);
    expect(result.preview?.habitsCount).toBe(initialAppState.habits.length);
    expect(result.preview?.tasksCount).toBe(initialAppState.tasks.length);
  });

  it('rejects an invalid payload with less than 100 days', () => {
    const badState = JSON.parse(JSON.stringify(initialAppState));
    badState.days.pop(); // 99 days

    const result = validateImportJson(JSON.stringify(badState));
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('exactly 100'))).toBe(true);
  });

  it('rejects an invalid payload with duplicate day numbers', () => {
    const badState = JSON.parse(JSON.stringify(initialAppState));
    badState.days[1].dayNumber = 1; // Duplicate day 1

    const result = validateImportJson(JSON.stringify(badState));
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Duplicate day number'))).toBe(true);
  });
});
