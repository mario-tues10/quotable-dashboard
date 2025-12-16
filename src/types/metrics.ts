export type DateCounts = {
  dates: string[];
  counts: number[];
};

export type HourCounts = {
  hours: string[];
  counts: number[];
};

export type EndpointErrorRate = {
  endpoint: string[];
  counts: number[]; // float
};

export type FeatureUsageShare = {
  feature: string[];
  fraction: number[]; // float
};

export type CountryMetrics = {
  country: string[];
  counts: number[];
};

export type ResponseTimes = {
  bins_left_edge: number[];
  counts: number[];
};

export type EndpointResponseTimes = {
  endpoint: string[];
  response_time: ResponseTimes[];
};

export type QuoteObject = {
  author: string;
  quote: string;
};

export type HealthResponse = Record<string, string>;
