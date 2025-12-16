// src/services/metricsService.ts
import { apiClient } from './apiClient';
import type {
  CountryMetrics,
  DateCounts,
  EndpointErrorRate,
  EndpointResponseTimes,
  FeatureUsageShare,
  HealthResponse,
  HourCounts,
  QuoteObject,
} from '../types/metrics';

export type TableModel = {
  title: string;
  headers: string[];
  rows: Array<Array<string | number>>;
  summary?: Array<{ label: string; value: string | number; subLabel?: string }>;
};


export async function fetchDailyActiveUsersRaw(): Promise<DateCounts> {
  return (await apiClient.get<DateCounts>('/metrics/daily_active_users')).data;
}

export async function fetchApiRequestsRaw(): Promise<HourCounts> {
  return (await apiClient.get<HourCounts>('/metrics/api_requests')).data;
}

export async function fetchNewSignupsRaw(): Promise<DateCounts> {
  return (await apiClient.get<DateCounts>('/metrics/new_signups')).data;
}

export async function fetchEndpointErrorRaw(): Promise<EndpointErrorRate> {
  return (await apiClient.get<EndpointErrorRate>('/metrics/endpoint_error')).data;
}

export async function fetchFeatureUsageRaw(): Promise<FeatureUsageShare> {
  return (await apiClient.get<FeatureUsageShare>('/metrics/feature_usage')).data;
}

export async function fetchCountryMetricsRaw(): Promise<CountryMetrics> {
  return (await apiClient.get<CountryMetrics>('/metrics/country_metrics')).data;
}

export async function fetchResponseTimesRaw(): Promise<EndpointResponseTimes> {
  return (await apiClient.get<EndpointResponseTimes>('/metrics/response_times')).data;
}

export async function fetchHealth(): Promise<HealthResponse> {
  return (await apiClient.get<HealthResponse>('/health')).data;
}

export async function fetchQuotes(n: number): Promise<QuoteObject[]> {
  return (await apiClient.get<QuoteObject[]>('/quotes', { params: { n } })).data;
}



export function toDateCountsTable(title: string, data: DateCounts): TableModel {
  const rows = (data.dates ?? []).map((d, i) => [d, data.counts?.[i] ?? 0]);
  const latest = rows.length ? (rows[rows.length - 1][1] as number) : 0;
  const total = (data.counts ?? []).reduce((s, n) => s + n, 0);

  return {
    title,
    headers: ['Date', 'Count'],
    rows,
    summary: [
      { label: 'Latest', value: latest, subLabel: 'Most recent day' },
      { label: 'Total (range)', value: total, subLabel: 'Sum over loaded days' },
      { label: 'Days loaded', value: rows.length },
    ],
  };
}

export function toHourCountsTable(title: string, data: HourCounts): TableModel {
  const rows = (data.hours ?? []).map((h, i) => [h, data.counts?.[i] ?? 0]);
  const total = (data.counts ?? []).reduce((s, n) => s + n, 0);

  return {
    title,
    headers: ['Hour', 'Requests'],
    rows,
    summary: [
      { label: 'Total (24h)', value: total },
      { label: 'Hours', value: rows.length },
    ],
  };
}

export function toEndpointErrorTable(title: string, data: EndpointErrorRate): TableModel {
  const rows = (data.endpoint ?? []).map((e, i) => [e, data.counts?.[i] ?? 0]);
  return {
    title,
    headers: ['Endpoint', 'Errors / hour'],
    rows,
  };
}

export function toFeatureUsageTable(title: string, data: FeatureUsageShare): TableModel {
  const rows = (data.feature ?? []).map((f, i) => [
    f,
    Math.round(((data.fraction?.[i] ?? 0) * 100) * 100) / 100, // %
  ]);
  return {
    title,
    headers: ['Feature', 'Usage (%)'],
    rows,
  };
}

export function toCountryMetricsTable(title: string, data: CountryMetrics): TableModel {
  const rows = (data.country ?? []).map((c, i) => [c, data.counts?.[i] ?? 0]);
  return {
    title,
    headers: ['Country', 'Users'],
    rows,
  };
}

export function toResponseTimesTable(title: string, data: EndpointResponseTimes): TableModel {

  const rows: Array<Array<string | number>> = [];

  (data.endpoint ?? []).forEach((ep, i) => {
    const rt = data.response_time?.[i];
    const bins = rt?.bins_left_edge ?? [];
    const counts = rt?.counts ?? [];

    for (let j = 0; j < Math.max(bins.length, counts.length); j++) {
      rows.push([ep, bins[j] ?? 0, counts[j] ?? 0]);
    }
  });

  return {
    title,
    headers: ['Endpoint', 'Bin left edge', 'Count'],
    rows,
  };
}

export function toQuotesTable(quotes: QuoteObject[], n: number): TableModel {
  return {
    title: `Quotes (n=${n})`,
    headers: ['Author', 'Quote'],
    rows: quotes.map((q) => [q.author, q.quote]),
  };
}

export function toHealthTable(health: HealthResponse): TableModel {
  return {
    title: 'Health',
    headers: ['Key', 'Value'],
    rows: Object.entries(health).map(([k, v]) => [k, v]),
  };
}
