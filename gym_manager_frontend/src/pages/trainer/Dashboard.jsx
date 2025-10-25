import React from 'react';
import Card from '../../components/ui/Card';

/**
 * Placeholder Trainer Dashboard page.
 * Replace with schedule, class management, and client views.
 */
export default function TrainerDashboard() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 style={{ marginTop: 0 }}>Trainer Dashboard</h2>
      <Card title="Today" subtitle="Your schedule">
        <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
          View your classes, clients, and training plans.
        </p>
      </Card>
    </div>
  );
}
