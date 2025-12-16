// src/components/MetricsGrid.tsx
import React from 'react';
import type { DailyActiveUsersMetric } from '../types/metrics';

interface MetricsGridProps {
  dailyActiveUsers: DailyActiveUsersMetric[] | null | undefined;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ dailyActiveUsers }) => {
  // Always work with a safe local array
  const rows: DailyActiveUsersMetric[] = Array.isArray(dailyActiveUsers)
    ? dailyActiveUsers
    : [];

  if (rows.length === 0) {
    return (
      <div className="card">
        <h2>Daily Active Users</h2>
        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.75rem' }}>
          No data available.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Daily Active Users</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Active Users</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.date}>
                <td>{row.date}</td>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
