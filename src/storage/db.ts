import { AppState, ChallengeDay, HabitItem, Course, TaskItem } from '../types';
import { initialAppState } from '../data/seedData';

const DB_NAME = '100_day_growth_tracker_db';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';
const STATE_KEY = 'current_state';
const LOCAL_STORAGE_KEY = '100_day_growth_tracker_backup';

/**
 * Opens or initializes the IndexedDB database.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available in current environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Loads the application state from IndexedDB, falling back to localStorage or seed data.
 */
export async function loadAppState(): Promise<AppState> {
  if (typeof window !== 'undefined' && window.indexedDB) {
    try {
      const db = await openDB();
      const state = await new Promise<AppState | null>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(STATE_KEY);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });

      if (state && isValidAppState(state)) {
        return state;
      }
    } catch (err) {
      console.warn('Failed to load from IndexedDB, checking localStorage backup...', err);
    }
  }

  // Fallback to localStorage
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (isValidAppState(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load from localStorage:', err);
  }

  // If first time or invalid, return default seed data
  return initialAppState;
}

/**
 * Saves the application state to IndexedDB and localStorage backup.
 */
export async function saveAppState(state: AppState): Promise<void> {
  const stateToSave = {
    ...state,
    config: {
      ...state.config,
      updatedAt: new Date().toISOString(),
    },
  };

  // Save to IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(stateToSave, STATE_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB write failed, relying on localStorage:', err);
  }

  // Also save to localStorage as backup
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (err) {
    console.error('localStorage write failed:', err);
  }
}

/**
 * Resets the application state to default initial seed data.
 */
export async function resetAppState(): Promise<AppState> {
  const fresh = JSON.parse(JSON.stringify(initialAppState));
  fresh.config.updatedAt = new Date().toISOString();
  await saveAppState(fresh);
  return fresh;
}

/**
 * Exports application state as formatted JSON string.
 */
export function exportAppState(state: AppState): string {
  const exportData = {
    exportedAt: new Date().toISOString(),
    app: '100-Day Growth Tracker',
    version: state.version,
    data: state,
  };
  return JSON.stringify(exportData, null, 2);
}

export interface ImportValidationResult {
  valid: boolean;
  errors: string[];
  preview?: {
    daysCount: number;
    checkedInCount: number;
    habitsCount: number;
    tasksCount: number;
    startDate: string;
    endDate: string;
  };
  parsedState?: AppState;
}

/**
 * Validates imported JSON string before applying.
 */
export function validateImportJson(jsonString: string): ImportValidationResult {
  const errors: string[] = [];

  try {
    const parsed = JSON.parse(jsonString);
    const state: AppState = parsed.data || parsed;

    if (!state || typeof state !== 'object') {
      return { valid: false, errors: ['Invalid JSON format or empty data'] };
    }

    if (!state.config || !state.config.startDate || !state.config.endDate) {
      errors.push('Missing challenge configuration or date range');
    }

    if (!Array.isArray(state.days)) {
      errors.push('Missing or invalid challenge days list');
    } else {
      if (state.days.length !== 100) {
        errors.push(`Challenge days count must be exactly 100 (found ${state.days.length})`);
      }

      // Check day numbers and dates
      const dayNums = new Set<number>();
      for (const d of state.days) {
        if (typeof d.dayNumber !== 'number' || d.dayNumber < 1 || d.dayNumber > 100) {
          errors.push(`Invalid day number: ${d.dayNumber}`);
          break;
        }
        if (dayNums.has(d.dayNumber)) {
          errors.push(`Duplicate day number found: ${d.dayNumber}`);
          break;
        }
        dayNums.add(d.dayNumber);

        if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date)) {
          errors.push(`Invalid date format for Day ${d.dayNumber}: ${d.date}`);
          break;
        }
      }
    }

    if (!Array.isArray(state.habits) || state.habits.length === 0) {
      errors.push('Missing habits list');
    }

    if (!Array.isArray(state.courses)) {
      errors.push('Missing courses list');
    }

    if (!Array.isArray(state.tasks)) {
      errors.push('Missing tasks list');
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    const checkedInCount = state.days.filter((d: ChallengeDay) => d.checkedIn).length;

    return {
      valid: true,
      errors: [],
      preview: {
        daysCount: state.days.length,
        checkedInCount,
        habitsCount: state.habits.length,
        tasksCount: state.tasks.length,
        startDate: state.config.startDate,
        endDate: state.config.endDate,
      },
      parsedState: state,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown JSON parse error';
    return { valid: false, errors: [`JSON parsing error: ${message}`] };
  }
}

/**
 * Verifies if state meets AppState requirements
 */
function isValidAppState(state: any): state is AppState {
  return (
    state &&
    typeof state === 'object' &&
    state.config &&
    Array.isArray(state.days) &&
    state.days.length === 100 &&
    Array.isArray(state.habits) &&
    Array.isArray(state.courses) &&
    Array.isArray(state.tasks)
  );
}
