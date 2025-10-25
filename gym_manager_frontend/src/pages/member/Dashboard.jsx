import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';

export default function MemberDashboard() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 style={{ marginTop: 0 }}>Member Dashboard</h2>
      <Card title="Welcome" subtitle="Quick access">
        <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
          Access your classes, bookings, and progress.
        </p>
      </Card>
      <Card title="Quick Links" subtitle="Go to">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/member/bookings" className="btn btn-secondary">Bookings</Link>
          <Link to="/member/classes" className="btn btn-secondary">Classes</Link>
          <Link to="/member/profile" className="btn btn-secondary">Profile</Link>
        </div>
      </Card>
    </div>
  );
}
