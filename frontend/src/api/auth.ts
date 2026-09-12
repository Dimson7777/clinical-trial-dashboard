import { apiClient } from './client';
import { AuthResponse, User } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMeApi(): Promise<User> {
  return apiClient<User>('/api/auth/me', {
    method: 'GET',
  });
}
