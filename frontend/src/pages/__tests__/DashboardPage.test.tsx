import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from '../DashboardPage';

const mockMetrics = {
  total_participants: 24,
  active: 14,
  completed: 6,
  withdrawn: 4,
  treatment: 12,
  control: 12,
  average_age: 47.8,
};

const mockParticipants = [
  {
    participant_id: '11111111-1111-1111-1111-111111111111',
    subject_id: 'P001',
    study_group: 'treatment',
    enrollment_date: '2024-01-15',
    status: 'active',
    age: 45,
    gender: 'F',
  },
];

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially and then shows real metrics from API', async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/metrics')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockMetrics,
        } as Response);
      }
      if (url.includes('/api/participants')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockParticipants,
        } as Response);
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Calculating real-time trial metrics/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Trial Operations Overview')).toBeInTheDocument();
      expect(screen.getByText('Total Cohort')).toBeInTheDocument();
      expect(screen.getByText('24')).toBeInTheDocument();
      expect(screen.getByText('47.8 yrs')).toBeInTheDocument();
      expect(screen.getByText('P001')).toBeInTheDocument();
    });
  });

  it('renders error message when API call fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Unable to connect to the server/i)).toBeInTheDocument();
    });
  });
});
