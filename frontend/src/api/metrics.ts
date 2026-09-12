import { apiClient } from './client';
import { Metrics } from '../types';

export async function getMetricsApi(): Promise<Metrics> {
  return apiClient<Metrics>('/api/metrics');
}
