import React from 'react';
import Card from '../../components/ui/Card';
import SimpleTable from '../../components/shared/SimpleTable';
import Button from '../../components/ui/Button';

/**
 * PUBLIC_INTERFACE
 * MemberBookings - Show and manage member's class bookings.
 */
export default function MemberBookings() {
  const [items, setItems] = React.useState([
    { id: 'b1', title: 'HIIT', date: '2025-01-06', status: 'confirmed' },
    { id: 'b2', title: 'Yoga', date: '2025-01-08', status: 'waitlist' },
  ]);

  const columns = [
    { key: 'title', label: 'Class' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
  ];

  const actions = (row) => (
    <Button size="sm" variant="secondary" onClick={() => alert(`Cancel ${row.title} (demo)`)}>Cancel</Button>
  );

  return (
    <Card title="My Bookings" subtitle="Upcoming classes">
      <SimpleTable columns={columns} data={items} actions={actions} />
    </Card>
  );
}
