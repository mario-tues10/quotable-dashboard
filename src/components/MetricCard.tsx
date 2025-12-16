import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, subLabel }) => {
  return (
    <div className="card metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {subLabel && <div className="metric-sublabel">{subLabel}</div>}
    </div>
  );
};
