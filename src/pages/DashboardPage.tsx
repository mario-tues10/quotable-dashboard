import { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "../components/Layout";
import { Tabs } from "../components/Tabs";
import { SimpleTable } from "../components/SimpleTable";
import { MetricCard } from "../components/MetricCard";
import { ErrorAlert } from "../components/ErrorAlert";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { setAuthToken } from "../services/apiClient";

import {
  fetchApiRequestsRaw,
  fetchCountryMetricsRaw,
  fetchDailyActiveUsersRaw,
  fetchEndpointErrorRaw,
  fetchFeatureUsageRaw,
  fetchHealth,
  fetchNewSignupsRaw,
  fetchQuotes,
  fetchResponseTimesRaw,
  toCountryMetricsTable,
  toDateCountsTable,
  toEndpointErrorTable,
  toFeatureUsageTable,
  toHealthTable,
  toHourCountsTable,
  toQuotesTable,
  toResponseTimesTable,
  type TableModel,
} from "../services/metricsService";

type TabId =
  | "dau"
  | "api_requests"
  | "new_signups"
  | "endpoint_error"
  | "feature_usage"
  | "country_metrics"
  | "response_times"
  | "quotes"
  | "health";

export function DashboardPage() {
  const { token } = useAuth();

  const tabs = useMemo(
    () => [
      { id: "dau", label: "DAU" },
      { id: "api_requests", label: "API Requests" },
      { id: "new_signups", label: "New Signups" },
      { id: "endpoint_error", label: "Endpoint Error" },
      { id: "feature_usage", label: "Feature Usage" },
      { id: "country_metrics", label: "Country Metrics" },
      { id: "response_times", label: "Response Times" },
      { id: "quotes", label: "Quotes" },
      { id: "health", label: "Health" },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState<TabId>("dau");
  const [model, setModel] = useState<TableModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache tab results to avoid refetch on switching tabs
  const cacheRef = useRef<Record<string, TableModel>>({});

  // Prevent StrictMode dev double-fetch from causing weird UI mismatches
  const fetchedOnceRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!token) return;

    // Make sure API client has the auth token
    setAuthToken(token);

    const load = async () => {
      setLoading(true);
      setError(null);

      // Use cached result if we already loaded this tab
      const cached = cacheRef.current[activeTab];
      if (cached) {
        setModel(cached);
        setLoading(false);
        return;
      }

      // StrictMode guard (dev) per-tab
      if (fetchedOnceRef.current[activeTab]) {
        setLoading(false);
        return;
      }
      fetchedOnceRef.current[activeTab] = true;

      try {
        let next: TableModel;

        switch (activeTab) {
          case "dau": {
            const raw = await fetchDailyActiveUsersRaw();
            next = toDateCountsTable("Daily Active Users (last 30 days)", raw);
            break;
          }
          case "api_requests": {
            const raw = await fetchApiRequestsRaw();
            next = toHourCountsTable("API Requests (last 24 hours)", raw);
            break;
          }
          case "new_signups": {
            const raw = await fetchNewSignupsRaw();
            next = toDateCountsTable("New Signups (last week)", raw);
            break;
          }
          case "endpoint_error": {
            const raw = await fetchEndpointErrorRaw();
            next = toEndpointErrorTable("Error Rate by Endpoint", raw);
            break;
          }
          case "feature_usage": {
            const raw = await fetchFeatureUsageRaw();
            next = toFeatureUsageTable("Feature Usage", raw);
            break;
          }
          case "country_metrics": {
            const raw = await fetchCountryMetricsRaw();
            next = toCountryMetricsTable("Users by Country", raw);
            break;
          }
          case "response_times": {
            const raw = await fetchResponseTimesRaw();
            next = toResponseTimesTable("Response Times (past 3 days)", raw);
            break;
          }
          case "quotes": {
            const n = 10;
            const quotes = await fetchQuotes(n);
            next = toQuotesTable(quotes, n);
            break;
          }
          case "health": {
            try {
              const health = await fetchHealth();
              next = toHealthTable(health);
            } catch {
              next = {
                title: "Health",
                headers: ["Info"],
                rows: [["Health endpoint not available on this deployment"]],
              };
            }
            break;
          }

          default:
            next = { title: "Unknown", headers: [], rows: [] };
        }

        cacheRef.current[activeTab] = next;
        setModel(next);
      } catch (err: any) {
        console.error("[Dashboard] load error:", err);
        setModel(null);
        setError(err?.message ?? "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, activeTab]);

  return (
    <Layout title="Quotable Dashboard">
      <Tabs
        tabs={tabs}
        active={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
      />

      {loading && (
        <div className="dashboard-loading">
          <LoadingSpinner />
        </div>
      )}

      {error && <ErrorAlert message={error} />}

      {!loading && !error && model?.summary && model.summary.length > 0 && (
        <section className="metrics-cards">
          {model.summary.map((s) => (
            <MetricCard
              key={s.label}
              label={s.label}
              value={s.value}
              subLabel={s.subLabel}
            />
          ))}
        </section>
      )}

      {!loading && !error && model && (
        <section>
          <SimpleTable
            title={model.title}
            headers={model.headers}
            rows={model.rows}
          />
        </section>
      )}
    </Layout>
  );
}
