import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ParticipantsPage } from '../ParticipantsPage';

const mockParticipants = [
  {
    participant_id: '11111111-1111-1111-1111-111111111111',
    subject_id: 'P001',
    study_group: 'treatment' as const,
    enrollment_date: '2024-01-15',
    status: 'active' as const,
    age: 45,
    gender: 'F' as const,
  },
  {
    participant_id: '22222222-2222-2222-2222-222222222222',
    subject_id: 'P002',
    study_group: 'control' as const,
    enrollment_date: '2024-01-16',
    status: 'withdrawn' as const,
    age: 52,
    gender: 'M' as const,
  },
];

describe('ParticipantsPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders participant list from API and handles search filtering', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockParticipants,
    } as Response);

    render(
      <MemoryRouter>
        <ParticipantsPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading participant registry/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Trial Participants')).toBeInTheDocument();
      expect(screen.getByText('P001')).toBeInTheDocument();
      expect(screen.getByText('P002')).toBeInTheDocument();
    });

    // Search filter
    const searchInput = screen.getByPlaceholderText(/Search by Subject ID/i);
    fireEvent.change(searchInput, { target: { value: 'P001' } });

    expect(screen.getByText('P001')).toBeInTheDocument();
    expect(screen.queryByText('P002')).not.toBeInTheDocument();
  });

  it('opens participant details modal when View is clicked', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockParticipants,
    } as Response);

    render(
      <MemoryRouter>
        <ParticipantsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('P001')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Participant P001')).toBeInTheDocument();
      expect(screen.getByText('11111111-1111-1111-1111-111111111111')).toBeInTheDocument();
    });
  });
});
