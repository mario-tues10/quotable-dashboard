import React, { useEffect, useState, useRef } from "react";
import { Layout } from "../components/Layout";
import { MetricsGrid } from "../components/MetricsGrid";
import { MetricCard } from "../components/MetricCard";
import { ErrorAlert } from "../components/ErrorAlert";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { fetchDailyActiveUsers } from "../services/metricsService";
import { setAuthToken } from "../services/apiClient";
import type { DailyActiveUsersMetric } from "../types/metrics";

export const DashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [dailyActiveUsers, setDailyActiveUsers] = useState<
    DailyActiveUsersMetric[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!token) return;
    if (hasFetchedRef.current) return; // prevent double fetch

    hasFetchedRef.current = true;
    setAuthToken(token);

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const dau = await fetchDailyActiveUsers();
        setDailyActiveUsers(dau);
      } catch (err: any) {
        console.error("[Dashboard] metrics fetch error:", err);
        setDailyActiveUsers([]);
        setError(err?.message ?? "Failed to load metrics");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const hasData = dailyActiveUsers.length > 0;

  const latestCount = hasData
    ? dailyActiveUsers[dailyActiveUsers.length - 1].count
    : 0;

  const totalUsers = hasData
    ? dailyActiveUsers.reduce((sum, row) => sum + row.count, 0)
    : 0;

  return (
    <Layout title="Quotable Dashboard">
      {loading && (
        <div className="dashboard-loading">
          <LoadingSpinner />
        </div>
      )}

      {error && <ErrorAlert message={error} />}

      {!loading && (
        <>
          <section className="metrics-cards">
            <MetricCard
              label="Latest DAU"
              value={latestCount}
              subLabel="Most recent day"
            />
            <MetricCard
              label="Total DAU (range)"
              value={totalUsers}
              subLabel="Sum over loaded days"
            />
            <MetricCard
              label="Days loaded"
              value={hasData ? dailyActiveUsers.length : 0}
            />
          </section>

          <section>
            <MetricsGrid dailyActiveUsers={dailyActiveUsers} />
          </section>
        </>
      )}
    </Layout>
  );
};
