import { apiClient } from './client';
import { Participant, ParticipantCreateInput } from '../types';

export interface ParticipantFilters {
  status?: string;
  study_group?: string;
}

export async function getParticipantsApi(filters?: ParticipantFilters): Promise<Participant[]> {
  const params = new URLSearchParams();
  if (filters?.status) {
    params.append('status', filters.status);
  }
  if (filters?.study_group) {
    params.append('study_group', filters.study_group);
  }

  const queryString = params.toString();
  const endpoint = queryString ? `/api/participants?${queryString}` : '/api/participants';
  return apiClient<Participant[]>(endpoint);
}

export async function getParticipantApi(id: string): Promise<Participant> {
  return apiClient<Participant>(`/api/participants/${id}`);
}

export async function createParticipantApi(input: ParticipantCreateInput): Promise<Participant> {
  return apiClient<Participant>('/api/participants', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
