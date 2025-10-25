import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SimpleChart from '../../components/shared/SimpleChart';

export default function OwnerDashboard() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 style={{ marginTop: 0 }}>Owner Dashboard</h2>

      <SimpleChart
        title="Active Members (last 4 months)"
        series={[
          { label: 'Jan', value: 120 },
          { label: 'Feb', value: 138 },
          { label: 'Mar', value: 132 },
          { label: 'Apr', value: 150 },
        ]}
      />

      <Card
        title="Quick Links"
        subtitle="Manage core resources"
        action={<Button as="span" variant="secondary">Customize</Button>}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/owner/members" className="btn btn-secondary">Members</Link>
          <Link to="/owner/classes" className="btn btn-secondary">Classes</Link>
          <Link to="/owner/trainers" className="btn btn-secondary">Trainers</Link>
          <Link to="/owner/payments" className="btn btn-secondary">Payments</Link>
          <Link to="/owner/analytics" className="btn btn-secondary">Analytics</Link>
        </div>
      </Card>
    </div>
  );
}
