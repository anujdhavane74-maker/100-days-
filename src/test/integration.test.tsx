import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { App } from '../App';

describe('App Integration and End-to-End User Flows', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders dashboard with lap counter, streak, and motivation card', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/GROWTH TRACKER/i)).toBeTruthy();
    });

    expect(screen.getByText(/100-DAY TELEMETRY/i)).toBeTruthy();
    expect(screen.getByText(/CURRENT STREAK/i)).toBeTruthy();
    expect(screen.getByText(/100-DAY PROGRESS/i)).toBeTruthy();
    expect(screen.getByText(/SKILL HOURS/i)).toBeTruthy();
    expect(screen.getByText(/ACADEMIC HOURS/i)).toBeTruthy();
  });

  it('navigates to Daily Check-in when action button is clicked', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/START TODAY’S CHECK-IN/i)).toBeTruthy();
    });

    const startBtn = screen.getByText(/START TODAY’S CHECK-IN/i);
    fireEvent.click(startBtn);

    await waitFor(() => {
      expect(screen.getByText(/RACE STRATEGY & DAY MODE/i)).toBeTruthy();
      expect(screen.getByText(/PRIMARY MISSION & CONCRETE DELIVERABLE/i)).toBeTruthy();
      expect(screen.getByText(/DAILY HABITS & PERSONAL ROUTINE/i)).toBeTruthy();
    });
  });

  it('navigates through primary views cleanly', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText(/100-Day/i).length).toBeGreaterThan(0);
    });

    // 100-Day Board button
    const boardBtns = screen.getAllByRole('button', { name: /100-day/i });
    if (boardBtns.length > 0) {
      fireEvent.click(boardBtns[0]);
      expect(screen.getByText(/100-LAP TELEMETRY MATRIX/i)).toBeTruthy();
    }

    // Habits button
    const habitBtns = screen.getAllByRole('button', { name: /habits/i });
    if (habitBtns.length > 0) {
      fireEvent.click(habitBtns[0]);
      expect(screen.getByText(/Daily Habits System/i)).toBeTruthy();
    }

    // Skills & Tasks
    const skillBtns = screen.getAllByRole('button', { name: /skills/i });
    if (skillBtns.length > 0) {
      fireEvent.click(skillBtns[0]);
      expect(screen.getByText(/Course Curriculum & Telemetry/i)).toBeTruthy();
    }

    // Analytics
    const analyticsBtns = screen.getAllByRole('button', { name: /analytics/i });
    if (analyticsBtns.length > 0) {
      fireEvent.click(analyticsBtns[0]);
      expect(screen.getByText(/Systematic Analytics Board/i)).toBeTruthy();
    }

    // Timetable & Guide
    const timetableBtns = screen.getAllByRole('button', { name: /timetable/i });
    if (timetableBtns.length > 0) {
      fireEvent.click(timetableBtns[0]);
      expect(screen.getByText(/Source: Zeal FY B.Tech AI & DS/i)).toBeTruthy();
    }

    // Data / Backup
    const dataBtns = screen.getAllByRole('button', { name: /data/i });
    if (dataBtns.length > 0) {
      fireEvent.click(dataBtns[0]);
      expect(screen.getByText(/Data Management & Time Travel/i)).toBeTruthy();
      expect(screen.getByText(/EXPORT COMPLETE JSON BACKUP/i)).toBeTruthy();
    }
  });
});
