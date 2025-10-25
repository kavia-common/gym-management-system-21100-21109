import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';

export default function TrainerDashboard() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 style={{ marginTop: 0 }}>Trainer Dashboard</h2>
      <Card title="Today" subtitle="Your schedule">
        <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
          View your classes, clients, and training plans.
        </p>
      </Card>
      <Card title="Quick Links" subtitle="Go to">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/trainer/timetable" className="btn btn-secondary">Timetable</Link>
          <Link to="/trainer/clients" className="btn btn-secondary">Clients</Link>
          <Link to="/trainer/programs" className="btn btn-secondary">Programs</Link>
        </div>
      </Card>
    </div>
  );
}
