// src/services/metricsService.ts
import { apiClient } from './apiClient';
import type { DailyActiveUsersMetric } from '../types/metrics';

type DailyActiveUsersRawResponse = {
  dates: string[];
  counts: number[];
};

export async function fetchDailyActiveUsers(): Promise<DailyActiveUsersMetric[]> {
  const response = await apiClient.get<DailyActiveUsersRawResponse>('/metrics/daily_active_users');
  const raw = response.data;

  if (!raw || !Array.isArray(raw.dates) || !Array.isArray(raw.counts)) {
    console.warn('[metricsService] Unexpected DAU response shape:', raw);
    return [];
  }
  const result: DailyActiveUsersMetric[] = raw.dates.map((date, index) => ({
    date,
    count: raw.counts[index] ?? 0,
  }));

  return result;
}
