import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

/**
 * Placeholder Owner Dashboard page.
 * Replace with real metrics, management panels, and actions.
 */
export default function OwnerDashboard() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 style={{ marginTop: 0 }}>Owner Dashboard</h2>
      <Card
        title="Overview"
        subtitle="High level metrics"
        action={<Button variant="secondary">Add Widget</Button>}
      >
        <div style={{ color: 'var(--color-text-muted)' }}>
          Manage your gym operations, analytics, and members.
        </div>
      </Card>
    </div>
  );
}
