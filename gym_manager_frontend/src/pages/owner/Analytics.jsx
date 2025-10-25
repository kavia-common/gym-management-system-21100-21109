import React from 'react';
import SimpleChart from '../../components/shared/SimpleChart';
import Card from '../../components/ui/Card';

/**
 * PUBLIC_INTERFACE
 * OwnerAnalytics - Basic analytics overview using a lightweight chart.
 */
export default function OwnerAnalytics() {
  const [series, setSeries] = React.useState([
    { label: 'Jan', value: 30 },
    { label: 'Feb', value: 45 },
    { label: 'Mar', value: 25 },
    { label: 'Apr', value: 60 },
  ]);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SimpleChart title="Monthly New Members" series={series} />
      <Card title="Notes">
        <div style={{ color: 'var(--color-text-muted)' }}>
          Replace with real analytics later. This placeholder is dependency-light and fast.
        </div>
      </Card>
    </div>
  );
}
