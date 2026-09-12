export type StudyGroup = 'treatment' | 'control';
export type ParticipantStatus = 'active' | 'completed' | 'withdrawn';
export type Gender = 'F' | 'M' | 'Other';

export interface Participant {
  participant_id: string;
  subject_id: string;
  study_group: StudyGroup;
  enrollment_date: string;
  status: ParticipantStatus;
  age: number;
  gender: Gender;
}

export interface ParticipantCreateInput {
  subject_id: string;
  study_group: StudyGroup;
  enrollment_date: string;
  status: ParticipantStatus;
  age: number;
  gender: Gender;
}

export interface Metrics {
  total_participants: number;
  active: number;
  completed: number;
  withdrawn: number;
  treatment: number;
  control: number;
  average_age: number | null;
}

export interface User {
  email: string;
  full_name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ApiError {
  detail: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
