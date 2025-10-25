import React from 'react';
import Card from '../../components/ui/Card';

/**
 * Placeholder Member Dashboard page.
 * Replace with bookings, classes, and progress tracking.
 */
export default function MemberDashboard() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 style={{ marginTop: 0 }}>Member Dashboard</h2>
      <Card title="Welcome" subtitle="Quick access">
        <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
          Access your classes, bookings, and progress.
        </p>
      </Card>
    </div>
  );
}
